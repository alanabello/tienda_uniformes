/**
 * js/admin.js
 * Lógica del panel de administración
 */

// --- Inventario Tienda ---
let ordenColumna = '';
let ordenDireccion = 'asc';
let generalChart = null;

function manejarErrorApi(error) {
    console.error(error);
    
    // Evitar cerrar sesión si es un error de configuración o interno del servidor
    if (error.message && (error.message.includes('Configuración') || error.message.includes('interno') || error.message.includes('faltante'))) {
        alert(`❌ Error del sistema: ${error.message}\n\nNo se cerrará tu sesión.`);
        return;
    }

    if (error.message && (error.message.includes('Token inválido') || error.message.includes('expirado') || error.message.includes('No autorizado'))) {
        alert("⚠️ Tu sesión ha expirado. Por favor inicia sesión nuevamente.");
        window.location.href = 'login.html';
    } else {
        alert(`❌ Error: ${error.message}`);
    }
}

function ordenarInventario(columna) {
    if (ordenColumna === columna) {
        ordenDireccion = ordenDireccion === 'asc' ? 'desc' : 'asc';
    } else {
        ordenColumna = columna;
        ordenDireccion = 'asc';
    }

    productos.sort((a, b) => {
        let valA = a[columna];
        let valB = b[columna];
        if (columna === 'categorias') {
            valA = (valA || []).join(', ');
            valB = (valB || []).join(', ');
        }
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();
        if (valA < valB) return ordenDireccion === 'asc' ? -1 : 1;
        if (valA > valB) return ordenDireccion === 'asc' ? 1 : -1;
        return 0;
    });

    renderizarTablaInventario();
    
    const headers = document.querySelectorAll('.inventory-table th[onclick]');
    headers.forEach(th => {
        const col = th.getAttribute('onclick').match(/'(.*?)'/)[1];
        const titles = { 'id': 'ID', 'nombre': 'Nombre', 'barcode': 'Código Barras', 'precio': 'Precio', 'categorias': 'Categoría', 'stock': 'Stock', 'mostrar': 'Estado' };
        if (titles[col]) {
            let icon = '↕';
            if (col === ordenColumna) icon = ordenDireccion === 'asc' ? '↑' : '↓';
            th.innerHTML = `${titles[col]} ${icon}`;
        }
    });
}

async function cargarInventarioAdmin() {
    const tbody = document.getElementById('inventory-body');
    if (!tbody) return;
    tbody.innerHTML = '';
    await cargarProductosDesdeDB();

    const statusDiv = document.getElementById('db-status');
    if(statusDiv) {
        if (window.location.protocol === 'file:') {
            statusDiv.innerHTML = "⚠️ Modo Archivo Local (Sube a Vercel)";
            statusDiv.style.color = "orange";
        } else if (conexionDB) {
            const esVacia = productos === productosBase;
            statusDiv.innerHTML = esVacia ? "🟢 Conectado (Base de datos vacía)" : "🟢 Conectado a Neon DB";
            statusDiv.style.color = esVacia ? "orange" : "green";
        } else {
            if (ultimoErrorDB && ultimoErrorDB.includes("Modo Local")) {
                statusDiv.innerHTML = `⚠️ ${ultimoErrorDB}`;
                statusDiv.style.color = "orange";
            } else {
                statusDiv.innerHTML = `🔴 Error: ${ultimoErrorDB || 'Revisar Logs'}`;
                statusDiv.style.color = "red";
            }
        }
    }
    renderizarTablaInventario();
}

function renderizarTablaInventario() {
    const tbody = document.getElementById('inventory-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    productos.forEach(p => {
        const img = p.imagenes && p.imagenes[0] ? p.imagenes[0] : '';
        const stock = p.stock !== undefined ? p.stock : 0;
        const row = `
            <tr data-product-id="${p.id}">
                <td>#${p.id}</td>
                <td><img src="${img}" width="50" style="border-radius:5px;"></td>
                <td><strong>${p.nombre}</strong></td>
                <td>${p.barcode || 'N/A'}</td>
                <td>$${p.precio.toLocaleString('es-CL')}</td>
                <td>${p.categorias.join(', ')}</td>
                <td><input type="number" value="${stock}" min="0" onchange="cambiarStock(${p.id}, this.value)" style="width: 80px; padding: 5px; border: 1px solid #ddd; border-radius: 5px; text-align: center;"></td>
                <td>
                    <select onchange="cambiarVisibilidad(${p.id}, this.value === 'true')" style="padding: 5px; border-radius: 5px; border: 1px solid #ddd; background: ${p.mostrar ? '#d1fae5' : '#fee2e2'}; color: ${p.mostrar ? '#065f46' : '#991b1b'}; font-weight: bold;">
                        <option value="true" ${p.mostrar ? 'selected' : ''}>Disponible</option>
                        <option value="false" ${!p.mostrar ? 'selected' : ''}>Agotado</option>
                    </select>
                </td>
                <td>
                    <a href="detalle.html?id=${p.id}" target="_blank" title="Ver en tienda" style="text-decoration:none; font-size: 1.2rem;">🔗</a>
                    <button onclick="abrirModalTallas(${p.id})" title="Gestionar Tallas" style="cursor:pointer; border:none; background:none; font-size:1.2rem; margin-left: 5px;">📏</button>
                    <button onclick="eliminarProducto(${p.id})" title="Eliminar" style="cursor:pointer; border:none; background:none; font-size:1.2rem; margin-left: 8px;">🗑️</button>
                </td>
            </tr>`;
        tbody.innerHTML += row;
    });
}

