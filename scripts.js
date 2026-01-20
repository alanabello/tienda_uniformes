let productos = []; // Ahora la lista es dinámica

// 1. DATOS INICIALES (Solo para migración)
// Estos son tus productos actuales. Usaremos una función en Admin para subirlos a la base de datos.
const productosBase = [
    {
        id: 1,
        nombre: "Conjunto Azul Marino",
        precio: 39990,
        categorias: ["Mujer"],
        mostrar: false,
        imagenes: [
            "imagenes/conjuntoazulmarino.jpeg",
            "imagenes/conjuntoazulmarino2.jpeg",
            "imagenes/conjuntoazulmarino3.jpeg"
        ],
        descripcion: "Top clínico elasticado, antifluido, confeccionado en Chile."
    },
    {
        id: 2,
        nombre: "Top Lila",
        precio: 19990,
        categorias: ["Mujer"],
        mostrar: false,
        imagenes: [
            "imagenes/toplila4.jpeg",
            "imagenes/toplila2.jpeg",
            "imagenes/toplila.jpeg"
        ],
        descripcion: "Top clínico elasticado, antifluido, confeccionado en Chile."
    },
    {
        id: 3,
        nombre: "Top Celeste Cielo",
        precio: 19990,
        categorias: ["Mujer"],
        mostrar: false,
        imagenes: [
            "imagenes/topceleste.jpeg",
            "imagenes/topceleste2.jpeg",
            "imagenes/topceleste3.jpeg"
        ],
        descripcion: "Top clínico elasticado, antifluido, confeccionado en Chile."
    }
    ,
    {
        id: 4,
        nombre: "Top Celeste ",
        precio: 19990,
        categorias: ["Mujer"],
        mostrar: false,
        imagenes: [
            "imagenes/topcelestecielo2.jpeg",
            "imagenes/topcelestecielo.jpeg",
            "imagenes/topcelestecielo3.jpeg"
        ],
        descripcion: "Top clínico elasticado, antifluido, confeccionado en Chile."
    },
    {
        id: 5,
        nombre: "Top Menta",
        precio: 19990,
        categorias: ["Mujer"],
        mostrar: false,
        imagenes: [
            "imagenes/topmenta6.jpeg",
            "imagenes/topmenta4.jpeg",
            "imagenes/topmenta5.jpeg"
        ],
        descripcion: "Top clínico elasticado, antifluido, confeccionado en Chile."
    },
    {
        id: 6,
        nombre: "Conjunto Negro",
        precio: 39990,
        categorias: ["Mujer"],
        mostrar: true,
        imagenes: [
            "imagenes/conjuntonegro2.jpeg",
            "imagenes/topnegro.jpeg",
            "imagenes/topnegro3.jpeg"
        ],
        descripcion: "Top clínico elasticado de alta calidad, sin tachas. Este mismo modelo está disponible en distintos colores para que elijas el que más te guste."
    },
    {
        id: 7,
        nombre: "Top Rosa",
        precio: 19990,
        categorias: ["Mujer"],
        mostrar: false,
        imagenes: [
            "imagenes/toprosa.jpeg",
            "imagenes/toprosa3.jpeg",
            "imagenes/toprosa4.jpeg"
        ],
        descripcion: "Top clínico elasticado, antifluido, confeccionado en Chile.."
    },
    {
        id: 8,
        nombre: "Top Verde Esperanza",
        precio: 19990,
        categorias: ["Mujer"],
        mostrar: false,
        imagenes: [
            "imagenes/topverdeesperanza3.jpeg",
            "imagenes/topverdeesperanza2.jpeg",
            "imagenes/topverdeesperanza.jpeg"
        ],
        descripcion: "Top clínico elasticado, antifluido, confeccionado en Chile."
    },
    {
        id: 9,
        nombre: "Top Esmeralda",
        precio: 19990,
        categorias: ["Mujer"],
        mostrar: false,
        imagenes: [
            "imagenes/topcalipso3.jpeg",
            "imagenes/topcalipso.jpeg",
            "imagenes/topcalipso4.jpeg"
        ],
        descripcion: "Top clínico elasticado, antifluido, confeccionado en Chile."
    }
    ,
    {
        id: 10,
        nombre: "Top Burdeo",
        precio: 19990,
        categorias: ["Mujer"],
        mostrar: false,
        imagenes: [
            "imagenes/topburdeo.jpeg",
            "imagenes/topburdeo3.jpeg",
            "imagenes/topburdeo5.jpeg"
        ],
        descripcion: "Top clínico elasticado, antifluido, confeccionado en Chile."
    },
    {
        id: 11,
        nombre: "Top Azul Rey",
        precio: 19990,
        categorias: ["Mujer"],
        mostrar: false,
        imagenes: [
            "imagenes/topazulrey1.jpeg",
            "imagenes/topazulrey.jpeg",
        ],
        descripcion: "Top clínico elasticado, antifluido, confeccionado en Chile."
    },
    //Tops diseños hombres
    {
        id: 19,
        nombre: "Top Antifluido Electrocardiograma",
        precio: 25990,
        categorias: ["Hombre", "Top C/N Diseños"],
        mostrar: false,
        imagenes: [
            "imagenes/hdise.jpeg",
            "imagenes/hdise2.jpeg",
        ],
        descripcion: "Top clínico elasticado, con diseños exclusivos, antifluido."
    },
    {
        id: 20,
        nombre: "Top Antifluido Palta",
        precio: 25990,
        categorias: ["Hombre", "Top C/N Diseños"],
        mostrar: false,
        imagenes: [
            "imagenes/topdiseh.jpeg",
            "imagenes/topdiseh2.jpeg",
            "imagenes/topdiseh3.jpeg",
            "imagenes/topdiseh4.jpeg",
        ],
        descripcion: "Top clínico elasticado, con diseños exclusivos, antifluido."
    },
    {
        id: 21,
        nombre: "Top Antifluido Militar",
        precio: 25990,
        categorias: ["Hombre", "Top C/N Diseños"],
        mostrar: false,
        imagenes: [
            "imagenes/topmi.jpeg",
            "imagenes/topmi1.jpeg",
        ],
        descripcion: "Top clínico elasticado, con diseños exclusivos, antifluido."
        
    
    }
,


    //top con diseños mujer

    {

        id: 12,
        nombre: "Top Cancer De Mama",
        precio: 25990,
        categorias: ["Mujer", "Top C/N Diseños"],
        mostrar: false,
        imagenes: [
            "imagenes/cancertop2.png",
            "imagenes/top-cancer-de-mama-2.jpeg",
        ],
        descripcion: "Top clínico elasticado, con diseños exclusivos, antifluido." 
    },
    {
        id: 13,
        nombre: "Top Gatito Lana Azul Marino",
        precio: 25990,
        categorias: ["Mujer", "Top C/N Diseños"],
        mostrar: false,
        imagenes: [ 
            "imagenes/gatitoluna2.png",
            "imagenes/gatitoluna.jpeg",
        ],
        descripcion: "Top clínico elasticado, con diseños exclusivos, antifluido." 
    },
    {
        id: 14,
        nombre: "Top Amor Propio Rosado",
        precio: 25990,
        categorias: ["Mujer", "Top C/N Diseños"],
        mostrar: false,
        imagenes: [
            "imagenes/topamorpropio.png",
            "imagenes/topamorpropio2.png",
        ],
        descripcion: "Top clínico elasticado, con diseños exclusivos, antifluido."
    },
    {
        id: 15,
        nombre: "Top Retro",
        precio: 25990,
        categorias: ["Mujer", "Top C/N Diseños"],
        mostrar: false,
        imagenes: [
            "imagenes/topretro.jpeg",
            "imagenes/retro1.jpeg",
        ],
        descripcion: "Top clínico elasticado, con diseños exclusivos, antifluido."
    },
    //Pantalones
    {
        id: 16,
        nombre: "Pantalon Negro mujer",
        precio: 19990,
        categorias: ["Mujer", "Pantalones"],
        mostrar: false,
        imagenes: [
            "imagenes/pantalonmujernegro.jpeg",
            "imagenes/pantallonmujernegro.jpeg",
            "imagenes/pantalonmujernegro1.jpeg",
            "imagenes/patalonmujernegro.jpeg",
        
        ],
        descripcion: "Pantalón antifluido para mujer, cómodos y de mucha durabilidad."
    },
    {
        id: 17,
        nombre: "Jogger Mujer Azul rey",
        precio: 22990,
        categorias: ["Mujer", "Pantalones"],
        mostrar: true,
        imagenes: [
            "imagenes/jogerazulrey1.jpeg",
            "imagenes/jogerazulrey2.jpeg",
            "imagenes/jogerazulrey3.jpeg",
            "imagenes/jogerazulrey4.jpeg",
            "imagenes/jogerazulrey5.jpeg",
            "imagenes/jogerazulrey6.jpeg",
        ],
        descripcion:  "Pantalón jogger antifluido diseñado para profesionales que buscan comodidad, protección y un aspecto profesional. Confeccionado con tela de alta calidad que repele líquidos y evita la absorción de fluidos, ideal para largas jornadas laborales. Su diseño moderno permite libertad de movimiento, fácil limpieza y alta durabilidad."
    },
    {
        id: 18,
        nombre: "Pantalon Mujer Azul Rey",
        precio: 19990,
        categorias: ["Mujer", "Pantalones"],
        mostrar: true,
        imagenes: [
            "imagenes/paAzuRe.jpeg",
            "imagenes/paAzuRe2.jpeg",
            "imagenes/paAzuRe3.jpeg",
            "imagenes/paAzuRe4.jpeg",

        
        ],
        descripcion: "Pantalón antifluido para mujer, cómodos y de mucha durabilidad." 


    }
        

];

