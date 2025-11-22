// ================== LOGIN & RUOLI ==================
document.addEventListener("DOMContentLoaded", () => {
  const authContainer = document.getElementById("authContainer");
  const appContainer = document.getElementById("appContainer");
  const loginForm = document.getElementById("loginForm");
  const loginRoleLabel = document.getElementById("loginRoleLabel");
  const roleBadge = document.getElementById("roleBadge");
  const tabs = document.querySelectorAll(".auth-tab");
  const loginError = document.getElementById("loginError");

  let currentRole = "farmacia";

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      currentRole = tab.dataset.role;
      loginRoleLabel.textContent =
        currentRole.charAt(0).toUpperCase() + currentRole.slice(1);
    });
  });

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Per ora accettiamo sempre il login
    authContainer.classList.add("hidden");
    appContainer.classList.remove("hidden");
    roleBadge.textContent =
      currentRole === "farmacia"
        ? "Farmacia (accesso generico)"
        : currentRole === "titolare"
        ? "Titolare"
        : "Dipendente";

    showPage("dashboard");
    loginError.classList.add("hidden");
  });

  // ================== NAVIGAZIONE PAGINE ==================
  const pages = document.querySelectorAll(".page");

  function showPage(id) {
    pages.forEach((p) => p.classList.remove("page-active"));
    const target = document.getElementById(id);
    if (target) {
      target.classList.add("page-active");
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }

  // Bottoni card dashboard
  const openAssenzeBtn = document.getElementById("openAssenze");
  const openCommsBtn = document.getElementById("openComunicazioni");

  if (openAssenzeBtn) {
    openAssenzeBtn.addEventListener("click", () => showPage("assenzePage"));
  }

  if (openCommsBtn) {
    openCommsBtn.addEventListener("click", () => showPage("comunicazioniPage"));
  }

  // Bottoni "indietro" nelle pagine interne
  document.querySelectorAll(".back-button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.target || "dashboard";
      showPage(target);
    });
  });

  // ================== SIDEBAR / HAMBURGER ==================
  const sidebar = document.getElementById("sidebar");
  const hamburger = document.getElementById("hamburger");
  const closeSidebar = document.getElementById("closeSidebar");

  function openSidebar() {
    sidebar.classList.add("open");
  }
  function closeSidebarFn() {
    sidebar.classList.remove("open");
  }

  if (hamburger) hamburger.addEventListener("click", openSidebar);
  if (closeSidebar) closeSidebar.addEventListener("click", closeSidebarFn);

  // click fuori per chiudere sidebar
  document.addEventListener("click", (e) => {
    if (
      sidebar.classList.contains("open") &&
      !sidebar.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      closeSidebarFn();
    }
  });

  // Voci menu sidebar
  document.querySelectorAll(".sidebar-list li").forEach((item) => {
    item.addEventListener("click", () => {
      const action = item.dataset.action;

      if (action === "home") {
        showPage("dashboard");
      } else if (action === "logout") {
        // Logout semplice lato client
        appContainer.classList.add("hidden");
        authContainer.classList.remove("hidden");
        showPage("dashboard");
      }

      closeSidebarFn();
    });
  });

  // ================== FORM COMUNICAZIONI (DEMO) ==================
  const commsForm = document.getElementById("commsForm");
  const commsFeedback = document.getElementById("commsFeedback");
  const commsTitolo = document.getElementById("commsTitolo");
  const commsTesto = document.getElementById("commsTesto");
  const quickButtons = document.querySelectorAll(".quick-chip");
  const commsBozza = document.getElementById("commsBozza");

  if (commsForm) {
    commsForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Per ora solo feedback finto
      commsFeedback.classList.remove("hidden");
      setTimeout(() => commsFeedback.classList.add("hidden"), 3000);

      // Pulisci i campi
      commsTitolo.value = "";
      commsTesto.value = "";
    });
  }

  if (commsBozza) {
    commsBozza.addEventListener("click", () => {
      commsFeedback.textContent = "💾 Bozza salvata (demo).";
      commsFeedback.classList.remove("hidden");
      setTimeout(() => {
        commsFeedback.textContent =
          "✅ Comunicazione registrata (demo). In futuro verrà salvata nel server.";
        commsFeedback.classList.add("hidden");
      }, 2500);
    });
  }

  // Messaggi rapidi: inseriscono testo
  quickButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!commsTesto) return;
      const msg = btn.textContent.trim();
      if (!commsTesto.value) {
        commsTesto.value = msg;
      } else {
        commsTesto.value += "\n" + msg;
      }
      commsTesto.focus();
    });
  });
});
