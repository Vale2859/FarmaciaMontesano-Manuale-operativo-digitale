// ===== STATO =====
let currentUser = null;
let panoramicaTimer = null;

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

// ===== HTML ESCAPE =====
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
function unescapeHtml(str) {
  return String(str)
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#039;", "'")
    .replaceAll("&amp;", "&");
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
      "Rotoli POS",
      "Rotoli Cassa",
      "Carta igienica",
      "Carta stampante",
      "Toner Brother",
      "Toner Xerox (Nero)",
      "Toner Xerox (Giallo)",
      "Toner Xerox (Blu)",
      "Toner Xerox (Rosso)",
      "Rotoloni"
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
  setupQuickMenu();
  setupDashboard();
  setupModalSystem();
  setupPanoramaClicks();

  restorePhotoQ4();
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

      const all = getAllUsers();
      const found = all.find(u => u.username === username && u.password === password);
      if (!found) return alert("Credenziali non valide.");
      loginAs(found);
    });
  }

  if (btnDemo) {
    btnDemo.addEventListener("click", () => {
      const all = getAllUsers();
      const f = all.find(u => u.username === "farmacia");
      if (f) loginAs(f);
    });
  }

  if (btnEsci) {
    btnEsci.addEventListener("click", () => loginAs(null));
  }

  loginAs(null);
}

function loginAs(user) {
  currentUser = user;

  const viewAuth = document.getElementById("view-auth");
  const viewDash = document.getElementById("view-dashboard");
  const userLabel = document.getElementById("user-label");
  const topSubtitle = document.getElementById("topbar-subtitle");

  if (!user) {
    if (viewDash) viewDash.classList.add("hidden");
    if (viewAuth) viewAuth.classList.remove("hidden");
    if (userLabel) userLabel.textContent = "Ospite";
    if (topSubtitle) topSubtitle.textContent = "Accesso non effettuato";
    return;
  }

  if (viewAuth) viewAuth.classList.add("hidden");
  if (viewDash) viewDash.classList.remove("hidden");

  if (userLabel) userLabel.textContent = `${user.nome} (${user.ruolo})`;
  if (topSubtitle) topSubtitle.textContent = `Accesso come ${user.ruolo}`;

  // sidebar: mostra gestione dipendenti solo farmacia
  const adminBox = document.getElementById("sidebar-admin-box");
  if (adminBox) adminBox.classList.toggle("hidden", user.ruolo !== "farmacia");

  // refresh
  updatePanoramica();
  renderPromo();
  showPanoramica();
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

  if (btnHamb) btnHamb.addEventListener("click", (e) => {
    e.stopPropagation();
    openSidebar();
  });
  if (btnClose) btnClose.addEventListener("click", closeSidebar);
  if (bd) bd.addEventListener("click", closeSidebar);

  document.querySelectorAll("[data-side-action]").forEach(btn => {
    btn.addEventListener("click", () => {
      const a = btn.getAttribute("data-side-action");
      if (a === "nuovo-dipendente") return openModalNuovoDipendente();
      if (a === "carica-foto") return triggerUploadPhoto();
      if (a === "rimuovi-foto") return removePhotoQ4();
    });
  });
}

function closeSidebarHard() {
  const sb = document.getElementById("sidebar");
  const bd = document.getElementById("sidebar-backdrop");
  if (sb) sb.classList.add("hidden");
  if (bd) bd.classList.add("hidden");
}

// ===== FOTO Q4 =====
function restorePhotoQ4() {
  const cover = document.getElementById("photo-cover");
  const placeholder = document.getElementById("photo-placeholder");
  const saved = loadData(STORAGE_KEYS.FOTO_Q4, null);
  if (!cover) return;
  if (saved) {
    cover.style.backgroundImage = `url(${saved})`;
    if (placeholder) placeholder.classList.add("hidden");
  } else {
    cover.style.backgroundImage = "";
    if (placeholder) placeholder.classList.remove("hidden");
  }
}

function triggerUploadPhoto() {
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
      closeSidebarHard();
    };
    reader.readAsDataURL(file);
  };
}

function removePhotoQ4() {
  saveData(STORAGE_KEYS.FOTO_Q4, null);
  restorePhotoQ4();
  closeSidebarHard();
}

// ===== MODALE GENERICA =====
function setupModalSystem() {
  const mb = document.getElementById("modal-backdrop");
  const mc = document.getElementById("modal-close");
  if (mc) mc.addEventListener("click", closeModal);
  if (mb) mb.addEventListener("click", (e) => { if (e.target === mb) closeModal(); });
}

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
  const mb = document.getElementById("modal-backdrop");
  if (mb) mb.classList.add("hidden");
}

