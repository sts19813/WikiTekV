document.addEventListener("DOMContentLoaded", () => {
    // Funcionalidad para alternar la visibilidad del menú
    const menuToggle = document.getElementById("menu-toggle");
    const menu = document.getElementById("menu");
    
    menuToggle.addEventListener("click", () => {
        menu.classList.toggle("hidden");
    });

    // Función para cargar el contenido de la página según el hash
    function loadPage(pageId) {
        fetch("data.json")
            .then(response => response.json())
            .then(data => {
                console.log("Datos cargados:", data); // Ver qué se está cargando realmente

                // Verificación de la estructura esperada del JSON
                if (!data || !data.pages) {
                    console.error("El JSON no tiene la estructura esperada:", data);
                    return;
                }

                // Buscamos el objeto de la página correspondiente en el JSON
                const pageData = data.pages.find(p => p.id.toLowerCase() === pageId.toLowerCase());

                if (pageData) {
                    document.title = pageData.title;
                    const app = document.getElementById("app");

                    // Si la página es la de inicio, construimos el contenido completo con hero, features, cta y mascota
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

                    // **Actualizar menú dinámicamente**
                    const firstPage = data.pages.find(p => p.id === "inicio");
                    if (firstPage && firstPage.header) {
                        const menuList = document.querySelector("#menu ul");
                        menuList.innerHTML = "";
                        firstPage.header.menu.forEach(item => {
                            const li = document.createElement("li");
                            const a = document.createElement("a");
                            a.textContent = item.name;
                            a.href = `#${item.target}`;
                            li.appendChild(a);
                            menuList.appendChild(li);
                        });
                    }

                    // **Actualizar footer dinámicamente**
                    if (firstPage && firstPage.footer) {
                        document.querySelector("footer .footer-content p").textContent = firstPage.footer.text;
                        const socialLinksContainer = document.getElementById("social-links");
                        socialLinksContainer.innerHTML = "";
                        Object.entries(firstPage.footer.socialLinks).forEach(([key, url]) => {
                            const a = document.createElement("a");
                            a.href = url;
                            a.classList.add("social-icon");
                            a.innerHTML = `<i class="fa-brands fa-${key}"></i>`;
                            socialLinksContainer.appendChild(a);
                        });
                    }
                } else {
                    console.warn(`No se encontró la página con ID: ${pageId}`);
                }
            })
            .catch(error => console.error("Error al cargar el JSON:", error));
    }

    // Escuchar cambios en el hash para navegar sin recargar la página
    window.addEventListener("hashchange", () => {
        const pageId = location.hash.replace("#", "") || "inicio";
        loadPage(pageId);
    });

    // Cargar la página inicial (por defecto o según el hash actual)
    const initialPage = location.hash.replace("#", "") || "inicio";
    loadPage(initialPage);
});