async function cambiarVisibilidad(id, nuevoEstado) {
    try {
        const url = window.getApiUrl ? window.getApiUrl('/api/productos') : '/api/productos';
        await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader() // Añadir cabecera de autorización
            }, body: JSON.stringify({ id: id, mostrar: nuevoEstado }) });
        const productoIndex = productos.findIndex(p => p.id === id);
        if (productoIndex !== -1) productos[productoIndex].mostrar = nuevoEstado;
        const rowElement = document.querySelector(`tr[data-product-id="${id}"]`);
        const selectElement = rowElement ? rowElement.querySelector('select[onchange^="cambiarVisibilidad"]') : null;
        if (selectElement) {
            selectElement.style.background = nuevoEstado ? '#d1fae5' : '#fee2e2';
            selectElement.style.color = nuevoEstado ? '#065f46' : '#991b1b';
        }
    } catch (error) { console.error(error); alert("Error al cambiar visibilidad"); }
}

async function cambiarStock(id, nuevoStock) {
    const stockNum = parseInt(nuevoStock);
    if (isNaN(stockNum) || stockNum < 0) { alert("Por favor ingresa un número válido."); return; }
    try {
        const url = window.getApiUrl ? window.getApiUrl('/api/productos') : '/api/productos';
        await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader() // Añadir cabecera de autorización
            }, body: JSON.stringify({ id: id, stock: stockNum }) });
        const productoIndex = productos.findIndex(p => p.id === id);
        if (productoIndex !== -1) productos[productoIndex].stock = stockNum;
    } catch (error) { console.error(error); alert("Error al actualizar stock"); }
}

async function eliminarProducto(id) {
    if(!confirm("¿Estás seguro de eliminar este producto permanentemente?")) return;
    try {
        const url = window.getApiUrl ? window.getApiUrl('/api/productos') : '/api/productos';
        const res = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader() // Añadir cabecera de autorización
            }, body: JSON.stringify({ id }) });
        if (!res.ok) throw new Error("Error al eliminar");
        cargarInventarioAdmin();
    } catch (error) { console.error(error); alert("Error al eliminar producto"); }
}

async function guardarNuevoProducto(e) {
    e.preventDefault();
    const nombre = document.getElementById('newNombre').value;
    const precio = parseInt(document.getElementById('newPrecio').value);
    // El stock global se calculará sumando las tallas
    const categoria = document.getElementById('newCategoria').value;
    const descripcion = document.getElementById('newDescripcion').value;
    const barcode = document.getElementById('newBarcode').value.trim();
    if (barcode === "") { alert("El código de barras no puede estar vacío."); return; }
    
    // Recopilar stock por talla
    const inputsTalla = document.querySelectorAll('.input-new-talla-stock');
    let stockTallas = {};
    let tallas = [];
    let totalStock = 0;
    inputsTalla.forEach(input => {
        const val = parseInt(input.value) || 0;
        if (val > 0) {
            stockTallas[input.dataset.talla] = val;
            tallas.push(input.dataset.talla);
            totalStock += val;
        }
    });

    const mostrarColores = document.getElementById('newMostrarColores').checked;
    const fileInput = document.getElementById('newFotos');
    let imagenesProcesadas = [];
    const btn = e.target.querySelector('button[type="submit"]');
    const textoOriginal = btn.innerText;
    btn.innerText = "Procesando fotos..."; btn.disabled = true;

    try {
        if (fileInput.files.length > 0) {
            const promises = Array.from(fileInput.files).map(file => processImage(file));
            imagenesProcesadas = await Promise.all(promises);
        } else { alert("Por favor selecciona al menos una foto."); btn.innerText = textoOriginal; btn.disabled = false; return; }
    } catch (err) { console.error(err); alert("Error al procesar las imágenes."); btn.innerText = textoOriginal; btn.disabled = false; return; }

    const nuevoProd = { nombre, precio, stock: totalStock, categorias: [categoria], imagenes: imagenesProcesadas, descripcion, mostrar: true, tallas: tallas, stock_tallas: stockTallas, mostrarColores: mostrarColores, barcode: barcode };
    btn.innerText = "Guardando...";

    try {
        const url = window.getApiUrl ? window.getApiUrl('/api/productos') : '/api/productos';
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader() // Añadir cabecera de autorización
            }, body: JSON.stringify(nuevoProd) });
        if (!res.ok) throw new Error("Error al guardar");
        alert("✅ Producto agregado correctamente");
        cerrarModalAgregar();
        e.target.reset();
        cargarInventarioAdmin();
    } catch (error) { manejarErrorApi(error); } finally { btn.innerText = textoOriginal; btn.disabled = false; }
}

function abrirModalAgregar() {
    const modal = document.getElementById('modal-agregar');
    if(modal) { modal.classList.add('active'); setTimeout(() => modal.classList.add('visible'), 10); }
}

function cerrarModalAgregar() {
    const modal = document.getElementById('modal-agregar');
    if(modal) { modal.classList.remove('visible'); setTimeout(() => modal.classList.remove('active'), 300); }
}

async function guardarCambios() {
    const btn = document.querySelector('button[onclick="guardarCambios()"]');
    if(btn) { btn.innerText = "Verificando..."; btn.disabled = true; }
    try { await cargarInventarioAdmin(); alert("✅ Todos los cambios están guardados y sincronizados correctamente."); }
    catch (error) { console.error(error); alert("❌ Error al verificar cambios: " + error.message); }
    finally { if(btn) { btn.innerText = "💾 Guardar Cambios"; btn.disabled = false; } }
}