// ===== PANORAMICA TIMER =====
function resetPanoramicaTimer() {
  if (panoramicaTimer) clearTimeout(panoramicaTimer);
  panoramicaTimer = setTimeout(() => showPanoramica(), 20000);
}
function showPanoramica() {
  const pano = document.getElementById("panoramica-box");
  const det = document.getElementById("sezione-dettaglio");
  if (!pano || !det) return;
  pano.classList.remove("hidden");
  det.classList.add("hidden");
}
function showSezioneDettaglio(title, html) {
  const pano = document.getElementById("panoramica-box");
  const det = document.getElementById("sezione-dettaglio");
  const detTitle = document.getElementById("detail-title");
  const detBody = document.getElementById("detail-content");
  if (!pano || !det || !detTitle || !detBody) return;

  detTitle.textContent = title;
  detBody.innerHTML = html;

  pano.classList.add("hidden");
  det.classList.remove("hidden");
  resetPanoramicaTimer();
}

// ===== DASHBOARD =====
function setupDashboard() {
  const btnBack = document.getElementById("btn-back-panorama");
  if (btnBack) btnBack.addEventListener("click", showPanoramica);

  document.querySelectorAll(".sec-card").forEach(btn => {
    btn.addEventListener("click", () => {
      const sec = btn.getAttribute("data-section");
      openSection(sec);
    });
  });
}

function openSection(sec) {
  if (sec === "assenti") return renderAssenzeDettaglio();
  if (sec === "procedure") return renderProcedureGrid();
  if (sec === "consumabili") return renderConsumabiliRichieste();
  if (sec === "scadenze") return renderScadenzeGruppi();
}

// ===== QUICK (+) =====
function setupQuickMenu() {
  const quickBtn = document.getElementById("quick-btn");
  const quickMenu = document.getElementById("quick-menu");
  if (!quickBtn || !quickMenu) return;

  quickBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    quickMenu.classList.toggle("hidden");
    quickBtn.classList.toggle("open");
  });

  document.addEventListener("click", () => {
    quickMenu.classList.add("hidden");
    quickBtn.classList.remove("open");
  });

  quickMenu.querySelectorAll(".qm-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const action = btn.getAttribute("data-action");
      quickMenu.classList.add("hidden");
      quickBtn.classList.remove("open");

      if (!currentUser) return alert("Devi effettuare il login.");

      if (action === "richiesta-assenza") return openModalRichiestaAssenza();
      if (action === "richiesta-consumabile") return openModalConsumabiliSwitch();
      if (action === "nuova-promozione") return openModalPromozione();
      if (action === "nuova-scadenza") return openModalScadenzeWizard();
      if (action === "procedure-manager") return openModalProcedureManager();
    });
  });
}

// ===== PANORAMICA NUMERI =====
function updatePanoramica() {
  const oggi = todayISO();

  // assenze approvate che includono oggi
  const assenze = loadData(STORAGE_KEYS.ASSENZE, []);
  const assenzeOggi = assenze.filter(a =>
    a.stato === "APPROVATA" && isDateInRange(oggi, a.dal, a.al)
  ).length;

  // scadenze entro 60gg
  const groups = loadData(STORAGE_KEYS.SCADENZE, []);
  let scadEntro60 = 0;
  groups.forEach(g => {
    (g.items || []).forEach(it => {
      const diff = diffDays(oggi, it.dataScadenza);
      if (diff >= 0 && diff <= 60) scadEntro60++;
    });
  });

  // consumabili alert (non provvedute)
  const richiesteCons = loadData(STORAGE_KEYS.CONSUMABILI_RICHIESTE, []);
  const consAlert = richiesteCons.filter(r => r.stato !== "PROVVEDUTO").length;

  // promo attive
  const offerte = loadData(STORAGE_KEYS.OFFERTE, []);
  const promoAttive = offerte.filter(o => isDateInRange(oggi, o.dal, o.al)).length;

  const elA = document.getElementById("val-assenze-oggi");
  const elS = document.getElementById("val-scadenze-60");
  const elC = document.getElementById("val-consumabili-alert");
  const elP = document.getElementById("val-promo-attive");
  if (elA) elA.textContent = assenzeOggi;
  if (elS) elS.textContent = scadEntro60;
  if (elC) elC.textContent = consAlert;
  if (elP) elP.textContent = promoAttive;
}

// =====================================================
// ✅ TILE PANORAMICA CLICKABILI (come mi hai chiesto)
// =====================================================
function setupPanoramaClicks() {
  document.querySelectorAll("[data-pan]").forEach(btn => {
    btn.addEventListener("click", () => {
      if (!currentUser) return alert("Devi effettuare il login.");

      const key = btn.getAttribute("data-pan");

      if (key === "assenti") return renderAssenzeDettaglio();
      if (key === "consumabili") return renderConsumabiliRichieste();
      if (key === "scadenze60") return openScadenzeEntro60Modal();
      if (key === "promozioni") return openPromoCenterModal();
    });
  });
}

