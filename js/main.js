/**
 * js/main.js
 * Inicialización principal de la aplicación
 */

document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;

    // Lógica para todas las páginas
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
            track.addEventListener('scroll', () => {
                const index = Math.round(track.scrollLeft / track.clientWidth);
                const bubbles = bubblesContainer.querySelectorAll('.bubble');
                bubbles.forEach(b => b.classList.remove('active'));
                if (bubbles[index]) bubbles[index].classList.add('active');
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
