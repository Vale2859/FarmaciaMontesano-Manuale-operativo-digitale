// Chiavi di localStorage
const LS_USERS = "fm_users";
const LS_ACTIVE = "fm_active_user";
const LS_REQUESTS = "fm_access_requests";
const LS_DOCS = "fm_documents";
const LS_BOARD = "fm_board_note";
const LS_NOTES_PREFIX = "fm_notes_";

// --------- HELPER STORAGE ---------

function loadJson(key, defaultValue) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

function saveJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// --------- UI AUTH ---------

function showLogin() {
  document.getElementById("login-box").classList.remove("hidden-block");
  document.getElementById("register-box").classList.add("hidden-block");
  document.getElementById("reset-box").classList.add("hidden-block");
  hideAuthError();
}

function showRegister() {
  document.getElementById("login-box").classList.add("hidden-block");
  document.getElementById("register-box").classList.remove("hidden-block");
  document.getElementById("reset-box").classList.add("hidden-block");
  hideAuthError();
}

function showReset() {
  document.getElementById("login-box").classList.add("hidden-block");
  document.getElementById("register-box").classList.add("hidden-block");
  document.getElementById("reset-box").classList.remove("hidden-block");
  hideAuthError();
}

function showAuthError(msg) {
  const el = document.getElementById("auth-error");
  el.textContent = msg;
  el.style.display = "block";
}

function hideAuthError() {
  const el = document.getElementById("auth-error");
  el.textContent = "";
  el.style.display = "none";
}

// --------- ADMIN SEED (crea account titolare la prima volta) ---------

function seedAdminIfNeeded() {
  let users = loadJson(LS_USERS, []);
  if (users.length === 0) {
    const adminUser = {
      id: "admin-1",
      name: "Valerio Montesano",
      email: "admin@farmaciamontesano.it",
      password: "admin123", // cambia appena entri
      role: "admin",
      status: "attivo",
    };
    users.push(adminUser);
    saveJson(LS_USERS, users);
    alert(
      "Creato utente amministratore:\nEmail: admin@farmaciamontesano.it\nPassword: admin123\nCambia subito la password dal pannello 'Reimposta password'."
    );
  }
}

// --------- REGISTRAZIONE / RICHIESTA ACCESSO ---------

function sendAccessRequest() {
  const name = document.getElementById("reg-name").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const note = document.getElementById("reg-note").value.trim();

  if (!name || !email) {
    showAuthError("Inserisci almeno nome e email.");
    return;
  }

  const requests = loadJson(LS_REQUESTS, []);
  const exists = requests.find(
    (r) => r.email.toLowerCase() === email.toLowerCase() && r.status === "pending"
  );
  if (exists) {
    showAuthError("Hai già una richiesta in attesa di approvazione.");
    return;
  }

  const req = {
    id: "req-" + Date.now(),
    name,
    email,
    note,
    createdAt: new Date().toISOString(),
    status: "pending",
  };
  requests.push(req);
  saveJson(LS_REQUESTS, requests);

  alert(
    "Richiesta inviata.\nIl titolare dovrà approvarla e impostare una password per te."
  );
  document.getElementById("reg-name").value = "";
  document.getElementById("reg-email").value = "";
  document.getElementById("reg-note").value = "";
  showLogin();
}

// --------- LOGIN ---------

function login() {
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;

  const users = loadJson(LS_USERS, []);
  const user = users.find(
    (u) =>
      u.email.toLowerCase() === email.toLowerCase() &&
      u.password === password &&
      u.status === "attivo"
  );

  if (!user) {
    showAuthError(
      "Credenziali non valide oppure account non approvato. Contatta il titolare."
    );
    return;
  }

  saveJson(LS_ACTIVE, user);
  initPortal(user);
}

// --------- RESET PASSWORD ---------

function resetPassword() {
  const email = document.getElementById("reset-email").value.trim();
  const pwd = document.getElementById("reset-password").value;
  const pwd2 = document.getElementById("reset-password-confirm").value;

  if (!email || !pwd || !pwd2) {
    showAuthError("Compila tutti i campi per reimpostare la password.");
    return;
  }

  if (pwd !== pwd2) {
    showAuthError("Le password non coincidono.");
    return;
  }

  let users = loadJson(LS_USERS, []);
  const index = users.findIndex(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );

  if (index === -1) {
    showAuthError("Nessun utente registrato con questa email.");
    return;
  }

  users[index].password = pwd;
  saveJson(LS_USERS, users);

  alert("Password aggiornata! Ora effettua il login con la nuova password.");
  showLogin();
}