function openPromoCenterModal() {
  const oggi = todayISO();
  const offerte = loadData(STORAGE_KEYS.OFFERTE, []).slice();

  const attive = offerte.filter(o => isDateInRange(oggi, o.dal, o.al))
    .sort((a,b) => parseISO(a.al) - parseISO(b.al));
  const scadute = offerte.filter(o => parseISO(o.al) < parseISO(oggi))
    .sort((a,b) => parseISO(b.al) - parseISO(a.al));

  const canEdit = currentUser && (currentUser.ruolo === "farmacia" || currentUser.ruolo === "titolare");

  const listHtml = (arr, emptyText) => {
    if (!arr.length) return `<p class="hint-text">${emptyText}</p>`;
    let h = `<ul class="simple-list">`;
    arr.forEach(o => {
      h += `
        <li>
          <div class="row-main">
            <span class="row-title">${escapeHtml(o.nome)}</span>
            <span class="row-sub"><strong>Periodo:</strong> ${formatDateShortIT(o.dal)} → ${formatDateShortIT(o.al)}</span>
            ${o.note ? `<span class="row-sub">${escapeHtml(o.note)}</span>` : ``}
          </div>
          <div class="row-actions">
            <span class="badge ${isDateInRange(oggi, o.dal, o.al) ? "yes" : "wait"}">${isDateInRange(oggi, o.dal, o.al) ? "ATTIVA" : "SCADUTA"}</span>
            ${canEdit ? `
              <button class="small-secondary" data-edit-promo="${o.id}">Modifica</button>
              <button class="danger" data-del-promo="${o.id}">Elimina</button>
            ` : ``}
          </div>
        </li>
      `;
    });
    h += `</ul>`;
    return h;
  };

  const html = `
    <div class="inline-row" style="flex-wrap:wrap;">
      <button class="primary" id="btn-new-promo" type="button">+ Nuova promozione</button>
      <button class="small-secondary" id="btn-close-promo" type="button">Chiudi</button>
    </div>

    <h4 style="margin:12px 0 8px; font-weight:900;">Attive</h4>
    ${listHtml(attive, "Nessuna promozione attiva.")}

    <h4 style="margin:14px 0 8px; font-weight:900;">Scadute</h4>
    ${listHtml(scadute, "Nessuna promozione scaduta.")}
  `;

  openModal("Promozioni", html, () => {
    document.getElementById("btn-new-promo").onclick = () => { closeModal(); openModalPromozione(); };
    document.getElementById("btn-close-promo").onclick = closeModal;

    document.querySelectorAll("[data-edit-promo]").forEach(b => {
      b.addEventListener("click", () => {
        const id = b.getAttribute("data-edit-promo");
        closeModal();
        openModalPromozione(id);
      });
    });

    document.querySelectorAll("[data-del-promo]").forEach(b => {
      b.addEventListener("click", () => {
        const id = b.getAttribute("data-del-promo");
        if (!confirm("Eliminare questa promozione?")) return;
        let all = loadData(STORAGE_KEYS.OFFERTE, []);
        all = all.filter(x => x.id !== id);
        saveData(STORAGE_KEYS.OFFERTE, all);
        updatePanoramica();
        renderPromo();
        closeModal();
        openPromoCenterModal();
      });
    });
  });
}

function openScadenzeEntro60Modal() {
  const oggi = todayISO();
  const groups = loadData(STORAGE_KEYS.SCADENZE, []);
  const items = [];

  groups.forEach(g => {
    (g.items || []).forEach(it => {
      const diff = diffDays(oggi, it.dataScadenza);
      if (diff >= 0 && diff <= 60) {
        items.push({ ...it, ym: g.ym, diff });
      }
    });
  });

  items.sort((a,b) => a.diff - b.diff);

  const html = `
    <div class="inline-row" style="flex-wrap:wrap;">
      <button class="primary" id="btn-add-scad" type="button">+ Nuove scadenze</button>
      <button class="small-secondary" id="btn-open-scad" type="button">Apri elenco mesi</button>
      <button class="small-secondary" id="btn-close-scad" type="button">Chiudi</button>
    </div>

    ${items.length ? `
      <ul class="simple-list" style="margin-top:10px;">
        ${items.map(it => `
          <li>
            <div class="row-main">
              <span class="row-title">${escapeHtml(it.nome)} <span class="badge yes">${it.pezzi} pz</span></span>
              <span class="row-sub">
                <strong>Entro:</strong> ${it.diff} giorni · <strong>Mese:</strong> ${ymLabel(it.ym)}
                ${it.minsan ? ` · <strong>Minsan:</strong> ${escapeHtml(it.minsan)}` : ``}
              </span>
            </div>
            <div class="row-actions">
              <span class="badge no">CRITICA</span>
            </div>
          </li>
        `).join("")}
      </ul>
    ` : `
      <p class="hint-text" style="margin-top:10px;">Nessuna scadenza entro 60 giorni ✅</p>
    `}
  `;

  openModal("Scadenze entro 60 giorni", html, () => {
    document.getElementById("btn-add-scad").onclick = () => { closeModal(); openModalScadenzeWizard(); };
    document.getElementById("btn-open-scad").onclick = () => { closeModal(); renderScadenzeGruppi(); };
    document.getElementById("btn-close-scad").onclick = closeModal;
  });
}

