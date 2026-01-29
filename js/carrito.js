/**
 * js/carrito.js
 * Lógica del carrito, checkout y pagos
 */

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

function agregar(id) {
    const prod = productos.find(p => p.id === id);
    const talla = document.getElementById(`talla-${id}`).value;

    // Validar stock global
    if ((prod.stock !== undefined && prod.stock <= 0) || prod.mostrar === false) {
        mostrarNotificacion("❌ Producto agotado o no disponible");
        return;
    }

    // Validar stock por talla
    let stockDisponible = null;
    if (prod.stock_tallas && prod.stock_tallas[talla] !== undefined) {
        stockDisponible = prod.stock_tallas[talla];
    }
    
    if (stockDisponible !== null) {
        const enCarrito = carrito.find(i => i.id === id && i.talla === talla);
        const cantidadActual = enCarrito ? enCarrito.cantidad : 0;
        if (cantidadActual + 1 > stockDisponible) {
            mostrarNotificacion(`⚠️ Solo quedan ${stockDisponible} unidades en talla ${talla}`);
            return;
        }
    }
    
    const colorSelect = document.getElementById(`color-${id}`); 
    const color = colorSelect ? colorSelect.value : 'Único';

    const item = { ...prod, talla, color, imagen: prod.imagenes[0], uid: `${id}-${talla}-${color}` };

    const existe = carrito.find(i => i.uid === item.uid);
    if (existe) {
        existe.cantidad++;
    } else {
        item.cantidad = 1;
        carrito.push(item);
    }

    guardarCarrito();
    mostrarNotificacion(`✅ ${prod.nombre} añadido`);
}

function agregarDesdeDetalle(id) {
    carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const producto = productos.find(p => p.id === id);
    if (!producto) return;

    if ((producto.stock !== undefined && producto.stock <= 0) || producto.mostrar === false) {
        mostrarNotificacion("❌ Producto agotado o no disponible");
        return;
    }

    const talla = document.getElementById('detalle-talla')?.value || 'Única';
    const colorSelect = document.getElementById('detalle-color');
    
    if (colorSelect && colorSelect.value === "") {
        mostrarNotificacion("⚠️ Por favor selecciona un color");
        return;
    }

    const color = colorSelect ? colorSelect.value : 'Único';
    const item = {
        id: producto.id, nombre: producto.nombre, precio: producto.precio, imagen: producto.imagenes[0],
        talla: talla, color: color, mostrar: producto.mostrar, cantidad: 1, uid: `${producto.id}-${talla}-${color}`
    };

    const existe = carrito.find(p => p.uid === item.uid);
    if (existe) existe.cantidad += 1;
    else carrito.push(item);

    guardarCarrito();
    mostrarNotificacion(`🛍️ ${producto.nombre} en el carrito`);
}

function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContador();
}

function actualizarContador() {
    const count = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    const badge = document.getElementById('cart-count');
    if (badge) badge.innerText = count;
}

