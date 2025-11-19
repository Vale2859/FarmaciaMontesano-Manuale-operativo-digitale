/* ========================================================================
   PORTALE PROFESSIONALE FARMACIA MONTESANO – SCRIPT COMPLETO
   ======================================================================== */

/* -----------------------------------------------------------
   STORAGE KEYS
----------------------------------------------------------- */
const LS_USERS = "fm_users";
const LS_ACTIVE = "fm_activeUser";
const LS_MSGS = "fm_messages";
const LS_PROCS = "fm_procedures";
const LS_LEAVE = "fm_leave";
const LS_PERSONAL = "fm_personal";
const LS_TRAINING = "fm_training";
const LS_LOG = "fm_logistics";
const LS_NOTES = "fm_notes";

/* -----------------------------------------------------------
   UTILS
----------------------------------------------------------- */
function load(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function uid(prefix = "id") {
  return prefix + "_" + Date.now() + "_" + Math.floor(Math.random() * 999999);
}

/* -----------------------------------------------------------
   CREAZIONE ADMIN AUTOMATICA SE NON ESISTE
----------------------------------------------------------- */
function seedAdmin() {
  let users = load(LS_USERS, []);
  if (users.length === 0) {
    users.push({
      id: "admin1",
      name: "Valerio Montesano",
      email: "admin@farmaciamontesano.it",
      password: "admin123",
      role: "admin",
      active: true,
      createdAt: new Date().toISOString(),
    });
    save(LS_USERS, users);

    alert(
      "ADMIN CREATO AUTOMATICAMENTE:\nEmail: admin@farmaciamontesano.it\nPassword: admin123"
    );
  }
}

/* -----------------------------------------------------------
   LOGIN / REGISTRAZIONE
----------------------------------------------------------- */
function showRegister(ev) {
  ev.preventDefault();
  document.getElementById("login-box").classList.add("hidden");
  document.getElementById("register-box").classList.remove("hidden");
}

function showLogin(ev) {
  if (ev) ev.preventDefault();
  document.getElementById("login-box").classList.remove("hidden");
  document.getElementById("register-box").classList.add("hidden");
}

function registerUser() {
  const name = document.getElementById("reg-name").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const pass = document.getElementById("reg-password").value.trim();

  if (!name || !email || !pass) {
    alert("Compila tutti i campi.");
    return;
  }

  let users = load(LS_USERS, []);
  if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
    alert("Esiste già un account con questa email.");
    return;
  }

  users.push({
    id: uid("user"),
    name,
    email,
    password: pass,
    role: "dipendente",
    active: true,
    createdAt: new Date().toISOString(),
  });

  save(LS_USERS, users);
  alert("Account creato! Ora puoi effettuare il login.");
  showLogin();
}

function login() {
  const email = document.getElementById("login-email").value.trim();
  const pass = document.getElementById("login-password").value.trim();

  let users = load(LS_USERS, []);
  const user = users.find(
    (u) =>
      u.email.toLowerCase() === email.toLowerCase() &&
      u.password === pass &&
      u.active
  );

  if (!user) {
    alert("Credenziali errate o account disattivato.");
    return;
  }

  save(LS_ACTIVE, user);
  openPortal(user);
}

function logout() {
  localStorage.removeItem(LS_ACTIVE);
  document.getElementById("portal").classList.add("hidden");
  document.getElementById("auth").classList.remove("hidden");
  showLogin();
}

