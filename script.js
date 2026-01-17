// ===== STATO =====
let currentUser = null;

// ===== STORAGE KEYS =====
const STORAGE_KEYS = {
  UTENTI: "fm_utenti",
  OFFERTE: "fm_offerte",
  ASSENZE: "fm_assenze_richieste",
  PROCEDURE: "fm_procedure",
  CONSUMABILI_CATALOGO: "fm_consumabili_catalogo",
  CONSUMABILI_RICHIESTE: "fm_consumabili_richieste",
  SCADENZE: "fm_scadenze_groups",
  FOTO_Q4: "fm_foto_q4"
};

// ===== STORAGE HELPERS =====
function loadData(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}
function saveData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// ===== MINI UTILS =====
function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
function unescapeHtml(str) {
  const div = document.createElement("div");
  div.innerHTML = str ?? "";
  return div.textContent || "";
}

// ===== DATE HELPERS =====
function todayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function parseISO(iso) {
  const [y, m, d] = iso.split("-");
  return new Date(Number(y), Number(m) - 1, Number(d));
}
function formatDateShortIT(iso) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}
function isDateInRange(iso, dal, al) {
  const d = parseISO(iso);
  const start = parseISO(dal);
  const end = parseISO(al);
  return d >= start && d <= end;
}
function diffDays(fromIso, toIso) {
  const a = parseISO(fromIso);
  const b = parseISO(toIso);
  const ms = b.getTime() - a.getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

// ===== DEMO INIT =====
function initDemoUsers() {
  let utenti = loadData(STORAGE_KEYS.UTENTI, []);
  if (utenti.length === 0) {
    utenti = [
      { username: "farmacia", password: "farmacia", ruolo: "farmacia", nome: "Farmacia Montesano" },
      { username: "titolare", password: "titolare", ruolo: "titolare", nome: "Titolare" },
      { username: "fazzino", password: "1234", ruolo: "dipendente", nome: "Fazzino Cosimo" },
      { username: "rizzelli", password: "1234", ruolo: "dipendente", nome: "Rizzelli Patrizia" },
      { username: "andrisani", password: "1234", ruolo: "dipendente", nome: "Andrisani Daniela" },
      { username: "maragno", password: "1234", ruolo: "dipendente", nome: "Maragno Annalisa" }
    ];
    saveData(STORAGE_KEYS.UTENTI, utenti);
  }
}
function initConsumabiliCatalogo() {
  let cat = loadData(STORAGE_KEYS.CONSUMABILI_CATALOGO, null);
  if (!cat) {
    cat = [
      "Rotoli POS","Rotoli Cassa","Carta igienica","Carta stampante","Toner Brother",
      "Toner Xerox (Nero)","Toner Xerox (Giallo)","Toner Xerox (Blu)","Toner Xerox (Rosso)","Rotoloni"
    ];
    saveData(STORAGE_KEYS.CONSUMABILI_CATALOGO, cat);
  }
}
function initDemoProcedure() {
  let proc = loadData(STORAGE_KEYS.PROCEDURE, []);
  if (proc.length === 0) {
    proc = [
      {
        id: "pr_" + Date.now(),
        icon: "💰",
        categoria: "Cassa",
        titolo: "Chiusura cassa",
        descrizione: "Passaggi rapidi per chiudere correttamente la cassa.",
        steps: [
          "Controlla contanti e POS.",
          "Stampa report di fine giornata.",
          "Annota eventuali differenze.",
          "Metti incassi dove previsto."
        ],
        nota: "Se manca qualcosa, avvisa subito il titolare."
      }
    ];
    saveData(STORAGE_KEYS.PROCEDURE, proc);
  }
}
function initPromoDemo() {
  let offerte = loadData(STORAGE_KEYS.OFFERTE, []);
  if (offerte.length === 0) {
    offerte = [
      { id: "off_" + Date.now(), nome: "Vitamina C 20% OFF", dal: todayISO(), al: todayISO(), note: "Solo fino a fine giornata!" }
    ];
    saveData(STORAGE_KEYS.OFFERTE, offerte);
  }
}

// ===== BOOT =====
document.addEventListener("DOMContentLoaded", () => {
  initDemoUsers();
  initConsumabiliCatalogo();
  initDemoProcedure();
  initPromoDemo();

  setupAuth();
  setupSidebar();
  setupTabs();
  setupFab();
  setupModalSystem();

  restorePhotoQ4();
  loginAs(null);
});

// ===== AUTH =====
function getAllUsers() {
  return loadData(STORAGE_KEYS.UTENTI, []);
}
function setupAuth() {
  const loginForm = document.getElementById("login-form");
  const btnDemo = document.getElementById("btn-demo-farmacia");
  const btnEsci = document.getElementById("btn-esci");

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = document.getElementById("login-username").value.trim();
      const password = document.getElementById("login-password").value.trim();
      const found = getAllUsers().find(u => u.username === username && u.password === password);
      if (!found) return alert("Credenziali non valide.");
      loginAs(found);
    });
  }

  if (btnDemo) {
    btnDemo.addEventListener("click", () => {
      const f = getAllUsers().find(u => u.username === "farmacia");
      if (f) loginAs(f);
    });
  }

  if (btnEsci) btnEsci.addEventListener("click", () => loginAs(null));
}