// --- Ventas ---
async function cargarVentasAdmin() {
    const container = document.getElementById('ventas-body');
    if(!container) return;
    container.innerHTML = '<tr><td colspan="5">Cargando ventas...</td></tr>';
    const url = window.getApiUrl ? window.getApiUrl('/api/ventas') : '/api/ventas';
    const res = await fetch(url, {
        headers: { ...getAuthHeader() } // Proteger lectura de ventas
    });
    if (!res.ok) { container.innerHTML = `<tr><td colspan="5" style="color:red">Error al cargar ventas: Acceso denegado.</td></tr>`; return; }
    const ventas = await res.json();
    container.innerHTML = '';

    // Actualizar encabezados de la tabla dinámicamente para reflejar las nuevas columnas
    const table = container.closest('table');
    if (table) {
        const thead = table.querySelector('thead tr');
        if (thead && thead.children.length >= 3) {
             if(thead.children[1]) thead.children[1].innerText = "Orden / Estado";
             if(thead.children[2]) thead.children[2].innerText = "Cliente / Acciones";
        }
    }

    ventas.forEach(venta => {
        const fecha = venta.fecha ? new Date(venta.fecha).toLocaleDateString() : '-';
        const items = venta.items || [];
        
        // Formatear datos del cliente para mostrar
        const cliente = venta.datos_cliente || {};
        const direccionCompleta = cliente.dpto ? `${cliente.direccion} (${cliente.dpto})` : cliente.direccion;
        const infoCliente = cliente.nombre 
            ? `<strong>${cliente.nombre}</strong><br><span style="font-size:0.85rem">📧 ${cliente.email || 'Sin email'}<br>📞 ${cliente.telefono}<br>📍 ${direccionCompleta}, ${cliente.comuna}<br>📝 ${cliente.referencia || ''}</span>` 
            : 'Cliente Web (Sin datos)';

        // Estado (Selector dinámico)
        const estado = venta.estado || 'PENDIENTE';
        const opciones = ['PENDIENTE', 'PAGADO', 'ENTREGADO', 'ANULADO'];
        
        let selectHtml = `<select onchange="cambiarEstadoVenta('${venta.orden}', this.value)" style="padding: 4px; border-radius: 6px; border: 1px solid #ddd; font-size: 0.75rem; font-weight: bold; background: white; margin-top: 5px; cursor: pointer;">`;
        
        opciones.forEach(op => {
            let color = '#333';
            if(op === 'PENDIENTE') color = '#d97706'; // Amarillo oscuro
            if(op === 'PAGADO') color = '#059669'; // Verde
            if(op === 'ENTREGADO') color = '#2563eb'; // Azul
            if(op === 'ANULADO') color = '#dc2626'; // Rojo
            
            selectHtml += `<option value="${op}" ${op === estado ? 'selected' : ''} style="color:${color}">${op}</option>`;
        });
        selectHtml += `</select>`;

        // Botón WhatsApp (Enviar comprobante al admin)
        const adminPhone = "56929395568";
        const itemsList = items.map(i => `- ${i.nombre} (x${i.cantidad}) ${i.talla ? '['+i.talla+']' : ''}`).join('%0A');
        const dirMsg = cliente.dpto ? `${cliente.direccion} (${cliente.dpto})` : cliente.direccion;
        const mensaje = `🧾 *COMPROBANTE DE VENTA* %0A%0A🆔 *Orden:* ${venta.orden}%0A📅 *Fecha:* ${fecha}%0A📊 *Estado:* ${estado}%0A%0A👤 *Cliente:* ${cliente.nombre || 'N/A'}%0A📧 *Email:* ${cliente.email || 'N/A'}%0A📞 *Tel:* ${cliente.telefono || 'N/A'}%0A📍 *Dir:* ${dirMsg || ''}, ${cliente.comuna || ''}%0A%0A📦 *Productos:*%0A${itemsList}%0A%0A💰 *Total:* $${(venta.total || 0).toLocaleString('es-CL')}`;
        
        const btnWhatsapp = `
            <a href="https://wa.me/${adminPhone}?text=${mensaje}" target="_blank" 
               style="display:inline-flex; align-items:center; gap:5px; margin-top:8px; text-decoration:none; background:#25D366; color:white; padding:6px 10px; border-radius:6px; font-size:0.8rem; font-weight:600; transition:0.2s;">
               <span>📲</span> Enviarme Comprobante
            </a>`;

        // Lista de productos más ordenada
        const productosHtml = items.map(i => 
            `<div style="border-bottom:1px solid #eee; padding:4px 0; font-size:0.85rem;">
                <span style="font-weight:700;">x${i.cantidad}</span> ${i.nombre}
                ${i.talla ? `<span style="color:#666; font-size:0.75rem;">(${i.talla})</span>` : ''}
             </div>`
        ).join('');

        const row = `
            <tr>
                <td style="vertical-align:top;">${fecha}</td>
                <td style="vertical-align:top;">
                    <div style="font-weight:600; color:#333;">${venta.orden}</div>
                    ${selectHtml}
                </td>
                <td style="vertical-align:top;">
                    ${infoCliente}<br>
                    ${btnWhatsapp}
                </td>
                <td style="vertical-align:top; font-weight:bold; color:#2d5a27;">$${(venta.total || 0).toLocaleString('es-CL')}</td>
                <td style="vertical-align:top;">${productosHtml}</td>
            </tr>`;
        container.innerHTML += row;
    });
}

async function cambiarEstadoVenta(orden, nuevoEstado) {
    const btn = document.activeElement; // El select que disparó el evento
    
    try {
        // Feedback visual inmediato (cambiar color texto según selección)
        if(nuevoEstado === 'PENDIENTE') btn.style.color = '#d97706';
        if(nuevoEstado === 'PAGADO') btn.style.color = '#059669';
        if(nuevoEstado === 'ENTREGADO') btn.style.color = '#2563eb';
        if(nuevoEstado === 'ANULADO') btn.style.color = '#dc2626';

        const url = window.getApiUrl ? window.getApiUrl('/api/ventas') : '/api/ventas';
        const res = await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
            body: JSON.stringify({ orden, estado: nuevoEstado })
        });

        if (!res.ok) throw new Error("Error al actualizar");
        mostrarNotificacion(`✅ Estado cambiado a ${nuevoEstado}`);
    } catch (error) {
        console.error(error);
        alert("Error al actualizar estado");
        cargarVentasAdmin(); // Revertir cambios visuales recargando
    }
}

