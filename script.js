document.addEventListener("DOMContentLoaded", () => {
  /* =====================================================
     RIFERIMENTI GENERALI
  ===================================================== */

  const authContainer = document.getElementById("authContainer");
  const appContainer = document.getElementById("appContainer");

  const loginForm = document.getElementById("loginForm");
  const loginError = document.getElementById("loginError");
  const roleTabs = document.querySelectorAll(".auth-tab");
  const loginRoleLabel = document.getElementById("loginRoleLabel");
  const currentRoleLabel = document.getElementById("currentRoleLabel");

  const sidebar = document.getElementById("sidebar");
  const hamburger = document.getElementById("hamburger");
  const closeSidebar = document.getElementById("closeSidebar");
  const logoutBtn = document.querySelector(".logout");

  const dashboard = document.getElementById("dashboard");
  const assenzePage = document.getElementById("assenzePage");
  const btnOpenAssenze = document.getElementById("openAssenze");
  const btnBackDashboard = document.getElementById("backToDashboard");

  const assenzeForm = document.querySelector(".assenze-form");
  const assenzeFeedback = document.getElementById("assenzeFeedback");

  let currentRole = "farmacia";

  /* =====================================================
     LOGIN & RUOLI
  ===================================================== */

  // Cambia tab ruolo
  roleTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      roleTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      currentRole = tab.dataset.role;
      const labelMap = {
        farmacia: "Farmacia",
        titolare: "Titolare",
        dipendente: "Dipendente",
      };
      if (loginRoleLabel) {
        loginRoleLabel.textContent = labelMap[currentRole] || "Farmacia";
      }
    });
  });

  // Login: per ora basta che username e password non siano vuoti
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const u = document.getElementById("loginUsername")?.value.trim();
      const p = document.getElementById("loginPassword")?.value.trim();

      if (!u || !p) {
        if (loginError) loginError.classList.remove("hidden");
        return;
      }

      showApp();
    });
  }

  function showApp() {
    if (authContainer) authContainer.classList.add("hidden");
    if (appContainer) appContainer.classList.remove("hidden");
    if (loginError) loginError.classList.add("hidden");

    if (currentRoleLabel) {
      const map = {
        farmacia: "Farmacia (accesso generico)",
        titolare: "Titolare",
        dipendente: "Dipendente",
      };
      currentRoleLabel.textContent = map[currentRole] || "Farmacia (accesso generico)";
    }

    // assicuriamo di essere sulla dashboard
    if (dashboard && assenzePage) {
      dashboard.classList.remove("hidden");
      assenzePage.classList.add("hidden");
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* =====================================================
     LOGOUT (TORNA AL LOGIN)
  ===================================================== */

  function doLogout() {
    if (appContainer) appContainer.classList.add("hidden");
    if (authContainer) authContainer.classList.remove("hidden");
    if (loginForm) loginForm.reset();
    if (loginError) loginError.classList.add("hidden");

    // torna sempre alla dashboard principale
    if (dashboard && assenzePage) {
      dashboard.classList.remove("hidden");
      assenzePage.classList.add("hidden");
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      doLogout();
    });
  }

  /* =====================================================
     SIDEBAR / MENU LATERALE
  ===================================================== */

  if (hamburger && sidebar) {
    hamburger.addEventListener("click", () => {
      sidebar.classList.add("open");
    });
  }

  if (closeSidebar && sidebar) {
    closeSidebar.addEventListener("click", () => {
      sidebar.classList.remove("open");
    });
  }

  // Chiudi sidebar cliccando fuori
  document.addEventListener("click", (e) => {
    if (!sidebar || !hamburger) return;
    const clickInsideSidebar = sidebar.contains(e.target);
    const clickOnHamburger = hamburger.contains(e.target);
    if (!clickInsideSidebar && !clickOnHamburger) {
      sidebar.classList.remove("open");
    }
  });

  /* =====================================================
     NAVIGAZIONE: DASHBOARD ↔ PAGINA ASSENZE
  ===================================================== */

  if (btnOpenAssenze && dashboard && assenzePage) {
    btnOpenAssenze.addEventListener("click", () => {
      dashboard.classList.add("hidden");
      assenzePage.classList.remove("hidden");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  if (btnBackDashboard && dashboard && assenzePage) {
    btnBackDashboard.addEventListener("click", () => {
      assenzePage.classList.add("hidden");
      dashboard.classList.remove("hidden");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* =====================================================
     INVIO MODULO RICHIESTA ASSENZA
  ===================================================== */

  if (assenzeForm && assenzeFeedback) {
    assenzeForm.addEventListener("submit", (e) => {
      e.preventDefault();

      assenzeFeedback.classList.remove("hidden");
      assenzeFeedback.scrollIntoView({ behavior: "smooth", block: "center" });

      assenzeForm.reset();
    });
  }
});
