/**
 * js/admin-edit.js
 * Lógica para editar productos desde el panel de administración
 */

function abrirModalEditar(id) {
    // Buscar el producto en la variable global 'productos'
    // (Asegúrate de que 'productos' esté disponible globalmente en tu admin.js o productos.js)
    const producto = (typeof productos !== 'undefined' ? productos : []).find(p => p.id === id);
    
    if (!producto) {
        alert("Producto no encontrado o lista no cargada.");
        return;
    }

    // Llenar el formulario con los datos actuales
    document.getElementById('editId').value = producto.id;
    document.getElementById('editNombre').value = producto.nombre;
    document.getElementById('editPrecio').value = producto.precio;
    document.getElementById('editStock').value = producto.stock !== undefined ? producto.stock : 0;
    
    // Categoría
    const cat = Array.isArray(producto.categorias) ? producto.categorias[0] : producto.categorias;
    document.getElementById('editCategoria').value = cat || 'Mujer';
    
    document.getElementById('editDescripcion').value = producto.descripcion || '';

    // Mostrar el modal
    if (window.abrirModal) window.abrirModal('modal-editar');
}

function cerrarModalEditar() {
    if (window.cerrarModal) window.cerrarModal('modal-editar');
}

async function guardarProductoEditado(e) {
    e.preventDefault();
    
    const id = parseInt(document.getElementById('editId').value);
    const nombre = document.getElementById('editNombre').value;
    const precio = parseInt(document.getElementById('editPrecio').value);
    const stock = parseInt(document.getElementById('editStock').value);
    const categoria = document.getElementById('editCategoria').value;
    const descripcion = document.getElementById('editDescripcion').value;

    const datosActualizados = {
        id, nombre, precio, stock, categorias: [categoria], descripcion
    };

    // 1. Actualizar en Base de Datos (si tienes el endpoint configurado)
    try {
        const res = await fetch('/api/productos', {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                ...getAuthHeader() // IMPORTANTE: Enviar credenciales
            },
            body: JSON.stringify(datosActualizados)
        });
        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.error || 'Error al actualizar');
        }
        alert('✅ Producto actualizado correctamente.');
        cerrarModalEditar();
        window.location.reload();
    } catch (error) {
        if (window.manejarErrorApi) {
            window.manejarErrorApi(error);
        } else {
            alert("❌ Error: " + error.message);
        }
    }
}

// Exponer funciones
window.abrirModalEditar = abrirModalEditar;
window.cerrarModalEditar = cerrarModalEditar;
window.guardarProductoEditado = guardarProductoEditado;