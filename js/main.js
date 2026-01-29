/**
 * js/main.js
 * Inicialización principal de la aplicación
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- CORRECCIÓN AUTOMÁTICA DE VISTA MÓVIL ---
    // Si la página (ej: carrito.html) no tiene el viewport correcto, lo inyectamos/corregimos dinámicamente.
    let metaViewport = document.querySelector('meta[name="viewport"]');
    if (!metaViewport) {
        metaViewport = document.createElement('meta');
        metaViewport.name = 'viewport';
        document.head.appendChild(metaViewport);
    }
    // Forzar siempre la vista responsiva ideal para celulares
    if (!metaViewport.content || metaViewport.content.includes('width=1200')) {
        metaViewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
    }

    const path = window.location.pathname;

    // Lógica para todas las páginas
    if (typeof cargarConfiguracionGlobal === 'function') cargarConfiguracionGlobal();
    if (typeof actualizarContador === 'function') actualizarContador();

    // Lógica específica para el sitio público (tienda)
    if (path.includes('index.html') || path.endsWith('/') || path.includes('detalle.html') || path.includes('carrito.html')) {
        if (typeof renderizarProductos === 'function') renderizarProductos();
        if (typeof cargarProductosDesdeDB === 'function') cargarProductosDesdeDB();
        if (typeof cargarDetalleProducto === 'function') cargarDetalleProducto();
        if (typeof renderizarPaginaCarrito === 'function') renderizarPaginaCarrito();

        // Mostrar promo
        if (typeof abrirPromo === 'function') setTimeout(abrirPromo, 1000);

        // Lógica del Carrusel Hero
        const track = document.getElementById('heroTrack');
        const bubblesContainer = document.getElementById('heroBubbles');
        if (track && bubblesContainer) {
            const slides = track.querySelectorAll('.hero-slide');
            slides.forEach((_, index) => {
                const bubble = document.createElement('div');
                bubble.className = `bubble ${index === 0 ? 'active' : ''}`;
                bubble.onclick = () => {
                    track.scrollTo({ left: track.clientWidth * index, behavior: 'smooth' });
                };
                bubblesContainer.appendChild(bubble);
            });
            
            let activeIndex = 0; // Rastrear índice actual para evitar actualizaciones innecesarias
            track.addEventListener('scroll', () => {
                const index = Math.round(track.scrollLeft / track.clientWidth);
                if (index !== activeIndex) {
                    const bubbles = bubblesContainer.querySelectorAll('.bubble');
                    if (bubbles[activeIndex]) bubbles[activeIndex].classList.remove('active');
                    if (bubbles[index]) bubbles[index].classList.add('active');
                    activeIndex = index;
                }
            });
        }

        // Lógica de botones de pago
        const radioPagos = document.querySelectorAll('input[name="payment"]');
        const btnCheckout = document.querySelector('.btn-checkout');
        if (radioPagos.length > 0 && btnCheckout) {
            radioPagos.forEach(radio => {
                radio.addEventListener('change', () => {
                    if (radio.value === 'Webpay') {
                        btnCheckout.innerHTML = 'Pagar con Webpay 💳';
                        btnCheckout.style.background = '#1a1a1a';
                    } else {
                        btnCheckout.innerHTML = 'Enviar pedido por WhatsApp 📲';
                        btnCheckout.style.background = '#25D366';
                    }
                });
            });
            const checked = document.querySelector('input[name="payment"]:checked');
            if (checked) checked.dispatchEvent(new Event('change'));
        }
    }

    // Lógica específica para la página de admin
    if (path.includes('admin.html')) {
        if (typeof verificarAutenticacion === 'function') verificarAutenticacion();
        if (typeof cargarInventarioAdmin === 'function') cargarInventarioAdmin();
        if (typeof mostrarVista === 'function') mostrarVista('vista-inventario');
        
        window.addEventListener('beforeunload', () => {
            if (typeof detenerEscaneoBarcode === 'function') detenerEscaneoBarcode();
            if (typeof detenerEscaneoGenerico === 'function') detenerEscaneoGenerico();
        });
    }
});
