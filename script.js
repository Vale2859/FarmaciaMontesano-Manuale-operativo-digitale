// ============================================================
// PORTALE FARMACIA MONTESANO – SCRIPT.JS
// ============================================================

// STATO GENERALE
let currentRole = "farmacia"; // "farmacia" | "titolare" | "dipendente"
let currentUser = null;       // { username, role, displayName }

let calMonth;
let calYear;

// DATI
let arriviData = [];
let scadenzeData = [];       // {id, nome, pezzi, ym}
let consumabiliData = [];    // {id, label, lastCheckedDate, lastCheckedBy}
let assenzeRequests = [];    // {id, username, nome, tipo, dal, al, motivo, stato}
let cambioData = [];         // richieste cambio cassa
let comunicazioniData = [];  // comunicazioni interne
// NOTIFICHE (per card + ruolo)
let notifications = {
  assenze: { titolare: [], farmacia: [], dipendente: [] },
  arrivi: { titolare: [], farmacia: [], dipendente: [] },
  scadenze: { titolare: [], farmacia: [], dipendente: [] },
  consumabili: { titolare: [], farmacia: [], dipendente: [] },
  cambio: { titolare: [], farmacia: [], dipendente: [] },
  comunicazioni: { titolare: [], farmacia: [], dipendente: [] }
};

// UTILS DATE
function todayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function parseISO(str) {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function diffInDays(fromISO, toISO) {
  const t1 = parseISO(fromISO).getTime();
  const t2 = parseISO(toISO).getTime();
  return Math.round((t2 - t1) / (1000 * 60 * 60 * 24));
}
// verifica se una data è tra dal/al (inclusi)
function isDateInRange(dateISO, dalISO, alISO) {
  return diffInDays(dalISO, dateISO) >= 0 && diffInDays(dateISO, alISO) >= 0;
}

// "YYYY-MM" → Date primo giorno del mese
function ymToDate(ym) {
  const [y, m] = ym.split("-").map(Number);
  return new Date(y, m - 1, 1);
}
function diffInDaysFromTodayYM(ym) {
  const today = new Date();
  const target = ymToDate(ym);
  const t1 = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const t2 = target.getTime();
  return Math.round((t2 - t1) / (1000 * 60 * 60 * 24));
}
// LOCALSTORAGE
function loadLocalData() {
  try {
    const a = localStorage.getItem("fm_arrivi");
    const s = localStorage.getItem("fm_scadenze");
    const c = localStorage.getItem("fm_consumabili");
    const as = localStorage.getItem("fm_assenze");
    const cc = localStorage.getItem("fm_cambio");
    const cm = localStorage.getItem("fm_comunicazioni");

    if (a) arriviData = JSON.parse(a);
    if (s) scadenzeData = JSON.parse(s);
    if (c) consumabiliData = JSON.parse(c);
    if (as) assenzeRequests = JSON.parse(as);
    if (cc) cambioData = JSON.parse(cc);
    if (cm) comunicazioniData = JSON.parse(cm);

    // lista base consumabili se vuota
    if (!Array.isArray(consumabiliData) || consumabiliData.length === 0) {
      consumabiliData = [
        "Caffè",
        "Zucchero",
        "Carta igienica",
        "Rotoli POS",
        "Rotoli cassa",
        "Toner stampante"
      ].map((label, idx) => ({
        id: "base-" + idx,
        label,
        lastCheckedDate: null,
        lastCheckedBy: null
      }));
    }
  } catch (e) {
    console.warn("Errore lettura localStorage", e);
  }
}
function saveLocalData() {
  try {
    localStorage.setItem("fm_arrivi", JSON.stringify(arriviData));
    localStorage.setItem("fm_scadenze", JSON.stringify(scadenzeData));
    localStorage.setItem("fm_consumabili", JSON.stringify(consumabiliData));
    localStorage.setItem("fm_assenze", JSON.stringify(assenzeRequests));
    localStorage.setItem("fm_cambio", JSON.stringify(cambioData));
    localStorage.setItem("fm_comunicazioni", JSON.stringify(comunicazioniData));
  } catch (e) {
    console.warn("Errore salvataggio localStorage", e);
  }
}

// UTENTI / LOGIN
const DEFAULT_USERS = {
  titolare: {
    username: "titolare",
    password: "1234",
    displayName: "Titolare"
  },
  farmacia: {
    username: "farmacia",
    password: "1234",
    displayName: "Farmacia"
  }
};
function loadUsers() {
  try {
    const raw = localStorage.getItem("fm_users");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}
function saveUsers(users) {
  localStorage.setItem("fm_users", JSON.stringify(users));
}

let authContainer,
  app,
  loginForm,
  authTabs,
  loginRoleLabel,
  rolePill,
  registerBox,
  registerForm,
  registerFeedback,
  toggleRegisterBtn;

function setRole(role) {
  currentRole = role;
  if (rolePill) {
    rolePill.textContent =
      role === "titolare"
        ? "Titolare"
        : role === "dipendente"
        ? "Dipendente"
        : "Farmacia (accesso generico)";
  }
  updateAllBadges();
  updateAssenzeButtonsByRole();
  updateAssenzePageVisibility();
}
function initLogin() {
  authContainer = document.getElementById("authContainer");
  app = document.getElementById("app");
  loginForm = document.getElementById("loginForm");
  authTabs = document.querySelectorAll(".auth-tab");
  loginRoleLabel = document.getElementById("loginRoleLabel");
  rolePill = document.getElementById("currentRolePill");
  registerBox = document.getElementById("registerBox");
  registerForm = document.getElementById("registerForm");
  registerFeedback = document.getElementById("registerFeedback");
  toggleRegisterBtn = document.getElementById("toggleRegister");

  if (authTabs && authTabs.length > 0) {
    authTabs.forEach(tab => {
      tab.addEventListener("click", () => {
        authTabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        const role = tab.dataset.role || "farmacia";
        if (loginRoleLabel) {
          loginRoleLabel.textContent =
            role === "titolare"
              ? "Titolare"
              : role === "dipendente"
              ? "Dipendente"
              : "Farmacia";
        }
        // registrazione solo per dipendente
        if (registerBox) {
          if (role === "dipendente") {
            toggleRegisterBtn.classList.remove("hidden");
          } else {
            registerBox.classList.add("hidden");
            toggleRegisterBtn.classList.add("hidden");
          }
        }
      });
    });
  }

  if (toggleRegisterBtn) {
    toggleRegisterBtn.addEventListener("click", () => {
      if (!registerBox) return;
      const isHidden = registerBox.classList.contains("hidden");
      registerBox.classList.toggle("hidden");
      toggleRegisterBtn.textContent = isHidden
        ? "Chiudi registrazione dipendente"
        : "Sei un dipendente nuovo? Registrati";
    });
  }
  if (registerForm) {
    registerForm.addEventListener("submit", e => {
      e.preventDefault();
      const userEl = document.getElementById("regUsername");
      const passEl = document.getElementById("regPassword");
      const username = (userEl?.value || "").trim();
      const password = (passEl?.value || "").trim();
      if (!username || !password) {
        if (registerFeedback) {
          registerFeedback.textContent = "Inserisci username e password.";
          registerFeedback.style.color = "#ffb3b3";
        }
        return;
      }
      const users = loadUsers();
      if (users.some(u => u.username === username)) {
        registerFeedback.textContent = "Esiste già un dipendente con questo username.";
        registerFeedback.style.color = "#ffb3b3";
        return;
      }
      users.push({
        username,
        password,
        role: "dipendente",
        displayName: username
      });
      saveUsers(users);
      registerFeedback.textContent = "Registrazione completata. Ora puoi accedere come dipendente.";
      registerFeedback.style.color = "#3cf26c";
      registerForm.reset();
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", e => {
      e.preventDefault();
      const activeTab = document.querySelector(".auth-tab.active");
      const role = activeTab?.dataset.role || "farmacia";
      const userEl = document.getElementById("loginUsername");
      const passEl = document.getElementById("loginPassword");
      const username = (userEl?.value || "").trim();
      const password = (passEl?.value || "").trim();

      let ok = false;
      let displayName = username;

      if (role === "titolare" || role === "farmacia") {
        const def = DEFAULT_USERS[role];
        if (username === def.username && password === def.password) {
          ok = true;
          displayName = def.displayName;
        }
      } else if (role === "dipendente") {
        const users = loadUsers();
        const found = users.find(
          u => u.username === username && u.password === password && u.role === "dipendente"
        );
        if (found) {
          ok = true;
          displayName = found.displayName || found.username;
        }
      }

      if (!ok) {
        alert("Credenziali non valide per il ruolo selezionato.");
        return;
      }

      currentUser = { username, role, displayName };
      setRole(role);

      if (authContainer) authContainer.classList.add("hidden");
      if (app) app.classList.remove("hidden");

      showSection("dashboard");
      renderAll();
    });
  }

  // mostra link registrazione solo quando tab dipendente è attivo
  const activeTab = document.querySelector(".auth-tab.active");
  if (activeTab?.dataset.role === "dipendente") {
    toggleRegisterBtn.classList.remove("hidden");
  } else {
    toggleRegisterBtn.classList.add("hidden");
  }
}
// SEZIONI
function showSection(sectionId) {
  const ids = [
    "dashboard",
    "assenzePage",
    "arriviPage",
    "scadenzePage",
    "consumabiliPage",
    "cambioPage",
    "comunicazioniPage"
  ];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add("hidden");
  });
  const target = document.getElementById(sectionId);
  if (target) target.classList.remove("hidden");
  window.scrollTo(0, 0);
}