// Cargar productos desde Neon
async function cargarProductosDesdeDB() {
    try {
        const res = await fetch('/api/productos');
        const data = await res.json();
        
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
        productos = productosBase;
        renderizarProductos();
    }
}

// Obtener ID desde URL
const params = new URLSearchParams(window.location.search);
const idProducto = parseInt(params.get("id"));

async function cargarDetalleProducto() {
    if (!idProducto) return;
    
    // Si no hay productos cargados, intentamos cargarlos
    if (productos.length === 0) {
        await cargarProductosDesdeDB();
    }

    const producto = productos.find(p => p.id === idProducto);
    if (producto) {
        document.getElementById("detalle-producto").innerHTML = `
<div class="detalle-page">
    <div class="detalle-card">

    <!-- Botón volver moderno -->
<button class="btn-back" onclick="window.history.back()" aria-label="Volver">
    <span class="icon">↩</span>
</button>



        <div class="galeria">
            <img src="${producto.imagenes[0]}" 
                 class="img-principal" 
                 id="imgPrincipal">

            <div class="miniaturas">
                ${producto.imagenes.map(img => `
                    <img src="${img}" onclick="cambiarImagen('${img}')">
                `).join('')}
            </div>
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


            <p class="detalle-desc">
                ${producto.descripcion}
            </p>

            <div class="detalle-selectores">
                <select id="detalle-talla">
                    <option value="XXS">XXS</option>
                    <option value="XS">XS</option>
                    <option value="S">S</option>
                    <option value="M" selected>M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="XXL">XXL</option>
                </select>

               ${producto.mostrar !== false ? `
    <select id="detalle-color" required>
        <option value="" disabled selected>Selecciona un color</option>
        <option value="Azul">Azul</option>
        <option value="Azul Rey">Azul Rey</option>
        <option value="Negro">Negro</option>
        <option value="Azul Marino">Azul Marino</option>
        
    </select>
` : ''}

            </div>

            <button class="btn-add"
                onclick="agregarDesdeDetalle(${producto.id})">
                Añadir al Carrito
            </button>

            <p class="envio-info">
                🚚 Despacho en <strong>3 días hábiles</strong>
            </p>
        </div>

    </div>
</div>
`;
    }
}



