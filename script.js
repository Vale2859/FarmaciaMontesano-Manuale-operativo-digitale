document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     LOGIN & RUOLI
  ===================================================== */

  const authContainer = document.getElementById("authContainer");
  const appContainer = document.getElementById("appContainer");
  const loginForm = document.getElementById("loginForm");
  const loginRoleLabel = document.getElementById("loginRoleLabel");
  const loginError = document.getElementById("loginError");
  const roleTabs = document.querySelectorAll(".auth-tab");
  const currentRoleLabel = document.getElementById("currentRoleLabel");

  let currentRole = "farmacia";

  roleTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      roleTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      currentRole = tab.dataset.role;

      const map = {
        farmacia: "Farmacia",
        titolare: "Titolare",
        dipendente: "Dipendente",
      };
      loginRoleLabel.textContent = map[currentRole];
    });
  });

  const credentials = {
    farmacia: { user: "farmacia", pass: "1234" },
    titolare: { user: "titolare", pass: "1234" },
    dipendente: { user: "dipendente", pass: "1234" },
  };

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const u = document.getElementById("loginUsername").value.trim();
    const p = document.getElementById("loginPassword").value.trim();
    const cred = credentials[currentRole];

    if (cred && u === cred.user && p === cred.pass) {
      localStorage.setItem("loggedRole", currentRole);
      showApp();
    } else {
      loginError.classList.remove("hidden");
    }
  });

  function showApp() {
    authContainer.classList.add("hidden");
    appContainer.classList.remove("hidden");

    const roleText = {
      farmacia: "Farmacia (accesso generico)",
      titolare: "Titolare",
      dipendente: "Dipendente",
    };
    currentRoleLabel.textContent = roleText[currentRole];

    window.scrollTo(0, 0);
  }

  /* =====================================================
     LOGOUT
  ===================================================== */

  function doLogout() {
    localStorage.removeItem("loggedRole");
    window.location.href = "index.html";
  }

  const logoutBtn = document.querySelector(".logout");
  if (logoutBtn) logoutBtn.addEventListener("click", doLogout);

  /* =====================================================
     SIDEBAR / MENU LATERALE
  ===================================================== */

  const sidebar = document.getElementById("sidebar");
  const hamburger = document.getElementById("hamburger");
  const closeSidebar = document.getElementById("closeSidebar");

  if (hamburger) {
    hamburger.addEventListener("click", () => {
      sidebar.classList.add("open");
    });
  }

  if (closeSidebar) {
    closeSidebar.addEventListener("click", () => {
      sidebar.classList.remove("open");
    });
  }

  document.addEventListener("click", (e) => {
    if (!sidebar.contains(e.target) && !hamburger.contains(e.target)) {
      sidebar.classList.remove("open");
    }
  });

  /* =====================================================
     NAVIGAZIONE: DASHBOARD → PAGINA ASSENZE
  ===================================================== */

  const dashboard = document.getElementById("dashboard");
  const assenzePage = document.getElementById("assenzePage");
  const btnOpenAssenze = document.getElementById("openAssenze");
  const btnBackDashboard = document.getElementById("backToDashboard");

  if (btnOpenAssenze) {
    btnOpenAssenze.addEventListener("click", () => {
      dashboard.classList.add("hidden");
      assenzePage.classList.remove("hidden");
      window.scrollTo(0, 0);
    });
  }

  if (btnBackDashboard) {
    btnBackDashboard.addEventListener("click", () => {
      assenzePage.classList.add("hidden");
      dashboard.classList.remove("hidden");
      window.scrollTo(0, 0);
    });
  }

  /* =====================================================
     INVIO MODULO RICHIESTA ASSENZA
  ===================================================== */

  const assenzeForm = document.querySelector(".assenze-form");
  const assenzeFeedback = document.getElementById("assenzeFeedback");

  if (assenzeForm) {
    assenzeForm.addEventListener("submit", (e) => {
      e.preventDefault();

      assenzeFeedback.classList.remove("hidden");
      assenzeFeedback.scrollIntoView({ behavior: "smooth", block: "center" });

      assenzeForm.reset();
    });
  }

});
