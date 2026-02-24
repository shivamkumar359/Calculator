/* ================= ELEMENT REFERENCES ================= */
const d = document.getElementById("display");
const vibe = document.getElementById("vibe");
const historyBox = document.getElementById("historyBox");
const historyList = document.getElementById("historyList");

/* ================= HARD BLOCK ALL KEYBOARD INPUT ================= */
/* This blocks mobile keyboards, laptop keyboards, IME, paste, shortcuts */
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

/* ================= HAPTIC FEEDBACK ================= */
function vibrate() {
  const strength = +vibe.value;
  if (strength && navigator.vibrate) {
    navigator.vibrate(strength);
  }
}

/* ================= BUTTON-ONLY INPUT ================= */
/* No focus, no keyboard, append-only */

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

    /* Strict safety validation */
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
  let history = JSON.parse(localStorage.getItem("calcHistory") || "[]");
  history.unshift(entry);
  localStorage.setItem("calcHistory", JSON.stringify(history.slice(0, 10)));
  renderHistory();
}

function renderHistory() {
  const history = JSON.parse(localStorage.getItem("calcHistory") || "[]");
  historyList.innerHTML = history.length
    ? history.join("<br>")
    : "No history";
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
