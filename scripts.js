document.addEventListener('DOMContentLoaded', () => {
    // ========== CONFIGURACIÓN GLOBAL ==========
    const menuToggle = document.getElementById('menu-toggle');
    const menu = document.getElementById('menu');
    const footer = document.querySelector('footer');
    let currentData = null;
    let currentPageId = 'inicio';
    let pages = [];

    // ========== INICIALIZACIÓN ==========
    const initApp = async () => {
        await loadJSONData();
        setupMenu();
        setupNavigation();
        handleInitialLoad();
        updateFooter();
    };

    // ========== CARGA DE DATOS ==========
    const loadJSONData = async () => {
        try {
            const response = await fetch('data.json');
            currentData = await response.json();
            pages = currentData.pages.map(p => p.id);
        } catch (error) {
            console.error('Error cargando datos:', error);
            showErrorState();
        }
    };

    // ========== CONFIGURACIÓN DEL MENÚ ==========
    const setupMenu = () => {
        // Generar menú dinámico
        const menuContainer = document.querySelector('nav ul');
        const menuItems = currentData.pages.find(p => p.id === 'inicio').header.menu;
        
        menuContainer.innerHTML = menuItems.map(item => `
            <li>
                <a href="#${item.target}" data-page="${item.target}">
                    <i class="fa-solid fa-${item.icon || 'circle'}"></i>
                    ${item.name}
                </a>
            </li>
        `).join('');

        // Eventos del menú (CORRECCIÓN APLICADA)
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            menu.classList.toggle('hidden');
            menuToggle.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!menu.contains(e.target)) { // Paréntesis añadido
                menu.classList.add('hidden');
                menuToggle.classList.remove('active');
            }
        });

        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                currentPageId = link.dataset.page;
                navigateToPage(currentPageId);
            });
        });
    };

    // ========== SISTEMA DE NAVEGACIÓN ==========
    const setupNavigation = () => {
        document.getElementById('prev-page').addEventListener('click', navigatePrevious);
        document.getElementById('next-page').addEventListener('click', navigateNext);
        window.addEventListener('popstate', handlePopState);
    };

    const navigateToPage = (pageId) => {
        if (!pages.includes(pageId)) return;
        
        // Actualizar visibilidad de botones
        const navButtons = document.querySelector('.navigation-buttons');
        const isProfilePage = ['gerardo', 'yuri', 'miguel'].includes(pageId);
        navButtons.style.display = isProfilePage ? 'flex' : 'none';
        
        // Resto de la lógica existente
        history.pushState({ pageId }, '', `?page=${pageId}`);
        updateContent(pageId);
        updateActiveLink(pageId);
        updateBackground(pageId);
    };

    const handlePopState = () => {
        const urlParams = new URLSearchParams(window.location.search);
        currentPageId = urlParams.get('page') || 'inicio';
        navigateToPage(currentPageId);
    };

    // ========== ACTUALIZACIÓN DE CONTENIDO ==========
    const updateContent = (pageId) => {
        const pageData = currentData.pages.find(p => p.id === pageId);
        const appContainer = document.getElementById('app');

        if (!pageData) {
            appContainer.innerHTML = '<p>Contenido no encontrado</p>';
            return;
        }

        appContainer.innerHTML = pageId === 'inicio' 
            ? generateHomeContent(pageData) 
            : generateProfileContent(pageData);
    };

    const generateHomeContent = (data) => `
        <div class="hero-section">
            <h1>${data.content.heading}</h1>
            <p class="welcome-text">${data.content.description}</p>
            
            <div class="features-container">
                ${data.content.features.map(feat => `
                    <div class="feature-card">
                        <i class="fa-solid ${feat.icon}"></i>
                        <h3>${feat.title}</h3>
                        <p>${feat.description}</p>
                    </div>
                `).join('')}
            </div>
            
            <div class="cta-section">
                <a href="${data.content.cta1.link}" class="cta-button">
                    <i class="fa-solid ${data.content.cta1.icon}"></i>
                    ${data.content.cta1.text}
                </a>
                <a href="${data.content.cta2.link}" class="cta-button">
                    <i class="fa-solid ${data.content.cta2.icon}"></i>
                    ${data.content.cta2.text}
                </a>
            </div>
            
            <div class="mascot-section">
                <img src="${data.content.mascot.image}" alt="${data.content.mascot.alt}" class="mascot">
                <p>${data.content.mascot.info}</p>
            </div>
        </div>
    `;

    const generateProfileContent = (data) => `
    <section class="profile-content">
        <h2>${data.content.heading}</h2>
        <div class="profile-grid">
            <img src="${data.content.imagen}" alt="${data.title}" class="profile-image">
            
            <div class="profile-info">
                <p>${data.content.description}</p>
                
                <div class="info-sections">
                    ${data.content.info_adicional.map(section => `
                        <div class="info-card">
                            <div class="info-header">
                                <i class="fa-solid ${section.icono}"></i>
                                <h3>${section.titulo}</h3>
                            </div>
                            <p>${section.contenido}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    </section>
`;

    // ========== ACTUALIZACIÓN DE ESTILOS ==========
    const updateBackground = (pageId) => {
        const bgImage = currentData.pages.find(p => p.id === pageId).background;
        document.body.style.backgroundImage = `url(${bgImage})`;
    };

    const updateActiveLink = (pageId) => {
        document.querySelectorAll('nav a').forEach(link => {
            link.classList.toggle('active', link.dataset.page === pageId);
        });
    };

    // ========== FOOTER DINÁMICO ==========
    const updateFooter = () => {
        const footerData = currentData.pages.find(p => p.id === 'inicio').footer;
        
        footer.querySelector('p').textContent = footerData.text;
        
        const socialLinks = footer.querySelector('.social-links');
        socialLinks.innerHTML = `
            <a href="${footerData.socialLinks.facebook}" class="social-icon">
                <i class="fa-brands fa-facebook"></i>
            </a>
            <a href="${footerData.socialLinks.twitter}" class="social-icon">
                <i class="fa-brands fa-twitter"></i>
            </a>
            <a href="${footerData.socialLinks.instagram}" class="social-icon">
                <i class="fa-brands fa-instagram"></i>
            </a>
        `;
    };

    // ========== NAVEGACIÓN ==========
    const navigatePrevious = () => {
        const currentIndex = pages.indexOf(currentPageId);
        const newIndex = (currentIndex - 1 + pages.length) % pages.length;
        navigateToPage(pages[newIndex]);
    };

    const navigateNext = () => {
        const currentIndex = pages.indexOf(currentPageId);
        const newIndex = (currentIndex + 1) % pages.length;
        navigateToPage(pages[newIndex]);
    };

    const handleInitialLoad = () => {
        const urlParams = new URLSearchParams(window.location.search);
        currentPageId = urlParams.get('page') || 'inicio';
        
        // Ocultar/mostrar botones inicialmente
        const navButtons = document.querySelector('.navigation-buttons');
        navButtons.style.display = ['gerardo', 'yuri', 'miguel'].includes(currentPageId) 
            ? 'flex' 
            : 'none';
        
        navigateToPage(currentPageId);
    };

    const showErrorState = () => {
        document.getElementById('app').innerHTML = `
            <div class="error">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <h2>Error al cargar los datos</h2>
                <button onclick="location.reload()">Recargar página</button>
            </div>
        `;
    };

    initApp();
});

