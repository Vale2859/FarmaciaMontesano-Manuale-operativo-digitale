// Riferimenti
const sidebar = document.getElementById("sidebar");
const hamburger = document.getElementById("hamburger");
const closeSidebarBtn = document.getElementById("closeSidebar");

// Apri sidebar
hamburger.addEventListener("click", () => {
  sidebar.classList.add("open");
});

// Chiudi sidebar col bottone X
closeSidebarBtn.addEventListener("click", () => {
  sidebar.classList.remove("open");
});

// Chiudi sidebar cliccando fuori (desktop / tablet)
document.addEventListener("click", (event) => {
  if (!sidebar.classList.contains("open")) return;

  const clickInsideSidebar = sidebar.contains(event.target);
  const clickOnHamburger = hamburger.contains(event.target);

  if (!clickInsideSidebar && !clickOnHamburger) {
    sidebar.classList.remove("open");
  }
});