function irADetalle(id) {
    window.location.href = `detalle.html?id=${id}`;
}
function cambiarImagen(src) {
    document.getElementById("imgPrincipal").src = src;
}


// 2. LÓGICA DEL CARRITO
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Renderizar productos en el index
function renderizarProductos(filtro = 'todos') {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    grid.innerHTML = '';

   const productosFiltrados = filtro === 'todos'
    ? productos
    : productos.filter(p =>
        Array.isArray(p.categorias) &&
        p.categorias.includes(filtro)
      );


    productosFiltrados.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';

        card.addEventListener('click', () => {
            irADetalle(p.id);
        });

        const img1 = p.imagenes?.[0] || 'https://via.placeholder.com/300x300?text=Sin+Foto';
        const img2 = p.imagenes?.[1] || img1;

        // Verificar stock
        const sinStock = p.stock !== undefined && p.stock <= 0;
        const btnTexto = sinStock ? "Agotado" : "Añadir al Carrito";
        const btnDisabled = sinStock ? "disabled style='background:#ccc; cursor:not-allowed'" : "";

        card.innerHTML = `
            <img 
                src="${img1}"
                alt="${p.nombre}" 
                class="product-img"
                onmouseenter="this.src='${img2}'"
                onmouseleave="this.src='${img1}'"
            >

            <div class="card-body">
                <h3>${p.nombre}</h3>
                <p class="price">$${p.precio.toLocaleString('es-CL')}</p>

                <div class="selectors" onclick="event.stopPropagation()">
                    <select id="talla-${p.id}">
                        <option value="XXS">XXS</option>
                        <option value="XS">XS</option>
                        <option value="S">S</option>
                        <option value="M" selected>M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                        <option value="XXL">XXL</option>
                    </select>

  ${p.mostrar !== false ? `
    <select id="color-${p.id}" required>
        <option value="" disabled selected>Selecciona un color</option>
        <option value="Azul">Azul</option>
        <option value="Azul Rey">Azul Rey</option>
        <option value="Negro">Negro</option>
        <option value="Azul Marino">Azul Marino</option>
        
    </select>
` : ''}

                </div>

                <button class="btn-add" ${btnDisabled}
                    onclick="event.stopPropagation(); agregar(${p.id})">
                    ${btnTexto}
                    
                </button>

                <p class="envio-info">
                    🚚 Despacho en <strong>3 días hábiles</strong>
                </p>
            </div>
        `;

        grid.appendChild(card);
    });
}

