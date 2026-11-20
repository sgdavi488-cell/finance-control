const KEY = "fc-entries-v1";
const $ = (s) => document.querySelector(s);
function parseAmount(value) {
  const raw = String(value || "").trim().replace(/\\s/g, "");
  if (!raw) return NaN;
  const normalized = raw.includes(",")
    ? raw.replace(/\\./g, "").replace(",", ".")
    : raw;
  return Number(normalized);
}
const money = (n) => new Intl.NumberFormat("pt-BR", {style:"currency",currency:"BRL"}).format(n);
const now = new Date();
const localDate = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
};
let entries = readEntries();

function readEntries() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY)) || [];
    if (!Array.isArray(saved)) return [];
    return saved.filter(entry =>
      entry &&
      typeof entry.id === "string" &&
      typeof entry.title === "string" &&
      typeof entry.category === "string" &&
      Number.isFinite(entry.amount) && entry.amount > 0 &&
      /^\d{4}-\d{2}-\d{2}$/.test(entry.date) &&
      ["income", "expense"].includes(entry.type)
    );
  } catch {
    return [];
  }
}
function saveEntries() {
  try {
    localStorage.setItem(KEY, JSON.stringify(entries));
    return true;
  } catch {
    showToast("Não foi possível salvar. Verifique o espaço disponível no navegador.");
    return false;
  }
}
function selectedMonth() { return $("#month").value || localDate().slice(0,7); }
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
  $("#form").elements.date.value = localDate();
  $("#modal").showModal();
});
$("#close").addEventListener("click",()=>$("#modal").close());
$("#form").addEventListener("submit",event=>{
  event.preventDefault();
  const data = new FormData(event.currentTarget), amount = Number(data.get("amount"));
  if (!Number.isFinite(amount) || amount <= 0) return;
  const title = String(data.get("title") || "").trim();
  const date = String(data.get("date") || "");
  const type = String(data.get("type") || "");
  const category = String(data.get("category") || "");
  if (!title || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !["income", "expense"].includes(type)) return;

  const entry = {id:Date.now().toString(36)+Math.random().toString(36).slice(2),title,amount,date,type,category,createdAt:Date.now()};
  entries.push(entry);
  if (!saveEntries()) {
    entries.pop();
    return;
  }
  $("#month").value = date.slice(0,7); $("#modal").close(); render(); showToast("Lançamento salvo. Tudo no lugar.");
});
$("#month").addEventListener("change",render);
$("#search").addEventListener("input",renderList);
$("#filter").addEventListener("change",renderList);
$("#list").addEventListener("click",event=>{
  const button = event.target.closest("[data-id]"); if (!button) return;
  const previousEntries = entries;
  entries = entries.filter(item=>item.id !== button.dataset.id);
  if (!saveEntries()) {
    entries = previousEntries;
    return;
  }
  render(); showToast("Lançamento removido.");
});
$("#modal").addEventListener("click",event=>{if(event.target === $("#modal")) $("#modal").close();});
render();