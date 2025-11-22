// Script principale Portale Farmacia Montesano
document.addEventListener("DOMContentLoaded", () => {
  // Riferimenti base
  const authContainer = document.getElementById("authContainer");
  const app = document.getElementById("app");
  const loginForm = document.getElementById("loginForm");
  const loginRoleLabel = document.getElementById("loginRoleLabel");
  const roleTabs = document.querySelectorAll(".auth-tab");
  const currentRolePill = document.getElementById("currentRolePill");

  const sidebar = document.getElementById("sidebar");
  const hamburger = document.getElementById("hamburger");
  const closeSidebarBtn = document.getElementById("closeSidebar");
  const sidebarLinks = document.querySelectorAll(".sidebar-link");
  const logoutLinks = document.querySelectorAll(".logout-link");

  const dashboardSection = document.getElementById("dashboard");
  const assenzePage = document.getElementById("assenzePage");
  const turniPage = document.getElementById("turniPage");
  const comunicazioniPage = document.getElementById("comunicazioniPage");
  const procedurePage = document.getElementById("procedurePage");

  let currentRole = "farmacia";

  // -------- LOGIN --------

  roleTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      roleTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      currentRole = tab.dataset.role;
      let labelText = "Farmacia";
      if (currentRole === "titolare") labelText = "Titolare";
      if (currentRole === "dipendente") labelText = "Dipendente";
      loginRoleLabel.textContent = labelText;
      currentRolePill.textContent =
        labelText === "Farmacia"
          ? "Farmacia (accesso generico)"
          : labelText;
    });
  });

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    // Demo: accetto sempre, basta che ci sia qualcosa
    authContainer.classList.add("hidden");
    app.classList.remove("hidden");
    showSection("dashboard");
  });

  // -------- NAVIGAZIONE SEZIONI --------

  function hideAllSections() {
    dashboardSection.classList.add("hidden");
    assenzePage.classList.add("hidden");
    turniPage.classList.add("hidden");
    comunicazioniPage.classList.add("hidden");
    procedurePage.classList.add("hidden");
  }

  function showSection(id) {
    hideAllSections();
    if (id === "dashboard") dashboardSection.classList.remove("hidden");
    if (id === "assenzePage") assenzePage.classList.remove("hidden");
    if (id === "turniPage") turniPage.classList.remove("hidden");
    if (id === "comunicazioniPage")
      comunicazioniPage.classList.remove("hidden");
    if (id === "procedurePage") procedurePage.classList.remove("hidden");
    sidebar.classList.remove("open");
  }

  // Bottoni card -> pagine
  const openAssenzeBtn = document.getElementById("openAssenze");
  const openTurniBtn = document.getElementById("openTurni");
  const openComunicazioniBtn = document.getElementById("openComunicazioni");
  const openProcedureBtn = document.getElementById("openProcedure");

  if (openAssenzeBtn) {
    openAssenzeBtn.addEventListener("click", () =>
      showSection("assenzePage")
    );
  }
  if (openTurniBtn) {
    openTurniBtn.addEventListener("click", () => showSection("turniPage"));
  }
  if (openComunicazioniBtn) {
    openComunicazioniBtn.addEventListener("click", () =>
      showSection("comunicazioniPage")
    );
  }
  if (openProcedureBtn) {
    openProcedureBtn.addEventListener("click", () =>
      showSection("procedurePage")
    );
  }

  // Bottoni Dashboard nelle pagine
  const backFromAssenze = document.getElementById("backFromAssenze");
  const backFromTurni = document.getElementById("backFromTurni");
  const backFromComunicazioni =
    document.getElementById("backFromComunicazioni");
  const backFromProcedure = document.getElementById("backFromProcedure");

  if (backFromAssenze) {
    backFromAssenze.addEventListener("click", () => showSection("dashboard"));
  }
  if (backFromTurni) {
    backFromTurni.addEventListener("click", () => showSection("dashboard"));
  }
  if (backFromComunicazioni) {
    backFromComunicazioni.addEventListener("click", () =>
      showSection("dashboard")
    );
  }
  if (backFromProcedure) {
    backFromProcedure.addEventListener("click", () =>
      showSection("dashboard")
    );
  }

  // Sidebar
  if (hamburger) {
    hamburger.addEventListener("click", () => {
      sidebar.classList.toggle("open");
    });
  }

  if (closeSidebarBtn) {
    closeSidebarBtn.addEventListener("click", () => {
      sidebar.classList.remove("open");
    });
  }

  sidebarLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const target = link.dataset.target;
      if (target === "dashboard") {
        showSection("dashboard");
      }
    });
  });

  // Logout
  logoutLinks.forEach((l) => {
    l.addEventListener("click", () => {
      app.classList.add("hidden");
      authContainer.classList.remove("hidden");
      loginForm.reset();
      // reset ruolo
      currentRole = "farmacia";
      loginRoleLabel.textContent = "Farmacia";
      currentRolePill.textContent = "Farmacia (accesso generico)";
      roleTabs.forEach((t) => t.classList.remove("active"));
      roleTabs[0].classList.add("active");
      hideAllSections();
      dashboardSection.classList.remove("hidden");
      sidebar.classList.remove("open");
    });
  });

  // -------- FORM DEMO: ASSENZE --------
  const assenzeForm = document.getElementById("assenzeForm");
  const assenzeFeedback = document.getElementById("assenzeFeedback");

  if (assenzeForm && assenzeFeedback) {
    assenzeForm.addEventListener("submit", (e) => {
      e.preventDefault();
      assenzeFeedback.classList.remove("hidden");
      setTimeout(() => {
        assenzeFeedback.classList.add("hidden");
      }, 2500);
      assenzeForm.reset();
    });
  }

  // -------- FORM DEMO: COMUNICAZIONI --------
  const comForm = document.getElementById("comForm");
  const comFeedback = document.getElementById("comFeedback");

  if (comForm && comFeedback) {
    comForm.addEventListener("submit", (e) => {
      e.preventDefault();
      comFeedback.classList.remove("hidden");
      setTimeout(() => {
        comFeedback.classList.add("hidden");
      }, 2500);
      comForm.reset();
    });
  }

  // -------- FORM DEMO: PROCEDURE --------
  const procedureForm = document.getElementById("procedureForm");
  const procedureFeedback = document.getElementById("procedureFeedback");

  if (procedureForm && procedureFeedback) {
    procedureForm.addEventListener("submit", (e) => {
      e.preventDefault();
      procedureFeedback.classList.remove("hidden");
      setTimeout(() => {
        procedureFeedback.classList.add("hidden");
      }, 2500);
      procedureForm.reset();
    });
  }
});