// Filtrar productos
function filtrarProductos(categoria) {
    // Actualizar botones visualmente
    document.querySelectorAll('.btn-filter').forEach(btn => {
        btn.classList.remove('active');
        if(btn.innerText === categoria || (categoria === 'todos' && btn.innerText === 'Todos')) {
            btn.classList.add('active');
        }
    });
    renderizarProductos(categoria);
}

// Agregar al carrito
// 1. Agregar desde el Catálogo Principal (Index)
function agregar(id) {
    const prod = productos.find(p => p.id === id);
    const talla = document.getElementById(`talla-${id}`).value;

    // Validar Stock y Disponibilidad
    if ((prod.stock !== undefined && prod.stock <= 0) || prod.mostrar === false) {
        mostrarNotificacion("❌ Producto agotado o no disponible");
        return;
    }
    
    // Buscamos el color específicamente para este ID de producto si existe
    const colorSelect = document.getElementById(`color-${id}`); 
    const color = colorSelect ? colorSelect.value : 'Único';

    const item = {
        ...prod,
        talla,
        color,
        imagen: prod.imagenes[0],
        uid: `${id}-${talla}-${color}`
    };

    const existe = carrito.find(i => i.uid === item.uid);
    if (existe) {
        existe.cantidad++;
    } else {
        item.cantidad = 1;
        carrito.push(item);
    }

    guardarCarrito();
    // Usamos la notificación moderna
    mostrarNotificacion(`✅ ${prod.nombre} añadido`);
}

