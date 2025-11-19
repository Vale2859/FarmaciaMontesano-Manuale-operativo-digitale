function showRegister() {
    document.getElementById("login-box").style.display = "none";
    document.getElementById("register-box").style.display = "block";
}

function showLogin() {
    document.getElementById("login-box").style.display = "block";
    document.getElementById("register-box").style.display = "none";
}

// Registrazione dipendente
function register() {
    let name = document.getElementById("reg-name").value;
    let email = document.getElementById("reg-email").value;
    let password = document.getElementById("reg-password").value;

    if (!name || !email || !password) {
        alert("Compila tutto!");
        return;
    }

    let users = JSON.parse(localStorage.getItem("dipendenti") || "[]");

    if (users.find(u => u.email === email)) {
        alert("Email già esistente!");
        return;
    }

    users.push({ name, email, password });
    localStorage.setItem("dipendenti", JSON.stringify(users));

    alert("Registrazione completata!");
    showLogin();
}

// Login dipendente
function login() {
    let email = document.getElementById("login-email").value;
    let password = document.getElementById("login-password").value;

    let users = JSON.parse(localStorage.getItem("dipendenti") || "[]");
    let user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        alert("Credenziali errate!");
        return;
    }

    localStorage.setItem("utenteAttivo", JSON.stringify(user));

    loadDashboard(user);
}

// Logout
function logout() {
    localStorage.removeItem("utenteAttivo");
    location.reload();
}

// Mostra dashboard
function loadDashboard(user) {
    document.getElementById("auth-container").style.display = "none";
    document.getElementById("dashboard").style.display = "flex";

    document.getElementById("welcome").innerText = "Ciao " + user.name + "! 👋";

    // Inizializza dati demo
    loadProcedures();
    loadMessages();
}

// Cambia sezione dashboard
function showSection(sectionId) {
    document.querySelectorAll(".main section").forEach(sec => sec.classList.add("hidden"));
    document.getElementById(sectionId).classList.remove("hidden");
}

// Procedure interne demo
function loadProcedures() {
    const procedures = [
        "ANTICIPI – i clienti pagano subito e poi portano ricetta",
        "SCONTRINO POS – non fare vendita manuale!",
        "TICKET SSN – controllare sempre codice fiscale",
        "SOTTO CASSA – mettere resto nella scatoletta"
    ];

    let list = document.getElementById("procedure-list");
    list.innerHTML = "";

    procedures.forEach(p => {
        let li = document.createElement("li");
        li.textContent = p;
        list.appendChild(li);
    });
}

// Comunicazioni demo
function loadMessages() {
    const messages = [
        "⚠️ Controllare gli incassi del turno mattutino",
        "📦 È arrivato ordine Uriage",
        "💊 Nuove regole anticipi ASL aggiornate oggi",
        "📣 Riavviare POS se non comunica col gestionale"
    ];

    let list = document.getElementById("message-list");
    list.innerHTML = "";

    messages.forEach(m => {
        let li = document.createElement("li");
        li.textContent = m;
        list.appendChild(li);
    });
}

// Auto login se utente attivo
let active = localStorage.getItem("utenteAttivo");
if (active) loadDashboard(JSON.parse(active));