function loginAs(user) {
  currentUser = user;

  const viewAuth = document.getElementById("view-auth");
  const viewMobile = document.getElementById("view-mobile");
  const userLabel = document.getElementById("user-label");
  const topSubtitle = document.getElementById("topbar-subtitle");

  if (!user) {
    viewMobile?.classList.add("hidden");
    viewAuth?.classList.remove("hidden");
    if (userLabel) userLabel.textContent = "Ospite";
    if (topSubtitle) topSubtitle.textContent = "Accesso non effettuato";
    return;
  }

  viewAuth?.classList.add("hidden");
  viewMobile?.classList.remove("hidden");

  if (userLabel) userLabel.textContent = `${user.nome} (${user.ruolo})`;
  if (topSubtitle) topSubtitle.textContent = `Accesso come ${user.ruolo}`;

  // sidebar admin only
  const adminBox = document.getElementById("sidebar-admin-box");
  if (adminBox) adminBox.classList.toggle("hidden", user.ruolo !== "farmacia");

  // refresh
  updatePanoramica();
  setActiveTab("assenti");
}

// ===== SIDEBAR =====
function setupSidebar() {
  const btnHamb = document.getElementById("btn-hamburger");
  const sb = document.getElementById("sidebar");
  const bd = document.getElementById("sidebar-backdrop");
  const btnClose = document.getElementById("btn-sidebar-close");

  function openSidebar() {
    if (!sb || !bd) return;
    sb.classList.remove("hidden");
    bd.classList.remove("hidden");
    sb.setAttribute("aria-hidden", "false");
  }
  function closeSidebar() {
    if (!sb || !bd) return;
    sb.classList.add("hidden");
    bd.classList.add("hidden");
    sb.setAttribute("aria-hidden", "true");
  }

  btnHamb?.addEventListener("click", (e) => { e.stopPropagation(); openSidebar(); });
  btnClose?.addEventListener("click", closeSidebar);
  bd?.addEventListener("click", closeSidebar);

  document.querySelectorAll("[data-side-action]").forEach(btn => {
    btn.addEventListener("click", () => {
      const a = btn.getAttribute("data-side-action");
      if (a === "nuovo-dipendente") { closeSidebar(); return openModalNuovoDipendente(); }
      if (a === "carica-foto") return triggerUploadPhoto(closeSidebar);
      if (a === "rimuovi-foto") return removePhotoQ4(closeSidebar);
    });
  });
}

// ===== FOTO Q4 =====
function restorePhotoQ4() {
  const cover = document.getElementById("photo-cover");
  const placeholder = document.getElementById("photo-placeholder");
  const saved = loadData(STORAGE_KEYS.FOTO_Q4, null);
  if (!cover) return;
  if (saved) {
    cover.style.backgroundImage = `url(${saved})`;
    placeholder?.classList.add("hidden");
  } else {
    cover.style.backgroundImage = "";
    placeholder?.classList.remove("hidden");
  }
}
function triggerUploadPhoto(onDone) {
  const input = document.getElementById("photo-file");
  if (!input) return;
  input.value = "";
  input.click();
  input.onchange = () => {
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      saveData(STORAGE_KEYS.FOTO_Q4, reader.result);
      restorePhotoQ4();
      if (onDone) onDone();
    };
    reader.readAsDataURL(file);
  };
}
function removePhotoQ4(onDone) {
  saveData(STORAGE_KEYS.FOTO_Q4, null);
  restorePhotoQ4();
  if (onDone) onDone();
}

// ===== MODAL =====
function openModal(title, innerHtml, onReady) {
  const mb = document.getElementById("modal-backdrop");
  const mt = document.getElementById("modal-title");
  const body = document.getElementById("modal-body");
  if (!mb || !mt || !body) return;
  mt.textContent = title;
  body.innerHTML = innerHtml;
  mb.classList.remove("hidden");
  if (onReady) onReady();
}
function closeModal() {
  document.getElementById("modal-backdrop")?.classList.add("hidden");
}
function setupModalSystem() {
  const mb = document.getElementById("modal-backdrop");
  const mc = document.getElementById("modal-close");
  mc?.addEventListener("click", closeModal);
  mb?.addEventListener("click", (e) => { if (e.target === mb) closeModal(); });
}

// ===== TABS =====
let activeTab = "assenti";

function setupTabs() {
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const tab = btn.getAttribute("data-tab");
      setActiveTab(tab);
    });
  });

  const btnRefresh = document.getElementById("btn-refresh");
  btnRefresh?.addEventListener("click", () => {
    if (!currentUser) return;
    updatePanoramica();
    renderActiveTab();
  });
}

function setActiveTab(tab) {
  if (!currentUser) return;
  activeTab = tab;

  document.querySelectorAll(".tab-btn").forEach(b => {
    b.classList.toggle("active", b.getAttribute("data-tab") === tab);
  });

  const title = document.getElementById("tab-title");
  if (title) {
    title.textContent =
      tab === "assenti" ? "Assenze" :
      tab === "procedure" ? "Procedure" :
      tab === "consumabili" ? "Consumabili" :
      tab === "scadenze" ? "Scadenze" : "Sezione";
  }

  renderActiveTab();
}

function renderActiveTab() {
  if (activeTab === "assenti") return renderAssenzeList();
  if (activeTab === "procedure") return renderProcedureList();
  if (activeTab === "consumabili") return renderConsumabiliList();
  if (activeTab === "scadenze") return renderScadenzeList();
}

