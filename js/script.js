document.addEventListener('DOMContentLoaded', () => {
    // 1. Menú Hamburguesa
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        const toggleMenu = () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            navLinks.classList.toggle('activo');
        };
        menuToggle.addEventListener('click', toggleMenu);
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => { if (navLinks.classList.contains('activo')) toggleMenu(); });
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('activo')) { toggleMenu(); menuToggle.focus(); }
        });
        document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !navLinks.contains(e.target) && navLinks.classList.contains('activo')) toggleMenu();
        });
    }

    // 2. Footer Año
    const anioElemento = document.getElementById('anio-actual');
    if (anioElemento) anioElemento.textContent = new Date().getFullYear();

    // 3. Filtros del Catálogo
    const btnFiltros = document.querySelectorAll('.btn-filtro');
    const productos = document.querySelectorAll('.producto-item');

    if (btnFiltros.length > 0 && productos.length > 0) {
        btnFiltros.forEach(btn => {
            btn.addEventListener('click', () => {
                btnFiltros.forEach(b => b.classList.remove('activo'));
                btn.classList.add('activo');
                const categoria = btn.getAttribute('data-categoria');
                productos.forEach(producto => {
                    producto.style.display = (categoria === 'todos' || producto.getAttribute('data-categoria') === categoria) ? 'flex' : 'none';
                });
            });
        });
    }

    // 4. Lightbox
    const galeriaItems = document.querySelectorAll('.galeria-item img');
    const lightbox = document.getElementById('lightbox');
    if (galeriaItems.length > 0 && lightbox) {
        const imgLightbox = lightbox.querySelector('.lightbox-img');
        const btnCerrar = lightbox.querySelector('.lightbox-cerrar');
        let indiceActual = 0;

        const abrirLightbox = (index) => {
            indiceActual = index; imgLightbox.src = galeriaItems[indiceActual].src; imgLightbox.alt = galeriaItems[indiceActual].alt;
            lightbox.classList.add('activo'); lightbox.setAttribute('aria-hidden', 'false'); btnCerrar.focus();
        };
        const cerrarLightbox = () => { lightbox.classList.remove('activo'); lightbox.setAttribute('aria-hidden', 'true'); };
        const cambiarImagen = (dir) => {
            indiceActual = (indiceActual + dir + galeriaItems.length) % galeriaItems.length;
            imgLightbox.src = galeriaItems[indiceActual].src; imgLightbox.alt = galeriaItems[indiceActual].alt;
        };

        galeriaItems.forEach((img, i) => {
            img.parentElement.addEventListener('click', () => abrirLightbox(i));
            img.parentElement.addEventListener('keydown', (e) => { if (e.key === 'Enter') abrirLightbox(i); });
        });
        btnCerrar.addEventListener('click', cerrarLightbox);
        lightbox.querySelector('.lightbox-prev').addEventListener('click', () => cambiarImagen(-1));
        lightbox.querySelector('.lightbox-next').addEventListener('click', () => cambiarImagen(1));
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) cerrarLightbox(); });
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('activo')) return;
            if (e.key === 'Escape') cerrarLightbox();
            if (e.key === 'ArrowLeft') cambiarImagen(-1);
            if (e.key === 'ArrowRight') cambiarImagen(1);
        });
    }

    // 5. Validación Formulario
    const formContacto = document.getElementById('form-contacto');
    if (formContacto) {
        formContacto.addEventListener('submit', (e) => {
            const nombre = document.getElementById('nombre'), correo = document.getElementById('correo'), mensaje = document.getElementById('mensaje');
            let valido = true;
            const mostrarError = (input, mostrar) => {
                const error = document.getElementById(`error-${input.id}`);
                error.style.display = mostrar ? 'block' : 'none';
                input.setAttribute('aria-invalid', mostrar ? 'true' : 'false');
                if (mostrar) valido = false;
            };
            mostrarError(nombre, nombre.value.trim() === '');
            mostrarError(correo, !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.value.trim()));
            mostrarError(mensaje, mensaje.value.trim() === '');
            if (!valido) { e.preventDefault(); document.getElementById('form-mensajes').textContent = "Por favor, corrige los errores en el formulario."; }
        });
    }

    // 6. Imágenes rotas
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            this.onerror = null;
            this.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22100%25%22%20height%3D%22100%25%22%20viewBox%3D%220%200%20100%20100%22%20preserveAspectRatio%3D%22none%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23eee%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22%23999%22%20font-family%3D%22sans-serif%22%20font-size%3D%2214px%22%3EImagen%20no%20disponible%3C%2Ftext%3E%3C%2Fsvg%3E';
        });
    });

    const mediaQueryMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    // 7. Animaciones Fade In
    if (!mediaQueryMotion.matches) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
            });
        }, { threshold: 0.1 });
        document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
    } else {
        document.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible'));
    }

    // 8. Carrusel de Instalaciones (Inferior)
    const carruselSlides = document.querySelector('.carrusel-slides');
    if (carruselSlides) {
        const slides = document.querySelectorAll('.carrusel-slide');
        const indicadoresContenedor = document.querySelector('.carrusel-indicadores');
        let slideIndex = 0, intervalo;

        slides.forEach((_, i) => {
            const dot = document.createElement('div'); dot.classList.add('indicador');
            if (i === 0) dot.classList.add('activo');
            dot.addEventListener('click', () => irASlide(i));
            indicadoresContenedor.appendChild(dot);
        });

        const indicadores = document.querySelectorAll('.indicador');
        const actualizar = () => {
            carruselSlides.style.transform = `translateX(-${slideIndex * 100}%)`;
            indicadores.forEach(ind => ind.classList.remove('activo'));
            if(indicadores[slideIndex]) indicadores[slideIndex].classList.add('activo');
        };
        const siguiente = () => { slideIndex = (slideIndex + 1) % slides.length; actualizar(); };
        const irASlide = (i) => { slideIndex = i; actualizar(); reiniciar(); };
        const iniciar = () => { intervalo = setInterval(siguiente, 4000); };
        const reiniciar = () => { clearInterval(intervalo); iniciar(); };

        iniciar();
        if (mediaQueryMotion && mediaQueryMotion.matches) clearInterval(intervalo);
    }

    // 9. NUEVO: Carrusel Hero Banners (Fondo del Encabezado) - Cada 5 segundos
    const heroImagenes = document.querySelectorAll('.hero-img');
    if (heroImagenes.length > 0) {
        let heroIndex = 0;
        let heroIntervalo = setInterval(() => {
            heroImagenes[heroIndex].classList.remove('activa');
            heroIndex = (heroIndex + 1) % heroImagenes.length;
            heroImagenes[heroIndex].classList.add('activa');
        }, 5000); // Se cambia cada 5000ms (5 segundos)

        // Detener si el usuario prefiere movimiento reducido en su PC
        if (mediaQueryMotion && mediaQueryMotion.matches) {
            clearInterval(heroIntervalo);
        }
    }
});