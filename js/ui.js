/**
 * js/ui.js
 * Interfaz de usuario, modales y navegación
 */

// --- Modales ---
const abrirModal = (id) => {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.add("active");
    document.body.classList.add("no-scroll");
    setTimeout(() => modal.classList.add("visible"), 10);
};

const cerrarModal = (id) => {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.remove("visible");
    setTimeout(() => {
        modal.classList.remove("active");
        document.body.classList.remove("no-scroll");
    }, 300);
};

// Wrappers específicos
function abrirGuiaTallas() { abrirModal("modal-tallas"); }
function cerrarGuiaTallas() { cerrarModal("modal-tallas"); }
function abrirPromo() { abrirModal("modal-promo"); } // Se llama desde lógica promo, pero es UI
function cerrarPromo() { cerrarModal("modal-promo"); }

// --- Carrusel ---
function moverCarrusel(direction) {
    const track = document.getElementById('heroTrack');
    if (!track) return;
    const scrollAmount = track.clientWidth * direction;
    track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
}

function cambiarImagen(src) {
    const img = document.getElementById("imgPrincipal");
    if(img) img.src = src;
}

// --- Navegación Admin ---
function mostrarVista(vistaId) {
    const vistas = ['vista-inventario', 'vista-ventas', 'vista-promo', 'vista-scanner', 'vista-inventario-general'];
    vistas.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = (id === vistaId) ? 'block' : 'none';
    });

    const tabButtons = document.querySelectorAll('.tab-navigation .btn-tab');
    tabButtons.forEach(button => {
        const onclickAttr = button.getAttribute('onclick');
        if (onclickAttr && onclickAttr.includes(`'${vistaId}'`)) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

// Exponer funciones globales
window.abrirModal = abrirModal; // Necesario para generic scanner
window.cerrarModal = cerrarModal;
window.abrirGuiaTallas = abrirGuiaTallas;
window.cerrarGuiaTallas = cerrarGuiaTallas;
window.abrirPromo = abrirPromo;
window.cerrarPromo = cerrarPromo;
window.moverCarrusel = moverCarrusel;
window.cambiarImagen = cambiarImagen;
window.mostrarVista = mostrarVista;