// ===== FAB (+) =====
function setupFab() {
  const fab = document.getElementById("fab");
  if (!fab) return;

  fab.addEventListener("click", () => {
    if (!currentUser) return alert("Devi effettuare il login.");

    // Action sheet semplice
    const html = `
      <div style="display:flex; flex-direction:column; gap:10px;">
        <button class="primary" id="act-assenza">🧑‍⚕️ Nuova richiesta assenza</button>
        <button class="primary" id="act-cons">🧻 Segnala consumabili (bassa/finito)</button>
        <button class="primary" id="act-scad">⏳ Nuove scadenze</button>
        <button class="primary" id="act-promo">🏷️ Nuova promozione</button>
        <button class="small-secondary" id="act-close">Chiudi</button>
      </div>
    `;
    openModal("Azioni rapide", html, () => {
      document.getElementById("act-assenza").onclick = () => { closeModal(); openModalRichiestaAssenza(); };
      document.getElementById("act-cons").onclick   = () => { closeModal(); openModalConsumabiliSwitch(); };
      document.getElementById("act-scad").onclick   = () => { closeModal(); openModalScadenzeWizard(); };
      document.getElementById("act-promo").onclick  = () => { closeModal(); openModalPromozione(); };
      document.getElementById("act-close").onclick  = closeModal;
    });
  });
}

// ===== PANORAMICA NUMERI =====
function updatePanoramica() {
  const oggi = todayISO();

  const assenze = loadData(STORAGE_KEYS.ASSENZE, []);
  const assenzeOggi = assenze.filter(a =>
    a.stato === "APPROVATA" && isDateInRange(oggi, a.dal, a.al)
  ).length;

  const groups = loadData(STORAGE_KEYS.SCADENZE, []);
  let scadEntro60 = 0;
  groups.forEach(g => {
    (g.items || []).forEach(it => {
      const diff = diffDays(oggi, it.dataScadenza);
      if (diff >= 0 && diff <= 60) scadEntro60++;
    });
  });

  const richiesteCons = loadData(STORAGE_KEYS.CONSUMABILI_RICHIESTE, []);
  const consAlert = richiesteCons.filter(r => r.stato !== "PROVVEDUTO").length;

  const offerte = loadData(STORAGE_KEYS.OFFERTE, []);
  const promoAttive = offerte.filter(o => isDateInRange(oggi, o.dal, o.al)).length;

  document.getElementById("val-assenze-oggi").textContent = assenzeOggi;
  document.getElementById("val-scadenze-60").textContent = scadEntro60;
  document.getElementById("val-consumabili-alert").textContent = consAlert;
  document.getElementById("val-promo-attive").textContent = promoAttive;
}

// ===============================
// ASSENZE
// ===============================
function badgeAssenza(stato) {
  if (stato === "APPROVATA") return `<span class="badge ok">APPROVATA</span>`;
  if (stato === "RIFIUTATA") return `<span class="badge no">RIFIUTATA</span>`;
  return `<span class="badge wait">IN ATTESA</span>`;
}
function canApproveAssenze() {
  return currentUser && (currentUser.ruolo === "titolare" || currentUser.ruolo === "farmacia");
}
function renderAssenzeList() {
  const wrap = document.getElementById("tab-content");
  const all = loadData(STORAGE_KEYS.ASSENZE, []).slice()
    .sort((a,b) => parseISO(b.dal) - parseISO(a.dal));

  if (!all.length) {
    wrap.innerHTML = `<p style="color:rgba(241,245,255,.72);">Nessuna richiesta inserita.</p>`;
    return;
  }

  let html = `<ul class="simple-list">`;
  all.forEach(a => {
    const periodo = `${formatDateShortIT(a.dal)} → ${formatDateShortIT(a.al)}`;
    const motiv = a.motivazioneTitolare ? `<div class="row-sub"><strong>Motivo:</strong> ${escapeHtml(a.motivazioneTitolare)}</div>` : "";
    html += `
      <li>
        <div class="row-main">
          <div class="row-title">${escapeHtml(a.nome)} – ${escapeHtml(a.tipo)}</div>
          <div class="row-sub"><strong>Inizio/Fine:</strong> ${periodo}</div>
          ${a.note ? `<div class="row-sub">${escapeHtml(a.note)}</div>` : ``}
          ${motiv}
        </div>
        <div class="row-actions">
          ${badgeAssenza(a.stato)}
          ${canApproveAssenze() && a.stato === "IN_ATTESA" ? `
            <button class="small-primary" data-accetta="${a.id}">Accetta</button>
            <button class="danger" data-rifiuta="${a.id}">Rifiuta</button>
          ` : ``}
        </div>
      </li>
    `;
  });
  html += `</ul>`;
  wrap.innerHTML = html;

  document.querySelectorAll("[data-accetta]").forEach(btn => {
    btn.addEventListener("click", () => openModalMotivoAssenza(btn.getAttribute("data-accetta"), true));
  });
  document.querySelectorAll("[data-rifiuta]").forEach(btn => {
    btn.addEventListener("click", () => openModalMotivoAssenza(btn.getAttribute("data-rifiuta"), false));
  });
}
function openModalMotivoAssenza(id, isApprove) {
  const html = `
    <form id="form-motivo-assenza">
      <label class="field">
        <span>Motivazione (opzionale)</span>
        <input type="text" id="motivo-assenza" placeholder="Es. manca copertura / ok / ecc." />
      </label>
      <button class="primary" type="submit">${isApprove ? "Conferma APPROVAZIONE" : "Conferma RIFIUTO"}</button>
    </form>
  `;
  openModal(isApprove ? "Approva richiesta" : "Rifiuta richiesta", html, () => {
    document.getElementById("form-motivo-assenza").addEventListener("submit", (e) => {
      e.preventDefault();
      const motivo = document.getElementById("motivo-assenza").value.trim();
      const all = loadData(STORAGE_KEYS.ASSENZE, []);
      const a = all.find(x => x.id === id);
      if (!a) return;

      a.stato = isApprove ? "APPROVATA" : "RIFIUTATA";
      a.motivazioneTitolare = motivo;
      a.tsDecisione = Date.now();

      saveData(STORAGE_KEYS.ASSENZE, all);
      closeModal();
      updatePanoramica();
      renderAssenzeList();
    });
  });
}
function openModalRichiestaAssenza() {
  const html = `
    <form id="form-richiesta-assenza">
      <label class="field">
        <span>Tipo</span>
        <select id="ass-tipo">
          <option value="Permesso">Permesso</option>
          <option value="Assenza">Assenza</option>
          <option value="Ferie">Ferie</option>
          <option value="Malattia">Malattia</option>
        </select>
      </label>
      <div class="inline-row">
        <label class="field">
          <span>Dal</span>
          <input type="date" id="ass-dal" />
        </label>
        <label class="field">
          <span>Al</span>
          <input type="date" id="ass-al" />
        </label>
      </div>
      <label class="field">
        <span>Nota (facoltativa)</span>
        <input type="text" id="ass-note" placeholder="Es. visita medica / urgenza..." />
      </label>
      <button class="primary" type="submit">Invia richiesta</button>
    </form>
  `;
  openModal("Nuova richiesta assenza", html, () => {
    document.getElementById("form-richiesta-assenza").addEventListener("submit", (e) => {
      e.preventDefault();
      const tipo = document.getElementById("ass-tipo").value;
      const dal = document.getElementById("ass-dal").value;
      const al = document.getElementById("ass-al").value;
      const note = document.getElementById("ass-note").value.trim();
      if (!dal || !al) return alert("Seleziona dal/al.");

      const all = loadData(STORAGE_KEYS.ASSENZE, []);
      all.push({
        id: "ass_" + Date.now(),
        nome: currentUser.nome,
        username: currentUser.username,
        tipo, dal, al, note,
        stato: "IN_ATTESA",
        motivazioneTitolare: "",
        tsRichiesta: Date.now()
      });
      saveData(STORAGE_KEYS.ASSENZE, all);
      closeModal();
      updatePanoramica();
      renderAssenzeList();
      setActiveTab("assenti");
    });
  });
}