/* -----------------------------------------------------------
   APERTURA PORTALE DOPO LOGIN
----------------------------------------------------------- */
function openPortal(user) {
  document.getElementById("auth").classList.add("hidden");
  document.getElementById("portal").classList.remove("hidden");

  document.getElementById("user-name-display").textContent = user.name;
  document.getElementById("user-role-display").textContent =
    user.role === "admin" ? "Titolare / Admin" : "Dipendente";

  document.getElementById("home-title").textContent =
    "Ciao " + user.name + ", benvenuto nel portale";

  document.getElementById("user-info").innerHTML = `
    <strong>Nome:</strong> ${user.name}<br>
    <strong>Email:</strong> ${user.email}<br>
    <strong>Ruolo:</strong> ${user.role === "admin" ? "Titolare" : "Dipendente"}
  `;

  if (user.role === "admin") {
    document.getElementById("nav-admin").classList.remove("hidden");
    renderAdminUsers();
    renderAdminProcedures();
    renderAdminLeave();
    fillAdminMessageTargets();
  } else {
    document.getElementById("nav-admin").classList.add("hidden");
  }

  renderProcedures();
  renderMessages(user);
  loadLeaveForUser(user);
  loadTraining(user);
  loadPersonal(user);
  loadDashboard();

  showSection("home", document.getElementById("nav-home"));
}

/* -----------------------------------------------------------
   NAVIGAZIONE
----------------------------------------------------------- */
function showSection(id, btn) {
  document
    .querySelectorAll(".section")
    .forEach((s) => s.classList.remove("visible"));
  document.getElementById(id).classList.add("visible");

  document.querySelectorAll(".nav-btn").forEach((b) => b.classList.remove("active"));
  if (btn) btn.classList.add("active");
}

/* -----------------------------------------------------------
   PROCEDURE
----------------------------------------------------------- */
function seedProcedures() {
  let procs = load(LS_PROCS, []);

  if (procs.length === 0) {
    procs = [
      {
        id: uid("proc"),
        category: "Cassa",
        title: "Anticipi – i clienti pagano subito",
        body:
          "Il cliente paga subito l'importo. Quando porta la ricetta, emetti il ticket e restituisci la differenza dalla scatoletta sotto cassa.",
      },
      {
        id: uid("proc"),
        category: "Cassa",
        title: "Ticket – gestione ricette SSN",
        body:
          "Controlla i dati del paziente, applica il ticket corretto e verifica il codice fiscale.",
      },
      {
        id: uid("proc"),
        category: "POS",
        title: "POS collegato al gestionale",
        body:
          "Le vendite con carta vanno fatte partendo dal gestionale collegato al POS.",
      },
    ];
    save(LS_PROCS, procs);
  }
}

function renderProcedures() {
  seedProcedures();
  const procs = load(LS_PROCS, []);
  const categories = [...new Set(procs.map((p) => p.category))];

  const catBox = document.getElementById("proc-categories");
  catBox.innerHTML = "";

  categories.forEach((cat) => {
    const btn = document.createElement("button");
    btn.className = "proc-cat-btn";
    btn.textContent = cat;
    btn.onclick = () => renderProcedureList(cat);
    catBox.appendChild(btn);
  });

  if (categories.length > 0) renderProcedureList(categories[0]);
}

function renderProcedureList(category) {
  const procs = load(LS_PROCS, []);
  const list = document.getElementById("proc-list");
  list.innerHTML = "";

  procs
    .filter((p) => p.category === category)
    .forEach((p) => {
      const box = document.createElement("div");
      box.className = "list-item";
      box.innerHTML = `
        <div class="list-item-title">${p.title}</div>
        <div>${p.body}</div>
      `;
      list.appendChild(box);
    });
}

