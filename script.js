// ================= CONFIGURAZIONE DI BASE =================

const DEFAULT_CONFIG = {
  assenze: {
    title: "Assenze personale / titolare",
    subtitle: "Richieste ferie, permessi, malattia",
    color: "#f97316", // usato solo in modale; i gradienti base li gestisce il CSS
  },
  comunicazioni: {
    title: "Comunicazioni",
    subtitle: "Messaggi interni, avvisi urgenti",
    color: "#ec4899",
  },
  magazzino: {
    title: "Magazziniera",
    subtitle: "Ordini, mancanze, resi",
    color: "#facc15",
  },
  turni: {
    title: "Turni farmacie",
    subtitle: "Calendario turni e reperibilità",
    color: "#3b82f6",
  },
};

const STORAGE_KEY = "fm_portale_config_v1";

// ================= UTILITY =================

function loadConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_CONFIG };
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_CONFIG, ...parsed };
  } catch (e) {
    console.warn("Errore lettura config, uso default", e);
    return { ...DEFAULT_CONFIG };
  }
}

function saveConfig(cfg) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
  } catch (e) {
    console.warn("Errore salvataggio config", e);
  }
}

// Applica config alle tile (titolo & sottotitolo)
function applyConfig(cfg) {
  const tiles = document.querySelectorAll(".tile");
  tiles.forEach((tile) => {
    const key = tile.dataset.key;
    const conf = cfg[key];
    if (!conf) return;
    const titleEl = tile.querySelector(".tile-title");
    const subEl = tile.querySelector(".tile-subtitle");
    if (titleEl) titleEl.textContent = conf.title;
    if (subEl) subEl.textContent = conf.subtitle;
    // Il colore base dei gradienti è gestito con il CSS.
    // Se vuoi usare il singolo colore pieno:
    // tile.style.background = conf.color;
  });
}

