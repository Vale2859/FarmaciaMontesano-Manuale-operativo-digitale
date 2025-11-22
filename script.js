// ================== RIFERIMENTI BASE ==================

const authContainer = document.getElementById("authContainer");
const app = document.getElementById("app");
const loginForm = document.getElementById("loginForm");
const loginRoleLabel = document.getElementById("loginRoleLabel");
const roleTabs = document.querySelectorAll(".auth-tab");
const currentRoleChip = document.getElementById("currentRoleChip");

const sidebar = document.getElementById("sidebar");
const hamburger = document.getElementById("hamburger");
const closeSidebarBtn = document.getElementById("closeSidebar");

const dashboardSection = document.getElementById("dashboard");
const assenzePage = document.getElementById("assenzePage");
const farmaciePage = document.getElementById("farmaciePage");
const procedurePage = document.getElementById("procedurePage");

const openAssenzeBtn = document.getElementById("openAssenze");
const openFarmacieBtn = document.getElementById("openFarmacie");
const openProcedureBtn = document.getElementById("openProcedure");
const backDashboardButtons = document.querySelectorAll(".back-dashboard");
const logoutLinks = document.querySelectorAll(".logout-link");

const assenzeForm = document.querySelector(".assenze-form");
const assenzeFeedback = document.getElementById("assenzeFeedback");
const procedureForm = document.querySelector("#procedurePage .assenze-form");
const procedureFeedback = document.getElementById("procedureFeedback");

// ================== LOGIN (DEMO) ==================

// Cambio ruolo (Farmacia/Titolare/Dipendente)
roleTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    roleTabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    const label = tab.dataset.roleLabel || "Farmacia";
    loginRoleLabel.textContent = label;

    if (currentRoleChip) {
      if (label === "Farmacia") {
        currentRoleChip.textContent = "Farmacia (accesso generico)";
      } else if (label === "Titolare") {
        currentRoleChip.textContent = "Titolare – vista completa";
      } else {
        currentRoleChip.textContent = "Dipendente – area personale";
      }
    }
  });
});

// Invia form login (qualsiasi credenziale fa entrare)
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    authContainer.classList.add("hidden");
    app.classList.remove("hidden");
    document.body.classList.add("app-open");
    window.scrollTo(0, 0);
  });
}

// ================== SIDEBAR / HAMBURGER ==================

if (hamburger) {
  hamburger.addEventListener("click", () => {
    sidebar.classList.add("open");
  });
}

if (closeSidebarBtn) {
  closeSidebarBtn.addEventListener("click", () => {
    sidebar.classList.remove("open");
  });
}

// Chiudi sidebar cliccando fuori (solo desktop/mobile grande)
document.addEventListener("click", (event) => {
  const clickInsideSidebar =
    sidebar.contains(event.target) || hamburger.contains(event.target);
  if (!clickInsideSidebar) {
    sidebar.classList.remove("open");
  }
});

// ================== NAVIGAZIONE PAGINE ==================

function showDashboard() {
  dashboardSection.classList.remove("hidden");
  assenzePage.classList.add("hidden");
  farmaciePage.classList.add("hidden");
  procedurePage.classList.add("hidden");
  window.scrollTo(0, 0);
}

function showPage(pageId) {
  dashboardSection.classList.add("hidden");
  assenzePage.classList.add("hidden");
  farmaciePage.classList.add("hidden");
  procedurePage.classList.add("hidden");

  const page = document.getElementById(pageId);
  if (page) {
    page.classList.remove("hidden");
  }
  window.scrollTo(0, 0);
}

// Bottoni apertura pagine
if (openAssenzeBtn) {
  openAssenzeBtn.addEventListener("click", () => showPage("assenzePage"));
}

if (openFarmacieBtn) {
  openFarmacieBtn.addEventListener("click", () => showPage("farmaciePage"));
}

if (openProcedureBtn) {
  openProcedureBtn.addEventListener("click", () => showPage("procedurePage"));
}

// Bottoni "← Dashboard"
backDashboardButtons.forEach((btn) => {
  btn.addEventListener("click", showDashboard);
});

// Voce "Dashboard" nella sidebar
const sidebarDashboardItem = document.querySelector(
  '.sidebar-item[data-nav="dashboard"]'
);
if (sidebarDashboardItem) {
  sidebarDashboardItem.addEventListener("click", () => {
    showDashboard();
    sidebar.classList.remove("open");
  });
}

// ================== LOGOUT ==================

logoutLinks.forEach((link) => {
  link.addEventListener("click", () => {
    // Torna al login
    app.classList.add("hidden");
    authContainer.classList.remove("hidden");
    document.body.classList.remove("app-open");
    sidebar.classList.remove("open");
    showDashboard();

    // Reset campi login (demo)
    if (loginForm) {
      loginForm.reset();
    }
  });
});

// ================== FORM DEMO (assenze + procedure) ==================

// Assenze – mostra messaggio finto "inviato"
if (assenzeForm && assenzeFeedback) {
  assenzeForm.addEventListener("submit", (e) => {
    e.preventDefault();
    assenzeFeedback.classList.remove("hidden");

    setTimeout(() => {
      assenzeFeedback.classList.add("hidden");
    }, 3500);
  });
}

// Procedure – mostra messaggio finto "salvato"
if (procedureForm && procedureFeedback) {
  procedureForm.addEventListener("submit", (e) => {
    e.preventDefault();
    procedureFeedback.classList.remove("hidden");

    setTimeout(() => {
      procedureFeedback.classList.add("hidden");
    }, 3500);
  });
}