// PWA: registra service worker (NAS compatibile se servito via HTTP/HTTPS)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("service-worker.js")
      .catch(err => console.log("SW non registrato (demo):", err));
  });
}
// NOTIFICHE – gestione contatori
function createNotification(cardKey, ruoli, title, text) {
  ruoli.forEach(role => {
    const arr = notifications[cardKey]?.[role];
    if (!arr) return;
    arr.push({
      id: Date.now().toString() + Math.random().toString(16).slice(2),
      title,
      text,
      read: false
    });
  });
  updateAllBadges();
}
function getUnreadCount(cardKey, role) {
  const arr = notifications[cardKey]?.[role];
  if (!arr) return 0;
  return arr.filter(n => !n.read).length;
}
function updateBadge(cardKey) {
  const badge = document.querySelector(`.card-notif-badge[data-card="${cardKey}"]`);
  if (!badge) return;
  const count = getUnreadCount(cardKey, currentRole);
  const dot = badge.querySelector(".badge-dot");
  const label = badge.querySelector(".badge-label");
  const countEl = badge.querySelector(".badge-count");
  if (count > 0) {
    badge.style.display = "inline-flex";
    if (dot) dot.style.display = "inline-block";
    if (label) label.textContent = "NUOVE";
    if (countEl) countEl.textContent = String(count);
  } else {
    if (dot) dot.style.display = "none";
    if (label) label.textContent = "";
    if (countEl) countEl.textContent = "";
  }
}
function updateAllBadges() {
  ["assenze", "arrivi", "scadenze", "consumabili", "cambio", "comunicazioni"].forEach(
    updateBadge
  );
}

// OVERLAY NOTIFICHE
let notifOverlay,
  notifList,
  notifTitle,
  notifIntro,
  notifClose,
  notifCloseBottom,
  notifSegnaTutte;