// --- Promo ---
async function cargarConfigPromo() {
    try {
        const url = window.getApiUrl ? window.getApiUrl('/api/promo') : '/api/promo';
        const res = await fetch(url); // GET es público para que la tienda lo vea
        if (res.ok) {
            const config = await res.json();
            document.getElementById('promoActivo').checked = config.activo;
            document.getElementById('promoTitulo').value = config.titulo || "";
            document.getElementById('promoSubtitulo').value = config.subtitulo || "";
            document.getElementById('promoContenido').value = config.contenido || "";
            document.getElementById('promoTag').value = config.tag || "";
            if (config.expiracion) {
                // Convertir fecha UTC a formato local para el input datetime-local
                const date = new Date(config.expiracion);
                const localIsoString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
                document.getElementById('promoExpiracion').value = localIsoString;
            } else {
                document.getElementById('promoExpiracion').value = "";
            }
        }
    } catch (e) { console.error("Error cargando config promo:", e); }
}

async function guardarConfigPromo(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    const txtOriginal = btn.innerText;
    btn.innerText = "Guardando..."; btn.disabled = true;
    const config = { activo: document.getElementById('promoActivo').checked, titulo: document.getElementById('promoTitulo').value, subtitulo: document.getElementById('promoSubtitulo').value, contenido: document.getElementById('promoContenido').value, tag: document.getElementById('promoTag').value, expiracion: document.getElementById('promoExpiracion').value };
    try {
        const url = window.getApiUrl ? window.getApiUrl('/api/promo') : '/api/promo';
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader() // Añadir cabecera de autorización
            }, body: JSON.stringify(config) });
        if (!res.ok) throw new Error("Error en el servidor al guardar");
        mostrarNotificacion("✅ Configuración de oferta actualizada");
    } catch (error) { manejarErrorApi(error); } finally { btn.innerText = txtOriginal; btn.disabled = false; }
}

async function abrirPromo() {
    // Verificar si ya se mostró en esta sesión
    if (sessionStorage.getItem('promoVisto') === 'true') return;

    try {
        const url = window.getApiUrl ? window.getApiUrl(`/api/promo?_t=${Date.now()}`) : `/api/promo?_t=${Date.now()}`;
        const res = await fetch(url);
        if (res.ok) {
            const config = await res.json();
            const estaActivo = config.activo === true || config.activo === "true" || config.activo === 1;
            if (!estaActivo) return;

            // Verificar si la oferta ha expirado
            if (config.expiracion) {
                const ahora = new Date();
                const fechaExpiracion = new Date(config.expiracion);
                if (ahora > fechaExpiracion) return; // No mostrar si ya pasó la fecha
            }

            const titulo = document.getElementById('promo-display-titulo');
            const subtitulo = document.getElementById('promo-display-subtitulo');
            const contenido = document.getElementById('promo-display-contenido');
            const tag = document.getElementById('promo-display-tag');
            if(titulo) titulo.innerText = config.titulo;
            if(subtitulo) subtitulo.innerText = config.subtitulo;
            if(contenido) contenido.innerText = config.contenido;
            if(tag) tag.innerText = config.tag;
            window.abrirModal("modal-promo");
            
            // Marcar como visto para no volver a mostrar en esta sesión
            sessionStorage.setItem('promoVisto', 'true');
        }
    } catch (e) { console.error("Error cargando promo:", e); }
}

// --- Escáner ---
function playBeep() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.value = 1200; // Tono agudo suave
        gain.gain.value = 0.1; // Volumen bajo
        osc.start();
        setTimeout(() => { osc.stop(); ctx.close(); }, 150); // Duración corta
    } catch (e) { console.error("Error beep:", e); }
}

async function iniciarEscaneoBarcode() {
    // Permitir ejecución si es localhost, https o ambiente de App (Capacitor)
    const isApp = window.location.protocol === 'file:' || window.location.protocol === 'capacitor:' || window.Capacitor;
    
    if (!isApp && window.location.protocol !== 'https:' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        alert("⚠️ Aviso: La cámara requiere HTTPS para funcionar en celulares. Si estás probando con una IP local, es posible que no cargue.");
    }

    // Verificación de seguridad del navegador
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        if (isApp) {
            alert("🚫 Error de Permisos: La App no puede acceder a la cámara.\n\nVe a Ajustes del celular > Aplicaciones > StyleProUniformes > Permisos y activa la Cámara.");
        } else {
            alert("🚫 ERROR DE SEGURIDAD: Tu celular bloqueó la cámara.\n\nCausa: Estás entrando por una IP local (HTTP).\nSolución: Sube la página a Vercel (HTTPS) y prueba desde ahí.");
        }
        return;
    }

    // Asegurar que el escáner genérico esté detenido para evitar conflictos
    detenerEscaneoGenerico();

    const videoElement = document.getElementById('scanner-video');
    const scannedBarcodeSpan = document.getElementById('scanned-barcode');
    const scannedProductInfo = document.getElementById('scanned-product-info');
    const addStockBtn = document.getElementById('add-stock-btn');
    const removeStockBtn = document.getElementById('remove-stock-btn');
    scannedBarcodeSpan.innerText = 'Iniciando escáner...';
    scannedProductInfo.innerText = '';
    addStockBtn.style.display = 'none';
    removeStockBtn.style.display = 'none';

    if (typeof ZXing === 'undefined') {
        alert('Error: La librería del escáner no se ha cargado. Verifique su conexión a internet.');
        scannedBarcodeSpan.innerText = 'Error: Librería ZXing no cargada.';
        return;
    }
    if (!codeReader) codeReader = new ZXing.BrowserMultiFormatReader();
    try {
        const constraints = { 
            video: { 
                facingMode: "environment",
                focusMode: "continuous",
                width: { min: 640, ideal: 1280, max: 1920 }, 
                height: { min: 480, ideal: 720, max: 1080 } 
            } 
        };
        await codeReader.decodeFromConstraints(constraints, videoElement, (result, err) => {
            if (result) {
                playBeep();
                scannedBarcodeSpan.innerText = result.text;
                detenerEscaneoBarcode(); 
                mostrarInfoProductoEscaneado(result.text);
                addStockBtn.style.display = 'inline-block';
                removeStockBtn.style.display = 'inline-block';
            }
        });
        scannedBarcodeSpan.innerText = 'Escaneando...';
    } catch (error) { console.error(error); scannedBarcodeSpan.innerText = 'Error al iniciar la cámara.'; alert('Error al iniciar el escáner: ' + error.message); }
}