// --------- LOGOUT ---------

function logout() {
  localStorage.removeItem(LS_ACTIVE);
  document.getElementById("portal").classList.add("hidden");
  document.getElementById("auth-screen").classList.remove("hidden");
  document.getElementById("login-email").value = "";
  document.getElementById("login-password").value = "";
}

// --------- INIZIALIZZA PORTALE ---------

function initPortal(user) {
  document.getElementById("auth-screen").classList.add("hidden");
  document.getElementById("portal").classList.remove("hidden");

  document.getElementById("user-name-display").textContent = user.name;
  document.getElementById("user-role-display").textContent =
    user.role === "admin" ? "Admin / Titolare" : "Dipendente";

  const title = document.getElementById("home-title");
  title.textContent = `Ciao ${user.name}, benvenuto nel Portale Interno`;

  // mostra voci admin se admin
  const adminButtons = document.querySelectorAll(".admin-only");
  adminButtons.forEach((btn) => {
    if (user.role === "admin") {
      btn.classList.remove("hidden-block");
    } else {
      btn.classList.add("hidden-block");
    }
  });

  // Carica contenuti
  loadProcedures();
  loadMessages();
  loadBoard();
  loadPersonalNotes(user);
  loadUserDocuments(user);

  if (user.role === "admin") {
    renderAccessRequests();
    renderUsers();
    renderDocuments();
    populateDocTargetSelect();
  }

  activateNavButton(document.getElementById("nav-home"));
  showOnlySection("home");
}

// --------- NAVIGAZIONE SEZIONI ---------

function showSection(sectionId, btn) {
  showOnlySection(sectionId);
  activateNavButton(btn);
}

function showOnlySection(sectionId) {
  document
    .querySelectorAll(".section")
    .forEach((sec) => sec.classList.remove("visible"));
  document.getElementById(sectionId).classList.add("visible");
}

function activateNavButton(btn) {
  document
    .querySelectorAll(".nav-btn")
    .forEach((b) => b.classList.remove("active"));
  if (btn) btn.classList.add("active");
}

// --------- BACHECA CONDIVISA ---------

function loadBoard() {
  const text = localStorage.getItem(LS_BOARD) || "";
  const el = document.getElementById("board-text");
  if (el) el.value = text;
}

function saveBoard() {
  const text = document.getElementById("board-text").value;
  localStorage.setItem(LS_BOARD, text);
  const label = document.getElementById("board-saved");
  label.style.display = "inline";
  setTimeout(() => (label.style.display = "none"), 1200);
}

// --------- APPUNTI PERSONALI ---------

function getNotesKeyForUser(user) {
  return LS_NOTES_PREFIX + user.id;
}

function loadPersonalNotes(user) {
  const key = getNotesKeyForUser(user);
  const text = localStorage.getItem(key) || "";
  const el = document.getElementById("notes-text");
  if (el) el.value = text;
}

function savePersonalNotes() {
  const user = loadJson(LS_ACTIVE, null);
  if (!user) return;
  const key = getNotesKeyForUser(user);
  const text = document.getElementById("notes-text").value;
  localStorage.setItem(key, text);
  const label = document.getElementById("notes-saved");
  label.style.display = "inline";
  setTimeout(() => (label.style.display = "none"), 1200);
}

// --------- PROCEDURE DEMO ---------

