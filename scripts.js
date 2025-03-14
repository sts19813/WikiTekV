document.addEventListener('DOMContentLoaded', () => {
    // ========== CONFIGURACIÓN GLOBAL ==========
    const menuToggle = document.getElementById('menu-toggle');
    const menu = document.getElementById('menu');
    const footer = document.querySelector('footer');
    let currentData = null;
    let currentPageId = 'inicio';
    let pages = [];
    const profilePages = ['gerardo', 'yuri', 'miguel','fer']; // Array específico de perfiles

    // ========== GENERADORES DE CONTENIDO ==========
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
        const menuContainer = document.querySelector('nav ul');
        const menuItems = currentData.pages.find(p => p.id === 'inicio').header.menu;
        
        menuContainer.innerHTML = menuItems.map(item => `
            <li>
                <a href="#${item.target}" data-page="${item.target === 'alumnos' ? 'gerardo' : item.target}">
                    <i class="fa-solid fa-${item.icon || 'circle'}"></i>
                    ${item.name}
                </a>
            </li>
        `).join('');

        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            menu.classList.toggle('hidden');
            menuToggle.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!menu.contains(e.target)) {
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
        const subPages = {
            'alumnos': 'gerardo',
            'gerardo': 'gerardo',
            'yuri': 'yuri',
            'miguel': 'miguel'
        };
    
        const targetPage = subPages[pageId] || pageId;
        
        if (!pages.includes(targetPage)) return;
        
        const navButtons = document.querySelector('.navigation-buttons');
        const isProfilePage = profilePages.includes(targetPage);
        navButtons.style.display = isProfilePage ? 'flex' : 'none';
        
        // Actualizar currentPageId aquí
        currentPageId = targetPage; // <--- Añade esta línea
        
        history.pushState({ pageId: targetPage }, '', `?page=${targetPage}`);
        updateContent(targetPage);
        updateActiveLink(targetPage);
        updateBackground(targetPage);
        
        if (isProfilePage) updateButtonStates();
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

    // ========== FUNCIONES AUXILIARES ==========
    const updateBackground = (pageId) => {
        const bgImage = currentData.pages.find(p => p.id === pageId).background;
        document.body.style.backgroundImage = `url(${bgImage})`;
    };

    const updateActiveLink = (pageId) => {
        document.querySelectorAll('nav a').forEach(link => {
            link.classList.toggle('active', link.dataset.page === pageId);
        });
    };

    const updateFooter = () => {
        const footerData = currentData.pages.find(p => p.id === 'inicio').footer;
        footer.querySelector('p').textContent = footerData.text;
        footer.querySelector('.social-links').innerHTML = `
            <a href="${footerData.socialLinks.facebook}"><i class="fa-brands fa-facebook"></i></a>
            <a href="${footerData.socialLinks.twitter}"><i class="fa-brands fa-twitter"></i></a>
            <a href="${footerData.socialLinks.instagram}"><i class="fa-brands fa-instagram"></i></a>
        `;
    };

    // ========== NAVEGACIÓN MEJORADA ==========
    const updateButtonStates = () => {
        const currentIndex = profilePages.indexOf(currentPageId);
        document.getElementById('prev-page').disabled = currentIndex <= 0;
        document.getElementById('next-page').disabled = currentIndex >= profilePages.length - 1;
    };

    const navigatePrevious = () => {
        const currentIndex = profilePages.indexOf(currentPageId);
        if (currentIndex > 0) {
            navigateToPage(profilePages[currentIndex - 1]);
        }
    };

    const navigateNext = () => {
        const currentIndex = profilePages.indexOf(currentPageId);
        if (currentIndex < profilePages.length - 1) {
            navigateToPage(profilePages[currentIndex + 1]);
        }
    };

    const handleInitialLoad = () => {
        const urlParams = new URLSearchParams(window.location.search);
        currentPageId = urlParams.get('page') || 'inicio';
        
        const navButtons = document.querySelector('.navigation-buttons');
        const isProfilePage = profilePages.includes(currentPageId);
        navButtons.style.display = isProfilePage ? 'flex' : 'none';
        
        if (isProfilePage) updateButtonStates();
        
        navigateToPage(currentPageId);
    };

    const showErrorState = () => {
        document.getElementById('app').innerHTML = `
            <div class="error">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <h2>Error al cargar los datos</h2>
                <button onclick="location.reload()">Recargar</button>
            </div>
        `;
    };

    initApp();
});
