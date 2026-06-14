#!/bin/bash
# Shanti — Tab Viewer installer (macOS)
# Clones the repo, builds the desktop app, and launches it as a menu bar app.
# Usage: curl -fsSL https://mh3-project.vercel.app/install.sh | sh

set -e

REPO="https://github.com/the-X-alien/mh3-project.git"
APP_DIR="$HOME/Library/Application Support/Shanti"
LAUNCH_SCRIPT="$HOME/.local/bin/shanti"

say()  { printf "  \033[96m%s\033[0m\n" "$1"; }
ok()   { printf "  \033[32m✓ %s\033[0m\n" "$1"; }
fail() { printf "  \033[31m✗ %s\033[0m\n" "$1"; exit 1; }

echo ""
echo "  🙏 Shanti — Tab Viewer"
echo ""

# ── macOS only ──────────────────────────────────────────────────
[ "$(uname -s)" = "Darwin" ] || fail "This installer supports macOS only."

# ── Prerequisites ───────────────────────────────────────────────
if ! command -v git &>/dev/null; then
  say "Git not found. Install Xcode Command Line Tools? (y/n)"
  read -r ans
  [ "$ans" = "y" ] && xcode-select --install || fail "Git is required. Install it and re-run."
fi

if ! command -v node &>/dev/null; then
  fail "Node.js 18+ is required. Install it from https://nodejs.org and re-run."
fi

NODE_MAJOR=$(node -e "process.stdout.write(process.versions.node.split('.')[0])")
[ "$NODE_MAJOR" -ge 18 ] 2>/dev/null || fail "Node.js 18+ required (found $(node -v)). Please upgrade."

# ── Fetch source ─────────────────────────────────────────────────
if [ -d "$APP_DIR/.git" ]; then
  say "Updating existing install..."
  git -C "$APP_DIR" fetch --depth 1 origin main
  git -C "$APP_DIR" reset --hard origin/main
else
  say "Cloning Shanti..."
  rm -rf "$APP_DIR"
  git clone --depth 1 "$REPO" "$APP_DIR"
fi

cd "$APP_DIR/tabdashboardv2"

# ── Build ────────────────────────────────────────────────────────
say "Installing dependencies (this may take a minute)..."
npm install --no-audit --no-fund --silent

say "Building..."
npm run build

# ── Launcher script ──────────────────────────────────────────────
mkdir -p "$(dirname "$LAUNCH_SCRIPT")"
cat > "$LAUNCH_SCRIPT" <<'LAUNCHER'
#!/bin/bash
APP_DIR="$HOME/Library/Application Support/Shanti/tabdashboardv2"
cd "$APP_DIR"
exec npx electron --no-sandbox . "$@" &>/dev/null &
LAUNCHER
chmod +x "$LAUNCH_SCRIPT"

# Also create an .app wrapper so it shows in Spotlight / Applications
APP_BUNDLE="$HOME/Applications/Shanti.app"
mkdir -p "$APP_BUNDLE/Contents/MacOS"
cat > "$APP_BUNDLE/Contents/MacOS/Shanti" <<APPSCRIPT
#!/bin/bash
APP_DIR="\$HOME/Library/Application Support/Shanti/tabdashboardv2"
cd "\$APP_DIR"
exec npx electron --no-sandbox . &>/dev/null &
APPSCRIPT
chmod +x "$APP_BUNDLE/Contents/MacOS/Shanti"

cat > "$APP_BUNDLE/Contents/Info.plist" <<'PLIST'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>CFBundleName</key><string>Shanti</string>
  <key>CFBundleDisplayName</key><string>Shanti</string>
  <key>CFBundleIdentifier</key><string>com.shanti.tabviewer</string>
  <key>CFBundleVersion</key><string>1.0</string>
  <key>CFBundleExecutable</key><string>Shanti</string>
  <key>CFBundlePackageType</key><string>APPL</string>
  <key>LSUIElement</key><true/>
</dict>
</plist>
PLIST

# ── Launch ───────────────────────────────────────────────────────
say "Launching Shanti..."
cd "$APP_DIR/tabdashboardv2"
npx electron --no-sandbox . &>/dev/null &

echo ""
ok "Shanti installed and running!"
echo ""
echo "  Look for 🙏 in your menu bar."
echo "  To relaunch: open ~/Applications/Shanti.app"
echo "            or run: shanti  (after restarting your terminal)"
echo ""