// ===== ASSENZE =====
function badgeAssenza(stato) {
  if (stato === "APPROVATA") return `<span class="badge ok">APPROVATA</span>`;
  if (stato === "RIFIUTATA") return `<span class="badge no">RIFIUTATA</span>`;
  return `<span class="badge wait">IN ATTESA</span>`;
}
function canApproveAssenze() {
  return currentUser && (currentUser.ruolo === "titolare" || currentUser.ruolo === "farmacia");
}

function renderAssenzeDettaglio() {
  const all = loadData(STORAGE_KEYS.ASSENZE, [])
    .slice()
    .sort((a,b) => parseISO(b.dal) - parseISO(a.dal));

  let html = `<p class="hint-text"><strong>Richieste assenze/permessi</strong></p>`;

  if (all.length === 0) {
    html += `<p>Nessuna richiesta inserita.</p>`;
    return showSezioneDettaglio("Assenti / Permessi", html);
  }

  html += `<ul class="simple-list">`;
  all.forEach(a => {
    const periodo = `${formatDateShortIT(a.dal)} → ${formatDateShortIT(a.al)}`;
    const motiv = a.motivazioneTitolare ? `<div class="row-sub"><strong>Motivo:</strong> ${escapeHtml(a.motivazioneTitolare)}</div>` : "";
    html += `
      <li>
        <div class="row-main">
          <span class="row-title">${escapeHtml(a.nome)} – ${escapeHtml(a.tipo)}</span>
          <span class="row-sub"><strong>Inizio/Fine:</strong> ${periodo}</span>
          ${a.note ? `<span class="row-sub">${escapeHtml(a.note)}</span>` : ``}
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

  showSezioneDettaglio("Assenti / Permessi", html);

  document.querySelectorAll("[data-accetta]").forEach(btn => {
    btn.addEventListener("click", () => openModalMotivoAssenza(btn.getAttribute("data-accetta"), true));
  });
  document.querySelectorAll("[data-rifiuta]").forEach(btn => {
    btn.addEventListener("click", () => openModalMotivoAssenza(btn.getAttribute("data-rifiuta"), false));
  });

  resetPanoramicaTimer();
}

function openModalMotivoAssenza(id, isApprove) {
  const html = `
    <form id="form-motivo-assenza">
      <label class="field">
        <span>Motivazione (opzionale)</span>
        <input type="text" id="motivo-assenza" placeholder="Es. ok / manca copertura / ecc." />
      </label>
      <button class="primary" type="submit">${isApprove ? "Conferma APPROVAZIONE" : "Conferma RIFIUTO"}</button>
    </form>
  `;
  openModal(isApprove ? "Approva richiesta" : "Rifiuta richiesta", html, () => {
    document.getElementById("form-motivo-assenza").addEventListener("submit", (e) => {
      e.preventDefault();
      const motivo = document.getElementById("motivo-assenza").value.trim();
      let all = loadData(STORAGE_KEYS.ASSENZE, []);
      const a = all.find(x => x.id === id);
      if (!a) return;

      a.stato = isApprove ? "APPROVATA" : "RIFIUTATA";
      a.motivazioneTitolare = motivo;
      a.tsDecisione = Date.now();

      saveData(STORAGE_KEYS.ASSENZE, all);
      closeModal();
      renderAssenzeDettaglio();
      updatePanoramica();
    });
  });
}

// ===== QUICK: RICHIESTA ASSENZA =====
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

    <p class="hint-text">Lo stato sarà visibile in <strong>Assenti / Permessi</strong>.</p>
  `;
  openModal("Nuova richiesta assenza/permesso", html, () => {
    document.getElementById("form-richiesta-assenza").addEventListener("submit", (e) => {
      e.preventDefault();
      if (!currentUser) return;

      const tipo = document.getElementById("ass-tipo").value;
      const dal = document.getElementById("ass-dal").value;
      const al = document.getElementById("ass-al").value;
      const note = document.getElementById("ass-note").value.trim();
      if (!dal || !al) return alert("Seleziona dal/al.");

      let all = loadData(STORAGE_KEYS.ASSENZE, []);
      all.push({
        id: "ass_" + Date.now(),
        nome: currentUser.nome,
        username: currentUser.username,
        tipo,
        dal,
        al,
        note,
        stato: "IN_ATTESA",
        motivazioneTitolare: "",
        tsRichiesta: Date.now()
      });
      saveData(STORAGE_KEYS.ASSENZE, all);
      closeModal();
      updatePanoramica();
      renderAssenzeDettaglio();
    });
  });
}

// ===== CONSUMABILI: SWITCH SMART =====
function openModalConsumabiliSwitch() {
  const catalogo = loadData(STORAGE_KEYS.CONSUMABILI_CATALOGO, []);
  const richieste = loadData(STORAGE_KEYS.CONSUMABILI_RICHIESTE, []);

  const activeSet = new Set(
    richieste.filter(r => r.stato !== "PROVVEDUTO").map(r => r.nome)
  );

  let html = `
    <div class="hint-text"><strong>Seleziona quelli FINITI o BASSI</strong> (switch rosso = richiesta)</div>
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

    <hr style="opacity:.25;margin:12px 0;">

    <form id="form-cons-add">
      <label class="field">
        <span>Aggiungi consumabile (se non presente)</span>
        <input type="text" id="cons-new-name" placeholder="Es. Rotoli POS..." />
      </label>
      <button class="small-secondary" type="submit">Aggiungi al catalogo</button>
    </form>

    <p class="hint-text small" style="margin-top:10px;">
      Le richieste selezionate verranno mostrate in <strong>Consumabili</strong> e in panoramica.
    </p>
  `;

  openModal("Segnala consumabili (BASSA / FINITO)", html, () => {
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
              richiestoDa: currentUser ? currentUser.nome : "Sconosciuto",
              username: currentUser ? currentUser.username : "",
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
    if (formAdd) {
      formAdd.addEventListener("submit", (e) => {
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
        if (inp) inp.value = "";
        closeModal();
        openModalConsumabiliSwitch();
      });
    }
  });
}

// ===== Q2: consumabili richieste =====
function canMarkProvveduto() {
  return currentUser && (currentUser.ruolo === "titolare" || currentUser.ruolo === "farmacia");
}

function renderConsumabiliRichieste() {
  const richieste = loadData(STORAGE_KEYS.CONSUMABILI_RICHIESTE, [])
    .filter(r => r.stato !== "PROVVEDUTO" && r.stato !== "ANNULLATA")
    .sort((a,b) => b.ts - a.ts);

  let html = `<p class="hint-text"><strong>Richieste consumabili</strong> (solo non ancora provvedute)</p>`;

  if (richieste.length === 0) {
    html += `<p>Nessuna richiesta consumabili attiva.</p>`;
    return showSezioneDettaglio("Consumabili", html);
  }

  html += `<ul class="simple-list">`;
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
          <span class="row-title">${escapeHtml(r.nome)}</span>
          <span class="row-sub"><strong>Richiesto da:</strong> ${escapeHtml(r.richiestoDa || "—")} · ${dd}/${mm}/${yy} ${hh}:${mi}</span>
          ${r.note ? `<span class="row-sub"><strong>Nota:</strong> ${escapeHtml(r.note)}</span>` : ``}
        </div>
        <div class="row-actions">
          <span class="badge wait">IN RICHIESTA</span>
          ${canMarkProvveduto() ? `<button class="small-primary" data-prov="${r.id}">Provveduto</button>` : ``}
        </div>
      </li>
    `;
  });
  html += `</ul>`;

  showSezioneDettaglio("Consumabili", html);

  document.querySelectorAll("[data-prov]").forEach(btn => {
    btn.addEventListener("click", () => markConsumabileProvveduto(btn.getAttribute("data-prov")));
  });

  resetPanoramicaTimer();
}

function markConsumabileProvveduto(id) {
  let richieste = loadData(STORAGE_KEYS.CONSUMABILI_RICHIESTE, []);
  const r = richieste.find(x => x.id === id);
  if (!r) return;
  r.stato = "PROVVEDUTO";
  r.tsProvveduto = Date.now();
  r.provvedutoDa = currentUser?.nome || "—";
  saveData(STORAGE_KEYS.CONSUMABILI_RICHIESTE, richieste);

  updatePanoramica();
  renderConsumabiliRichieste();
}

// ===== PROMO (Q3) =====
function promoGradient(i) {
  const grads = [
    "linear-gradient(135deg,#ff3d9a,#ff7bbf)",
    "linear-gradient(135deg,#1b78ff,#4dabff)",
    "linear-gradient(135deg,#18a26a,#1bd68c)",
    "linear-gradient(135deg,#f6a623,#ffb74d)",
    "linear-gradient(135deg,#7e57c2,#9575cd)"
  ];
  return grads[i % grads.length];
}

function renderPromo() {
  const oggi = todayISO();
  const offerte = loadData(STORAGE_KEYS.OFFERTE, []);

  const attive = offerte.filter(o => isDateInRange(oggi, o.dal, o.al))
    .sort((a,b) => parseISO(a.al) - parseISO(b.al));
  const scadute = offerte.filter(o => parseISO(oggi) > parseISO(o.al))
    .sort((a,b) => parseISO(b.al) - parseISO(a.al));

  const wrapAtt = document.getElementById("lista-offerte-attive");
  const wrapSca = document.getElementById("lista-offerte-scadute");

  if (wrapAtt) wrapAtt.innerHTML = "";
  if (wrapSca) wrapSca.innerHTML = "";

  if (wrapAtt) {
    if (attive.length === 0) {
      wrapAtt.innerHTML = `<p class="hint-text">Nessuna offerta attiva.</p>`;
    } else {
      attive.forEach((o, idx) => {
        const card = document.createElement("div");
        card.className = "promo-card";
        card.style.background = promoGradient(idx);
        card.innerHTML = `
          <div>
            <div class="pc-title">${escapeHtml(o.nome)}</div>
            <div class="pc-sub">${formatDateShortIT(o.dal)} → ${formatDateShortIT(o.al)}</div>
            ${o.note ? `<div class="pc-note">${escapeHtml(o.note)}</div>` : ``}
          </div>
          <div class="pc-actions">
            <button class="small-secondary" data-edit-off="${o.id}">Modifica</button>
            <button class="danger" data-del-off="${o.id}">Elimina</button>
          </div>
        `;
        wrapAtt.appendChild(card);
      });
    }
  }

  if (wrapSca) {
    if (scadute.length === 0) {
      wrapSca.innerHTML = `<p class="hint-text">Nessuna offerta scaduta.</p>`;
    } else {
      scadute.forEach((o, idx) => {
        const card = document.createElement("div");
        card.className = "promo-card";
        card.style.background = promoGradient(idx + 2);
        card.innerHTML = `
          <div>
            <div class="pc-title">${escapeHtml(o.nome)}</div>
            <div class="pc-sub">Scaduta: ${formatDateShortIT(o.dal)} → ${formatDateShortIT(o.al)}</div>
            ${o.note ? `<div class="pc-note">${escapeHtml(o.note)}</div>` : ``}
          </div>
          <div class="pc-actions">
            <button class="small-secondary" data-edit-off="${o.id}">Modifica</button>
            <button class="danger" data-del-off="${o.id}">Elimina</button>
          </div>
        `;
        wrapSca.appendChild(card);
      });
    }
  }

  document.querySelectorAll("[data-edit-off]").forEach(btn => {
    btn.addEventListener("click", () => openModalPromozione(btn.getAttribute("data-edit-off")));
  });
  document.querySelectorAll("[data-del-off]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-del-off");
      let all = loadData(STORAGE_KEYS.OFFERTE, []);
      all = all.filter(x => x.id !== id);
      saveData(STORAGE_KEYS.OFFERTE, all);
      renderPromo();
      updatePanoramica();
    });
  });

  const btnViewAll = document.getElementById("btn-view-all-promo");
  if (btnViewAll) btnViewAll.onclick = () => openModalTuttePromo();
}

function openModalPromozione(existingId) {
  let offerte = loadData(STORAGE_KEYS.OFFERTE, []);
  let off = null;
  if (existingId) off = offerte.find(x => x.id === existingId);

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
        <span>Note (ben visibili)</span>
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
      renderPromo();
      updatePanoramica();
    });
  });
}

function openModalTuttePromo() {
  const offerte = loadData(STORAGE_KEYS.OFFERTE, []);
  let html = `<p class="hint-text"><strong>Tutte le promozioni</strong></p><ul class="simple-list">`;
  if (offerte.length === 0) {
    html += `<li><span>Nessuna promozione.</span></li>`;
  } else {
    offerte
      .slice()
      .sort((a,b) => a.dal.localeCompare(b.dal))
      .forEach(o => {
        html += `
          <li>
            <div class="row-main">
              <span class="row-title">${escapeHtml(o.nome)}</span>
              <span class="row-sub">${formatDateShortIT(o.dal)} → ${formatDateShortIT(o.al)}</span>
              ${o.note ? `<span class="row-sub"><strong>Note:</strong> ${escapeHtml(o.note)}</span>` : ``}
            </div>
          </li>
        `;
      });
  }
  html += `</ul>`;
  openModal("Archivio promozioni", html);
}

// ===============================
// SCADENZE (wizard + gruppi mese/anno + CRUD)
// ===============================
function ymKeyFromISO(iso) {
  const [y, m] = iso.split("-");
  return `${y}-${m}`;
}
function ymLabel(ym) {
  const [y, m] = ym.split("-");
  const monthNames = ["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"];
  return `${monthNames[Number(m)-1]} ${y}`;
}
function ymSort(a, b) {
  return a.localeCompare(b);
}

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

      <div class="inline-row">
        <label class="field">
          <span>Oppure crea nuovo (mese)</span>
          <input type="month" id="scad-new-ym" />
        </label>
      </div>

      <button class="primary" type="submit">Avanti</button>
    </form>
  `;

  openModal("Nuova scadenza (scegli mese/anno)", html, () => {
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

function openModalScadenzeRighe(ym) {
  const html = `
    <form id="form-scad-step2">
      <p class="hint-text"><strong>${ymLabel(ym)}</strong> – Inserisci i prodotti (nome, pezzi, minsan opzionale).</p>

      <div id="scad-rows">
        ${scadRowHtml("", "", "")}
      </div>

      <button class="small-secondary" type="button" id="btn-add-row">+ AGGIUNGI RIGA</button>
      <button class="primary" type="submit">Salva scadenze</button>
    </form>
  `;
  openModal("Nuove scadenze prodotti", html, () => {
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
      if (items.length === 0) return alert("Inserisci almeno 1 riga valida (nome + pezzi).");

      let groups = loadData(STORAGE_KEYS.SCADENZE, []);
      let g = groups.find(x => x.ym === ym);
      if (!g) {
        g = { id: "sg_" + Date.now(), ym, items: [] };
        groups.push(g);
      }
      g.items.push(...items);
      g.items.sort((a,b) => a.nome.localeCompare(b.nome, "it"));
      groups.sort((a,b) => ymSort(a.ym, b.ym));
      saveData(STORAGE_KEYS.SCADENZE, groups);

      closeModal();
      updatePanoramica();
      renderScadenzeGruppi();
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

function renderScadenzeGruppi() {
  const groups = loadData(STORAGE_KEYS.SCADENZE, []).slice().sort((a,b) => ymSort(a.ym, b.ym));

  if (groups.length === 0) {
    return showSezioneDettaglio("Prodotti in scadenza", `<p>Nessuna scadenza registrata.</p>`);
  }

  let html = `<p class="hint-text"><strong>Scadenze per mese/anno</strong></p><ul class="simple-list">`;
  groups.forEach(g => {
    html += `
      <li>
        <div class="row-main">
          <span class="row-title">${ymLabel(g.ym)}</span>
          <span class="row-sub">${(g.items || []).length} prodotto/i</span>
        </div>
        <div class="row-actions">
          <button class="small-primary" data-open-ym="${g.ym}">Apri</button>
          <button class="danger" data-del-ym="${g.ym}">Elimina mese</button>
        </div>
      </li>
    `;
  });
  html += `</ul>`;

  showSezioneDettaglio("Prodotti in scadenza", html);

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
      renderScadenzeGruppi();
    });
  });

  resetPanoramicaTimer();
}

function openScadenzeMese(ym) {
  const groups = loadData(STORAGE_KEYS.SCADENZE, []);
  const g = groups.find(x => x.ym === ym);
  if (!g) return;

  let html = `
    <p class="hint-text"><strong>${ymLabel(ym)}</strong> – Prodotti in scadenza</p>
    <div class="inline-row">
      <button class="small-secondary" type="button" id="btn-add-to-ym">+ Aggiungi prodotti a questo mese</button>
    </div>
    <ul class="simple-list" style="margin-top:10px;">
  `;

  (g.items || [])
    .slice()
    .sort((a,b) => a.nome.localeCompare(b.nome,"it"))
    .forEach(it => {
      html += `
        <li>
          <div class="row-main">
            <span class="row-title">${escapeHtml(it.nome)} <span class="badge yes">${it.pezzi} pz</span></span>
            <span class="row-sub">${it.minsan ? `Minsan: ${escapeHtml(it.minsan)}` : `Minsan: —`}</span>
          </div>
          <div class="row-actions">
            <button class="small-secondary" data-edit-item="${it.id}">Modifica</button>
            <button class="danger" data-del-item="${it.id}">Rimuovi</button>
          </div>
        </li>
      `;
    });

  html += `</ul>`;

  showSezioneDettaglio(`Scadenze – ${ymLabel(ym)}`, html);

  const btnAdd = document.getElementById("btn-add-to-ym");
  if (btnAdd) btnAdd.addEventListener("click", () => openModalScadenzeRighe(ym));

  document.querySelectorAll("[data-del-item]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-del-item");
      let gs = loadData(STORAGE_KEYS.SCADENZE, []);
      const gg = gs.find(x => x.ym === ym);
      if (!gg) return;
      gg.items = (gg.items || []).filter(x => x.id !== id);
      saveData(STORAGE_KEYS.SCADENZE, gs);
      updatePanoramica();
      openScadenzeMese(ym);
    });
  });

  document.querySelectorAll("[data-edit-item]").forEach(btn => {
    btn.addEventListener("click", () => openModalEditScadenzaItem(ym, btn.getAttribute("data-edit-item")));
  });

  resetPanoramicaTimer();
}

