// Tutto il codice viene inizializzato dopo il caricamento della pagina
document.addEventListener("DOMContentLoaded", () => {
  /* ========= RIFERIMENTI BASE ========= */
  const authContainer = document.getElementById("authContainer");
  const app = document.getElementById("app");

  const loginForm = document.getElementById("loginForm");
  const loginRoleLabel = document.getElementById("loginRoleLabel");
  const authTabs = document.querySelectorAll(".auth-tab");
  const currentRoleLabel = document.getElementById("currentRoleLabel");

  const sidebar = document.getElementById("sidebar");
  const hamburger = document.getElementById("hamburger");
  const closeSidebar = document.getElementById("closeSidebar");
  const logoutItems = document.querySelectorAll(".logout");
  const sidebarNavItems = document.querySelectorAll(".sidebar-list li[data-nav]");

  const dashboard = document.getElementById("dashboard");
  const assenzePage = document.getElementById("assenzePage");
  const comunicazioniPage = document.getElementById("comunicazioniPage");

  const openAssenzeBtn = document.getElementById("openAssenze");
  const backFromAssenze = document.getElementById("backFromAssenze");

  const openComunicazioniBtn = document.getElementById("openComunicazioni");
  const backFromComunicazioni = document.getElementById("backFromComunicazioni");

  const assenzeForm = document.getElementById("assenzeForm");
  const assenzeFeedback = document.getElementById("assenzeFeedback");

  const commsForm = document.getElementById("commsForm");
  const commsFeedback = document.getElementById("commsFeedback");
  const commsList = document.getElementById("commsList");

  let currentRole = "farmacia";

  /* ========= FUNZIONI DI UTILITÀ ========= */

  function showPage(pageId) {
    // Nasconde tutte le sezioni principali
    [dashboard, assenzePage, comunicazioniPage].forEach((sec) => {
      if (sec) sec.classList.add("hidden");
    });

    const page = document.getElementById(pageId);
    if (page) page.classList.remove("hidden");
  }

  function closeSidebarMenu() {
    sidebar.classList.remove("open");
  }

  function resetLoginForm() {
    loginForm.reset();
  }

  function updateRoleLabel() {
    let labelText = "";
    switch (currentRole) {
      case "farmacia":
        labelText = "Farmacia (accesso generico)";
        break;
      case "titolare":
        labelText = "Titolare";
        break;
      case "dipendente":
        labelText = "Dipendente";
        break;
      default:
        labelText = "Farmacia";
    }
    currentRoleLabel.textContent = labelText;
  }

  /* ========= GESTIONE TAB LOGIN ========= */

  authTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      authTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      currentRole = tab.dataset.role;
      // Aggiorno etichette
      loginRoleLabel.textContent =
        currentRole.charAt(0).toUpperCase() + currentRole.slice(1);
      updateRoleLabel();
    });
  });

  /* ========= SUBMIT LOGIN (DEMO) ========= */

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      // Nessun controllo reale per ora (demo)
      authContainer.classList.add("hidden");
      app.classList.remove("hidden");
      showPage("dashboard");
      updateRoleLabel();
    });
  }

  /* ========= SIDEBAR ========= */

  if (hamburger) {
    hamburger.addEventListener("click", () => {
      sidebar.classList.add("open");
    });
  }

  if (closeSidebar) {
    closeSidebar.addEventListener("click", () => {
      closeSidebarMenu();
    });
  }

  // Chiudi sidebar cliccando fuori (solo desktop)
  document.addEventListener("click", (e) => {
    if (
      sidebar.classList.contains("open") &&
      !sidebar.contains(e.target) &&
      e.target !== hamburger
    ) {
      closeSidebarMenu();
    }
  });

  /* ========= NAVIGAZIONE DA SIDEBAR ========= */

  sidebarNavItems.forEach((item) => {
    item.addEventListener("click", () => {
      const target = item.getAttribute("data-nav");
      if (target) {
        showPage(target);
      }
      closeSidebarMenu();
    });
  });

  /* ========= LOGOUT ========= */

  logoutItems.forEach((el) => {
    el.addEventListener("click", () => {
      // Torna al login
      app.classList.add("hidden");
      authContainer.classList.remove("hidden");
      showPage("dashboard"); // pre-carica dashboard per il prossimo login
      resetLoginForm();
      closeSidebarMenu();
    });
  });

  /* ========= NAVIGAZIONE ASSENZE ========= */

  if (openAssenzeBtn) {
    openAssenzeBtn.addEventListener("click", () => {
      showPage("assenzePage");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  if (backFromAssenze) {
    backFromAssenze.addEventListener("click", () => {
      showPage("dashboard");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ========= NAVIGAZIONE COMUNICAZIONI ========= */

  if (openComunicazioniBtn) {
    openComunicazioniBtn.addEventListener("click", () => {
      showPage("comunicazioniPage");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  if (backFromComunicazioni) {
    backFromComunicazioni.addEventListener("click", () => {
      showPage("dashboard");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ========= FORM ASSENZE (DEMO) ========= */

  if (assenzeForm) {
    assenzeForm.addEventListener("submit", (e) => {
      e.preventDefault();
      assenzeFeedback.classList.remove("hidden");
      setTimeout(() => {
        assenzeFeedback.classList.add("hidden");
      }, 2500);
      assenzeForm.reset();
    });
  }

  /* ========= COMUNICAZIONI: LISTA + FORM (DEMO) ========= */

  if (commsList) {
    commsList.querySelectorAll("li").forEach((item) => {
      item.addEventListener("click", () => {
        commsList.querySelectorAll("li").forEach((li) => li.classList.remove("active"));
        item.classList.add("active");
        // Compila (demo) il form con il titolo cliccato
        const titolo = item.querySelector("h3")?.textContent || "";
        const meta = item.querySelector(".meta")?.textContent || "";
        const titoloInput = document.getElementById("commsTitolo");
        const testoInput = document.getElementById("commsTesto");
        if (titoloInput && testoInput) {
          titoloInput.value = titolo;
          testoInput.value = "Dettagli comunicazione:\n" + meta;
        }
      });
    });
  }

  if (commsForm) {
    commsForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (commsFeedback) {
        commsFeedback.textContent =
          "✅ Comunicazione salvata (demo, nessun invio reale).";
        commsFeedback.classList.remove("hidden");
        setTimeout(() => commsFeedback.classList.add("hidden"), 2500);
      }
    });
  }

  const commsBozza = document.getElementById("commsBozza");
  if (commsBozza && commsFeedback) {
    commsBozza.addEventListener("click", () => {
      commsFeedback.textContent = "💾 Bozza salvata (solo dimostrazione).";
      commsFeedback.classList.remove("hidden");
      setTimeout(() => commsFeedback.classList.add("hidden"), 2500);
    });
  }
});
