/**
 * js/auth.js
 * Lógica de autenticación y seguridad
 */

async function iniciarSesion(e) {
    e.preventDefault();
    const user = document.getElementById('adminUser').value;
    const pass = document.getElementById('adminPass').value;
    const errorMsg = document.getElementById('loginError');
    errorMsg.style.display = 'none';

    try {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user, pass })
        });

        const data = await res.json();

        if (res.ok && data.success) {
            // Guardar el token JWT en localStorage para persistencia entre sesiones
            localStorage.setItem('authToken', data.token);
            window.location.href = 'admin.html';
        } else {
            errorMsg.innerText = data.error || 'Error de autenticación';
            errorMsg.style.display = 'block';
        }
    } catch (error) {
        console.error("Error en el fetch de login:", error);
        errorMsg.innerText = 'No se pudo conectar con el servidor.';
        errorMsg.style.display = 'block';
    }
}

function verificarAutenticacion() {
    // La verificación real de validez del token se hace en el backend en cada petición.
    // Esto es solo una redirección rápida en el cliente si el token no existe.
    if (!localStorage.getItem('authToken')) {
        window.location.href = 'login.html';
    }
}

function cerrarSesion() {
    localStorage.removeItem('authToken');
    window.location.href = 'login.html';
}

// Nueva función helper para obtener las cabeceras de autenticación
function getAuthHeader() {
    const token = localStorage.getItem('authToken');
    if (!token) return {};
    return { 'Authorization': `Bearer ${token}` };
}

// Exponer funciones globales
window.iniciarSesion = iniciarSesion;
window.verificarAutenticacion = verificarAutenticacion;
window.cerrarSesion = cerrarSesion;
window.getAuthHeader = getAuthHeader; // Exponer para que otros scripts la usen
