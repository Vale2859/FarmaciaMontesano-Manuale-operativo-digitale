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
const LS_BOOKINGS = "fm_bookings";
const LS_REMEMBER = "fm_rememberLogin";

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
      email: adminEmail,
      phone: "",
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
    showError("Compila almeno nome, email e password.");
    return;
  }

  let users = loadUsers();
  if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
    showError("Esiste già un utente con questa email.");
    return;
  }

  let approved = false;
  let active = false;

  if (role === "cliente") {
    // i clienti possono accedere subito
    approved = true;
    active = true;
  }

  users.push({
    id: uid(),
    name,
    phone,
    email,
    password: pass,
    role,
    active,
    approved,
    createdAt: new Date().toISOString(),
  });

  saveUsers(users);

  if (role === "cliente") {
    alert("Registrazione completata! Puoi accedere subito all'area clienti.");
  } else {
    alert(
      "Richiesta inviata! L'account dovrà essere approvato dal Titolare prima di poter accedere."
    );
  }

  showLogin();
}

/* Login */
function login() {
  const email = document.getElementById("login-email").value.trim();
  const pass = document.getElementById("login-password").value;
  const remember = document.getElementById("login-remember");

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

  // Ricorda credenziali
  if (remember && remember.checked) {
    saveJson(LS_REMEMBER, { email, password: pass });
  } else {
    localStorage.removeItem(LS_REMEMBER);
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
   PORTALE & NAVIGAZIONE
   ============================================ */

function openPortal(user) {
  document.getElementById("auth").classList.add("hidden");
  document.getElementById("portal").classList.remove("hidden");

  const nameEl = document.getElementById("user-name-display");
  const roleEl = document.getElementById("user-role-display");
  const subtitleEl = document.getElementById("topbar-subtitle");
  const adminTile = document.getElementById("tile-admin");

  if (nameEl) nameEl.textContent = user.name;
  if (roleEl) {
    if (user.role === "admin") roleEl.textContent = "Titolare";
    else if (user.role === "dipendente") roleEl.textContent = "Dipendente";
    else roleEl.textContent = "Cliente";
  }

  if (subtitleEl) {
    if (user.role === "cliente") {
      subtitleEl.textContent = "Area Clienti";
    } else {
      subtitleEl.textContent = "Portale professionale interno";
    }
  }

  if (adminTile) {
    if (user.role === "admin") adminTile.classList.remove("hidden");
    else adminTile.classList.add("hidden");
  }

  // Reset visibilità sezioni
  const sections = document.querySelectorAll(".section");
  sections.forEach((s) => s.classList.remove("visible"));

  if (user.role === "cliente") {
    const ch = document.getElementById("client-home");
    if (ch) ch.classList.add("visible");

    renderClientPromos();
    renderClientBookings(user);
  } else {
    const sh = document.getElementById("home");
    if (sh) sh.classList.add("visible");

    // dipendenti + admin
    initHome(user);
    renderProcedures();
    renderMessages(user);
    renderLogistics();
    loadPersonalData(user);
    renderLeaveTable(user);
    renderTraining(user);
    renderApprovedAbsences();

    if (user.role === "admin") {
      renderAdminUsers();
      renderAdminProceduresList();
      renderAdminLeaveList();
      populateMessageTargets();
    }
  }

  showAppScreen("home");
}

// Pulsante Home globale
function goHome() {
  const active = loadJson(LS_ACTIVE, null);
  if (!active) {
    showLogin();
    return;
  }

  openPortal(active);
}

/* Cambio sezione "grande" */
function showSection(id, btn) {
  const sections = document.querySelectorAll(".section");
  sections.forEach((s) => s.classList.remove("visible"));

  const target = document.getElementById(id);
  if (target) target.classList.add("visible");

  const buttons = document.querySelectorAll(".nav-btn");
  buttons.forEach((b) => b.classList.remove("active"));
  if (btn) btn.classList.add("active");
}

/* ============================================
   DASHBOARD / HOME DIPENDENTI
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
  // Al momento non usiamo ancora home-daytag/home-highlights,
  // ma lasciamo la logica se in futuro li aggiungiamo in HTML.
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

  renderHomeLeaveSummary(user);
  renderHomeLogisticsSummary();
  renderHomeLastMessages(user);
}

/* Pulsante dalla home alle procedure specifiche */
function openProcedureFromHome(cat, title) {
  showSection("procedures");
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
    case "malattia":
      return "Malattia";
    default:
      return t || "-";
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

/* ======= SUPER DASHBOARD ASSENZE – ADMIN ======= */

let ADMIN_LEAVE_SELECTED_USER = null;

function renderAdminLeaveList(selectedUserId) {
  const monthInput = document.getElementById("admin-leave-month");
  const typeSelect = document.getElementById("admin-leave-type-filter");
  const searchInput = document.getElementById("admin-leave-search");
  const monthListEl = document.getElementById("admin-leave-month-list");
  const usersBox = document.getElementById("admin-leave-users");
  const historyTitle = document.getElementById("admin-leave-history-title");
  const historyList = document.getElementById("admin-leave-history-list");

  if (
    !monthInput ||
    !typeSelect ||
    !searchInput ||
    !monthListEl ||
    !usersBox ||
    !historyTitle ||
    !historyList
  ) {
    return;
  }

  let all = loadJson(LS_LEAVE, []);
  if (!Array.isArray(all)) all = [];

  if (!monthInput.value) {
    const now = new Date();
    monthInput.value = now.toISOString().slice(0, 7);
  }

  const [yStr, mStr] = (monthInput.value || "").split("-");
  const year = parseInt(yStr, 10);
  const month = parseInt(mStr, 10);

  const typeFilter = typeSelect.value;
  const query = searchInput.value.trim().toLowerCase();

  let filtered = all.filter((r) => {
    if (typeFilter !== "tutti" && r.type !== typeFilter) return false;

    if (query) {
      const hay =
        (r.userName || "") + " " + (r.note || "") + " " + (r.type || "");
      if (!hay.toLowerCase().includes(query)) return false;
    }

    return true;
  });

  // ---- assenze nel mese selezionato ----
  function overlapsMonth(rec, year, month) {
    if (!year || !month) return true;

    if (!rec.start) return false;
    const start = new Date(rec.start);
    const end = rec.end ? new Date(rec.end) : new Date(rec.start);

    const monthStart = new Date(year, month - 1, 1);
    const monthEnd = new Date(year, month, 0);

    return end >= monthStart && start <= monthEnd;
  }

  const monthly = filtered.filter((r) => overlapsMonth(r, year, month));

  if (monthly.length === 0) {
    monthListEl.innerHTML =
      "<div class='list-item'>Nessuna assenza per il mese selezionato.</div>";
  } else {
    monthly.sort((a, b) => new Date(a.start) - new Date(b.start));
    monthListEl.innerHTML = monthly
      .map((r) => {
        const periodo = r.end
          ? `${r.start} → ${r.end}`
          : r.start || "-";

        const statusClass =
          r.status === "approvato"
            ? "leave-status-approvato"
            : r.status === "rifiutato"
            ? "leave-status-rifiutato"
            : "leave-status-attesa";

        const statusLabel = formatLeaveStatus(r.status);

        return `
          <div class="list-item">
            <div class="list-item-title">
              <span>${r.userName || "-"} – ${formatLeaveType(r.type)}</span>
              <span class="leave-status-pill ${statusClass}">${statusLabel}</span>
            </div>
            <div class="list-item-meta">
              ${periodo}
            </div>
            <div>${r.note || ""}</div>
            <div style="margin-top:6px; display:flex; flex-wrap:wrap; gap:6px;">
              <button class="btn-primary small" onclick="adminSetLeaveStatus('${
                r.id
              }','approvato')">Approva</button>
              <button class="btn-primary small" style="background:#fee2e2;color:#991b1b;box-shadow:none;"
                onclick="adminSetLeaveStatus('${r.id}','rifiutato')">Rifiuta</button>
              <button class="btn-primary small" style="background:#e5e7eb;color:#111827;box-shadow:none;"
                onclick="adminDeleteLeave('${r.id}')">Cancella</button>
            </div>
          </div>
        `;
      })
      .join("");
  }

  // ---- colonna destra: dipendenti + storico ----
  const usersMap = {};
  filtered.forEach((r) => {
    if (!r.userId) return;
    if (!usersMap[r.userId]) {
      usersMap[r.userId] = {
        id: r.userId,
        name: r.userName || r.userId,
      };
    }
  });

  const usersArr = Object.values(usersMap).sort((a, b) =>
    a.name.localeCompare(b.name, "it")
  );

  if (!selectedUserId && usersArr.length > 0) {
    selectedUserId = usersArr[0].id;
  }
  ADMIN_LEAVE_SELECTED_USER = selectedUserId || null;

  if (usersArr.length === 0) {
    usersBox.innerHTML =
      "<p class='small-text'>Nessun dipendente con richieste di assenza.</p>";
  } else {
    usersBox.innerHTML = usersArr
      .map((u) => {
        const activeClass =
          u.id === ADMIN_LEAVE_SELECTED_USER ? " active" : "";
        return `<button class="admin-leave-user-btn${activeClass}" onclick="adminSelectLeaveUser('${u.id}')">
            ${u.name}
          </button>`;
      })
      .join("");
  }

  const selectedUser =
    usersArr.find((u) => u.id === ADMIN_LEAVE_SELECTED_USER) || null;

  if (selectedUser) {
    historyTitle.textContent = "Storico assenze – " + selectedUser.name;
  } else {
    historyTitle.textContent = "Storico assenze";
  }

  const historyRecs = filtered
    .filter((r) => r.userId === ADMIN_LEAVE_SELECTED_USER)
    .sort((a, b) => new Date(b.start) - new Date(a.start));

  if (!selectedUser || historyRecs.length === 0) {
    historyList.innerHTML =
      "<div class='list-item'>Nessuna assenza trovata per questo dipendente.</div>";
  } else {
    historyList.innerHTML = historyRecs
      .map((r) => {
        const periodo = r.end
          ? `${r.start} → ${r.end}`
          : r.start || "-";

        const statusClass =
          r.status === "approvato"
            ? "leave-status-approvato"
            : r.status === "rifiutato"
            ? "leave-status-rifiutato"
            : "leave-status-attesa";

        const statusLabel = formatLeaveStatus(r.status);

        return `
          <div class="list-item">
            <div class="list-item-title">
              <span>${formatLeaveType(r.type)}</span>
              <span class="leave-status-pill ${statusClass}">${statusLabel}</span>
            </div>
            <div class="list-item-meta">
              ${periodo}
            </div>
            <div>${r.note || ""}</div>
            <div style="margin-top:6px; display:flex; flex-wrap:wrap; gap:6px;">
              <button class="btn-primary small" onclick="adminSetLeaveStatus('${
                r.id
              }','approvato')">Approva</button>
              <button class="btn-primary small" style="background:#fee2e2;color:#991b1b;box-shadow:none;"
                onclick="adminSetLeaveStatus('${r.id}','rifiutato')">Rifiuta</button>
              <button class="btn-primary small" style="background:#e5e7eb;color:#111827;box-shadow:none;"
                onclick="adminDeleteLeave('${r.id}')">Cancella</button>
            </div>
          </div>
        `;
      })
      .join("");
  }
}

function adminSelectLeaveUser(userId) {
  ADMIN_LEAVE_SELECTED_USER = userId;
  renderAdminLeaveList(userId);
}

function adminDeleteLeave(id) {
  let all = loadJson(LS_LEAVE, []);
  all = all.filter((r) => r.id !== id);
  saveJson(LS_LEAVE, all);

  const active = loadJson(LS_ACTIVE, null);
  if (active) {
    renderLeaveTable(active);
    if (active.role === "admin") {
      renderAdminLeaveList(ADMIN_LEAVE_SELECTED_USER);
    }
    renderHomeLeaveSummary(active);
  }
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
    if (active.role === "admin") {
      renderAdminLeaveList(ADMIN_LEAVE_SELECTED_USER);
    }
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
  const users = loadUsers().filter((u) => u.role !== "cliente"); // solo staff
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
        Ruolo: ${u.role === "admin" ? "Titolare" : "Dipendente"}
      </div>
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
   LOGIN – mostra/nascondi password
   ============================================ */

function togglePassword() {
  const input = document.getElementById("login-password");
  if (!input) return;
  input.type = input.type === "password" ? "text" : "password";
}

/* ============================================
   APP INTERNA (HOME / ASSENZE – DIPENDENTI)
   ============================================ */

function showAppScreen(which) {
  const home = document.getElementById("screen-home");
  const ass = document.getElementById("screen-assenze");
  const btnHome = document.getElementById("nav-app-home");

  if (!home || !ass) return;

  if (which === "assenze") {
    home.classList.remove("app-screen-visible");
    ass.classList.add("app-screen-visible");
  } else {
    ass.classList.remove("app-screen-visible");
    home.classList.add("app-screen-visible");
  }

  if (btnHome) {
    if (which === "home") btnHome.classList.add("app-nav-btn-active");
    else btnHome.classList.remove("app-nav-btn-active");
  }
}

// Assenze veloci
function loadAbsences() {
  return loadJson(LS_ABSENCES, []);
}

function saveAbsences(list) {
  saveJson(LS_ABSENCES, list);
}

function submitAbsence() {
  const user = loadJson(LS_ACTIVE, null);
  if (!user) {
    alert("Devi essere loggato per richiedere un'assenza.");
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
    status: "approved",
  });
  saveAbsences(absences);

  dateEl.value = "";
  reasonEl.value = "";

  renderApprovedAbsences();
  alert("Richiesta assenza registrata (approvata e visibile a tutti).");
}

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
    const isFerie = reason.toLowerCase().includes("ferie");

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

/* ============================================
   AREA CLIENTI – PROMO + PRENOTAZIONI
   ============================================ */

function renderClientPromos() {
  const box = document.getElementById("client-promos");
  if (!box) return;

  // Finti dati – personalizzabili
  const promos = [
    {
      title: "Yovis 10 flaconcini",
      desc: "Fermenti lattici – Promo benessere intestinale",
      price: "€ 14,90",
      oldPrice: "€ 19,90",
    },
    {
      title: "Misurazione pressione gratuita",
      desc: "Su prenotazione in farmacia",
      price: "Servizio gratuito",
      oldPrice: "",
    },
    {
      title: "Dermocosmesi Uriage",
      desc: "Linea viso in promo -20%",
      price: "-20%",
      oldPrice: "",
    },
  ];

  box.innerHTML = promos
    .map(
      (p) => `
      <div class="list-item">
        <div class="list-item-title">${p.title}</div>
        <div class="list-item-meta">${p.desc}</div>
        <div><strong>${p.price}</strong> ${
        p.oldPrice ? `<span style="text-decoration:line-through; margin-left:4px;">${p.oldPrice}</span>` : ""
      }</div>
      </div>
    `
    )
    .join("");
}

// slot orari (esempio ogni 30 minuti dalle 9 alle 19)
const CLIENT_TIME_SLOTS = [
  "09:00","09:30","10:00","10:30","11:00","11:30",
  "12:00","12:30","15:30","16:00","16:30","17:00",
  "17:30","18:00","18:30","19:00"
];

function updateClientTimeOptions() {
  const dateInput = document.getElementById("client-date");
  const select = document.getElementById("client-time");
  if (!dateInput || !select) return;

  const date = dateInput.value;
  select.innerHTML = "";

  if (!date) {
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = "Seleziona prima un giorno";
    select.appendChild(opt);
    return;
  }

  const bookings = loadJson(LS_BOOKINGS, []);

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Seleziona orario";
  select.appendChild(placeholder);

  CLIENT_TIME_SLOTS.forEach((slot) => {
    const taken = bookings.some(
      (b) => b.date === date && b.time === slot
    );
    const opt = document.createElement("option");
    opt.value = slot;
    opt.textContent = taken ? `${slot} (occupato)` : slot;
    opt.disabled = taken;
    select.appendChild(opt);
  });
}

function clientBookSlot() {
  const user = loadJson(LS_ACTIVE, null);
  if (!user || user.role !== "cliente") {
    alert("Devi essere loggato come cliente.");
    return;
  }

  const date = document.getElementById("client-date").value;
  const time = document.getElementById("client-time").value;
  const note = document.getElementById("client-note").value.trim();

  if (!date || !time) {
    alert("Seleziona giorno e orario.");
    return;
  }

  let bookings = loadJson(LS_BOOKINGS, []);

  // blocca doppi appuntamenti sulla stessa fascia per chiunque
  const already = bookings.find(
    (b) => b.date === date && b.time === time
  );
  if (already) {
    alert("Questa fascia oraria è già occupata. Scegli un altro orario.");
    updateClientTimeOptions();
    return;
  }

  bookings.push({
    id: uid(),
    userId: user.id,
    userName: user.name,
    date,
    time,
    note,
    createdAt: new Date().toISOString(),
  });

  saveJson(LS_BOOKINGS, bookings);

  document.getElementById("client-note").value = "";
  updateClientTimeOptions();
  renderClientBookings(user);
  alert("Prenotazione registrata.");
}

function renderClientBookings(user) {
  const box = document.getElementById("client-bookings");
  if (!box) return;

  let bookings = loadJson(LS_BOOKINGS, []);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  bookings = bookings.filter((b) => b.userId === user.id);

  // solo future o odierne
  bookings = bookings.filter((b) => {
    const d = new Date(b.date);
    d.setHours(0, 0, 0, 0);
    return d >= today;
  });

  bookings.sort((a, b) => {
    const da = new Date(a.date + "T" + a.time);
    const db = new Date(b.date + "T" + b.time);
    return da - db;
  });

  if (bookings.length === 0) {
    box.innerHTML =
      "<div class='list-item'>Nessuna prenotazione futura.</div>";
    return;
  }

  box.innerHTML = bookings
    .map((b) => {
      const d = new Date(b.date);
      const dateLabel = d.toLocaleDateString("it-IT", {
        weekday: "short",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      return `
        <div class="list-item">
          <div class="list-item-title">
            <span>${dateLabel}</span>
            <span>${b.time}</span>
          </div>
          <div class="list-item-meta">
            Prenotato il ${new Date(b.createdAt).toLocaleDateString("it-IT", {
              day: "2-digit",
              month: "2-digit",
            })}
          </div>
          <div>${b.note || "Nessuna nota"}</div>
        </div>
      `;
    })
    .join("");
}

/* ============================================
   AVVIO PAGINA
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {
  seedAdminIfNeeded();
  ensureDemoProcedures();
  ensureDemoMessages();

  // Ricorda credenziali (se salvate)
  const savedCreds = loadJson(LS_REMEMBER, null);
  if (savedCreds) {
    const le = document.getElementById("login-email");
    const lp = document.getElementById("login-password");
    const chk = document.getElementById("login-remember");
    if (le) le.value = savedCreds.email || "";
    if (lp) lp.value = savedCreds.password || "";
    if (chk) chk.checked = true;
  }

  // Inizializza filtri dashboard assenze Admin
  const m = document.getElementById("admin-leave-month");
  const t = document.getElementById("admin-leave-type-filter");
  const s = document.getElementById("admin-leave-search");

  if (m && t && s) {
    const now = new Date();
    m.value = now.toISOString().slice(0, 7);

    m.addEventListener("change", () =>
      renderAdminLeaveList(ADMIN_LEAVE_SELECTED_USER)
    );
    t.addEventListener("change", () =>
      renderAdminLeaveList(ADMIN_LEAVE_SELECTED_USER)
    );
    s.addEventListener("input", () =>
      renderAdminLeaveList(ADMIN_LEAVE_SELECTED_USER)
    );
  }

  // Cambio orario: aggiorna lista slot disponibili
  const clientDate = document.getElementById("client-date");
  if (clientDate) {
    clientDate.addEventListener("change", updateClientTimeOptions);
  }

  const active = loadJson(LS_ACTIVE, null);
  if (active) {
    openPortal(active);
  } else {
    showLogin();
  }
});
