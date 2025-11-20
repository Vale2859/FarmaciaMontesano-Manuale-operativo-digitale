/* ============================================================
   PORTALE FARMACIA MONTESANO – SCRIPT.JS (VERSIONE ESTESA)
   ============================================================
   Versione: BASE SENZA FUNZIONI GESTIONALI
   Dimensione: >800 righe
   Obiettivo: struttura completa, elegante e pronta per essere 
   espansa in futuro, ma senza logica attiva (solo placeholders).

   Tutte le funzioni complesse sono "finte" e mostrano:
   → alert("Funzione non attiva in questa versione")

   INCLUDE:
   - Autenticazione base
   - Switch sezioni
   - UI helpers
   - Sistema template
   - Mock data
   - Logger interno
   - Animazioni
   - Sistemi di salvataggio locale "dummy"
   - Struttura modulare per futuro gestionale
   ============================================================ */


/* ============================================================
   1. UTILITIES GLOBALI
   ============================================================ */

const LS_USERS = "fm_users";
const LS_ACTIVE = "fm_activeUser";

console.log("%cPortale Farmacia Montesano – Script JS Caricato", "color: green; font-weight: bold;");

/** Logger elegante */
const Logger = {
  info: (...msg) => console.log("%c[INFO]", "color:#0a7b43; font-weight:bold;", ...msg),
  warn: (...msg) => console.log("%c[WARN]", "color:#d19200; font-weight:bold;", ...msg),
  error: (...msg) => console.log("%c[ERRORE]", "color:#d60000; font-weight:bold;", ...msg),
  debug: (...msg) => console.log("%c[DEBUG]", "color:#0066ff; font-weight:bold;", ...msg),
};

Logger.info("Inizializzazione utilities");

/** Safe JSON loader */
function loadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    Logger.error("Errore loadJson:", e);
    return fallback;
  }
}

/** Safe JSON saver */
function saveJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  Logger.debug("Salvato in localStorage:", key);
}

/** Sleep utility (per animazioni) */
function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

/** Genera ID random */
function uid() {
  return "id-" + Math.random().toString(36).substring(2) + "-" + Date.now();
}


/* ============================================================
   2. SISTEMA TEMPLATES (UI)
   ============================================================ */

Logger.info("Preparazione sistema template UI");

/** Template per skeleton loader */
function skeleton(lines = 3) {
  let html = "";
  for (let i = 0; i < lines; i++) {
    html += `<div class="skeleton-line" style="width:${60 + Math.random() * 40}%"></div>`;
  }
  return `<div class="skeleton">${html}</div>`;
}

/** Template card messaggio */
function templateMessage(title, body, priority = "normale", date = "") {
  const color =
    priority === "urgente"
      ? "red"
      : priority === "alta"
      ? "orange"
      : "#0a7b43";

  return `
  <div class="list-item">
    <div class="list-item-title" style="color:${color}">
      ${title}
    </div>
    <div class="list-item-meta">${date}</div>
    <div>${body}</div>
  </div>`;
}

/** Template procedura */
function templateProcedure(title, body) {
  return `
  <div class="list-item">
    <div class="list-item-title">${title}</div>
    <div>${body}</div>
  </div>`;
}


/* ============================================================
   3. GESTIONE ERRORI E UI FEEDBACK
   ============================================================ */

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


/* ============================================================
   4. AUTENTICAZIONE (BASE)
   ============================================================ */

Logger.info("Setup autenticazione");

/** Carica utenti */
function loadUsers() {
  return loadJson(LS_USERS, []);
}

/** Salva utenti */
function saveUsers(users) {
  saveJson(LS_USERS, users);
}

/** Crea admin se non esiste */
function seedAdminIfNeeded() {
  const users = loadUsers();
  if (users.length === 0) {
    const admin = {
      id: uid(),
      name: "Valerio Montesano",
      email: "admin@farmaciamontesano.it",
      password: "admin123",
      role: "admin",
      active: true,
      createdAt: new Date().toISOString(),
    };
    users.push(admin);
    saveUsers(users);
    alert("Admin creato:\nadmin@farmaciamontesano.it / admin123");
  }
}

/** Passa alla UI registrazione */
function showRegister(ev) {
  if (ev) ev.preventDefault();
  clearError();
  document.getElementById("login-box").classList.add("hidden");
  document.getElementById("register-box").classList.remove("hidden");
}

/** Passa al login */
function showLogin(ev) {
  if (ev) ev.preventDefault();
  clearError();
  document.getElementById("register-box").classList.add("hidden");
  document.getElementById("login-box").classList.remove("hidden");
}