function loadProcedures() {
  const procedures = [
    {
      title: "Anticipi – i clienti pagano subito",
      important: true,
      meta: "Cassa / Ricette SSN",
      text:
        "Il cliente paga subito l'importo del farmaco. Quando porta la ricetta, si emette il ticket e si restituisce l'eventuale differenza dalla scatoletta sotto cassa.",
    },
    {
      title: "Scontrino POS – niente vendite manuali",
      important: true,
      meta: "POS / Gestionale",
      text:
        "Le vendite con carta vanno sempre fatte partendo dal gestionale collegato al POS. Evitare lo scontrino manuale sul POS, salvo emergenze.",
    },
    {
      title: "Sotto cassa – gestione contanti",
      important: false,
      meta: "Cassa",
      text:
        "Eventuali anticipi o differenze da restituire vanno sempre messi nella scatoletta sotto cassa, con bigliettino di riferimento se necessario.",
    },
    {
      title: "Codice fiscale obbligatorio",
      important: false,
      meta: "Ticket / Detrazione",
      text:
        "Per le spese detraibili, controllare sempre il codice fiscale del cliente prima di chiudere lo scontrino.",
    },
  ];

  const container = document.getElementById("procedure-list");
  container.innerHTML = "";

  procedures.forEach((p) => {
    const div = document.createElement("div");
    div.className = "list-item";

    const titleRow = document.createElement("div");
    titleRow.className = "list-item-title";

    if (p.important) {
      const badge = document.createElement("span");
      badge.className = "badge-important";
      badge.textContent = "IMPORTANTE";
      titleRow.appendChild(badge);
    }

    const spanTitle = document.createElement("span");
    spanTitle.textContent = p.title;
    titleRow.appendChild(spanTitle);

    const meta = document.createElement("div");
    meta.className = "list-item-meta";
    meta.textContent = p.meta;

    const text = document.createElement("div");
    text.textContent = p.text;

    div.appendChild(titleRow);
    div.appendChild(meta);
    div.appendChild(text);

    container.appendChild(div);
  });
}

// --------- COMUNICAZIONI DEMO ---------

function loadMessages() {
  const messages = [
    {
      title: "Controllare incassi turno mattina",
      when: "Oggi",
      text:
        "Al cambio turno verificare che il contante in cassa coincida con il totale gestionale.",
    },
    {
      title: "Arrivato ordine Uriage",
      when: "Ieri",
      text:
        "Controllare i colli e sistemare i prodotti in esposizione promo vicino alla vetrina.",
    },
    {
      title: "Nuove regole anticipi ASL",
      when: "Questa settimana",
      text:
        "Le nuove procedure sono caricate nella sezione 'Procedure interne'. Tutti i collaboratori devono leggerle.",
    },
    {
      title: "POS lento – riavviare prima di chiamare assistenza",
      when: "Nota fissa",
      text:
        "Se il POS non comunica con il gestionale, riavviare prima il POS, poi il PC, e solo dopo contattare l'assistenza.",
    },
  ];

  const container = document.getElementById("message-list");
  container.innerHTML = "";

  messages.forEach((m) => {
    const div = document.createElement("div");
    div.className = "list-item";

    const title = document.createElement("div");
    title.className = "list-item-title";
    title.textContent = m.title;

    const meta = document.createElement("div");
    meta.className = "list-item-meta";
    meta.textContent = m.when;

    const text = document.createElement("div");
    text.textContent = m.text;

    div.appendChild(title);
    div.appendChild(meta);
    div.appendChild(text);

    container.appendChild(div);
  });
}

// --------- DOCUMENTI (ADMIN + VISTA DIPENDENTE) ---------

function loadUserDocuments(user) {
  const docs = loadJson(LS_DOCS, []);
  const visible = docs.filter(
    (d) =>
      d.status === "published" &&
      (d.target === "all" || d.target === user.id)
  );
  const container = document.getElementById("user-documents");
  container.innerHTML = "";

  if (visible.length === 0) {
    container.textContent = "Nessun documento condiviso con te.";
    return;
  }

  visible.forEach((d) => {
    const pill = document.createElement("div");
    pill.className = "doc-pill";
    pill.innerHTML = `<strong>${d.title}</strong><br/><span>${d.content}</span>`;
    container.appendChild(pill);
  });
}

// Admin: riempi select destinatario
function populateDocTargetSelect() {
  const select = document.getElementById("doc-target");
  if (!select) return;
  const users = loadJson(LS_USERS, []);
  // reset lasciando "Tutti"
  select.innerHTML = '<option value="all">Tutti i dipendenti</option>';
  users
    .filter((u) => u.role !== "admin")
    .forEach((u) => {
      const opt = document.createElement("option");
      opt.value = u.id;
      opt.textContent = u.name + " (" + u.email + ")";
      select.appendChild(opt);
    });
}

