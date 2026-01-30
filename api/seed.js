// c:\Users\alaab\Desktop\styleprouniformes\tienda_uniformes\api\seed.js

import { Pool } from '@neondatabase/serverless';

export default async function handler(req, res) {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });

    // Lista completa de productos para sincronizar con la Base de Datos
    const productos = [
        { id: 1, nombre: "Conjunto Azul Marino", precio: 39990, categorias: ["Mujer"], mostrar: false, imagenes: ["imagenes/conjuntoazulmarino.jpeg", "imagenes/conjuntoazulmarino2.jpeg", "imagenes/conjuntoazulmarino3.jpeg"], barcode: "7801234567890", descripcion: "Top clínico elasticado, antifluido, confeccionado en Chile." },
        { id: 2, nombre: "Top Lila", precio: 19990, categorias: ["Mujer"], mostrar: false, imagenes: ["imagenes/toplila4.jpeg", "imagenes/toplila2.jpeg", "imagenes/toplila.jpeg"], barcode: "7801234567891", descripcion: "Top clínico elasticado, antifluido, confeccionado en Chile." },
        { id: 3, nombre: "Top Azul Bondi", precio: 19990, categorias: ["Mujer"], mostrar: false, imagenes: ["imagenes/topceleste.jpeg", "imagenes/topceleste2.jpeg", "imagenes/topceleste3.jpeg"], barcode: "7801234567892", descripcion: "Top clínico elasticado, antifluido, confeccionado en Chile." },
        { id: 4, nombre: "Top Celeste Cielo", precio: 19990, categorias: ["Mujer"], mostrar: false, imagenes: ["imagenes/topcelestecielo2.jpeg", "imagenes/topcelestecielo.jpeg", "imagenes/topcelestecielo3.jpeg"], barcode: "7801234567893", descripcion: "Top clínico elasticado, antifluido, confeccionado en Chile." },
        { id: 5, nombre: "Top Menta", precio: 19990, categorias: ["Mujer"], mostrar: false, imagenes: ["imagenes/topmenta6.jpeg", "imagenes/topmenta4.jpeg", "imagenes/topmenta5.jpeg"], barcode: "7801234567894", descripcion: "Top clínico elasticado, antifluido, confeccionado en Chile." },
        { id: 6, nombre: "Conjunto Negro", precio: 39990, categorias: ["Mujer"], mostrar: true, imagenes: ["imagenes/conjuntonegro2.jpeg", "imagenes/topnegro.jpeg", "imagenes/topnegro3.jpeg"], barcode: "7801234567895", descripcion: "Top clínico elasticado de alta calidad, sin tachas." },
        { id: 7, nombre: "Top Rosa", precio: 19990, categorias: ["Mujer"], mostrar: false, imagenes: ["imagenes/toprosa.jpeg", "imagenes/toprosa3.jpeg", "imagenes/toprosa4.jpeg"], barcode: "7801234567896", descripcion: "Top clínico elasticado, antifluido, confeccionado en Chile." },
        { id: 8, nombre: "Top Verde Esperanza", precio: 19990, categorias: ["Mujer"], mostrar: false, imagenes: ["imagenes/topverdeesperanza3.jpeg", "imagenes/topverdeesperanza2.jpeg", "imagenes/topverdeesperanza.jpeg"], barcode: "7801234567897", descripcion: "Top clínico elasticado, antifluido, confeccionado en Chile." },
        { id: 9, nombre: "Top Esmeralda", precio: 19990, categorias: ["Mujer"], mostrar: false, imagenes: ["imagenes/topcalipso3.jpeg", "imagenes/topcalipso.jpeg", "imagenes/topcalipso4.jpeg"], barcode: "7801234567898", descripcion: "Top clínico elasticado, antifluido, confeccionado en Chile." },
        { id: 10, nombre: "Top Burdeo", precio: 19990, categorias: ["Mujer"], mostrar: false, imagenes: ["imagenes/topburdeo.jpeg", "imagenes/topburdeo3.jpeg", "imagenes/topburdeo5.jpeg"], barcode: "7801234567899", descripcion: "Top clínico elasticado, antifluido, confeccionado en Chile." },
        { id: 11, nombre: "Top Azul Rey", precio: 19990, categorias: ["Mujer"], mostrar: false, imagenes: ["imagenes/topazulrey1.jpeg", "imagenes/topazulrey.jpeg"], barcode: "7801234567900", descripcion: "Top clínico elasticado, antifluido, confeccionado en Chile." },
        { id: 12, nombre: "Pantalon Negro Hombre", precio: 19990, categorias: ["Hombre", "Pantalones"], mostrar: true, imagenes: ["imagenes/pantalonnegrohombre1.jpeg", "imagenes/pantalonnegrohombre2.jpeg"], barcode: "7801234567901", descripcion: "Pantalón antifluido para hombre, cómodos y de mucha durabilidad."},
        { id: 16, nombre: "Pantalon Negro mujer", precio: 19990, categorias: ["Mujer", "Pantalones"], mostrar: true, imagenes: ["imagenes/pantalonmujernegro.jpeg", "imagenes/pantallonmujernegro.jpeg", "imagenes/pantalonmujernegro1.jpeg", "imagenes/patalonmujernegro.jpeg"], barcode: "7801234567908", descripcion: "Pantalón antifluido para mujer, cómodos y de mucha durabilidad." },
        { id: 17, nombre: "Jogger Mujer Azul rey", precio: 22990, categorias: ["Mujer", "Pantalones"], mostrar: true, imagenes: ["imagenes/jogerazulrey1.jpeg", "imagenes/jogerazulrey2.jpeg", "imagenes/jogerazulrey3.jpeg", "imagenes/jogerazulrey4.jpeg", "imagenes/jogerazulrey5.jpeg", "imagenes/jogerazulrey6.jpeg"], barcode: "7801234567909", descripcion: "Pantalón jogger antifluido." },
        { id: 18, nombre: "Pantalon Mujer Azul Rey", precio: 19990, categorias: ["Mujer", "Pantalones"], mostrar: true, imagenes: ["imagenes/paAzuRe.jpeg", "imagenes/paAzuRe2.jpeg", "imagenes/paAzuRe3.jpeg", "imagenes/paAzuRe4.jpeg"], barcode: "7801234567910", descripcion: "Pantalón antifluido para mujer, cómodos y de mucha durabilidad." }
    ];

    try {
        // 1. Asegurar que la tabla existe con la estructura correcta
        await pool.query(`
            CREATE TABLE IF NOT EXISTS productos (
                id SERIAL PRIMARY KEY,
                nombre TEXT NOT NULL,
                precio INTEGER NOT NULL,
                stock INTEGER DEFAULT 0,
                categorias TEXT[],
                mostrar BOOLEAN DEFAULT true,
                imagenes TEXT[],
                barcode TEXT,
                descripcion TEXT,
                tallas TEXT[],
                stock_tallas JSONB,
                mostrar_colores BOOLEAN DEFAULT true
            );
        `);

        // 2. Insertar o Actualizar cada producto
        for (const p of productos) {
            await pool.query(`
                INSERT INTO productos (id, nombre, precio, categorias, mostrar, imagenes, barcode, descripcion)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                ON CONFLICT (id) DO UPDATE 
                SET nombre = $2, precio = $3, categorias = $4, mostrar = $5, imagenes = $6, barcode = $7, descripcion = $8
            `, [p.id, p.nombre, p.precio, p.categorias, p.mostrar, p.imagenes, p.barcode, p.descripcion]);
        }

        // 3. Ajustar la secuencia de IDs para que los nuevos productos sigan desde el último ID
        await pool.query("SELECT setval('productos_id_seq', (SELECT MAX(id) FROM productos))");

        res.status(200).json({ message: "✅ Base de datos actualizada con todos los productos." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}
