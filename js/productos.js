/**
 * js/productos.js
 * Gestión de productos, carga de datos y renderizado
 */

// Datos Iniciales (Hardcoded)
const productosBase = [
    { id: 1, nombre: "Conjunto Azul Marino", precio: 39990, categorias: ["Mujer"], mostrar: false, imagenes: ["imagenes/conjuntoazulmarino.jpeg", "imagenes/conjuntoazulmarino2.jpeg", "imagenes/conjuntoazulmarino3.jpeg"], barcode: "7801234567890", descripcion: "Top clínico elasticado, antifluido, confeccionado en Chile." },
    { id: 2, nombre: "Top Lila", precio: 19990, categorias: ["Mujer"], mostrar: false, imagenes: ["imagenes/toplila4.jpeg", "imagenes/toplila2.jpeg", "imagenes/toplila.jpeg"], barcode: "7801234567891", descripcion: "Top clínico elasticado, antifluido, confeccionado en Chile." },
    { id: 3, nombre: "Top Celeste Cielo", precio: 19990, categorias: ["Mujer"], mostrar: false, imagenes: ["imagenes/topceleste.jpeg", "imagenes/topceleste2.jpeg", "imagenes/topceleste3.jpeg"], barcode: "7801234567892", descripcion: "Top clínico elasticado, antifluido, confeccionado en Chile." },
    { id: 4, nombre: "Top Celeste ", precio: 19990, categorias: ["Mujer"], mostrar: false, imagenes: ["imagenes/topcelestecielo2.jpeg", "imagenes/topcelestecielo.jpeg", "imagenes/topcelestecielo3.jpeg"], barcode: "7801234567893", descripcion: "Top clínico elasticado, antifluido, confeccionado en Chile." },
    { id: 5, nombre: "Top Menta", precio: 19990, categorias: ["Mujer"], mostrar: false, imagenes: ["imagenes/topmenta6.jpeg", "imagenes/topmenta4.jpeg", "imagenes/topmenta5.jpeg"], barcode: "7801234567894", descripcion: "Top clínico elasticado, antifluido, confeccionado en Chile." },
    { id: 6, nombre: "Conjunto Negro", precio: 39990, categorias: ["Mujer"], mostrar: true, imagenes: ["imagenes/conjuntonegro2.jpeg", "imagenes/topnegro.jpeg", "imagenes/topnegro3.jpeg"], barcode: "7801234567895", descripcion: "Top clínico elasticado de alta calidad, sin tachas. Este mismo modelo está disponible en distintos colores para que elijas el que más te guste." },
    { id: 7, nombre: "Top Rosa", precio: 19990, categorias: ["Mujer"], mostrar: false, imagenes: ["imagenes/toprosa.jpeg", "imagenes/toprosa3.jpeg", "imagenes/toprosa4.jpeg"], barcode: "7801234567896", descripcion: "Top clínico elasticado, antifluido, confeccionado en Chile.." },
    { id: 8, nombre: "Top Verde Esperanza", precio: 19990, categorias: ["Mujer"], mostrar: false, imagenes: ["imagenes/topverdeesperanza3.jpeg", "imagenes/topverdeesperanza2.jpeg", "imagenes/topverdeesperanza.jpeg"], barcode: "7801234567897", descripcion: "Top clínico elasticado, antifluido, confeccionado en Chile." },
    { id: 9, nombre: "Top Esmeralda", precio: 19990, categorias: ["Mujer"], mostrar: false, imagenes: ["imagenes/topcalipso3.jpeg", "imagenes/topcalipso.jpeg", "imagenes/topcalipso4.jpeg"], barcode: "7801234567898", descripcion: "Top clínico elasticado, antifluido, confeccionado en Chile." },
    { id: 10, nombre: "Top Burdeo", precio: 19990, categorias: ["Mujer"], mostrar: false, imagenes: ["imagenes/topburdeo.jpeg", "imagenes/topburdeo3.jpeg", "imagenes/topburdeo5.jpeg"], barcode: "7801234567899", descripcion: "Top clínico elasticado, antifluido, confeccionado en Chile." },
    { id: 11, nombre: "Top Azul Rey", precio: 19990, categorias: ["Mujer"], mostrar: false, imagenes: ["imagenes/topazulrey1.jpeg", "imagenes/topazulrey.jpeg"], barcode: "7801234567900", descripcion: "Top clínico elasticado, antifluido, confeccionado en Chile." },
    { id: 19, nombre: "Top Antifluido Electrocardiograma", precio: 25990, categorias: ["Hombre", "Top C/N Diseños"], mostrar: false, imagenes: ["imagenes/hdise.jpeg", "imagenes/hdise2.jpeg"], barcode: "7801234567901", descripcion: "Top clínico elasticado, con diseños exclusivos, antifluido." },
    { id: 20, nombre: "Top Antifluido Palta", precio: 25990, categorias: ["Hombre", "Top C/N Diseños"], mostrar: false, imagenes: ["imagenes/topdiseh.jpeg", "imagenes/topdiseh2.jpeg", "imagenes/topdiseh3.jpeg", "imagenes/topdiseh4.jpeg"], barcode: "7801234567902", descripcion: "Top clínico elasticado, con diseños exclusivos, antifluido." },
    { id: 21, nombre: "Top Antifluido Militar", precio: 25990, categorias: ["Hombre", "Top C/N Diseños"], mostrar: false, imagenes: ["imagenes/topmi.jpeg", "imagenes/topmi1.jpeg"], barcode: "7801234567903", descripcion: "Top clínico elasticado, con diseños exclusivos, antifluido." },
    { id: 12, nombre: "Top Cancer De Mama", precio: 25990, categorias: ["Mujer", "Top C/N Diseños"], mostrar: false, imagenes: ["imagenes/cancertop2.png", "imagenes/Top-cancer-de-mama-2.jpeg"], barcode: "7801234567904", descripcion: "Top clínico elasticado, con diseños exclusivos, antifluido." },
    { id: 13, nombre: "Top Gatito Lana Azul Marino", precio: 25990, categorias: ["Mujer", "Top C/N Diseños"], mostrar: false, imagenes: ["imagenes/gatitoluna2.png", "imagenes/gatitoluna.jpeg"], barcode: "7801234567905", descripcion: "Top clínico elasticado, con diseños exclusivos, antifluido." },
    { id: 14, nombre: "Top Amor Propio Rosado", precio: 25990, categorias: ["Mujer", "Top C/N Diseños"], mostrar: false, imagenes: ["imagenes/topamorpropio.png", "imagenes/topamorpropio2.png"], barcode: "7801234567906", descripcion: "Top clínico elasticado, con diseños exclusivos, antifluido." },
    { id: 15, nombre: "Top Retro", precio: 25990, categorias: ["Mujer", "Top C/N Diseños"], mostrar: false, imagenes: ["imagenes/topretro.jpeg", "imagenes/retro1.jpeg"], barcode: "7801234567907", descripcion: "Top clínico elasticado, con diseños exclusivos, antifluido." },
    { id: 16, nombre: "Pantalon Negro mujer", precio: 19990, categorias: ["Mujer", "Pantalones"], mostrar: false, imagenes: ["imagenes/pantalonmujernegro.jpeg", "imagenes/pantallonmujernegro.jpeg", "imagenes/pantalonmujernegro1.jpeg", "imagenes/patalonmujernegro.jpeg"], barcode: "7801234567908", descripcion: "Pantalón antifluido para mujer, cómodos y de mucha durabilidad." },
    { id: 17, nombre: "Jogger Mujer Azul rey", precio: 22990, categorias: ["Mujer", "Pantalones"], mostrar: true, imagenes: ["imagenes/jogerazulrey1.jpeg", "imagenes/jogerazulrey2.jpeg", "imagenes/jogerazulrey3.jpeg", "imagenes/jogerazulrey4.jpeg", "imagenes/jogerazulrey5.jpeg", "imagenes/jogerazulrey6.jpeg"], barcode: "7801234567909", descripcion: "Pantalón jogger antifluido diseñado para profesionales que buscan comodidad, protección y un aspecto profesional. Confeccionado con tela de alta calidad que repele líquidos y evita la absorción de fluidos, ideal para largas jornadas laborales. Su diseño moderno permite libertad de movimiento, fácil limpieza y alta durabilidad." },
    { id: 18, nombre: "Pantalon Mujer Azul Rey", precio: 19990, categorias: ["Mujer", "Pantalones"], mostrar: true, imagenes: ["imagenes/paAzuRe.jpeg", "imagenes/paAzuRe2.jpeg", "imagenes/paAzuRe3.jpeg", "imagenes/paAzuRe4.jpeg"], barcode: "7801234567910", descripcion: "Pantalón antifluido para mujer, cómodos y de mucha durabilidad." }
];