function detenerEscaneoBarcode() {
    if (codeReader) {
        codeReader.reset();
        const scannedBarcodeSpan = document.getElementById('scanned-barcode');
        if (scannedBarcodeSpan.innerText === 'Escaneando...') scannedBarcodeSpan.innerText = 'Escáner detenido.';
        document.getElementById('add-stock-btn').style.display = 'none';
        document.getElementById('remove-stock-btn').style.display = 'none';
        document.getElementById('scanned-product-info').innerText = '';
    }
}

async function mostrarInfoProductoEscaneado(barcode) {
    const productInfoSpan = document.getElementById('scanned-product-info');
    const producto = productos.find(p => p.barcode === barcode);
    if (producto) productInfoSpan.innerHTML = `Producto: <strong>${producto.nombre}</strong> (Stock actual: ${producto.stock})`;
    else {
        productInfoSpan.innerHTML = `<span style="color: red;">Producto no encontrado con este código de barras.</span>`;
        document.getElementById('add-stock-btn').style.display = 'none';
        document.getElementById('remove-stock-btn').style.display = 'none';
    }
}

async function actualizarStockPorBarcode(barcode, cantidad) {
    if (!barcode || barcode === 'Ninguno' || barcode.includes('Error') || barcode.includes('detenido')) { alert('Por favor, escanea un código de barras válido primero.'); return; }
    try {
        const url = window.getApiUrl ? window.getApiUrl('/api/productos') : '/api/productos';
        const res = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader() // Añadir cabecera de autorización
            }, body: JSON.stringify({ barcode, cantidad }) });
        if (!res.ok) throw new Error('Error al actualizar stock.');
        alert(`Stock actualizado. Cantidad: ${cantidad > 0 ? '+' : ''}${cantidad}`);
        await cargarInventarioAdmin();
    } catch (error) { console.error(error); alert('Error al actualizar stock: ' + error.message); }
}

// --- Insumos ---
async function cargarInventarioGeneral() {
    const tbody = document.getElementById('inventario-general-body');
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="7">Cargando...</td></tr>';
    try {
        const url = window.getApiUrl ? window.getApiUrl('/api/inventario_general') : '/api/inventario_general';
        const res = await fetch(url);
        if (!res.ok) throw new Error('No se pudo cargar el inventario general.');
        insumos = await res.json();
        renderizarTablaInsumos();
    } catch (error) { console.error(error); tbody.innerHTML = `<tr><td colspan="7" style="color:red;">${error.message}</td></tr>`; }
}

function renderizarTablaInsumos(filtro = '') {
    const tbody = document.getElementById('inventario-general-body');
    tbody.innerHTML = '';
    
    let datos = insumos;
    if (filtro) {
        const f = filtro.toLowerCase();
        datos = insumos.filter(i => 
            (i.nombre || '').toLowerCase().includes(f) ||
            (i.barcode || '').toLowerCase().includes(f) ||
            (i.categoria || '').toLowerCase().includes(f)
        );
    }

    if (datos.length === 0) { tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;">No se encontraron insumos.</td></tr>'; }
    
    datos.forEach(insumo => {
        const row = `<tr data-insumo-id="${insumo.id}"><td><strong>${insumo.nombre}</strong></td><td>${insumo.barcode || 'N/A'}</td><td>${insumo.categoria || 'N/A'}</td><td><input type="number" value="${insumo.stock}" min="0" onchange="actualizarStockInsumo(${insumo.id}, this.value)" style="width: 80px; padding: 5px; border: 1px solid #ddd; border-radius: 5px; text-align: center;"></td><td>$${(insumo.precio || 0).toLocaleString('es-CL')}</td><td>${(insumo.tallas || []).join(', ') || 'N/A'}</td><td>${insumo.descripcion || 'Sin descripción'}</td><td><button onclick="eliminarInsumo(${insumo.id})" title="Eliminar" style="cursor:pointer; border:none; background:none; font-size:1.2rem;">🗑️</button></td></tr>`;
        tbody.innerHTML += row;
    });

    actualizarDashboardGeneral(insumos);
}

function actualizarDashboardGeneral(data) {
    const dashboardOp = document.getElementById('dashboard-operativo');
    const dashboardFin = document.getElementById('dashboard-financiero');
    const chartSection = document.getElementById('chart-section-general');
    
    if (!dashboardOp || !dashboardFin) return;

    const totalItems = data.length;
    const totalStock = data.reduce((acc, item) => acc + (item.stock || 0), 0);
    const valorTotal = data.reduce((acc, item) => acc + ((item.stock || 0) * (item.precio || 0)), 0);
    const lowStock = data.filter(item => (item.stock || 0) < 10).length;
    const costoPromedio = totalItems > 0 ? Math.round(valorTotal / totalItems) : 0;

    // 1. Métricas Operativas
    dashboardOp.innerHTML = `
        <div class="kpi-card blue">
            <h4>Items Únicos</h4>
            <div class="value">${totalItems}</div>
        </div>
        <div class="kpi-card green">
            <h4>Stock Total (Unidades)</h4>
            <div class="value">${totalStock.toLocaleString('es-CL')}</div>
        </div>
        <div class="kpi-card red">
            <h4>Alertas Stock Bajo (<10)</h4>
            <div class="value">${lowStock}</div>
        </div>
    `;

    // 2. Métricas Financieras
    dashboardFin.innerHTML = `
        <div class="kpi-card orange">
            <h4>Valor Total Inventario</h4>
            <div class="value">$${valorTotal.toLocaleString('es-CL')}</div>
        </div>
        <div class="kpi-card purple">
            <h4>Costo Promedio Item</h4>
            <div class="value">$${costoPromedio.toLocaleString('es-CL')}</div>
        </div>
    `;

    if (chartSection) chartSection.style.display = 'block';
    renderizarGraficoCategorias(data);
}

function renderizarGraficoCategorias(data) {
    const ctx = document.getElementById('generalInventoryChart');
    if (!ctx) return;

    const categorias = {};
    data.forEach(item => {
        const cat = item.categoria || 'Sin Categoría';
        categorias[cat] = (categorias[cat] || 0) + (item.stock || 0);
    });

    const labels = Object.keys(categorias);
    const values = Object.values(categorias);

    if (generalChart) generalChart.destroy();

    generalChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Stock por Categoría',
                data: values,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true } }
        }
    });
}