function renderizarPaginaCarrito() {
    const container = document.getElementById('cart-items');
    const shippingContainer = document.getElementById('shipping-form-container');
    if (!container) return;

    // Guardar valores del formulario si ya existen (para no perderlos al eliminar items)
    const savedValues = {
        nombre: document.getElementById('cliente-nombre')?.value || '',
        email: document.getElementById('cliente-email')?.value || '',
        telefono: document.getElementById('cliente-telefono')?.value || '',
        direccion: document.getElementById('cliente-direccion')?.value || '',
        dpto: document.getElementById('cliente-dpto')?.value || '',
        comuna: document.getElementById('cliente-comuna')?.value || '',
        referencia: document.getElementById('cliente-referencia')?.value || ''
    };

    if (carrito.length === 0) {
        container.innerHTML = "<p>Tu carrito está vacío.</p>";
        if (shippingContainer) shippingContainer.innerHTML = '';
        actualizarTotales();
        return;
    }

    container.innerHTML = '';
    if (shippingContainer) shippingContainer.innerHTML = '';

    carrito.forEach((item, index) => {
        const img = item.imagen || (item.imagenes && item.imagenes[0]) || 'https://via.placeholder.com/60';
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <img src="${img}" alt="${item.nombre}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; margin-right: 15px;">
            <div style="flex: 1;">
                <strong>${item.nombre}</strong>
                <div style="font-size: 0.85rem; color: #666;">
                    Talla: ${item.talla} ${item.mostrar !== false ? `| Color: ${item.color}` : ''} <br>
                    $${item.precio.toLocaleString('es-CL')} x ${item.cantidad}
                </div>
            </div>
            <button onclick="eliminar(${index})" style="color: red; border: none; background: none; cursor: pointer; font-weight: bold;">X</button>
        `;
        container.appendChild(div);
    });

    // --- INYECTAR FORMULARIO DE ENVÍO ---
    const formDiv = document.createElement('div');
    formDiv.className = 'shipping-form';
    formDiv.innerHTML = `
        <h3>📍 Datos de Envío</h3>
        <div class="form-group-envio">
            <label>Nombre Completo</label>
            <input type="text" id="cliente-nombre" class="input-envio" placeholder="Ej: Juan Pérez">
        </div>
        <div class="form-group-envio">
            <label>Correo Electrónico</label>
            <input type="email" id="cliente-email" class="input-envio" placeholder="Ej: juan@example.com">
        </div>
        <div class="form-group-envio">
            <label>Teléfono</label>
            <input type="tel" id="cliente-telefono" class="input-envio" placeholder="Ej: 9 1234 5678">
        </div>
        <div class="form-group-envio">
            <label>Dirección (Calle y Número)</label>
            <input type="text" id="cliente-direccion" class="input-envio" placeholder="Ej: Av. Siempre Viva 742">
        </div>
        <div class="form-group-envio">
            <label>Dpto / Casa / Oficina (Opcional)</label>
            <input type="text" id="cliente-dpto" class="input-envio" placeholder="Ej: Dpto 304, Torre B">
        </div>
        <div class="form-group-envio">
            <label>Comuna</label>
            <input type="text" id="cliente-comuna" class="input-envio" placeholder="Ej: Santiago">
        </div>
        <div class="form-group-envio">
            <label>Referencia (Opcional)</label>
            <input type="text" id="cliente-referencia" class="input-envio" placeholder="Ej: Portón negro, dejar en conserjería">
        </div>
    `;
    
    if (shippingContainer) {
        shippingContainer.appendChild(formDiv);
    } else {
        container.appendChild(formDiv);
    }

    // Restaurar valores
    if (savedValues.nombre) document.getElementById('cliente-nombre').value = savedValues.nombre;
    if (savedValues.email) document.getElementById('cliente-email').value = savedValues.email;
    if (savedValues.telefono) document.getElementById('cliente-telefono').value = savedValues.telefono;
    if (savedValues.direccion) document.getElementById('cliente-direccion').value = savedValues.direccion;
    if (savedValues.dpto) document.getElementById('cliente-dpto').value = savedValues.dpto;
    if (savedValues.comuna) document.getElementById('cliente-comuna').value = savedValues.comuna;
    if (savedValues.referencia) document.getElementById('cliente-referencia').value = savedValues.referencia;

    actualizarTotales();
}

function eliminar(index) {
    carrito.splice(index, 1);
    guardarCarrito();
    renderizarPaginaCarrito();
}

function calcularEnvio(carrito) {
    // Si el modo "Envío Gratis / Pruebas" está activo globalmente
    if (window.configTienda && window.configTienda.envioGratis) return 0;

    if (!carrito || carrito.length === 0) return 4000;
    const tienePantalon = carrito.some(item => item.categorias && item.categorias.includes('Pantalones'));
    const tieneTop = carrito.some(item => item.categorias && !item.categorias.includes('Pantalones'));
    if (tienePantalon && tieneTop) return 0;
    return 4000;
}

function actualizarTotales() {
    const subtotal = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    const envio = calcularEnvio(carrito);
    const total = subtotal > 0 ? subtotal + envio : 0;

    const subElem = document.getElementById('subtotal-price');
    const totElem = document.getElementById('total-price');
    const shipElem = document.getElementById('shipping-cost');

    if(subElem) subElem.innerText = `$${subtotal.toLocaleString('es-CL')}`;
    if(shipElem) {
        if (envio === 0 && subtotal > 0) {
            shipElem.innerText = "Gratis";
            shipElem.style.color = "#25D366";
            shipElem.style.fontWeight = "bold";
        } else {
            shipElem.innerText = `$${envio.toLocaleString('es-CL')}`;
            shipElem.style.color = "";
            shipElem.style.fontWeight = "";
        }
    }
    if(totElem) totElem.innerText = `$${total.toLocaleString('es-CL')}`;
}

function enviarPedido() {
    if (carrito.length === 0) return alert("El carrito está vacío");

    const telefono = "56929395568";
    const pagoInput = document.querySelector('input[name="payment"]:checked');
    const pago = pagoInput ? pagoInput.value : 'Webpay';
    
    if (pago === "Webpay") {
        pagarConWebpay();
        return;
    }

    const baseUrl = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '/');
    let mensaje = "Hola Uniformes Clínicos! 👋 Quiero realizar el siguiente pedido:\n\n";
    let subtotal = 0;

    carrito.forEach((item, index) => {
        const totalItem = item.precio * item.cantidad;
        subtotal += totalItem;
        const img = item.imagen || (item.imagenes && item.imagenes[0]) || '';
        const imgUrl = img.startsWith('http') ? img : baseUrl + img;

        mensaje += `*${index + 1}. ${item.nombre}*\n`;
        mensaje += item.mostrar !== false ? `   📝 Talla: ${item.talla} | Color: ${item.color}\n` : `   📝 Talla: ${item.talla}\n`;
        mensaje += `   📦 Cantidad: ${item.cantidad}\n   💲 Precio Unit: $${item.precio.toLocaleString('es-CL')}\n   💰 Subtotal: $${totalItem.toLocaleString('es-CL')}\n   🖼️ Foto: ${imgUrl}\n\n`;
    });

    const envio = calcularEnvio(carrito);
    const total = subtotal + envio;

    mensaje += `--------------------------\n🧾 *DETALLE BOLETA*\n💰 Subtotal: $${subtotal.toLocaleString('es-CL')}\n🚚 Envío: ${envio === 0 ? 'Gratis' : '$' + envio.toLocaleString('es-CL')}\n⭐ *TOTAL A PAGAR: $${total.toLocaleString('es-CL')}*\n--------------------------\n💳 Método de pago: ${pago}`;

    window.open(`https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`, '_blank');
}

async function pagarConWebpay() {
    const subtotal = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    const envio = calcularEnvio(carrito);
    const total = subtotal + envio;
    const orden = "ORDER-" + Date.now();

    // --- VALIDACIÓN DE DATOS DE ENVÍO ---
    const nombre = document.getElementById('cliente-nombre')?.value.trim();
    const email = document.getElementById('cliente-email')?.value.trim();
    const telefono = document.getElementById('cliente-telefono')?.value.trim();
    const direccion = document.getElementById('cliente-direccion')?.value.trim();
    const dpto = document.getElementById('cliente-dpto')?.value.trim() || '';
    const comuna = document.getElementById('cliente-comuna')?.value.trim();
    const referencia = document.getElementById('cliente-referencia')?.value.trim() || '';

    if (!nombre || !email || !telefono || !direccion || !comuna) {
        alert("⚠️ Por favor completa los Datos de Envío (Nombre, Email, Teléfono, Dirección y Comuna) antes de pagar.");
        return;
    }
    const datosCliente = { nombre, email, telefono, direccion, dpto, comuna, referencia };

    // Guardar datos del cliente temporalmente para recuperarlos al volver de Webpay
    localStorage.setItem('datosCliente', JSON.stringify(datosCliente));

    mostrarNotificacion("🔄 Conectando con Webpay...");

    try {
        // Usar getApiUrl para compatibilidad con App y Web
        const url = window.getApiUrl ? window.getApiUrl('/api/webpay_init') : '/api/webpay_init';
        
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                amount: total, 
                buyOrder: orden, 
                sessionId: "S-" + Date.now(),
                items: carrito, // Enviamos el carrito para guardarlo en la BD
                datosCliente: datosCliente // <--- Enviamos los datos del cliente
            })
        });

        if (!res.ok) {
            const errorText = await res.text();
            let errorMessage = `Error del servidor (${res.status})`;
            try {
                const errorJson = JSON.parse(errorText);
                if (errorJson.error) errorMessage = errorJson.error;
            } catch (e) {
                errorMessage = errorText || errorMessage;
            }
            throw new Error(errorMessage);
        }

        const data = await res.json();

        const form = document.createElement("form");
        form.method = "POST";
        form.action = data.url;
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = "token_ws";
        input.value = data.token;
        form.appendChild(input);
        document.body.appendChild(form);
        form.submit();
    } catch (error) {
        console.error("Error al iniciar pago:", error);
        alert("❌ Error: " + error.message);
        mostrarNotificacion("❌ Error al iniciar pago");
    }
}

async function registrarVentaExitosa() {
    const carritoGuardado = JSON.parse(localStorage.getItem('carrito'));
    if (!carritoGuardado || carritoGuardado.length === 0) return;

    try {
        const total = carritoGuardado.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
        const orden = "ORD-" + Date.now();
        
        // Recuperar datos del cliente guardados antes de ir a Webpay
        const datosCliente = JSON.parse(localStorage.getItem('datosCliente') || '{}');

        await fetch('/api/ventas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orden, total, items: carritoGuardado, estado: "PAGADO", datos_cliente: datosCliente })
        });

        localStorage.removeItem('carrito');
        localStorage.removeItem('datosCliente');
        console.log("✅ Venta registrada y stock actualizado");
    } catch (error) {
        console.error("Error registrando venta:", error);
    }
}

// Exponer funciones globales
window.agregar = agregar;
window.agregarDesdeDetalle = agregarDesdeDetalle;
window.eliminar = eliminar;
window.enviarPedido = enviarPedido;
window.registrarVentaExitosa = registrarVentaExitosa;
