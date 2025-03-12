document.addEventListener('DOMContentLoaded', () => {
    // Cargar datos del JSON
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            const urlParams = new URLSearchParams(window.location.search);
            const personajeId = urlParams.get('id') || 'gerardo';
            const personaje = data.personajes.find(p => p.id === personajeId);
            
            if (personaje) {
                cargarPersonaje(personaje);
                configurarPaginacion(data.personajes);
            }
        });
});

function cargarPersonaje(personaje) {
    // Configurar body
    document.body.className = personaje.claseBody;

    // Actualizar contenido
    document.getElementById('personaje-titulo').textContent = personaje.titulo;
    document.getElementById('personaje-imagen').src = personaje.imagenPerfil;
    document.getElementById('personaje-biografia').textContent = personaje.biografia;
    document.getElementById('personaje-ocupacion').textContent = personaje.ocupacion;
    
    // Imagen de ocupación (si existe)
    const ocupacionImg = document.getElementById('ocupacion-imagen');
    if (personaje.imagenOcupacion) {
        ocupacionImg.src = personaje.imagenOcupacion;
        ocupacionImg.style.display = 'block';
    } else {
        ocupacionImg.style.display = 'none';
    }

    // Generar características
    const caracteristicasContainer = document.getElementById('caracteristicas-container');
    caracteristicasContainer.innerHTML = personaje.caracteristicas.map(c => `
        <div class="caracteristica-item">
            <button class="boton" onclick="toggleTexto('${c.id}')">${c.tituloBoton}</button>
            <p id="${c.id}" class="texto-oculto">${c.contenido}</p>
        </div>
    `).join('');
}

function configurarPaginacion(personajes) {
    const paginacionContainer = document.getElementById('paginacion');
    paginacionContainer.innerHTML = personajes.map(p => `
        <a href="?id=${p.id}" class="paginacion">${p.titulo}</a>
    `).join(' | ');
}

// Función toggle existente
function toggleTexto(id) {
    const texto = document.getElementById(id);
    texto.style.display = texto.style.display === "block" ? "none" : "block";
}

// Mantener lógica del menú (si es necesario)
document.getElementById('menu-toggle').addEventListener('click', () => {
    document.getElementById('menu').classList.toggle('hidden');
});

document.addEventListener('DOMContentLoaded', () => {
    // Control del menú
    document.getElementById('menu-toggle').addEventListener('click', () => {
        document.getElementById('menu').classList.toggle('hidden');
    });

    // Cargar contenido inicial
    cargarContenido();

    // Control de navegación
    window.addEventListener('popstate', () => cargarContenido());
    document.getElementById('prev-page').addEventListener('click', navegarAnterior);
    document.getElementById('next-page').addEventListener('click', navegarSiguiente);
});

async function cargarContenido() {
    const urlParams = new URLSearchParams(window.location.search);
    const personajeId = urlParams.get('id');
    
    if (personajeId) {
        await cargarPersonaje(personajeId);
        mostrarSeccionPerfil();
    } else {
        mostrarSeccionInicio();
    }
}

async function cargarPersonaje(id) {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        const personaje = data.personajes.find(p => p.id === id);
        
        if (!personaje) return;

        // Actualizar contenido
        document.getElementById('dynamic-body').className = personaje.claseBody;
        document.getElementById('personaje-titulo').textContent = personaje.titulo;
        document.getElementById('personaje-imagen').src = personaje.imagenPerfil;
        document.getElementById('personaje-biografia').textContent = personaje.biografia;
        document.getElementById('personaje-ocupacion').textContent = personaje.ocupacion;

        // Imagen de ocupación
        const ocupacionImg = document.getElementById('ocupacion-imagen');
        if (personaje.imagenOcupacion) {
            ocupacionImg.src = personaje.imagenOcupacion;
            ocupacionImg.style.display = 'block';
        } else {
            ocupacionImg.style.display = 'none';
        }

        // Características
        const caracteristicasContainer = document.getElementById('caracteristicas-container');
        caracteristicasContainer.innerHTML = personaje.caracteristicas.map(c => `
            <div class="caracteristica-item">
                <button class="boton" onclick="toggleTexto('${c.id}')">${c.tituloBoton}</button>
                <p id="${c.id}" class="texto-oculto">${c.contenido}</p>
            </div>
        `).join('');

    } catch (error) {
        console.error('Error cargando datos:', error);
    }
}

function toggleTexto(id) {
    const texto = document.getElementById(id);
    texto.style.display = texto.style.display === "block" ? "none" : "block";
}

// Navegación
function navegarSiguiente() {
    const personajes = ['gerardo', 'yuri'];
    const currentId = new URLSearchParams(window.location.search).get('id');
    const currentIndex = personajes.indexOf(currentId);
    const newIndex = (currentIndex + 1) % personajes.length;
    actualizarURL(personajes[newIndex]);
}

function navegarAnterior() {
    const personajes = ['gerardo', 'yuri'];
    const currentId = new URLSearchParams(window.location.search).get('id');
    const currentIndex = personajes.indexOf(currentId);
    const newIndex = (currentIndex - 1 + personajes.length) % personajes.length;
    actualizarURL(personajes[newIndex]);
}

function actualizarURL(id) {
    history.pushState({}, '', `?id=${id}`);
    cargarContenido();
}

// Control de vistas
function mostrarSeccionPerfil() {
    document.getElementById('home-content').classList.add('hidden');
    document.getElementById('profile-content').classList.remove('hidden');
}

function mostrarSeccionInicio() {
    document.getElementById('home-content').classList.remove('hidden');
    document.getElementById('profile-content').classList.add('hidden');
}