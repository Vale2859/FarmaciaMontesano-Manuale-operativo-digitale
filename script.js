/* ============================================
   Portale Professionale – Farmacia Montesano
   Front-end (localStorage)
   ============================================ */

const LS_USERS = "fm_users";
const LS_ACTIVE = "fm_activeUser";
const LS_REMEMBER = "fm_remember";
const LS_ABSENCES = "fm_absences";
const LS_LEAVE = "fm_leave";
const LS_PROCEDURES = "fm_procedures";
const LS_MESSAGES = "fm_messages";
const LS_PERSONAL = "fm_personal";
const LS_TRAINING = "fm_trainingNotes";
const LS_CLIENT_BOOKINGS = "fm_clientBookings";
const LS_CLIENT_PROMOS = "fm_clientPromos";

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

/* ---------- Error box ---------- */

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

/* ============================================
   AUTH – LOGIN / REGISTRAZIONE
   ============================================ */

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

/* Admin di default */
function seedAdminIfNeeded() {
  let users = loadUsers();
  const adminEmail = "admin@farmaciamontesano.it";
  const adminPassword = "admin123";

  let admin = users.find(
    (u) => u.email.toLowerCase() === adminEmail.toLowerCase()
  );

  if (!admin) {
    admin = {
      id: uid(),
      name: "Valerio Montesano",
      phone: "",
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
}

/* Registrazione */
function registerUser() {
  const name = document.getElementById("reg-name").value.trim();
  const phone = document.getElementById("reg-phone").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const pass = document.getElementById("reg-password").value;
  const role = document.getElementById("reg-role").value;

  if (!name || !email || !pass) {
    showError("Compila tutti i campi obbligatori.");
    return;
  }

  let users = loadUsers();
  if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
    showError("Esiste già un utente con questa email.");
    return;
  }

  const isDip = role === "dipendente";

  users.push({
    id: uid(),
    name,
    phone,
    email,
    password: pass,
    role,
    active: !isDip, // i dipendenti devono essere abilitati dall’Admin
    approved: !isDip,
    createdAt: new Date().toISOString(),
  });

  saveUsers(users);

  if (isDip) {
    alert(
      "Richiesta registrazione inviata. L'account dovrà essere approvato dal Titolare."
    );
  } else {
    alert("Account creato! Ora puoi accedere al portale.");
  }
  showLogin();
}

/* Prefill da “Ricordami” */
function prefillLoginFromRemember() {
  const data = loadJson(LS_REMEMBER, null);
  if (!data) return;
  const emailEl = document.getElementById("login-email");
  const passEl = document.getElementById("login-password");
  const chk = document.getElementById("remember-me");
  if (emailEl && passEl && chk) {
    emailEl.value = data.email || "";
    passEl.value = data.password || "";
    chk.checked = true;
  }
}

/* Login */

function login() {
  const email = document.getElementById("login-email").value.trim();
  const pass = document.getElementById("login-password").value;
  const remember = document.getElementById("remember-me").checked;

  if (!email || !pass) {
    showError("Inserisci email e password.");
    return;
  }

  const users = loadUsers();
  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === pass
  );

  if (!user) {
    showError("Credenziali non valide.");
    return;
  }

  if (!user.approved || !user.active) {
    showError("Account non abilitato. Contatta il titolare.");
    return;
  }

  saveJson(LS_ACTIVE, user);

  if (remember) {
    saveJson(LS_REMEMBER, { email, password: pass });
  } else {
    localStorage.removeItem(LS_REMEMBER);
  }

  openPortal(user);
}

/* Logout */

function logout() {
  localStorage.removeItem(LS_ACTIVE);
  document.getElementById("portal").classList.add("hidden");
  document.getElementById("auth").classList.remove("hidden");
  showLogin();
}

/* Mostra/nascondi password */

function togglePassword() {
  const input = document.getElementById("login-password");
  if (!input) return;
  input.type = input.type === "password" ? "text" : "password";
}

/* ============================================
   PORTALE & NAVIGAZIONE
   ============================================ */

function setSectionVisible(id) {
  const sections = document.querySelectorAll(".section");
  sections.forEach((s) => s.classList.remove("visible"));
  const target = document.getElementById(id);
  if (target) target.classList.add("visible");
}