// ===============================
// CONSUMABILI
// ===============================
function canMarkProvveduto() {
  return currentUser && (currentUser.ruolo === "titolare" || currentUser.ruolo === "farmacia");
}
function openModalConsumabiliSwitch() {
  const catalogo = loadData(STORAGE_KEYS.CONSUMABILI_CATALOGO, []);
  const richieste = loadData(STORAGE_KEYS.CONSUMABILI_RICHIESTE, []);
  const activeSet = new Set(richieste.filter(r => r.stato !== "PROVVEDUTO").map(r => r.nome));

  let html = `
    <div class="hint-text" style="color:rgba(241,245,255,.72); font-weight:900;">
      Seleziona quelli <strong>FINITI o BASSI</strong> (switch rosso = richiesta)
    </div>
    <div style="margin-top:10px;">
      <ul class="simple-list">
  `;

  catalogo.forEach(nome => {
    const isOn = activeSet.has(nome);
    html += `
      <li class="c-item">
        <div class="c-left">
          <div class="c-name">${escapeHtml(nome)}</div>
          <div class="c-meta">Tocca lo switch per richiedere</div>
        </div>

        <label class="c-switch">
          <input type="checkbox" class="c-toggle" data-cons="${escapeHtml(nome)}" ${isOn ? "checked" : ""}>
          <span class="c-slider"></span>
        </label>
      </li>
    `;
  });

  html += `
      </ul>
    </div>

    <hr style="opacity:.2;margin:12px 0;">

    <form id="form-cons-add">
      <label class="field">
        <span>Aggiungi consumabile (se non presente)</span>
        <input type="text" id="cons-new-name" placeholder="Es. Rotoli POS..." />
      </label>
      <button class="small-secondary" type="submit">Aggiungi al catalogo</button>
    </form>
  `;

  openModal("Segnala consumabili", html, () => {
    document.querySelectorAll(".c-toggle").forEach((el) => {
      el.addEventListener("change", () => {
        const nome = el.getAttribute("data-cons");
        let richiesteAll = loadData(STORAGE_KEYS.CONSUMABILI_RICHIESTE, []);

        if (el.checked) {
          const esisteAttiva = richiesteAll.some((r) => r.nome === nome && r.stato !== "PROVVEDUTO");
          if (!esisteAttiva) {
            richiesteAll.push({
              id: "consreq_" + Date.now(),
              nome,
              livello: "BASSA",
              note: "",
              richiestoDa: currentUser?.nome || "Sconosciuto",
              username: currentUser?.username || "",
              ts: Date.now(),
              stato: "IN_RICHIESTA"
            });
          }
        } else {
          richiesteAll = richiesteAll.filter((r) => !(r.nome === nome && r.stato !== "PROVVEDUTO"));
        }

        saveData(STORAGE_KEYS.CONSUMABILI_RICHIESTE, richiesteAll);
        updatePanoramica();
      });
    });

    const formAdd = document.getElementById("form-cons-add");
    formAdd?.addEventListener("submit", (e) => {
      e.preventDefault();
      const inp = document.getElementById("cons-new-name");
      const nuovo = (inp?.value || "").trim();
      if (!nuovo) return;

      let cat = loadData(STORAGE_KEYS.CONSUMABILI_CATALOGO, []);
      if (!cat.includes(nuovo)) {
        cat.push(nuovo);
        cat = cat.sort((a, b) => a.localeCompare(b, "it"));
        saveData(STORAGE_KEYS.CONSUMABILI_CATALOGO, cat);
      }
      closeModal();
      openModalConsumabiliSwitch();
    });
  });
}