function filtrarInventarioGeneral(termino) {
    renderizarTablaInsumos(termino);
}

// Función auxiliar para sumar stock de tallas
function calcularStockTotalInsumo() {
    const inputs = document.querySelectorAll('.input-talla-stock');
    let total = 0;
    let hayValores = false;
    inputs.forEach(input => {
        const val = parseInt(input.value) || 0;
        if (input.value !== '') hayValores = true;
        total += val;
    });
    const stockInput = document.getElementById('insumoStock');
    if (hayValores) stockInput.value = total;
}

async function guardarNuevoInsumo(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const textoOriginal = btn.innerText;
    btn.innerText = "Guardando..."; btn.disabled = true;

    if (insumoExistenteEncontrado) {
        // Calcular nuevo stock total y tallas actualizadas
        const cantidadAAgregar = parseInt(document.getElementById('insumoStock').value);
        if (isNaN(cantidadAAgregar) || cantidadAAgregar <= 0) { alert("Por favor, ingresa una cantidad válida."); btn.innerText = textoOriginal; btn.disabled = false; return; }
        
        // Procesar tallas: Mezclar existentes con las nuevas agregadas
        let tallasActualizadas = [];
        let tallasMap = {};

        // 1. Cargar tallas existentes
        if (insumoExistenteEncontrado.tallas && Array.isArray(insumoExistenteEncontrado.tallas)) {
            insumoExistenteEncontrado.tallas.forEach(t => {
                const [talla, qty] = t.split(':').map(s => s.trim());
                if (talla) tallasMap[talla] = parseInt(qty) || 0;
            });
        }

        // 2. Sumar lo que se está agregando ahora
        const inputsTallas = document.querySelectorAll('.input-talla-stock');
        inputsTallas.forEach(input => {
            const val = parseInt(input.value);
            if (!isNaN(val) && val > 0) {
                const talla = input.dataset.talla;
                tallasMap[talla] = (tallasMap[talla] || 0) + val;
            }
        });

        // 3. Reconstruir array de strings
        tallasActualizadas = Object.entries(tallasMap).map(([k, v]) => `${k}: ${v}`);
        const nuevoStockTotal = (insumoExistenteEncontrado.stock || 0) + cantidadAAgregar;

        try { // PUT (Actualización completa)
            const url = window.getApiUrl ? window.getApiUrl('/api/inventario_general') : '/api/inventario_general';
            const res = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader() // Añadir cabecera de autorización
                }, body: JSON.stringify({ id: insumoExistenteEncontrado.id, stock: nuevoStockTotal, tallas: tallasActualizadas, categoria: insumoExistenteEncontrado.categoria }) });
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error || 'Error del servidor.');
            }
            alert(`✅ Stock y tallas actualizados. Nuevo total: ${nuevoStockTotal}`);
            cerrarModalAgregarInsumo();
            cargarInventarioGeneral();
        } catch (error) { manejarErrorApi(error); } finally { btn.innerText = textoOriginal; btn.disabled = false; }
    } else {
        // Recopilar stock por talla
        const inputsTallas = document.querySelectorAll('.input-talla-stock');
        let tallasFormateadas = [];
        let stockSumado = 0;
        inputsTallas.forEach(input => {
            const val = parseInt(input.value);
            if (!isNaN(val) && val > 0) {
                tallasFormateadas.push(`${input.dataset.talla}: ${val}`);
                stockSumado += val;
            }
        });
        const stockFinal = stockSumado > 0 ? stockSumado : (parseInt(document.getElementById('insumoStock').value) || 0);

        // Corrección: Enviar null si el código de barras está vacío para evitar error de duplicados
        const barcodeVal = document.getElementById('insumoBarcode').value.trim();
        
        const nuevoInsumo = { 
            nombre: document.getElementById('insumoNombre').value, 
            precio: parseInt(document.getElementById('insumoPrecio').value) || 0, 
            stock: stockFinal, 
            categoria: document.getElementById('insumoCategoria').value, 
            tallas: tallasFormateadas, 
            descripcion: document.getElementById('insumoDescripcion').value, 
            barcode: barcodeVal === "" ? null : barcodeVal 
        };

        try { // POST
            const url = window.getApiUrl ? window.getApiUrl('/api/inventario_general') : '/api/inventario_general';
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader() // Añadir cabecera de autorización
                }, body: JSON.stringify(nuevoInsumo) });
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error || 'Error al guardar.');
            }
            alert('✅ Insumo guardado correctamente.');
            cerrarModalAgregarInsumo();
            e.target.reset();
            cargarInventarioGeneral();
        } catch (error) { manejarErrorApi(error); } finally { btn.innerText = textoOriginal; btn.disabled = false; }
    }
}

