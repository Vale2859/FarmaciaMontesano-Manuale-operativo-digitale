// ====== DATI DEMO: TURNI FARMACIE ======
const turniFarmacie = [
  {
    data: "2025-12-17",
    orario: "00:00 – 24:00",
    principale: "Farmacia Montesano",
    appoggio: "Farmacia Centrale",
    telefono: "0835 335921",
    note: "Turno completo",
    tipoRange: "oggi",
    mese: 12
  },
  {
    data: "2025-12-18",
    orario: "08:00 – 20:00",
    principale: "Farmacia Centrale",
    appoggio: "Farmacia Montesano",
    telefono: "0835 111111",
    note: "Diurno",
    tipoRange: "settimana",
    mese: 12
  },
  {
    data: "2025-12-19",
    orario: "20:00 – 08:00",
    principale: "Farmacia Madonna delle Grazie",
    appoggio: "Farmacia Montesano",
    telefono: "0835 222222",
    note: "Notturno",
    tipoRange: "settimana",
    mese: 12
  },
  {
    data: "2025-12-24",
    orario: "00:00 – 24:00",
    principale: "Farmacia Montesano",
    appoggio: "Farmacia Centrale",
    telefono: "0835 000000",
    note: "Vigilia di Natale",
    tipoRange: "mese",
    mese: 12
  },
  {
    data: "2026-01-02",
    orario: "08:00 – 20:00",
    principale: "Farmacia Centrale",
    appoggio: "Farmacia Madonna delle Grazie",
    telefono: "0835 111111",
    note: "Inizio anno",
    tipoRange: "mese",
    mese: 1
  }
];

// ====== DATI DEMO: COMUNICAZIONI ======
let comunicazioni = [
  {
    id: 1,
    titolo: "Nuova procedura notturni",
    categoria: "urgente",
    autore: "Titolare",
    data: "Oggi",
    testo: "Dal prossimo turno seguire la nuova check-list di chiusura farmacia.",
    letta: false
  },
  {
    id: 2,
    titolo: "Verifica armadietto stupefacenti",
    categoria: "importante",
    autore: "Titolare",
    data: "Ieri",
    testo: "Controllare giacenze e scadenze entro fine settimana.",
    letta: false
  },
  {
    id: 3,
    titolo: "Aggiornamento promo vetrina",
    categoria: "informativa",
    autore: "Admin",
    data: "2 giorni fa",
    testo: "Nuova esposizione prodotti stagionali in vetrina principale.",
    letta: true
  }
];

// ====== DATI DEMO: PROCEDURE ======
const procedureData = [
  {
    id: "proc1",
    titolo: "Chiusura cassa serale",
    reparto: "cassa",
    aggiornamento: "12/11/2025",
    testo: "1) Verifica giacenza contanti.\n2) Stampa chiusura fiscale.\n3) Conta fondo cassa e registra su modulo chiusura."
  },
  {
    id: "proc2",
    titolo: "Gestione buoni SSN",
    reparto: "cassa",
    aggiornamento: "05/10/2025",
    testo: "Controllare ricetta, inserire correttamente i dati del paziente, allegare copia scontrino al buono."
  },
  {
    id: "proc3",
    titolo: "Ricezione merce da grossista",
    reparto: "magazzino",
    aggiornamento: "22/09/2025",
    testo: "Controllo colli, stampa DDT, verifica scadenze, etichettatura e carico in magazzino."
  },
  {
    id: "proc4",
    titolo: "Reso prodotti danneggiati",
    reparto: "logistica",
    aggiornamento: "18/09/2025",
    testo: "Compilare modulo reso, fotografare prodotto, contattare referente commerciale e attendere autorizzazione."
  },
  {
    id: "proc5",
    titolo: "Prenotazione servizi CUP / ECG",
    reparto: "servizi",
    aggiornamento: "01/10/2025",
    testo: "Verificare dati anagrafici, orari disponibili, confermare prenotazione e consegnare promemoria al cliente."
  }
];