function renderConsumabiliList() {
  const wrap = document.getElementById("tab-content");
  const richieste = loadData(STORAGE_KEYS.CONSUMABILI_RICHIESTE, [])
    .filter(r => r.stato !== "PROVVEDUTO" && r.stato !== "ANNULLATA")
    .sort((a,b) => b.ts - a.ts);

  if (!richieste.length) {
    wrap.innerHTML = `<p style="color:rgba(241,245,255,.72);">Nessuna richiesta consumabili attiva.</p>`;
    return;
  }

  let html = `<ul class="simple-list">`;
  richieste.forEach(r => {
    const dt = new Date(r.ts);
    const dd = String(dt.getDate()).padStart(2,"0");
    const mm = String(dt.getMonth()+1).padStart(2,"0");
    const yy = dt.getFullYear();
    const hh = String(dt.getHours()).padStart(2,"0");
    const mi = String(dt.getMinutes()).padStart(2,"0");

    html += `
      <li>
        <div class="row-main">
          <div class="row-title">${escapeHtml(r.nome)}</div>
          <div class="row-sub"><strong>Richiesto da:</strong> ${escapeHtml(r.richiestoDa || "—")} · ${dd}/${mm}/${yy} ${hh}:${mi}</div>
          ${r.note ? `<div class="row-sub"><strong>Nota:</strong> ${escapeHtml(r.note)}</div>` : ``}
        </div>
        <div class="row-actions">
          <span class="badge wait">IN RICHIESTA</span>
          ${canMarkProvveduto() ? `<button class="small-primary" data-prov="${r.id}">Provveduto</button>` : ``}
        </div>
      </li>
    `;
  });
  html += `</ul>`;
  wrap.innerHTML = html;

  document.querySelectorAll("[data-prov]").forEach(btn => {
    btn.addEventListener("click", () => markConsumabileProvveduto(btn.getAttribute("data-prov")));
  });
}

function markConsumabileProvveduto(id) {
  const richieste = loadData(STORAGE_KEYS.CONSUMABILI_RICHIESTE, []);
  const r = richieste.find(x => x.id === id);
  if (!r) return;
  r.stato = "PROVVEDUTO";
  r.tsProvveduto = Date.now();
  r.provvedutoDa = currentUser?.nome || "—";
  saveData(STORAGE_KEYS.CONSUMABILI_RICHIESTE, richieste);

  updatePanoramica();
  renderConsumabiliList();
}

// ===============================
// PROMO (solo modal via FAB)
// ===============================
function openModalPromozione(existingId) {
  let offerte = loadData(STORAGE_KEYS.OFFERTE, []);
  let off = existingId ? offerte.find(x => x.id === existingId) : null;

  const html = `
    <form id="form-promo">
      <label class="field">
        <span>Nome promozione</span>
        <input type="text" id="p-nome" value="${off ? escapeHtml(off.nome) : ""}" />
      </label>
      <div class="inline-row">
        <label class="field">
          <span>Dal</span>
          <input type="date" id="p-dal" value="${off ? off.dal : ""}" />
        </label>
        <label class="field">
          <span>Al</span>
          <input type="date" id="p-al" value="${off ? off.al : ""}" />
        </label>
      </div>
      <label class="field">
        <span>Note</span>
        <input type="text" id="p-note" value="${off ? escapeHtml(off.note || "") : ""}" />
      </label>
      <button class="primary" type="submit">${off ? "Salva modifiche" : "Crea promozione"}</button>
    </form>
  `;
  openModal(off ? "Modifica promozione" : "Nuova promozione", html, () => {
    document.getElementById("form-promo").addEventListener("submit", (e) => {
      e.preventDefault();
      const nome = document.getElementById("p-nome").value.trim();
      const dal = document.getElementById("p-dal").value;
      const al  = document.getElementById("p-al").value;
      const note = document.getElementById("p-note").value.trim();
      if (!nome || !dal || !al) return alert("Compila nome + dal + al.");

      let all = loadData(STORAGE_KEYS.OFFERTE, []);
      if (off) {
        off.nome = nome; off.dal = dal; off.al = al; off.note = note;
      } else {
        all.push({ id: "off_" + Date.now(), nome, dal, al, note });
      }
      saveData(STORAGE_KEYS.OFFERTE, all);
      closeModal();
      updatePanoramica();
    });
  });
}

