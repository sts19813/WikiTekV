document.addEventListener("DOMContentLoaded", () => {
    // Alternar visibilidad del menú
    const menuToggle = document.getElementById("menu-toggle");
    const menu = document.getElementById("menu");

    menuToggle.addEventListener("click", () => {
        menu.classList.toggle("hidden");
    });

    const pages = ["inicio", "gerardo", "yuri", "miguel"];
    let currentPageIndex = 0;

    // Función para cambiar el fondo
    function updateBodyBackground(pageId) {
        document.body.classList.remove("body-portada", "body-gerardo", "body-yuri", "body-miguel");
        document.body.classList.add(`body-${pageId}`);
    }

    // Función para actualizar botones
    function updateButtons() {
        const prevButton = document.getElementById("prev-page");
        const nextButton = document.getElementById("next-page");
        prevButton.disabled = currentPageIndex === 0;
        nextButton.disabled = currentPageIndex === pages.length - 1;
    }

    // Función para cargar el contenido de la página
    function loadPage(pageId) {
        fetch("data.json")
            .then(response => response.json())
            .then(data => {
                const app = document.getElementById("app");

                // Verificar si el elemento existe
                if (!app) {
                    console.error("Elemento #app no encontrado");
                    return;
                }

                // Buscar la página en el JSON
                const pageData = data.pages.find(p => p.id === pageId);

                if (pageData) {
                    // Construir el HTML según el tipo de página
                    if (pageId === "inicio") {
                        app.innerHTML = `
                            <div class="hero-section">
                                <h2 class="bienvenida">${pageData.content.heading}</h2>
                                <p class="parrafo">${pageData.content.description}</p>
                                <div class="features-container">
                                    ${pageData.content.features.map(feature => `
                                        <div class="feature-card">
                                            <i class="fa-solid ${feature.icon}"></i>
                                            <h3>${feature.title}</h3>
                                            <p>${feature.description}</p>
                                        </div>
                                    `).join('')}
                                </div>
                                <div class="cta-section">
                                    <a href="${pageData.content.cta1.link}" class="boton primary-btn">
                                        <i class="fa-solid ${pageData.content.cta1.icon}"></i> ${pageData.content.cta1.text}
                                    </a>
                                    <a href="${pageData.content.cta2.link}" class="boton secondary-btn">
                                        <i class="fa-solid ${pageData.content.cta2.icon}"></i> ${pageData.content.cta2.text}
                                    </a>
                                </div>
                            </div>
                            <div class="mascot-section">
                                <img class="gif bounce-effect" src="${pageData.content.mascot.image}" alt="${pageData.content.mascot.alt}">
                                <div class="mascot-info pulse-effect">
                                    <p>${pageData.content.mascot.info}</p>
                                </div>
                            </div>
                        `;
                    } else {
                        // Para otras páginas (como 'Gerardo', 'lore', etc.)
                        app.innerHTML = `
                            <section>
                                <h2>${pageData.content.heading}</h2>
                                ${pageData.content.imagen ? `<img src="${pageData.content.imagen}" alt="${pageData.title}" class="perfil-img">` : ""}
                                <div>${pageData.content.description}</div>
                            </section>
                        `;
                    }
                } else {
                    console.warn(`No se encontró la página con ID: ${pageId}`);
                }
            })
            .catch(error => console.error("Error al cargar el JSON:", error));
    }

    // Función unificada de navegación
    function navigateToPage(index) {
        if (index < 0 || index >= pages.length) return;
        currentPageIndex = index;
        const pageId = pages[index];
        window.location.hash = `#${pageId}`;
        updateBodyBackground(pageId);
        updateButtons();
        loadPage(pageId);
    }

    // Eventos para botones
    document.getElementById("prev-page").addEventListener("click", () => navigateToPage(currentPageIndex - 1));
    document.getElementById("next-page").addEventListener("click", () => navigateToPage(currentPageIndex + 1));

    // Manejar cambios de hash (para el menú)
    window.addEventListener("hashchange", () => {
        const newPageId = location.hash.replace("#", "") || "inicio";
        const newIndex = pages.indexOf(newPageId);
        if (newIndex !== -1 && newIndex !== currentPageIndex) {
            currentPageIndex = newIndex;
            navigateToPage(newIndex);
        }
    });

    // Inicialización
    const initialPage = location.hash.replace("#", "") || "inicio";
    currentPageIndex = pages.indexOf(initialPage);
    if (currentPageIndex === -1) currentPageIndex = 0;
    navigateToPage(currentPageIndex);
});