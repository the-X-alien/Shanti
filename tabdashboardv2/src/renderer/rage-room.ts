const EMOJIS = ["\u{1F4F1}", "\u{1F4BB}", "\u{1F4DA}", "\u{2615}", "\u{1F5A5}", "\u{1F4B0}", "\u{1F3B5}", "\u{1F4AC}", "\u{1F4DD}", "\u{1F3E0}", "\u{1F48E}", "\u{1F3AF}", "\u{1F3AE}", "\u{1F4F7}", "\u{1F3A8}"];
const COLORS = ["#FF5252", "#FFB74D", "#FFD54F", "#69F0AE", "#40C4FF", "#7C4DFF", "#E040FB"];

const arena = document.getElementById("arena")!;
const resetBtn = document.getElementById("reset-btn")!;

function random(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function spawnObjects(): void {
  arena.querySelectorAll(".object, .debris").forEach(el => el.remove());

  const count = 8 + Math.floor(Math.random() * 7);
  const w = arena.clientWidth;
  const h = arena.clientHeight;

  for (let i = 0; i < count; i++) {
    const obj = document.createElement("div");
    obj.className = "object";
    obj.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    obj.style.left = `${random(40, w - 110)}px`;
    obj.style.top = `${random(40, h - 110)}px`;
    obj.style.borderColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    obj.addEventListener("click", () => breakObject(obj));
    arena.appendChild(obj);
  }
}

function breakObject(obj: HTMLElement): void {
  if (obj.classList.contains("breaking")) return;
  obj.classList.add("breaking");

  // Spawn debris fragments
  const rect = obj.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  for (let i = 0; i < 8; i++) {
    const debris = document.createElement("div");
    debris.className = "debris";
    const angle = (i / 8) * Math.PI * 2;
    const dist = 40 + Math.random() * 60;
    debris.style.setProperty("--dx", `${Math.cos(angle) * dist}px`);
    debris.style.setProperty("--dy", `${Math.sin(angle) * dist}px`);
    debris.style.left = `${cx - 6}px`;
    debris.style.top = `${cy - 6}px`;
    debris.style.background = COLORS[Math.floor(Math.random() * COLORS.length)];
    arena.appendChild(debris);
    setTimeout(() => debris.remove(), 1000);
  }

  setTimeout(() => {
    if (obj.parentNode) obj.remove();
  }, 600);
}

resetBtn.addEventListener("click", spawnObjects);

window.addEventListener("resize", () => {
  // Reposition objects to stay within bounds on resize
  const w = arena.clientWidth;
  const h = arena.clientHeight;
  document.querySelectorAll(".object").forEach(el => {
    const e = el as HTMLElement;
    const left = parseFloat(e.style.left);
    const top = parseFloat(e.style.top);
    if (left + 110 > w) e.style.left = `${w - 120}px`;
    if (top + 110 > h) e.style.top = `${h - 120}px`;
  });
});

spawnObjects();
