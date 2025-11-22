// script.js

document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.getElementById("sidebar");
  const hamburger = document.getElementById("hamburger");
  const closeSidebar = document.getElementById("closeSidebar");

  const dashboard = document.getElementById("dashboard");
  const assenzePage = document.getElementById("assenzePage");
  const openAssenzeBtn = document.getElementById("openAssenze");
  const backToDashboardBtn = document.getElementById("backToDashboard");

  const assenzeForm = document.querySelector(".assenze-form");
  const assenzeFeedback = document.getElementById("assenzeFeedback");

  // APRI SIDEBAR
  hamburger.addEventListener("click", () => {
    sidebar.classList.add("open");
  });

  // CHIUDI SIDEBAR
  closeSidebar.addEventListener("click", () => {
    sidebar.classList.remove("open");
  });

  // CHIUDI SIDEBAR CLICCANDO FUORI
  document.addEventListener("click", (event) => {
    const clickInsideSidebar = sidebar.contains(event.target);
    const clickOnHamburger = hamburger.contains(event.target);
    if (!clickInsideSidebar && !clickOnHamburger) {
      sidebar.classList.remove("open");
    }
  });

  // APRI PAGINA ASSENZE
  if (openAssenzeBtn) {
    openAssenzeBtn.addEventListener("click", () => {
      dashboard.classList.add("hidden");
      assenzePage.classList.remove("hidden");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // TORNA ALLA DASHBOARD
  if (backToDashboardBtn) {
    backToDashboardBtn.addEventListener("click", () => {
      assenzePage.classList.add("hidden");
      dashboard.classList.remove("hidden");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // INVIO FINTA RICHIESTA ASSENZA (solo feedback visivo)
  if (assenzeForm && assenzeFeedback) {
    assenzeForm.addEventListener("submit", (e) => {
      e.preventDefault();
      assenzeFeedback.classList.remove("hidden");

      // Reset di base (puoi modificarlo in futuro)
      assenzeForm.reset();

      setTimeout(() => {
        assenzeFeedback.classList.add("hidden");
      }, 4000);
    });
  }
});
