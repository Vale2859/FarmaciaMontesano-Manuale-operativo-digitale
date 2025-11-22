// ================= LOGIN & RUOLI =================

const authContainer = document.getElementById("authContainer");
const app = document.getElementById("app");

const loginForm = document.getElementById("loginForm");
const loginRoleLabel = document.getElementById("loginRoleLabel");
const loginError = document.getElementById("loginError");
const roleTabs = document.querySelectorAll(".auth-tab");

const currentRolePill = document.getElementById("currentRolePill");
const assenzeTitle = document.getElementById("assenzeTitle");

// Credenziali fittizie (solo per prova grafica)
const CREDENTIALS = {
  farmacia: { username: "farmacia", password: "1234" },
  titolare: { username: "titolare", password: "1234" },
  dipendente: { username: "dipendente", password: "1234" },
};

let currentRole = "farmacia";

// Cambio tab di ruolo
roleTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    roleTabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    currentRole = tab.dataset.role;
    loginRoleLabel.textContent =
      currentRole === "farmacia"
        ? "Farmacia"
        : currentRole.charAt(0).toUpperCase() + currentRole.slice(1);
  });
});

// Submit login
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const userInput = document.getElementById("username").value.trim();
    const passInput = document.getElementById("password").value.trim();

    const cred = CREDENTIALS[currentRole];

    if (
      !cred ||
      userInput.toLowerCase() !== cred.username ||
      passInput !== cred.password
    ) {
      loginError.classList.remove("hidden");
      return;
    }

    loginError.classList.add("hidden");
    authContainer.classList.add("hidden");
    app.classList.remove("hidden");
    window.scrollTo(0, 0);

    // Aggiorna pill ruolo
    let label;
    if (currentRole === "farmacia") {
      label = "Farmacia (accesso generico)";
    } else if (currentRole === "titolare") {
      label = "Titolare";
    } else {
      label = "Dipendente";
    }
    currentRolePill.textContent = label;

    // Titolo assenze per dipendente
    if (currentRole === "dipendente") {
      assenzeTitle.textContent = "Le mie assenze";
    } else {
      assenzeTitle.textContent = "Assenze del personale";
    }

    // reset campi
    loginForm.reset();
  });
}

// ================= SIDEBAR & LOGOUT =================

const sidebar = document.getElementById("sidebar");
const hamburger = document.getElementById("hamburger");
const closeSidebar = document.getElementById("closeSidebar");
const logoutItems = document.querySelectorAll(".logout");

function openSidebar() {
  sidebar.classList.add("open");
}

function closeSidebarFn() {
  sidebar.classList.remove("open");
}

if (hamburger) hamburger.addEventListener("click", openSidebar);
if (closeSidebar) closeSidebar.addEventListener("click", closeSidebarFn);

logoutItems.forEach((item) => {
  item.addEventListener("click", () => {
    // Torna al login
    app.classList.add("hidden");
    authContainer.classList.remove("hidden");
    // Mostra di nuovo dashboard quando si rientra
    showSection("dashboard");
    sidebar.classList.remove("open");
  });
});

// Chiudi sidebar se clicchi fuori (desktop)
document.addEventListener("click", (e) => {
  if (
    sidebar.classList.contains("open") &&
    !sidebar.contains(e.target) &&
    e.target !== hamburger
  ) {
    sidebar.classList.remove("open");
  }
});

// ================= NAVIGAZIONE SEZIONI =================

const sections = document.querySelectorAll(".section");
const dashboardSection = document.getElementById("dashboard");

function showSection(id) {
  sections.forEach((sec) => sec.classList.add("hidden"));
  if (dashboardSection) dashboardSection.classList.remove("visible");

  const target = document.getElementById(id);
  if (target) {
    target.classList.remove("hidden");
    if (id === "dashboard") {
      target.classList.add("visible");
    }
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Inizialmente solo dashboard visibile
if (dashboardSection) dashboardSection.classList.add("visible");

// Pulsanti dashboard
const openAssenzeBtn = document.getElementById("openAssenze");
const openTurniBtn = document.getElementById("openTurni");
const openProcedureBtn = document.getElementById("openProcedure");
const openComunicazioniBtn = document.getElementById("openComunicazioni");

if (openAssenzeBtn)
  openAssenzeBtn.addEventListener("click", () => showSection("assenzePage"));

if (openTurniBtn)
  openTurniBtn.addEventListener("click", () => showSection("turniPage"));

if (openProcedureBtn)
  openProcedureBtn.addEventListener("click", () =>
    showSection("procedurePage")
  );

// Per ora comunicazioni apre semplicemente la sezione procedure (puoi cambiarlo più avanti)
if (openComunicazioniBtn)
  openComunicazioniBtn.addEventListener("click", () =>
    alert("Schermata comunicazioni dettagliata la aggiungiamo dopo 😊")
  );

// Pulsanti "← Dashboard"
const backButtons = document.querySelectorAll(".back-button");
backButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    showSection(btn.dataset.back || "dashboard");
  });
});

// Sidebar voci di menu (dashboard/procedure)
const sidebarItems = document.querySelectorAll(
  ".sidebar-list li[data-nav]"
);

sidebarItems.forEach((item) => {
  item.addEventListener("click", () => {
    const target = item.dataset.nav;
    if (item.classList.contains("disabled")) {
      alert("Funzione in arrivo.");
      return;
    }
    if (target === "dashboard") {
      showSection("dashboard");
    } else {
      showSection(target);
    }
    sidebar.classList.remove("open");
  });
});

// ================= FORM ASSENZE & PROCEDURE (feedback finto) =================

const assenzeForm = document.getElementById("assenzeForm");
const assenzeFeedback = document.getElementById("assenzeFeedback");

if (assenzeForm) {
  assenzeForm.addEventListener("submit", (e) => {
    e.preventDefault();
    assenzeFeedback.classList.remove("hidden");
    setTimeout(() => assenzeFeedback.classList.add("hidden"), 4000);
    assenzeForm.reset();
  });
}

const procedureForm = document.getElementById("procedureForm");
const procedureFeedback = document.getElementById("procedureFeedback");

if (procedureForm) {
  procedureForm.addEventListener("submit", (e) => {
    e.preventDefault();
    procedureFeedback.classList.remove("hidden");
    setTimeout(() => procedureFeedback.classList.add("hidden"), 4000);
    procedureForm.reset();
  });
}
