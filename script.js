/* ============================================
   Portale Professionale – Farmacia Montesano
   Gestione front-end con localStorage
   ============================================ */

const LS_USERS = "fm_users";
const LS_ACTIVE = "fm_activeUser";
const LS_ABSENCES = "fm_absences";
const LS_PROCEDURES = "fm_procedures";
const LS_MESSAGES = "fm_messages";
const LS_LEAVE = "fm_leave";
const LS_PERSONAL = "fm_personal";
const LS_QUICK = "fm_quickNotes";
const LS_TRAINING = "fm_trainingNotes";

/* ---------- Utility ---------- */

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

function uid() {
  return "id-" + Math.random().toString(36).substring(2) + "-" + Date.now();
}

/* ============================================
   AUTENTICAZIONE
   ============================================ */

function showError(msg) {
  const e = document.getElementById("auth-error");
  if (!e) return;
  e.textContent = msg;
  e.classList.remove("hidden");
}

function clearError() {
  const e = document.getElementById("auth-error");
  if (!e) return;
  e.textContent = "";
  e.classList.add("hidden");
}

function showRegister(ev) {
  if (ev) ev.preventDefault();
  clearError();
  document.getElementById("login-box").classList.add("hidden");
  document.getElementById("register-box").classList.remove("hidden");
}

function showLogin(ev) {
  if (ev) ev.preventDefault();
  clearError();
  document.getElementById("register-box").classList.add("hidden");
  document.getElementById("login-box").classList.remove("hidden");
}

function loadUsers() {
  return loadJson(LS_USERS, []);
}

function saveUsers(users) {
  saveJson(LS_USERS, users);
}

/* Admin principale */
function seedAdminIfNeeded() {
  let users = loadUsers();

  const adminEmail = "admin@farmaciamontesano.it";
  const adminPassword = "admin123";

  let admin = users.find(u => u.email.toLowerCase() === adminEmail.toLowerCase());

  if (!admin) {
    admin = {
      id: uid(),
      name: "Valerio Montesano",
      email: adminEmail,
      password: adminPassword,
      role: "admin",
      active: true,
      approved: true,
      createdAt: new Date().toISOString(),
    };
    users.push(admin);
  } else {
    admin.password = adminPassword;
    admin.role = "admin";
    admin.active = true;
    admin.approved = true;
  }

  saveUsers(users);

  alert(
    "Admin pronto.\nEmail: " + adminEmail +
    "\nPassword: " + adminPassword +
    "\n(Puoi cambiarla nel codice)"
  );
}

/* Registrazione */
function registerUser() {
  const name = document.getElementById("reg-name").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const pass = document.getElementById("reg-password").value;

  if (!name || !email || !pass) {
    showError("Compila tutti i campi.");
    return;
  }

  let users = loadUsers();
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    showError("Email già registrata.");
    return;
  }

  users.push({
    id: uid(),
    name,
    email,
    password: pass,
    role: "dipendente",
    active: false,
    approved: false,
    createdAt: new Date().toISOString(),
  });

  saveUsers(users);
  alert("Richiesta inviata! Il titolare deve approvarla.");
  showLogin();
}

/* Login */
function login() {
  const email = document.getElementById("login-email").value.trim();
  const pass = document.getElementById("login-password").value;

  if (!email || !pass) {
    showError("Inserisci email e password.");
    return;
  }

  const users = loadUsers();
  const user = users.find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.password === pass
  );

  if (!user) {
    showError("Credenziali errate.");
    return;
  }

  if (!user.approved || !user.active) {
    showError("Account non abilitato.");
    return;
  }

  saveJson(LS_ACTIVE, user);

  openPortal(user);
}

/* Logout */
function logout() {
  localStorage.removeItem(LS_ACTIVE);
  document.getElementById("portal").classList.add("hidden");
  document.getElementById("auth").classList.remove("hidden");
  showLogin();
}

/* ============================================
   PORTALE & NAVIGAZIONE  (CORRETTO!)
   ============================================ */

