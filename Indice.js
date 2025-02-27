document.getElementById("menu-toggle").addEventListener("click", function() {
    document.getElementById("menu").classList.toggle("hidden");
});

document.addEventListener("DOMContentLoaded", function () {
    const wikiTecLink = document.querySelector(".wikitec");

    if (wikiTecLink) {
        wikiTecLink.addEventListener("click", function () {
            window.location.href = "index.html"; // Reemplaza con la URL de tu menú principal
        });
    }
});