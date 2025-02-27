function toggleTexto(id) {
    // Primero, buscamos el texto de la característica seleccionada
    var texto = document.getElementById(id);
    
    // Verificamos si el texto está visible o no
    if (texto.style.display === "block") {
        texto.style.display = "none"; // Oculta el texto si ya está visible
    } else {
        // Ocultamos cualquier texto visible
        const textosVisibles = document.querySelectorAll(".texto-oculto");
        textosVisibles.forEach(function(visibleTexto) {
            visibleTexto.style.display = "none";  // Oculta el texto previamente visible
        });
        
        // Muestra el texto seleccionado
        texto.style.display = "block"; 
    }
}