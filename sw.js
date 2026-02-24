/* ================= ELEMENTS ================= */
const d = document.getElementById("display");
const vibe = document.getElementById("vibe");
const historyBox = document.getElementById("historyBox");
const historyList = document.getElementById("historyList");

/* ================= HARD BLOCK ALL KEYBOARD INPUT ================= */
["keydown","keypress","keyup"].forEach(type=>{
  document.addEventListener(type,e=>{
    e.preventDefault();
    e.stopPropagation();
  },true);
});

/* Block paste / drop / IME */
["paste","drop","beforeinput","input"].forEach(evt=>{
  d.addEventListener(evt,e=>{
    e.preventDefault();
    e.stopPropagation();
  });
});

/* ================= HAPTIC ================= */
function vibrate(){
  const t = +vibe.value;
  if(t && navigator.vibrate) navigator.vibrate(t);
}

/* ================= CURSOR WITHOUT KEYBOARD ================= */
function keepFocus(){
  d.blur();
  d.focus();
}

/* ================= BUTTON INPUT ================= */
function insert(text){
  vibrate();
  keepFocus();
  document.execCommand("insertText",false,text);
}

function backspace(){
  vibrate();
  keepFocus();
  document.execCommand("delete");
}

function clearAll(){
  vibrate();
  d.textContent="";
}

/* ================= CALCULATION ================= */
function calculate(){
  vibrate();
  try{
    const exp=d.textContent;
    if(!/^[0-9+\-*/. ]+$/.test(exp)) return;
    if(!exp.trim()) return;
    const res=eval(exp);
    saveHistory(`${exp} = ${res}`);
    d.textContent=res;
  }catch{
    d.textContent="Error";
  }
}

/* ================= HISTORY ================= */
function toggleHistory(){
  historyBox.style.display=
    historyBox.style.display==="block"?"none":"block";
}

function saveHistory(entry){
  let h=JSON.parse(localStorage.getItem("calcHistory")||"[]");
  h.unshift(entry);
  localStorage.setItem("calcHistory",JSON.stringify(h.slice(0,10)));
  renderHistory();
}

function renderHistory(){
  const h=JSON.parse(localStorage.getItem("calcHistory")||"[]");
  historyList.innerHTML=h.length?h.join("<br>"):"No history";
}

function clearHistory(){
  localStorage.removeItem("calcHistory");
  renderHistory();
}

renderHistory();

/* ================= SERVICE WORKER ================= */
if("serviceWorker" in navigator){
  navigator.serviceWorker.register("./sw.js");
}