function openPortal(user) {
  document.getElementById("auth").classList.add("hidden");
  document.getElementById("portal").classList.remove("hidden");

  document.getElementById("user-name-display").textContent = user.name;
  document.getElementById("user-role-display").textContent =
    user.role === "admin" ? "Titolare" : "Dipendente";

  initHome(user);
  renderProcedures();
  renderMessages(user);
  loadPersonalData(user);
  renderLeaveTable(user);
  renderApprovedAbsences();

  if (user.role === "admin") {
    renderAdminUsers();
    renderAdminLeaveList();
    renderAdminProceduresList();
    populateMessageTargets();
  }

  showSection("home");
  showAppScreen("home");
}

function goHome() {
  showSection("home");
  showAppScreen("home");
}

/* Cambio sezione */
function showSection(id, btn) {
  const pages = document.querySelectorAll(".section");
  pages.forEach(p => p.classList.remove("visible"));

  const sel = document.getElementById(id);
  if (sel) sel.classList.add("visible");

  const navs = document.querySelectorAll(".nav-btn");
  navs.forEach(b => b.classList.remove("active"));
  if (btn) btn.classList.add("active");
}
/* ============================================
   DASHBOARD / HOME
   ============================================ */

function todayLabel() {
  const d = new Date();
  return d.toLocaleDateString("it-IT", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
  });
}

function randomPhrase() {
  const list = [
    "Aggiornare listini se necessario",
    "Ricordarsi di controllare il cassetto 2",
    "Controllare scorte in scadenza",
    "Gentilezza sempre con tutti i clienti",
    "Verificare eventuali resi da corrieri",
  ];
  return list[Math.floor(Math.random() * list.length)];
}

function initHome(user) {
  const tag = document.getElementById("home-daytag");
  if (tag) tag.textContent = todayLabel();

  const ul = document.getElementById("home-highlights");
  if (ul) {
    ul.innerHTML = "";
    for (let i = 0; i < 4; i++) {
      const li = document.createElement("li");
      li.textContent = randomPhrase();
      ul.appendChild(li);
    }
  }

  const qp = document.getElementById("home-quick-proc");
  if (qp) {
    qp.innerHTML = `
      <button class="quick-btn" onclick="openProcedureFromHome('Cassa','Anticipi – i clienti pagano subito')">Anticipi</button>
      <button class="quick-btn" onclick="openProcedureFromHome('Cassa','POS collegato')">POS</button>
      <button class="quick-btn" onclick="openProcedureFromHome('Cassa','Ticket SSN')">Ticket</button>
      <button class="quick-btn" onclick="openProcedureFromHome('Cassa','Sotto cassa')">Sotto cassa</button>
    `;
  }

  renderHomeLeaveSummary(user);
  renderHomeLogisticsSummary();
  renderHomeLastMessages(user);
}

function openProcedureFromHome(cat, title) {
  showSection("procedures", document.getElementById("nav-proc"));
  selectProcedureCategory(cat);
  scrollToProcedure(title);
}

/* Home – riepilogo ferie */
function renderHomeLeaveSummary(user) {
  const box = document.getElementById("home-leave-summary");
  if (!box) return;
  const all = loadJson(LS_LEAVE, []);
  const mine = all.filter((r) => r.userId === user.id);
  if (mine.length === 0) {
    box.innerHTML = `<div class="list-item">Nessuna richiesta inserita.</div>`;
    return;
  }
  const next = mine[mine.length - 1];
  box.innerHTML = `
    <div class="list-item">
      <div class="list-item-title">Ultima richiesta</div>
      <div class="list-item-meta">
        Tipo: ${formatLeaveType(next.type)} – Stato: ${formatLeaveStatus(
    next.status
  )}
      </div>
      <div>
        Dal ${next.start || "-"} ${next.end ? "al " + next.end : ""}
      </div>
    </div>
  `;
}

/* Home – logistica breve */
function renderHomeLogisticsSummary() {
  const ul = document.getElementById("home-logistics-summary");
  if (!ul) return;
  ul.innerHTML = `
    <li>Ritiro corriere: 16:00</li>
    <li>Controllo frigoriferi dopo le 20</li>
    <li>Arrivo merce sabato ore 11</li>
  `;
}

