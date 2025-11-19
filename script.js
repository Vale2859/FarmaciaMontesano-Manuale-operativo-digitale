// Gestionale essenziale Portale Farmacia Montesano
// Tutto in locale con localStorage (nessun server).
// CHIAVI DI STORAGE
const LS_USERS = "fm_users";
const LS_ACTIVE = "fm_activeUser";
const LS_MSGS = "fm_messages";
const LS_PROCS = "fm_procedures";
const LS_LEAVE = "fm_leave";
// UTILS
function loadJson(key, fallback) {
try {
const raw = localStorage.getItem(key);
if (!raw) return fallback;
return JSON.parse(raw);
} catch {
return fallback;
}
}
function saveJson(key, value) {
localStorage.setItem(key, JSON.stringify(value));
}
// AUTH UI
function showError(msg) {
const e = document.getElementById("auth-error");
e.textContent = msg;
e.classList.remove("hidden");
}
function clearError() {
const e = document.getElementById("auth-error");
e.textContent = "";
e.classList.add("hidden");
}
function showLogin(ev) {
if (ev) ev.preventDefault();
clearError();
document.getElementById("login-box").classList.remove("hidden");
document.getElementById("register-box").classList.add("hidden");
}
function showRegister(ev) {
if (ev) ev.preventDefault();
clearError();
document.getElementById("login-box").classList.add("hidden");
document.getElementById("register-box").classList.remove("hidden");
}
// USERS
function loadUsers() {
return loadJson(LS_USERS, []);
}
function saveUsers(users) {
saveJson(LS_USERS, users);
}
function seedAdminIfNeeded() {
let users = loadUsers();
if (users.length === 0) {
users.push({
id: "admin-1",
name: "Valerio Montesano",
email: "admin@farmaciamontesano.it",
password: "admin123",
role: "admin",
createdAt: new Date().toISOString()
});
saveUsers(users);
alert(
"Creato utente Admin iniziale:\\nEmail: admin@farmaciamontesano.it\\nPassword: admin123"
);
}
}
// REGISTRAZIONE
function registerUser() {
const name = document.getElementById("reg-name").value.trim();
const email = document.getElementById("reg-email").value.trim();
const pass = document.getElementById("reg-password").value;
if (!name || !email || !pass) {
showError("Compila tutti i campi per registrarti.");
return;
}
let users = loadUsers();
if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
showError("Esiste già un utente con questa email.");
return;
}
users.push({
id: "u-" + Date.now(),
name,
email,
password: pass,
role: "dipendente",
createdAt: new Date().toISOString()
});
saveUsers(users);
alert("Account creato! Ora effettua il login.");
document.getElementById("reg-password").value = "";
showLogin();
}
// LOGIN
function login() {
const email = document.getElementById("login-email").value.trim();
const pass = document.getElementById("login-password").value;
let users = loadUsers();
const user = users.find(
(u) => u.email.toLowerCase() === email.toLowerCase() && u.password === pass
);
if (!user) {
showError("Email o password non corretti.");
return;
}
saveJson(LS_ACTIVE, user);
openPortal(user);
}
function logout() {
localStorage.removeItem(LS_ACTIVE);
document.getElementById("portal").classList.add("hidden");
document.getElementById("auth").classList.remove("hidden");
showLogin();
}
// PORTALE
function openPortal(user) {
document.getElementById("auth").classList.add("hidden");
document.getElementById("portal").classList.remove("hidden");
document.getElementById("user-name-display").textContent = user.name;
document.getElementById("user-role-display").textContent =
user.role === "admin" ? "Titolare / Admin" : "Dipendente";
document.getElementById("home-title").textContent =
"Ciao " + user.name + ", benvenuto nel portale";
document.getElementById("user-info").innerHTML =
"<strong>Nome:</strong> " +
user.name +
"<br><strong>Email:</strong> " +
user.email +
"<br><strong>Ruolo:</strong> " +
(user.role === "admin" ? "Titolare / Admin" : "Dipendente");
if (user.role === "admin") {
document.getElementById("nav-admin").classList.remove("hidden");
renderAdminUsers();
fillAdminMessageTargets();
renderAdminProcedures();
renderAdminLeave();
} else {
document.getElementById("nav-admin").classList.add("hidden");
}
seedProceduresIfNeeded();
renderProcedures();
loadMessagesForUser(user);
loadLeaveForUser(user);
showSection("home", document.getElementById("nav-home"));
}
function showSection(id, btn) {
document.querySelectorAll(".section").forEach((s) => s.classList.remove("visible"));
document.getElementById(id).classList.add("visible");
document.querySelectorAll(".nav-btn").forEach((b) => b.classList.remove("active"));
if (btn) btn.classList.add("active");
}
// PROCEDURE (SEMPLICI)
function seedProceduresIfNeeded() {
let procs = loadJson(LS_PROCS, null);
if (!procs) {
procs = [
{
id: "p1",
body:
title: "Anticipi – i clienti pagano subito",
"Il cliente paga subito l'importo del farmaco. Quando porta la ricetta, " +
"emetti il ticket e restituisci l'eventuale differenza dalla scatoletta sotto cassa."
},
{
id: "p2",
title: "Ticket – gestione ricette SSN",
body:
"Controlla sempre i dati del paziente, applica il ticket corretto dal gestionale " +
"e verifica il codice fiscale prima di chiudere."
},
{
id: "p3",
title: "POS collegato al gestionale",
body:
"Le vendite con carta vanno fatte partendo dal gestionale collegato al POS. " +
"Evita gli inserimenti manuali sul POS salvo emergenza."
},
{
id: "p4",
title: "Sotto cassa",
body:
"Anticipi o differenze da restituire vanno sempre nella scatoletta sotto cassa, " +
"con un bigliettino se serve ricordare il motivo."
}
];
saveJson(LS_PROCS, procs);
}
}
function renderProcedures() {
const procs = loadJson(LS_PROCS, []);
const list = document.getElementById("proc-list");
list.innerHTML = "";
if (procs.length === 0) {
list.innerHTML = "<p class='small-text'>Nessuna procedura definita.</p>";
return;
}
procs.forEach((p) => {
const div = document.createElement("div");
div.className = "list-item";
div.innerHTML =
"<div class='list-item-title'>" +
p.title +
"</div><div>" +
(p.body || "") +
"</div>";
list.appendChild(div);
});
}
// COMUNICAZIONI
function loadMessagesForUser(user) {
const msgs = loadJson(LS_MSGS, []);
const container = document.getElementById("message-list");
container.innerHTML = "";
const visible = msgs.filter(
(m) => m.target === "all" || m.target === user.id
);
if (visible.length === 0) {
container.innerHTML = "<p class='small-text'>Nessuna comunicazione.</p>";
return;
}
visible
.slice()
.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
.forEach((m) => {
const div = document.createElement("div");
div.className = "list-item";
div.innerHTML =
"<div class='list-item-title'>" +
m.title +
"</div><div class='list-item-meta'>" +
(m.target === "all" ? "Tutti i dipendenti" : "Solo: " + (m.targetName || "")) +
" • " +
new Date(m.createdAt).toLocaleString("it-IT") +
"</div><div>" +
m.body +
"</div>";
container.appendChild(div);
});
}
// FERIE & PERMESSI (DIPENDENTE)
function sendLeaveRequest() {
const user = loadJson(LS_ACTIVE, null);
if (!user) return;
const type = document.getElementById("leave-type").value;
const start = document.getElementById("leave-start").value;
const end = document.getElementById("leave-end").value;
const note = document.getElementById("leave-note").value.trim();
if (!start) {
alert("Inserisci almeno la data di inizio.");
return;
}
let leaves = loadJson(LS_LEAVE, []);
leaves.push({
id: "l-" + Date.now(),
userId: user.id,
userName: user.name,
type,
startDate: start,
endDate: end || "",
note,
status: "in_attesa",
createdAt: new Date().toISOString()
});
saveJson(LS_LEAVE, leaves);
document.getElementById("leave-note").value = "";
document.getElementById("leave-end").value = "";
loadLeaveForUser(user);
if (user.role === "admin") renderAdminLeave();
alert("Richiesta inviata.");
}
function typeLabel(t) {
switch (t) {
case "ferie":
return "Ferie";
case "permesso_orario":
return "Permesso orario";
case "permesso_giornata":
return "Permesso giornata";
default:
return t;
}
}
function loadLeaveForUser(user) {
const leaves = loadJson(LS_LEAVE, []);
const my = leaves.filter((l) => l.userId === user.id);
const tbody = document.querySelector("#leave-table tbody");
tbody.innerHTML = "";
if (my.length === 0) {
const tr = document.createElement("tr");
tr.innerHTML = "<td colspan='4'>Nessuna richiesta inviata.</td>";
tbody.appendChild(tr);
return;
}
my
.slice()
.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
.forEach((l) => {
const tr = document.createElement("tr");
let statusClass = "status-pending";
let statusLabel = "In attesa";
if (l.status === "approvata") {
statusClass = "status-approved";
statusLabel = "Approvata";
} else if (l.status === "rifiutata") {
statusClass = "status-rejected";
statusLabel = "Rifiutata";
}
let period = l.startDate;
if (l.endDate && l.endDate !== l.startDate) {
period += " → " + l.endDate;
}
tr.innerHTML =
"<td>" +
new Date(l.createdAt).toLocaleDateString("it-IT") +
"</td><td>" +
typeLabel(l.type) +
"</td><td>" +
period +
"</td><td><span class='status-badge " +
statusClass +
"'>" +
statusLabel +
"</span></td>";
tbody.appendChild(tr);
});
}
// ADMIN - UTENTI
function renderAdminUsers() {
const users = loadUsers();
const container = document.getElementById("admin-users");
container.innerHTML = "";
if (users.length === 0) {
container.innerHTML = "<p class='small-text'>Nessun utente.</p>";
return;
}
users.forEach((u) => {
const row = document.createElement("div");
row.className = "list-item";
let html =
"<div class='list-item-title'>" +
u.name +
(u.role === "admin" ? " (Admin)" : "") +
"</div>";
html +=
"<div class='list-item-meta'>" +
u.email +
" • creato il " +
new Date(u.createdAt).toLocaleDateString("it-IT") +
"</div>";
html +=
"<div class='list-item-meta'>Password attuale: <strong>" +
(u.password || "—") +
"</strong></div>";
row.innerHTML = html;
if (u.role !== "admin") {
const btn = document.createElement("button");
btn.className = "btn-primary";
btn.style.width = "auto";
btn.style.marginTop = "6px";
btn.textContent = "Reimposta password";
btn.onclick = () => {
const np = prompt("Nuova password per " + u.name + ":");
if (!np) return;
u.password = np;
saveUsers(users);
renderAdminUsers();
alert("Password aggiornata.");
};
row.appendChild(btn);
}
container.appendChild(row);
});
}
// ADMIN - MESSAGGI
function fillAdminMessageTargets() {
const users = loadUsers();
const sel = document.getElementById("admin-msg-target");
sel.innerHTML = '<option value="all">Tutti i dipendenti</option>';
users.forEach((u) => {
if (u.role !== "admin") {
const opt = document.createElement("option");
opt.value = u.id;
opt.textContent = u.name + " (" + u.email + ")";
sel.appendChild(opt);
}
});
}
function adminSendMessage() {
const title = document.getElementById("admin-msg-title").value.trim();
const body = document.getElementById("admin-msg-body").value.trim();
const target = document.getElementById("admin-msg-target").value;
if (!title || !body) {
alert("Inserisci titolo e testo.");
return;
}
const users = loadUsers();
const targetUser = users.find((u) => u.id === target);
let msgs = loadJson(LS_MSGS, []);
msgs.push({
id: "m-" + Date.now(),
title,
body,
target,
targetName: targetUser ? targetUser.name : "",
createdAt: new Date().toISOString()
});
saveJson(LS_MSGS, msgs);
document.getElementById("admin-msg-title").value = "";
document.getElementById("admin-msg-body").value = "";
const active = loadJson(LS_ACTIVE, null);
if (active) {
loadMessagesForUser(active);
}
alert("Comunicazione inviata.");
}
// ADMIN - PROCEDURE (SEMPLICE)
function adminSaveProcedure() {
const title = document.getElementById("admin-proc-title").value.trim();
const body = document.getElementById("admin-proc-body").value.trim();
if (!title || !body) {
alert("Compila titolo e testo.");
return;
}
let procs = loadJson(LS_PROCS, []);
const existing = procs.find(
(p) => p.title.toLowerCase() === title.toLowerCase()
);
if (existing) {
existing.body = body;
} else {
procs.push({
id: "p-" + Date.now(),
title,
body
});
}
saveJson(LS_PROCS, procs);
renderProcedures();
renderAdminProcedures();
alert("Procedura salvata / aggiornata.");
}
function renderAdminProcedures() {
const procs = loadJson(LS_PROCS, []);
const container = document.getElementById("admin-proc-list");
container.innerHTML = "";
if (procs.length === 0) {
container.innerHTML = "<p class='small-text'>Nessuna procedura.</p>";
return;
}
procs.forEach((p) => {
const div = document.createElement("div");
div.className = "list-item";
div.innerHTML =
"<div class='list-item-title'>" +
p.title +
"</div><div class='list-item-meta'>" +
(p.body.length > 100 ? p.body.slice(0, 100) + "..." : p.body) +
"</div>";
const btn = document.createElement("button");
btn.textContent = "Modifica";
btn.className = "btn-primary";
btn.style.width = "auto";
btn.style.marginTop = "4px";
btn.onclick = () => {
document.getElementById("admin-proc-title").value = p.title;
document.getElementById("admin-proc-body").value = p.body;
};
div.appendChild(btn);
container.appendChild(div);
});
}
// ADMIN - LEAVE (FERIE)
function renderAdminLeave() {
const leaves = loadJson(LS_LEAVE, []);
const list = document.getElementById("admin-leave-list");
list.innerHTML = "";
if (leaves.length === 0) {
list.innerHTML = "<p class='small-text'>Nessuna richiesta ferie/permessi.</p>";
return;
}
leaves
.slice()
.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
.forEach((l) => {
const row = document.createElement("div");
row.className = "list-item";
let statusClass = "status-pending";
let statusLabel = "In attesa";
if (l.status === "approvata") {
statusClass = "status-approved";
statusLabel = "Approvata";
} else if (l.status === "rifiutata") {
statusClass = "status-rejected";
statusLabel = "Rifiutata";
}
let period = l.startDate;
if (l.endDate && l.endDate !== l.startDate) {
period += " → " + l.endDate;
}
row.innerHTML =
"<div class='list-item-title'>" +
(l.userName || l.userId) +
" – " +
typeLabel(l.type) +
"</div>" +
"<div class='list-item-meta'>" +
period +
" • richiesta il " +
new Date(l.createdAt).toLocaleDateString("it-IT") +
"</div>" +
"<div class='list-item-meta'>" +
(l.note || "") +
"</div>" +
"<div><span class='status-badge " +
statusClass +
"'>" +
statusLabel +
"</span></div>";
if (l.status === "in_attesa") {
const btnOk = document.createElement("button");
btnOk.textContent = "Approva";
btnOk.className = "btn-primary";
btnOk.style.width = "auto";
btnOk.style.marginTop = "4px";
btnOk.onclick = () => updateLeaveStatus(l.id, "approvata");
const btnKo = document.createElement("button");
btnKo.textContent = "Rifiuta";
btnKo.className = "btn-primary";
btnKo.style.width = "auto";
btnKo.style.marginTop = "4px";
btnKo.style.marginLeft = "6px";
btnKo.onclick = () => updateLeaveStatus(l.id, "rifiutata");
row.appendChild(btnOk);
row.appendChild(btnKo);
}
});
list.appendChild(row);
}
function updateLeaveStatus(id, status) {
let leaves = loadJson(LS_LEAVE, []);
const idx = leaves.findIndex((l) => l.id === id);
if (idx === -1) return;
leaves[idx].status = status;
saveJson(LS_LEAVE, leaves);
const active = loadJson(LS_ACTIVE, null);
if (active) {
loadLeaveForUser(active);
}
renderAdminLeave();
}
// AVVIO
document.addEventListener("DOMContentLoaded", () => {
seedAdminIfNeeded();
const active = loadJson(LS_ACTIVE, null);
if (active) {
openPortal(active);
} else {
showLogin();
}
});