function openModalEditScadenzaItem(ym, itemId) {
  let gs = loadData(STORAGE_KEYS.SCADENZE, []);
  const g = gs.find(x => x.ym === ym);
  if (!g) return;
  const it = (g.items || []).find(x => x.id === itemId);
  if (!it) return;

  const html = `
    <form id="form-edit-scad-item">
      <label class="field">
        <span>Nome prodotto</span>
        <input type="text" id="esi-nome" value="${escapeHtml(it.nome)}" />
      </label>
      <div class="inline-row">
        <label class="field">
          <span>Pezzi</span>
          <input type="number" min="1" id="esi-pezzi" value="${it.pezzi}" />
        </label>
        <label class="field">
          <span>Minsan (opz.)</span>
          <input type="text" id="esi-minsan" value="${escapeHtml(it.minsan || "")}" />
        </label>
      </div>
      <button class="primary" type="submit">Salva</button>
    </form>
  `;
  openModal("Modifica scadenza", html, () => {
    document.getElementById("form-edit-scad-item").addEventListener("submit", (e) => {
      e.preventDefault();
      it.nome = document.getElementById("esi-nome").value.trim();
      it.pezzi = Number(document.getElementById("esi-pezzi").value || 0);
      it.minsan = document.getElementById("esi-minsan").value.trim();
      if (!it.nome || !it.pezzi) return alert("Nome e pezzi obbligatori.");

      saveData(STORAGE_KEYS.SCADENZE, gs);
      closeModal();
      updatePanoramica();
      openScadenzeMese(ym);
    });
  });
}

