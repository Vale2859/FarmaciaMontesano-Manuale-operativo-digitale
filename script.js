// script.js

document.addEventListener("DOMContentLoaded", () => {
  // === COSTANTI RUOLI ===
  const ROLE_FARMACIA = "farmacia";
  const ROLE_TITOLARE = "titolare";
  const ROLE_DIPENDENTE = "dipendente";

  // Credenziali di base (MODIFICABILI DA TE)
  const FARMACIA_USER = "farmacia";
  const FARMACIA_PASS = "farmacia";

  const TITOLARE_USER = "titolare";
  const TITOLARE_PASS = "montesano2025";

  const STORAGE_KEY_EMPLOYEES = "fm_employees_v1";

  function loadEmployees() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY_EMPLOYEES)) || [];
    } catch {
      return [];
    }
  }

  function saveEmployees(list) {
    localStorage.setItem(STORAGE_KEY_EMPLOYEES, JSON.stringify(list));
  }

  // === STATO CORRENTE ===
  let selectedRole = ROLE_FARMACIA;
  let currentUser = null;

  // === ELEMENTI LOGIN / REGISTRAZIONE ===
  const authContainer = document.getElementById("authContainer");
  const authLoginCard = document.getElementById("authLoginCard");
  const registerCard = document.getElementById("registerCard");

  const loginRoleButtons = document.querySelectorAll(".auth-tab");
  const loginRoleLabel = document.getElementById("loginRoleLabel");
  const loginForm = document.getElementById("loginForm");
  const loginUsername = document.getElementById("loginUsername");
  const loginPassword = document.getElementById("loginPassword");
  const loginError = document.getElementById("loginError");
  const showRegisterBtn = document.getElementById("showRegister");

  const registerForm = document.getElementById("registerForm");
  const regNome = document.getElementById("regNome");
  const regCognome = document.getElementById("regCognome");
  const regUsername = document.getElementById("regUsername");
  const regPassword = document.getElementById("regPassword");
  const regPassword2 = document.getElementById("regPassword2");
  const registerError = document.getElementById("registerError");
  const registerSuccess = document.getElementById("registerSuccess");
  const backToLoginBtn = document.getElementById("backToLogin");

  // === ELEMENTI APP ===
  const appRoot = document.getElementById("appRoot");
  const hamburger = document.getElementById("hamburger");
  const sidebar = document.getElementById("sidebar");
  const closeSidebar = document.getElementById("closeSidebar");
  const logoutBtn = document.getElementById("logoutBtn");
  const adminMenuItem = document.getElementById("adminMenuItem");

  const dashboard = document.getElementById("dashboard");
  const assenzePage = document.getElementById("assenzePage");
  const openAssenzeBtn = document.getElementById("openAssenze");
  const backToDashboardBtn = document.getElementById("backToDashboard");

  const assenzeForm = document.querySelector(".assenze-form");
  const assenzeFeedback = document.getElementById("assenzeFeedback");

  const assenzeCardTitle = document.getElementById("assenzeCardTitle");
  const assenzePageTitle = document.getElementById("assenzePageTitle");
  const userBadge = document.getElementById("userBadge");

  // ====== FUNZIONI DI SUPPORTO ======

  function setRoleLabel(role) {
    if (role === ROLE_TITOLARE) return "Titolare";
    if (role === ROLE_DIPENDENTE) return "Dipendente";
    return "Farmacia";
  }

  function applyRoleUI() {
    if (!currentUser) return;

    // Titolo card assenze / le mie assenze
    if (currentUser.role === ROLE_DIPENDENTE) {
      assenzeCardTitle.textContent = "Le mie assenze";
      assenzePageTitle.textContent = "Le mie assenze";
    } else {
      assenzeCardTitle.textContent = "Assenze del personale";
      assenzePageTitle.textContent = "Assenze del personale";
    }

    // Badge utente in alto
    let label = "";
    if (currentUser.role === ROLE_TITOLARE) {
      label = "Titolare";
    } else if (currentUser.role === ROLE_FARMACIA) {
      label = "Farmacia (accesso generico)";
    } else if (currentUser.role === ROLE_DIPENDENTE) {
      label = `Dipendente · ${currentUser.displayName || currentUser.username}`;
    }
    userBadge.textContent = label;
  }

  function authenticate(role, username, password) {
    username = (username || "").trim();
    password = password || "";

    if (!username || !password) return null;

    if (role === ROLE_FARMACIA) {
      if (username === FARMACIA_USER && password === FARMACIA_PASS) {
        return { role, username, displayName: "Farmacia" };
      }
      return null;
    }

    if (role === ROLE_TITOLARE) {
      if (username === TITOLARE_USER && password === TITOLARE_PASS) {
        return { role, username, displayName: "Titolare" };
      }
      return null;
    }

    if (role === ROLE_DIPENDENTE) {
      const employees = loadEmployees();
      const match = employees.find(
        (e) => e.username === username && e.password === password
      );
      if (match) {
        return {
          role,
          username: match.username,
          displayName: `${match.nome || ""} ${match.cognome || ""}`.trim(),
        };
      }
      return null;
    }

    return null;
  }

  function resetLoginForm() {
    loginUsername.value = "";
    loginPassword.value = "";
    loginError.classList.add("hidden");
  }

  function showAppForUser(user) {
    currentUser = user;
    authContainer.classList.add("hidden");
    appRoot.classList.remove("hidden");
    hamburger.classList.remove("hidden");
    applyRoleUI();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function doLogout() {
    currentUser = null;
    appRoot.classList.add("hidden");
    hamburger.classList.add("hidden");
    sidebar.classList.remove("open");
    authContainer.classList.remove("hidden");
    dashboard.classList.remove("hidden");
    assenzePage.classList.add("hidden");
    resetLoginForm();
  }

  // ====== HANDLER LOGIN / TABS ======

  loginRoleButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const role = btn.dataset.role;
      selectedRole = role;

      loginRoleButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      loginRoleLabel.textContent = setRoleLabel(role);
      resetLoginForm();

      // registrazione visibile solo per ruolo dipendente
      if (role === ROLE_DIPENDENTE) {
        showRegisterBtn.classList.remove("hidden");
      } else {
        showRegisterBtn.classList.add("hidden");
      }
    });
  });

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      loginError.classList.add("hidden");

      const user = authenticate(
        selectedRole,
        loginUsername.value,
        loginPassword.value
      );

      if (!user) {
        loginError.classList.remove("hidden");
        return;
      }

      showAppForUser(user);
    });
  }

  // ====== REGISTRAZIONE DIPENDENTE ======

  if (showRegisterBtn) {
    showRegisterBtn.addEventListener("click", () => {
      authLoginCard.classList.add("hidden");
      registerCard.classList.remove("hidden");
      registerError.classList.add("hidden");
      registerSuccess.classList.add("hidden");
      regNome.value = "";
      regCognome.value = "";
      regUsername.value = "";
      regPassword.value = "";
      regPassword2.value = "";
    });
  }

  if (backToLoginBtn) {
    backToLoginBtn.addEventListener("click", () => {
      registerCard.classList.add("hidden");
      authLoginCard.classList.remove("hidden");
    });
  }

  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      registerError.classList.add("hidden");
      registerSuccess.classList.add("hidden");

      const nome = regNome.value.trim();
      const cognome = regCognome.value.trim();
      const username = regUsername.value.trim();
      const pass1 = regPassword.value;
      const pass2 = regPassword2.value;

      if (!username || !pass1 || !pass2) {
        registerError.textContent = "Compila tutti i campi obbligatori.";
        registerError.classList.remove("hidden");
        return;
      }

      if (pass1 !== pass2) {
        registerError.textContent = "Le password non coincidono.";
        registerError.classList.remove("hidden");
        return;
      }

      const employees = loadEmployees();
      const exists = employees.some((e) => e.username === username);
      if (exists) {
        registerError.textContent = "Username già esistente. Scegline un altro.";
        registerError.classList.remove("hidden");
        return;
      }

      employees.push({
        nome,
        cognome,
        username,
        password: pass1,
      });
      saveEmployees(employees);

      registerSuccess.classList.remove("hidden");
    });
  }

  // ====== SIDEBAR & LOGOUT ======

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

  // chiudi sidebar cliccando fuori
  document.addEventListener("click", (event) => {
    const clickInsideSidebar = sidebar.contains(event.target);
    const clickOnHamburger = hamburger.contains(event.target);
    if (!clickInsideSidebar && !clickOnHamburger) {
      sidebar.classList.remove("open");
    }
  });

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      doLogout();
    });
  }

  if (adminMenuItem) {
    adminMenuItem.addEventListener("click", () => {
      if (!currentUser || currentUser.role !== ROLE_TITOLARE) {
        alert("Area riservata al titolare.");
        return;
      }
      alert(
        "In futuro qui potremo mettere la gestione completa dei dipendenti (reset password, disattivazione account, ecc.)."
      );
    });
  }

  // ====== NAVIGAZIONE ASSENZE ======

  if (openAssenzeBtn) {
    openAssenzeBtn.addEventListener("click", () => {
      dashboard.classList.add("hidden");
      assenzePage.classList.remove("hidden");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  if (backToDashboardBtn) {
    backToDashboardBtn.addEventListener("click", () => {
      assenzePage.classList.add("hidden");
      dashboard.classList.remove("hidden");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // invio "finto" della richiesta di assenza
  if (assenzeForm && assenzeFeedback) {
    assenzeForm.addEventListener("submit", (e) => {
      e.preventDefault();
      assenzeFeedback.classList.remove("hidden");
      assenzeForm.reset();

      setTimeout(() => {
        assenzeFeedback.classList.add("hidden");
      }, 4000);
    });
  }
});
