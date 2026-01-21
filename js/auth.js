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
            sessionStorage.setItem('adminAuth', 'true');
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
    if (sessionStorage.getItem('adminAuth') !== 'true') {
        window.location.href = 'login.html';
    }
}

function cerrarSesion() {
    sessionStorage.removeItem('adminAuth');
    window.location.href = 'login.html';
}

// Exponer funciones globales
window.iniciarSesion = iniciarSesion;
window.verificarAutenticacion = verificarAutenticacion;
window.cerrarSesion = cerrarSesion;
