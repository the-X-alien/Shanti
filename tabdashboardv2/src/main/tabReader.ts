import { execFile } from "child_process";

export interface TabSnapshot {
  timestamp: number;
  browser: "chrome" | "firefox" | "safari" | "edge" | "other";
  tabTitle: string;
}

type BrowserName = TabSnapshot["browser"];

const BROWSER_MAP: Record<string, BrowserName> = {
  "google chrome": "chrome",
  "chrome": "chrome",
  "chromium": "chrome",
  "firefox": "firefox",
  "mozilla firefox": "firefox",
  "safari": "safari",
  "microsoft edge": "edge",
  "msedge": "edge",
};

function detectBrowser(ownerName: string): BrowserName | null {
  const lower = ownerName.toLowerCase();
  for (const [key, value] of Object.entries(BROWSER_MAP)) {
    if (lower.includes(key)) return value;
  }
  return null;
}

function extractTabTitle(windowTitle: string): string {
  // Browsers suffix their name, sometimes with a profile name:
  //   "Tab - Google Chrome"
  //   "Tab - Google Chrome - ProfileName"
  const patterns: RegExp[] = [
    /(?: - Google Chrome(?: - .+)?)$/,
    /(?: — Mozilla Firefox(?: - .+)?)$/,
    /(?: - Mozilla Firefox(?: - .+)?)$/,
    /(?: - Safari(?: - .+)?)$/,
    /(?: - Microsoft Edge(?: - .+)?)$/,
    /(?: - Pinned Tab)$/,
    /(?: - Pinned)$/,
  ];

  let result = windowTitle.trim();
  let changed = true;
  while (changed) {
    changed = false;
    for (const pattern of patterns) {
      const match = result.match(pattern);
      if (match) {
        result = result.slice(0, -match[0].length).trim();
        changed = true;
        break;
      }
    }
  }

  return result;
}

function getActiveWindowMac(): Promise<{ owner: string; title: string } | null> {
  const script = `
tell application "System Events"
  set frontProcess to first application process whose frontmost is true
  set appName to name of frontProcess
  try
    set winTitle to title of first window of frontProcess
  on error
    set winTitle to ""
  end try
end tell
return appName & "|||" & winTitle
`;
  return new Promise((resolve) => {
    execFile("/usr/bin/osascript", ["-e", script], { timeout: 3000 }, (err, stdout) => {
      if (err || !stdout) { resolve(null); return; }
      const parts = stdout.trim().split("|||");
      if (parts.length !== 2) { resolve(null); return; }
      resolve({ owner: parts[0], title: parts[1] });
    });
  });
}

function getActiveWindowWindows(): Promise<{ owner: string; title: string } | null> {
  const script = [
    "Add-Type @\"",
    "using System; using System.Runtime.InteropServices; using System.Text;",
    "public class Win32 {",
    "  [DllImport(\"user32.dll\")] public static extern IntPtr GetForegroundWindow();",
    "  [DllImport(\"user32.dll\")] public static extern int GetWindowText(IntPtr h, StringBuilder s, int n);",
    "  [DllImport(\"user32.dll\")] public static extern uint GetWindowThreadProcessId(IntPtr h, out uint pid);",
    "}",
    "\"@",
    "$hwnd = [Win32]::GetForegroundWindow()",
    "$sb = New-Object System.Text.StringBuilder 512",
    "[Win32]::GetWindowText($hwnd, $sb, 512) | Out-Null",
    "$title = $sb.ToString()",
    "$pid2 = 0",
    "[Win32]::GetWindowThreadProcessId($hwnd, [ref]$pid2) | Out-Null",
    "$proc = Get-Process -Id $pid2 -ErrorAction SilentlyContinue",
    "$name = if ($proc) { $proc.Name } else { '' }",
    "Write-Output ($name + '|||' + $title)",
  ].join("; ");
  return new Promise((resolve) => {
    execFile("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", script], { timeout: 5000 }, (err, stdout) => {
      if (err || !stdout) { resolve(null); return; }
      const parts = stdout.trim().split("|||");
      if (parts.length !== 2) { resolve(null); return; }
      resolve({ owner: parts[0], title: parts[1] });
    });
  });
}

function getActiveWindow(): Promise<{ owner: string; title: string } | null> {
  return process.platform === "win32" ? getActiveWindowWindows() : getActiveWindowMac();
}

export type TabUpdateCallback = (snapshot: TabSnapshot) => void;
export type PermissionCallback = (ok: boolean) => void;
export type ActivityCallback = () => void;

export class TabReader {
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private lastTitle = "";
  private permissionOk = false;

  start(onTab: TabUpdateCallback, onPermission: PermissionCallback, onActivity: ActivityCallback, pollMs = 2000): void {
    const poll = async (): Promise<void> => {
      try {
        const win = await getActiveWindow();

        if (!win) {
          if (this.permissionOk) {
            this.permissionOk = false;
            onPermission(false);
          }
          return;
        }

        if (!this.permissionOk) {
          this.permissionOk = true;
          onPermission(true);
        }

        if (!win.title) return;

        const browser = detectBrowser(win.owner);
        if (!browser) return;

        // Let listeners know a browser tab is active (even if unchanged)
        onActivity();

        const tabTitle = extractTabTitle(win.title);
        if (!tabTitle || tabTitle === this.lastTitle) return;
        this.lastTitle = tabTitle;

        onTab({ timestamp: Date.now(), browser, tabTitle });
      } catch {
        if (this.permissionOk) {
          this.permissionOk = false;
          onPermission(false);
        }
      }
    };

    void poll();
    this.intervalId = setInterval(() => void poll(), pollMs);
  }

  stop(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
