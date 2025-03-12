document.addEventListener('DOMContentLoaded', () => {
    // ========== CONFIGURACIÓN GENERAL ==========
    const menuToggle = document.getElementById('menu-toggle');
    const menu = document.getElementById('menu');
    let personajesDisponibles = [];
    let currentTheme = localStorage.getItem('dark-theme') === 'true';

    // ========== FUNCIONES PRINCIPALES ==========
    const initializeApp = async () => {
        setupMenu();
        setupTheme();
        await loadCharacters();
        setupNavigation();
        setupAnimations();
        checkInitialView();
    };

    // ========== GESTIÓN DEL MENÚ ==========
    const setupMenu = () => {
        menuToggle.addEventListener('click', toggleMenu);
        document.addEventListener('click', closeMenuOnClickOutside);
        window.addEventListener('resize', handleResize);
        if (window.innerWidth < 768) menu.classList.add('hidden');
    };

    const toggleMenu = (e) => {
        e.stopPropagation();
        menu.classList.toggle('hidden');
    };

    const closeMenuOnClickOutside = (e) => {
        if (!menu.contains(e.target) && e.target !== menuToggle && window.innerWidth < 768) {
            menu.classList.add('hidden');
        }
    };

    const handleResize = () => {
        window.innerWidth >= 768 
            ? menu.classList.remove('hidden')
            : menu.classList.add('hidden');
    };

    // ========== TEMA OSCURO ==========
    const setupTheme = () => {
        const themeToggle = document.getElementById('theme-toggle');
        themeToggle?.addEventListener('click', toggleTheme);
        applyTheme(currentTheme);
    };

    const toggleTheme = () => {
        currentTheme = !currentTheme;
        applyTheme(currentTheme);
        localStorage.setItem('dark-theme', currentTheme);
    };

    const applyTheme = (isDark) => {
        document.body.classList.toggle('dark-theme', isDark);
        document.querySelectorAll('.dynamic-content').forEach(el => {
            el.classList.toggle('dark-theme', isDark);
        });
    };

    // ========== CARGA DE DATOS ==========
    const loadCharacters = async () => {
        try {
            const response = await fetch('data.json');
            const data = await response.json();
            personajesDisponibles = data.personajes;
            setupMenuNavigation();
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
        const section = urlParams.get('section');
        const characterId = urlParams.get('id');
        
        if (section === 'alumnos' || characterId) {
            showProfileSection(characterId);
        } else {
            showHomePage();
        }
    };

    // ========== MANEJO DE VISTAS MEJORADO ==========
    const showHomePage = () => {
        document.getElementById('home-content').classList.remove('hidden');
        document.getElementById('profile-content').classList.add('hidden');
        updateActiveMenuLink('home');
        window.scrollTo(0, 0);
    };

    const showProfileSection = (characterId = 'gerardo') => {
        const character = personajesDisponibles.find(c => c.id === characterId);
        if (!character) return;

        updateProfileContent(character);
        document.getElementById('home-content').classList.add('hidden');
        document.getElementById('profile-content').classList.remove('hidden');
        updateActiveMenuLink('alumnos');
        window.scrollTo(0, 0);
    };

    // ========== ACTUALIZACIÓN DE CONTENIDO ==========
    const updateProfileContent = (character) => {
        const updateElement = (id, content) => {
            const element = document.getElementById(id);
            if (element) element.textContent = content;
        };

        const updateImage = (id, src) => {
            const img = document.getElementById(id);
            if (img) {
                img.src = src;
                img.style.display = src ? 'block' : 'none';
            }
        };

        // Aplicar datos
        document.body.className = character.claseBody;
        updateElement('personaje-titulo', character.titulo);
        updateElement('personaje-biografia', character.biografia);
        updateElement('personaje-ocupacion', character.ocupacion);
        updateImage('personaje-imagen', character.imagenPerfil);
        updateImage('ocupacion-imagen', character.imagenOcupacion);

        // Generar características
        const featuresContainer = document.getElementById('caracteristicas-container');
        featuresContainer.innerHTML = character.caracteristicas.map((feat, index) => `
            <div class="caracteristica-item" data-delay="${index * 0.1}">
                <button class="boton" data-target="${feat.id}">${feat.tituloBoton}</button>
                <p id="${feat.id}" class="texto-oculto">${feat.contenido}</p>
            </div>
        `).join('');

        // Configurar eventos
        document.querySelectorAll('[data-target]').forEach(btn => {
            btn.addEventListener('click', () => toggleText(btn.dataset.target));
        });
    };

    // ========== INTERACTIVIDAD ==========
    const toggleText = (targetId) => {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.style.display = targetElement.style.display === 'block' ? 'none' : 'block';
        }
    };

    // ========== PAGINACIÓN MEJORADA ==========
    const navigatePrevious = () => navigateCharacters('prev');
    const navigateNext = () => navigateCharacters('next');

    const navigateCharacters = (direction) => {
        const currentId = new URLSearchParams(window.location.search).get('id');
        const currentIndex = personajesDisponibles.findIndex(c => c.id === currentId);
        const newIndex = direction === 'next' 
            ? (currentIndex + 1) % personajesDisponibles.length 
            : (currentIndex - 1 + personajesDisponibles.length) % personajesDisponibles.length;
        
        history.pushState({}, '', `?section=alumnos&id=${personajesDisponibles[newIndex].id}`);
        handleRouteChange();
    };

    // ========== NAVEGACIÓN DEL MENÚ ==========
    const setupMenuNavigation = () => {
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const section = this.dataset.section;
                
                if (window.innerWidth < 768) menu.classList.add('hidden');

                switch(section) {
                    case 'home':
                        history.pushState({}, '', '/');
                        showHomePage();
                        break;
                    case 'alumnos':
                        history.pushState({}, '', '?section=alumnos');
                        showProfileSection();
                        break;
                    default:
                        history.pushState({}, '', '/');
                        showHomePage();
                }
            });
        });
    };

    // ========== ACTUALIZAR ENLACE ACTIVO ==========
    const updateActiveMenuLink = (activeSection) => {
        document.querySelectorAll('nav a').forEach(link => {
            link.classList.toggle('active', link.dataset.section === activeSection);
        });
    };

    // ========== ANIMACIONES ==========
    const setupAnimations = () => {
        const animatedElements = document.querySelectorAll('.feature-card, .caracteristica-item');
        
        const checkVisibility = () => {
            animatedElements.forEach(el => {
                if (isElementVisible(el)) {
                    el.classList.add('animated');
                    el.style.animationDelay = el.dataset.delay || '0s';
                }
            });
        };

        window.addEventListener('scroll', checkVisibility);
        checkVisibility();
    };

    const isElementVisible = (el) => {
        const rect = el.getBoundingClientRect();
        return rect.top <= window.innerHeight * 0.75 && rect.bottom >= 0;
    };

    // ========== INICIALIZACIÓN FINAL ==========
    const checkInitialView = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const section = urlParams.get('section');
        const characterId = urlParams.get('id');

        if (section === 'alumnos' || characterId) {
            showProfileSection(characterId);
        } else {
            showHomePage();
        }
    };

    initializeApp();
});