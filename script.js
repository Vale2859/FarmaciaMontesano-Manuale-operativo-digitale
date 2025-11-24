// ======================================================
// PORTALE FARMACIA MONTESANO – SCRIPT COMPLETO
// ======================================================

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

// ====== STATO GENERALE ======
let currentRole = "farmacia";
let currentTurniView = "oggi";
let currentProcedureFilter = "tutti";
let currentProcedureSearch = "";
let openNotificationCardKey = null;

// ====== ARCHIVIO FILE: STATO ======
let fsRoot = null;
let currentFolder = null;
let selectedItem = null;
let clipboardItem = null;
let lastSelectedEl = null;

// ====== RIFERIMENTI DOM (valorizzati in DOMContentLoaded) ======
let authContainer, app, loginForm, loginRoleLabel, authTabs;
let dashboardSection, assenzePage, turniPage, comunicazioniPage, procedurePage, archivioPage;
let sidebar, hamburger, closeSidebar, logoutBtn, rolePill, assenzeTitle;
let openAssenzeBtn, backFromAssenzeBtn, openTurniBtn, backFromTurniBtn;
let openComunicazioniBtn, backFromComunicazioniBtn, openProcedureBtn, backFromProcedureBtn;
let openArchivioBtn, backFromArchivioBtn;
let turnoOrarioChip, turnoNome, turnoIndirizzo, turnoAppoggio;
let turnoOggiNome, turnoOggiIndirizzo, turnoOggiTelefono, turnoOggiOrario, turnoOggiAppoggioNome, turnoOggiAppoggioDettagli;
let turniTabs, turniRowsContainer, turniMeseSelect, turniFarmaciaSelect;
let comunicazioniList, filtroCategoria, filtroSoloNonLette, comunicazioneForm, comunicazioneFeedback;
let badgeTotComunicazioni, badgeNonLette, badgeUrgenti;
let assenzeForm, assenzeFeedback;
let procedureSearchInput, procedureFilterButtons, procedureListContainer, procedureDetail;
let archivioGrid, archivioPath, archivioUpload, archivioBtnUpload, archivioUpBtn, archivioNewFolderBtn;
let archivioContextMenu, menuNuova, menuRinomina, menuElimina, menuCopia, menuIncolla, menuDownload;
let notifOverlay, notifTitle, notifIntro, notifList, notifClose, notifCloseBottom;

// ======================================================
// FUNZIONI DI SUPPORTO GENERALI
// ======================================================
function setRole(role) {
  currentRole = role;
  if (!rolePill) return;

  if (role === "farmacia") {
    rolePill.textContent = "Farmacia (accesso generico)";
  } else if (role === "titolare") {
    rolePill.textContent = "Titolare";
  } else {
    rolePill.textContent = "Dipendente";
  }

  if (assenzeTitle) {
    if (role === "dipendente") {
      assenzeTitle.textContent = "Le mie assenze";
    } else {
      assenzeTitle.textContent = "Assenze del personale";
    }
  }
}

function showSection(section) {
  const all = [
    dashboardSection,
    assenzePage,
    turniPage,
    comunicazioniPage,
    procedurePage,
    archivioPage
  ];
  all.forEach(sec => sec && sec.classList.add("hidden"));
  if (section) section.classList.remove("hidden");
  window.scrollTo(0, 0);
}

function formatDateIT(isoDate) {
  const [y, m, d] = isoDate.split("-");
  return `${d}/${m}/${y}`;
}

// ======================================================
// TURNI
// ======================================================
function initTurnoOggi() {
  if (!turnoOrarioChip) return;
  const oggi = turniFarmacie.find(t => t.tipoRange === "oggi");
  if (!oggi) return;

  turnoOrarioChip.textContent = oggi.orario;
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
    turnoOggiAppoggioDettagli.textContent = "Via Dante 8, Matera – Tel: 0835 111111";
  }
}