async function actualizarStockInsumo(id, nuevoStock) {
    const stockNum = parseInt(nuevoStock);
    if (isNaN(stockNum) || stockNum < 0) return;
    try {
        const url = window.getApiUrl ? window.getApiUrl('/api/inventario_general') : '/api/inventario_general';
        await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader() // Añadir cabecera de autorización
            }, body: JSON.stringify({ id, stock: stockNum }) });
        const insumoIndex = insumos.findIndex(i => i.id === id);
        if (insumoIndex !== -1) insumos[insumoIndex].stock = stockNum;
    } catch (error) { console.error(error); alert('No se pudo actualizar el stock.'); cargarInventarioGeneral(); }
}

async function eliminarInsumo(id) {
    if (!confirm('¿Estás seguro de eliminar este insumo permanentemente?')) return;
    try { const url = window.getApiUrl ? window.getApiUrl('/api/inventario_general') : '/api/inventario_general';
        await fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader() // Añadir cabecera de autorización
        }, body: JSON.stringify({ id }) }); cargarInventarioGeneral(); }
    catch (error) { console.error(error); alert('No se pudo eliminar el insumo.'); }
}

function abrirModalAgregarInsumo() {
    insumoExistenteEncontrado = null;
    const form = document.getElementById('form-nuevo-insumo');
    if (form) form.reset();
    document.getElementById('insumoStockLabel').innerText = 'Stock Inicial';
    document.getElementById('insumoStock').value = '0';
    document.getElementById('insumoNombre').readOnly = false;
    document.getElementById('insumoPrecio').readOnly = false;
    document.getElementById('insumoCategoria').readOnly = false;
    document.getElementById('insumoDescripcion').readOnly = false;
    document.querySelectorAll('.input-talla-stock').forEach(input => {
        input.value = '';
        input.oninput = calcularStockTotalInsumo; // Activar cálculo automático
    });
    document.getElementById('insumo-barcode-status').style.display = 'none';
    window.abrirModal('modal-agregar-insumo');
}

function cerrarModalAgregarInsumo() { window.cerrarModal('modal-agregar-insumo'); }

async function buscarInsumoPorBarcode(barcode) {
    const statusEl = document.getElementById('insumo-barcode-status');
    const resetToNewMode = () => {
        insumoExistenteEncontrado = null;
        document.getElementById('insumoStockLabel').innerText = 'Stock Inicial';
        document.getElementById('insumoNombre').readOnly = false;
        document.getElementById('insumoPrecio').readOnly = false;
        document.getElementById('insumoCategoria').readOnly = false;
        document.getElementById('insumoDescripcion').readOnly = false;
        document.querySelectorAll('.input-talla-stock').forEach(i => { i.value = ''; i.disabled = false; });
        statusEl.style.display = 'none';
    };
    if (!barcode) { resetToNewMode(); return; }
    try {
        const url = window.getApiUrl ? window.getApiUrl(`/api/inventario_general?barcode=${barcode}`) : `/api/inventario_general?barcode=${barcode}`;
        const res = await fetch(url);
        if (res.ok) {
            const insumo = await res.json();
            insumoExistenteEncontrado = insumo;
            document.getElementById('insumoNombre').value = insumo.nombre;
            document.getElementById('insumoPrecio').value = insumo.precio;
            document.getElementById('insumoCategoria').value = insumo.categoria;
            document.getElementById('insumoDescripcion').value = insumo.descripcion;
            document.querySelectorAll('.input-talla-stock').forEach(i => { i.value = ''; i.disabled = false; }); // Permitir agregar por talla
            document.getElementById('insumoStockLabel').innerText = 'Cantidad a AÑADIR (Total o por Talla)';
            document.getElementById('insumoStock').value = '1';
            document.getElementById('insumoNombre').readOnly = true;
            document.getElementById('insumoPrecio').readOnly = true;
            document.getElementById('insumoCategoria').readOnly = true;
            document.getElementById('insumoDescripcion').readOnly = true;
            statusEl.innerText = `✅ Insumo existente encontrado. Se actualizará el stock.`;
            statusEl.style.color = 'green';
            statusEl.style.display = 'block';
        } else {
            resetToNewMode();
            statusEl.innerText = `Código de barras libre. Se creará un nuevo insumo.`;
            statusEl.style.color = '#666';
            statusEl.style.display = 'block';
        }
    } catch (error) { console.error(error); resetToNewMode(); }
}

function iniciarEscaneoParaInput(targetInputId, triggerSearch = false) {
    const isApp = window.location.protocol === 'file:' || window.location.protocol === 'capacitor:' || window.Capacitor;

    if (!isApp && window.location.protocol !== 'https:' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        alert("⚠️ Aviso: La cámara requiere HTTPS para funcionar en celulares.");
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        if (isApp) {
            alert("🚫 Error de Permisos: La App no puede acceder a la cámara.\n\nVe a Ajustes del celular > Aplicaciones > StyleProUniformes > Permisos y activa la Cámara.");
        } else {
            alert("🚫 ERROR: La cámara requiere HTTPS (candadito seguro) para funcionar en el celular.");
        }
        return;
    }

    // Asegurar que el escáner principal esté detenido para liberar la cámara
    detenerEscaneoBarcode();

    targetInputIdForScanner = targetInputId;
    const videoElement = document.getElementById('generic-scanner-video');
    const statusElement = document.getElementById('generic-scanner-status');
    if (typeof ZXing === 'undefined') {
        alert('Error: La librería del escáner no se ha cargado.');
        return;
    }
    if (!genericCodeReader) genericCodeReader = new ZXing.BrowserMultiFormatReader();
    window.abrirModal('modal-generic-scanner');
    statusElement.innerText = 'Iniciando cámara...';
    
    // Dar tiempo al modal para abrirse y que el video tenga dimensiones antes de iniciar
    setTimeout(() => {
        const constraints = { 
            video: { 
                facingMode: "environment", 
                focusMode: "continuous",
                width: { min: 640, ideal: 1280, max: 1920 }, 
                height: { min: 480, ideal: 720, max: 1080 } 
            } 
        };
        genericCodeReader.decodeFromConstraints(constraints, videoElement, (result, err) => {
            if (result) {
                playBeep();
                const targetInput = document.getElementById(targetInputIdForScanner);
                if (targetInput) {
                    targetInput.value = result.text;
                    window.mostrarNotificacion('✅ Código escaneado: ' + result.text);
                    if (triggerSearch) targetInput.dispatchEvent(new Event('blur'));
                }
                detenerEscaneoGenerico();
            }
        }).then(() => {
            statusElement.innerText = 'Apunte al código de barras...';
        }).catch(err => { console.error(err); statusElement.innerText = `Error: ${err.message}`; alert(`Error al iniciar la cámara: ${err.message}`); detenerEscaneoGenerico(); });
    }, 300);
}