function createDocument() {
  const active = loadJson(LS_ACTIVE, null);
  if (!active || active.role !== "admin") return;

  const title = document.getElementById("doc-title").value.trim();
  const content = document.getElementById("doc-content").value.trim();
  const target = document.getElementById("doc-target").value;
  const publish = document.getElementById("doc-publish").checked;

  if (!title || !content) {
    alert("Inserisci almeno titolo e contenuto.");
    return;
  }

  let docs = loadJson(LS_DOCS, []);
  const doc = {
    id: "doc-" + Date.now(),
    title,
    content,
    target, // "all" o userId
    status: publish ? "published" : "draft",
    createdAt: new Date().toISOString(),
  };
  docs.push(doc);
  saveJson(LS_DOCS, docs);

  document.getElementById("doc-title").value = "";
  document.getElementById("doc-content").value = "";
  document.getElementById("doc-publish").checked = true;

  renderDocuments();
  loadUserDocuments(active);
}

// Lista documenti per admin
function renderDocuments() {
  const docs = loadJson(LS_DOCS, []);
  const users = loadJson(LS_USERS, []);
  const container = document.getElementById("docs-list");
  if (!container) return;

  if (docs.length === 0) {
    container.innerHTML = "<p class='small-muted'>Nessun documento creato.</p>";
    return;
  }

  container.innerHTML = "";

  docs
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .forEach((d) => {
      const row = document.createElement("div");
      row.className = "admin-list-row";

      const left = document.createElement("div");
      const targetLabel =
        d.target === "all"
          ? "Tutti"
          : (users.find((u) => u.id === d.target)?.name || "Sconosciuto");
      left.innerHTML = `<strong>${d.title}</strong><br/>
        <span class="small-muted">${targetLabel} • ${
        d.status === "published" ? "Pubblicato" : "Bozza"
      }</span>`;

      const actions = document.createElement("div");
      actions.className = "admin-list-actions";

      const toggleBtn = document.createElement("button");
      toggleBtn.className = "btn-small-secondary";
      toggleBtn.textContent =
        d.status === "published" ? "Metti in bozza" : "Pubblica";
      toggleBtn.onclick = () => toggleDocumentStatus(d.id);

      const delBtn = document.createElement("button");
      delBtn.className = "btn-small-reject";
      delBtn.textContent = "Elimina";
      delBtn.onclick = () => deleteDocument(d.id);

      actions.appendChild(toggleBtn);
      actions.appendChild(delBtn);

      row.appendChild(left);
      row.appendChild(actions);
      container.appendChild(row);
    });
}

function toggleDocumentStatus(id) {
  let docs = loadJson(LS_DOCS, []);
  const idx = docs.findIndex((d) => d.id === id);
  if (idx === -1) return;
  docs[idx].status = docs[idx].status === "published" ? "draft" : "published";
  saveJson(LS_DOCS, docs);

  const active = loadJson(LS_ACTIVE, null);
  if (active) {
    renderDocuments();
    loadUserDocuments(active);
  }
}

function deleteDocument(id) {
  if (!confirm("Eliminare definitivamente questo documento?")) return;
  let docs = loadJson(LS_DOCS, []);
  docs = docs.filter((d) => d.id !== id);
  saveJson(LS_DOCS, docs);

  const active = loadJson(LS_ACTIVE, null);
  if (active) {
    renderDocuments();
    loadUserDocuments(active);
  }
}

// --------- GESTIONE UTENTI (ADMIN) ---------

function renderAccessRequests() {
  const active = loadJson(LS_ACTIVE, null);
  if (!active || active.role !== "admin") return;

  const requests = loadJson(LS_REQUESTS, []);
  const container = document.getElementById("requests-list");
  if (!container) return;

  const pending = requests.filter((r) => r.status === "pending");
  if (pending.length === 0) {
    container.innerHTML =
      "<p class='small-muted'>Nessuna richiesta in attesa.</p>";
    return;
  }

  container.innerHTML = "";
  const wrapper = document.createElement("div");
  wrapper.className = "admin-list";

  pending.forEach((r) => {
    const row = document.createElement("div");
    row.className = "admin-list-row";

    const left = document.createElement("div");
    left.innerHTML = `<strong>${r.name}</strong><br/>
      <span class="small-muted">${r.email}</span><br/>
      <span class="small-muted">${r.note || ""}</span>`;

    const actions = document.createElement("div");
    actions.className = "admin-list-actions";

    const approveBtn = document.createElement("button");
    approveBtn.className = "btn-small-approve";
    approveBtn.textContent = "Approva";
    approveBtn.onclick = () => approveRequest(r.id);

    const rejectBtn = document.createElement("button");
    rejectBtn.className = "btn-small-reject";
    rejectBtn.textContent = "Rifiuta";
    rejectBtn.onclick = () => rejectRequest(r.id);

    actions.appendChild(approveBtn);
    actions.appendChild(rejectBtn);

    row.appendChild(left);
    row.appendChild(actions);
    wrapper.appendChild(row);
  });

  container.appendChild(wrapper);
}