// ===============================
// PROCEDURE
// ===============================
function renderProcedureGrid() {
  const procs = loadData(STORAGE_KEYS.PROCEDURE, []);

  let html = `<p class="hint-text"><strong>Procedure</strong> – clicca un’icona.</p>`;

  if (procs.length === 0) {
    html += `<p>Nessuna procedura salvata.</p>`;
    html += `<button class="small-primary" id="btn-add-proc">+ Aggiungi procedura</button>`;
    showSezioneDettaglio("Procedure", html);
    document.getElementById("btn-add-proc").addEventListener("click", openModalProcedureManager);
    return;
  }

  html += `<div class="proc-grid">`;
  procs.forEach(p => {
    html += `
      <button class="proc-tile" data-open-proc="${p.id}" type="button">
        <div class="proc-ico">${p.icon || "📄"}</div>
        <div class="proc-name">${escapeHtml(p.titolo || "Procedura")}</div>
        <div class="proc-mini">${escapeHtml(p.categoria || "Procedura")}</div>
      </button>
    `;
  });
  html += `</div>`;

  showSezioneDettaglio("Procedure", html);

  document.querySelectorAll("[data-open-proc]").forEach(btn => {
    btn.addEventListener("click", () => openProcedureDetail(btn.getAttribute("data-open-proc")));
  });

  resetPanoramicaTimer();
}

