// ================== LOGIN & RUOLI ==================
document.addEventListener("DOMContentLoaded", () => {
  const authContainer = document.getElementById("authContainer");
  const app = document.getElementById("app");

  const loginForm = document.getElementById("loginForm");
  const loginRoleLabel = document.getElementById("loginRoleLabel");
  const loginFeedback = document.getElementById("loginFeedback");
  const roleChip = document.getElementById("roleChip");

  const authTabs = document.querySelectorAll(".auth-tab");
  let currentRole = "farmacia";

  // Cambia ruolo quando clicchi sui tab
  authTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      authTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      currentRole = tab.dataset.role;
      const label =
        currentRole === "farmacia"
          ? "Farmacia"
          : currentRole === "titolare"
          ? "Titolare"
          : "Dipendente";
      loginRoleLabel.textContent = label;
    });
  });

  // Login "finto" (per ora)
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    authContainer.classList.add("hidden");
    app.classList.remove("hidden");

    // Aggiorna chip in alto
    if (currentRole === "farmacia") {
      roleChip.textContent = "Farmacia (accesso generico)";
    } else if (currentRole === "titolare") {
      roleChip.textContent = "Titolare – controllo completo";
    } else {
      roleChip.textContent = "Dipendente – area personale condivisa";
    }

    loginFeedback.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // ================== SIDEBAR E LOGOUT ==================
  const sidebar = document.getElementById("sidebar");
  const sidebarOverlay = document.getElementById("sidebarOverlay");
  const hamburger = document.getElementById("hamburger");
  const closeSidebar = document.getElementById("closeSidebar");
  const logoutItems = document.querySelectorAll(".sidebar-item.logout");

  function openSidebar() {
    sidebar.classList.add("open");
    sidebarOverlay.classList.add("open");
  }

  function hideSidebar() {
    sidebar.classList.remove("open");
    sidebarOverlay.classList.remove("open");
  }

  hamburger.addEventListener("click", openSidebar);
  closeSidebar.addEventListener("click", hideSidebar);
  sidebarOverlay.addEventListener("click", hideSidebar);

  logoutItems.forEach((item) => {
    item.addEventListener("click", () => {
      hideSidebar();
      // Torna al login
      app.classList.add("hidden");
      authContainer.classList.remove("hidden");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  // ================== NAVIGAZIONE PAGINE ==================
  const dashboardSection = document.getElementById("dashboard");
  const assenzePage = document.getElementById("assenzePage");
  const comunicazioniPage = document.getElementById("comunicazioniPage");

  const openAssenzeBtn = document.getElementById("openAssenze");
  const openComunicazioniBtn = document.getElementById("openComunicazioni");
  const backButtons = document.querySelectorAll(".back-button");

  function showSection(sectionId) {
    // Nascondi tutte
    dashboardSection.classList.add("hidden");
    assenzePage.classList.add("hidden");
    comunicazioniPage.classList.add("hidden");

    if (sectionId === "dashboard") {
      dashboardSection.classList.remove("hidden");
    } else if (sectionId === "assenze") {
      assenzePage.classList.remove("hidden");
    } else if (sectionId === "comunicazioni") {
      comunicazioniPage.classList.remove("hidden");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (openAssenzeBtn) {
    openAssenzeBtn.addEventListener("click", () => showSection("assenze"));
  }
  if (openComunicazioniBtn) {
    openComunicazioniBtn.addEventListener("click", () =>
      showSection("comunicazioni")
    );
  }

  backButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.go || "dashboard";
      showSection(target);
    });
  });

  // ================== FORM ASSENZE (DEMO) ==================
  const assenzeForm = document.getElementById("assenzeForm");
  const assenzeFeedback = document.getElementById("assenzeFeedback");

  if (assenzeForm) {
    assenzeForm.addEventListener("submit", (e) => {
      e.preventDefault();
      assenzeFeedback.classList.remove("hidden");
      setTimeout(() => {
        assenzeFeedback.classList.add("hidden");
      }, 4000);
      assenzeForm.reset();
    });
  }

  // ================== FORM COMUNICAZIONI (DEMO) ==================
  const commsForm = document.getElementById("commsForm");
  const commsFeedback = document.getElementById("commsFeedback");
  const commsList = document.getElementById("commsList");

  if (commsForm && commsList) {
    commsForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const titolo = document.getElementById("commsTitolo").value.trim();
      const categoria = document.getElementById("commsCategoria").value;
      const testo = document.getElementById("commsTesto").value.trim();
      const destinatari =
        document.getElementById("commsDestinatari").value || "Tutto il personale";

      if (!titolo || !testo) {
        commsFeedback.textContent = "Compila almeno titolo e testo.";
        commsFeedback.classList.remove("hidden");
        commsFeedback.style.color = "#ffd1d1";
        return;
      }

      // Crea nuova comunicazione (solo in memoria)
      const li = document.createElement("li");
      li.className = "comms-item unread";

      const titleRow = document.createElement("div");
      titleRow.className = "comms-title-row";

      const tag = document.createElement("span");
      tag.className = "comms-tag";
      if (categoria === "procedura") {
        tag.classList.add("comms-tag-procedura");
        tag.textContent = "Procedura";
      } else if (categoria === "sicurezza") {
        tag.classList.add("comms-tag-sicurezza");
        tag.textContent = "Sicurezza";
      } else if (categoria === "formazione") {
        tag.classList.add("comms-tag-info");
        tag.textContent = "Formazione";
      } else {
        tag.classList.add("comms-tag-info");
        tag.textContent = "Info";
      }

      const dateSpan = document.createElement("span");
      dateSpan.className = "comms-date";
      dateSpan.textContent = "Adesso · demo";

      titleRow.appendChild(tag);
      titleRow.appendChild(dateSpan);

      const h3 = document.createElement("h3");
      h3.textContent = titolo;

      const pText = document.createElement("p");
      pText.className = "small-text";
      pText.textContent = testo;

      const pMeta = document.createElement("p");
      pMeta.className = "comms-meta";
      pMeta.innerHTML =
        "Inviato da <strong>Utente demo</strong> · Destinatari: " + destinatari;

      li.appendChild(titleRow);
      li.appendChild(h3);
      li.appendChild(pText);
      li.appendChild(pMeta);

      // Aggiungi in cima alla lista
      commsList.insertBefore(li, commsList.firstChild);

      commsFeedback.textContent =
        "✅ Comunicazione aggiunta alla lista (demo, non ancora salvata su server).";
      commsFeedback.style.color = "#a8ffb3";
      commsFeedback.classList.remove("hidden");

      setTimeout(() => {
        commsFeedback.classList.add("hidden");
      }, 4000);

      commsForm.reset();
    });
  }
});
