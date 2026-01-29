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
var telefonoTienda = ""; // Se carga desde el servidor (seguro)
var instagramURL = "";   // Se carga desde el servidor (seguro)
var codeReader = null;
var selectedDeviceId = null;
var genericCodeReader = null;
var targetInputIdForScanner = null;

// Variables de inventario general
var insumos = [];
var insumoExistenteEncontrado = null;
var configTienda = { envioGratis: false }; // Configuración global

// --- CONFIGURACIÓN DE CONEXIÓN ---
// IMPORTANTE: Cambia esta URL por la dirección real de tu proyecto en Vercel
const API_BASE_URL = "https://styleprouniformes.vercel.app"; // <--- Sin barra al final

function getApiUrl(endpoint) {
    // Detectar si estamos en la App (Capacitor) o en archivo local
    const isApp = window.location.protocol === 'file:' || 
                  window.location.protocol === 'capacitor:' || 
                  window.Capacitor;
    
    // Si es App, forzar la conexión al servidor en la nube. Si es web, usar relativa.
    return isApp ? `${API_BASE_URL}${endpoint}` : endpoint;
}

// Cargar configuración global (Envío gratis / Modo pruebas)
async function cargarConfiguracionGlobal() {
    try {
        const url = getApiUrl('/api/config');
        const res = await fetch(url);
        if (res.ok) {
            const data = await res.json();
            configTienda.envioGratis = data.envio_gratis;
            
            if (data.telefono) telefonoTienda = data.telefono;
            if (data.instagram) instagramURL = data.instagram;

            // Actualizar botones flotantes si existen en el HTML
            actualizarEnlacesContacto();

            // Si estamos en el carrito, actualizar totales visualmente
            if (typeof actualizarTotales === 'function') actualizarTotales();
        }
    } catch (e) { console.error("Error cargando config:", e); }
}

// Función para inyectar los enlaces seguros en el HTML
function actualizarEnlacesContacto() {
    // Actualizar WhatsApp Flotante
    const btnWa = document.querySelector('.btn-whatssapp'); // Clase definida en CSS
    if (btnWa && telefonoTienda) {
        // Si es un enlace <a>
        if (btnWa.tagName === 'A') btnWa.href = `https://wa.me/${telefonoTienda}`;
        // Si es un div/button, agregamos evento click
        else btnWa.onclick = () => window.open(`https://wa.me/${telefonoTienda}`, '_blank');
    }

    // Actualizar Instagram Flotante
    const btnIg = document.querySelector('.btn-instagram');
    if (btnIg && instagramURL) {
        if (btnIg.tagName === 'A') btnIg.href = instagramURL;
        else btnIg.onclick = () => window.open(instagramURL, '_blank');
    }
}

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
window.getApiUrl = getApiUrl;
window.cargarConfiguracionGlobal = cargarConfiguracionGlobal;