function detenerEscaneoGenerico() {
    if (genericCodeReader) genericCodeReader.reset();
    window.cerrarModal('modal-generic-scanner');
    targetInputIdForScanner = null;
}

// --- Gestión de Tallas (Disponibilidad) ---
function abrirModalTallas(id) {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;

    document.getElementById('editTallaId').value = id;
    const container = document.getElementById('editTallasContainer');
    container.innerHTML = '';

    // Configurar grid para inputs
    container.style.display = 'grid';
    container.style.gridTemplateColumns = 'repeat(3, 1fr)';
    container.style.gap = '10px';

    const todasLasTallas = ["XXS", "XS", "S", "M", "L", "XL", "XXL"];
    const stockTallas = producto.stock_tallas || {};

    todasLasTallas.forEach(talla => {
        const stockVal = stockTallas[talla] !== undefined ? stockTallas[talla] : 0;
        const html = `
            <div style="text-align: center;">
                <label style="font-size: 0.8rem; font-weight: bold;">${talla}</label>
                <input type="number" class="input-edit-talla" data-talla="${talla}" value="${stockVal}" min="0" style="width: 100%; padding: 8px; text-align: center; border: 1px solid #ddd; border-radius: 6px;">
            </div>
        `;
        container.innerHTML += html;
    });

    window.abrirModal('modal-editar-tallas');
}

function cerrarModalTallas() {
    window.cerrarModal('modal-editar-tallas');
}

async function guardarTallasEditadas(e) {
    e.preventDefault();
    const id = parseInt(document.getElementById('editTallaId').value);
    const inputs = document.querySelectorAll('.input-edit-talla');
    
    let stockTallas = {};
    let nuevasTallas = [];
    let totalStock = 0;

    inputs.forEach(input => {
        const talla = input.dataset.talla;
        const val = parseInt(input.value) || 0;
        
        stockTallas[talla] = val;
        totalStock += val;
        if (val > 0) {
            nuevasTallas.push(talla);
        }
    });

    try {
        const url = window.getApiUrl ? window.getApiUrl('/api/productos') : '/api/productos';
        await fetch(url, { 
            method: 'PUT', 
            headers: { 'Content-Type': 'application/json', ...getAuthHeader() }, 
            body: JSON.stringify({ id: id, tallas: nuevasTallas, stock_tallas: stockTallas, stock: totalStock }) 
        });

        const p = productos.find(p => p.id === id);
        if(p) { p.tallas = nuevasTallas; p.stock_tallas = stockTallas; p.stock = totalStock; }
        window.mostrarNotificacion("✅ Stock por talla actualizado");
        cerrarModalTallas();
        renderizarTablaInventario(); // Recargar la tabla para ver el stock total actualizado
    } catch (error) { console.error(error); window.mostrarNotificacion("❌ Error al actualizar"); }
}

// Exponer funciones globales
window.manejarErrorApi = manejarErrorApi;
window.ordenarInventario = ordenarInventario;
window.cargarInventarioAdmin = cargarInventarioAdmin;
window.cambiarVisibilidad = cambiarVisibilidad;
window.cambiarStock = cambiarStock;
window.eliminarProducto = eliminarProducto;
window.guardarNuevoProducto = guardarNuevoProducto;
window.abrirModalAgregar = abrirModalAgregar;
window.cerrarModalAgregar = cerrarModalAgregar;
window.guardarCambios = guardarCambios;
window.cargarVentasAdmin = cargarVentasAdmin;
window.cargarConfigPromo = cargarConfigPromo;
window.guardarConfigPromo = guardarConfigPromo;
window.abrirPromo = abrirPromo; // Sobrescribe la de UI para añadir lógica de fetch
window.iniciarEscaneoBarcode = iniciarEscaneoBarcode;
window.detenerEscaneoBarcode = detenerEscaneoBarcode;
window.actualizarStockPorBarcode = actualizarStockPorBarcode;
window.cargarInventarioGeneral = cargarInventarioGeneral;
window.guardarNuevoInsumo = guardarNuevoInsumo;
window.actualizarStockInsumo = actualizarStockInsumo;
window.eliminarInsumo = eliminarInsumo;
window.abrirModalAgregarInsumo = abrirModalAgregarInsumo;
window.cerrarModalAgregarInsumo = cerrarModalAgregarInsumo;
window.buscarInsumoPorBarcode = buscarInsumoPorBarcode;
window.iniciarEscaneoParaInput = iniciarEscaneoParaInput;
window.detenerEscaneoGenerico = detenerEscaneoGenerico;
window.abrirModalTallas = abrirModalTallas;
window.cerrarModalTallas = cerrarModalTallas;
window.guardarTallasEditadas = guardarTallasEditadas;
window.cambiarEstadoVenta = cambiarEstadoVenta;
window.filtrarInventarioGeneral = filtrarInventarioGeneral;
