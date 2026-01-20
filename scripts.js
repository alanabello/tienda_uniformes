let productos = []; // Ahora la lista es dinámica
let conexionDB = false; // Variable para diagnosticar conexión
let ultimoErrorDB = ""; // Variable para guardar el mensaje de error

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
    // 1. Verificar si estamos en local (file://)
    if (window.location.protocol === 'file:') {
        console.warn("⚠️ Ejecutando en local. La base de datos requiere Vercel.");
        productos = productosBase;
        renderizarProductos();
        return;
    }

    try {
        const res = await fetch('/api/productos');

        // Manejo especial para cuando no existe la API (Localhost / Móvil sin backend)
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
        conexionDB = true; // ¡Conexión exitosa!
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
        conexionDB = false; // Falló la conexión
        ultimoErrorDB = error.message;
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
        // Verificar stock y disponibilidad para el botón
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

        // Asegurar imágenes para evitar errores
        const imgs = (producto.imagenes && producto.imagenes.length > 0) ? producto.imagenes : ['https://via.placeholder.com/400x400?text=Sin+Imagen'];

        // Definir variables para el template (tallas y colores)
        const tallas = producto.tallas || ["XXS", "XS", "S", "M", "L", "XL", "XXL"];
        const mostrarColores = producto.mostrar_colores !== undefined ? producto.mostrar_colores : true;

        document.getElementById("detalle-producto").innerHTML = `
<div class="detalle-page">
    <div class="detalle-card">

    <!-- Botón volver moderno -->
<button class="btn-back" onclick="window.history.back()" aria-label="Volver">
    <span class="icon">↩</span>
</button>



        <div class="galeria">
            <img src="${imgs[0]}" 
                 class="img-principal" 
                 id="imgPrincipal">

            <div class="miniaturas">
                ${imgs.map(img => `
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
                    ${tallas.map(t => `<option value="${t}">${t}</option>`).join('')}
                </select>

               ${(producto.mostrar !== false && mostrarColores) ? `
    <select id="detalle-color" required>
        <option value="" disabled selected>Selecciona un color</option>
        <option value="Azul">Azul</option>
        <option value="Azul Rey">Azul Rey</option>
        <option value="Negro">Negro</option>
        <option value="Azul Marino">Azul Marino</option>
        
    </select>
` : ''}

            </div>

            <button class="btn-add" ${btnAttr}>
                ${btnTexto}
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

        // Verificar stock y disponibilidad
        const sinStock = p.stock !== undefined && p.stock <= 0;
        const noDisponible = p.mostrar === false;
        
        // Nuevas propiedades
        const tallas = p.tallas || ["XXS", "XS", "S", "M", "L", "XL", "XXL"];
        const mostrarColores = p.mostrar_colores !== undefined ? p.mostrar_colores : true;

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
                        ${tallas.map(t => `<option value="${t}">${t}</option>`).join('')}
                    </select>

  ${(p.mostrar !== false && mostrarColores) ? `
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

    const color = colorSelect ? colorSelect.value : 'Único';

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

function calcularEnvio(carrito) {
    if (!carrito || carrito.length === 0) return 4000;
    
    // Verificamos si hay al menos un pantalón
    const tienePantalon = carrito.some(item => item.categorias && item.categorias.includes('Pantalones'));
    // Verificamos si hay al menos una pechera/top (cualquier cosa que no sea pantalón)
    const tieneTop = carrito.some(item => item.categorias && !item.categorias.includes('Pantalones'));

    // Si tiene ambos, el envío es gratis
    if (tienePantalon && tieneTop) {
        return 0;
    }
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
            shipElem.style.color = "#25D366"; // Verde WhatsApp
            shipElem.style.fontWeight = "bold";
        } else {
            shipElem.innerText = `$${envio.toLocaleString('es-CL')}`;
            shipElem.style.color = "";
            shipElem.style.fontWeight = "";
        }
    }

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

    const envio = calcularEnvio(carrito);
    const total = subtotal + envio;

    mensaje += `--------------------------\n`;
    mensaje += `🧾 *DETALLE BOLETA*\n`;
    mensaje += `💰 Subtotal: $${subtotal.toLocaleString('es-CL')}\n`;
    mensaje += `🚚 Envío: ${envio === 0 ? 'Gratis' : '$' + envio.toLocaleString('es-CL')}\n`;
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
    const envio = calcularEnvio(carrito);
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

async function iniciarSesion(e) {
    e.preventDefault();
    const user = document.getElementById('adminUser').value;
    const pass = document.getElementById('adminPass').value;
    const errorMsg = document.getElementById('loginError');
    errorMsg.style.display = 'none'; // Ocultar error previo

    try {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user, pass })
        });

        const data = await res.json();

        if (res.ok && data.success) {
            // Si el backend dice que es correcto, guardamos la sesión y redirigimos
            sessionStorage.setItem('adminAuth', 'true');
            window.location.href = 'admin.html';
        } else {
            // Si el backend dice que hay un error, lo mostramos
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
    // Si no está logueado, lo manda al login
    if (sessionStorage.getItem('adminAuth') !== 'true') {
        window.location.href = 'login.html';
    }
}

function cerrarSesion() {
    sessionStorage.removeItem('adminAuth');
    window.location.href = 'login.html';
}

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
    
    // Actualizar iconos visuales
    const headers = document.querySelectorAll('.inventory-table th[onclick]');
    headers.forEach(th => {
        const col = th.getAttribute('onclick').match(/'(.*?)'/)[1];
        const titles = { 'id': 'ID', 'nombre': 'Nombre', 'precio': 'Precio', 'categorias': 'Categoría', 'stock': 'Stock', 'mostrar': 'Estado' };
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
    
    // Asegurar que tenemos datos frescos
    await cargarProductosDesdeDB();

    // Verificar estado de conexión visualmente
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
            // Si es modo local (404), lo mostramos como advertencia
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
                    <button onclick="eliminarProducto(${p.id})" title="Eliminar" style="cursor:pointer; border:none; background:none; font-size:1.2rem; margin-left: 8px;">🗑️</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// --- FUNCIONES ADMIN AVANZADAS ---

// 1. Migrar productos locales a Neon (Solo usar una vez)
async function migrarProductosANeon() {
    if(!confirm("¿Estás seguro de subir los productos base a Neon? Se omitirán los que ya existan.")) return;
    
    // 1. Obtener productos actuales de la DB para evitar duplicados
    let productosEnDB = [];
    try {
        const res = await fetch('/api/productos');
        if (res.ok) {
            productosEnDB = await res.json();
        }
    } catch (e) {
        console.error("Error verificando duplicados:", e);
    }

    let contador = 0;
    let errores = 0;
    let omitidos = 0;
    let ultimoError = "";

    // Feedback visual en el botón
    const btn = document.querySelector('button[onclick="migrarProductosANeon()"]');
    if(btn) { btn.innerText = "⏳ Subiendo..."; btn.disabled = true; }
    if(btn) { btn.innerText = "⏳ Verificando..."; btn.disabled = true; }

    for (const p of productosBase) {
        // Verificar si ya existe por nombre
        const existe = productosEnDB.find(dbProd => dbProd.nombre === p.nombre);
        if (existe) {
            omitidos++;
            continue;
        }

        // Añadimos campo stock por defecto
        const nuevoProd = { ...p, stock: 100 };
        
        try {
            const res = await fetch('/api/productos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevoProd)
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || `Error ${res.status}`);
            }
            contador++;
        } catch (e) {
            console.error("Error subiendo:", e);
            errores++;
            ultimoError = e.message;
        }
    }

    if (errores > 0) {
        alert(`⚠️ Proceso con errores.\n✅ Subidos: ${contador}\n⏭️ Omitidos (Ya existen): ${omitidos}\n❌ Fallidos: ${errores}\n\nÚltimo error: ${ultimoError}`);
    } else {
        alert(`✅ Proceso finalizado.\n✨ Nuevos subidos: ${contador}\n⏭️ Omitidos (Ya existen): ${omitidos}`);
        location.reload();
    }
    
    if(btn) { btn.innerText = "⚠️ Migrar Datos Iniciales"; btn.disabled = false; }
}

// 2. Cambiar visibilidad (Ocultar/Mostrar)
async function cambiarVisibilidad(id, nuevoEstado) {
    try {
        await fetch('/api/productos', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id, mostrar: nuevoEstado })
        });
        
        // Actualizar el producto en el array local
        const productoIndex = productos.findIndex(p => p.id === id);
        if (productoIndex !== -1) {
            productos[productoIndex].mostrar = nuevoEstado;
        }

        // Actualizar el estilo del select en la fila específica
        const rowElement = document.querySelector(`tr[data-product-id="${id}"]`);
        const selectElement = rowElement ? rowElement.querySelector('select[onchange^="cambiarVisibilidad"]') : null;
        if (selectElement) {
            selectElement.style.background = nuevoEstado ? '#d1fae5' : '#fee2e2';
            selectElement.style.color = nuevoEstado ? '#065f46' : '#991b1b';
        }
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

        // Actualizar el producto en el array local
        const productoIndex = productos.findIndex(p => p.id === id);
        if (productoIndex !== -1) {
            productos[productoIndex].stock = stockNum;
        }
        // El input ya actualizó su valor con this.value, no se necesita manipulación adicional del DOM.
        // Solo se actualiza el estado interno para consistencia.
    } catch (error) {
        console.error(error);
        alert("Error al actualizar stock");
    }
}

// Helper para procesar imágenes (Redimensionar y convertir a Base64)
const processImage = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 800; // Reducir ancho para optimizar base de datos
                const scaleSize = MAX_WIDTH / img.width;
                canvas.width = (img.width > MAX_WIDTH) ? MAX_WIDTH : img.width;
                canvas.height = (img.width > MAX_WIDTH) ? (img.height * scaleSize) : img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                resolve(canvas.toDataURL('image/jpeg', 0.7)); // Calidad 70%
            };
            img.onerror = reject;
        };
        reader.onerror = reject;
    });
};

// 6. Agregar Nuevo Producto (Admin)
async function guardarNuevoProducto(e) {
    e.preventDefault();
    
    const nombre = document.getElementById('newNombre').value;
    const precio = parseInt(document.getElementById('newPrecio').value);
    const stock = parseInt(document.getElementById('newStock').value);
    const categoria = document.getElementById('newCategoria').value;
    const descripcion = document.getElementById('newDescripcion').value;
    
    // Nuevos campos
    const checkboxes = document.querySelectorAll('.talla-option input:checked');
    const tallas = Array.from(checkboxes).map(cb => cb.value);
    
    const mostrarColores = document.getElementById('newMostrarColores').checked;

    // Procesar imágenes
    const fileInput = document.getElementById('newFotos');
    let imagenesProcesadas = [];

    const btn = e.target.querySelector('button[type="submit"]');
    const textoOriginal = btn.innerText;
    btn.innerText = "Procesando fotos...";
    btn.disabled = true;

    try {
        if (fileInput.files.length > 0) {
            // Convertir todas las fotos seleccionadas
            const promises = Array.from(fileInput.files).map(file => processImage(file));
            imagenesProcesadas = await Promise.all(promises);
        } else {
            alert("Por favor selecciona al menos una foto.");
            btn.innerText = textoOriginal;
            btn.disabled = false;
            return;
        }
    } catch (err) {
        console.error(err);
        alert("Error al procesar las imágenes.");
        btn.innerText = textoOriginal;
        btn.disabled = false;
        return;
    }

    const nuevoProd = {
        nombre,
        precio,
        stock,
        categorias: [categoria],
        imagenes: imagenesProcesadas,
        descripcion,
        mostrar: true,
        tallas: tallas.length > 0 ? tallas : ["S", "M", "L"],
        mostrarColores: mostrarColores
    };

    btn.innerText = "Guardando...";

    try {
        const res = await fetch('/api/productos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoProd)
        });

        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data.error || "Error al guardar");
        }

        alert("✅ Producto agregado correctamente");
        cerrarModalAgregar();
        e.target.reset();
        cargarInventarioAdmin(); // Recargar tabla
    } catch (error) {
        console.error(error);
        alert("❌ Error: " + error.message);
    } finally {
        btn.innerText = textoOriginal;
        btn.disabled = false;
    }
}

function abrirModalAgregar() {
    const modal = document.getElementById('modal-agregar');
    if(modal) {
        modal.classList.add('active');
        setTimeout(() => modal.classList.add('visible'), 10);
    }
}

function cerrarModalAgregar() {
    const modal = document.getElementById('modal-agregar');
    if(modal) {
        modal.classList.remove('visible');
        setTimeout(() => modal.classList.remove('active'), 300);
    }
}

// 7. Eliminar Producto (Admin)
async function eliminarProducto(id) {
    if(!confirm("¿Estás seguro de eliminar este producto permanentemente?")) return;

    try {
        const res = await fetch('/api/productos', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });

        if (!res.ok) throw new Error("Error al eliminar");
        
        cargarInventarioAdmin(); // Recargar tabla
    } catch (error) {
        console.error(error);
        alert("Error al eliminar producto");
    }
}

// 8. Guardar Cambios (Confirmación Manual)
async function guardarCambios() {
    const btn = document.querySelector('button[onclick="guardarCambios()"]');
    if(btn) {
        btn.innerText = "Verificando...";
        btn.disabled = true;
    }

    try {
        // Recargamos los datos desde la base de datos para asegurar que todo está guardado
        await cargarInventarioAdmin();
        alert("✅ Todos los cambios están guardados y sincronizados correctamente.");
    } catch (error) {
        console.error(error);
        alert("❌ Error al verificar cambios: " + error.message);
    } finally {
        if(btn) {
            btn.innerText = "💾 Guardar Cambios";
            btn.disabled = false;
        }
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
window.migrarProductosANeon = migrarProductosANeon;
window.cambiarVisibilidad = cambiarVisibilidad;
window.cargarVentasAdmin = cargarVentasAdmin;
window.registrarVentaExitosa = registrarVentaExitosa;
window.cambiarStock = cambiarStock;
window.guardarNuevoProducto = guardarNuevoProducto;
window.ordenarInventario = ordenarInventario;