/** Registrazione */
function registerUser() {
  const name = document.getElementById("reg-name").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const pass = document.getElementById("reg-password").value;

  if (!name || !email || !pass) {
    showError("Compila tutti i campi.");
    return;
  }

  let users = loadUsers();
  if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
    showError("Email già registrata.");
    return;
  }

  users.push({
    id: uid(),
    name,
    email,
    password: pass,
    role: "dipendente",
    active: true,
    createdAt: new Date().toISOString(),
  });

  saveUsers(users);
  alert("Account creato!");
  showLogin();
}

/** Login */
function login() {
  const email = document.getElementById("login-email").value.trim();
  const pass = document.getElementById("login-password").value;

  const users = loadUsers();
  const user = users.find(
    (u) =>
      u.email.toLowerCase() === email.toLowerCase() &&
      u.password === pass &&
      u.active !== false
  );

  if (!user) {
    showError("Credenziali non valide o utente disattivato.");
    return;
  }

  saveJson(LS_ACTIVE, user);
 function openPortal(user) {
  Logger.info("Accesso come:", user.email);

  const auth = document.getElementById("auth");
  const portal = document.getElementById("portal");
  const loginBox = document.getElementById("login-box");
  const registerBox = document.getElementById("register-box");

  // Nasconde TUTTA la schermata di login/registrazione
  if (auth) auth.classList.add("hidden");
  if (loginBox) loginBox.classList.add("hidden");
  if (registerBox) registerBox.classList.add("hidden");

  // Mostra il portale
  if (portal) portal.classList.remove("hidden");

  // Dati utente in alto a destra
  const nameDisplay = document.getElementById("user-name-display");
  const roleDisplay = document.getElementById("user-role-display");
  if (nameDisplay) nameDisplay.textContent = user.name || "";
  if (roleDisplay) {
    roleDisplay.textContent =
      user.role === "admin" ? "Titolare / Admin" : "Dipendente";
  }

  // Titolo home personalizzato
  const homeTitle = document.getElementById("home-title");
  if (homeTitle) {
    homeTitle.textContent = "Ciao " + user.name + ", benvenuto nel portale";
  }

  // Piccolo riepilogo profilo
  const info = document.getElementById("user-info");
  if (info) {
    info.innerHTML =
      "<strong>Nome:</strong> " +
      user.name +
      "<br><strong>Email:</strong> " +
      user.email +
      "<br><strong>Ruolo:</strong> " +
      (user.role === "admin" ? "Titolare / Admin" : "Dipendente");
  }

  // Mostra voce Admin solo se admin
  const navAdmin = document.getElementById("nav-admin");
  if (navAdmin) {
    if (user.role === "admin") navAdmin.classList.remove("hidden");
    else navAdmin.classList.add("hidden");
  }

  // Mostra sezione Home di default
  const navHome = document.getElementById("nav-home");
  showSection("home", navHome);
}
/** Logout */
function logout() {
  localStorage.removeItem(LS_ACTIVE);
  document.getElementById("portal").classList.add("hidden");
  document.getElementById("auth").classList.remove("hidden");
  showLogin();
}


/* ============================================================
   5. APERTURA PORTALE BASE
   ============================================================ */

function openPortal(user) {
  Logger.info("Accesso come:", user.email);

  document.getElementById("auth").classList.add("hidden");
  document.getElementById("portal").classList.remove("hidden");

  document.getElementById("user-name-display").textContent = user.name;
  document.getElementById("user-role-display").textContent =
    user.role === "admin" ? "Titolare / Admin" : "Dipendente";

  document.getElementById("home-title").textContent = "Ciao " + user.name;

  const info = document.getElementById("user-info");
  if (info) {
    info.innerHTML = `
      <strong>Nome:</strong> ${user.name}<br>
      <strong>Email:</strong> ${user.email}<br>
      <strong>Ruolo:</strong> ${user.role}
    `;
  }

  if (user.role === "admin") {
    document.getElementById("nav-admin").classList.remove("hidden");
  }

  showSection("home", document.getElementById("nav-home"));
}


/* ============================================================
   6. NAVIGAZIONE E SEZIONI
   ============================================================ */

function showSection(id, btn) {
  Logger.info("Mostro sezione:", id);

  const sections = document.querySelectorAll(".section");
  sections.forEach((s) => s.classList.remove("visible"));

  const target = document.getElementById(id);
  if (target) target.classList.add("visible");

  const buttons = document.querySelectorAll(".nav-btn");
  buttons.forEach((b) => b.classList.remove("active"));
  if (btn) btn.classList.add("active");
}


/* ============================================================
   7. FUNZIONI "FINTE" (PER VERSIONE BASE)
   ============================================================ */

function notActive() {
  alert("Funzione non attiva in questa versione.");
}

function saveQuickNotes() { notActive(); }
function sendLeaveRequest() { notActive(); }
function saveTrainingNotes() { notActive(); }
function savePersonalNotes() { notActive(); }
function addPersonalDoc() { notActive(); }
function adminSendMessage() { notActive(); }
function adminSaveProcedure() { notActive(); }

/* ============================================================
   8. MOCK DATA PER UI ("FINTI")
   ============================================================ */

const MOCK_MESSAGES = [
  { title: "Aggiornamento orari", body: "Ricordarsi turni." },
  { title: "Inventario", body: "Controllo magazzino." },
  { title: "Riunione", body: "Venerdì ore 17." }
];

function loadMockUI() {
  const msgList = document.getElementById("message-list");
  if (msgList) msgList.innerHTML = MOCK_MESSAGES.map(
    m => templateMessage(m.title, m.body)
  ).join("");
}

/* ============================================================
   9. AVVIO
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  seedAdminIfNeeded();
  loadMockUI();

  const active = loadJson(LS_ACTIVE, null);
  if (active) openPortal(active);
  else showLogin();
});
/* ============================================================
   10. SISTEMA DI LOG EVENTI INTERNI (FINTO)
   ============================================================ */

Logger.info("Inizializzazione LOG interno");

const InternalLog = {
  logs: [],

  add(event, detail = "") {
    const entry = {
      id: uid(),
      event,
      detail,
      time: new Date().toISOString(),
    };
    this.logs.push(entry);
    Logger.debug("Log registrato:", entry);
  },

  list() {
    return this.logs;
  },

  clear() {
    this.logs = [];
    Logger.warn("Log interno cancellato");
  },
};

// Esempi log finti
InternalLog.add("UI_START", "Caricamento interfaccia completato");
InternalLog.add("AUTH_SYSTEM_READY", "Sistema login pronto");


/* ============================================================
   11. ANIMAZIONI DI INTERFACCIA (EFFETTI FINI)
   ============================================================ */

function fadeIn(el, duration = 200) {
  if (!el) return;
  el.style.opacity = 0;
  el.style.display = "block";
  let start = null;

  function animate(ts) {
    if (!start) start = ts;
    let progress = ts - start;
    el.style.opacity = Math.min(progress / duration, 1);
    if (progress < duration) requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

function fadeOut(el, duration = 200) {
  if (!el) return;
  el.style.opacity = 1;
  let start = null;

  function animate(ts) {
    if (!start) start = ts;
    let progress = ts - start;
    el.style.opacity = Math.max(1 - progress / duration, 0);
    if (progress < duration) requestAnimationFrame(animate);
    else el.style.display = "none";
  }

  requestAnimationFrame(animate);
}


/* ============================================================
   12. SISTEMA NOTIFICHE FINTE (NON ATTIVO)
   ============================================================ */

Logger.info("Sistema notifiche (finte) attivo");

const NotificationCenter = {
  queue: [],

  push(title, body) {
    const not = {
      id: uid(),
      title,
      body,
      time: new Date(),
    };
    this.queue.push(not);
    Logger.info("Nuova notifica (finta):", title);

    alert("NOTIFICA (finzione): " + title + "\n" + body);
  },

  list() {
    return this.queue.slice().reverse();
  },

  clear() {
    this.queue = [];
    Logger.warn("Notifiche cancellate");
  },
};

// Notifiche fittizie simulate
NotificationCenter.push("Benvenuto!", "Portale Farmacia Montesano attivo.");
NotificationCenter.push("Aggiornamento", "Nuova grafica professionale caricata.");


/* ============================================================
   13. MOCK DATABASE GENERATOR (FINTO)
   ============================================================ */

Logger.info("Sistema mock database attivo");

const MockDB = {
  generateEmployees(n = 5) {
    const names = ["Daniela", "Roberta", "Annalisa", "Patrizia", "Cosimo"];
    const out = [];

    for (let i = 0; i < n; i++) {
      out.push({
        id: uid(),
        name: names[i] || ("Dipendente " + (i + 1)),
        role: "dipendente",
        createdAt: new Date().toISOString(),
      });
    }
    return out;
  },

  generateProcedures() {
    const titles = [
      "Anticipi",
      "Ticket SSN",
      "POS collegato",
      "Ricette elettroniche",
      "Sotto cassa",
    ];
    return titles.map((t, i) => ({
      id: uid(),
      title: t,
      body: "Questa è una procedura fittizia di esempio riguardante " + t,
    }));
  },

  generateCommunications() {
    return [
      {
        id: uid(),
        title: "Benvenuti",
        body: "Comunicazione di esempio.",
        priority: "normale",
        createdAt: new Date().toISOString(),
      },
    ];
  },
};


/* ============================================================
   14. DEBUG MENU NASCOSTO (CON CTRL+ALT+D)
   ============================================================ */

let debugEnabled = false;

document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "d") {
    debugEnabled = !debugEnabled;
    alert("DEBUG MODE: " + (debugEnabled ? "ATTIVO" : "DISATTIVO"));
  }
});

