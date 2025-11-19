// --- UTILITÀ UI ---

function showRegister() {
  document.getElementById("login-box").style.display = "none";
  document.getElementById("register-box").style.display = "block";
  hideAuthError();
}

function showLogin() {
  document.getElementById("login-box").style.display = "block";
  document.getElementById("register-box").style.display = "none";
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

// --- REGISTRAZIONE ---

function register() {
  const name = document.getElementById("reg-name").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const password = document.getElementById("reg-password").value;

  if (!name || !email || !password) {
    showAuthError("Compila tutti i campi.");
    return;
  }

  let users = JSON.parse(localStorage.getItem("dipendenti") || "[]");

  if (users.find((u) => u.email === email)) {
    showAuthError("Questa email è già registrata.");
    return;
  }

  users.push({ name, email, password });
  localStorage.setItem("dipendenti", JSON.stringify(users));

  alert("Registrazione completata! Ora effettua il login.");
  showLogin();
  document.getElementById("reg-password").value = "";
}

// --- LOGIN ---

function login() {
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;

  let users = JSON.parse(localStorage.getItem("dipendenti") || "[]");
  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    showAuthError("Email o password non corretti.");
    return;
  }

  localStorage.setItem("utenteAttivo", JSON.stringify(user));
  initPortal(user);
}

// --- LOGOUT ---

function logout() {
  localStorage.removeItem("utenteAttivo");
  // Torna alla schermata di login
  document.getElementById("portal").classList.add("hidden");
  document.getElementById("auth-screen").classList.remove("hidden");
  document.getElementById("login-email").value = "";
  document.getElementById("login-password").value = "";
}

// --- INIZIALIZZAZIONE PORTALE ---

function initPortal(user) {
  // Nascondi login
  document.getElementById("auth-screen").classList.add("hidden");
  // Mostra portale
  document.getElementById("portal").classList.remove("hidden");

  document.getElementById("user-name-display").textContent =
    user.name || user.email;

  // Carica contenuti demo
  loadProcedures();
  loadMessages();

  // Mostra sezione iniziale
  activateNavButton(document.getElementById("nav-home"));
  showOnlySection("home");
}

// --- NAVIGAZIONE SEZIONI ---

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
  document.querySelectorAll(".nav-btn").forEach((b) => b.classList.remove("active"));
  if (btn) btn.classList.add("active");
}

// --- DATI DEMO PROCEDURE ---

function loadProcedures() {
  const procedures = [
    {
      title: "Anticipi – i clienti pagano subito",
      important: true,
      meta: "Cassa / Ricette SSN",
      text:
        "Il cliente paga subito l'importo del farmaco. Quando porta la ricetta, si emette il ticket e si restituisce l'eventuale differenza dalla scatoletta sotto cassa."
    },
    {
      title: "Scontrino POS – niente vendite manuali",
      important: true,
      meta: "POS / Gestionale",
      text:
        "Le vendite con carta vanno sempre fatte partendo dal gestionale collegato al POS. Evitare lo scontrino manuale sul POS, salvo emergenze."
    },
    {
      title: "Sotto cassa – gestione contanti",
      important: false,
      meta: "Cassa",
      text:
        "Eventuali anticipi o differenze da restituire vanno sempre messi nella scatoletta sotto cassa, con bigliettino di riferimento se necessario."
    },
    {
      title: "Codice fiscale obbligatorio",
      important: false,
      meta: "Ticket / Detrazione",
      text:
        "Per le spese detraibili, controllare sempre il codice fiscale del cliente prima di chiudere lo scontrino."
    }
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

// --- DATI DEMO COMUNICAZIONI ---

function loadMessages() {
  const messages = [
    {
      title: "Controllare incassi turno mattina",
      when: "Oggi",
      text:
        "Al cambio turno verificare che il contante in cassa coincida con il totale gestionale."
    },
    {
      title: "Arrivato ordine Uriage",
      when: "Ieri",
      text:
        "Controllare i colli e sistemare i prodotti in esposizione promo vicino alla vetrina."
    },
    {
      title: "Nuove regole anticipi ASL",
      when: "Questa settimana",
      text:
        "Le nuove procedure sono caricate nella sezione 'Procedure interne'. Tutti i collaboratori devono leggerle."
    },
    {
      title: "POS lento – riavviare prima di chiamare assistenza",
      when: "Nota fissa",
      text:
        "Se il POS non comunica con il gestionale, riavviare prima il POS, poi il PC, e solo dopo contattare l'assistenza."
    }
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

// --- AUTO LOGIN SE GIÀ LOGGATO ---

document.addEventListener("DOMContentLoaded", () => {
  const active = localStorage.getItem("utenteAttivo");
  if (active) {
    initPortal(JSON.parse(active));
  }
});