// ====== DATI DEMO: NOTIFICHE PER CARD DASHBOARD ======
const notificationConfig = {
  assenze: {
    titolo: "Notifiche assenze personale",
    descrizioneVuota: "Non hai nuove notifiche sulle assenze.",
    notifiche: [
      {
        id: "ass-1",
        titolo: "Permesso approvato",
        testo: "Il permesso del 20/12 è stato approvato dal titolare.",
        letto: false
      },
      {
        id: "ass-2",
        titolo: "Permesso rifiutato",
        testo: "Il permesso del 10/01 è stato rifiutato. Controlla i dettagli con il titolare.",
        letto: false
      }
    ]
  },
  turni: {
    titolo: "Notifiche farmacie di turno",
    descrizioneVuota: "Nessuna variazione sui turni al momento.",
    notifiche: [
      {
        id: "turni-1",
        titolo: "Cambio turno notturno",
        testo: "Il turno notturno del 19/12 è stato scambiato con Farmacia Centrale.",
        letto: false
      }
    ]
  },
  comunicazioni: {
    titolo: "Nuove comunicazioni interne",
    descrizioneVuota: "Hai già letto tutte le comunicazioni.",
    notifiche: [
      {
        id: "com-1",
        titolo: "Nuova comunicazione urgente",
        testo: "È stata pubblicata una nuova comunicazione urgente dall'area titolare.",
        letto: false
      },
      {
        id: "com-2",
        titolo: "Messaggio informativo",
        testo: "Aggiornato il regolamento per l’utilizzo del retro-banco.",
        letto: false
      }
    ]
  },
  procedure: {
    titolo: "Aggiornamenti procedure",
    descrizioneVuota: "Nessuna procedura nuova da leggere.",
    notifiche: [
      {
        id: "proc-1",
        titolo: "Procedura chiusura cassa aggiornata",
        testo: "È stata aggiornata la procedura 'Chiusura cassa serale'.",
        letto: false
      }
    ]
  },
  logistica: {
    titolo: "Notifiche logistica",
    descrizioneVuota: "Al momento non ci sono avvisi di logistica.",
    notifiche: [
      {
        id: "log-1",
        titolo: "Nuovo espositore in arrivo",
        testo: "Venerdì arriverà il nuovo espositore dermocosmesi, da montare in vetrina 2.",
        letto: false
      }
    ]
  },
  magazzino: {
    titolo: "Notifiche magazzino",
    descrizioneVuota: "Non ci sono nuovi avvisi dal magazzino.",
    notifiche: [
      {
        id: "mag-1",
        titolo: "Scadenze in avvicinamento",
        testo: "Sono presenti 5 articoli con scadenza inferiore a 3 mesi.",
        letto: false
      },
      {
        id: "mag-2",
        titolo: "Inventario programmato",
        testo: "Lunedì mattina inventario rapido banco automedicazione.",
        letto: false
      }
    ]
  }
};

// ====== STATO ======
let currentRole = "farmacia"; // farmacia | titolare | dipendente
let currentTurniView = "oggi"; // oggi | settimana | mese
let currentProcedureFilter = "tutti";
let currentProcedureSearch = "";
let openNotificationCardKey = null;