function approveRequest(id) {
  let requests = loadJson(LS_REQUESTS, []);
  const req = requests.find((r) => r.id === id);
  if (!req) return;

  const pwd = prompt(
    `Imposta la password per ${req.name} (${req.email}):`
  );
  if (!pwd) {
    alert("Password non impostata. Richiesta ancora in attesa.");
    return;
  }

  let users = loadJson(LS_USERS, []);
  const newUser = {
    id: "user-" + Date.now(),
    name: req.name,
    email: req.email,
    password: pwd,
    role: "dipendente",
    status: "attivo",
  };
  users.push(newUser);
  saveJson(LS_USERS, users);

  req.status = "approved";
  saveJson(LS_REQUESTS, requests);

  alert(
    `Utente creato.\nComunica a ${req.name} questa password iniziale:\n${pwd}`
  );

  renderAccessRequests();
  renderUsers();
  populateDocTargetSelect();
}

function rejectRequest(id) {
  let requests = loadJson(LS_REQUESTS, []);
  const req = requests.find((r) => r.id === id);
  if (!req) return;
  req.status = "rejected";
  saveJson(LS_REQUESTS, requests);
  renderAccessRequests();
}

function renderUsers() {
  const active = loadJson(LS_ACTIVE, null);
  if (!active || active.role !== "admin") return;

  const users = loadJson(LS_USERS, []);
  const container = document.getElementById("users-list");
  if (!container) return;

  if (users.length === 0) {
    container.innerHTML = "<p class='small-muted'>Nessun utente.</p>";
    return;
  }

  const wrapper = document.createElement("div");
  wrapper.className = "admin-list";

  users.forEach((u) => {
    const row = document.createElement("div");
    row.className = "admin-list-row";

    const left = document.createElement("div");
    left.innerHTML = `<strong>${u.name}</strong> ${
      u.role === "admin" ? "(Admin)" : ""
    }<br/>
      <span class="small-muted">${u.email}</span><br/>
      <span class="small-muted">Stato: ${u.status}</span>`;

    const actions = document.createElement("div");
    actions.className = "admin-list-actions";

    if (u.role !== "admin") {
      const toggleBtn = document.createElement("button");
      toggleBtn.className = "btn-small-secondary";
      toggleBtn.textContent =
        u.status === "attivo" ? "Blocca" : "Sblocca";
      toggleBtn.onclick = () => toggleUserStatus(u.id);

      const delBtn = document.createElement("button");
      delBtn.className = "btn-small-reject";
      delBtn.textContent = "Elimina";
      delBtn.onclick = () => deleteUser(u.id);

      actions.appendChild(toggleBtn);
      actions.appendChild(delBtn);
    }

    row.appendChild(left);
    row.appendChild(actions);
    wrapper.appendChild(row);
  });

  container.innerHTML = "";
  container.appendChild(wrapper);
}

function toggleUserStatus(id) {
  let users = loadJson(LS_USERS, []);
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return;
  users[idx].status = users[idx].status === "attivo" ? "bloccato" : "attivo";
  saveJson(LS_USERS, users);
  renderUsers();
}

function deleteUser(id) {
  if (!confirm("Eliminare definitivamente questo utente?")) return;
  let users = loadJson(LS_USERS, []);
  users = users.filter((u) => u.id !== id);
  saveJson(LS_USERS, users);
  renderUsers();
  populateDocTargetSelect();
}

// --------- AVVIO APP ---------

document.addEventListener("DOMContentLoaded", () => {
  seedAdminIfNeeded();

  const active = loadJson(LS_ACTIVE, null);
  if (active) {
    initPortal(active);
  } else {
    showLogin();
  }
});
