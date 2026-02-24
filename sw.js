/* ================= ELEMENTS ================= */
const d = document.getElementById("display");
const vibe = document.getElementById("vibe");
const historyBox = document.getElementById("historyBox");
const historyList = document.getElementById("historyList");

/* ================= HARD BLOCK ALL KEYBOARD INPUT ================= */
/* Blocks mobile, laptop, desktop, IME, shortcuts */
[
  "keydown",
  "keypress",
  "keyup",
  "paste",
  "beforeinput",
  "input",
  "drop"
].forEach(type => {
  document.addEventListener(type, e => {
    e.preventDefault();
    e.stopPropagation();
  }, true);
});

/* ================= HAPTIC ================= */
function vibrate() {
  const t = +vibe.value;
  if (t && navigator.vibrate) navigator.vibrate(t);
}

/* ================= BUTTON INPUT ONLY ================= */
/* No focus, no cursor, no keyboard — append-only */

function insert(char) {
  vibrate();
  d.textContent += char;
}

function backspace() {
  vibrate();
  d.textContent = d.textContent.slice(0, -1);
}

function clearAll() {
  vibrate();
  d.textContent = "";
}

/* ================= CALCULATION ================= */
function calculate() {
  vibrate();
  try {
    const exp = d.textContent;

    /* Final safety check */
    if (!/^[0-9+\-*/. ]+$/.test(exp)) return;
    if (!exp.trim()) return;

    const result = eval(exp);
    saveHistory(`${exp} = ${result}`);
    d.textContent = result;
  } catch {
    d.textContent = "Error";
  }
}

/* ================= HISTORY ================= */
function toggleHistory() {
  historyBox.style.display =
    historyBox.style.display === "block" ? "none" : "block";
}

function saveHistory(entry) {
  let h = JSON.parse(localStorage.getItem("calcHistory") || "[]");
  h.unshift(entry);
  localStorage.setItem("calcHistory", JSON.stringify(h.slice(0, 10)));
  renderHistory();
}

function renderHistory() {
  const h = JSON.parse(localStorage.getItem("calcHistory") || "[]");
  historyList.innerHTML = h.length ? h.join("<br>") : "No history";
}

function clearHistory() {
  localStorage.removeItem("calcHistory");
  renderHistory();
}

/* ================= INIT ================= */
renderHistory();

/* ================= SERVICE WORKER ================= */
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js");
}
