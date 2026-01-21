/**
 * js/utils.js
 * Variables globales y funciones de utilidad
 */

// Variables Globales (Compartidas entre archivos)
var productos = []; // Lista dinámica
var conexionDB = false;
var ultimoErrorDB = "";
var zxingScanner = null;

// Variables para escáneres
var codeReader = null;
var selectedDeviceId = null;
var genericCodeReader = null;
var targetInputIdForScanner = null;

// Variables de inventario general
var insumos = [];
var insumoExistenteEncontrado = null;

// Helper para mostrar notificaciones tipo "Toast"
function mostrarNotificacion(mensaje) {
    let container = document.querySelector('.flash-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'flash-container';
        document.body.appendChild(container);
    }

    const msg = document.createElement('div');
    msg.className = 'flash-msg';
    msg.innerHTML = mensaje || `<span>✓</span> Agregado correctamente`;

    container.appendChild(msg);

    setTimeout(() => {
        msg.remove();
    }, 1800);
}

// Helper para procesar imágenes a Base64
const processImage = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 800;
                const scaleSize = MAX_WIDTH / img.width;
                canvas.width = (img.width > MAX_WIDTH) ? MAX_WIDTH : img.width;
                canvas.height = (img.width > MAX_WIDTH) ? (img.height * scaleSize) : img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                resolve(canvas.toDataURL('image/jpeg', 0.7));
            };
            img.onerror = reject;
        };
        reader.onerror = reject;
    });
};

// Exponer helpers globales
window.mostrarNotificacion = mostrarNotificacion;
window.processImage = processImage;
