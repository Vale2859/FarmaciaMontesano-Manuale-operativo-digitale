// ================== LOGIN & RUOLI ==================
document.addEventListener("DOMContentLoaded", () => {
  const authContainer = document.getElementById("authContainer");
  const app = document.getElementById("app");

  const loginForm = document.getElementById("loginForm");
  const loginFeedback = document.getElementById("loginFeedback");
  const loginRoleLabel = document.getElementById("loginRoleLabel");
  const currentRoleChip = document.getElementById("currentRoleChip");

  const authTabs = document.querySelectorAll(".auth-tab");
  let currentRole = "farmacia";

  authTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      authTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      currentRole = tab.dataset.role;

      if (currentRole === "farmacia") {
        loginRoleLabel.textContent = "Farmacia";
      } else if (currentRole === "titolare") {
        loginRoleLabel.textContent = "Titolare";
      } else {
        loginRoleLabel.textContent = "Dipendente";
      }
    });
  });

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const user = document.getElementById("username").value.trim();
    const pass = document.getElementById("password").value.trim();

    // Demo: accetta qualsiasi cosa non vuota
    if (!user || !pass) {
      loginFeedback.textContent = "⚠️ Inserisci username e password.";
      loginFeedback.classList.remove("hidden");
      return;
    }

    loginFeedback.classList.add("hidden");
    authContainer.classList.add("hidden");
    app.classList.remove("hidden");

    // Aggiorna chip ruolo
    let label = "";
    if (currentRole === "farmacia") {
      label = "Farmacia (accesso generico)";
    } else if (currentRole === "titolare") {
      label = "Titolare";
    } else {
      label = "Dipendente";
    }
    currentRoleChip.textContent = label;
  });

  // ================== NAVIGAZIONE PAGINE ==================
  const dashboardSection = document.getElementById("dashboard");
  const assenzePage = document.getElementById("assenzePage");
  const turniPage = document.getElementById("turniPage");
  const commsPage = document.getElementById("comunicazioniPage");

  function showPage(sectionId) {
    [dashboardSection, assenzePage, turniPage, commsPage].forEach((sec) => {
      if (!sec) return;
      if (sec.id === sectionId) {
        sec.classList.remove("hidden");
        sec.classList.add("active-page");
      } else {
        sec.classList.add("hidden");
        sec.classList.remove("active-page");
      }
    });
    // chiudi sidebar su mobile
    sidebar.classList.remove("open");
  }

  // Pulsanti card
  const openAssenzeBtn = document.getElementById("openAssenze");
  const openTurniBtn = document.getElementById("openTurni");
  const openCommsBtn = document.getElementById("openComunicazioni");

  if (openAssenzeBtn) {
    openAssenzeBtn.addEventListener("click", () => showPage("assenzePage"));
  }
  if (openTurniBtn) {
    openTurniBtn.addEventListener("click", () => showPage("turniPage"));
  }
  if (openCommsBtn) {
    openCommsBtn.addEventListener("click", () => showPage("comunicazioniPage"));
  }

  // Pulsanti back dashboard
  document.querySelectorAll(".back-button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const dest = btn.dataset.back || "dashboard";
      showPage(dest);
    });
  });

  // Sidebar click voci
  const sidebar = document.getElementById("sidebar");
  sidebar.querySelectorAll("li[data-nav]").forEach((item) => {
    item.addEventListener("click", () => {
      const target = item.getAttribute("data-nav");
      showPage(target);
    });
  });

  // ================== SIDEBAR / HAMBURGER ==================
  const hamburger = document.getElementById("hamburger");
  const closeSidebarButton = document.getElementById("closeSidebar");

  hamburger.addEventListener("click", () => {
    sidebar.classList.add("open");
  });

  closeSidebarButton.addEventListener("click", () => {
    sidebar.classList.remove("open");
  });

  // Chiudi sidebar cliccando fuori
  document.addEventListener("click", (e) => {
    if (
      sidebar.classList.contains("open") &&
      !sidebar.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      sidebar.classList.remove("open");
    }
  });

  // ================== LOGOUT ==================
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      // Torna al login
      app.classList.add("hidden");
      authContainer.classList.remove("hidden");

      // reset semplice campi login
      document.getElementById("username").value = "";
      document.getElementById("password").value = "";
      loginFeedback.classList.add("hidden");

      // torna alla dashboard al prossimo login
      showPage("dashboard");
      sidebar.classList.remove("open");
    });
  }

  // ================== FORM ASSENZE ==================
  const assenzeForm = document.querySelector(".assenze-form");
  const assenzeFeedback = document.getElementById("assenzeFeedback");

  if (assenzeForm && assenzeFeedback) {
    assenzeForm.addEventListener("submit", (e) => {
      e.preventDefault();
      assenzeFeedback.classList.remove("hidden");
      assenzeFeedback.textContent =
        "✅ Richiesta inviata correttamente. (Demo – non ancora salvata sul server)";
      setTimeout(() => {
        assenzeFeedback.classList.add("hidden");
      }, 3000);
      assenzeForm.reset();
    });
  }

  // ================== FORM COMUNICAZIONI ==================
  const commsForm = document.getElementById("commsForm");
  const commsFeedback = document.getElementById("commsFeedback");

  if (commsForm && commsFeedback) {
    commsForm.addEventListener("submit", (e) => {
      e.preventDefault();
      commsFeedback.classList.remove("hidden");
      commsFeedback.textContent =
        "✅ Comunicazione inviata (demo). Quando avremo il server verrà salvata davvero.";
      setTimeout(() => {
        commsFeedback.classList.add("hidden");
      }, 3000);
      commsForm.reset();
    });
  }
});