// 2. Agregar desde la Vista de Detalles
function agregarDesdeDetalle(id) {
    // Aseguramos que el carrito esté actualizado antes de operar
    carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    const producto = productos.find(p => p.id === id);
    if (!producto) return;

    // Validar Stock y Disponibilidad
    if ((producto.stock !== undefined && producto.stock <= 0) || producto.mostrar === false) {
        mostrarNotificacion("❌ Producto agotado o no disponible");
        return;
    }

    const talla = document.getElementById('detalle-talla')?.value || 'Única';
    const colorSelect = document.getElementById('detalle-color');
    
    // Validación de color: Si el selector existe pero no han elegido nada
    if (colorSelect && colorSelect.value === "") {
        mostrarNotificacion("⚠️ Por favor selecciona un color");
        return;
    }

    const color = colorSelect ? colorSelect.value : '';

    const item = {
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        imagen: producto.imagenes[0],
        talla: talla,
        color: color,
        mostrar: producto.mostrar,
        cantidad: 1,
        uid: `${producto.id}-${talla}-${color}`
    };

    const existe = carrito.find(p => p.uid === item.uid);

    if (existe) {
        existe.cantidad += 1;
    } else {
        carrito.push(item);
    }

    guardarCarrito(); // Esta función ya hace el setItem y actualiza contador
    mostrarNotificacion(`🛍️ ${producto.nombre} en el carrito`);
}
function mostrarNotificacion(mensaje) {
    // 1. Crear el contenedor si no existe
    let container = document.querySelector('.flash-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'flash-container';
        document.body.appendChild(container);
    }

    // 2. Crear el mensaje
    const msg = document.createElement('div');
    msg.className = 'flash-msg';
    msg.innerHTML = mensaje || `<span>✓</span> Agregado correctamente`;

    container.appendChild(msg);

    // 3. Eliminar del código después de 1.8 segundos
    setTimeout(() => {
        msg.remove();
    }, 1800);
}


// Guardar en memoria del navegador
function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContador();
}

function actualizarContador() {
    const count = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    const badge = document.getElementById('cart-count');
    if (badge) badge.innerText = count;
}

// Renderizar página del carrito
function renderizarPaginaCarrito() {
    const container = document.getElementById('cart-items');
    if (!container) return;

    if (carrito.length === 0) {
        container.innerHTML = "<p>Tu carrito está vacío.</p>";
        actualizarTotales();
        return;
    }

    container.innerHTML = '';
    carrito.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'cart-item';
        
        // Aseguramos que haya imagen (compatibilidad con items antiguos o nuevos)
        const img = item.imagen || (item.imagenes && item.imagenes[0]) || 'https://via.placeholder.com/60';

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
    actualizarTotales();
}

function eliminar(index) {
    carrito.splice(index, 1);
    guardarCarrito();
    renderizarPaginaCarrito();
}

function actualizarTotales() {
    const subtotal = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    const envio = 4000;
    const total = subtotal > 0 ? subtotal + envio : 0;

    const subElem = document.getElementById('subtotal-price');
    const totElem = document.getElementById('total-price');

    if(subElem) subElem.innerText = `$${subtotal.toLocaleString('es-CL')}`;
    if(totElem) totElem.innerText = `$${total.toLocaleString('es-CL')}`;
}

// Enviar a WhatsApp
function enviarPedido() {
    if (carrito.length === 0) return alert("El carrito está vacío");

    const telefono = "56929395568"; // Número actualizado
    const pagoInput = document.querySelector('input[name="payment"]:checked');
    const pago = pagoInput ? pagoInput.value : 'Webpay'; // Por defecto Webpay
    
    // Si elige Webpay, iniciamos el flujo de Transbank y detenemos el WhatsApp
    if (pago === "Webpay") {
        pagarConWebpay();
        return;
    }

    // Intentamos obtener la URL base para las imágenes
    // Nota: Si estás en local, esto generará una ruta local. Al subirlo a internet funcionará perfecto.
    const baseUrl = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '/');

    let mensaje = "Hola Uniformes Clínicos! 👋 Quiero realizar el siguiente pedido:\n\n";
    let subtotal = 0;

    carrito.forEach((item, index) => {
        const totalItem = item.precio * item.cantidad;
        subtotal += totalItem;
        
        // Construir link de imagen
        const img = item.imagen || (item.imagenes && item.imagenes[0]) || '';
        const imgUrl = img.startsWith('http') ? img : baseUrl + img;

        mensaje += `*${index + 1}. ${item.nombre}*\n`;
        if (item.mostrar !== false) {
            mensaje += `   📝 Talla: ${item.talla} | Color: ${item.color}\n`;
        } else {
            mensaje += `   📝 Talla: ${item.talla}\n`;
        }
        mensaje += `   📦 Cantidad: ${item.cantidad}\n`;
        mensaje += `   💲 Precio Unit: $${item.precio.toLocaleString('es-CL')}\n`;
        mensaje += `   💰 Subtotal: $${totalItem.toLocaleString('es-CL')}\n`;
        mensaje += `   🖼️ Foto: ${imgUrl}\n\n`;
    });

    const envio = 4000;
    const total = subtotal + envio;

    mensaje += `--------------------------\n`;
    mensaje += `🧾 *DETALLE BOLETA*\n`;
    mensaje += `💰 Subtotal: $${subtotal.toLocaleString('es-CL')}\n`;
    mensaje += `🚚 Envío: $${envio.toLocaleString('es-CL')}\n`;
    mensaje += `⭐ *TOTAL A PAGAR: $${total.toLocaleString('es-CL')}*\n`;
    mensaje += `--------------------------\n`;
    mensaje += `💳 Método de pago: ${pago}`;

    const mensajeEncoded = encodeURIComponent(mensaje);
    window.open(`https://wa.me/${telefono}?text=${mensajeEncoded}`, '_blank');
}