/* -----------------------------------------------------------
   MESSAGGI / COMUNICAZIONI
----------------------------------------------------------- */
function renderMessages(user) {
  const msgs = load(LS_MSGS, []);
  const container = document.getElementById("message-list");
  container.innerHTML = "";

  msgs
    .filter((m) => m.target === "all" || m.target === user.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .forEach((m) => {
      const div = document.createElement("div");
      div.className = "list-item";

      let priorityColor =
        m.priority === "alta"
          ? "tag-orange"
          : m.priority === "urgente"
          ? "tag-red"
          : "tag-green";

      div.innerHTML = `
        <div class="list-item-title">
          ${m.title} <span class="tag ${priorityColor}">${m.priority}</span>
        </div>
        <div class="list-item-meta">${new Date(m.createdAt).toLocaleString(
          "it-IT"
        )}</div>
        <div>${m.body}</div>
      `;
      container.appendChild(div);
    });
}

function fillAdminMessageTargets() {
  const users = load(LS_USERS, []);
  const sel = document.getElementById("admin-msg-target");
  sel.innerHTML = `<option value="all">Tutti</option>`;

  users.forEach((u) => {
    if (u.role !== "admin") {
      const opt = document.createElement("option");
      opt.value = u.id;
      opt.textContent = u.name;
      sel.appendChild(opt);
    }
  });
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

  const msgs = load(LS_MSGS, []);
  msgs.push({
    id: uid("msg"),
    title,
    body,
    target,
    priority,
    createdAt: new Date().toISOString(),
  });
  save(LS_MSGS, msgs);

  document.getElementById("admin-msg-title").value = "";
  document.getElementById("admin-msg-body").value = "";

  const active = load(LS_ACTIVE, null);
  if (active) renderMessages(active);

  alert("Comunicazione inviata.");
}

/* -----------------------------------------------------------
   FERIE & PERMESSI
----------------------------------------------------------- */
function sendLeaveRequest() {
  const user = load(LS_ACTIVE, null);
  if (!user) return;

  const type = document.getElementById("leave-type").value;
  const start = document.getElementById("leave-start").value;
  const end = document.getElementById("leave-end").value;
  const note = document.getElementById("leave-note").value.trim();

  if (!start) {
    alert("Inserisci almeno la data di inizio.");
    return;
  }

  let leaves = load(LS_LEAVE, []);
  leaves.push({
    id: uid("leave"),
    userId: user.id,
    userName: user.name,
    type,
    start,
    end,
    note,
    status: "in_attesa",
    createdAt: new Date().toISOString(),
  });
  save(LS_LEAVE, leaves);

  loadLeaveForUser(user);
  renderAdminLeave();

  alert("Richiesta inviata!");
}

function loadLeaveForUser(user) {
  const leaves = load(LS_LEAVE, []);
  const tbody = document.querySelector("#leave-table tbody");
  tbody.innerHTML = "";

  leaves
    .filter((l) => l.userId === user.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .forEach((l) => {
      const tr = document.createElement("tr");

      const period = l.end && l.end !== l.start ? `${l.start} → ${l.end}` : l.start;

      const statusTag =
        l.status === "approvata"
          ? `<span class="status-badge status-approved">Approvata</span>`
          : l.status === "rifiutata"
          ? `<span class="status-badge status-rejected">Rifiutata</span>`
          : `<span class="status-badge status-pending">In attesa</span>`;

      tr.innerHTML = `
        <td>${new Date(l.createdAt).toLocaleDateString("it-IT")}</td>
        <td>${l.type}</td>
        <td>${period}</td>
        <td>${statusTag}</td>
      `;
      tbody.appendChild(tr);
    });
}

function renderAdminLeave() {
  const leaves = load(LS_LEAVE, []);
  const list = document.getElementById("admin-leave-list");
  if (!list) return;
  list.innerHTML = "";

  leaves
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .forEach((l) => {
      const div = document.createElement("div");
      div.className = "list-item";

      let period = l.end && l.end !== l.start ? `${l.start} → ${l.end}` : l.start;

      let status =
        l.status === "approvata"
          ? `<span class="status-badge status-approved">Approvata</span>`
          : l.status === "rifiutata"
          ? `<span class="status-badge status-rejected">Rifiutata</span>`
          : `<span class="status-badge status-pending">In attesa</span>`;

      div.innerHTML = `
        <div class="list-item-title">${l.userName} (${l.type})</div>
        <div class="list-item-meta">${period} • Richiesta il ${new Date(
        l.createdAt
      ).toLocaleDateString("it-IT")}</div>
        <div>${l.note || ""}</div>
        <div class="admin-leave-status">${status}</div>
      `;

      if (l.status === "in_attesa") {
        const ok = document.createElement("button");
        ok.className = "btn-primary small";
        ok.textContent = "Approva";
        ok.onclick = () => updateLeaveStatus(l.id, "approvata");

        const no = document.createElement("button");
        no.className = "btn-primary small";
        no.textContent = "Rifiuta";
        no.onclick = () => updateLeaveStatus(l.id, "rifiutata");

        div.appendChild(ok);
        div.appendChild(no);
      }

      list.appendChild(div);
    });
}

function updateLeaveStatus(id, status) {
  let leaves = load(LS_LEAVE, []);
  const ix = leaves.findIndex((l) => l.id === id);
  if (ix >= 0) {
    leaves[ix].status = status;
    save(LS_LEAVE, leaves);
  }
  const user = load(LS_ACTIVE, null);
  if (user) loadLeaveForUser(user);
  renderAdminLeave();
}

/* -----------------------------------------------------------
   FORMAZIONE
----------------------------------------------------------- */
function loadTraining(user) {
  const notes = load(LS_TRAINING, {});
  document.getElementById("training-notes").value = notes[user.id] || "";

  document.getElementById("training-list").innerHTML = `
    <li>ECM consigliati</li>
    <li>Nuovi prodotti in farmacia</li>
    <li>Procedure aggiornate</li>
  `;
}

function saveTrainingNotes() {
  const user = load(LS_ACTIVE, null);
  if (!user) return;

  const notes = load(LS_TRAINING, {});
  notes[user.id] = document.getElementById("training-notes").value.trim();
  save(LS_TRAINING, notes);

  document.getElementById("training-saved").classList.remove("hidden");
  setTimeout(() => {
    document.getElementById("training-saved").classList.add("hidden");
  }, 2000);
}

/* -----------------------------------------------------------
   AREA PERSONALE PRIVATA
----------------------------------------------------------- */
function loadPersonal(user) {
  const notes = load(LS_PERSONAL, {});
  document.getElementById("personal-notes").value =
    notes[user.id]?.notes || "";

  const docs = notes[user.id]?.docs || [];
  const box = document.getElementById("personal-doc-list");
  box.innerHTML = "";
  docs.forEach((d) => {
    const div = document.createElement("div");
    div.className = "list-item";
    div.innerHTML = `<div class="list-item-title">${d.title}</div>
                     <div class="list-item-meta">${d.desc}</div>`;
    box.appendChild(div);
  });
}

function savePersonalNotes() {
  const user = load(LS_ACTIVE, null);
  const notes = load(LS_PERSONAL, {});
  if (!notes[user.id]) notes[user.id] = { notes: "", docs: [] };

  notes[user.id].notes = document.getElementById("personal-notes").value.trim();
  save(LS_PERSONAL, notes);

  document.getElementById("personal-notes-saved").classList.remove("hidden");
  setTimeout(() => {
    document.getElementById("personal-notes-saved").classList.add("hidden");
  }, 2000);
}

function addPersonalDoc() {
  const user = load(LS_ACTIVE, null);
  const title = document.getElementById("personal-doc-title").value.trim();
  const desc = document.getElementById("personal-doc-desc").value.trim();

  if (!title || !desc) {
    alert("Compila entrambi i campi.");
    return;
  }

  const notes = load(LS_PERSONAL, {});
  if (!notes[user.id]) notes[user.id] = { notes: "", docs: [] };

  notes[user.id].docs.push({ title, desc });
  save(LS_PERSONAL, notes);

  loadPersonal(user);
  document.getElementById("personal-doc-title").value = "";
  document.getElementById("personal-doc-desc").value = "";
}

/* -----------------------------------------------------------
   ADMIN – UTENTI
----------------------------------------------------------- */
function renderAdminUsers() {
  const users = load(LS_USERS, []);
  const box = document.getElementById("admin-users");
  box.innerHTML = "";

  users.forEach((u) => {
    const row = document.createElement("div");
    row.className = "list-item";

    row.innerHTML = `
      <div class="list-item-title">${u.name} ${
      u.role === "admin" ? "(Admin)" : ""
    }</div>
      <div class="list-item-meta">${u.email}</div>
      <div class="list-item-meta">Password: <strong>${u.password}</strong></div>
    `;

    if (u.role !== "admin") {
      const resetBtn = document.createElement("button");
      resetBtn.className = "btn-primary small";
      resetBtn.textContent = "Reset password";
      resetBtn.onclick = () => {
        const np = prompt("Nuova password per " + u.name);
        if (!np) return;
        u.password = np;
        save(LS_USERS, users);
        renderAdminUsers();
      };

      row.appendChild(resetBtn);
    }

    box.appendChild(row);
  });
}

/* -----------------------------------------------------------
   ADMIN – PROCEDURE
----------------------------------------------------------- */
function renderAdminProcedures() {
  const procs = load(LS_PROCS, []);
  const box = document.getElementById("admin-proc-list");
  box.innerHTML = "";

  procs.forEach((p) => {
    const div = document.createElement("div");
    div.className = "list-item";

    div.innerHTML = `
      <div class="list-item-title">${p.title}</div>
      <div class="list-item-meta">${p.category}</div>
      <div>${p.body.slice(0, 120)}...</div>
    `;

    const edit = document.createElement("button");
    edit.className = "btn-primary small";
    edit.textContent = "Modifica";
    edit.onclick = () => {
      document.getElementById("admin-proc-cat").value = p.category;
      document.getElementById("admin-proc-title").value = p.title;
      document.getElementById("admin-proc-body").value = p.body;
    };

    div.appendChild(edit);
    box.appendChild(div);
  });
}

function adminSaveProcedure() {
  const cat = document.getElementById("admin-proc-cat").value.trim();
  const title = document.getElementById("admin-proc-title").value.trim();
  const body = document.getElementById("admin-proc-body").value.trim();

  if (!cat || !title || !body) {
    alert("Completa tutti i campi.");
    return;
  }

  let procs = load(LS_PROCS, []);
  const existing = procs.find((p) => p.title.toLowerCase() === title.toLowerCase());

  if (existing) {
    existing.category = cat;
    existing.body = body;
  } else {
    procs.push({
      id: uid("proc"),
      category: cat,
      title,
      body,
    });
  }

  save(LS_PROCS, procs);
  renderProcedures();
  renderAdminProcedures();
  alert("Procedura aggiornata!");
}

/* -----------------------------------------------------------
   DASHBOARD
----------------------------------------------------------- */
function loadDashboard() {
  // Avvisi del giorno
  document.getElementById("home-highlights").innerHTML = `
    <li>Controllare scadenze banco OTC</li>
    <li>Nuova comunicazione del titolare</li>
    <li>Verificare turni della settimana</li>
  `;

  // Data
  const now = new Date();
  document.getElementById("home-daytag").textContent =
    now.toLocaleDateString("it-IT");

  // Procedure veloci
  const procs = load(LS_PROCS, []);
  const box = document.getElementById("home-quick-proc");
  box.innerHTML = "";

  procs.slice(0, 4).forEach((p) => {
    const btn = document.createElement("div");
    btn.className = "quick-btn";
    btn.textContent = p.title;
    btn.onclick = () => alert(p.body);
    box.appendChild(btn);
  });

  // Logistica
  document.getElementById("home-logistics-summary").innerHTML = `
    <li>Ritiro GLS: 12:00</li>
    <li>Ritiro SDA: 15:00</li>
    <li>Scadenze feb: 12 prodotti</li>
  `;
}

/* -----------------------------------------------------------
   AVVIO AUTOMATICO
----------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  seedAdmin();
  const active = load(LS_ACTIVE, null);
  if (active) openPortal(active);
  else showLogin();
});
