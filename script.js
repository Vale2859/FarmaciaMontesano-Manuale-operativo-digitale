document.addEventListener("DOMContentLoaded", () => {
  // --- Riferimenti principali ---
  const authContainer = document.getElementById("authContainer");
  const appContainer = document.getElementById("appContainer");
  const loginForm = document.getElementById("loginForm");
  const roleTabs = document.querySelectorAll(".auth-tab");
  const loginRoleLabel = document.getElementById("loginRoleLabel");
  const accessChip = document.getElementById("accessChip");

  const sidebar = document.getElementById("sidebar");
  const hamburger = document.getElementById("hamburger");
  const closeSidebarBtn = document.getElementById("closeSidebar");
  const logoutBtn = document.getElementById("logoutBtn");

  const dashboardSection = document.getElementById("dashboard");
  const assenzePage = document.getElementById("assenzePage");
  const openAssenzeBtn = document.getElementById("openAssenze");
  const backToDashboardBtn = document.getElementById("backToDashboard");
  const assenzeFeedback = document.getElementById("assenzeFeedback");

  let currentRole = "farmacia";

  // --- Tabs ruoli login ---
  roleTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      roleTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      currentRole = tab.dataset.role;

      if (currentRole === "farmacia") {
        loginRoleLabel.textContent = "Farmacia";
        accessChip.textContent = "Farmacia (accesso generico)";
      } else if (currentRole === "titolare") {
        loginRoleLabel.textContent = "Titolare";
        accessChip.textContent = "Titolare";
      } else {
        loginRoleLabel.textContent = "Dipendente";
        accessChip.textContent = "Dipendente";
      }
    });
  });

  // --- Login demo ---
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      authContainer.classList.add("hidden");
      appContainer.classList.remove("hidden");
      window.scrollTo(0, 0);
    });
  }

  // --- Sidebar ---
  if (hamburger && sidebar) {
    hamburger.addEventListener("click", (e) => {
      e.stopPropagation();
      sidebar.classList.add("open");
    });
  }

  if (closeSidebarBtn && sidebar) {
    closeSidebarBtn.addEventListener("click", () => {
      sidebar.classList.remove("open");
    });
  }

  document.addEventListener("click", (e) => {
    if (
      sidebar &&
      sidebar.classList.contains("open") &&
      !sidebar.contains(e.target) &&
      e.target !== hamburger
    ) {
      sidebar.classList.remove("open");
    }
  });

  // --- Logout ---
  function doLogout() {
    appContainer.classList.add("hidden");
    authContainer.classList.remove("hidden");
    loginForm.reset();

    roleTabs.forEach((t) => t.classList.remove("active"));
    roleTabs[0].classList.add("active");
    currentRole = "farmacia";
    loginRoleLabel.textContent = "Farmacia";
    accessChip.textContent = "Farmacia (accesso generico)";
    window.scrollTo(0, 0);
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      sidebar.classList.remove("open");
      doLogout();
    });
  }

  // --- Dashboard -> pagina assenze ---
  if (openAssenzeBtn) {
    openAssenzeBtn.addEventListener("click", () => {
      dashboardSection.classList.add("hidden");
      assenzePage.classList.remove("hidden");
      window.scrollTo(0, 0);
    });
  }

  if (backToDashboardBtn) {
    backToDashboardBtn.addEventListener("click", () => {
      assenzePage.classList.add("hidden");
      dashboardSection.classList.remove("hidden");
      window.scrollTo(0, 0);
    });
  }

  // --- Form richiesta assenza (solo feedback) ---
  const assenzeForm = document.querySelector(".assenze-form");
  if (assenzeForm) {
    assenzeForm.addEventListener("submit", (e) => {
      e.preventDefault();
      assenzeFeedback.classList.remove("hidden");
      setTimeout(() => {
        assenzeFeedback.classList.add("hidden");
      }, 3500);
    });
  }
});