// Cargar productos desde Neon
async function cargarProductosDesdeDB() {
    try {
        // Usar getApiUrl para conectar a la nube si es App
        const url = window.getApiUrl ? window.getApiUrl('/api/productos') : '/api/productos';
        const res = await fetch(url);
        if (res.status === 404) {
            console.warn("⚠️ API no encontrada (404). Usando datos locales.");
            productos = productosBase;
            conexionDB = false;
            ultimoErrorDB = "Modo Local (Sin API)";
            renderizarProductos();
            return;
        }

        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.error || `Error HTTP: ${res.status}`);
        }
        
        const data = await res.json();
        conexionDB = true;
        ultimoErrorDB = "";
        
        if (Array.isArray(data) && data.length > 0) {
            productos = data;
            console.log("✅ Productos cargados desde Neon");
        } else {
            console.log("⚠️ DB vacía, usando productos locales");
            productos = productosBase;
        }
        renderizarProductos();
    } catch (error) {
        console.error("Error cargando productos:", error);
        conexionDB = false;
        ultimoErrorDB = error.message;
        productos = productosBase;
        renderizarProductos();
    }
}

// Renderizar productos en el index
function renderizarProductos(filtro = 'todos') {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    grid.innerHTML = '';

    const productosFiltrados = filtro === 'todos'
        ? productos
        : productos.filter(p => Array.isArray(p.categorias) && p.categorias.includes(filtro));

    productosFiltrados.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.addEventListener('click', () => { irADetalle(p.id); });

        const img1 = p.imagenes?.[0] || 'https://via.placeholder.com/300x300?text=Sin+Foto';
        const img2 = p.imagenes?.[1] || img1;
        const sinStock = p.stock !== undefined && p.stock <= 0;
        const noDisponible = p.mostrar === false;
        const tallas = p.tallas || ["XXS", "XS", "S", "M", "L", "XL", "XXL"];
        const mostrarColores = p.mostrar_colores !== undefined ? p.mostrar_colores : true;

        // Procesar stock por talla (Prioridad: Inventario General > Stock Tallas Producto)
        let stockPorTalla = null;
        if (p.tallas_inventario && Array.isArray(p.tallas_inventario)) {
            stockPorTalla = {};
            p.tallas_inventario.forEach(str => {
                const [t, q] = str.split(':');
                if (t && q) stockPorTalla[t.trim()] = parseInt(q.trim());
            });
        } else if (p.stock_tallas) {
            stockPorTalla = p.stock_tallas;
        }

        let btnTexto = "Añadir al Carrito";
        let btnDisabled = "";

        if (noDisponible) {
            btnTexto = "No Disponible";
            btnDisabled = "disabled style='background:#ccc; cursor:not-allowed'";
        } else if (sinStock) {
            btnTexto = "Agotado";
            btnDisabled = "disabled style='background:#ccc; cursor:not-allowed'";
        }

        card.innerHTML = `
            <img src="${img1}" alt="${p.nombre}" class="product-img" onmouseenter="this.src='${img2}'" onmouseleave="this.src='${img1}'">
            <div class="card-body">
                <h3>${p.nombre}</h3>
                <p class="price">$${p.precio.toLocaleString('es-CL')}</p>
                <div class="selectors" onclick="event.stopPropagation()">
                    <select id="talla-${p.id}">
                        ${tallas.map(t => {
                            let disabled = "";
                            let style = "";
                            let label = t;
                            if (stockPorTalla) {
                                const qty = stockPorTalla[t];
                                // Si la talla no está en el inventario o tiene stock 0, se deshabilita
                                if (qty === undefined || qty <= 0) {
                                    disabled = "disabled";
                                    style = "color: #ccc; background-color: #f9f9f9;";
                                    label = `${t} (Agotado)`;
                                }
                            }
                            return `<option value="${t}" ${disabled} style="${style}">${label}</option>`;
                        }).join('')}
                    </select>
                </div>
                <button class="btn-add" ${btnDisabled} onclick="event.stopPropagation(); agregar(${p.id})">
                    ${btnTexto}
                </button>
                <p class="envio-info">🚚 Despacho en <strong>3 días hábiles</strong></p>
            </div>
        `;
        grid.appendChild(card);
    });
}