function openPortal(user) {
  document.getElementById("auth").classList.add("hidden");
  document.getElementById("portal").classList.remove("hidden");

  // topbar
  document.getElementById("user-name-display").textContent = user.name;
  const roleBadge = document.getElementById("user-role-display");
  const subtitle = document.getElementById("topbar-subtitle");

  if (user.role === "admin") {
    roleBadge.textContent = "Titolare";
    subtitle.textContent = "Portale professionale interno";
  } else if (user.role === "dipendente") {
    roleBadge.textContent = "Dipendente";
    subtitle.textContent = "Portale professionale interno";
  } else {
    roleBadge.textContent = "Cliente";
    subtitle.textContent = "Area Clienti";
  }

  // mostra/nasconde elementi admin
  const adminEls = document.querySelectorAll(".admin-only");
  adminEls.forEach((el) => {
    if (user.role === "admin") el.classList.remove("hidden");
    else el.classList.add("hidden");
  });

  if (user.role === "cliente") {
    setSectionVisible("home-client");
    initClientPortal(user);
  } else {
    setSectionVisible("home-employee");
    showAppScreen("home");
    initEmployeePortal(user);
  }
}

function goHome() {
  const user = loadJson(LS_ACTIVE, null);
  if (!user) return;
  if (user.role === "cliente") {
    setSectionVisible("home-client");
    showClientPanel("welcome");
  } else {
    setSectionVisible("home-employee");
    showAppScreen("home");
  }
}

/* ============================================
   DIPENDENTI – HOME / PROCEDURE / COMUNICAZIONI
   ============================================ */

function initEmployeePortal(user) {
  ensureDemoProcedures();
  ensureDemoMessages();
  renderProcedures();
  renderMessages(user);
  renderLogistics();
  renderTraining(user);
  loadPersonalData(user);
  renderLeaveTable(user);
  renderApprovedAbsences();

  if (user.role === "admin") {
    renderAdminUsers();
    renderAdminProceduresList();
    renderAdminLeaveList();
    populateMessageTargets();
    renderAbsenceAdminUI();
  }
}

/* Dashboard app interna */

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

/* PROCEDURE */

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

function templateProcedureItem(p) {
  return `
    <div class="list-item" data-proc-id="${p.id}">
      <div class="list-item-title">${p.title}</div>
      <div>${p.body}</div>
    </div>
  `;
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

/* COMUNICAZIONI */

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
  }

  alert("Comunicazione inviata.");
}