document.addEventListener("DOMContentLoaded", () => {
  // Elementi principali
  const authContainer = document.getElementById("authContainer");
  const app = document.getElementById("app");

  // Login
  const authTabs = document.querySelectorAll(".auth-tab");
  const loginRoleLabel = document.getElementById("loginRoleLabel");
  const loginForm = document.getElementById("loginForm");

  // Layout
  const sidebar = document.getElementById("sidebar");
  const hamburger = document.getElementById("hamburger");
  const closeSidebar = document.getElementById("closeSidebar");
  const logoutBtn = document.getElementById("logoutBtn");
  const rolePill = document.getElementById("currentRolePill");
  const assenzeTitle = document.getElementById("assenzeTitle");

  // Sezioni
  const dashboardSection = document.getElementById("dashboard");
  const assenzePage = document.getElementById("assenzePage");
  const turniPage = document.getElementById("turniPage");
  const comunicazioniPage = document.getElementById("comunicazioniPage");
  const procedurePage = document.getElementById("procedurePage");

  // Pulsanti navigazione rapida
  const openAssenzeBtn = document.getElementById("openAssenze");
  const backFromAssenzeBtn = document.getElementById("backFromAssenze");
  const openTurniBtn = document.getElementById("openTurni");
  const backFromTurniBtn = document.getElementById("backFromTurni");
  const openComunicazioniBtn = document.getElementById("openComunicazioni");
  const backFromComunicazioniBtn = document.getElementById("backFromComunicazioni");
  const openProcedureBtn = document.getElementById("openProcedure");
  const backFromProcedureBtn = document.getElementById("backFromProcedure");

  // Turni elementi
  const turnoOggiNome = document.getElementById("turnoOggiNome");
  const turnoOggiIndirizzo = document.getElementById("turnoOggiIndirizzo");
  const turnoOggiTelefono = document.getElementById("turnoOggiTelefono");
  const turnoOggiOrario = document.getElementById("turnoOggiOrario");
  const turnoOggiAppoggioNome = document.getElementById("turnoOggiAppoggioNome");
  const turnoOggiAppoggioDettagli = document.getElementById("turnoOggiAppoggioDettagli");

  const turnoOrarioChip = document.getElementById("turnoOrarioChip");
  const turnoNome = document.getElementById("turnoNome");
  const turnoIndirizzo = document.getElementById("turnoIndirizzo");
  const turnoAppoggio = document.getElementById("turnoAppoggio");

  const turniTabs = document.querySelectorAll(".turni-tab");
  const turniRowsContainer = document.getElementById("turniRows");
  const turniMeseSelect = document.getElementById("turniMeseSelect");
  const turniFarmaciaSelect = document.getElementById("turniFarmaciaSelect");

  // Comunicazioni elementi
  const comunicazioniList = document.getElementById("comunicazioniList");
  const filtroCategoria = document.getElementById("filtroCategoria");
  const filtroSoloNonLette = document.getElementById("filtroSoloNonLette");
  const comunicazioneForm = document.getElementById("comunicazioneForm");
  const comunicazioneFeedback = document.getElementById("comunicazioneFeedback");
  const badgeTotComunicazioni = document.getElementById("badgeTotComunicazioni");
  const badgeNonLette = document.getElementById("badgeNonLette");
  const badgeUrgenti = document.getElementById("badgeUrgenti");

  // Procedure elementi
  const procedureSearchInput = document.getElementById("procedureSearch");
  const procedureFilterButtons = document.querySelectorAll(".proc-filter-btn");
  const procedureListContainer = document.getElementById("procedureList");
  const procedureDetail = document.getElementById("procedureDetail");

  // Notifiche overlay
  const notifOverlay = document.getElementById("notificationOverlay");
  const notifTitle = document.getElementById("notifTitle");
  const notifIntro = document.getElementById("notifIntro");
  const notifList = document.getElementById("notifList");
  const notifClose = document.getElementById("notifClose");
  const notifCloseBottom = document.getElementById("notifCloseBottom");

  // ====== FUNZIONI DI SUPPORTO ======

  function setRole(role) {
    currentRole = role;

    if (!rolePill || !assenzeTitle) return;

    if (role === "farmacia") {
      rolePill.textContent = "Farmacia (accesso generico)";
      assenzeTitle.textContent = "Assenze del personale";
    } else if (role === "titolare") {
      rolePill.textContent = "Titolare";
      assenzeTitle.textContent = "Assenze del personale";
    } else if (role === "dipendente") {
      rolePill.textContent = "Dipendente";
      assenzeTitle.textContent = "Le mie assenze";
    }
  }

  function showSection(section) {
    if (!section) return;
    [dashboardSection, assenzePage, turniPage, comunicazioniPage, procedurePage].forEach(sec => {
      if (sec) sec.classList.add("hidden");
    });
    section.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  function openSidebarMenu() {
    if (!sidebar) return;
    sidebar.classList.add("open");
  }

  function closeSidebarMenu() {
    if (!sidebar) return;
    sidebar.classList.remove("open");
  }

  // ====== LOGIN ======
  authTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      authTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      const role = tab.getAttribute("data-role");
      if (role === "farmacia") {
        loginRoleLabel.textContent = "Farmacia";
      } else if (role === "titolare") {
        loginRoleLabel.textContent = "Titolare";
      } else {
        loginRoleLabel.textContent = "Dipendente";
      }
    });
  });

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const activeTab = document.querySelector(".auth-tab.active");
      const role = activeTab ? activeTab.getAttribute("data-role") : "farmacia";

      setRole(role);

      authContainer.classList.add("hidden");
      app.classList.remove("hidden");

      showSection(dashboardSection);
      initNotificationBadges();
    });
  }

  // ====== HAMBURGER / SIDEBAR ======
  if (hamburger) hamburger.addEventListener("click", openSidebarMenu);
  if (closeSidebar) closeSidebar.addEventListener("click", closeSidebarMenu);

  document.addEventListener("click", (e) => {
    if (
      sidebar &&
      sidebar.classList.contains("open") &&
      !sidebar.contains(e.target) &&
      e.target !== hamburger
    ) {
      closeSidebarMenu();
    }
  });

  // Navigazione dal menu laterale
  if (sidebar) {
    sidebar.querySelectorAll("li[data-nav]").forEach((item) => {
      item.addEventListener("click", () => {
        const target = item.getAttribute("data-nav");

        if (target === "dashboard") {
          showSection(dashboardSection);
        } else if (target === "assenzePage") {
          showSection(assenzePage);
        } else if (target === "turniPage") {
          showSection(turniPage);
          renderTurniTable();
        } else if (target === "comunicazioniPage") {
          showSection(comunicazioniPage);
          renderComunicazioni();
        } else if (target === "procedurePage") {
          showSection(procedurePage);
          renderProcedureList();
        }
        closeSidebarMenu();
      });
    });
  }

  // ====== LOGOUT ======
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      app.classList.add("hidden");
      authContainer.classList.remove("hidden");

      // reset login
      loginForm && loginForm.reset();
      authTabs.forEach((t) => t.classList.remove("active"));
      authTabs[0].classList.add("active");
      loginRoleLabel.textContent = "Farmacia";
      setRole("farmacia");

      closeSidebarMenu();
    });
  }

  // ====== NAVIGAZIONE INTERNA (BOTTONI CARDS) ======
  if (openAssenzeBtn) {
    openAssenzeBtn.addEventListener("click", () => {
      showSection(assenzePage);
    });
  }

  if (backFromAssenzeBtn) {
    backFromAssenzeBtn.addEventListener("click", () => {
      showSection(dashboardSection);
    });
  }

  if (openTurniBtn) {
    openTurniBtn.addEventListener("click", () => {
      showSection(turniPage);
      renderTurniTable();
    });
  }

  if (backFromTurniBtn) {
    backFromTurniBtn.addEventListener("click", () => {
      showSection(dashboardSection);
    });
  }

  if (openComunicazioniBtn) {
    openComunicazioniBtn.addEventListener("click", () => {
      showSection(comunicazioniPage);
      renderComunicazioni();
    });
  }

  if (backFromComunicazioniBtn) {
    backFromComunicazioniBtn.addEventListener("click", () => {
      showSection(dashboardSection);
    });
  }

  if (openProcedureBtn) {
    openProcedureBtn.addEventListener("click", () => {
      showSection(procedurePage);
      renderProcedureList();
    });
  }

  if (backFromProcedureBtn) {
    backFromProcedureBtn.addEventListener("click", () => {
      showSection(dashboardSection);
    });
  }

  // ====== TURNI: POPOLAMENTO ======

  function initTurnoOggi() {
    const oggi = turniFarmacie.find((t) => t.tipoRange === "oggi");
    if (!oggi) return;

    if (turnoOrarioChip) turnoOrarioChip.textContent = oggi.orario;
    if (turnoNome) turnoNome.textContent = oggi.principale;
    if (turnoIndirizzo) {
      turnoIndirizzo.innerHTML = `Via Esempio 12, Matera<br />Tel: ${oggi.telefono}`;
    }
    if (turnoAppoggio) turnoAppoggio.textContent = oggi.appoggio;

    if (turnoOggiNome) turnoOggiNome.textContent = oggi.principale;
    if (turnoOggiIndirizzo) turnoOggiIndirizzo.textContent = "Via Esempio 12, Matera";
    if (turnoOggiTelefono) turnoOggiTelefono.textContent = `Tel: ${oggi.telefono}`;
    if (turnoOggiOrario) turnoOggiOrario.textContent = oggi.orario;
    if (turnoOggiAppoggioNome) turnoOggiAppoggioNome.textContent = oggi.appoggio;
    if (turnoOggiAppoggioDettagli) {
      turnoOggiAppoggioDettagli.textContent =
        "Via Dante 8, Matera – Tel: 0835 111111";
    }
  }

  function renderTurniTable() {
    if (!turniRowsContainer) return;

    const meseFilter = turniMeseSelect ? turniMeseSelect.value : "all";
    const farmaciaFilter = turniFarmaciaSelect ? turniFarmaciaSelect.value : "all";

    let filtered = turniFarmacie.filter((t) => t.tipoRange === currentTurniView);

    if (meseFilter !== "all") {
      const m = Number(meseFilter);
      filtered = filtered.filter((t) => t.mese === m);
    }

    if (farmaciaFilter !== "all") {
      filtered = filtered.filter((t) => t.principale === farmaciaFilter);
    }

    turniRowsContainer.innerHTML = "";

    if (filtered.length === 0) {
      const emptyRow = document.createElement("div");
      emptyRow.className = "turni-row";
      emptyRow.innerHTML = `<span>Nessun turno per i filtri selezionati.</span>`;
      turniRowsContainer.appendChild(emptyRow);
      return;
    }

    filtered.forEach((t) => {
      const row = document.createElement("div");
      row.className = "turni-row";

      let tipoPillClass = "normale";
      const noteLower = t.note.toLowerCase();
      if (noteLower.includes("festivo") || noteLower.includes("vigilia")) {
        tipoPillClass = "festivo";
      }
      if (noteLower.includes("notturno")) {
        tipoPillClass = "notturno";
      }

      row.innerHTML = `
        <span>${formatDateIT(t.data)}</span>
        <span>${t.orario}</span>
        <span>${t.principale}</span>
        <span>${t.appoggio}</span>
        <span>${t.telefono}</span>
        <span><span class="turno-type-pill ${tipoPillClass}">${t.note}</span></span>
      `;
      turniRowsContainer.appendChild(row);
    });
  }

  function formatDateIT(isoDate) {
    const [y, m, d] = isoDate.split("-");
    return `${d}/${m}/${y}`;
  }

  turniTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      turniTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      currentTurniView = tab.getAttribute("data-view");
      renderTurniTable();
    });
  });

  if (turniMeseSelect) turniMeseSelect.addEventListener("change", renderTurniTable);
  if (turniFarmaciaSelect)
    turniFarmaciaSelect.addEventListener("change", renderTurniTable);

  // ====== COMUNICAZIONI: POPOLAMENTO ======

  function aggiornaBadgeComunicazioni() {
    if (!badgeTotComunicazioni || !badgeNonLette || !badgeUrgenti) return;
    const tot = comunicazioni.length;
    const nonLette = comunicazioni.filter((c) => !c.letta).length;
    const urgenti = comunicazioni.filter((c) => c.categoria === "urgente").length;

    badgeTotComunicazioni.textContent = `Totali: ${tot}`;
    badgeNonLette.textContent = `Non lette: ${nonLette}`;
    badgeUrgenti.textContent = `Urgenti: ${urgenti}`;
  }

  function renderComunicazioni() {
    if (!comunicazioniList) return;

    const cat = filtroCategoria ? filtroCategoria.value : "tutte";
    const soloNonLette = filtroSoloNonLette ? filtroSoloNonLette.checked : false;

    let filtered = [...comunicazioni];

    if (cat !== "tutte") {
      filtered = filtered.filter((c) => c.categoria === cat);
    }
    if (soloNonLette) {
      filtered = filtered.filter((c) => !c.letta);
    }

    comunicazioniList.innerHTML = "";

    if (filtered.length === 0) {
      const empty = document.createElement("div");
      empty.className = "small-text";
      empty.textContent = "Nessuna comunicazione per i filtri selezionati (demo).";
      comunicazioniList.appendChild(empty);
      aggiornaBadgeComunicazioni();
      return;
    }

    filtered.forEach((c) => {
      const card = document.createElement("div");
      card.className = "com-card";

      const pill = document.createElement("div");
      pill.className = `com-pill ${c.categoria}`;
      pill.textContent =
        c.categoria === "urgente"
          ? "URGENTE"
          : c.categoria === "importante"
          ? "IMPORTANTE"
          : "INFORMATIVA";

      const title = document.createElement("div");
      title.className = "com-title";
      title.textContent = c.titolo;

      const meta = document.createElement("div");
      meta.className = "com-meta";
      const stato = c.letta ? "Letta" : "Non letta";
      meta.textContent = `${c.data} · ${c.autore} · ${stato}`;

      const text = document.createElement("div");
      text.className = "com-text";
      text.textContent = c.testo;

      card.appendChild(pill);
      card.appendChild(title);
      card.appendChild(meta);
      card.appendChild(text);

      comunicazioniList.appendChild(card);
    });

    aggiornaBadgeComunicazioni();
  }

  if (filtroCategoria) filtroCategoria.addEventListener("change", renderComunicazioni);
  if (filtroSoloNonLette)
    filtroSoloNonLette.addEventListener("change", renderComunicazioni);

  if (comunicazioneForm && comunicazioneFeedback) {
    comunicazioneForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const titoloInput = document.getElementById("comTitolo");
      const categoriaSelect = document.getElementById("comCategoria");
      const testoInput = document.getElementById("comTesto");

      const titolo = titoloInput.value.trim();
      const categoria = categoriaSelect.value;
      const testo = testoInput.value.trim();

      if (!titolo || !testo) {
        comunicazioneFeedback.textContent =
          "⚠️ Inserisci almeno un titolo e un testo.";
        comunicazioneFeedback.classList.remove("hidden");
        return;
      }

      const nuova = {
        id: comunicazioni.length + 1,
        titolo,
        categoria,
        autore: "Demo utente",
        data: "Oggi",
        testo,
        letta: false
      };

      comunicazioni.unshift(nuova);

      comunicazioneFeedback.textContent =
        "✅ Comunicazione registrata (demo). In futuro sarà salvata su server.";
      comunicazioneFeedback.classList.remove("hidden");

      comunicazioneForm.reset();
      renderComunicazioni();
    });
  }

  // ====== FORM ASSENZE: SOLO FEEDBACK ======
  const assenzeForm = document.querySelector(".assenze-form");
  const assenzeFeedback = document.getElementById("assenzeFeedback");

  if (assenzeForm && assenzeFeedback) {
    assenzeForm.addEventListener("submit", (e) => {
      e.preventDefault();
      assenzeFeedback.classList.remove("hidden");
      assenzeFeedback.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  // ====== PROCEDURE: LOGICA SEMPLICE ======

  function renderProcedureList() {
    if (!procedureListContainer) return;

    const term = (currentProcedureSearch || "").trim().toLowerCase();

    let filtered = procedureData.filter((p) => {
      const matchReparto =
        currentProcedureFilter === "tutti" ||
        p.reparto === currentProcedureFilter;
      const testoRicerca =
        p.titolo.toLowerCase() +
        " " +
        p.testo.toLowerCase();
      const matchTesto = !term || testoRicerca.includes(term);
      return matchReparto && matchTesto;
    });

    procedureListContainer.innerHTML = "";

    if (filtered.length === 0) {
      const empty = document.createElement("div");
      empty.className = "small-text";
      empty.textContent = "Nessuna procedura trovata per i filtri impostati (demo).";
      procedureListContainer.appendChild(empty);
      if (procedureDetail) {
        procedureDetail.innerHTML =
          '<p class="small-text muted">Nessuna procedura selezionata.</p>';
      }
      return;
    }

    filtered.forEach((p) => {
      const item = document.createElement("div");
      item.className = "proc-item";
      item.dataset.procId = p.id;

      const main = document.createElement("div");
      main.className = "proc-item-main";

      const title = document.createElement("div");
      title.className = "proc-item-title";
      title.textContent = p.titolo;

      const meta = document.createElement("div");
      meta.className = "proc-item-meta";
      const repLabel =
        p.reparto === "cassa"
          ? "Cassa / Banco"
          : p.reparto === "magazzino"
          ? "Magazzino"
          : p.reparto === "servizi"
          ? "Servizi"
          : "Logistica";
      meta.textContent = `${repLabel} · Agg.: ${p.aggiornamento}`;

      main.appendChild(title);
      main.appendChild(meta);

      const tag = document.createElement("div");
      tag.className = "proc-tag";
      tag.textContent = "Apri";

      item.appendChild(main);
      item.appendChild(tag);

      item.addEventListener("click", () => {
        showProcedureDetail(p.id);
      });

      procedureListContainer.appendChild(item);
    });
  }

  function showProcedureDetail(procId) {
    if (!procedureDetail) return;
    const proc = procedureData.find((p) => p.id === procId);
    if (!proc) return;

    const repLabel =
      proc.reparto === "cassa"
        ? "Cassa / Banco"
        : proc.reparto === "magazzino"
        ? "Magazzino"
        : proc.reparto === "servizi"
        ? "Servizi"
        : "Logistica";

    const paragrafi = proc.testo.split("\n").map((row) => `<p>${row}</p>`).join("");

    procedureDetail.innerHTML = `
      <h3>${proc.titolo}</h3>
      <p class="small-text">Reparto: <strong>${repLabel}</strong> · Ultimo aggiornamento: <strong>${proc.aggiornamento}</strong></p>
      <div class="divider"></div>
      <div>${paragrafi}</div>
    `;
  }

  if (procedureSearchInput) {
    procedureSearchInput.addEventListener("input", (e) => {
      currentProcedureSearch = e.target.value || "";
      renderProcedureList();
    });
  }

  procedureFilterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      procedureFilterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentProcedureFilter = btn.getAttribute("data-reparto") || "tutti";
      renderProcedureList();
    });
  });

  // ====== NOTIFICHE DASHBOARD (PALLINO + POPUP) ======

  function getUnreadNotifications(cardKey) {
    const cfg = notificationConfig[cardKey];
    if (!cfg) return [];
    return cfg.notifiche.filter((n) => !n.letto);
  }

  function updateBadgeForCard(cardKey) {
    const badge = document.querySelector(
      `.card-badge[data-card-key="${cardKey}"]`
    );
    const label = document.querySelector(
      `.card-badge-label[data-card-key="${cardKey}"]`
    );
    if (!badge) return;

    const unread = getUnreadNotifications(cardKey);
    const count = unread.length;
    const countSpan = badge.querySelector(".badge-count");

    if (count > 0) {
      if (countSpan) countSpan.textContent = String(count);
      badge.classList.add("has-unread");
      if (label) {
        label.textContent = count === 1 ? "Nuovo" : "Nuovi";
        label.style.display = "block";
      }
    } else {
      if (countSpan) countSpan.textContent = "";
      badge.classList.remove("has-unread");
      badge.style.display = "none";
      if (label) {
        label.textContent = "";
        label.style.display = "none";
      }
    }
  }

  function initNotificationBadges() {
    Object.keys(notificationConfig).forEach((key) =>
      updateBadgeForCard(key)
    );
  }

  function openNotificationPopup(cardKey) {
    const cfg = notificationConfig[cardKey];
    if (!cfg || !notifOverlay || !notifList || !notifTitle || !notifIntro) return;

    openNotificationCardKey = cardKey;

    const unread = getUnreadNotifications(cardKey);
    notifTitle.textContent = cfg.titolo;

    if (unread.length === 0) {
      notifIntro.textContent = cfg.descrizioneVuota;
    } else if (unread.length === 1) {
      notifIntro.textContent = "Hai 1 nuova notifica.";
    } else {
      notifIntro.textContent = `Hai ${unread.length} nuove notifiche.`;
    }

    notifList.innerHTML = "";

    if (unread.length === 0) {
      const empty = document.createElement("div");
      empty.className = "small-text";
      empty.textContent = cfg.descrizioneVuota;
      notifList.appendChild(empty);
    } else {
      unread.forEach((n) => {
        const item = document.createElement("div");
        item.className = "notif-item";
        item.dataset.notifId = n.id;

        const textWrap = document.createElement("div");
        textWrap.className = "notif-text";

        const h3 = document.createElement("h3");
        h3.textContent = n.titolo;

        const p = document.createElement("p");
        p.textContent = n.testo;

        textWrap.appendChild(h3);
        textWrap.appendChild(p);

        const btn = document.createElement("button");
        btn.className = "btn-primary small";
        btn.textContent = "Presa visione";
        btn.addEventListener("click", () => {
          markNotificationAsRead(cardKey, n.id);
        });

        item.appendChild(textWrap);
        item.appendChild(btn);

        notifList.appendChild(item);
      });
    }

    notifOverlay.classList.remove("hidden");
    notifOverlay.classList.add("active");
  }

  function closeNotificationPopup() {
    if (!notifOverlay) return;
    notifOverlay.classList.add("hidden");
    notifOverlay.classList.remove("active");
    openNotificationCardKey = null;
  }

  function markNotificationAsRead(cardKey, notifId) {
    const cfg = notificationConfig[cardKey];
    if (!cfg) return;
    const n = cfg.notifiche.find((x) => x.id === notifId);
    if (!n || n.letto) return;

    n.letto = true;

    // aggiorna lista nel popup (se è ancora aperto)
    if (openNotificationCardKey === cardKey) {
      openNotificationPopup(cardKey);
    }

    // aggiorna il pallino sulla card
    updateBadgeForCard(cardKey);
  }

  // click su pallino di ogni card
  document.querySelectorAll(".js-card-badge").forEach((badge) => {
    const key = badge.getAttribute("data-card-key");
    badge.addEventListener("click", (e) => {
      e.stopPropagation();
      openNotificationPopup(key);
    });
  });

  // chiusura popup
  if (notifClose) notifClose.addEventListener("click", closeNotificationPopup);
  if (notifCloseBottom)
    notifCloseBottom.addEventListener("click", closeNotificationPopup);

  // chiusura cliccando sullo sfondo scuro
  if (notifOverlay) {
    notifOverlay.addEventListener("click", (e) => {
      if (e.target === notifOverlay || e.target.classList.contains("notif-backdrop")) {
        closeNotificationPopup();
      }
    });
  }

  // ====== INIT GENERALE ======
  initTurnoOggi();
  renderComunicazioni();
  renderProcedureList();
  initNotificationBadges();
});
