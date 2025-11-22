document.addEventListener("DOMContentLoaded", () => {
  /* ========== LOGIN LOGICA SEMPLICE ========== */

  const authContainer = document.getElementById("authContainer");
  const appContainer = document.getElementById("appContainer");
  const loginForm = document.getElementById("loginForm");
  const loginRoleLabel = document.getElementById("loginRoleLabel");
  const loginError = document.getElementById("loginError");
  const roleTabs = document.querySelectorAll(".auth-tab");
  const currentRoleLabel = document.getElementById("currentRoleLabel");

  let currentRole = "farmacia";

  // Cambia ruolo (Farmacia / Titolare / Dipendente)
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
      loginRoleLabel.textContent = labelMap[currentRole] || "Farmacia";
    });
  });

  // Fake credenziali (solo per demo)
  const credentials = {
    farmacia: { user: "farmacia", pass: "1234" },
    titolare: { user: "titolare", pass: "1234" },
    dipendente: { user: "dipendente", pass: "1234" },
  };

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const userInput = document.getElementById("loginUsername").value.trim();
    const passInput = document.getElementById("loginPassword").value.trim();

    const cred = credentials[currentRole];

    // Se vuoi accesso libero, commenta il blocco IF e usa solo showApp()
    if (cred && userInput === cred.user && passInput === cred.pass) {
      showApp();
    } else {
      // Per ora: se lasci username vuoto, NON entra
      loginError.classList.remove("hidden");
      return;
    }
  });

  function showApp() {
    authContainer.classList.add("hidden");
    appContainer.classList.remove("hidden");
    loginError.classList.add("hidden");

    const roleTextMap = {
      farmacia: "Farmacia (accesso generico)",
      titolare: "Titolare",
      dipendente: "Dipendente",
    };
    if (currentRoleLabel) {
      currentRoleLabel.textContent =
        roleTextMap[currentRole] || "Farmacia (accesso generico)";
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ========== SIDEBAR HAMBURGER ========== */

  const sidebar = document.getElementById("sidebar");
  const hamburger = document.getElementById("hamburger");
  const closeSidebarBtn = document.getElementById("closeSidebar");

  if (hamburger && sidebar) {
    hamburger.addEventListener("click", () => {
      sidebar.classList.add("open");
    });
  }

  if (closeSidebarBtn && sidebar) {
    closeSidebarBtn.addEventListener("click", () => {
      sidebar.classList.remove("open");
    });
  }

  // Chiudi sidebar cliccando fuori
  document.addEventListener("click", (event) => {
    if (!sidebar) return;
    const clickInsideSidebar = sidebar.contains(event.target);
    const clickOnHamburger = hamburger && hamburger.contains(event.target);

    if (!clickInsideSidebar && !clickOnHamburger) {
      sidebar.classList.remove("open");
    }
  });

  /* ========== NAVIGAZIONE DASHBOARD <-> ASSENZE ========== */

  const dashboard = document.getElementById("dashboard");
  const assenzePage = document.getElementById("assenzePage");
  const btnOpenAssenze = document.getElementById("openAssenze");
  const btnBackDashboard = document.getElementById("backToDashboard");
  const assenzeForm = document.querySelector(".assenze-form");
  const assenzeFeedback = document.getElementById("assenzeFeedback");

  // Apri pagina Assenze
  if (btnOpenAssenze && dashboard && assenzePage) {
    btnOpenAssenze.addEventListener("click", () => {
      dashboard.classList.add("hidden");
      assenzePage.classList.remove("hidden");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Torna alla Dashboard
  if (btnBackDashboard && dashboard && assenzePage) {
    btnBackDashboard.addEventListener("click", () => {
      assenzePage.classList.add("hidden");
      dashboard.classList.remove("hidden");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Invio del modulo di richiesta assenza (solo FEEDBACK, nessun server)
  if (assenzeForm && assenzeFeedback) {
    assenzeForm.addEventListener("submit", (event) => {
      event.preventDefault();

      assenzeFeedback.classList.remove("hidden");
      assenzeFeedback.scrollIntoView({ behavior: "smooth", block: "center" });

      assenzeForm.reset();
    });
  }
});