function populateMessageTargets() {
  const sel = document.getElementById("admin-msg-target");
  if (!sel) return;
  const users = loadUsers().filter(
    (u) => u.approved && u.active && u.role !== "cliente"
  );
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

function loadPersonalData(user) {
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
        ${u.name} ${
      u.role === "admin" ? "(Admin)" : u.role === "dipendente" ? "(Dipendente)" : "(Cliente)"
    }
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
   ASSENZE – DIPENDENTI + VISTA TITOLARE
   ============================================ */

function loadAbsences() {
  return loadJson(LS_ABSENCES, []);
}

function saveAbsences(list) {
  saveJson(LS_ABSENCES, list);
}

/* Dipendente / richiesta semplice */

function submitAbsence() {
  const user = loadJson(LS_ACTIVE, null);
  if (!user) {
    alert("Devi essere loggato per richiedere un'assenza.");
    return;
  }

  const dateEl = document.getElementById("abs-date");
  const typeEl = document.getElementById("abs-type");
  const reasonEl = document.getElementById("abs-reason");
  if (!dateEl || !reasonEl) return;

  const date = dateEl.value;
  const reason = reasonEl.value.trim();
  const type = typeEl ? typeEl.value : "altro";

  if (!date) {
    alert("Seleziona la data.");
    return;
  }

  let absences = loadAbsences();
  absences.push({
    id: "a-" + Date.now(),
    userId: user.id,
    userName: user.name,
    date,
    type,
    reason,
    status: "approved", // per ora tutte approvate
  });
  saveAbsences(absences);

  dateEl.value = "";
  reasonEl.value = "";

  renderApprovedAbsences();

  const active = loadJson(LS_ACTIVE, null);
  if (active && active.role === "admin") {
    renderAbsenceAdminUI();
  }

  alert("Assenza registrata (approvata e visibile a tutti).");
}

/* Lista future approvate visibile a tutti */

function renderApprovedAbsences() {
  const container = document.getElementById("absence-list");
  if (!container) return;

  const activeUser = loadJson(LS_ACTIVE, null);
  const isAdmin = activeUser && activeUser.role === "admin";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let absences = loadAbsences().filter((a) => a.status === "approved");

  absences = absences.filter((a) => {
    const d = new Date(a.date);
    d.setHours(0, 0, 0, 0);
    return d >= today;
  });

  absences.sort((a, b) => new Date(a.date) - new Date(b.date));

  if (absences.length === 0) {
    container.innerHTML =
      "<p class='small-text'>Nessuna assenza futura registrata.</p>";
    return;
  }

  container.innerHTML = "";
  absences.forEach((a) => {
    const d = new Date(a.date);
    const formattedDate = d.toLocaleDateString("it-IT", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const reason = a.reason || "";
    const isFerie = (a.type || "").toLowerCase() === "ferie";

    let meta = formattedDate;
    if (isAdmin) {
      if (reason) meta += " · " + reason;
    } else if (isFerie) {
      meta += " · ferie";
    }

    const div = document.createElement("div");
    div.className = "absence-pill";
    div.innerHTML =
      "<span><strong>" +
      a.userName +
      "</strong></span>" +
      "<span class='absence-meta'>" +
      meta +
      "</span>";
    container.appendChild(div);
  });
}

/* Apertura area assenze in base al ruolo */

function openAbsenceArea() {
  const user = loadJson(LS_ACTIVE, null);
  if (!user) return;

  if (user.role === "admin") {
    setSectionVisible("absences-admin");
    renderAbsenceAdminUI();
  } else {
    setSectionVisible("home-employee");
    showAppScreen("assenze");
  }
}

/* Vista titolare */

function formatAbsenceType(t) {
  switch (t) {
    case "ferie":
      return "Ferie";
    case "permesso_orario":
      return "Permesso orario";
    case "permesso_giornata":
      return "Giornata intera";
    case "malattia":
      return "Malattia";
    case "altro":
      return "Altro";
    default:
      return t || "Altro";
  }
}

function formatAbsenceStatus(s) {
  if (s === "approved") return "Approvata";
  if (s === "rejected") return "Rifiutata";
  return "In attesa";
}

function renderAbsenceAdminUI() {
  const monthInput = document.getElementById("abs-admin-month");
  const empSelect = document.getElementById("abs-admin-employee");
  const typeSelect = document.getElementById("abs-admin-type-filter");
  if (!monthInput || !empSelect || !typeSelect) return;

  if (!monthInput.value) {
    const now = new Date();
    monthInput.value = now.toISOString().slice(0, 7);
  }

  const all = loadAbsences();

  const map = new Map();
  all.forEach((a) => {
    if (a.userId && a.userName) {
      if (!map.has(a.userId)) map.set(a.userId, a.userName);
    }
  });

  empSelect.innerHTML = '<option value="">Tutti</option>';
  map.forEach((name, id) => {
    const opt = document.createElement("option");
    opt.value = id;
    opt.textContent = name;
    empSelect.appendChild(opt);
  });

  renderAbsenceAdminMonthView();
  renderAbsenceAdminHistory();
}

function renderAbsenceAdminMonthView() {
  const monthInput = document.getElementById("abs-admin-month");
  const list = document.getElementById("abs-admin-month-list");
  if (!monthInput || !list) return;

  const monthVal = monthInput.value;
  const all = loadAbsences();
  if (!monthVal || all.length === 0) {
    list.innerHTML = '<div class="list-item">Nessuna assenza registrata.</div>';
    return;
  }

  const grouped = {};
  all.forEach((a) => {
    if (!a.date) return;
    if (!a.date.startsWith(monthVal)) return;
    if (!grouped[a.date]) grouped[a.date] = [];
    grouped[a.date].push(a);
  });

  const dates = Object.keys(grouped).sort();
  if (dates.length === 0) {
    list.innerHTML =
      '<div class="list-item">Nessuna assenza per il mese selezionato.</div>';
    return;
  }

  list.innerHTML = "";
  dates.forEach((dStr) => {
    const d = new Date(dStr);
    const nice = d.toLocaleDateString("it-IT", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const items = grouped[dStr]
      .map(
        (a) =>
          `${a.userName} – ${formatAbsenceType(
            a.type || "altro"
          )} (${formatAbsenceStatus(a.status)})`
      )
      .join("<br>");

    const div = document.createElement("div");
    div.className = "list-item";
    div.innerHTML = `
      <div class="list-item-title">${nice}</div>
      <div class="list-item-meta">${grouped[dStr].length} assenza/e</div>
      <div>${items}</div>
    `;
    list.appendChild(div);
  });
}

function renderAbsenceAdminHistory() {
  const empSelect = document.getElementById("abs-admin-employee");
  const typeSelect = document.getElementById("abs-admin-type-filter");
  const box = document.getElementById("abs-admin-history");
  if (!empSelect || !typeSelect || !box) return;

  const empId = empSelect.value;
  const typeFilter = typeSelect.value;

  let list = loadAbsences();

  if (empId) {
    list = list.filter((a) => a.userId === empId);
  }
  if (typeFilter && typeFilter !== "tutti") {
    list = list.filter((a) => (a.type || "altro") === typeFilter);
  }

  if (list.length === 0) {
    box.innerHTML =
      '<div class="list-item">Nessuna assenza per i filtri selezionati.</div>';
    return;
  }

  list = list
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  box.innerHTML = "";
  list.forEach((a) => {
    const d = a.date
      ? new Date(a.date).toLocaleDateString("it-IT", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      : "-";

    const div = document.createElement("div");
    div.className = "list-item";
    div.innerHTML = `
      <div class="list-item-title">
        ${a.userName || "Sconosciuto"} – ${d}
      </div>
      <div class="list-item-meta">
        Tipo: ${formatAbsenceType(a.type || "altro")} · Stato: ${formatAbsenceStatus(
      a.status
    )}
      </div>
      <div>${a.reason || ""}</div>
      <div style="margin-top:6px; display:flex; flex-wrap:wrap; gap:6px;">
        <button class="btn-primary small"
          onclick="adminUpdateAbsenceStatus('${a.id}','approved')">
          Approva
        </button>
        <button class="btn-primary small"
          style="background:#fee2e2;color:#991b1b;box-shadow:none;"
          onclick="adminUpdateAbsenceStatus('${a.id}','rejected')">
          Rifiuta
        </button>
        <button class="btn-primary small"
          style="background:#e5e7eb;color:#111827;box-shadow:none;"
          onclick="adminDeleteAbsence('${a.id}')">
          Cancella
        </button>
      </div>
    `;
    box.appendChild(div);
  });
}

function adminUpdateAbsenceStatus(id, status) {
  let list = loadAbsences();
  const idx = list.findIndex((a) => a.id === id);
  if (idx === -1) return;
  list[idx].status = status;
  saveAbsences(list);

  renderApprovedAbsences();
  renderAbsenceAdminUI();
}

function adminDeleteAbsence(id) {
  if (!confirm("Vuoi davvero cancellare questa assenza?")) return;
  let list = loadAbsences();
  list = list.filter((a) => a.id !== id);
  saveAbsences(list);

  renderApprovedAbsences();
  renderAbsenceAdminUI();
}

/* ============================================
   AREA CLIENTI
   ============================================ */

function initClientPortal(user) {
  ensureClientPromos();
  renderClientPromos();
  showClientPanel("welcome");
  renderClientBookingsForUser(user);

  const dateInput = document.getElementById("client-book-date");
  if (dateInput) {
    dateInput.addEventListener("change", () =>
      renderClientTakenSlots(dateInput.value)
    );
  }
}

function showClientPanel(panel) {
  const panels = document.querySelectorAll(".client-panel");
  panels.forEach((p) => p.classList.remove("client-panel-visible"));

  const id =
    panel === "welcome"
      ? "client-panel-welcome"
      : panel === "booking"
      ? "client-panel-booking"
      : panel === "requests"
      ? "client-panel-requests"
      : panel === "promos"
      ? "client-panel-promos"
      : panel === "appointments"
      ? "client-panel-appointments"
      : panel === "contacts"
      ? "client-panel-contacts"
      : "client-panel-soon";

  const el = document.getElementById(id);
  if (el) el.classList.add("client-panel-visible");
}

/* Prenotazioni */

function getAllBookings() {
  return loadJson(LS_CLIENT_BOOKINGS, []);
}

function saveAllBookings(list) {
  saveJson(LS_CLIENT_BOOKINGS, list);
}

function clientSubmitBooking() {
  const user = loadJson(LS_ACTIVE, null);
  if (!user || user.role !== "cliente") {
    alert("Solo i clienti possono prenotare.");
    return;
  }

  const date = document.getElementById("client-book-date").value;
  const time = document.getElementById("client-book-time").value;
  const note = document.getElementById("client-book-note").value.trim();
  const err = document.getElementById("client-book-error");

  if (!date || !time) {
    if (err) {
      err.textContent = "Seleziona data e orario.";
      err.classList.remove("hidden");
    }
    return;
  }

  let list = getAllBookings();
  const slotTaken = list.some((b) => b.date === date && b.time === time);
  if (slotTaken) {
    if (err) {
      err.textContent =
        "Quell'orario è già occupato da un altro cliente. Scegli un'altra fascia.";
      err.classList.remove("hidden");
    }
    renderClientTakenSlots(date);
    return;
  }

  if (err) {
    err.textContent = "";
    err.classList.add("hidden");
  }

  list.push({
    id: uid(),
    clientId: user.id,
    clientName: user.name,
    date,
    time,
    note,
    createdAt: new Date().toISOString(),
  });
  saveAllBookings(list);

  document.getElementById("client-book-note").value = "";

  renderClientBookingsForUser(user);
  renderClientTakenSlots(date);

  alert("Prenotazione registrata.");
}

function renderClientBookingsForUser(user) {
  const box = document.getElementById("client-book-list");
  if (!box) return;
  let list = getAllBookings().filter((b) => b.clientId === user.id);

  if (list.length === 0) {
    box.innerHTML =
      '<div class="list-item">Nessuna prenotazione inserita.</div>';
    return;
  }

  list = list
    .slice()
    .sort(
      (a, b) =>
        new Date(a.date + "T" + a.time) - new Date(b.date + "T" + b.time)
    );

  box.innerHTML = "";
  list.forEach((b) => {
    const when = new Date(b.date + "T" + b.time).toLocaleString("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    const div = document.createElement("div");
    div.className = "list-item";
    div.innerHTML = `
      <div class="list-item-title">${when}</div>
      <div>${b.note || ""}</div>
    `;
    box.appendChild(div);
  });
}

function renderClientTakenSlots(date) {
  const box = document.getElementById("client-book-taken");
  if (!box) return;
  if (!date) {
    box.textContent = "Seleziona una data per vedere gli orari occupati.";
    return;
  }

  const list = getAllBookings().filter((b) => b.date === date);
  if (list.length === 0) {
    box.textContent = "Nessun orario occupato per questa data.";
    return;
  }

  const times = list
    .map((b) => b.time)
    .sort()
    .map((t) => t.slice(0, 5))
    .join(", ");

  box.textContent = "Orari già occupati: " + times;
}

/* Promozioni demo */

function ensureClientPromos() {
  let promos = loadJson(LS_CLIENT_PROMOS, null);
  if (!promos || promos.length === 0) {
    promos = [
      {
        id: uid(),
        title: "Yovis 10 flaconcini",
        desc: "Fermenti lattici – promo fedeltà",
        price: "€12,90",
        oldPrice: "€16,90",
      },
      {
        id: uid(),
        title: "Crema viso idratante",
        desc: "Linea dermocosmesi selezionata",
        price: "€19,90",
        oldPrice: "€24,90",
      },
    ];
    saveJson(LS_CLIENT_PROMOS, promos);
  }
}

function renderClientPromos() {
  const box = document.getElementById("client-promos");
  if (!box) return;
  const promos = loadJson(LS_CLIENT_PROMOS, []);
  if (promos.length === 0) {
    box.innerHTML = '<div class="list-item">Nessuna promozione attiva.</div>';
    return;
  }
  box.innerHTML = "";
  promos.forEach((p) => {
    const div = document.createElement("div");
    div.className = "list-item";
    div.innerHTML = `
      <div class="list-item-title">${p.title}</div>
      <div class="list-item-meta">${p.desc || ""}</div>
      <div><strong>${p.price}</strong> <span style="text-decoration:line-through; margin-left:6px;">${p.oldPrice || ""}</span></div>
    `;
    box.appendChild(div);
  });
}

/* ============================================
   AVVIO PAGINA
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {
  seedAdminIfNeeded();
  prefillLoginFromRemember();

  // Eventi per vista assenze admin
  const m = document.getElementById("abs-admin-month");
  if (m) m.addEventListener("change", renderAbsenceAdminMonthView);

  const eSel = document.getElementById("abs-admin-employee");
  if (eSel) eSel.addEventListener("change", renderAbsenceAdminHistory);

  const tSel = document.getElementById("abs-admin-type-filter");
  if (tSel) tSel.addEventListener("change", renderAbsenceAdminHistory);

  const active = loadJson(LS_ACTIVE, null);
  if (active) {
    openPortal(active);
  } else {
    showLogin();
  }
});