function openProcedureDetail(procId) {
  const procs = loadData(STORAGE_KEYS.PROCEDURE, []);
  const p = procs.find(x => x.id === procId);
  if (!p) return;

  const steps = Array.isArray(p.steps) ? p.steps : [];
  const stepsHtml = steps.length
    ? `<ol class="proc-steps">${steps.map(s => `<li>${escapeHtml(s)}</li>`).join("")}</ol>`
    : `<p class="hint-text">Nessun passaggio inserito.</p>`;

  let html = `
    <div class="proc-detail">
      <h4>${p.icon || "📄"} ${escapeHtml(p.titolo || "")}</h4>
      ${p.descrizione ? `<p>${escapeHtml(p.descrizione)}</p>` : ``}
      ${stepsHtml}
      ${p.nota ? `<div class="proc-note">💡 ${escapeHtml(p.nota)}</div>` : ``}

      <div class="row-actions" style="margin-top:12px;">
        <button class="small-secondary" id="btn-back-proc" type="button">← Indietro</button>
        <button class="small-primary" id="btn-edit-proc" type="button">Modifica</button>
        <button class="danger" id="btn-del-proc" type="button">Elimina</button>
      </div>
    </div>
  `;

  showSezioneDettaglio("Procedure", html);

  document.getElementById("btn-back-proc").addEventListener("click", renderProcedureGrid);
  document.getElementById("btn-edit-proc").addEventListener("click", () => openModalProcedureManager(procId));
  document.getElementById("btn-del-proc").addEventListener("click", () => {
    if (!confirm("Eliminare questa procedura?")) return;
    let all = loadData(STORAGE_KEYS.PROCEDURE, []);
    all = all.filter(x => x.id !== procId);
    saveData(STORAGE_KEYS.PROCEDURE, all);
    renderProcedureGrid();
    updatePanoramica();
  });

  resetPanoramicaTimer();
}