/* ===============================
   INTEGRACIÓN TRANSBANK (WEBPAY)
================================ */
async function pagarConWebpay() {
    // 1. Calcular total real del carrito
    const subtotal = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    const envio = 4000;
    const total = subtotal + envio;
    
    // 2. Generar ID de orden único (Ej: ORDER-123456789)
    const orden = "ORDER-" + Date.now();

    mostrarNotificacion("🔄 Conectando con Webpay...");

    try {
        // ⚠️ IMPORTANTE: Reemplaza esta URL por la de tu proyecto en Vercel cuando lo subas
        const urlApi = "/api/crear-transaccion";
        
        const res = await fetch(urlApi, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ monto: total, orden: orden })
        });

        const data = await res.json();

        // Crear formulario oculto para redirigir a Webpay
        const form = document.createElement("form");
        form.method = "POST";
        form.action = data.url;

        const input = document.createElement("input");
        input.type = "hidden";
        input.name = "token_ws";
        input.value = data.token;

        form.appendChild(input);
        document.body.appendChild(form);
        form.submit(); // Redirige a Transbank

    } catch (error) {
        console.error("Error al iniciar pago:", error);
        mostrarNotificacion("❌ Error de conexión con Webpay");
    }
}

/* ===============================
   SISTEMA DE MODALES PREMIUM
================================ */

const abrirModal = (id) => {
    const modal = document.getElementById(id);
    if (!modal) return;

    modal.classList.add("active");
    document.body.classList.add("no-scroll");

    // Micro-optimización ventas: foco visual
    setTimeout(() => modal.classList.add("visible"), 10);
};

const cerrarModal = (id) => {
    const modal = document.getElementById(id);
    if (!modal) return;

    modal.classList.remove("visible");

    setTimeout(() => {
        modal.classList.remove("active");
        document.body.classList.remove("no-scroll");
    }, 300); // coincide con animación
};

/* ===============================
   GUÍA DE TALLAS
================================ */
function abrirGuiaTallas() {
    abrirModal("modal-tallas");
}

function cerrarGuiaTallas() {
    cerrarModal("modal-tallas");
}

/* ===============================
   PROMOCIONES (ALTA CONVERSIÓN)
================================ */
function abrirPromo() {
    abrirModal("modal-promo");

    // Hook para marketing / analytics
    console.log("🔥 Promo vista por el usuario");
}

function cerrarPromo() {
    cerrarModal("modal-promo");
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    actualizarContador();
    renderizarProductos();
    cargarProductosDesdeDB(); // Cargar DB al iniciar
    cargarDetalleProducto(); // Cargar detalle si estamos en esa página
    renderizarPaginaCarrito();

    // Mostrar promo al cargar (1 segundo de retraso)
    setTimeout(abrirPromo, 1000);

    // Cambiar texto del botón según método de pago
    const radioPagos = document.querySelectorAll('input[name="payment"]');
    const btnCheckout = document.querySelector('.btn-checkout');

    if (radioPagos.length > 0 && btnCheckout) {
        radioPagos.forEach(radio => {
            radio.addEventListener('change', () => {
                if (radio.value === 'Webpay') {
                    btnCheckout.innerHTML = 'Pagar con Webpay 💳';
                    btnCheckout.style.background = '#1a1a1a'; // Color oscuro elegante
                } else {
                    btnCheckout.innerHTML = 'Enviar pedido por WhatsApp 📲';
                    btnCheckout.style.background = '#25D366'; // Verde WhatsApp
                }
            });
        });
        // Ejecutar una vez al inicio para asegurar el estado correcto
        const checked = document.querySelector('input[name="payment"]:checked');
        if(checked) checked.dispatchEvent(new Event('change'));
    }
});

