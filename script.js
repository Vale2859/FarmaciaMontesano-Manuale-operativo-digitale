/* ============================================
   Portale Professionale – Farmacia Montesano
   Versione semplificata: Titolare + Farmacia
   Focus: gestione assenze dal Titolare
   ============================================ */

// ----- Costanti localStorage -----
const LS_ACTIVE_USER = "fm_active_user_v3";
const LS_REMEMBER = "fm_remember_login_v3";
const LS_ABSENCES = "fm_absences_v3";

// ----- Utenti fissi (nessuna registrazione) -----
const USERS = [
  {
    email: "valerio@farmaciamontesano.it",
    password: "titolare123",
    name: "Valerio Montesano",
    role: "titolare",
  },
  {
    email: "farmacia@farmaciamontesano.it",
    password: "farmacia123",
    name: "Farmacia Montesano",
    role: "farmacia",
  },
];

// ----- Elenco dipendenti gestiti dal titolare -----
const EMPLOYEES = [
  { id: "rizzelli-patrizia", name: "Rizzelli Patrizia" },
  { id: "andrisani-daniela", name: "Andrisani Daniela" },
  { id: "fazzino-cosimo", name: "Fazzino Cosimo" },
  { id: "zavaliche-anamaria", name: "Zavaliche Anamaria" },
  { id: "veneziano-roberta", name: "Veneziano Roberta" },
];

// ----- Stato in memoria -----
const state = {
  currentYear: new Date().getFullYear(),
  currentMonth: new Date().getMonth(), // 0-11
  selectedDate: formatISO(new Date()), // YYYY-MM-DD
  selectedEmployeeId: null,
  editingAbsenceId: null,
};

/* ============================================
   Utility base
   ============================================ */

function loadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function saveJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function uid() {
  return "id-" + Math.random().toString(36).slice(2) + "-" + Date.now();
}

