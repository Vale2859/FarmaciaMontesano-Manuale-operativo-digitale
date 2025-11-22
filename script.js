document.addEventListener("DOMContentLoaded", () => {
  const authContainer = document.getElementById("authContainer");
  const appContainer = document.getElementById("appContainer");
  const loginForm = document.getElementById("loginForm");
  const loginRoleLabel = document.getElementById("loginRoleLabel");
  const currentRoleLabel = document.getElementById("currentRoleLabel");
  const assenzeCardTitle = document.getElementById("assenzeCardTitle");

  let activeRole = "farmacia";

  // ====== TABS RUOLO LOGIN ======
  const roleTabs = document.querySelectorAll(".auth-tab");
  roleTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      roleTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      activeRole = tab.dataset.role;
      loginRoleLabel.textContent = tab.textContent;
    });
  });

  function updateRoleUI() {
    const map = {
      farmacia: "Farmacia (accesso generico)",
      titolare: "Titolare",
      dipendente: "Dipendente",
    };
    currentRoleLabel.textContent = map[activeRole] || "Farmacia";

    if (activeRole === "dipendente") {
      assenzeCardTitle.textContent = "Le mie assenze";
    } else {
      assenzeCardTitle.textContent = "Assenze del personale";
    }
  }

  // ====== LOGIN (semplice, senza controllo password per ora) ======
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    authContainer.classList.add("hidden");
    appContainer.classList.remove("hidden");
    showPage("dashboard");
    updateRoleUI();
  });

  // ====== SIDEBAR / HAMBURGER ======
  const sidebar = document.getElementById("sidebar");
  const hamburger = document.getElementById("hamburger");
  const closeSidebar = document.getElementById("closeSidebar");
  const logoutLink = document.getElementById("logoutLink");

  function openSidebar() {
    sidebar.classList.add("sidebar-open");
  }

  function closeSidebarFn() {
    sidebar.classList.remove("sidebar-open");
  }

  hamburger.addEventListener("click", (e) => {
    e.stopPropagation();
    openSidebar();
  });

  closeSidebar.addEventListener("click", () => {
    closeSidebarFn();
  });

  document.addEventListener("click", (e) => {
    if (
      sidebar.classList.contains("sidebar-open") &&
      !sidebar.contains(e.target) &&
      e.target !== hamburger
    ) {
      closeSidebarFn();
    }
  });

  // Logout
  logoutLink.addEventListener("click", () => {
    appContainer.classList.add("hidden");
    authContainer.classList.remove("hidden");
    loginForm.reset();
    activeRole = "farmacia";
    roleTabs.forEach((t) => t.classList.remove("active"));
    roleTabs[0].classList.add("active");
    loginRoleLabel.textContent = "Farmacia";
    closeSidebarFn();
  });

  // ====== NAVIGAZIONE PAGINE ======
  const pages = document.querySelectorAll(".page");

  function showPage(id) {
    pages.forEach((page) => {
      if (page.id === id) {
        page.classList.remove("hidden");
      } else {
        page.classList.add("hidden");
      }
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Bottoni dalla dashboard
  const btnOpenAssenze = document.getElementById("btnOpenAssenze");
  const btnOpenFarmacie = document.getElementById("btnOpenFarmacie");
  const btnOpenProcedure = document.getElementById("btnOpenProcedure");
  const btnOpenComunicazioni = document.getElementById("btnOpenComunicazioni");

  if (btnOpenAssenze) {
    btnOpenAssenze.addEventListener("click", () => showPage("assenzePage"));
  }
  if (btnOpenFarmacie) {
    btnOpenFarmacie.addEventListener("click", () => showPage("farmaciePage"));
  }
  if (btnOpenProcedure) {
    btnOpenProcedure.addEventListener("click", () => showPage("procedurePage"));
  }
  if (btnOpenComunicazioni) {
    // per ora non abbiamo una pagina dedicata, in futuro potremo aggiungerla
    alert(
      "Qui in futuro potrai aprire la pagina dettagliata delle comunicazioni interne."
    );
  }

  // Pulsanti "← Dashboard" nelle pagine interne
  document.querySelectorAll(".btn-back-dashboard").forEach((btn) => {
    btn.addEventListener("click", () => showPage("dashboard"));
  });

  // ====== FORM ASSENZE (solo messaggio grafico) ======
  const assenzeForm = document.getElementById("assenzeForm");
  const assenzeFeedback = document.getElementById("assenzeFeedback");

  if (assenzeForm && assenzeFeedback) {
    assenzeForm.addEventListener("submit", (e) => {
      e.preventDefault();
      assenzeFeedback.classList.remove("hidden");
    });
  }

  // ====== FORM PROCEDURE (solo messaggio grafico) ======
  const procedureForm = document.getElementById("procedureForm");
  const procedureFeedback = document.getElementById("procedureFeedback");

  if (procedureForm && procedureFeedback) {
    procedureForm.addEventListener("submit", (e) => {
      e.preventDefault();
      procedureFeedback.classList.remove("hidden");
    });
  }
});
