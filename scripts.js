document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.getElementById("menu-toggle");
    const menu = document.getElementById("menu");

    if (menuToggle && menu) {
        menuToggle.addEventListener("click", function () {
            menu.classList.toggle("hidden");
            console.log("Menú toggled:", menu.classList.contains("hidden") ? "Oculto" : "Visible"); // Depuración
        });
    } else {
        console.error("Error: No se encontró el botón de menú o el menú en el DOM.");
    }

    const wikiTecLink = document.querySelector(".wikitec");
    if (wikiTecLink) {
        wikiTecLink.addEventListener("click", function (event) {
            event.preventDefault(); // Evita comportamiento inesperado
            window.location.href = "index.html";
        });
    }
});

console.log("Script cargado correctamente");