/* Home – ultime comunicazioni */
function renderHomeLastMessages(user) {
  const cont = document.getElementById("home-last-messages");
  if (!cont) return;
  const all = getMessages();
  const visible = all
    .filter((m) => m.target === "all" || m.target === user.id)
    .slice(-3)
    .reverse();

  if (visible.length === 0) {
    cont.innerHTML = `<div class="list-item">Nessuna comunicazione recente.</div>`;
    return;
  }

  cont.innerHTML = visible
    .map((m) => templateMessage(m.title, m.body, m.priority, m.createdAt))
    .join("");
}

/* ============================================
   TEMPLATE MESSAGGI / PROCEDURE
   ============================================ */

function templateMessage(title, body, priority, date) {
  const color =
    priority === "urgente"
      ? "#dc2626"
      : priority === "alta"
      ? "#ea580c"
      : "#0a7b43";

  const d = date
    ? new Date(date).toLocaleString("it-IT", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return `
  <div class="list-item">
    <div class="list-item-title" style="color:${color}">${title}</div>
    <div class="list-item-meta">${d}</div>
    <div>${body}</div>
  </div>
  `;
}

function templateProcedureItem(p) {
  return `
    <div class="list-item" data-proc-id="${p.id}">
      <div class="list-item-title">${p.title}</div>
      <div>${p.body}</div>
    </div>
  `;
}

/* ============================================
   PROCEDURE
   ============================================ */

function ensureDemoProcedures() {
  let procs = loadJson(LS_PROCEDURES, null);
  if (!procs || procs.length === 0) {
    procs = [
      {
        id: uid(),
        category: "Cassa",
        title: "Anticipi – i clienti pagano subito",
        body: "Spiega qui passo passo come gestire gli anticipi, dove mettere i soldi (sotto cassa), quando fare lo scontrino, ecc.",
      },
      {
        id: uid(),
        category: "Cassa",
        title: "Ticket SSN",
        body: "Procedura completa per ticket: caricamento ricetta, verifica dati, stampa scontrino, ecc.",
      },
      {
        id: uid(),
        category: "Cassa",
        title: "POS collegato",
        body: "Cosa fare in caso di errore POS, disallineamento con gestionale, riavvio, ecc.",
      },
      {
        id: uid(),
        category: "Cassa",
        title: "Sotto cassa",
        body: "Regole per la gestione del sotto cassa, conteggio, reintegro.",
      },
      {
        id: uid(),
        category: "Magazzino",
        title: "Controllo scadenze",
        body: "Cadenza mensile, scaffali da controllare, come gestire il reso, dove segnare le anomalie.",
      },
    ];
    saveJson(LS_PROCEDURES, procs);
  }
}

function getProcedures() {
  ensureDemoProcedures();
  return loadJson(LS_PROCEDURES, []);
}

function renderProcedures() {
  const procs = getProcedures();
  const catBox = document.getElementById("proc-categories");
  const listBox = document.getElementById("proc-list");
  if (!catBox || !listBox) return;

  const cats = Array.from(new Set(procs.map((p) => p.category)));
  catBox.innerHTML = "";

  cats.forEach((c, idx) => {
    const btn = document.createElement("button");
    btn.className = "proc-category-btn" + (idx === 0 ? " active" : "");
    btn.textContent = c;
    btn.onclick = () => selectProcedureCategory(c);
    catBox.appendChild(btn);
  });

  if (cats.length > 0) {
    renderProcedureListForCategory(cats[0]);
  } else {
    listBox.innerHTML =
      '<div class="list-item">Nessuna procedura disponibile.</div>';
  }
}

function selectProcedureCategory(cat) {
  const buttons = document.querySelectorAll(".proc-category-btn");
  buttons.forEach((b) => {
    if (b.textContent === cat) b.classList.add("active");
    else b.classList.remove("active");
  });
  renderProcedureListForCategory(cat);
}

function renderProcedureListForCategory(cat) {
  const listBox = document.getElementById("proc-list");
  const procs = getProcedures().filter((p) => p.category === cat);
  if (!listBox) return;
  if (procs.length === 0) {
    listBox.innerHTML =
      '<div class="list-item">Nessuna procedura per questa categoria.</div>';
    return;
  }
  listBox.innerHTML = procs.map((p) => templateProcedureItem(p)).join("");
}

function scrollToProcedure(title) {
  const listBox = document.getElementById("proc-list");
  if (!listBox) return;
  const items = listBox.querySelectorAll(".list-item");
  items.forEach((item) => {
    const t = item.querySelector(".list-item-title")?.textContent.trim();
    if (t && t.toLowerCase() === title.toLowerCase()) {
      item.scrollIntoView({ behavior: "smooth", block: "start" });
      item.style.boxShadow = "0 0 0 2px #22c55e";
      setTimeout(() => (item.style.boxShadow = ""), 1200);
    }
  });
}

/* ============================================
   COMUNICAZIONI
   ============================================ */

function ensureDemoMessages() {
  let msgs = loadJson(LS_MESSAGES, null);
  if (!msgs || msgs.length === 0) {
    msgs = [
      {
        id: uid(),
        title: "Benvenuti nel portale interno",
        body: "Da oggi tutte le procedure e le comunicazioni ufficiali passano da qui.",
        priority: "normale",
        target: "all",
        createdAt: new Date().toISOString(),
      },
    ];
    saveJson(LS_MESSAGES, msgs);
  }
}

function getMessages() {
  ensureDemoMessages();
  return loadJson(LS_MESSAGES, []);
}

function renderMessages(user) {
  const cont = document.getElementById("message-list");
  if (!cont) return;
  const all = getMessages();
  const visible = all.filter(
    (m) => m.target === "all" || m.target === user.id
  );
  if (visible.length === 0) {
    cont.innerHTML = `<div class="list-item">Nessuna comunicazione.</div>`;
    return;
  }
  cont.innerHTML = visible
    .slice()
    .reverse()
    .map((m) =>
      templateMessage(m.title, m.body, m.priority, m.createdAt)
    )
    .join("");
}

function adminSendMessage() {
  const title = document.getElementById("admin-msg-title").value.trim();
  const body = document.getElementById("admin-msg-body").value.trim();
  const target = document.getElementById("admin-msg-target").value;
  const priority = document.getElementById("admin-msg-priority").value;

  if (!title || !body) {
    alert("Compila titolo e testo.");
    return;
  }

  let msgs = getMessages();
  msgs.push({
    id: uid(),
    title,
    body,
    priority,
    target,
    createdAt: new Date().toISOString(),
  });
  saveJson(LS_MESSAGES, msgs);

  document.getElementById("admin-msg-title").value = "";
  document.getElementById("admin-msg-body").value = "";

  const active = loadJson(LS_ACTIVE, null);
  if (active) {
    renderMessages(active);
    renderHomeLastMessages(active);
  }

  alert("Comunicazione inviata.");
}

function populateMessageTargets() {
  const sel = document.getElementById("admin-msg-target");
  if (!sel) return;
  const users = loadUsers().filter((u) => u.approved && u.active);
  sel.innerHTML = `<option value="all">Tutti i dipendenti</option>`;
  users.forEach((u) => {
    const opt = document.createElement("option");
    opt.value = u.id;
    opt.textContent = u.name + " (" + u.email + ")";
    sel.appendChild(opt);
  });
}

/* ============================================
   FERIE & PERMESSI
   ============================================ */

function formatLeaveType(t) {
  switch (t) {
    case "ferie":
      return "Ferie";
    case "permesso_orario":
      return "Permesso orario";
    case "permesso_giornata":
      return "Permesso giornata";
    case "recupero_ore":
      return "Recupero ore";
    default:
      return t;
  }
}

function formatLeaveStatus(s) {
  if (s === "approvato") return "Approvato";
  if (s === "rifiutato") return "Rifiutato";
  return "In attesa";
}

function sendLeaveRequest() {
  const type = document.getElementById("leave-type").value;
  const start = document.getElementById("leave-start").value;
  const end = document.getElementById("leave-end").value;
  const note = document.getElementById("leave-note").value.trim();

  if (!start) {
    alert("Inserisci almeno la data di inizio.");
    return;
  }

  const user = loadJson(LS_ACTIVE, null);
  if (!user) return;

  let all = loadJson(LS_LEAVE, []);
  all.push({
    id: uid(),
    userId: user.id,
    userName: user.name,
    type,
    start,
    end,
    note,
    status: "attesa",
    createdAt: new Date().toISOString(),
  });
  saveJson(LS_LEAVE, all);

  document.getElementById("leave-note").value = "";
  renderLeaveTable(user);
  if (user.role === "admin") renderAdminLeaveList();

  alert("Richiesta inviata.");
}

function renderLeaveTable(user) {
  const tbody = document
    .getElementById("leave-table")
    ?.querySelector("tbody");
  if (!tbody) return;

  const all = loadJson(LS_LEAVE, []);
  const mine = all.filter((r) => r.userId === user.id);

  tbody.innerHTML = "";
  if (mine.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="4">Nessuna richiesta inserita.</td></tr>';
    return;
  }

  mine
    .slice()
    .reverse()
    .forEach((r) => {
      const tr = document.createElement("tr");
      const created = new Date(r.createdAt).toLocaleDateString("it-IT", {
        day: "2-digit",
        month: "2-digit",
      });
      tr.innerHTML = `
        <td>${created}</td>
        <td>${formatLeaveType(r.type)}</td>
        <td>${r.start}${r.end ? " → " + r.end : ""}</td>
        <td>${formatLeaveStatus(r.status)}</td>
      `;
      tbody.appendChild(tr);
    });
}

function renderAdminLeaveList() {
  const box = document.getElementById("admin-leave-list");
  if (!box) return;
  const all = loadJson(LS_LEAVE, []);
  if (all.length === 0) {
    box.innerHTML =
      '<div class="list-item">Nessuna richiesta di ferie/permessi.</div>';
    return;
  }

  box.innerHTML = "";
  all
    .slice()
    .reverse()
    .forEach((r) => {
      const div = document.createElement("div");
      div.className = "list-item";
      div.innerHTML = `
        <div class="list-item-title">
          ${r.userName} – ${formatLeaveType(r.type)}
        </div>
        <div class="list-item-meta">
          Dal ${r.start}${r.end ? " al " + r.end : ""} – Stato: ${formatLeaveStatus(
        r.status
      )}
        </div>
        <div>${r.note || ""}</div>
        <div style="margin-top:6px;">
          <button class="btn-primary small" onclick="adminSetLeaveStatus('${
            r.id
          }','approvato')">Approva</button>
          <button class="btn-primary small" style="background:#fee2e2;color:#991b1b;box-shadow:none;"
            onclick="adminSetLeaveStatus('${r.id}','rifiutato')">Rifiuta</button>
        </div>
      `;
      box.appendChild(div);
    });
}

function adminSetLeaveStatus(id, status) {
  let all = loadJson(LS_LEAVE, []);
  const idx = all.findIndex((r) => r.id === id);
  if (idx === -1) return;
  all[idx].status = status;
  saveJson(LS_LEAVE, all);

  const active = loadJson(LS_ACTIVE, null);
  if (active) {
    renderLeaveTable(active);
    if (active.role === "admin") renderAdminLeaveList();
    renderHomeLeaveSummary(active);
  }
}

/* ============================================
   FORMAZIONE
   ============================================ */

function renderTraining(user) {
  const list = document.getElementById("training-list");
  if (list) {
    list.innerHTML = `
      <li>Ripasso procedure cassa e anticipi.</li>
      <li>Nuovi prodotti della stagione.</li>
      <li>Corsi ECM programmati.</li>
    `;
  }

  const notesKey = LS_TRAINING + "_" + user.id;
  const saved = localStorage.getItem(notesKey);
  const ta = document.getElementById("training-notes");
  if (ta && saved) ta.value = saved;
}

function saveTrainingNotes() {
  const user = loadJson(LS_ACTIVE, null);
  if (!user) return;
  const ta = document.getElementById("training-notes");
  if (!ta) return;
  localStorage.setItem(LS_TRAINING + "_" + user.id, ta.value);
  const lab = document.getElementById("training-saved");
  if (lab) {
    lab.classList.remove("hidden");
    setTimeout(() => lab.classList.add("hidden"), 1200);
  }
}

/* ============================================
   LOGISTICA
   ============================================ */

function renderLogistics() {
  const cour = document.getElementById("logistics-couriers");
  const exp = document.getElementById("logistics-expiry");
  if (cour) {
    cour.innerHTML = `
      <li>Corriere principale: ritiro ore 16:00.</li>
      <li>Resi programmati ogni martedì.</li>
    `;
  }
  if (exp) {
    exp.innerHTML = `
      <li>Controllo frigoriferi ogni sera.</li>
      <li>Verifica scadenze mensile su dermocosmesi.</li>
    `;
  }
}

/* ============================================
   AREA PERSONALE / APPUNTI
   ============================================ */

function saveQuickNotes() {
  const user = loadJson(LS_ACTIVE, null);
  if (!user) return;
  const ta = document.getElementById("quick-notes");
  if (!ta) return;
  localStorage.setItem(LS_QUICK + "_" + user.id, ta.value);
  const lab = document.getElementById("quick-saved");
  if (lab) {
    lab.classList.remove("hidden");
    setTimeout(() => lab.classList.add("hidden"), 1200);
  }
}

function loadPersonalData(user) {
  const quick = localStorage.getItem(LS_QUICK + "_" + user.id);
  if (quick && document.getElementById("quick-notes")) {
    document.getElementById("quick-notes").value = quick;
  }

  const allPersonal = loadJson(LS_PERSONAL, {});
  const mine = allPersonal[user.id] || { notes: "", docs: [] };

  const pn = document.getElementById("personal-notes");
  if (pn) pn.value = mine.notes || "";
  renderPersonalDocs(mine.docs);
}

function savePersonalNotes() {
  const user = loadJson(LS_ACTIVE, null);
  if (!user) return;
  const ta = document.getElementById("personal-notes");
  if (!ta) return;

  let all = loadJson(LS_PERSONAL, {});
  if (!all[user.id]) all[user.id] = { notes: "", docs: [] };
  all[user.id].notes = ta.value;
  saveJson(LS_PERSONAL, all);

  const lab = document.getElementById("personal-notes-saved");
  if (lab) {
    lab.classList.remove("hidden");
    setTimeout(() => lab.classList.add("hidden"), 1200);
  }
}

function addPersonalDoc() {
  const user = loadJson(LS_ACTIVE, null);
  if (!user) return;

  const titleEl = document.getElementById("personal-doc-title");
  const descEl = document.getElementById("personal-doc-desc");
  const title = titleEl.value.trim();
  const desc = descEl.value.trim();
  if (!title) {
    alert("Inserisci un titolo per il documento.");
    return;
  }

  let all = loadJson(LS_PERSONAL, {});
  if (!all[user.id]) all[user.id] = { notes: "", docs: [] };
  all[user.id].docs.push({
    id: uid(),
    title,
    desc,
    createdAt: new Date().toISOString(),
  });
  saveJson(LS_PERSONAL, all);

  titleEl.value = "";
  descEl.value = "";
  renderPersonalDocs(all[user.id].docs);
}

function renderPersonalDocs(docs) {
  const box = document.getElementById("personal-doc-list");
  if (!box) return;
  if (!docs || docs.length === 0) {
    box.innerHTML =
      '<div class="list-item">Nessun documento inserito.</div>';
    return;
  }

  box.innerHTML = "";
  docs
    .slice()
    .reverse()
    .forEach((d) => {
      const div = document.createElement("div");
      div.className = "list-item";
      const when = new Date(d.createdAt).toLocaleDateString("it-IT", {
        day: "2-digit",
        month: "2-digit",
      });
      div.innerHTML = `
        <div class="list-item-title">${d.title}</div>
        <div class="list-item-meta">Aggiunto il ${when}</div>
        <div>${d.desc || ""}</div>
      `;
      box.appendChild(div);
    });
}

/* ============================================
   AREA ADMIN – UTENTI & PROCEDURE
   ============================================ */

function renderAdminUsers() {
  const box = document.getElementById("admin-users");
  if (!box) return;
  const users = loadUsers();
  box.innerHTML = "";

  users.forEach((u) => {
    const div = document.createElement("div");
    div.className = "list-item";
    div.innerHTML = `
      <div class="list-item-title">
        ${u.name} ${u.role === "admin" ? "(Admin)" : ""}
      </div>
      <div class="list-item-meta">${u.email}</div>
      <div>
        Stato: ${
          u.approved && u.active
            ? "Attivo"
            : u.approved && !u.active
            ? "Disattivo"
            : "In attesa approvazione"
        }
      </div>
      <div style="margin-top:6px; display:flex; flex-wrap:wrap; gap:6px;">
        ${
          !u.approved
            ? `<button class="btn-primary small" onclick="adminApproveUser('${u.id}')">Approva</button>`
            : ""
        }
        ${
          u.approved
            ? `<button class="btn-primary small" onclick="adminToggleActive('${u.id}')">${
                u.active ? "Disattiva" : "Riattiva"
              }</button>`
            : ""
        }
        <button class="btn-primary small" style="background:#eef2ff;color:#312e81;box-shadow:none;"
          onclick="adminResetPassword('${u.id}')">Reimposta password</button>
      </div>
    `;
    box.appendChild(div);
  });
}

function adminApproveUser(id) {
  let users = loadUsers();
  const u = users.find((x) => x.id === id);
  if (!u) return;
  u.approved = true;
  u.active = true;
  saveUsers(users);
  renderAdminUsers();
  populateMessageTargets();
}

function adminToggleActive(id) {
  let users = loadUsers();
  const u = users.find((x) => x.id === id);
  if (!u) return;
  u.active = !u.active;
  saveUsers(users);
  renderAdminUsers();
}

function adminResetPassword(id) {
  let users = loadUsers();
  const u = users.find((x) => x.id === id);
  if (!u) return;
  const newPass = prompt(
    "Nuova password per " + u.name + " (" + u.email + "):"
  );
  if (!newPass) return;
  u.password = newPass;
  saveUsers(users);
  alert("Password aggiornata.");
}

/* Admin – Procedure */

function adminSaveProcedure() {
  const cat = document.getElementById("admin-proc-cat").value.trim();
  const title = document.getElementById("admin-proc-title").value.trim();
  const body = document.getElementById("admin-proc-body").value.trim();

  if (!cat || !title || !body) {
    alert("Compila tutti i campi della procedura.");
    return;
  }

  let procs = getProcedures();
  const existing = procs.find(
    (p) =>
      p.category.toLowerCase() === cat.toLowerCase() &&
      p.title.toLowerCase() === title.toLowerCase()
  );
  if (existing) {
    existing.body = body;
  } else {
    procs.push({
      id: uid(),
      category: cat,
      title,
      body,
    });
  }
  saveJson(LS_PROCEDURES, procs);

  document.getElementById("admin-proc-body").value = "";
  renderProcedures();
  renderAdminProceduresList();
  alert("Procedura salvata.");
}

function renderAdminProceduresList() {
  const box = document.getElementById("admin-proc-list");
  if (!box) return;
  const procs = getProcedures();
  if (procs.length === 0) {
    box.innerHTML =
      '<div class="list-item">Nessuna procedura ancora inserita.</div>';
    return;
  }
  box.innerHTML = "";
  procs.forEach((p) => {
    const div = document.createElement("div");
    div.className = "list-item";
    div.innerHTML = `
      <div class="list-item-title">${p.category} – ${p.title}</div>
      <div>${p.body}</div>
    `;
    box.appendChild(div);
  });
}

/* ============================================
   AVVIO
   ============================================ */
function togglePassword() {
  const input = document.getElementById("login-password");
  if (!input) return;
  if (input.type === "password") {
    input.type = "text";
  } else {
    input.type = "password";
  }
}
// ================= APP INTERNA (HOME / ASSENZE) ================= //

function showAppScreen(which) {
  const home = document.getElementById("screen-home");
  const ass = document.getElementById("screen-assenze");
  const btnHome = document.getElementById("nav-app-home");
  const btnAss = document.getElementById("nav-app-assenze");

  if (!home || !ass) return;

  if (which === "assenze") {
    home.classList.remove("app-screen-visible");
    ass.classList.add("app-screen-visible");
    if (btnHome) btnHome.classList.remove("app-nav-btn-active");
    if (btnAss) btnAss.classList.add("app-nav-btn-active");
  } else {
    ass.classList.remove("app-screen-visible");
    home.classList.add("app-screen-visible");
    if (btnAss) btnAss.classList.remove("app-nav-btn-active");
    if (btnHome) btnHome.classList.add("app-nav-btn-active");
  }
}

// Salvataggio e lettura assenze
function loadAbsences() {
  return loadJson(LS_ABSENCES, []);
}

function saveAbsences(list) {
  saveJson(LS_ABSENCES, list);
}

// In questa versione tutte le assenze sono considerate "approvate"
function submitAbsence() {
  const user = loadJson(LS_ACTIVE, null);
  if (!user) {
    alert("Devi essere loggato per segnalare un'assenza.");
    return;
  }

  const dateEl = document.getElementById("abs-date");
  const reasonEl = document.getElementById("abs-reason");
  if (!dateEl || !reasonEl) return;

  const date = dateEl.value;
  const reason = reasonEl.value.trim();

  if (!date) {
    alert("Seleziona la data.");
    return;
  }

  let absences = loadAbsences();
  absences.push({
    id: "a-" + Date.now(),
    userName: user.name,
    date,
    reason,
    status: "approved" // in questa versione tutte approvate
  });
  saveAbsences(absences);

  dateEl.value = "";
  reasonEl.value = "";

  renderApprovedAbsences();
  alert("Assenza registrata (approvata e visibile a tutti).");
}

// Mostra SOLO assenze future approvate
// Mostra SOLO assenze future approvate
// - Tutti vedono: Nome in grassetto + data
// - Eccezione: se il motivo contiene "ferie", si vede "· ferie"
// - Solo Admin/Titolare vede SEMPRE il motivo completo
function renderApprovedAbsences() {
  const container = document.getElementById("absence-list");
  if (!container) return;

  const activeUser = loadJson(LS_ACTIVE, null);
  const isAdmin = activeUser && activeUser.role === "admin";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let absences = loadAbsences().filter(a => a.status === "approved");

  // solo oggi o date future
  absences = absences.filter(a => {
    const d = new Date(a.date);
    d.setHours(0, 0, 0, 0);
    return d >= today;
  });

  // Ordina per data crescente
  absences.sort((a, b) => new Date(a.date) - new Date(b.date));

  if (absences.length === 0) {
    container.innerHTML =
      "<p class='small-text'>Nessuna assenza futura registrata.</p>";
    return;
  }

  container.innerHTML = "";
  absences.forEach(a => {
    const d = new Date(a.date);
    const formattedDate = d.toLocaleDateString("it-IT", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });

    const reason = a.reason || "";
    const isFerie =
      reason.toLowerCase().includes("ferie") ||
      reason.toLowerCase().includes("ferie ");

    // Riga sotto al nome:
    // - per tutti: data
    // - se NON admin ma è ferie -> "data · ferie"
    // - se admin -> "data · motivo completo" (se presente)
    let meta = formattedDate;
    if (isAdmin) {
      if (reason) {
        meta += " · " + reason;
      }
    } else if (isFerie) {
      meta += " · ferie";
    }

    const div = document.createElement("div");
    div.className = "absence-pill";
    div.innerHTML =
      "<span><strong>" + a.userName + "</strong></span>" +
      "<span class='absence-meta'>" + meta + "</span>";
    container.appendChild(div);
  });
}document.addEventListener("DOMContentLoaded", () => {
  seedAdminIfNeeded();
  ensureDemoProcedures();
  ensureDemoMessages();

  const active = loadJson(LS_ACTIVE, null);
  if (active) {
    openPortal(active);
  } else {
    showLogin();
  }
});