// Lógica del Carrusel Hero
document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('heroTrack');
    const bubblesContainer = document.getElementById('heroBubbles');
    if (!track || !bubblesContainer) return;

    const slides = track.querySelectorAll('.hero-slide');
    
    // Crear burbujas
    slides.forEach((_, index) => {
        const bubble = document.createElement('div');
        bubble.className = `bubble ${index === 0 ? 'active' : ''}`;
        bubble.onclick = () => {
            track.scrollTo({
                left: track.clientWidth * index,
                behavior: 'smooth'
            });
        };
        bubblesContainer.appendChild(bubble);
    });

    // Actualizar burbujas al hacer scroll
    track.addEventListener('scroll', () => {
        const index = Math.round(track.scrollLeft / track.clientWidth);
        const bubbles = bubblesContainer.querySelectorAll('.bubble');
        bubbles.forEach(b => b.classList.remove('active'));
        if(bubbles[index]) bubbles[index].classList.add('active');
    });
});

function moverCarrusel(direction) {
    const track = document.getElementById('heroTrack');
    if (!track) return;
    const scrollAmount = track.clientWidth * direction;
    track.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
    });
}

/* ===============================
   SISTEMA DE ADMINISTRACIÓN (LOGIN)
================================ */

function iniciarSesion(e) {
    e.preventDefault();
    const user = document.getElementById('adminUser').value;
    const pass = document.getElementById('adminPass').value;
    const errorMsg = document.getElementById('loginError');

    // ⚠️ CAMBIA AQUÍ TU USUARIO Y CONTRASEÑA
    if (user === 'admin' && pass === 'uniformes2024') {
        // Guardar sesión en el navegador
        sessionStorage.setItem('adminAuth', 'true');
        window.location.href = 'admin.html';
    } else {
        errorMsg.style.display = 'block';
    }
}

function verificarAutenticacion() {
    // Si no está logueado, lo manda al login
    if (sessionStorage.getItem('adminAuth') !== 'true') {
        window.location.href = 'login.html';
    }
}

function cerrarSesion() {
    sessionStorage.removeItem('adminAuth');
    window.location.href = 'login.html';
}

