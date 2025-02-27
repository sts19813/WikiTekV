document.addEventListener('DOMContentLoaded', function() {
    // Gestión del menú
    const menuToggle = document.getElementById('menu-toggle');
    const menu = document.getElementById('menu');
    
    // Añadir clase active al enlace de la página actual
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const menuLinks = document.querySelectorAll('nav ul li a');
    
    menuLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage || 
            (currentPage === '' && linkHref === 'index.html') ||
            (currentPage === 'index.html' && linkHref === '#') ||
            (currentPage === 'Índice.html' && linkHref === 'indice.html')) {
            link.classList.add('active');
        }
        
        // Cerrar menú al hacer clic en enlaces (en móviles)
        link.addEventListener('click', function() {
            if (window.innerWidth < 768) {
                menu.classList.add('hidden');
            }
        });
    });
    
    // Alternar menú al hacer clic en el botón
    menuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        menu.classList.toggle('hidden');
    });
    
    // Cerrar menú al hacer clic fuera de él
    document.addEventListener('click', function(e) {
        if (!menu.contains(e.target) && e.target !== menuToggle && window.innerWidth < 768) {
            menu.classList.add('hidden');
        }
    });
    
    // Ajustar menú en cambio de tamaño de ventana
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 768) {
            menu.classList.remove('hidden');
        } else if (!menuToggle.classList.contains('active')) {
            menu.classList.add('hidden');
        }
    });
    
    // Inicialización del menú
    if (window.innerWidth < 768) {
        menu.classList.add('hidden');
    } else {
        menu.classList.remove('hidden');
    }
    
    // Animaciones para las tarjetas de características
    const featureCards = document.querySelectorAll('.feature-card');
    
    // Función para comprobar si un elemento está en el viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    // Función para animar elementos cuando son visibles
    function animateOnScroll() {
        featureCards.forEach(card => {
            if (isInViewport(card) && !card.classList.contains('animated')) {
                card.classList.add('animated');
                card.style.animationDelay = `${parseInt(card.style.getPropertyValue('--i')) * 0.2}s`;
                card.style.animationPlayState = 'running';
            }
        });
    }
    
    // Añadir evento de scroll para las animaciones
    window.addEventListener('scroll', animateOnScroll);
    
    // Ejecutar la animación al cargar la página
    animateOnScroll();
    
    // Detector de cambio de tema (claro/oscuro)
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-theme');
            
            // Opcional: guardar preferencia de tema en localStorage
            const isDarkTheme = document.body.classList.contains('dark-theme');
            localStorage.setItem('dark-theme', isDarkTheme);
        });
        
        // Cargar tema guardado
        if (localStorage.getItem('dark-theme') === 'true') {
            document.body.classList.add('dark-theme');
        }
    }
});