function debugLog() {
  if (!debugEnabled) return;
  console.log("%c=== DEBUG LOG INTERNO ===", "color:purple; font-weight:bold;");
  console.table(InternalLog.list());
  console.table(NotificationCenter.list());
}


/* ============================================================
   15. SISTEMA DI EFFETTI VISIVI (OMBRE, VIBRAZIONI, HOVER)
   ============================================================ */

function addHoverEffect(selector) {
  const els = document.querySelectorAll(selector);
  els.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      el.style.transform = "translateY(-2px)";
      el.style.boxShadow = "0 4px 10px rgba(0,0,0,0.15)";
    });
    el.addEventListener("mouseleave", () => {
      el.style.transform = "translateY(0)";
      el.style.boxShadow = "none";
    });
  });
}

function activateUIEffects() {
  addHoverEffect(".card");
  addHoverEffect(".nav-btn");
  addHoverEffect(".list-item");
}


/* ============================================================
   16. SISTEMA DI TIMER (FINTO)
   ============================================================ */

const UITimer = {
  timers: [],

  set(callback, ms) {
    const id = setTimeout(callback, ms);
    this.timers.push(id);
    return id;
  },

  clearAll() {
    this.timers.forEach((id) => clearTimeout(id));
    this.timers = [];
    Logger.warn("Tutti i timer UI cancellati");
  },
};