// ================= INIZIALIZZAZIONE INTERFACCIA =================

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const menuToggle = document.getElementById("menuToggle");
  const sideMenu = document.getElementById("sideMenu");
  const closeMenu = document.getElementById("closeMenu");
  const roleToggle = document.getElementById("roleToggle");
  const portalLabel = document.getElementById("portalLabel");
  const settingsModal = document.getElementById("settingsModal");
  const closeSettings = document.getElementById("closeSettings");
  const openSettingsFab = document.getElementById("openSettingsFab");
  const settingsForm = document.getElementById("settingsForm");
  const saveSettingsBtn = document.getElementById("saveSettings");
  const resetSettingsBtn = document.getElementById("resetSettings");

  // ---- Config iniziale ----
  let currentConfig = loadConfig();
  applyConfig(currentConfig);

  // ---- Toggle menu laterale ----
  menuToggle.addEventListener("click", () => {
    sideMenu.classList.add("open");
    sideMenu.setAttribute("aria-hidden", "false");
  });

  closeMenu.addEventListener("click", () => {
    sideMenu.classList.remove("open");
    sideMenu.setAttribute("aria-hidden", "true");
  });

  // Chiudi menu cliccando fuori (mobile/desktop)
  document.addEventListener("click", (e) => {
    if (!sideMenu.classList.contains("open")) return;
    const isInsideMenu = sideMenu.contains(e.target);
    const isToggle = menuToggle.contains(e.target);
    if (!isInsideMenu && !isToggle) {
      sideMenu.classList.remove("open");
      sideMenu.setAttribute("aria-hidden", "true");
    }
  });

  // ---- Selezione tile dal menu (scroll sulla tile corrispondente) ----
  sideMenu.querySelectorAll("li[data-target]").forEach((item) => {
    item.addEventListener("click", () => {
      const key = item.getAttribute("data-target");
      const tile = document.querySelector(`.tile[data-key="${key}"]`);
      if (tile) {
        tile.scrollIntoView({ behavior: "smooth", block: "center" });
        tile.classList.add("tile-highlight");
        setTimeout(() => tile.classList.remove("tile-highlight"), 800);
      }
      sideMenu.classList.remove("open");
    });
  });

  // ---- Toggle ruolo Dipendente / Titolare ----
  let isOwner = false;

  function updateRole() {
    if (isOwner) {
      body.classList.remove("role-dipendente");
      body.classList.add("role-titolare");
      roleToggle.textContent = "Modalità: Titolare";
      portalLabel.textContent = "Portale Titolare";
    } else {
      body.classList.add("role-dipendente");
      body.classList.remove("role-titolare");
      roleToggle.textContent = "Modalità: Dipendente";
      portalLabel.textContent = "Portale Dipendenti";
    }
  }

  roleToggle.addEventListener("click", () => {
    // qui in futuro potresti collegare un vero login
    isOwner = !isOwner;
    updateRole();
  });

  updateRole();

  // ================= MODALE IMPOSTAZIONI (solo titolare) =================

  function openSettings() {
    if (!isOwner) return; // solo titolare
    buildSettingsForm();
    settingsModal.classList.add("open");
    settingsModal.setAttribute("aria-hidden", "false");
  }

  function closeSettingsModal() {
    settingsModal.classList.remove("open");
    settingsModal.setAttribute("aria-hidden", "true");
  }

  document
    .querySelectorAll(".open-settings")
    .forEach((el) => el.addEventListener("click", openSettings));

  openSettingsFab.addEventListener("click", openSettings);
  closeSettings.addEventListener("click", closeSettingsModal);

  settingsModal.addEventListener("click", (e) => {
    if (e.target === settingsModal) {
      closeSettingsModal();
    }
  });

  // Crea i campi dinamicamente in base alla config
  function buildSettingsForm() {
    settingsForm.innerHTML = "";
    Object.keys(currentConfig).forEach((key) => {
      const conf = currentConfig[key];

      const row = document.createElement("div");
      row.className = "setting-row";
      row.dataset.key = key;

      const labelCol = document.createElement("div");
      labelCol.innerHTML = `<label>${conf.title}</label>`;

      const titleInputCol = document.createElement("div");
      const titleInput = document.createElement("input");
      titleInput.type = "text";
      titleInput.value = conf.title;
      titleInput.placeholder = "Titolo tile";
      titleInputCol.appendChild(titleInput);

      const colorCol = document.createElement("div");
      const colorInput = document.createElement("input");
      colorInput.type = "color";
      colorInput.value = conf.color || "#0ea5e9";
      colorCol.appendChild(colorInput);

      row.appendChild(labelCol);
      row.appendChild(titleInputCol);
      row.appendChild(colorCol);

      settingsForm.appendChild(row);
    });
  }

  // Salva impostazioni
  saveSettingsBtn.addEventListener("click", () => {
    const rows = settingsForm.querySelectorAll(".setting-row");
    rows.forEach((row) => {
      const key = row.dataset.key;
      const [titleInputCol, colorCol] = row.querySelectorAll("div:nth-child(n+2)");
      const titleInput = titleInputCol.querySelector("input[type='text']");
      const colorInput = colorCol.querySelector("input[type='color']");

      currentConfig[key].title = titleInput.value.trim() || DEFAULT_CONFIG[key].title;
      currentConfig[key].color = colorInput.value;
    });

    saveConfig(currentConfig);
    applyConfig(currentConfig);
    closeSettingsModal();
  });

  // Reset impostazioni
  resetSettingsBtn.addEventListener("click", () => {
    if (!confirm("Ripristinare i testi predefiniti?")) return;
    currentConfig = { ...DEFAULT_CONFIG };
    saveConfig(currentConfig);
    applyConfig(currentConfig);
    buildSettingsForm();
  });

  // Highlight tile quando cliccate
  document.querySelectorAll(".tile").forEach((tile) => {
    tile.addEventListener("click", () => {
      const key = tile.dataset.key;
      alert(`(Demo) Apri sezione: ${currentConfig[key].title}`);
    });
  });
});

// Classe per highlight temporaneo
const style = document.createElement("style");
style.textContent = `
  .tile-highlight {
    outline: 3px solid #0ea5e9;
    outline-offset: 2px;
  }
`;
document.head.appendChild(style);