async function cargarInventarioAdmin() {
    const tbody = document.getElementById('inventory-body');
    if (!tbody) return;

    tbody.innerHTML = '';
    
    // Asegurar que tenemos datos frescos
    await cargarProductosDesdeDB();
    tbody.innerHTML = '';

    productos.forEach(p => {
        const img = p.imagenes && p.imagenes[0] ? p.imagenes[0] : '';
        const stock = p.stock !== undefined ? p.stock : 0;

        const row = `
            <tr>
                <td>#${p.id}</td>
                <td><img src="${img}" width="50" style="border-radius:5px;"></td>
                <td><strong>${p.nombre}</strong></td>
                <td>$${p.precio.toLocaleString('es-CL')}</td>
                <td>${p.categorias.join(', ')}</td>
                <td>
                    <input type="number" value="${stock}" min="0" 
                        onchange="cambiarStock(${p.id}, this.value)" 
                        style="width: 80px; padding: 5px; border: 1px solid #ddd; border-radius: 5px; text-align: center;">
                </td>
                <td>
                    <select onchange="cambiarVisibilidad(${p.id}, this.value === 'true')" 
                        style="padding: 5px; border-radius: 5px; border: 1px solid #ddd; background: ${p.mostrar ? '#d1fae5' : '#fee2e2'}; color: ${p.mostrar ? '#065f46' : '#991b1b'}; font-weight: bold;">
                        <option value="true" ${p.mostrar ? 'selected' : ''}>Disponible</option>
                        <option value="false" ${!p.mostrar ? 'selected' : ''}>Agotado</option>
                    </select>
                </td>
                <td>
                    <a href="detalle.html?id=${p.id}" target="_blank" title="Ver en tienda" style="text-decoration:none; font-size: 1.2rem;">🔗</a>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// --- FUNCIONES ADMIN AVANZADAS ---

// 1. Migrar productos locales a Neon (Solo usar una vez)
async function migrarProductosAFirebase() {
    if(!confirm("¿Estás seguro de subir todos los productos base a Neon? Esto puede duplicar si ya existen.")) return;
    
    let contador = 0;
    for (const p of productosBase) {
        // Añadimos campo stock por defecto
        const nuevoProd = { ...p, stock: 100 };
        
        await fetch('/api/productos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoProd)
        });
        contador++;
    }

    alert(`✅ Migración completada. ${contador} productos subidos.`);
    location.reload();
}

// 2. Cambiar visibilidad (Ocultar/Mostrar)
async function cambiarVisibilidad(id, nuevoEstado) {
    try {
        await fetch('/api/productos', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id, mostrar: nuevoEstado })
        });
        cargarInventarioAdmin(); // Recargar tabla
    } catch (error) {
        console.error(error);
        alert("Error al cambiar visibilidad");
    }
}

// 3. Cargar Ventas
async function cargarVentasAdmin() {
    const container = document.getElementById('ventas-body');
    if(!container) return;
    
    container.innerHTML = 'Cargando ventas...';
    
    const res = await fetch('/api/ventas');
    const ventas = await res.json();
    
    container.innerHTML = '';
    ventas.forEach(venta => {
        const fecha = venta.fecha ? new Date(venta.fecha).toLocaleDateString() : '-';
        // items viene como JSONB desde Postgres, fetch lo convierte a objeto automáticamente
        const items = venta.items || [];
        
        const row = `
            <tr>
                <td>${fecha}</td>
                <td>${venta.orden}</td>
                <td>Cliente Web</td>
                <td>$${(venta.total || 0).toLocaleString('es-CL')}</td>
                <td>
                    <ul style="font-size:0.8rem; padding-left:15px; margin:0;">
                        ${items.map(i => `<li>${i.nombre} (x${i.cantidad})</li>`).join('')}
                    </ul>
                </td>
            </tr>
        `;
        container.innerHTML += row;
    });
}

// 4. Registrar Venta (Se llama desde pago-exitoso)
async function registrarVentaExitosa() {
    const carritoGuardado = JSON.parse(localStorage.getItem('carrito'));
    if (!carritoGuardado || carritoGuardado.length === 0) return;

    try {
        const total = carritoGuardado.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
        const orden = "ORD-" + Date.now();

        await fetch('/api/ventas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                orden,
                total,
                items: carritoGuardado,
                estado: "Pagado"
            })
        });

        // 3. Limpiar carrito
        localStorage.removeItem('carrito');
        console.log("✅ Venta registrada y stock actualizado");

    } catch (error) {
        console.error("Error registrando venta:", error);
    }
}

// 5. Cambiar Stock (Nuevo)
async function cambiarStock(id, nuevoStock) {
    const stockNum = parseInt(nuevoStock);
    if (isNaN(stockNum) || stockNum < 0) {
        alert("Por favor ingresa un número válido.");
        return;
    }

    try {
        await fetch('/api/productos', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id, stock: stockNum })
        });
        cargarInventarioAdmin(); // Recargar tabla para ver cambios
    } catch (error) {
        console.error(error);
        alert("Error al actualizar stock");
    }
}

// EXPORTAR FUNCIONES AL ÁMBITO GLOBAL
window.agregar = agregar;
window.agregarDesdeDetalle = agregarDesdeDetalle;
window.eliminar = eliminar;
window.enviarPedido = enviarPedido;
window.filtrarProductos = filtrarProductos;
window.abrirGuiaTallas = abrirGuiaTallas;
window.cerrarGuiaTallas = cerrarGuiaTallas;
window.abrirPromo = abrirPromo;
window.cerrarPromo = cerrarPromo;
window.moverCarrusel = moverCarrusel;
window.iniciarSesion = iniciarSesion;
window.cerrarSesion = cerrarSesion;
window.verificarAutenticacion = verificarAutenticacion;
window.cargarInventarioAdmin = cargarInventarioAdmin;
window.cambiarImagen = cambiarImagen;
window.irADetalle = irADetalle;
window.migrarProductosAFirebase = migrarProductosAFirebase;
window.cambiarVisibilidad = cambiarVisibilidad;
window.cargarVentasAdmin = cargarVentasAdmin;
window.registrarVentaExitosa = registrarVentaExitosa;
window.cambiarStock = cambiarStock;