let openNotifCardKey = null;
function openNotificationOverlay(cardKey) {
  if (!notifOverlay || !notifList || !notifTitle || !notifIntro) return;
  openNotifCardKey = cardKey;

  // caso speciale: prodotti in scadenza → mostra elenco <=30 giorni
  if (cardKey === "scadenze") {
    const entro30 = scadenzeData
      .filter(s => diffInDaysFromTodayYM(s.ym) <= 30)
      .sort((a, b) => (a.ym > b.ym ? 1 : -1));
    notifTitle.textContent = "Prodotti in scadenza entro 30 giorni";
    if (entro30.length === 0) {
      notifIntro.textContent = "Nessun prodotto in scadenza entro 30 giorni.";
      notifList.innerHTML = "";
    } else {
      notifIntro.textContent = "Controlla e stampa l'elenco per la gestione.";
      notifList.innerHTML = "";
      entro30.forEach(item => {
        const div = document.createElement("div");
        div.className = "notif-item";
        const t = document.createElement("div");
        t.className = "notif-item-title";
        const [y, m] = item.ym.split("-");
        t.textContent = `${item.nome} (scadenza ${m}/${y})`;
        const p = document.createElement("div");
        p.className = "notif-item-text";
        p.textContent = item.pezzi ? `${item.pezzi} pezzi` : "";
        div.appendChild(t);
        div.appendChild(p);
        notifList.appendChild(div);
      });
      const btnStampa = document.createElement("button");
      btnStampa.className = "btn-secondary small";
      btnStampa.textContent = "Stampa elenco";
      btnStampa.addEventListener("click", () => window.print());
      const wrap = document.createElement("div");
      wrap.style.textAlign = "right";
      wrap.appendChild(btnStampa);
      notifList.appendChild(wrap);
    }
  } else {
    const arrAll = notifications[cardKey]?.[currentRole] || [];
    const unread = arrAll.filter(n => !n.read);
    notifTitle.textContent =
      cardKey === "assenze"
        ? "Notifiche assenze"
        : cardKey === "arrivi"
        ? "Notifiche consegne / ritiri"
        : cardKey === "consumabili"
        ? "Notifiche consumabili"
        : cardKey === "cambio"
        ? "Notifiche cambio cassa"
        : "Notifiche comunicazioni";

    if (unread.length === 0) {
      notifIntro.textContent = "Non hai nuove notifiche per questa sezione.";
    } else if (unread.length === 1) {
      notifIntro.textContent = "Hai 1 nuova notifica non letta.";
    } else {
      notifIntro.textContent = `Hai ${unread.length} nuove notifiche non lette.`;
    }

    notifList.innerHTML = "";
    if (arrAll.length === 0) {
      const div = document.createElement("div");
      div.className = "notif-item-text";
      div.textContent = "Nessuna notifica presente.";
      notifList.appendChild(div);
    } else {
      arrAll.forEach(n => {
        const item = document.createElement("div");
        item.className = "notif-item";
        const t = document.createElement("div");
        t.className = "notif-item-title";
        t.textContent = n.title;
        const p = document.createElement("div");
        p.className = "notif-item-text";
        p.textContent = n.text;
        item.appendChild(t);
        item.appendChild(p);
        notifList.appendChild(item);
      });
    }
  }

  notifOverlay.classList.remove("hidden");
}
function closeNotificationOverlay(markAsRead = true) {
  if (!notifOverlay) return;
  if (markAsRead && openNotifCardKey && openNotifCardKey !== "scadenze") {
    const arr = notifications[openNotifCardKey]?.[currentRole] || [];
    arr.forEach(n => {
      n.read = true;
    });
    updateAllBadges();
  }
  openNotifCardKey = null;
  notifOverlay.classList.add("hidden");
}
// ASSENZE / PERMESSI / RITARDI
function updateAssenzeButtonsByRole() {
  const btnRichiedi = document.getElementById("btnRichiediAssenza");
  const btnSegna = document.getElementById("btnSegnaAssenza");
  if (!btnRichiedi || !btnSegna) return;

  btnRichiedi.classList.add("hidden");
  btnSegna.classList.add("hidden");

  if (currentRole === "dipendente") {
    btnRichiedi.classList.remove("hidden");
  } else if (currentRole === "titolare") {
    btnSegna.classList.remove("hidden");
  }
}
function updateAssenzePageVisibility() {
  const boxRichiesta = document.getElementById("boxRichiestaAssenza");
  const boxApprovazione = document.getElementById("boxApprovazioneAssenze");
  if (!boxRichiesta || !boxApprovazione) return;

  if (currentRole === "dipendente") {
    boxRichiesta.classList.remove("hidden");
    boxApprovazione.classList.add("hidden");
  } else if (currentRole === "titolare") {
    boxRichiesta.classList.add("hidden");
    boxApprovazione.classList.remove("hidden");
  } else {
    boxRichiesta.classList.add("hidden");
    boxApprovazione.classList.add("hidden");
  }
}