function openModalProcedureManager(editId) {
  let procs = loadData(STORAGE_KEYS.PROCEDURE, []);
  let p = null;
  if (editId) p = procs.find(x => x.id === editId);

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
        <input type="text" id="pr-title" value="${p ? escapeHtml(p.titolo) : ""}" />
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
        p.icon = icon;
        p.categoria = categoria;
        p.titolo = titolo;
        p.descrizione = descrizione;
        p.steps = stepsRaw;
        p.nota = nota;
      } else {
        all.push({
          id: "pr_" + Date.now(),
          icon, categoria, titolo, descrizione,
          steps: stepsRaw,
          nota
        });
      }
      saveData(STORAGE_KEYS.PROCEDURE, all);
      closeModal();
      renderProcedureGrid();
    });
  });
}

// ===============================
// SIDEBAR: crea utente dipendente
// ===============================
function openModalNuovoDipendente() {
  if (!currentUser || currentUser.ruolo !== "farmacia") {
    return alert("Solo la Farmacia può creare utenti dipendente.");
  }

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
    <p class="hint-text">L’utente potrà fare login con le credenziali create qui.</p>
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

      users.push({
        username,
        password,
        ruolo: "dipendente",
        nome,
        telefono: "",
        email: ""
      });
      saveData(STORAGE_KEYS.UTENTI, users);
      closeModal();
      alert("Dipendente creato ✅");
    });
  });

  closeSidebarHard();
}