// ===============================
// SCADENZE (wizard + lista mesi)
// ===============================
function ymKeyFromISO(iso) { const [y, m] = iso.split("-"); return `${y}-${m}`; }
function ymLabel(ym) {
  const [y, m] = ym.split("-");
  const monthNames = ["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"];
  return `${monthNames[Number(m)-1]} ${y}`;
}
function ymSort(a, b) { return a.localeCompare(b); }

function openModalScadenzeWizard() {
  const groups = loadData(STORAGE_KEYS.SCADENZE, []);
  const yms = [...new Set(groups.map(g => g.ym))].sort(ymSort);

  let options = `<option value="">— Seleziona —</option>`;
  yms.forEach(ym => options += `<option value="${ym}">${ymLabel(ym)}</option>`);

  const html = `
    <form id="form-scad-step1">
      <label class="field">
        <span>Mese/Anno</span>
        <select id="scad-ym">${options}</select>
      </label>

      <label class="field">
        <span>Oppure crea nuovo (mese)</span>
        <input type="month" id="scad-new-ym" />
      </label>

      <button class="primary" type="submit">Avanti</button>
    </form>
  `;

  openModal("Nuova scadenza", html, () => {
    document.getElementById("form-scad-step1").addEventListener("submit", (e) => {
      e.preventDefault();
      const sel = document.getElementById("scad-ym").value;
      const newYm = document.getElementById("scad-new-ym").value;
      const ym = newYm || sel;
      if (!ym) return alert("Seleziona o crea un mese/anno.");
      openModalScadenzeRighe(ym);
    });
  });
}

function scadRowHtml(nome, pezzi, minsan) {
  return `
    <div class="inline-row" style="align-items:flex-end;">
      <label class="field">
        <span>Nome prodotto</span>
        <input type="text" class="scad-name" value="${escapeHtml(nome)}" />
      </label>
      <label class="field" style="max-width:110px;">
        <span>Pezzi</span>
        <input type="number" min="1" class="scad-pcs" value="${escapeHtml(pezzi)}" />
      </label>
      <label class="field" style="max-width:150px;">
        <span>Minsan (opz.)</span>
        <input type="text" class="scad-minsan" value="${escapeHtml(minsan)}" />
      </label>
    </div>
  `;
}

function openModalScadenzeRighe(ym) {
  const html = `
    <form id="form-scad-step2">
      <p style="color:rgba(241,245,255,.72); font-weight:900;">
        ${ymLabel(ym)} – Inserisci i prodotti (nome, pezzi, minsan opzionale).
      </p>

      <div id="scad-rows">${scadRowHtml("", "", "")}</div>

      <button class="small-secondary" type="button" id="btn-add-row">+ AGGIUNGI RIGA</button>
      <button class="primary" type="submit">Salva</button>
    </form>
  `;
  openModal("Scadenze prodotti", html, () => {
    const rows = document.getElementById("scad-rows");
    document.getElementById("btn-add-row").addEventListener("click", () => {
      rows.insertAdjacentHTML("beforeend", scadRowHtml("", "", ""));
    });

    document.getElementById("form-scad-step2").addEventListener("submit", (e) => {
      e.preventDefault();
      const names = Array.from(document.querySelectorAll(".scad-name"));
      const pcs   = Array.from(document.querySelectorAll(".scad-pcs"));
      const mins  = Array.from(document.querySelectorAll(".scad-minsan"));

      const items = [];
      for (let i = 0; i < names.length; i++) {
        const nome = names[i].value.trim();
        const pezzi = Number(pcs[i].value || 0);
        const minsan = mins[i].value.trim();
        if (!nome || !pezzi) continue;

        const [y, m] = ym.split("-");
        const iso = `${y}-${m}-28`;
        items.push({ id: "si_" + Date.now() + "_" + i, nome, pezzi, minsan, dataScadenza: iso });
      }
      if (!items.length) return alert("Inserisci almeno 1 riga valida (nome + pezzi).");

      let groups = loadData(STORAGE_KEYS.SCADENZE, []);
      let g = groups.find(x => x.ym === ym);
      if (!g) { g = { id: "sg_" + Date.now(), ym, items: [] }; groups.push(g); }
      g.items.push(...items);
      g.items.sort((a,b) => a.nome.localeCompare(b.nome, "it"));
      groups.sort((a,b) => ymSort(a.ym, b.ym));
      saveData(STORAGE_KEYS.SCADENZE, groups);

      closeModal();
      updatePanoramica();
      renderScadenzeList();
      setActiveTab("scadenze");
    });
  });
}

function renderScadenzeList() {
  const wrap = document.getElementById("tab-content");
  const groups = loadData(STORAGE_KEYS.SCADENZE, []).slice().sort((a,b) => ymSort(a.ym, b.ym));

  if (!groups.length) {
    wrap.innerHTML = `<p style="color:rgba(241,245,255,.72);">Nessuna scadenza registrata.</p>`;
    return;
  }

  let html = `<ul class="simple-list">`;
  groups.forEach(g => {
    html += `
      <li>
        <div class="row-main">
          <div class="row-title">${ymLabel(g.ym)}</div>
          <div class="row-sub">${(g.items || []).length} prodotto/i</div>
        </div>
        <div class="row-actions">
          <button class="small-primary" data-open-ym="${g.ym}">Apri</button>
          <button class="danger" data-del-ym="${g.ym}">Elimina</button>
        </div>
      </li>
    `;
  });
  html += `</ul>`;
  wrap.innerHTML = html;

  document.querySelectorAll("[data-open-ym]").forEach(btn => {
    btn.addEventListener("click", () => openScadenzeMese(btn.getAttribute("data-open-ym")));
  });
  document.querySelectorAll("[data-del-ym]").forEach(btn => {
    btn.addEventListener("click", () => {
      const ym = btn.getAttribute("data-del-ym");
      if (!confirm(`Eliminare tutte le scadenze di ${ymLabel(ym)}?`)) return;
      let gs = loadData(STORAGE_KEYS.SCADENZE, []);
      gs = gs.filter(x => x.ym !== ym);
      saveData(STORAGE_KEYS.SCADENZE, gs);
      updatePanoramica();
      renderScadenzeList();
    });
  });
}

