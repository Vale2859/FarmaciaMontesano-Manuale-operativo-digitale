/* ============================================
   Portale – Farmacia Montesano
   Login + home a icone
   ============================================ */

const LS_USERS = "fm_users";
const LS_ACTIVE = "fm_activeUser";

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
   UTENTI / TITOLARE DI DEFAULT
   ============================================ */

function loadUsers() {
  return loadJson(LS_USERS, []);
}

function saveUsers(users) {
  saveJson(LS_USERS, users);
}

function seedOwnerIfNeeded() {
  let users = loadUsers();
  const ownerEmail = "titolare@farmaciamontesano.it";

  let owner = users.find(
    (u) => u.email.toLowerCase() === ownerEmail.toLowerCase()
  );

  if (!owner) {
    owner = {
      id: uid(),
      name: "Valerio Montesano",
      email: ownerEmail,
      password: "titolare123",
      role: "titolare",
      createdAt: new Date().toISOString()
    };
    users.push(owner);
  }
  saveUsers(users);
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

function registerUser() {
  const name = document.getElementById("reg-name").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const pass = document.getElementById("reg-password").value;
  const role = document.getElementById("reg-role").value;

  const errReg = document.getElementById("auth-error-register");
  if (errReg) {
    errReg.textContent = "";
    errReg.classList.add("hidden");
  }

  if (!name || !email || !pass) {
    if (errReg) {
      errReg.textContent = "Compila tutti i campi per registrarti.";
      errReg.classList.remove("hidden");
    }
    return;
  }

  let users = loadUsers();
  if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
    if (errReg) {
      errReg.textContent = "Esiste già un utente con questa email.";
      errReg.classList.remove("hidden");
    }
    return;
  }

  users.push({
    id: uid(),
    name,
    email,
    password: pass,
    role,
    createdAt: new Date().toISOString()
  });

  saveUsers(users);
  alert("Registrazione completata! Ora puoi effettuare il login.");
  showLogin();
}

function login() {
  const email = document.getElementById("login-email").value.trim();
  const pass = document.getElementById("login-password").value;

  if (!email || !pass) {
    showError("Inserisci email e password.");
    return;
  }

  const users = loadUsers();
  const user = users.find(
    (u) =>
      u.email.toLowerCase() === email.toLowerCase() && u.password === pass
  );

  if (!user) {
    showError("Credenziali non valide.");
    return;
  }

  clearError();
  saveJson(LS_ACTIVE, user);
  openPortal(user);
}

function logout() {
  localStorage.removeItem(LS_ACTIVE);
  document.getElementById("app").classList.add("hidden");
  document.getElementById("auth").classList.remove("hidden");
  showLogin();
}

/* Mostra/nascondi password login */

function togglePassword() {
  const input = document.getElementById("login-password");
  if (!input) return;
  input.type = input.type === "password" ? "text" : "password";
}

/* ============================================
   PORTALE / HOME
   ============================================ */

function openPortal(user) {
  document.getElementById("auth").classList.add("hidden");
  document.getElementById("app").classList.remove("hidden");

  const nameEl = document.getElementById("topbar-user-name");
  if (nameEl) nameEl.textContent = user.name;

  const roleLabel = document.getElementById("topbar-role-label");
  if (roleLabel) {
    if (user.role === "titolare") {
      roleLabel.textContent = "Portale Titolare";
    } else if (user.role === "dipendente") {
      roleLabel.textContent = "Portale Dipendenti";
    } else if (user.role === "cliente") {
      roleLabel.textContent = "Area Clienti";
    } else {
      roleLabel.textContent = "Portale interno";
    }
  }

  const welcome = document.getElementById("home-welcome-text");
  if (welcome) {
    welcome.textContent =
      "Ciao " +
      user.name +
      ", questa è la schermata principale. In futuro potremo collegare ogni icona a funzioni reali (prenotazioni, turni, promozioni, servizi, ecc.).";
  }

  goHomeFromMenu();
}

/* Home dalla voce menu */

function goHomeFromMenu() {
  const menu = document.getElementById("side-menu");
  if (menu) menu.classList.remove("open");
  const placeholder = document.getElementById("home-placeholder");
  if (placeholder) {
    placeholder.textContent =
      "Tocca un’icona per aprire la funzione (in arrivo).";
  }
}

/* Placeholder per icone */

function placeholderAlert(label) {
  const placeholder = document.getElementById("home-placeholder");
  if (placeholder) {
    placeholder.textContent = 'Funzione "' + label + '" in arrivo.';
  }
}

/* Menu laterale */

function toggleMenu() {
  const menu = document.getElementById("side-menu");
  if (!menu) return;
  menu.classList.toggle("open");
}

/* ============================================
   AVVIO
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {
  seedOwnerIfNeeded();

  const active = loadJson(LS_ACTIVE, null);
  if (active) {
    openPortal(active);
  } else {
    document.getElementById("auth").classList.remove("hidden");
    document.getElementById("app").classList.add("hidden");
    showLogin();
  }
});