// data -> "YYYY-MM-DD"
function formatISO(d) {
  const year = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${m}-${day}`;
}

// "YYYY-MM-DD" -> "gg/mm/aaaa"
function formatItalian(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function monthLabel(year, monthIndex) {
  const d = new Date(year, monthIndex, 1);
  return d.toLocaleDateString("it-IT", { month: "long", year: "numeric" });
}

/* ============================================
   LOGIN
   ============================================ */

function showError(msg) {
  const el = document.getElementById("auth-error");
  if (!el) return;
  el.textContent = msg;
  el.classList.remove("hidden");
}

function clearError() {
  const el = document.getElementById("auth-error");
  if (!el) return;
  el.textContent = "";
  el.classList.add("hidden");
}

function togglePassword() {
  const input = document.getElementById("login-password");
  if (!input) return;
  input.type = input.type === "password" ? "text" : "password";
}

function login() {
  clearError();
  const email = document.getElementById("login-email").value.trim();
  const pass = document.getElementById("login-password").value;

  if (!email || !pass) {
    showError("Inserisci email e password.");
    return;
  }

  const user = USERS.find(
    (u) =>
      u.email.toLowerCase() === email.toLowerCase() && u.password === pass
  );

  if (!user) {
    showError("Credenziali non valide.");
    return;
  }

  // Ricorda (se spuntato)
  const remember = document.getElementById("remember-me");
  if (remember && remember.checked) {
    saveJson(LS_REMEMBER, { email, password: pass });
  } else {
    localStorage.removeItem(LS_REMEMBER);
  }

  // Salva utente attivo
  saveJson(LS_ACTIVE_USER, user);
  openPortal(user);
}

function logout() {
  localStorage.removeItem(LS_ACTIVE_USER);
  document.getElementById("portal").classList.add("hidden");
  document.getElementById("auth").classList.remove("hidden");
}

/* ============================================
   NAVIGAZIONE PORTALE
   ============================================ */

function goHome() {
  const active = loadJson(LS_ACTIVE_USER, null);
  if (!active) return;
  if (active.role === "titolare") {
    showSection("home-titolare");
  } else {
    showSection("home-farmacia");
  }
}

function showSection(id) {
  const sections = document.querySelectorAll(".section");
  sections.forEach((s) => s.classList.remove("active"));
  const target = document.getElementById(id);
  if (target) target.classList.add("active");
}

function openPortal(user) {
  // Mostra portale
  document.getElementById("auth").classList.add("hidden");
  document.getElementById("portal").classList.remove("hidden");

  // Dati utente in topbar
  document.getElementById("user-name-display").textContent = user.name;
  document.getElementById("user-role-display").textContent =
    user.role === "titolare" ? "Titolare" : "Farmacia";

  // Sezioni visibili
  if (user.role === "titolare") {
    showSection("home-titolare");
  } else {
    showSection("home-farmacia");
  }

  // Inizializza pagina assenze (solo una volta)
  initEmployeesSelect();
  renderAllAbsenceViews();
}

/* ============================================
   ASSENZE – DATI
   ============================================ */

function getAbsences() {
  return loadJson(LS_ABSENCES, []);
}

function saveAbsences(list) {
  saveJson(LS_ABSENCES, list);
}

function occursOnDate(abs, isoDate) {
  if (!abs.startDate) return false;
  const start = abs.startDate;
  const end = abs.endDate || abs.startDate;
  return start <= isoDate && isoDate <= end;
}

function overlapsMonth(abs, year, monthIndex) {
  if (!abs.startDate) return false;
  const monthStart = new Date(year, monthIndex, 1);
  const monthEnd = new Date(year, monthIndex + 1, 0);

  const start = new Date(abs.startDate);
  const end = new Date(abs.endDate || abs.startDate);

  return end >= monthStart && start <= monthEnd;
}

/* ============================================
   ASSENZE – RENDER GENERALE
   ============================================ */

function renderAllAbsenceViews() {
  renderCalendar();
  renderDayDetail(state.selectedDate);
  renderMonthSummaries();
  renderEmployeeList();
  renderEmployeeHistory();
}

/* ============================================
   CALENDARIO
   ============================================ */

function renderCalendar() {
  const grid = document.getElementById("cal-grid");
  const label = document.getElementById("cal-month-label");
  if (!grid || !label) return;

  const year = state.currentYear;
  const month = state.currentMonth;

  label.textContent = monthLabel(year, month);

  const absences = getAbsences();

  // Intestazioni giorni
  const weekdays = ["L", "M", "M", "G", "V", "S", "D"];
  grid.innerHTML = "";
  weekdays.forEach((w) => {
    const div = document.createElement("div");
    div.className = "cal-weekday";
    div.textContent = w;
    grid.appendChild(div);
  });

  const firstOfMonth = new Date(year, month, 1);
  const startWeekday = (firstOfMonth.getDay() + 6) % 7; // 0 = lun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // giorni del mese precedente per riempire la prima riga
  const prevMonthDays = new Date(year, month, 0).getDate();

  const totalCells = 42; // 6 settimane

  for (let i = 0; i < totalCells; i++) {
    const cell = document.createElement("button");
    cell.type = "button";
    cell.className = "cal-day";

    let dayNum;
    let cellMonth = month;
    let cellYear = year;
    let outside = false;

    if (i < startWeekday) {
      // parte del mese precedente
      dayNum = prevMonthDays - (startWeekday - 1 - i);
      cellMonth = month - 1;
      if (cellMonth < 0) {
        cellMonth = 11;
        cellYear = year - 1;
      }
      outside = true;
    } else if (i >= startWeekday + daysInMonth) {
      // parte del mese successivo
      dayNum = i - (startWeekday + daysInMonth) + 1;
      cellMonth = month + 1;
      if (cellMonth > 11) {
        cellMonth = 0;
        cellYear = year + 1;
      }
      outside = true;
    } else {
      // mese corrente
      dayNum = i - startWeekday + 1;
    }

    const d = new Date(cellYear, cellMonth, dayNum);
    const iso = formatISO(d);

    const numberSpan = document.createElement("div");
    numberSpan.className = "cal-day-number";
    numberSpan.textContent = String(dayNum);

    const countSpan = document.createElement("div");
    countSpan.className = "cal-day-count";

    const listForDay = absences.filter((a) => occursOnDate(a, iso));
    if (listForDay.length > 0) {
      cell.classList.add("cal-day-has");
      countSpan.textContent =
        listForDay.length === 1
          ? "1 assenza"
          : listForDay.length + " assenze";
    }

    if (outside) {
      cell.classList.add("cal-day-outside");
    }

    if (iso === state.selectedDate) {
      cell.classList.add("cal-day-selected");
    }

    cell.dataset.date = iso;
    cell.appendChild(numberSpan);
    if (listForDay.length > 0) cell.appendChild(countSpan);

    cell.addEventListener("click", () => {
      state.selectedDate = iso;
      renderCalendar();
      renderDayDetail(iso);
    });

    grid.appendChild(cell);
  }
}

function changeMonth(delta) {
  let m = state.currentMonth + delta;
  let y = state.currentYear;
  if (m < 0) {
    m = 11;
    y--;
  } else if (m > 11) {
    m = 0;
    y++;
  }
  state.currentMonth = m;
  state.currentYear = y;
  renderAllAbsenceViews();
}

function goToToday() {
  const today = new Date();
  state.currentYear = today.getFullYear();
  state.currentMonth = today.getMonth();
  state.selectedDate = formatISO(today);
  renderAllAbsenceViews();
}

/* ============================================
   DETTAGLIO GIORNO
   ============================================ */

function renderDayDetail(isoDate) {
  const title = document.getElementById("day-detail-title");
  const list = document.getElementById("day-detail-list");
  if (!title || !list) return;

  title.textContent = "Dettaglio giorno selezionato – " + formatItalian(isoDate);

  const absences = getAbsences().filter((a) => occursOnDate(a, isoDate));

  if (absences.length === 0) {
    list.innerHTML =
      "<div class='list-item-muted'>Nessuna assenza registrata per questo giorno.</div>";
    return;
  }

  list.innerHTML = "";
  absences
    .sort((a, b) => a.employeeName.localeCompare(b.employeeName))
    .forEach((a) => {
      const div = document.createElement("div");
      div.className = "list-item";

      const rangeLabel =
        a.startDate === a.endDate || !a.endDate
          ? formatItalian(a.startDate)
          : `${formatItalian(a.startDate)} → ${formatItalian(a.endDate)}`;

      div.innerHTML = `
        <div class="list-item-title">${a.employeeName}</div>
        <div class="list-item-meta">
          ${rangeLabel} · ${formatType(a.type)} ·
          <span class="badge-status ${a.status}">${formatStatus(a.status)}</span>
        </div>
        <div>${a.note || ""}</div>
        <div style="margin-top:6px;">
          <button class="btn-chip" onclick="setAbsenceStatus('${
            a.id
          }','approvata')">Approva</button>
          <button class="btn-chip" onclick="setAbsenceStatus('${
            a.id
          }','rifiutata')">Rifiuta</button>
          <button class="btn-chip danger" onclick="deleteAbsence('${
            a.id
          }')">Elimina</button>
          <button class="btn-chip" onclick="loadAbsenceInForm('${
            a.id
          }')">Modifica</button>
        </div>
      `;
      list.appendChild(div);
    });
}

/* ============================================
   RIEPILOGO MESE CORRENTE / SUCCESSIVO
   ============================================ */

function renderMonthSummaries() {
  const year = state.currentYear;
  const month = state.currentMonth;

  const boxCurr = document.getElementById("month-current-list");
  const boxNext = document.getElementById("month-next-list");
  const titleCurr = document.getElementById("month-current-title");
  const titleNext = document.getElementById("month-next-title");

  if (!boxCurr || !boxNext || !titleCurr || !titleNext) return;

  const absences = getAbsences();

  // Mese corrente
  titleCurr.textContent = "Mese corrente – " + monthLabel(year, month);
  const curr = absences.filter((a) => overlapsMonth(a, year, month));

  if (curr.length === 0) {
    boxCurr.innerHTML =
      "<div class='list-item-muted'>Nessuna assenza registrata per questo mese.</div>";
  } else {
    boxCurr.innerHTML = "";
    curr
      .slice()
      .sort((a, b) => (a.startDate || "").localeCompare(b.startDate || ""))
      .forEach((a) => {
        const div = document.createElement("div");
        div.className = "list-item small";
        const range =
          a.startDate === a.endDate || !a.endDate
            ? formatItalian(a.startDate)
            : `${formatItalian(a.startDate)} → ${formatItalian(a.endDate)}`;
        div.innerHTML = `
          <div class="list-item-title">${a.employeeName}</div>
          <div class="list-item-meta">
            ${range} · ${formatType(a.type)} ·
            <span class="badge-status ${a.status}">${formatStatus(
          a.status
        )}</span>
          </div>
        `;
        boxCurr.appendChild(div);
      });
  }

  // Mese successivo
  let nextMonth = month + 1;
  let nextYear = year;
  if (nextMonth > 11) {
    nextMonth = 0;
    nextYear++;
  }
  titleNext.textContent =
    "Mese successivo – " + monthLabel(nextYear, nextMonth);
  const next = absences.filter((a) => overlapsMonth(a, nextYear, nextMonth));

  if (next.length === 0) {
    boxNext.innerHTML =
      "<div class='list-item-muted'>Nessuna assenza registrata per il mese successivo.</div>";
  } else {
    boxNext.innerHTML = "";
    next
      .slice()
      .sort((a, b) => (a.startDate || "").localeCompare(b.startDate || ""))
      .forEach((a) => {
        const div = document.createElement("div");
        div.className = "list-item small";
        const range =
          a.startDate === a.endDate || !a.endDate
            ? formatItalian(a.startDate)
            : `${formatItalian(a.startDate)} → ${formatItalian(a.endDate)}`;
        div.innerHTML = `
          <div class="list-item-title">${a.employeeName}</div>
          <div class="list-item-meta">
            ${range} · ${formatType(a.type)} ·
            <span class="badge-status ${a.status}">${formatStatus(
          a.status
        )}</span>
          </div>
        `;
        boxNext.appendChild(div);
      });
  }
}

/* ============================================
   ELENCO DIPENDENTI + STORICO
   ============================================ */

function initEmployeesSelect() {
  const sel = document.getElementById("abs-employee");
  if (!sel) return;
  sel.innerHTML = "";
  EMPLOYEES.forEach((e) => {
    const opt = document.createElement("option");
    opt.value = e.id;
    opt.textContent = e.name;
    sel.appendChild(opt);
  });
}

function renderEmployeeList() {
  const ul = document.getElementById("employee-list");
  if (!ul) return;
  ul.innerHTML = "";
  EMPLOYEES.forEach((e) => {
    const li = document.createElement("li");
    li.dataset.id = e.id;
    li.innerHTML = `<span>${e.name}</span>`;
    if (state.selectedEmployeeId === e.id) li.classList.add("active");
    li.addEventListener("click", () => {
      state.selectedEmployeeId = e.id;
      renderEmployeeList();
      renderEmployeeHistory();
    });
    ul.appendChild(li);
  });
}

function renderEmployeeHistory() {
  const box = document.getElementById("employee-history-list");
  const filterEl = document.getElementById("filter-type");
  if (!box || !filterEl) return;

  if (!state.selectedEmployeeId) {
    box.innerHTML =
      "<div class='list-item-muted'>Seleziona un dipendente nella lista sopra.</div>";
    return;
  }

  const emp = EMPLOYEES.find((e) => e.id === state.selectedEmployeeId);
  const all = getAbsences().filter((a) => a.employeeId === emp.id);

  const typeFilter = filterEl.value;
  const filtered =
    typeFilter === "tutti"
      ? all
      : all.filter((a) => a.type === typeFilter);

  if (filtered.length === 0) {
    box.innerHTML = `<div class='list-item-muted'>Nessuna assenza registrata per ${emp.name} con questo filtro.</div>`;
    return;
  }

  box.innerHTML = "";
  filtered
    .slice()
    .sort((a, b) => (a.startDate || "").localeCompare(b.startDate || ""))
    .forEach((a) => {
      const div = document.createElement("div");
      div.className = "list-item";
      const range =
        a.startDate === a.endDate || !a.endDate
          ? formatItalian(a.startDate)
          : `${formatItalian(a.startDate)} → ${formatItalian(a.endDate)}`;
      div.innerHTML = `
        <div class="list-item-title">${emp.name}</div>
        <div class="list-item-meta">
          ${range} · ${formatType(a.type)} ·
          <span class="badge-status ${a.status}">${formatStatus(
        a.status
      )}</span>
        </div>
        <div>${a.note || ""}</div>
        <div style="margin-top:6px;">
          <button class="btn-chip" onclick="loadAbsenceInForm('${
            a.id
          }')">Modifica</button>
          <button class="btn-chip danger" onclick="deleteAbsence('${
            a.id
          }')">Elimina</button>
        </div>
      `;
      box.appendChild(div);
    });
}

/* ============================================
   FORM NUOVA / MODIFICA ASSENZA
   ============================================ */

function resetAbsenceForm() {
  document.getElementById("abs-start").value = "";
  document.getElementById("abs-end").value = "";
  document.getElementById("abs-type").value = "ferie";
  document.getElementById("abs-status").value = "approvata";
  document.getElementById("abs-note").value = "";
  document.getElementById("abs-edit-id").value = "";
  state.editingAbsenceId = null;
}

function saveAbsenceFromForm() {
  const empId = document.getElementById("abs-employee").value;
  const type = document.getElementById("abs-type").value;
  const start = document.getElementById("abs-start").value;
  const end = document.getElementById("abs-end").value || null;
  const status = document.getElementById("abs-status").value;
  const note = document.getElementById("abs-note").value.trim();
  const editId = document.getElementById("abs-edit-id").value || null;

  if (!empId || !start) {
    alert("Seleziona il dipendente e la data di inizio.");
    return;
  }

  const emp = EMPLOYEES.find((e) => e.id === empId);
  if (!emp) {
    alert("Dipendente non valido.");
    return;
  }

  const all = getAbsences();

  if (editId) {
    const idx = all.findIndex((a) => a.id === editId);
    if (idx !== -1) {
      all[idx].employeeId = emp.id;
      all[idx].employeeName = emp.name;
      all[idx].type = type;
      all[idx].startDate = start;
      all[idx].endDate = end;
      all[idx].status = status;
      all[idx].note = note;
    }
  } else {
    all.push({
      id: uid(),
      employeeId: emp.id,
      employeeName: emp.name,
      type,
      startDate: start,
      endDate: end,
      status,
      note,
    });
  }

  saveAbsences(all);
  resetAbsenceForm();
  renderAllAbsenceViews();
  alert("Assenza salvata.");
}

function loadAbsenceInForm(id) {
  const all = getAbsences();
  const a = all.find((x) => x.id === id);
  if (!a) return;

  document.getElementById("abs-employee").value = a.employeeId;
  document.getElementById("abs-type").value = a.type;
  document.getElementById("abs-start").value = a.startDate || "";
  document.getElementById("abs-end").value = a.endDate || "";
  document.getElementById("abs-status").value = a.status || "approvata";
  document.getElementById("abs-note").value = a.note || "";
  document.getElementById("abs-edit-id").value = a.id;
  state.editingAbsenceId = a.id;

  // porta la vista sul mese della data inizio
  if (a.startDate) {
    const d = new Date(a.startDate);
    state.currentYear = d.getFullYear();
    state.currentMonth = d.getMonth();
    state.selectedDate = a.startDate;
    renderAllAbsenceViews();
  }
}

/* ============================================
   CAMBIO STATO / CANCELLA
   ============================================ */

function setAbsenceStatus(id, status) {
  const all = getAbsences();
  const idx = all.findIndex((a) => a.id === id);
  if (idx === -1) return;
  all[idx].status = status;
  saveAbsences(all);
  renderAllAbsenceViews();
}

function deleteAbsence(id) {
  if (!confirm("Vuoi davvero eliminare questa assenza?")) return;
  let all = getAbsences();
  all = all.filter((a) => a.id !== id);
  saveAbsences(all);
  if (state.editingAbsenceId === id) {
    resetAbsenceForm();
  }
  renderAllAbsenceViews();
}

/* ============================================
   LABEL TIPI / STATI
   ============================================ */

function formatType(t) {
  switch (t) {
    case "ferie":
      return "Ferie";
    case "malattia":
      return "Malattia";
    case "permesso_orario":
      return "Permesso orario";
    case "permesso_giornata":
      return "Permesso giornata";
    default:
      return "Altro";
  }
}

function formatStatus(s) {
  switch (s) {
    case "approvata":
      return "Approvata";
    case "rifiutata":
      return "Rifiutata";
    default:
      return "In attesa";
  }
}

/* ============================================
   AVVIO PAGINA
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {
  // Pre-compila login se "Ricordami"
  const remembered = loadJson(LS_REMEMBER, null);
  if (remembered) {
    const emailEl = document.getElementById("login-email");
    const passEl = document.getElementById("login-password");
    const chk = document.getElementById("remember-me");
    if (emailEl) emailEl.value = remembered.email || "";
    if (passEl) passEl.value = remembered.password || "";
    if (chk) chk.checked = true;
  }

  // Se c'è un utente attivo, entra subito
  const active = loadJson(LS_ACTIVE_USER, null);
  if (active) {
    openPortal(active);
  }

  // Inizializza select dipendenti
  initEmployeesSelect();
  renderAllAbsenceViews();
});
