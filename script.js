// script.js

document.addEventListener("DOMContentLoaded", () => {
  // RUOLI
  const ROLE_FARMACIA = "farmacia";
  const ROLE_TITOLARE = "titolare";
  const ROLE_DIPENDENTE = "dipendente";

  let selectedRole = ROLE_FARMACIA;
  let currentUser = null;

  // ELEMENTI LOGIN
  const authContainer = document.getElementById("authContainer");
  const loginTabs = document.querySelectorAll(".auth-tab");
  const loginRoleLabel = document.getElementById("loginRoleLabel");
  const loginForm = document.getElementById("loginForm");
  const loginUsername = document.getElementById("loginUsername");
  const loginPassword = document.getElementById("loginPassword");
  const loginError = document.getElementById("loginError");

  // ELEMENTI APP
  const appRoot = document.getElementById("appRoot");
  const userBadge = document.getElementById("userBadge");

  const hamburger = document.getElementById("hamburger");
  const sidebar = document.getElementById("sidebar");
  const closeSidebar = document.getElementById("closeSidebar");
  const menuLogout = document.getElementById("menuLogout");

  const tileAssenzeTitle = document.getElementById("tileAssenzeTitle");

  // FUNZIONI UTILITARIE
  function roleLabel(role) {
    if (role === ROLE_TITOLARE) return "Titolare";
    if (role === ROLE_DIPENDENTE) return "Dipendente";
    return "Farmacia";
  }

  function applyUserUI() {
    if (!currentUser) return;

    // Titolo card Assenze
    if (currentUser.role === ROLE_DIPENDENTE) {
      tileAssenzeTitle.textContent = "Le mie assenze";
    } else {
      tileAssenzeTitle.textContent = "Assenze del personale";
    }

    // Badge utente in alto
    let badgeText = "";
    if (currentUser.role === ROLE_TITOLARE) {
      badgeText = "Titolare · " + (currentUser.username || "");
    } else if (currentUser.role === ROLE_DIPENDENTE) {
      badgeText = "Dipendente · " + (currentUser.username || "");
    } else {
      badgeText = "Accesso · Farmacia";
    }
    userBadge.textContent = badgeText;
  }

  function showApp() {
    authContainer.classList.add("hidden");
    appRoot.classList.remove("hidden");
    applyUserUI();
  }

  function showLogin() {
    appRoot.classList.add("hidden");
    authContainer.classList.remove("hidden");
    loginUsername.value = "";
    loginPassword.value = "";
    loginError.classList.add("hidden");
  }

  // GESTIONE TAB RUOLI
  loginTabs.forEach((btn) => {
    btn.addEventListener("click", () => {
      const role = btn.getAttribute("data-role");
      selectedRole = role;
      loginTabs.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      loginRoleLabel.textContent = roleLabel(role);
      loginError.classList.add("hidden");
    });
  });

  // LOGIN (DEMO: accetta qualunque username/password non vuoti)
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const user = loginUsername.value.trim();
      const pass = loginPassword.value.trim();

      if (!user || !pass) {
        loginError.classList.remove("hidden");
        return;
      }

      currentUser = {
        role: selectedRole,
        username: user,
      };

      showApp();
    });
  }

  // SIDEBAR
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

  // click fuori dalla sidebar
  document.addEventListener("click", (event) => {
    if (!sidebar.classList.contains("open")) return;
    const clickInside = sidebar.contains(event.target);
    const clickHamb = hamburger.contains(event.target);
    if (!clickInside && !clickHamb) {
      sidebar.classList.remove("open");
    }
  });

  // LOGOUT
  if (menuLogout) {
    menuLogout.addEventListener("click", () => {
      currentUser = null;
      sidebar.classList.remove("open");
      showLogin();
    });
  }

  // (eventuali alert demo sui menu)
  const menuAreaPersonale = document.getElementById("menuAreaPersonale");
  if (menuAreaPersonale) {
    menuAreaPersonale.addEventListener("click", () => {
      alert("In futuro qui puoi aprire l'Area Personale (dati, ferie, ecc.).");
    });
  }

  const menuAdmin = document.getElementById("menuAdmin");
  if (menuAdmin) {
    menuAdmin.addEventListener("click", () => {
      if (!currentUser || currentUser.role !== ROLE_TITOLARE) {
        alert("Area Admin riservata al Titolare.");
        return;
      }
      alert("In futuro: gestione completa dipendenti, reset password, ecc.");
    });
  }

  const menuFormazione = document.getElementById("menuFormazione");
  if (menuFormazione) {
    menuFormazione.addEventListener("click", () => {
      alert("In futuro: corsi ECM, documenti, video formativi...");
    });
  }
});
