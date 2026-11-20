const KEY = "fc-entries-v1";
const $ = (s) => document.querySelector(s);
const money = (n) => new Intl.NumberFormat("pt-BR", {style:"currency",currency:"BRL"}).format(n);
const now = new Date();
let entries = readEntries();

function readEntries() {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; }
  catch { return []; }
}
function saveEntries() { localStorage.setItem(KEY, JSON.stringify(entries)); }
function selectedMonth() { return $("#month").value || now.toISOString().slice(0,7); }
function monthEntries() { return entries.filter(e => e.date.slice(0,7) === selectedMonth()); }
function safe(value) {
  return String(value).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");
}
function render() {
  const items = monthEntries();
  const incoming = items.filter(e => e.type === "income").reduce((sum,e) => sum + e.amount,0);
  const outgoing = items.filter(e => e.type === "expense").reduce((sum,e) => sum + e.amount,0);
  $("#balance").textContent = money(incoming-outgoing);
  $("#income").textContent = money(incoming);
  $("#expense").textContent = money(outgoing);
  $("#month-label").textContent = new Date(selectedMonth()+"-02T12:00:00").toLocaleDateString("pt-BR",{month:"long",year:"numeric"});
  if (!items.length) $("#insight").textContent = "Seus primeiros registros vão aparecer aqui. Sem julgamentos, só clareza.";
  else if (incoming === 0) $("#insight").textContent = "Registre também suas entradas para enxergar o saldo completo.";
  else if (outgoing > incoming) $("#insight").textContent = "As saídas passaram das entradas. Vale olhar as categorias e entender o que pesou mais.";
  else $("#insight").textContent = "As entradas estão acima das saídas. Continue registrando para acompanhar o mês.";
  renderChart(items);
  renderList();
}
function renderChart(items) {
  const chart = $("#chart");
  if (!items.length) { chart.innerHTML = "<p>Adicione lançamentos para ver seu movimento.</p>"; return; }
  const periods = Array.from({length:12},(_,i)=>i*3+1);
  const values = periods.map(day => ["income","expense"].map(type => items.filter(e => {
    const d = Number(e.date.slice(8,10)); return e.type === type && d >= day && d <= day+2;
  }).reduce((sum,e)=>sum+e.amount,0)));
  const max = Math.max(1,...values.flat());
  chart.innerHTML = values.map(pair => {
    const a = Math.max(2,pair[0]/max*100), b = Math.max(2,pair[1]/max*100);
    return '<div class="bar-group"><i class="bar in" style="height:'+a+'%"></i><i class="bar out" style="height:'+b+'%"></i></div>';
  }).join("");
}
function renderList() {
  const term = $("#search").value.trim().toLowerCase();
  const type = $("#filter").value;
  const items = monthEntries().filter(e => (type === "all" || e.type === type) && (e.title.toLowerCase().includes(term) || e.category.toLowerCase().includes(term))).sort((a,b)=>b.date.localeCompare(a.date)||b.createdAt-a.createdAt);
  if (!items.length) { $("#list").innerHTML = '<tr><td colspan="6" class="empty">Nada por aqui com esses filtros.</td></tr>'; return; }
  $("#list").innerHTML = items.map(e => {
    const date = new Date(e.date+"T12:00:00").toLocaleDateString("pt-BR");
    const label = e.type === "income" ? "Entrada" : "Saída";
    const sign = e.type === "income" ? "+ " : "− ";
    const kind = e.type === "income" ? "positive" : "negative";
    return '<tr><td>'+safe(e.title)+'</td><td>'+safe(e.category)+'</td><td>'+date+'</td><td><span class="pill '+(e.type==="expense"?"out":"")+'">'+label+'</span></td><td class="'+kind+'">'+sign+money(e.amount)+'</td><td><button class="delete" data-id="'+e.id+'" aria-label="Excluir">×</button></td></tr>';
  }).join("");
}
function showToast(message) {
  const el = $("#toast"); el.textContent = message; el.classList.add("show");
  setTimeout(()=>el.classList.remove("show"),2200);
}
$("#month").value = now.toISOString().slice(0,7);
$("#open").addEventListener("click",()=>{
  $("#form").reset();
  $("#form").elements.date.value = now.toISOString().slice(0,10);
  $("#modal").showModal();
});
$("#close").addEventListener("click",()=>$("#modal").close());
$("#form").addEventListener("submit",event=>{
  event.preventDefault();
  const data = new FormData(event.currentTarget), amount = Number(data.get("amount"));
  if (!Number.isFinite(amount) || amount <= 0) return;
  entries.push({id:Date.now().toString(36)+Math.random().toString(36).slice(2),title:data.get("title").trim(),amount,date:data.get("date"),type:data.get("type"),category:data.get("category"),createdAt:Date.now()});
  saveEntries(); $("#month").value = data.get("date").slice(0,7); $("#modal").close(); render(); showToast("Lançamento salvo. Tudo no lugar.");
});
$("#month").addEventListener("change",render);
$("#search").addEventListener("input",renderList);
$("#filter").addEventListener("change",renderList);
$("#list").addEventListener("click",event=>{
  const button = event.target.closest("[data-id]"); if (!button) return;
  entries = entries.filter(item=>item.id !== button.dataset.id);
  saveEntries(); render(); showToast("Lançamento removido.");
});
$("#modal").addEventListener("click",event=>{if(event.target === $("#modal")) $("#modal").close();});
render();