// ====== LOGIN ======
const authContainer = document.getElementById("authContainer");
const app = document.getElementById("app");

const authTabs = document.querySelectorAll(".auth-tab");
const loginRoleLabel = document.getElementById("loginRoleLabel");
const loginForm = document.getElementById("loginForm");
const currentRolePill = document.getElementById("currentRolePill");

let currentRole = "farmacia";

authTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    authTabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");

    currentRole = tab.dataset.role;

    if (currentRole === "farmacia") {
      loginRoleLabel.textContent = "Farmacia (accesso generico)";
    } else if (currentRole === "titolare") {
      loginRoleLabel.textContent = "Titolare";
    } else {
      loginRoleLabel.textContent = "Dipendente";
    }
  });
});

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  authContainer.classList.add("hidden");
  app.classList.remove("hidden");

  if (currentRole === "farmacia") {
    currentRolePill.textContent = "Farmacia (accesso generico)";
  } else if (currentRole === "titolare") {
    currentRolePill.textContent = "Titolare";
  } else {
    currentRolePill.textContent = "Dipendente";
  }

  // scroll su in alto quando entri
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ====== SIDEBAR / LOGOUT ======
const sidebar = document.getElementById("sidebar");
const hamburger = document.getElementById("hamburger");
const closeSidebarBtn = document.getElementById("closeSidebar");
const logoutBtn = document.getElementById("logoutBtn");

hamburger.addEventListener("click", () => {
  sidebar.classList.add("open");
});

closeSidebarBtn.addEventListener("click", () => {
  sidebar.classList.remove("open");
});

document.addEventListener("click", (e) => {
  if (
    sidebar.classList.contains("open") &&
    !sidebar.contains(e.target) &&
    e.target !== hamburger
  ) {
    sidebar.classList.remove("open");
  }
});

logoutBtn.addEventListener("click", () => {
  app.classList.add("hidden");
  authContainer.classList.remove("hidden");
  sidebar.classList.remove("open");
  // reset minimo
  loginForm.reset();
  window.scrollTo({ top: 0 });
});

// ====== NAVIGAZIONE PAGINE ======
const dashboard = document.getElementById("dashboard");
const pages = document.querySelectorAll(".page");

function showDashboard() {
  pages.forEach((p) => p.classList.add("hidden"));
  dashboard.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showPage(pageId) {
  dashboard.classList.add("hidden");
  pages.forEach((p) => p.classList.add("hidden"));
  const page = document.getElementById(pageId);
  if (page) page.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Bottoni apertura pagine dalla dashboard
const openAssenzeBtn = document.getElementById("openAssenze");
if (openAssenzeBtn) {
  openAssenzeBtn.addEventListener("click", () => showPage("assenzePage"));
}

const openTurniBtn = document.getElementById("openTurni");
if (openTurniBtn) {
  openTurniBtn.addEventListener("click", () => showPage("turniPage"));
}

const openComunicazioniBtn = document.getElementById("openComunicazioni");
if (openComunicazioniBtn) {
  openComunicazioniBtn.addEventListener("click", () =>
    showPage("comunicazioniPage")
  );
}

const openProcedureBtn = document.getElementById("openProcedure");
if (openProcedureBtn) {
  openProcedureBtn.addEventListener("click", () =>
    showPage("procedurePage")
  );
}

// Bottoni "← Dashboard" in tutte le pagine
const backButtons = document.querySelectorAll(".back-button");
backButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.target || "dashboard";
    if (target === "dashboard") {
      showDashboard();
    } else {
      showPage(target);
    }
  });
});

// ====== ASSENZE – FORM DEMO ======
const assenzeForm = document.getElementById("assenzeForm");
const assenzeFeedback = document.getElementById("assenzeFeedback");

if (assenzeForm && assenzeFeedback) {
  assenzeForm.addEventListener("submit", (e) => {
    e.preventDefault();
    assenzeFeedback.classList.remove("hidden");
    setTimeout(() => {
      assenzeFeedback.classList.add("hidden");
    }, 3000);
  });
}

// ====== COMUNICAZIONI – DEMO ======
const comunicazioniList = document.getElementById("comunicazioniList");
const comunicazioneDettaglio = document.getElementById("comunicazioneDettaglio");
const comForm = document.getElementById("comForm");
const comFeedback = document.getElementById("comFeedback");

if (comunicazioniList && comunicazioneDettaglio) {
  const fakeContent = {
    1: "Dettaglio: nuova procedura disponibile per la gestione degli scontrini errati. Consultare la sezione Procedure.",
    2: "Dettaglio: aggiornare il registro sicurezza prima della fine del mese. Verificare firma di tutti i dipendenti.",
    3: "Dettaglio: incontro veloce all’orario di chiusura per aggiornamenti organizzativi.",
  };

  comunicazioniList.addEventListener("click", (e) => {
    const li = e.target.closest("li[data-id]");
    if (!li) return;
    comunicazioniList
      .querySelectorAll("li")
      .forEach((el) => el.classList.remove("active"));
    li.classList.add("active");
    const id = li.dataset.id;
    comunicazioneDettaglio.textContent =
      fakeContent[id] || "Nessun contenuto disponibile.";
  });
}

if (comForm && comFeedback) {
  comForm.addEventListener("submit", (e) => {
    e.preventDefault();
    comFeedback.classList.remove("hidden");
    setTimeout(() => comFeedback.classList.add("hidden"), 3000);
  });
}

// ====== PROCEDURE – DEMO ======
const procedureRows = document.querySelectorAll(".procedure-row");
const procTitle = document.getElementById("procTitle");
const procBody = document.getElementById("procBody");
const procForm = document.getElementById("procForm");
const procFeedback = document.getElementById("procFeedback");

if (procedureRows && procTitle && procBody) {
  const fakeProcContent = {
    p1: {
      title: "Gestione scontrino errato",
      body:
        "1. Annullare lo scontrino sul gestionale.\n" +
        "2. Informare subito il cliente dell’operazione.\n" +
        "3. Registrare la nota sull’apposito registro interno.\n" +
        "4. In caso di pagamento POS, verificare movimento e rimborso.",
    },
    p2: {
      title: "Procedure per anticipi ricette SSN",
      body:
        "1. Verificare il codice fiscale del cliente.\n" +
        "2. Registrare l’anticipo nel gestionale.\n" +
        "3. Conservare gli scontrini anticipi in apposita cartellina.\n" +
        "4. Al rientro della ricetta, chiudere l’operazione.",
    },
    p3: {
      title: "Controllo scadenze magazzino",
      body:
        "1. Stampare elenco prodotti in scadenza entro 6 mesi.\n" +
        "2. Etichettare gli scaffali con segnalazione visiva.\n" +
        "3. Valutare resi ai fornitori ove possibile.\n" +
        "4. Programmare eventuali promo per smaltimento stock.",
    },
  };

  procedureRows.forEach((row) => {
    row.addEventListener("click", () => {
      procedureRows.forEach((r) => r.classList.remove("active"));
      row.classList.add("active");
      const id = row.dataset.id;
      const data = fakeProcContent[id];
      if (data) {
        procTitle.textContent = data.title;
        procBody.textContent = data.body;
      }
    });
  });
}

if (procForm && procFeedback) {
  procForm.addEventListener("submit", (e) => {
    e.preventDefault();
    procFeedback.classList.remove("hidden");
    setTimeout(() => procFeedback.classList.add("hidden"), 3000);
  });
}