function renderAssenti() {
  const today = todayISO();

  // assenze approvate
  const approvate = assenzeRequests.filter(r => r.stato === "approved");

  const assentiOggi = approvate.filter(r => {
    return isDateInRange(today, r.dal, r.al);
  });

  const prossimePerRuolo = role => {
    if (role === "titolare") {
      // titolare vede tutte le richieste future (pending/approved/rejected)
      return assenzeRequests
        .filter(r => diffInDays(today, r.dal) > 0)
        .sort((a, b) => (a.dal < b.dal ? -1 : 1));
    } else {
      return approvate
        .filter(r => diffInDays(today, r.dal) > 0)
        .sort((a, b) => (a.dal < b.dal ? -1 : 1));
    }
  };

  const prossime = prossimePerRuolo(currentRole);
  // data label card
  const dataLabel = document.getElementById("assenzeOggiDataLabel");
  if (dataLabel) {
    const d = parseISO(today);
    const giorni = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"];
    const mesi = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];
    const txt = `${giorni[d.getDay()]} ${d.getDate()} ${mesi[d.getMonth()]}`;
    dataLabel.textContent = txt;
  }

  const ulCardOggi = document.getElementById("listaAssentiOggi");
  const ulCardProx = document.getElementById("listaAssentiProssimi");
  const pageOggi = document.getElementById("pageAssentiOggi");
  const pageProx = document.getElementById("pageAssentiProssimi");

  function fillList(ul, arr, emptyText, includeTipo = false) {
    if (!ul) return;
    ul.innerHTML = "";
    if (arr.length === 0) {
      const li = document.createElement("li");
      li.textContent = emptyText;
      ul.appendChild(li);
      return;
    }
    arr.forEach(r => {
      const li = document.createElement("li");
      const dal = r.dal.split("-").reverse().join("/");
      const al = r.al.split("-").reverse().join("/");
      const tipoTxt = includeTipo ? ` (${r.tipo})` : "";
      li.innerHTML = `<strong>${r.nome}</strong>${tipoTxt} · dal ${dal} al ${al}`;
      ul.appendChild(li);
    });
  }

  fillList(
    ulCardOggi,
    assentiOggi,
    "Nessun assente segnato oggi."
  );
  fillList(
    ulCardProx,
    prossime.slice(0, 3),
    "Nessuna assenza programmata.",
    true
  );
  fillList(
    pageOggi,
    assentiOggi,
    "Nessun assente segnato oggi.",
    true
  );
  fillList(
    pageProx,
    prossime,
    "Nessuna assenza programmata.",
    true
  );
  // storico personale dipendente
  const storicoBox = document.getElementById("storicoPersonale");
  if (storicoBox) {
    storicoBox.innerHTML = "";
    if (!currentUser || currentRole !== "dipendente") {
      storicoBox.textContent = "Disponibile solo per dipendenti loggati.";
    } else {
      const mine = assenzeRequests.filter(r => r.username === currentUser.username);
      if (mine.length === 0) {
        storicoBox.textContent = "Non hai ancora inviato richieste.";
      } else {
        const header = document.createElement("div");
        header.className = "row header";
        ["Data", "Tipo", "Stato", "Periodo"].forEach(t => {
          const span = document.createElement("span");
          span.textContent = t;
          header.appendChild(span);
        });
        storicoBox.appendChild(header);

        mine
          .slice()
          .sort((a, b) => (a.dal > b.dal ? -1 : 1))
          .forEach(r => {
            const row = document.createElement("div");
            row.className = "row";
            const span1 = document.createElement("span");
            span1.textContent = r.dal.split("-").reverse().join("/");
            const span2 = document.createElement("span");
            span2.textContent = r.tipo;
            const span3 = document.createElement("span");
            span3.textContent =
              r.stato === "approved"
                ? "Approvata"
                : r.stato === "rejected"
                ? "Rifiutata"
                : "In attesa";
            const span4 = document.createElement("span");
            span4.textContent = `${r.dal.split("-").reverse().join("/")} → ${r.al
              .split("-")
              .reverse()
              .join("/")}`;
            row.appendChild(span1);
            row.appendChild(span2);
            row.appendChild(span3);
            row.appendChild(span4);
            storicoBox.appendChild(row);
          });
      }
    }
  }

  // lista richieste per titolare
  const listaRich = document.getElementById("listaRichiesteAssenze");
  if (listaRich) {
    listaRich.innerHTML = "";
    if (currentRole !== "titolare") {
      listaRich.textContent = "Solo il titolare può gestire le richieste.";
    } else if (assenzeRequests.length === 0) {
      listaRich.textContent = "Nessuna richiesta presente.";
    } else {
      const header = document.createElement("div");
      header.className = "row header";
      ["Dipendente", "Tipo", "Periodo", "Stato / Azioni"].forEach(t => {
        const span = document.createElement("span");
        span.textContent = t;
        header.appendChild(span);
      });
      listaRich.appendChild(header);

      assenzeRequests
        .slice()
        .sort((a, b) => (a.dal < b.dal ? -1 : 1))
        .forEach(r => {
          const row = document.createElement("div");
          row.className = "row";
          const s1 = document.createElement("span");
          s1.textContent = r.nome;
          const s2 = document.createElement("span");
          s2.textContent = r.tipo;
          const s3 = document.createElement("span");
          s3.textContent = `${r.dal.split("-").reverse().join("/")} → ${r.al
            .split("-")
            .reverse()
            .join("/")}`;
          const s4 = document.createElement("span");
          s4.className = "actions";

          const statoSpan = document.createElement("span");
          statoSpan.textContent =
            r.stato === "approved"
              ? "Approvata"
              : r.stato === "rejected"
              ? "Rifiutata"
              : "In attesa";
          statoSpan.style.fontSize = "0.8rem";

          const btnOk = document.createElement("button");
          btnOk.className = "btn-primary small";
          btnOk.textContent = "Approva";
          btnOk.addEventListener("click", () => {
            r.stato = "approved";
            saveLocalData();
            createNotification(
              "assenze",
              ["dipendente", "farmacia"],
              "Richiesta assenza approvata",
              `${r.nome} – ${r.tipo} dal ${r.dal.split("-").reverse().join("/")} al ${r.al
                .split("-")
                .reverse()
                .join("/")}`
            );
            renderAssenti();
          });

          const btnNo = document.createElement("button");
          btnNo.className = "btn-secondary small";
          btnNo.textContent = "Rifiuta";
          btnNo.addEventListener("click", () => {
            r.stato = "rejected";
            saveLocalData();
            createNotification(
              "assenze",
              ["dipendente"],
              "Richiesta assenza rifiutata",
              `${r.nome} – ${r.tipo} dal ${r.dal.split("-").reverse().join("/")} al ${r.al
                .split("-")
                .reverse()
                .join("/")}`
            );
            renderAssenti();
          });

          s4.appendChild(statoSpan);
          s4.appendChild(btnOk);
          s4.appendChild(btnNo);

          row.appendChild(s1);
          row.appendChild(s2);
          row.appendChild(s3);
          row.appendChild(s4);
          listaRich.appendChild(row);
        });
    }
  }
}
// MINI CALENDARIO ASSENZE
function initCalendarState() {
  const d = new Date();
  calMonth = d.getMonth();
  calYear = d.getFullYear();
}
function renderCalendar() {
  const monthLabel = document.getElementById("calMonthLabel");
  const grid = document.getElementById("calMiniGrid");
  const weekdaysRow = document.getElementById("calMiniWeekdays");
  if (!grid || !monthLabel || !weekdaysRow) return;

  const mesi = [
    "Gennaio",
    "Febbraio",
    "Marzo",
    "Aprile",
    "Maggio",
    "Giugno",
    "Luglio",
    "Agosto",
    "Settembre",
    "Ottobre",
    "Novembre",
    "Dicembre"
  ];
  monthLabel.textContent = `${mesi[calMonth]} ${calYear}`;

  // intestazione L M M G V S D
  weekdaysRow.innerHTML = "";
  ["L", "M", "M", "G", "V", "S", "D"].forEach(l => {
    const span = document.createElement("span");
    span.textContent = l;
    weekdaysRow.appendChild(span);
  });

  grid.innerHTML = "";
  const firstDay = new Date(calYear, calMonth, 1);
  const startWeekDay = (firstDay.getDay() + 6) % 7; // lun=0
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const todayStr = todayISO();

  const hasAssenzeSet = new Set();
  assenzeRequests
    .filter(r => r.stato === "approved")
    .forEach(r => {
      let d = parseISO(r.dal);
      const end = parseISO(r.al);
      while (d <= end) {
        if (d.getMonth() === calMonth && d.getFullYear() === calYear) {
          hasAssenzeSet.add(d.getDate());
        }
        d.setDate(d.getDate() + 1);
      }
    });

  for (let i = 0; i < startWeekDay; i++) {
    const div = document.createElement("div");
    div.className = "cal-day cal-day--empty";
    grid.appendChild(div);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const div = document.createElement("div");
    div.className = "cal-day";
    div.textContent = day;
    const iso = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(
      2,
      "0"
    )}`;
    if (iso === todayStr) {
      div.classList.add("cal-day--today");
    }
    if (hasAssenzeSet.has(day)) {
      div.classList.add("cal-day--has-assenze");
      div.addEventListener("click", () => {
        const nomi = assenzeRequests
          .filter(r => r.stato === "approved" && isDateInRange(iso, r.dal, r.al))
          .map(r => `${r.nome} (${r.tipo})`);
        if (nomi.length === 0) return;
        alert(
          `Assenti il ${iso.split("-").reverse().join("/")}:\n- ${nomi.join(
            "\n- "
          )}`
        );
      });
    }
    grid.appendChild(div);
  }
}
function initCalendarNav() {
  const btnPrev = document.getElementById("calPrevMonth");
  const btnNext = document.getElementById("calNextMonth");
  if (btnPrev) {
    btnPrev.addEventListener("click", () => {
      calMonth--;
      if (calMonth < 0) {
        calMonth = 11;
        calYear--;
      }
      renderCalendar();
    });
  }
  if (btnNext) {
    btnNext.addEventListener("click", () => {
      calMonth++;
      if (calMonth > 11) {
        calMonth = 0;
        calYear++;
      }
      renderCalendar();
    });
  }
}

// TURNI FARMACIA (demo)
const turniFarmacie = [
  {
    data: "2025-11-26",
    principale: "Farmacia Montesano",
    indirizzo: "Via Esempio 12, Matera",
    telefono: "0835 000000",
    appoggio: "Farmacia Centrale",
    appoggioIndirizzo: "Via Dante 8, Matera",
    appoggioTelefono: "0835 111111"
  }
];
function renderTurnoBanner() {
  if (!turniFarmacie || turniFarmacie.length === 0) return;
  const today = todayISO();
  const turno = turniFarmacie.find(t => t.data === today) || turniFarmacie[0];
  const cont = document.getElementById("turnoTodayInfo");
  if (!cont) return;
  cont.innerHTML = "";
  const p1 = document.createElement("p");
  p1.innerHTML = `<strong>${turno.principale}</strong> · ${turno.indirizzo}`;
  const p2 = document.createElement("p");
  p2.textContent = `Tel: ${turno.telefono}`;
  const p3 = document.createElement("p");
  p3.innerHTML = `<strong>Farmacia di appoggio:</strong> <strong>${turno.appoggio}</strong> · ${turno.appoggioIndirizzo}`;
  const p4 = document.createElement("p");
  p4.textContent = `Tel: ${turno.appoggioTelefono}`;
  cont.appendChild(p1);
  cont.appendChild(p2);
  cont.appendChild(p3);
  cont.appendChild(p4);
}

// ARRIVI / CONSEGNE
function renderArriviList() {
  const wrapper = document.getElementById("listaArrivi");
  if (!wrapper) return;
  wrapper.innerHTML = "";
  if (arriviData.length === 0) {
    wrapper.textContent = "Nessuna consegna / ritiro registrato.";
    return;
  }
  const header = document.createElement("div");
  header.className = "row header";
  ["Data", "Descrizione", "Note", "Azioni"].forEach(t => {
    const span = document.createElement("span");
    span.textContent = t;
    header.appendChild(span);
  });
  wrapper.appendChild(header);

  arriviData
    .slice()
    .sort((a, b) => (a.data > b.data ? -1 : 1))
    .forEach(item => {
      const row = document.createElement("div");
      row.className = "row";
      const s1 = document.createElement("span");
      s1.textContent = item.data.split("-").reverse().join("/");
      const s2 = document.createElement("span");
      s2.textContent = item.descrizione;
      const s3 = document.createElement("span");
      s3.textContent = item.note || "-";
      const actions = document.createElement("span");
      actions.className = "actions";
      const btnDel = document.createElement("button");
      btnDel.className = "btn-secondary small";
      btnDel.textContent = "Elimina";
      btnDel.addEventListener("click", () => {
        arriviData = arriviData.filter(a => a.id !== item.id);
        saveLocalData();
        renderArriviList();
      });
      actions.appendChild(btnDel);
      row.appendChild(s1);
      row.appendChild(s2);
      row.appendChild(s3);
      row.appendChild(actions);
      wrapper.appendChild(row);
    });
}
function initArriviForm() {
  const form = document.getElementById("formArrivo");
  const feedback = document.getElementById("arrivoFeedback");
  if (!form) return;
  form.addEventListener("submit", e => {
    e.preventDefault();
    const dataEl = document.getElementById("arrData");
    const descEl = document.getElementById("arrDescrizione");
    const noteEl = document.getElementById("arrNote");
    const data = dataEl?.value || todayISO();
    const descrizione = (descEl?.value || "").trim();
    const note = (noteEl?.value || "").trim();
    if (!descrizione) {
      if (feedback) {
        feedback.textContent = "Inserisci almeno una descrizione.";
        feedback.style.color = "#ffb3b3";
      }
      return;
    }
    arriviData.unshift({
      id: Date.now().toString(),
      data,
      descrizione,
      note
    });
    saveLocalData();
    renderArriviList();
    createNotification(
      "arrivi",
      ["farmacia", "titolare"],
      "Nuova consegna / ritiro",
      descrizione
    );
    form.reset();
    if (feedback) {
      feedback.textContent = "Registrato.";
      feedback.style.color = "#3cf26c";
      feedback.classList.remove("hidden");
    }
  });
}
// SCADENZE / PRODOTTI IN SCADENZA
function renderScadenzeList() {
  const wrapper = document.getElementById("listaScadenze");
  const scadutiWrap = document.getElementById("listaScaduti");
  if (!wrapper || !scadutiWrap) return;

  wrapper.innerHTML = "";
  scadutiWrap.innerHTML = "";

  if (scadenzeData.length === 0) {
    wrapper.textContent = "Nessun prodotto in scadenza registrato.";
    scadutiWrap.textContent = "Nessun prodotto scaduto non rimosso.";
    return;
  }

  const header = document.createElement("div");
  header.className = "row header";
  ["Prodotto", "Pezzi", "Scadenza", "Azioni"].forEach(t => {
    const span = document.createElement("span");
    span.textContent = t;
    header.appendChild(span);
  });
  wrapper.appendChild(header);

  const headerScad = document.createElement("div");
  headerScad.className = "row header";
  ["Prodotto", "Pezzi", "Scadenza", "Azioni"].forEach(t => {
    const span = document.createElement("span");
    span.textContent = t;
    headerScad.appendChild(span);
  });
  scadutiWrap.appendChild(headerScad);

  scadenzeData
    .slice()
    .sort((a, b) => (a.ym > b.ym ? 1 : -1))
    .forEach(item => {
      const row = document.createElement("div");
      row.className = "row";
      const s1 = document.createElement("span");
      s1.textContent = item.nome;
      const s2 = document.createElement("span");
      s2.textContent = item.pezzi ? `${item.pezzi} pz` : "-";
      const s3 = document.createElement("span");
      const [y, m] = item.ym.split("-");
      s3.textContent = `${m}/${y}`;
      const actions = document.createElement("span");
      actions.className = "actions";
      const btnDel = document.createElement("button");
      btnDel.className = "btn-secondary small";
      btnDel.textContent = "Elimina";
      btnDel.addEventListener("click", () => {
        scadenzeData = scadenzeData.filter(s => s.id !== item.id);
        saveLocalData();
        renderScadenzeList();
        updateAllBadges();
      });
      actions.appendChild(btnDel);

      const diff = diffInDaysFromTodayYM(item.ym);
      if (diff <= 45 && diff >= 0) {
        row.style.background = "rgba(255,255,255,0.06)";
      }

      row.appendChild(s1);
      row.appendChild(s2);
      row.appendChild(s3);
      row.appendChild(actions);

      if (diff < 0) {
        scadutiWrap.appendChild(row);
      } else {
        wrapper.appendChild(row);
      }
    });
}
function initScadenzeForm() {
  const form = document.getElementById("formScadenza");
  const feedback = document.getElementById("scadFeedback");
  if (!form) return;
  form.addEventListener("submit", e => {
    e.preventDefault();
    const nomeEl = document.getElementById("scadNome");
    const pezziEl = document.getElementById("scadPezzi");
    const dataEl = document.getElementById("scadData");

    const nome = (nomeEl?.value || "").trim();
    const pezzi = (pezziEl?.value || "").trim();
    const ym = dataEl?.value || ""; // YYYY-MM

    if (!nome || !ym) {
      if (feedback) {
        feedback.textContent = "Inserisci nome prodotto e mese/anno di scadenza.";
        feedback.style.color = "#ffb3b3";
        feedback.classList.remove("hidden");
      }
      return;
    }

    const item = {
      id: Date.now().toString(),
      nome,
      pezzi,
      ym
    };
    scadenzeData.push(item);
    saveLocalData();
    renderScadenzeList();

    const diff = diffInDaysFromTodayYM(ym);
    if (diff <= 45 && diff >= 0) {
      createNotification(
        "scadenze",
        ["farmacia", "titolare", "dipendente"],
        "Prodotto in scadenza (≤45 gg)",
        `${nome} – scadenza ${ym.split("-")[1]}/${ym.split("-")[0]}`
      );
    }
    if (diff <= 30 && diff >= 0) {
      createNotification(
        "scadenze",
        ["farmacia", "titolare", "dipendente"],
        "Prodotto in scadenza (≤30 gg)",
        `${nome} – scadenza ${ym.split("-")[1]}/${ym.split("-")[0]}`
      );
    }

    form.reset();
    if (feedback) {
      feedback.textContent = "Scadenza registrata.";
      feedback.style.color = "#3cf26c";
      feedback.classList.remove("hidden");
    }
  });
}

// CONSUMABILI
function renderConsumabiliList() {
  const wrap = document.getElementById("listaConsumabili");
  if (!wrap) return;
  wrap.innerHTML = "";
  if (!Array.isArray(consumabiliData) || consumabiliData.length === 0) {
    wrap.textContent = "Nessun consumabile in lista.";
    return;
  }
  const today = todayISO();
  consumabiliData.forEach(item => {
    const row = document.createElement("div");
    row.className = "consumabile-row";
    const main = document.createElement("div");
    main.className = "consumabile-main";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "consumabile-checkbox";
    checkbox.checked = item.lastCheckedDate === today;

    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        item.lastCheckedDate = today;
        item.lastCheckedBy = currentUser ? currentUser.displayName : "Utente";
      } else {
        item.lastCheckedDate = null;
        item.lastCheckedBy = null;
      }
      saveLocalData();
    });

    const label = document.createElement("div");
    label.className = "consumabile-label";
    label.textContent = item.label;

    main.appendChild(checkbox);
    main.appendChild(label);

    const actions = document.createElement("div");
    actions.className = "consumabile-actions";

    const note = document.createElement("div");
    note.className = "consumabile-note";
    if (item.lastCheckedDate) {
      note.textContent = `Ultimo check: ${item.lastCheckedDate
        .split("-")
        .reverse()
        .join("/")} da ${item.lastCheckedBy || "utente"}`;
    } else {
      note.textContent = "Non ancora controllato oggi.";
    }

    const btnDel = document.createElement("button");
    btnDel.className = "btn-secondary small";
    btnDel.textContent = "Elimina";
    btnDel.addEventListener("click", () => {
      consumabiliData = consumabiliData.filter(c => c.id !== item.id);
      saveLocalData();
      renderConsumabiliList();
    });

    actions.appendChild(note);
    actions.appendChild(btnDel);

    row.appendChild(main);
    row.appendChild(actions);
    wrap.appendChild(row);
  });
}
function initConsumabiliForm() {
  const form = document.getElementById("formConsumabile");
  const feedback = document.getElementById("consFeedback");
  if (!form) return;
  form.addEventListener("submit", e => {
    e.preventDefault();
    const labelEl = document.getElementById("consLabel");
    const label = (labelEl?.value || "").trim();
    if (!label) {
      if (feedback) {
        feedback.textContent = "Inserisci il nome del consumabile.";
        feedback.style.color = "#ffb3b3";
        feedback.classList.remove("hidden");
      }
      return;
    }
    consumabiliData.push({
      id: Date.now().toString(),
      label,
      lastCheckedDate: null,
      lastCheckedBy: null
    });
    saveLocalData();
    renderConsumabiliList();
    createNotification(
      "consumabili",
      ["titolare"],
      "Nuovo consumabile aggiunto",
      label
    );
    form.reset();
    if (feedback) {
      feedback.textContent = "Aggiunto alla lista.";
      feedback.style.color = "#3cf26c";
      feedback.classList.remove("hidden");
    }
  });
}
// CAMBIO CASSA
function renderCambioList() {
  const wrap = document.getElementById("listaCambio");
  if (!wrap) return;
  wrap.innerHTML = "";
  if (cambioData.length === 0) {
    wrap.textContent = "Nessuna richiesta recente.";
    return;
  }
  const header = document.createElement("div");
  header.className = "row header";
  ["Data", "Dettaglio", "Urgenza", "Da"].forEach(t => {
    const span = document.createElement("span");
    span.textContent = t;
    header.appendChild(span);
  });
  wrap.appendChild(header);

  cambioData
    .slice()
    .sort((a, b) => (a.data > b.data ? -1 : 1))
    .forEach(item => {
      const row = document.createElement("div");
      row.className = "row";
      const s1 = document.createElement("span");
      s1.textContent = item.data.split("-").reverse().join("/");
      const s2 = document.createElement("span");
      s2.textContent = item.dettaglio || "Necessito riordino di monete e banconote.";
      const s3 = document.createElement("span");
      s3.textContent = item.urgenza === "alta" ? "Alta" : "Normale";
      const s4 = document.createElement("span");
      s4.textContent = item.from || "-";
      row.appendChild(s1);
      row.appendChild(s2);
      row.appendChild(s3);
      row.appendChild(s4);
      wrap.appendChild(row);
    });
}
function initCambioForm() {
  const form = document.getElementById("formCambio");
  const feedback = document.getElementById("cambioFeedback");
  if (!form) return;
  form.addEventListener("submit", e => {
    e.preventDefault();
    const dettaglioEl = document.getElementById("cambioDettaglio");
    const urgenzaEl = document.getElementById("cambioUrgenza");
    const dettaglio = (dettaglioEl?.value || "").trim();
    const urgenza = urgenzaEl?.value || "normale";

    const req = {
      id: Date.now().toString(),
      data: todayISO(),
      dettaglio,
      urgenza,
      from: currentUser ? currentUser.displayName : "Utente"
    };
    cambioData.unshift(req);
    saveLocalData();
    renderCambioList();

    createNotification(
      "cambio",
      ["titolare"],
      "Richiesta cambio cassa",
      (dettaglio || "Necessito riordino di monete e banconote.") +
        ` (urgenza: ${urgenza})`
    );

    form.reset();
    if (feedback) {
      feedback.textContent =
        "Richiesta inviata (demo – notifica al titolare).";
      feedback.style.color = "#3cf26c";
      feedback.classList.remove("hidden");
    }
  });
}

// COMUNICAZIONI
function renderComunicazioni() {
  const wrap = document.getElementById("listaComunicazioni");
  if (!wrap) return;
  wrap.innerHTML = "";
  if (comunicazioniData.length === 0) {
    wrap.textContent = "Nessuna comunicazione inserita.";
    return;
  }
  const header = document.createElement("div");
  header.className = "row header";
  ["Data", "Titolo", "Da", ""].forEach(t => {
    const span = document.createElement("span");
    span.textContent = t;
    header.appendChild(span);
  });
  wrap.appendChild(header);

  comunicazioniData
    .slice()
    .sort((a, b) => (a.data > b.data ? -1 : 1))
    .forEach(c => {
      const row = document.createElement("div");
      row.className = "row";
      const s1 = document.createElement("span");
      s1.textContent = c.data.split("-").reverse().join("/");
      const s2 = document.createElement("span");
      s2.textContent = c.titolo;
      const s3 = document.createElement("span");
      s3.textContent = c.from;
      const s4 = document.createElement("span");
      s4.className = "actions";
      const btnLeggi = document.createElement("button");
      btnLeggi.className = "btn-secondary small";
      btnLeggi.textContent = "Leggi";
      btnLeggi.addEventListener("click", () => {
        alert(`${c.titolo}\n\n${c.testo}`);
      });
      s4.appendChild(btnLeggi);
      row.appendChild(s1);
      row.appendChild(s2);
      row.appendChild(s3);
      row.appendChild(s4);
      wrap.appendChild(row);
    });
}
function initComunicazioniForm() {
  const form = document.getElementById("formComunicazione");
  const feedback = document.getElementById("commFeedback");
  if (!form) return;
  form.addEventListener("submit", e => {
    e.preventDefault();
    const tEl = document.getElementById("commTitolo");
    const txEl = document.getElementById("commTesto");
    const titolo = (tEl?.value || "").trim();
    const testo = (txEl?.value || "").trim();
    if (!titolo || !testo) {
      if (feedback) {
        feedback.textContent = "Inserisci titolo e testo.";
        feedback.style.color = "#ffb3b3";
        feedback.classList.remove("hidden");
      }
      return;
    }
    const from = currentUser ? currentUser.displayName : "Utente";
    comunicazioniData.unshift({
      id: Date.now().toString(),
      data: todayISO(),
      titolo,
      testo,
      from
    });
    saveLocalData();
    renderComunicazioni();
    createNotification(
      "comunicazioni",
      ["titolare", "farmacia", "dipendente"],
      "Nuova comunicazione",
      titolo
    );
    form.reset();
    if (feedback) {
      feedback.textContent = "Comunicazione inviata.";
      feedback.style.color = "#3cf26c";
      feedback.classList.remove("hidden");
    }
  });
}
// FORM RICHIESTA ASSENZA
function initAssenzeForms() {
  const form = document.getElementById("formRichiestaAssenza");
  const feedback = document.getElementById("assRichiestaFeedback");
  if (form) {
    form.addEventListener("submit", e => {
      e.preventDefault();
      if (!currentUser) {
        alert("Devi essere loggato come dipendente.");
        return;
      }
      const tipoEl = document.getElementById("assTipo");
      const dalEl = document.getElementById("assDal");
      const alEl = document.getElementById("assAl");
      const motivoEl = document.getElementById("assMotivo");

      const tipo = tipoEl?.value || "assenza";
      const dal = dalEl?.value || "";
      const al = alEl?.value || dal;
      const motivo = (motivoEl?.value || "").trim();

      if (!dal || !al) {
        if (feedback) {
          feedback.textContent = "Inserisci le date dal/al.";
          feedback.style.color = "#ffb3b3";
          feedback.classList.remove("hidden");
        }
        return;
      }

      const req = {
        id: Date.now().toString(),
        username: currentUser.username,
        nome: currentUser.displayName || currentUser.username,
        tipo,
        dal,
        al,
        motivo,
        stato: "pending"
      };
      assenzeRequests.push(req);
      saveLocalData();

      createNotification(
        "assenze",
        ["titolare"],
        "Nuova richiesta assenza/permesso",
        `${req.nome} – ${tipo} dal ${dal.split("-").reverse().join("/")} al ${al
          .split("-")
          .reverse()
          .join("/")}`
      );

      form.reset();
      if (feedback) {
        feedback.textContent = "Richiesta inviata. In attesa di approvazione.";
        feedback.style.color = "#3cf26c";
        feedback.classList.remove("hidden");
      }
      renderAssenti();
    });
  }

  // bottoni sotto al calendario
  const btnVai = document.getElementById("btnVaiTuttiAssenti");
  if (btnVai) {
    btnVai.addEventListener("click", () => {
      showSection("assenzePage");
    });
  }
  const btnRich = document.getElementById("btnRichiediAssenza");
  if (btnRich) {
    btnRich.addEventListener("click", () => {
      showSection("assenzePage");
      updateAssenzePageVisibility();
    });
  }
  const btnSegna = document.getElementById("btnSegnaAssenza");
  if (btnSegna) {
    btnSegna.addEventListener("click", () => {
      showSection("assenzePage");
      updateAssenzePageVisibility();
    });
  }
}

// NAVIGAZIONE DASHBOARD & CARDS TAPPABILI
function initDashboardButtons() {
  // card intera cliccabile
  document.querySelectorAll(".card-link[data-section]").forEach(card => {
    card.addEventListener("click", () => {
      const sec = card.getAttribute("data-section") || "dashboard";
      showSection(sec);
      if (sec === "assenzePage") updateAssenzePageVisibility();
    });
  });

  // bottoni "← Dashboard"
  document.querySelectorAll(".back-button[data-back]").forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-back") || "dashboard";
      showSection(target);
    });
  });
}

// CLICK PALLINI NOTIFICHE
function initNotificationButtons() {
  document.querySelectorAll(".card-notif-badge[data-card]").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      const cardKey = btn.getAttribute("data-card");
      if (!cardKey) return;
      openNotificationOverlay(cardKey);
    });
  });

  notifOverlay = document.getElementById("notifOverlay");
  notifList = document.getElementById("notifList");
  notifTitle = document.getElementById("notifTitle");
  notifIntro = document.getElementById("notifIntro");
  notifClose = document.getElementById("notifClose");
  notifCloseBottom = document.getElementById("notifCloseBottom");
  notifSegnaTutte = document.getElementById("notifSegnaTutte");

  if (notifClose) {
    notifClose.addEventListener("click", () => closeNotificationOverlay(true));
  }
  if (notifCloseBottom) {
    notifCloseBottom.addEventListener("click", () =>
      closeNotificationOverlay(true)
    );
  }
  if (notifSegnaTutte) {
    notifSegnaTutte.addEventListener("click", () =>
      closeNotificationOverlay(true)
    );
  }
  if (notifOverlay) {
    notifOverlay.addEventListener("click", e => {
      if (e.target === notifOverlay || e.target.classList.contains("notif-backdrop")) {
        closeNotificationOverlay(true);
      }
    });
  }
}
// RENDER COMPLETO
function renderAll() {
  loadLocalData();
  renderTurnoBanner();
  renderAssenti();
  renderArriviList();
  renderScadenzeList();
  renderConsumabiliList();
  renderCambioList();
  renderComunicazioni();
  updateAllBadges();

  if (calMonth == null || calYear == null) {
    initCalendarState();
  }
  renderCalendar();
}

// DEMO NOTIFICHE INIZIALI (per vedere i pallini)
function initDemoNotifications() {
  if (notifications.assenze.titolare.length === 0) {
    createNotification(
      "assenze",
      ["farmacia", "titolare"],
      "Esempio richiesta assenza",
      "Demo – qui compariranno le richieste reali."
    );
  }
}
// DOM READY
document.addEventListener("DOMContentLoaded", () => {
  initLogin();
  initAssenzeForms();
  initArriviForm();
  initScadenzeForm();
  initConsumabiliForm();
  initCambioForm();
  initComunicazioniForm();
  initDashboardButtons();
  initNotificationButtons();
  initCalendarNav();

  const appEl = document.getElementById("app");
  const authEl = document.getElementById("authContainer");
  if (appEl && !appEl.classList.contains("hidden") && authEl) {
    setRole(currentRole);
    renderAll();
  }

  initDemoNotifications();
});
// ============================================================
// FINE SCRIPT – PORTALE FARMACIA MONTESANO
// ============================================================
