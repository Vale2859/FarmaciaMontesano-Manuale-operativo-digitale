/* ========================================================================
   PORTALE PROFESSIONALE FARMACIA MONTESANO – SCRIPT COMPLETO DEFINITIVO
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
   CONFIGURAZIONE ADMIN – MODIFICA QUI SE VUOI CAMBIARE LOGIN
----------------------------------------------------------- */
const ADMIN_EMAIL = "admin@farmaciamontesano.it";
const ADMIN_PASSWORD = "admin123";
const ADMIN_NAME = "Valerio Montesano";

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
   CREA / AGGIORNA L’ADMIN IN AUTOMATICO
----------------------------------------------------------- */
function seedAdmin() {
  // ⚠ ATTENZIONE: questo AZZERA tutti gli utenti esistenti
  // e ricrea solo l'admin da zero.
  const users = [
    {
      id: "admin1",
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: "admin",
      active: true,
      createdAt: new Date().toISOString(),
    },
  ];

  save(LS_USERS, users);
}
  save(LS_USERS, users);
}

/* ===========================================================
   LOGIN / REGISTRAZIONE
=========================================================== */

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

/* ===========================================================
   APERTURA PORTALE
=========================================================== */

function openPortal(user) {
  document.getElementById("auth").classList.add("hidden");
  document.getElementById("portal").classList.remove("hidden");

  document.getElementById("user-name-display").textContent = user.name;
  document.getElementById("user-role-display").textContent =
    user.role === "admin" ? "Titolare/Admin" : "Dipendente";

  document.getElementById("home-title").textContent =
    "Ciao " + user.name + ", benvenuto nel portale";

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

/* Sezione navigazione */
function showSection(id, btn) {
  document
    .querySelectorAll(".section")
    .forEach((s) => s.classList.remove("visible"));

  document.getElementById(id).classList.add("visible");

  document.querySelectorAll(".nav-btn").forEach((b) => b.classList.remove("active"));
  if (btn) btn.classList.add("active");
}

/* ===========================================================
   PROCEDURE
=========================================================== */

function seedProcedures() {
  let procs = load(LS_PROCS, []);
  if (procs.length === 0) {
    procs = [
      {
        id: uid("proc"),
        category: "Cassa",
        title: "Anticipi – cliente paga subito",
        body:
          "Il cliente paga subito. Quando porta la ricetta, fai il ticket e restituisci la differenza dalla scatoletta sotto cassa.",
      },
      {
        id: uid("proc"),
        category: "Cassa",
        title: "Ticket SSN",
        body: "Controlla codice fiscale, dati, applica ticket corretto.",
      },
      {
        id: uid("proc"),
        category: "POS",
        title: "POS collegato al gestionale",
        body: "Le vendite con carta si fanno dal gestionale collegato al POS.",
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

/* ===========================================================
   COMUNICAZIONI
=========================================================== */

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

      let priority =
        m.priority === "alta"
          ? "tag-orange"
          : m.priority === "urgente"
          ? "tag-red"
          : "tag-green";

      div.innerHTML = `
        <div class="list-item-title">${m.title} <span class="tag ${priority}">${m.priority}</span></div>
        <div class="list-item-meta">${new Date(m.createdAt).toLocaleString("it-IT")}</div>
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

  alert("Comunicazione inviata.");
  const active = load(LS_ACTIVE, null);
  if (active) renderMessages(active);

  document.getElementById("admin-msg-title").value = "";
  document.getElementById("admin-msg-body").value = "";
}

/* ===========================================================
   FERIE & PERMESSI
=========================================================== */

function sendLeaveRequest() {
  const user = load(LS_ACTIVE, null);
  if (!user) return;

  const type = document.getElementById("leave-type").value;
  const start = document.getElementById("leave-start").value;
  const end = document.getElementById("leave-end").value;
  const note = document.getElementById("leave-note").value.trim();

  if (!start) {
    alert("Inserisci almeno la data iniziale.");
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

      const period =
        l.end && l.end !== l.start ? `${l.start} → ${l.end}` : l.start;

      const status =
        l.status === "approvata"
          ? `<span class='status-badge status-approved'>Approvata</span>`
          : l.status === "rifiutata"
          ? `<span class='status-badge status-rejected'>Rifiutata</span>`
          : `<span class='status-badge status-pending'>In attesa</span>`;

      tr.innerHTML = `
        <td>${new Date(l.createdAt).toLocaleDateString("it-IT")}</td>
        <td>${l.type}</td>
        <td>${period}</td>
        <td>${status}</td>
      `;
      tbody.appendChild(tr);
    });
}

function renderAdminLeave() {
  const leaves = load(LS_LEAVE, []);
  const box = document.getElementById("admin-leave-list");
  box.innerHTML = "";

  leaves
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .forEach((l) => {
      const div = document.createElement("div");
      div.className = "list-item";

      const period =
        l.end && l.end !== l.start ? `${l.start} → ${l.end}` : l.start;

      const status =
        l.status === "approvata"
          ? `<span class='status-badge status-approved'>Approvata</span>`
          : l.status === "rifiutata"
          ? `<span class='status-badge status-rejected'>Rifiutata</span>`
          : `<span class='status-badge status-pending'>In attesa</span>`;

      div.innerHTML = `
        <div class='list-item-title'>${l.userName} (${l.type})</div>
        <div class='list-item-meta'>${period} • Richiesta il ${new Date(
        l.createdAt
      ).toLocaleDateString("it-IT")}</div>
        <div>${l.note || ""}</div>
        <div class='admin-leave-status'>${status}</div>
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

      box.appendChild(div);
    });
}

function updateLeaveStatus(id, status) {
  let leaves = load(LS_LEAVE, []);
  const ix = leaves.findIndex((l) => l.id === id);
  if (ix >= 0) leaves[ix].status = status;
  save(LS_LEAVE, leaves);

  const user = load(LS_ACTIVE, null);
  if (user) loadLeaveForUser(user);
  renderAdminLeave();
}

/* ===========================================================
   FORMAZIONE
=========================================================== */

function loadTraining(user) {
  const data = load(LS_TRAINING, {});
  document.getElementById("training-notes").value = data[user.id] || "";

  document.getElementById("training-list").innerHTML = `
    <li>ECM consigliati</li>
    <li>Nuovi prodotti</li>
    <li>Procedure aggiornate</li>
  `;
}

function saveTrainingNotes() {
  const user = load(LS_ACTIVE, null);
  const data = load(LS_TRAINING, {});
  data[user.id] = document.getElementById("training-notes").value.trim();
  save(LS_TRAINING, data);

  document.getElementById("training-saved").classList.remove("hidden");
  setTimeout(() => {
    document.getElementById("training-saved").classList.add("hidden");
  }, 2000);
}

/* ===========================================================
   AREA PERSONALE PRIVATA
=========================================================== */

function loadPersonal(user) {
  const data = load(LS_PERSONAL, {});
  document.getElementById("personal-notes").value =
    data[user.id]?.notes || "";

  const docs = data[user.id]?.docs || [];
  const box = document.getElementById("personal-doc-list");
  box.innerHTML = "";

  docs.forEach((d) => {
    const div = document.createElement("div");
    div.className = "list-item";
    div.innerHTML = `
      <div class='list-item-title'>${d.title}</div>
      <div class='list-item-meta'>${d.desc}</div>
    `;
    box.appendChild(div);
  });
}

function savePersonalNotes() {
  const user = load(LS_ACTIVE, null);
  const data = load(LS_PERSONAL, {});
  if (!data[user.id]) data[user.id] = { notes: "", docs: [] };

  data[user.id].notes = document.getElementById("personal-notes").value.trim();
  save(LS_PERSONAL, data);

  document
    .getElementById("personal-notes-saved")
    .classList.remove("hidden");
  setTimeout(() => {
    document
      .getElementById("personal-notes-saved")
      .classList.add("hidden");
  }, 2000);
}

function addPersonalDoc() {
  const user = load(LS_ACTIVE, null);
  const title = document.getElementById("personal-doc-title").value.trim();
  const desc = document.getElementById("personal-doc-desc").value.trim();

  if (!title || !desc) {
    alert("Compila tutti i campi.");
    return;
  }

  const data = load(LS_PERSONAL, {});
  if (!data[user.id]) data[user.id] = { notes: "", docs: [] };

  data[user.id].docs.push({ title, desc });
  save(LS_PERSONAL, data);

  loadPersonal(user);

  document.getElementById("personal-doc-title").value = "";
  document.getElementById("personal-doc-desc").value = "";
}

/* ===========================================================
   ADMIN – UTENTI
=========================================================== */

function renderAdminUsers() {
  const users = load(LS_USERS, []);
  const box = document.getElementById("admin-users");
  box.innerHTML = "";

  users.forEach((u) => {
    const row = document.createElement("div");
    row.className = "list-item";

    row.innerHTML = `
      <div class='list-item-title'>
        ${u.name} ${u.role === "admin" ? "(Admin)" : ""}
      </div>
      <div class='list-item-meta'>${u.email}</div>
      <div class='list-item-meta'>Password: <strong>${u.password}</strong></div>
    `;

    if (u.role !== "admin") {
      const reset = document.createElement("button");
      reset.className = "btn-primary small";
      reset.textContent = "Reset password";
      reset.onclick = () => {
        const np = prompt("Nuova password per " + u.name);
        if (!np) return;

        u.password = np;
        save(LS_USERS, users);
        renderAdminUsers();
      };

      row.appendChild(reset);
    }

    box.appendChild(row);
  });
}

/* ===========================================================
   ADMIN – PROCEDURE
=========================================================== */

function renderAdminProcedures() {
  const procs = load(LS_PROCS, []);
  const box = document.getElementById("admin-proc-list");
  box.innerHTML = "";

  procs.forEach((p) => {
    const div = document.createElement("div");
    div.className = "list-item";

    div.innerHTML = `
      <div class='list-item-title'>${p.title}</div>
      <div class='list-item-meta'>${p.category}</div>
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
  const existing = procs.find(
    (p) => p.title.toLowerCase() === title.toLowerCase()
  );

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

/* ===========================================================
   DASHBOARD
=========================================================== */

function loadDashboard() {
  document.getElementById("home-highlights").innerHTML = `
    <li>Controllare scadenze banco OTC</li>
    <li>Nuova comunicazione da leggere</li>
    <li>Verificare turni della settimana</li>
  `;

  document.getElementById("home-daytag").textContent =
    new Date().toLocaleDateString("it-IT");

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

  document.getElementById("home-logistics-summary").innerHTML = `
    <li>Ritiro GLS: 12:00</li>
    <li>Ritiro SDA: 15:00</li>
    <li>Scadenze sensibili: 12 prodotti</li>
  `;
}

/* ===========================================================
   AVVIO PORTALE
=========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  seedAdmin();

  const active = load(LS_ACTIVE, null);
  if (active) openPortal(active);
  else showLogin();
});
