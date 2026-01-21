/**
 * js/admin.js
 * Lógica del panel de administración
 */

// --- Inventario Tienda ---
let ordenColumna = '';
let ordenDireccion = 'asc';

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
            statusDiv.innerHTML = esVacia ? "🟢 Conectado (Base de datos vacía - Dale a Migrar)" : "🟢 Conectado a Neon DB";
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
                    <button onclick="eliminarProducto(${p.id})" title="Eliminar" style="cursor:pointer; border:none; background:none; font-size:1.2rem; margin-left: 8px;">🗑️</button>
                </td>
            </tr>`;
        tbody.innerHTML += row;
    });
}

async function migrarProductosANeon() {
    if(!confirm("¿Estás seguro de subir los productos base a Neon? Se omitirán los que ya existan.")) return;
    let productosEnDB = [];
    try {
        const res = await fetch('/api/productos');
        if (res.ok) productosEnDB = await res.json();
    } catch (e) { console.error(e); }

    let contador = 0, errores = 0, omitidos = 0, ultimoError = "";
    const btn = document.querySelector('button[onclick="migrarProductosANeon()"]');
    if(btn) { btn.innerText = "⏳ Subiendo..."; btn.disabled = true; }

    for (const p of productosBase) {
        const existe = productosEnDB.find(dbProd => dbProd.nombre === p.nombre);
        if (existe) { omitidos++; continue; }
        const nuevoProd = { ...p, stock: 100, barcode: p.barcode || null };
        try {
            const res = await fetch('/api/productos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader() // Añadir cabecera de autorización
                },
                body: JSON.stringify(nuevoProd) });
            if (!res.ok) throw new Error(`Error ${res.status}`);
            contador++;
        } catch (e) { errores++; ultimoError = e.message; }
    }

    if (errores > 0) alert(`⚠️ Proceso con errores.\n✅ Subidos: ${contador}\n⏭️ Omitidos: ${omitidos}\n❌ Fallidos: ${errores}\n\nÚltimo error: ${ultimoError}`);
    else { alert(`✅ Proceso finalizado.\n✨ Nuevos subidos: ${contador}\n⏭️ Omitidos: ${omitidos}`); location.reload(); }
    if(btn) { btn.innerText = "⚠️ Migrar Datos Iniciales"; btn.disabled = false; }
}

async function cambiarVisibilidad(id, nuevoEstado) {
    try {
        await fetch('/api/productos', {
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
        await fetch('/api/productos', {
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
        const res = await fetch('/api/productos', {
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
    const stock = parseInt(document.getElementById('newStock').value);
    const categoria = document.getElementById('newCategoria').value;
    const descripcion = document.getElementById('newDescripcion').value;
    const barcode = document.getElementById('newBarcode').value.trim();
    if (barcode === "") { alert("El código de barras no puede estar vacío."); return; }
    
    const checkboxes = document.querySelectorAll('.talla-option input:checked');
    const tallas = Array.from(checkboxes).map(cb => cb.value);
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

    const nuevoProd = { nombre, precio, stock, categorias: [categoria], imagenes: imagenesProcesadas, descripcion, mostrar: true, tallas: tallas.length > 0 ? tallas : ["S", "M", "L"], mostrarColores: mostrarColores, barcode: barcode };
    btn.innerText = "Guardando...";

    try {
        const res = await fetch('/api/productos', {
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
    } catch (error) { console.error(error); alert("❌ Error: " + error.message); } finally { btn.innerText = textoOriginal; btn.disabled = false; }
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
    const res = await fetch('/api/ventas', {
        headers: { ...getAuthHeader() } // Proteger lectura de ventas
    });
    if (!res.ok) { container.innerHTML = `<tr><td colspan="5" style="color:red">Error al cargar ventas: Acceso denegado.</td></tr>`; return; }
    const ventas = await res.json();
    container.innerHTML = '';
    ventas.forEach(venta => {
        const fecha = venta.fecha ? new Date(venta.fecha).toLocaleDateString() : '-';
        const items = venta.items || [];
        const row = `<tr><td>${fecha}</td><td>${venta.orden}</td><td>Cliente Web</td><td>$${(venta.total || 0).toLocaleString('es-CL')}</td><td><ul style="font-size:0.8rem; padding-left:15px; margin:0;">${items.map(i => `<li>${i.nombre} (x${i.cantidad})</li>`).join('')}</ul></td></tr>`;
        container.innerHTML += row;
    });
}

// --- Promo ---
async function cargarConfigPromo() {
    try {
        const res = await fetch('/api/promo'); // GET es público para que la tienda lo vea
        if (res.ok) {
            const config = await res.json();
            document.getElementById('promoActivo').checked = config.activo;
            document.getElementById('promoTitulo').value = config.titulo || "";
            document.getElementById('promoSubtitulo').value = config.subtitulo || "";
            document.getElementById('promoContenido').value = config.contenido || "";
            document.getElementById('promoTag').value = config.tag || "";
        }
    } catch (e) { console.error("Error cargando config promo:", e); }
}

async function guardarConfigPromo(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    const txtOriginal = btn.innerText;
    btn.innerText = "Guardando..."; btn.disabled = true;
    const config = { activo: document.getElementById('promoActivo').checked, titulo: document.getElementById('promoTitulo').value, subtitulo: document.getElementById('promoSubtitulo').value, contenido: document.getElementById('promoContenido').value, tag: document.getElementById('promoTag').value };
    try {
        await fetch('/api/promo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader() // Añadir cabecera de autorización
            }, body: JSON.stringify(config) });
        mostrarNotificacion("✅ Configuración de oferta actualizada");
    } catch (error) { mostrarNotificacion("❌ Error al guardar"); } finally { btn.innerText = txtOriginal; btn.disabled = false; }
}

async function abrirPromo() {
    // Verificar si ya se mostró en esta sesión
    if (sessionStorage.getItem('promoVisto') === 'true') return;

    try {
        const res = await fetch(`/api/promo?_t=${Date.now()}`);
        if (res.ok) {
            const config = await res.json();
            const estaActivo = config.activo === true || config.activo === "true" || config.activo === 1;
            if (!estaActivo) return;
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
async function iniciarEscaneoBarcode() {
    const videoElement = document.getElementById('scanner-video');
    const scannedBarcodeSpan = document.getElementById('scanned-barcode');
    const scannedProductInfo = document.getElementById('scanned-product-info');
    const addStockBtn = document.getElementById('add-stock-btn');
    const removeStockBtn = document.getElementById('remove-stock-btn');
    scannedBarcodeSpan.innerText = 'Iniciando escáner...';
    scannedProductInfo.innerText = '';
    addStockBtn.style.display = 'none';
    removeStockBtn.style.display = 'none';

    if (!codeReader) codeReader = new ZXing.BrowserMultiFormatReader();
    try {
        const videoInputDevices = await codeReader.getVideoInputDevices();
        if (videoInputDevices.length === 0) { alert('No se encontraron cámaras.'); scannedBarcodeSpan.innerText = 'Error: No hay cámaras.'; return; }
        selectedDeviceId = videoInputDevices.find(device => device.label.toLowerCase().includes('back'))?.deviceId || videoInputDevices[0].deviceId;
        codeReader.decodeFromVideoDevice(selectedDeviceId, videoElement, (result, err) => {
            if (result) {
                scannedBarcodeSpan.innerText = result.text;
                detenerEscaneoBarcode(); 
                mostrarInfoProductoEscaneado(result.text);
                addStockBtn.style.display = 'inline-block';
                removeStockBtn.style.display = 'inline-block';
            }
        });
        scannedBarcodeSpan.innerText = 'Escaneando...';
    } catch (error) { console.error(error); scannedBarcodeSpan.innerText = 'Error al iniciar la cámara.'; alert('Error al iniciar el escáner.'); }
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
        const res = await fetch('/api/productos', {
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
        const res = await fetch('/api/inventario_general');
        if (!res.ok) throw new Error('No se pudo cargar el inventario general.');
        insumos = await res.json();
        renderizarTablaInsumos();
    } catch (error) { console.error(error); tbody.innerHTML = `<tr><td colspan="7" style="color:red;">${error.message}</td></tr>`; }
}

function renderizarTablaInsumos() {
    const tbody = document.getElementById('inventario-general-body');
    tbody.innerHTML = '';
    if (insumos.length === 0) { tbody.innerHTML = '<tr><td colspan="7">No hay insumos en el inventario.</td></tr>'; return; }
    insumos.forEach(insumo => {
        const row = `<tr data-insumo-id="${insumo.id}"><td><strong>${insumo.nombre}</strong></td><td>${insumo.barcode || 'N/A'}</td><td>${insumo.categoria || 'N/A'}</td><td><input type="number" value="${insumo.stock}" min="0" onchange="actualizarStockInsumo(${insumo.id}, this.value)" style="width: 80px; padding: 5px; border: 1px solid #ddd; border-radius: 5px; text-align: center;"></td><td>$${(insumo.precio || 0).toLocaleString('es-CL')}</td><td>${(insumo.tallas || []).join(', ') || 'N/A'}</td><td>${insumo.descripcion || 'Sin descripción'}</td><td><button onclick="eliminarInsumo(${insumo.id})" title="Eliminar" style="cursor:pointer; border:none; background:none; font-size:1.2rem;">🗑️</button></td></tr>`;
        tbody.innerHTML += row;
    });
    const summaryContainer = document.getElementById('inventario-general-summary');
    if (summaryContainer) {
        const totalStock = insumos.reduce((acc, item) => acc + (item.stock || 0), 0);
        const valorTotal = insumos.reduce((acc, item) => acc + ((item.stock || 0) * (item.precio || 0)), 0);
        summaryContainer.innerHTML = `<div><h4 style="margin:0; color: #666; font-size: 0.9rem;">Total de Insumos (Stock)</h4><p style="margin:0; font-size: 1.5rem; font-weight: 700;">${totalStock.toLocaleString('es-CL')}</p></div><div><h4 style="margin:0; color: #666; font-size: 0.9rem;">Valor Total del Inventario</h4><p style="margin:0; font-size: 1.5rem; font-weight: 700;">$${valorTotal.toLocaleString('es-CL')}</p></div>`;
    }
}

async function guardarNuevoInsumo(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const textoOriginal = btn.innerText;
    btn.innerText = "Guardando..."; btn.disabled = true;

    if (insumoExistenteEncontrado) {
        const cantidad = parseInt(document.getElementById('insumoStock').value);
        if (isNaN(cantidad) || cantidad <= 0) { alert("Por favor, ingresa una cantidad válida."); btn.innerText = textoOriginal; btn.disabled = false; return; }
        try { // PATCH
            const res = await fetch('/api/inventario_general', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader() // Añadir cabecera de autorización
                }, body: JSON.stringify({ barcode: insumoExistenteEncontrado.barcode, cantidad: cantidad }) });
            if (!res.ok) throw new Error('Error del servidor.');
            const result = await res.json();
            alert(`✅ Stock actualizado. Nuevo stock: ${result.insumo.stock}`);
            cerrarModalAgregarInsumo();
            cargarInventarioGeneral();
        } catch (error) { console.error(error); alert(`❌ Error: ${error.message}`); } finally { btn.innerText = textoOriginal; btn.disabled = false; }
    } else {
        const tallasCheckboxes = document.querySelectorAll('#modal-agregar-insumo .talla-option input:checked');
        const nuevoInsumo = { nombre: document.getElementById('insumoNombre').value, precio: parseInt(document.getElementById('insumoPrecio').value) || 0, stock: parseInt(document.getElementById('insumoStock').value) || 0, categoria: document.getElementById('insumoCategoria').value, tallas: Array.from(tallasCheckboxes).map(cb => cb.value), descripcion: document.getElementById('insumoDescripcion').value, barcode: document.getElementById('insumoBarcode').value };
        try { // POST
            const res = await fetch('/api/inventario_general', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader() // Añadir cabecera de autorización
                }, body: JSON.stringify(nuevoInsumo) });
            if (!res.ok) throw new Error('Error al guardar.');
            alert('✅ Insumo guardado correctamente.');
            cerrarModalAgregarInsumo();
            e.target.reset();
            cargarInventarioGeneral();
        } catch (error) { console.error(error); alert(`❌ Error: ${error.message}`); } finally { btn.innerText = textoOriginal; btn.disabled = false; }
    }
}

async function actualizarStockInsumo(id, nuevoStock) {
    const stockNum = parseInt(nuevoStock);
    if (isNaN(stockNum) || stockNum < 0) return;
    try {
        await fetch('/api/inventario_general', {
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
    try { await fetch('/api/inventario_general', {
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
    document.querySelectorAll('#modal-agregar-insumo .talla-option input').forEach(cb => cb.disabled = false);
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
        document.querySelectorAll('#modal-agregar-insumo .talla-option input').forEach(cb => cb.disabled = false);
        statusEl.style.display = 'none';
    };
    if (!barcode) { resetToNewMode(); return; }
    try {
        const res = await fetch(`/api/inventario_general?barcode=${barcode}`);
        if (res.ok) {
            const insumo = await res.json();
            insumoExistenteEncontrado = insumo;
            document.getElementById('insumoNombre').value = insumo.nombre;
            document.getElementById('insumoPrecio').value = insumo.precio;
            document.getElementById('insumoCategoria').value = insumo.categoria;
            document.getElementById('insumoDescripcion').value = insumo.descripcion;
            const tallasCheckboxes = document.querySelectorAll('#modal-agregar-insumo .talla-option input');
            tallasCheckboxes.forEach(cb => { cb.checked = (insumo.tallas || []).includes(cb.value); cb.disabled = true; });
            document.getElementById('insumoStockLabel').innerText = 'Cantidad a AÑADIR al Stock';
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
    targetInputIdForScanner = targetInputId;
    const videoElement = document.getElementById('generic-scanner-video');
    const statusElement = document.getElementById('generic-scanner-status');
    if (!genericCodeReader) genericCodeReader = new ZXing.BrowserMultiFormatReader();
    window.abrirModal('modal-generic-scanner');
    statusElement.innerText = 'Iniciando cámara...';
    genericCodeReader.getVideoInputDevices().then(videoInputDevices => {
        if (videoInputDevices.length <= 0) throw new Error("No se encontraron cámaras.");
        const rearCamera = videoInputDevices.find(device => device.label.toLowerCase().includes('back')) || videoInputDevices[0];
        statusElement.innerText = 'Apunte al código de barras...';
        genericCodeReader.decodeFromVideoDevice(rearCamera.deviceId, videoElement, (result, err) => {
            if (result) {
                const targetInput = document.getElementById(targetInputIdForScanner);
                targetInput.value = result.text;
                detenerEscaneoGenerico();
                window.mostrarNotificacion('✅ Código escaneado: ' + result.text);
                if (triggerSearch) targetInput.dispatchEvent(new Event('blur'));
            }
        });
    }).catch(err => { console.error(err); statusElement.innerText = `Error: ${err.message}`; alert(`Error al iniciar la cámara: ${err.message}`); detenerEscaneoGenerico(); });
}

function detenerEscaneoGenerico() {
    if (genericCodeReader) genericCodeReader.reset();
    window.cerrarModal('modal-generic-scanner');
    targetInputIdForScanner = null;
}

// Exponer funciones globales
window.ordenarInventario = ordenarInventario;
window.cargarInventarioAdmin = cargarInventarioAdmin;
window.migrarProductosANeon = migrarProductosANeon;
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