function filtrarProductos(categoria) {
    document.querySelectorAll('.btn-filter').forEach(btn => {
        btn.classList.remove('active');
        if(btn.innerText === categoria || (categoria === 'todos' && btn.innerText === 'Todos')) {
            btn.classList.add('active');
        }
    });
    renderizarProductos(categoria);
}

function irADetalle(id) {
    window.location.href = `detalle.html?id=${id}`;
}

// Cargar detalle (para detalle.html)
async function cargarDetalleProducto() {
    const params = new URLSearchParams(window.location.search);
    const idProducto = parseInt(params.get("id"));
    if (!idProducto) return;
    
    if (productos.length === 0) await cargarProductosDesdeDB();

    const producto = productos.find(p => p.id === idProducto);
    if (producto) {
        const sinStock = producto.stock !== undefined && producto.stock <= 0;
        const noDisponible = producto.mostrar === false;
        let btnTexto = "Añadir al Carrito";
        let btnAttr = `onclick="agregarDesdeDetalle(${producto.id})"`;

        if (noDisponible) {
            btnTexto = "No Disponible";
            btnAttr = "disabled style='background:#ccc; cursor:not-allowed'";
        } else if (sinStock) {
            btnTexto = "Agotado";
            btnAttr = "disabled style='background:#ccc; cursor:not-allowed'";
        }

        const imgs = (producto.imagenes && producto.imagenes.length > 0) ? producto.imagenes : ['https://via.placeholder.com/400x400?text=Sin+Imagen'];
        const tallas = producto.tallas || ["XXS", "XS", "S", "M", "L", "XL", "XXL"];
        const mostrarColores = producto.mostrar_colores !== undefined ? producto.mostrar_colores : true;

        // Procesar stock por talla
        let stockPorTalla = null;
        if (producto.tallas_inventario && Array.isArray(producto.tallas_inventario)) {
            stockPorTalla = {};
            producto.tallas_inventario.forEach(str => {
                const [t, q] = str.split(':');
                if (t && q) stockPorTalla[t.trim()] = parseInt(q.trim());
            });
        } else if (producto.stock_tallas) {
            stockPorTalla = producto.stock_tallas;
        }

        document.getElementById("detalle-producto").innerHTML = `
        <div class="detalle-page">
            <div class="detalle-card">
                <button class="btn-back" onclick="window.history.back()" aria-label="Volver"><span class="icon">↩</span></button>
                <div class="galeria">
                    <img src="${imgs[0]}" class="img-principal" id="imgPrincipal">
                    <div class="miniaturas">${imgs.map(img => `<img src="${img}" onclick="cambiarImagen('${img}')">`).join('')}</div>
                </div>
                <div class="detalle-info">
                    <h1>${producto.nombre}</h1>
                    <p class="precio">$${producto.precio.toLocaleString("es-CL")}</p>
                    <ul class="detalle-caracteristicas">
                        <li>✨ Tela premium elasticada</li>
                        <li>💦 Protección antifluido</li>
                        <li>🇨🇱 Diseño y confección chilena</li>
                        <li>⭐ Estándar profesional</li>
                        ${producto.stock ? `<li>📦 <strong>Stock disponible:</strong> ${producto.stock} un.</li>` : ''}
                    </ul>
                    <p class="detalle-desc">${producto.descripcion}</p>
                    <div class="detalle-selectores">
                        <select id="detalle-talla">
                            ${tallas.map(t => {
                                let disabled = "";
                                let style = "";
                                let label = t;
                                if (stockPorTalla) {
                                    const qty = stockPorTalla[t];
                                    if (qty === undefined || qty <= 0) {
                                        disabled = "disabled";
                                        style = "color: #ccc; background-color: #f9f9f9;";
                                        label = `${t} (Agotado)`;
                                    }
                                }
                                return `<option value="${t}" ${disabled} style="${style}">${label}</option>`;
                            }).join('')}
                        </select>
                    </div>
                    <button class="btn-add" ${btnAttr}>${btnTexto}</button>
                    <p class="envio-info">🚚 Despacho en <strong>3 días hábiles</strong></p>
                </div>
            </div>
        </div>`;
    }
}

// Exponer funciones globales
window.cargarProductosDesdeDB = cargarProductosDesdeDB;
window.renderizarProductos = renderizarProductos;
window.filtrarProductos = filtrarProductos;
window.irADetalle = irADetalle;
window.cargarDetalleProducto = cargarDetalleProducto;