function openScadenzeMese(ym) {
  const groups = loadData(STORAGE_KEYS.SCADENZE, []);
  const g = groups.find(x => x.ym === ym);
  if (!g) return;

  let html = `<ul class="simple-list">`;
  (g.items || [])
    .slice()
    .sort((a,b) => a.nome.localeCompare(b.nome,"it"))
    .forEach(it => {
      html += `
        <li>
          <div class="row-main">
            <div class="row-title">${escapeHtml(it.nome)} <span class="badge yes">${it.pezzi} pz</span></div>
            <div class="row-sub">${it.minsan ? `Minsan: ${escapeHtml(it.minsan)}` : `Minsan: —`}</div>
          </div>
          <div class="row-actions">
            <button class="danger" data-del-item="${it.id}">Rimuovi</button>
          </div>
        </li>
      `;
    });
  html += `</ul>`;

  openModal(`Scadenze – ${ymLabel(ym)}`, `
    <div style="display:flex; gap:10px; margin-bottom:10px;">
      <button class="small-secondary" id="btn-add-to-ym" type="button">+ Aggiungi prodotti</button>
      <button class="small-secondary" id="btn-close-scad" type="button">Chiudi</button>
    </div>
    ${html}
  `, () => {
    document.getElementById("btn-add-to-ym").onclick = () => { closeModal(); openModalScadenzeRighe(ym); };
    document.getElementById("btn-close-scad").onclick = closeModal;

    document.querySelectorAll("[data-del-item]").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-del-item");
        let gs = loadData(STORAGE_KEYS.SCADENZE, []);
        const gg = gs.find(x => x.ym === ym);
        if (!gg) return;
        gg.items = (gg.items || []).filter(x => x.id !== id);
        saveData(STORAGE_KEYS.SCADENZE, gs);
        updatePanoramica();
        closeModal();
        openScadenzeMese(ym);
      });
    });
  });
}

// ===============================
// PROCEDURE
// ===============================
function renderProcedureList() {
  const wrap = document.getElementById("tab-content");
  const procs = loadData(STORAGE_KEYS.PROCEDURE, []);

  if (!procs.length) {
    wrap.innerHTML = `
      <p style="color:rgba(241,245,255,.72);">Nessuna procedura salvata.</p>
      <button class="small-primary" id="btn-add-proc" type="button">+ Aggiungi procedura</button>
    `;
    document.getElementById("btn-add-proc").onclick = () => openModalProcedureManager();
    return;
  }

  let html = `<ul class="simple-list">`;
  procs.forEach(p => {
    html += `
      <li>
        <div class="row-main">
          <div class="row-title">${escapeHtml(p.icon || "📄")} ${escapeHtml(p.titolo || "")}</div>
          <div class="row-sub">${escapeHtml(p.categoria || "Procedura")}</div>
        </div>
        <div class="row-actions">
          <button class="small-primary" data-open-proc="${p.id}">Apri</button>
          <button class="small-secondary" data-edit-proc="${p.id}">Modifica</button>
        </div>
      </li>
    `;
  });
  html += `</ul>`;
  wrap.innerHTML = html;

  document.querySelectorAll("[data-open-proc]").forEach(btn => {
    btn.addEventListener("click", () => openProcedureDetail(btn.getAttribute("data-open-proc")));
  });
  document.querySelectorAll("[data-edit-proc]").forEach(btn => {
    btn.addEventListener("click", () => openModalProcedureManager(btn.getAttribute("data-edit-proc")));
  });
}

function openProcedureDetail(procId) {
  const procs = loadData(STORAGE_KEYS.PROCEDURE, []);
  const p = procs.find(x => x.id === procId);
  if (!p) return;

  const steps = Array.isArray(p.steps) ? p.steps : [];
  const stepsHtml = steps.length
    ? `<ol style="margin:0; padding-left:18px;">${steps.map(s => `<li style="margin:6px 0;">${escapeHtml(s)}</li>`).join("")}</ol>`
    : `<p style="color:rgba(241,245,255,.72);">Nessun passaggio inserito.</p>`;

  openModal("Procedura", `
    <div style="display:flex; flex-direction:column; gap:10px;">
      <div style="font-weight:900; font-size:1.05rem;">${escapeHtml(p.icon || "📄")} ${escapeHtml(p.titolo || "")}</div>
      ${p.descrizione ? `<div style="color:rgba(241,245,255,.72);">${escapeHtml(p.descrizione)}</div>` : ``}
      ${stepsHtml}
      ${p.nota ? `<div class="badge yes" style="padding:10px 12px;">💡 ${escapeHtml(p.nota)}</div>` : ``}
      <div style="display:flex; gap:10px; flex-wrap:wrap;">
        <button class="small-secondary" id="btn-close-proc">Chiudi</button>
        <button class="small-primary" id="btn-edit-proc2">Modifica</button>
        <button class="danger" id="btn-del-proc">Elimina</button>
      </div>
    </div>
  `, () => {
    document.getElementById("btn-close-proc").onclick = closeModal;
    document.getElementById("btn-edit-proc2").onclick = () => { closeModal(); openModalProcedureManager(procId); };
    document.getElementById("btn-del-proc").onclick = () => {
      if (!confirm("Eliminare questa procedura?")) return;
      let all = loadData(STORAGE_KEYS.PROCEDURE, []);
      all = all.filter(x => x.id !== procId);
      saveData(STORAGE_KEYS.PROCEDURE, all);
      closeModal();
      renderProcedureList();
    };
  });
}