function renderTurniTable() {
  if (!turniRowsContainer) return;

  const meseFilter = turniMeseSelect ? turniMeseSelect.value : "all";
  const farmaciaFilter = turniFarmaciaSelect ? turniFarmaciaSelect.value : "all";

  let filtered = turniFarmacie.filter(t => t.tipoRange === currentTurniView);

  if (meseFilter !== "all") {
    filtered = filtered.filter(t => t.mese === Number(meseFilter));
  }
  if (farmaciaFilter !== "all") {
    filtered = filtered.filter(t => t.principale === farmaciaFilter);
  }

  turniRowsContainer.innerHTML = "";

  if (filtered.length === 0) {
    const row = document.createElement("div");
    row.className = "turni-row";
    row.innerHTML = "<span>Nessun turno per i filtri selezionati.</span>";
    turniRowsContainer.appendChild(row);
    return;
  }

  filtered.forEach(t => {
    const row = document.createElement("div");
    row.className = "turni-row";

    let tipoPillClass = "normale";
    const noteLower = t.note.toLowerCase();
    if (noteLower.includes("notturno")) tipoPillClass = "notturno";
    if (noteLower.includes("vigilia") || noteLower.includes("festivo")) tipoPillClass = "festivo";

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

// ======================================================
// COMUNICAZIONI
// ======================================================
function aggiornaBadgeComunicazioni() {
  if (!badgeTotComunicazioni || !badgeNonLette || !badgeUrgenti) return;
  const tot = comunicazioni.length;
  const nonLette = comunicazioni.filter(c => !c.letta).length;
  const urgenti = comunicazioni.filter(c => c.categoria === "urgente").length;

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
    filtered = filtered.filter(c => c.categoria === cat);
  }
  if (soloNonLette) {
    filtered = filtered.filter(c => !c.letta);
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

  filtered.forEach(c => {
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

// ======================================================
// PROCEDURE
// ======================================================
function renderProcedureList() {
  if (!procedureListContainer) return;

  const term = (currentProcedureSearch || "").trim().toLowerCase();

  let filtered = procedureData.filter(p => {
    const matchReparto =
      currentProcedureFilter === "tutti" || p.reparto === currentProcedureFilter;
    const testoRicerca = (p.titolo + " " + p.testo).toLowerCase();
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

  filtered.forEach(p => {
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
  const proc = procedureData.find(p => p.id === procId);
  if (!proc) return;

  const repLabel =
    proc.reparto === "cassa"
      ? "Cassa / Banco"
      : proc.reparto === "magazzino"
      ? "Magazzino"
      : proc.reparto === "servizi"
      ? "Servizi"
      : "Logistica";

  const paragrafi = proc.testo.split("\n").map(row => `<p>${row}</p>`).join("");

  procedureDetail.innerHTML = `
    <h3>${proc.titolo}</h3>
    <p class="small-text">Reparto: <strong>${repLabel}</strong> · Ultimo aggiornamento: <strong>${proc.aggiornamento}</strong></p>
    <div class="divider"></div>
    <div>${paragrafi}</div>
  `;
}

// ======================================================
// ARCHIVIO FILE – FUNZIONI
// ======================================================
function saveFS() {
  try {
    localStorage.setItem("fs_montesano", JSON.stringify(fsRoot));
  } catch (e) {
    console.warn("Impossibile salvare in localStorage", e);
  }
}

function loadFS() {
  if (!archivioGrid) return; // se la pagina non esiste, salta

  try {
    const saved = localStorage.getItem("fs_montesano");
    if (saved) {
      fsRoot = JSON.parse(saved);
    } else {
      fsRoot = {
        name: "root",
        type: "folder",
        children: [
          { type: "folder", name: "Documenti", children: [] },
          { type: "folder", name: "Foto", children: [] },
          { type: "folder", name: "Procedure", children: [] },
          {
            type: "file",
            name: "Benvenuto.txt",
            content: "Benvenuto nell’Archivio File della Farmacia Montesano!"
          }
        ]
      };
      saveFS();
    }
  } catch (e) {
    console.error("Errore caricando l'FS, resetto.", e);
    fsRoot = {
      name: "root",
      type: "folder",
      children: []
    };
    saveFS();
  }
  currentFolder = fsRoot;
}

function getParentOf(target, node = fsRoot, parent = null) {
  if (!node) return null;
  if (node === target) return parent;
  if (node.type === "folder" && node.children) {
    for (const child of node.children) {
      const found = getParentOf(target, child, node);
      if (found) return found;
    }
  }
  return null;
}

function getPathArray(target) {
  if (!target || !fsRoot) return [];
  const path = [];

  function helper(node, stack) {
    if (node === target) {
      path.push(...stack, node.name);
      return true;
    }
    if (node.type === "folder" && node.children) {
      for (const child of node.children) {
        if (helper(child, [...stack, node.name])) return true;
      }
    }
    return false;
  }

  helper(fsRoot, []);
  return path;
}

function ensureUniqueName(base, list) {
  let name = base;
  let counter = 1;

  while (list.some(i => i.name === name)) {
    const parts = base.split(".");
    if (parts.length > 1) {
      const ext = parts.pop();
      name = parts.join(".") + ` (${counter}).` + ext;
    } else {
      name = base + ` (${counter})`;
    }
    counter++;
  }
  return name;
}

function getFileIconClass(item) {
  if (item.type === "folder") return "folder";
  const parts = item.name.split(".");
  if (parts.length < 2) return "";
  const ext = parts.pop().toLowerCase();
  if (ext === "pdf") return "pdf";
  if (["jpg", "jpeg", "png", "gif", "webp", "heic"].includes(ext)) return "image";
  if (["doc", "docx"].includes(ext)) return "word";
  if (["txt", "log"].includes(ext)) return "txt";
  return "";
}

function clearSelection() {
  if (lastSelectedEl) lastSelectedEl.classList.remove("selected");
  lastSelectedEl = null;
  selectedItem = null;
}

function openFolder(item) {
  if (!item || item.type !== "folder") return;
  currentFolder = item;
  clearSelection();
  renderArchivio();
}

function createNewFolder() {
  if (!currentFolder || currentFolder.type !== "folder") return;
  const base = "Nuova cartella";
  const name = ensureUniqueName(base, currentFolder.children || []);
  currentFolder.children.push({
    type: "folder",
    name,
    children: []
  });
  saveFS();
  renderArchivio();
}

function goUpFolder() {
  if (!currentFolder || currentFolder === fsRoot) return;
  const parent = getParentOf(currentFolder);
  if (parent) {
    currentFolder = parent;
    clearSelection();
    renderArchivio();
  }
}

function handleUpload(files) {
  if (!currentFolder || currentFolder.type !== "folder") return;
  const arr = Array.from(files || []);
  if (arr.length === 0) return;

  currentFolder.children = currentFolder.children || [];

  arr.forEach(file => {
    const name = ensureUniqueName(file.name, currentFolder.children);
    currentFolder.children.push({
      type: "file",
      name,
      size: file.size,
      lastModified: file.lastModified
      // contenuto non salvato per ora: solo demo archivio
    });
  });

  saveFS();
  renderArchivio();
}

function openContextMenu(x, y, item, el) {
  if (!archivioContextMenu) return;
  clearSelection();
  selectedItem = item;
  lastSelectedEl = el;
  el.classList.add("selected");

  archivioContextMenu.style.left = x + "px";
  archivioContextMenu.style.top = y + "px";
  archivioContextMenu.classList.add("visible");

  if (menuIncolla) {
    menuIncolla.classList.toggle("disabled", !clipboardItem);
  }
}

function closeContextMenu() {
  if (!archivioContextMenu) return;
  archivioContextMenu.classList.remove("visible");
}

function renameSelected() {
  if (!selectedItem) return;
  const nuovoNome = prompt("Nuovo nome", selectedItem.name);
  if (!nuovoNome || !nuovoNome.trim()) return;
  const siblings = currentFolder.children || [];
  selectedItem.name = ensureUniqueName(nuovoNome.trim(), siblings.filter(i => i !== selectedItem));
  saveFS();
  renderArchivio();
}

function deleteSelected() {
  if (!selectedItem || !currentFolder || !currentFolder.children) return;
  if (!confirm(`Eliminare "${selectedItem.name}"?`)) return;
  currentFolder.children = currentFolder.children.filter(i => i !== selectedItem);
  saveFS();
  clearSelection();
  renderArchivio();
}

function copySelected() {
  if (!selectedItem) return;
  clipboardItem = JSON.parse(JSON.stringify(selectedItem)); // deep copy
  if (menuIncolla) menuIncolla.classList.remove("disabled");
}

function pasteClipboard() {
  if (!clipboardItem || !currentFolder || currentFolder.type !== "folder") return;
  currentFolder.children = currentFolder.children || [];
  const clone = JSON.parse(JSON.stringify(clipboardItem));
  clone.name = ensureUniqueName(clone.name, currentFolder.children);
  currentFolder.children.push(clone);
  saveFS();
  renderArchivio();
}

function downloadSelected() {
  if (!selectedItem || selectedItem.type !== "file") return;
  alert("Download demo: in futuro potrai scaricare davvero il file.");
}

function renderArchivio() {
  if (!archivioGrid || !currentFolder) return;

  currentFolder.children = currentFolder.children || [];

  currentFolder.children.sort((a, b) => {
    if (a.type === b.type) return a.name.localeCompare(b.name);
    return a.type === "folder" ? -1 : 1;
  });

  const pathArr = getPathArray(currentFolder);
  if (archivioPath) {
    archivioPath.textContent = "/" + pathArr.join("/");
  }

  archivioGrid.innerHTML = "";

  if (currentFolder.children.length === 0) {
    const empty = document.createElement("div");
    empty.className = "small-text";
    empty.textContent = "Nessun file in questa cartella.";
    archivioGrid.appendChild(empty);
    return;
  }

  currentFolder.children.forEach(item => {
    const el = document.createElement("div");
    el.className = "file-item";

    const icon = document.createElement("div");
    icon.className = "file-icon " + getFileIconClass(item);
    icon.textContent = item.type === "folder" ? "📁" : "📄";

    const name = document.createElement("div");
    name.className = "file-name";
    name.textContent = item.name;

    el.appendChild(icon);
    el.appendChild(name);
    archivioGrid.appendChild(el);

    // selezione
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      clearSelection();
      selectedItem = item;
      lastSelectedEl = el;
      el.classList.add("selected");
    });

    // doppio click: apri cartella
    el.addEventListener("dblclick", () => {
      if (item.type === "folder") {
        openFolder(item);
      } else {
        alert("File demo: in futuro potrai aprirlo o scaricarlo.");
      }
    });

    // tasto destro: menu contestuale
    el.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      openContextMenu(e.pageX, e.pageY, item, el);
    });

    // mobile: pressione lunga (circa 600ms)
    let touchTimer = null;
    el.addEventListener("touchstart", (e) => {
      touchTimer = setTimeout(() => {
        const touch = e.touches[0];
        openContextMenu(touch.clientX, touch.clientY, item, el);
      }, 600);
    });
    el.addEventListener("touchend", () => {
      if (touchTimer) clearTimeout(touchTimer);
    });
    el.addEventListener("touchmove", () => {
      if (touchTimer) clearTimeout(touchTimer);
    });
  });
}

// ======================================================
// NOTIFICHE DASHBOARD (PALLINI + POPUP)
// ======================================================
function getUnreadNotifications(cardKey) {
  const cfg = notificationConfig[cardKey];
  if (!cfg) return [];
  return cfg.notifiche.filter(n => !n.letto);
}

function updateBadgeForCard(cardKey) {
  const badge = document.querySelector(`.card-badge[data-card-key="${cardKey}"]`);
  const label = document.querySelector(`.card-badge-label[data-card-key="${cardKey}"]`);
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
  Object.keys(notificationConfig).forEach(key => updateBadgeForCard(key));
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
    unread.forEach(n => {
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
  const n = cfg.notifiche.find(x => x.id === notifId);
  if (!n || n.letto) return;

  n.letto = true;

  if (openNotificationCardKey === cardKey) {
    openNotificationPopup(cardKey);
  }

  updateBadgeForCard(cardKey);
}

// ======================================================
// DOM READY
// ======================================================
document.addEventListener("DOMContentLoaded", () => {
  // ----- ELEMENTI BASE -----
  authContainer = document.getElementById("authContainer");
  app = document.getElementById("app");

  loginForm = document.getElementById("loginForm");
  loginRoleLabel = document.getElementById("loginRoleLabel");
  authTabs = document.querySelectorAll(".auth-tab");

  // Sezioni
  dashboardSection = document.getElementById("dashboard");
  assenzePage = document.getElementById("assenzePage");
  turniPage = document.getElementById("turniPage");
  comunicazioniPage = document.getElementById("comunicazioniPage");
  procedurePage = document.getElementById("procedurePage");
  archivioPage = document.getElementById("archivioPage");

  // Sidebar
  sidebar = document.getElementById("sidebar");
  hamburger = document.getElementById("hamburger");
  closeSidebar = document.getElementById("closeSidebar");
  logoutBtn = document.getElementById("logoutBtn");

  rolePill = document.getElementById("currentRolePill");
  assenzeTitle = document.getElementById("assenzeTitle");

  // Dashboard: turno card
  turnoOrarioChip = document.getElementById("turnoOrarioChip");
  turnoNome = document.getElementById("turnoNome");
  turnoIndirizzo = document.getElementById("turnoIndirizzo");
  turnoAppoggio = document.getElementById("turnoAppoggio");

  // Turni pagina
  turnoOggiNome = document.getElementById("turnoOggiNome");
  turnoOggiIndirizzo = document.getElementById("turnoOggiIndirizzo");
  turnoOggiTelefono = document.getElementById("turnoOggiTelefono");
  turnoOggiOrario = document.getElementById("turnoOggiOrario");
  turnoOggiAppoggioNome = document.getElementById("turnoOggiAppoggioNome");
  turnoOggiAppoggioDettagli = document.getElementById("turnoOggiAppoggioDettagli");

  turniTabs = document.querySelectorAll(".turni-tab");
  turniRowsContainer = document.getElementById("turniRows");
  turniMeseSelect = document.getElementById("turniMeseSelect");
  turniFarmaciaSelect = document.getElementById("turniFarmaciaSelect");

  // Bottoni dashboard -> pagine
  openAssenzeBtn = document.getElementById("openAssenze");
  backFromAssenzeBtn = document.getElementById("backFromAssenze");
  openTurniBtn = document.getElementById("openTurni");
  backFromTurniBtn = document.getElementById("backFromTurni");
  openComunicazioniBtn = document.getElementById("openComunicazioni");
  backFromComunicazioniBtn = document.getElementById("backFromComunicazioni");
  openProcedureBtn = document.getElementById("openProcedure");
  backFromProcedureBtn = document.getElementById("backFromProcedure");
  openArchivioBtn = document.getElementById("openArchivio");
  backFromArchivioBtn = document.getElementById("backFromArchivio");

  // Comunicazioni
  comunicazioniList = document.getElementById("comunicazioniList");
  filtroCategoria = document.getElementById("filtroCategoria");
  filtroSoloNonLette = document.getElementById("filtroSoloNonLette");
  comunicazioneForm = document.getElementById("comunicazioneForm");
  comunicazioneFeedback = document.getElementById("comunicazioneFeedback");
  badgeTotComunicazioni = document.getElementById("badgeTotComunicazioni");
  badgeNonLette = document.getElementById("badgeNonLette");
  badgeUrgenti = document.getElementById("badgeUrgenti");

  // Assenze
  assenzeForm = document.querySelector(".assenze-form");
  assenzeFeedback = document.getElementById("assenzeFeedback");

  // Procedure
  procedureSearchInput = document.getElementById("procedureSearch");
  procedureFilterButtons = document.querySelectorAll(".proc-filter-btn");
  procedureListContainer = document.getElementById("procedureList");
  procedureDetail = document.getElementById("procedureDetail");

  // Archivio
  archivioGrid = document.getElementById("archivioGrid");
  archivioPath = document.getElementById("archivioPath");
  archivioUpload = document.getElementById("archivioUpload");
  archivioBtnUpload = document.getElementById("archivioBtnUpload");
  archivioUpBtn = document.getElementById("archivioUp");
  archivioNewFolderBtn = document.getElementById("archivioNewFolder");
  archivioContextMenu = document.getElementById("archivioContextMenu");
  menuNuova = document.getElementById("menuNuova");
  menuRinomina = document.getElementById("menuRinomina");
  menuElimina = document.getElementById("menuElimina");
  menuCopia = document.getElementById("menuCopia");
  menuIncolla = document.getElementById("menuIncolla");
  menuDownload = document.getElementById("menuDownload");

  // Notifiche overlay
  notifOverlay = document.getElementById("notificationOverlay");
  notifTitle = document.getElementById("notifTitle");
  notifIntro = document.getElementById("notifIntro");
  notifList = document.getElementById("notifList");
  notifClose = document.getElementById("notifClose");
  notifCloseBottom = document.getElementById("notifCloseBottom");

  // ====== LOGIN ======
  authTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      authTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      const role = tab.dataset.role;
      loginRoleLabel.textContent =
        role === "farmacia" ? "Farmacia" :
        role === "titolare" ? "Titolare" :
        "Dipendente";
    });
  });

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const activeTab = document.querySelector(".auth-tab.active");
      const role = activeTab ? activeTab.dataset.role : "farmacia";
      setRole(role);
      authContainer.classList.add("hidden");
      app.classList.remove("hidden");
      showSection(dashboardSection);
      initNotificationBadges();
    });
  }

  // ====== SIDEBAR / NAV ======
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
    if (sidebar &&
        sidebar.classList.contains("open") &&
        !sidebar.contains(e.target) &&
        e.target !== hamburger) {
      sidebar.classList.remove("open");
    }
  });

  if (sidebar) {
    sidebar.querySelectorAll("li[data-nav]").forEach(item => {
      item.addEventListener("click", () => {
        const target = item.dataset.nav;
        if (target === "dashboard") showSection(dashboardSection);
        if (target === "assenzePage") showSection(assenzePage);
        if (target === "turniPage") { showSection(turniPage); renderTurniTable(); }
        if (target === "comunicazioniPage") { showSection(comunicazioniPage); renderComunicazioni(); }
        if (target === "procedurePage") { showSection(procedurePage); renderProcedureList(); }
        if (target === "archivioPage") { showSection(archivioPage); renderArchivio(); }
        sidebar.classList.remove("open");
      });
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      app.classList.add("hidden");
      authContainer.classList.remove("hidden");
      loginForm && loginForm.reset();
      authTabs.forEach(t => t.classList.remove("active"));
      if (authTabs[0]) authTabs[0].classList.add("active");
      loginRoleLabel.textContent = "Farmacia";
      setRole("farmacia");
    });
  }

  // ====== NAVIGAZIONE BOTTONI DASHBOARD ======
  if (openAssenzeBtn) openAssenzeBtn.addEventListener("click", () => showSection(assenzePage));
  if (backFromAssenzeBtn) backFromAssenzeBtn.addEventListener("click", () => showSection(dashboardSection));

  if (openTurniBtn) openTurniBtn.addEventListener("click", () => {
    showSection(turniPage);
    renderTurniTable();
  });
  if (backFromTurniBtn) backFromTurniBtn.addEventListener("click", () => showSection(dashboardSection));

  if (openComunicazioniBtn) openComunicazioniBtn.addEventListener("click", () => {
    showSection(comunicazioniPage);
    renderComunicazioni();
  });
  if (backFromComunicazioniBtn) backFromComunicazioniBtn.addEventListener("click", () => showSection(dashboardSection));

  if (openProcedureBtn) openProcedureBtn.addEventListener("click", () => {
    showSection(procedurePage);
    renderProcedureList();
  });
  if (backFromProcedureBtn) backFromProcedureBtn.addEventListener("click", () => showSection(dashboardSection));

  if (openArchivioBtn) openArchivioBtn.addEventListener("click", () => {
    showSection(archivioPage);
    renderArchivio();
  });
  if (backFromArchivioBtn) backFromArchivioBtn.addEventListener("click", () => showSection(dashboardSection));

  // ====== TURNI EVENTI ======
  if (turniTabs) {
    turniTabs.forEach(tab => {
      tab.addEventListener("click", () => {
        turniTabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        currentTurniView = tab.dataset.view || "oggi";
        renderTurniTable();
      });
    });
  }
  if (turniMeseSelect) turniMeseSelect.addEventListener("change", renderTurniTable);
  if (turniFarmaciaSelect) turniFarmaciaSelect.addEventListener("change", renderTurniTable);

  // ====== COMUNICAZIONI EVENTI ======
  if (filtroCategoria) filtroCategoria.addEventListener("change", renderComunicazioni);
  if (filtroSoloNonLette) filtroSoloNonLette.addEventListener("change", renderComunicazioni);

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
        comunicazioneFeedback.textContent = "⚠️ Inserisci almeno un titolo e un testo.";
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

  // ====== ASSENZE FORM ======
  if (assenzeForm && assenzeFeedback) {
    assenzeForm.addEventListener("submit", (e) => {
      e.preventDefault();
      assenzeFeedback.classList.remove("hidden");
      assenzeFeedback.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  // ====== PROCEDURE EVENTI ======
  if (procedureSearchInput) {
    procedureSearchInput.addEventListener("input", (e) => {
      currentProcedureSearch = e.target.value || "";
      renderProcedureList();
    });
  }

  if (procedureFilterButtons) {
    procedureFilterButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        procedureFilterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentProcedureFilter = btn.getAttribute("data-reparto") || "tutti";
        renderProcedureList();
      });
    });
  }

  // ====== ARCHIVIO EVENTI ======
  if (archivioBtnUpload && archivioUpload) {
    archivioBtnUpload.addEventListener("click", () => {
      archivioUpload.click();
    });
    archivioUpload.addEventListener("change", (e) => {
      handleUpload(e.target.files);
      archivioUpload.value = "";
    });
  }

  if (archivioNewFolderBtn) {
    archivioNewFolderBtn.addEventListener("click", () => {
      createNewFolder();
    });
  }

  if (archivioUpBtn) {
    archivioUpBtn.addEventListener("click", () => {
      goUpFolder();
    });
  }

  if (archivioGrid) {
    // click sfondo -> deseleziona + chiudi menu
    archivioGrid.addEventListener("click", () => {
      clearSelection();
      closeContextMenu();
    });
  }

  if (menuNuova) menuNuova.addEventListener("click", () => { createNewFolder(); closeContextMenu(); });
  if (menuRinomina) menuRinomina.addEventListener("click", () => { renameSelected(); closeContextMenu(); });
  if (menuElimina) menuElimina.addEventListener("click", () => { deleteSelected(); closeContextMenu(); });
  if (menuCopia) menuCopia.addEventListener("click", () => { copySelected(); closeContextMenu(); });
  if (menuIncolla) menuIncolla.addEventListener("click", () => { pasteClipboard(); closeContextMenu(); });
  if (menuDownload) menuDownload.addEventListener("click", () => { downloadSelected(); closeContextMenu(); });

  document.addEventListener("click", (e) => {
    if (archivioContextMenu &&
        archivioContextMenu.classList.contains("visible") &&
        !archivioContextMenu.contains(e.target)) {
      closeContextMenu();
    }
  });

  // ====== NOTIFICHE EVENTI ======
  document.querySelectorAll(".js-card-badge").forEach((badge) => {
    const key = badge.getAttribute("data-card-key");
    badge.addEventListener("click", (e) => {
      e.stopPropagation();
      openNotificationPopup(key);
    });
  });

  if (notifClose) notifClose.addEventListener("click", closeNotificationPopup);
  if (notifCloseBottom) notifCloseBottom.addEventListener("click", closeNotificationPopup);
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
  loadFS();
  renderArchivio();
});
