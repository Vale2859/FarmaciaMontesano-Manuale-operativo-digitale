// Apri il menu
document.getElementById("hamburger").addEventListener("click", () => {
    document.getElementById("sidebar").classList.add("open");
});

// Chiudi il menu
document.getElementById("closeSidebar").addEventListener("click", () => {
    document.getElementById("sidebar").classList.remove("open");
});