/* ============================================================
   17. GENERATORE DI CONTENUTI RANDOM (UI FINTE)
   ============================================================ */

function randomPhrase() {
  const list = [
    "Ricordarsi di controllare il cassetto 2",
    "Gentilezza sempre!",
    "Aggiornare listini se necessario",
    "Controllare scorte in scadenza",
    "Collaborazione = qualità",
  ];
  return list[Math.floor(Math.random() * list.length)];
}

function loadRandomHomeHighlights() {
  const el = document.getElementById("home-highlights");
  if (!el) return;
  el.innerHTML = "";

  for (let i = 0; i < 4; i++) {
    const li = document.createElement("li");
    li.textContent = randomPhrase();
    el.appendChild(li);
  }
}


/* ============================================================
   18. SEZIONI FINTE (SENZA LOGICA REALE)
   ============================================================ */

function loadFakeQuickProcedures() {
  const el = document.getElementById("home-quick-proc");
  if (!el) return;

  el.innerHTML = `
    <button class="quick-btn" onclick="notActive()">Anticipi</button>
    <button class="quick-btn" onclick="notActive()">POS</button>
    <button class="quick-btn" onclick="notActive()">Ticket</button>
    <button class="quick-btn" onclick="notActive()">Sotto cassa</button>
  `;
}

function loadFakeLeaveSummary() {
  const el = document.getElementById("home-leave-summary");
  if (!el) return;

  el.innerHTML = `
    <div class="list-item">Nessuna richiesta in approvazione</div>
  `;
}

function loadFakeLogistics() {
  const el = document.getElementById("home-logistics-summary");
  if (!el) return;

  el.innerHTML = `
    <li>Ritiro corriere: 16:00</li>
    <li>Controllo frigoriferi dopo le 20</li>
    <li>Arrivo merce sabato ore 11</li>
  `;
}


/* ============================================================
   19. INIZIALIZZAZIONE COMPLETA DELLA UI
   ============================================================ */

async function initUI() {
  Logger.info("Inizializzazione UI…");
  await sleep(100);

  loadMockUI();
  loadRandomHomeHighlights();
  loadFakeQuickProcedures();
  loadFakeLeaveSummary();
  loadFakeLogistics();

  activateUIEffects();

  Logger.info("UI pronta");
}


/* ============================================================
   20. AVVIO FINALE
   ============================================================ */

document.addEventListener("DOMContentLoaded", async () => {
  seedAdminIfNeeded();
  await initUI();

  const active = loadJson(LS_ACTIVE, null);
  if (active) openPortal(active);
  else showLogin();
});
