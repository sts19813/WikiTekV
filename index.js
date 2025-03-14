document.addEventListener('DOMContentLoaded', () => {
    // ========== CONFIGURACIÓN GENERAL ==========
    const menuToggle = document.getElementById('menu-toggle');
    const menu = document.getElementById('menu');
    let personajesDisponibles = [];
    let currentTheme = localStorage.getItem('dark-theme') === 'true';

    // ========== FUNCIONES PRINCIPALES ==========
    const initializeApp = async () => {
        setupMenu();
        await loadCharacters();
        setupNavigation();
        setupMenuNavigation();
        checkInitialView();
    };

    // ========== GESTIÓN DEL MENÚ ==========
    const setupMenu = () => {
        menuToggle.addEventListener('click', toggleMenu);
        document.addEventListener('click', closeMenuOnClickOutside);
        window.addEventListener('resize', handleResize);
    };

    const toggleMenu = (e) => {
        e.stopPropagation();
        menu.classList.toggle('hidden');
        menuToggle.classList.toggle('active');
    };

    const closeMenuOnClickOutside = (e) => {
        if (!menu.contains(e.target) && e.target !== menuToggle) {
            menu.classList.add('hidden');
            menuToggle.classList.remove('active');
        }
    };

    const handleResize = () => {
        if (window.innerWidth >= 768) {
            menu.classList.remove('hidden');
        } else {
            menu.classList.add('hidden');
        }
    };

    // ========== CARGA DE DATOS ==========
    const loadCharacters = async () => {
        try {
            const response = await fetch('data.json');
            const data = await response.json();
            personajesDisponibles = data.personajes;
        } catch (error) {
            console.error('Error cargando datos:', error);
        }
    };

    // ========== NAVEGACIÓN Y RUTEO ==========
    const setupNavigation = () => {
        window.addEventListener('popstate', handleRouteChange);
        document.getElementById('prev-page').addEventListener('click', navigatePrevious);
        document.getElementById('next-page').addEventListener('click', navigateNext);
    };

    const handleRouteChange = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const characterId = urlParams.get('id');
        characterId ? showProfileSection(characterId) : showHomePage();
    };

    // ========== MANEJO DE VISTAS ==========
    const showHomePage = () => {
        document.getElementById('app').innerHTML = `
            <div class="hero-section">
                <h1>Bienvenido a WikiTec</h1>
                <div class="features-container">
                    <div class="feature-card">
                        <h3>Comunidad</h3>
                        <p>Únete a nuestra comunidad de aprendizaje</p>
                    </div>
                    <div class="feature-card">
                        <h3>Recursos</h3>
                        <p>Encuentra materiales y guías útiles</p>
                    </div>
                </div>
            </div>
        `;
        updateActiveMenuLink('home');
    };

    const showProfileSection = (characterId) => {
        const character = personajesDisponibles.find(c => c.id === characterId);
        if (!character) return;

        document.getElementById('app').innerHTML = `
            <section class="profile-content">
                <h2 id="personaje-titulo">${character.titulo}</h2>
                <div class="content-wrapper">
                    <img src="${character.imagenPerfil}" class="profile-image">
                    <div class="text-content">
                        <p>${character.biografia}</p>
                        <div class="features-container" id="caracteristicas-container"></div>
                    </div>
                </div>
            </section>
        `;
        updateActiveMenuLink('alumnos');
    };

    // ========== NAVEGACIÓN DEL MENÚ ==========
    const setupMenuNavigation = () => {
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const target = this.getAttribute('href').substring(1);
                
                if (target === 'Gerardo') {
                    history.pushState({}, '', `?id=gerardo`);
                    showProfileSection('gerardo');
                } else {
                    history.pushState({}, '', '/');
                    showHomePage();
                }
                
                if (window.innerWidth < 768) {
                    menu.classList.add('hidden');
                    menuToggle.classList.remove('active');
                }
            });
        });
    };

    // ========== PAGINACIÓN ==========
    const navigatePrevious = () => navigate(-1);
    const navigateNext = () => navigate(1);

    const navigate = (direction) => {
        const currentId = new URLSearchParams(window.location.search).get('id');
        const currentIndex = personajesDisponibles.findIndex(c => c.id === currentId);
        const newIndex = (currentIndex + direction + personajesDisponibles.length) % personajesDisponibles.length;
        
        history.pushState({}, '', `?id=${personajesDisponibles[newIndex].id}`);
        showProfileSection(personajesDisponibles[newIndex].id);
    };

    // ========== INICIALIZACIÓN ==========
    const checkInitialView = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const characterId = urlParams.get('id');
        characterId ? showProfileSection(characterId) : showHomePage();
    };

    const updateActiveMenuLink = (activeSection) => {
        document.querySelectorAll('nav a').forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${activeSection}`);
        });
    };

    initializeApp();
});