// Apertura e chiusura del menu laterale

const sidebar = document.getElementById("sidebar");
const hamburger = document.getElementById("hamburger");
const closeSidebarBtn = document.getElementById("closeSidebar");

hamburger.addEventListener("click", () => {
  sidebar.classList.add("open");
});

closeSidebarBtn.addEventListener("click", () => {
  sidebar.classList.remove("open");
});

// Chiudi sidebar cliccando fuori (solo su schermi più grandi è comodo)
document.addEventListener("click", (event) => {
  if (!sidebar.classList.contains("open")) return;

  const clickInsideSidebar = sidebar.contains(event.target);
  const clickOnHamburger = hamburger.contains(event.target);

  if (!clickInsideSidebar && !clickOnHamburger) {
    sidebar.classList.remove("open");
  }
});