function openModalProcedureManager(editId) {
  const procs = loadData(STORAGE_KEYS.PROCEDURE, []);
  let p = editId ? procs.find(x => x.id === editId) : null;
  const steps = p?.steps?.join("\n") || "";

  const html = `
    <form id="form-proc">
      <div class="inline-row">
        <label class="field">
          <span>Icona (emoji)</span>
          <input type="text" id="pr-ico" value="${p ? escapeHtml(p.icon || "📄") : "📄"}" />
        </label>
        <label class="field">
          <span>Categoria</span>
          <input type="text" id="pr-cat" value="${p ? escapeHtml(p.categoria || "") : ""}" placeholder="Es. Cassa / Magazzino" />
        </label>
      </div>

      <label class="field">
        <span>Nome procedura</span>
        <input type="text" id="pr-title" value="${p ? escapeHtml(p.titolo || "") : ""}" />
      </label>

      <label class="field">
        <span>Descrizione breve (facoltativa)</span>
        <input type="text" id="pr-desc" value="${p ? escapeHtml(p.descrizione || "") : ""}" />
      </label>

      <label class="field">
        <span>Passaggi (uno per riga)</span>
        <textarea id="pr-steps" placeholder="1) ...&#10;2) ...">${escapeHtml(steps)}</textarea>
      </label>

      <label class="field">
        <span>Nota evidenziata (facoltativa)</span>
        <input type="text" id="pr-note" value="${p ? escapeHtml(p.nota || "") : ""}" />
      </label>

      <button class="primary" type="submit">${p ? "Salva modifiche" : "Crea procedura"}</button>
    </form>
  `;

  openModal(p ? "Modifica procedura" : "Nuova procedura", html, () => {
    document.getElementById("form-proc").addEventListener("submit", (e) => {
      e.preventDefault();
      const icon = document.getElementById("pr-ico").value.trim() || "📄";
      const categoria = document.getElementById("pr-cat").value.trim();
      const titolo = document.getElementById("pr-title").value.trim();
      const descrizione = document.getElementById("pr-desc").value.trim();
      const stepsRaw = document.getElementById("pr-steps").value.split("\n").map(x => x.trim()).filter(Boolean);
      const nota = document.getElementById("pr-note").value.trim();
      if (!titolo) return alert("Inserisci il nome della procedura.");

      let all = loadData(STORAGE_KEYS.PROCEDURE, []);
      if (p) {
        p.icon = icon; p.categoria = categoria; p.titolo = titolo;
        p.descrizione = descrizione; p.steps = stepsRaw; p.nota = nota;
      } else {
        all.push({ id: "pr_" + Date.now(), icon, categoria, titolo, descrizione, steps: stepsRaw, nota });
      }
      saveData(STORAGE_KEYS.PROCEDURE, all);
      closeModal();
      renderProcedureList();
    });
  });
}

// ===============================
// DIPENDENTI (solo farmacia)
// ===============================
function openModalNuovoDipendente() {
  if (!currentUser || currentUser.ruolo !== "farmacia") return alert("Solo la Farmacia può creare utenti dipendente.");

  const html = `
    <form id="form-new-emp">
      <label class="field">
        <span>Nome e cognome</span>
        <input type="text" id="ne-nome" placeholder="Es. Rossi Mario" />
      </label>
      <div class="inline-row">
        <label class="field">
          <span>Username</span>
          <input type="text" id="ne-user" placeholder="Es. rossi" />
        </label>
        <label class="field">
          <span>Password</span>
          <input type="text" id="ne-pass" placeholder="Es. 1234" />
        </label>
      </div>
      <button class="primary" type="submit">Crea utente</button>
    </form>
    <p style="color:rgba(241,245,255,.72); margin-top:8px;">
      L’utente potrà fare login con le credenziali create qui.
    </p>
  `;
  openModal("Crea utente dipendente", html, () => {
    document.getElementById("form-new-emp").addEventListener("submit", (e) => {
      e.preventDefault();
      const nome = document.getElementById("ne-nome").value.trim();
      const username = document.getElementById("ne-user").value.trim();
      const password = document.getElementById("ne-pass").value.trim();
      if (!nome || !username || !password) return alert("Compila tutti i campi.");

      let users = loadData(STORAGE_KEYS.UTENTI, []);
      if (users.some(u => u.username === username)) return alert("Username già esistente.");

      users.push({ username, password, ruolo: "dipendente", nome, telefono: "", email: "" });
      saveData(STORAGE_KEYS.UTENTI, users);

      closeModal();
      alert("Dipendente creato ✅");
    });
  });
}
