import { Pool } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
    try {
        if (!process.env.DATABASE_URL) {
            throw new Error("Falta la variable DATABASE_URL");
        }

        const pool = new Pool({ connectionString: process.env.DATABASE_URL });

        // 1. Tabla de USUARIOS (Para el Login)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id SERIAL PRIMARY KEY,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL
            );
        `);

        // Crear usuario admin por defecto: admin / admin123
        const passHash = await bcrypt.hash('admin123', 10);
        await pool.query(`
            INSERT INTO usuarios (username, password) 
            VALUES ('admin', $1) 
            ON CONFLICT (username) DO NOTHING;
        `, [passHash]);

        // 2. Tabla de PRODUCTOS (Tienda visible)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS productos (
                id SERIAL PRIMARY KEY,
                nombre TEXT,
                precio INTEGER,
                stock INTEGER,
                categorias JSONB,
                imagenes JSONB,
                descripcion TEXT,
                mostrar BOOLEAN DEFAULT true,
                tallas JSONB,
                stock_tallas JSONB,
                mostrar_colores BOOLEAN DEFAULT false,
                barcode TEXT
            );
        `);

        // 3. Tabla de INVENTARIO GENERAL (Bodega)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS inventario_general (
                id SERIAL PRIMARY KEY,
                nombre TEXT NOT NULL,
                precio INTEGER,
                stock INTEGER DEFAULT 0,
                categoria TEXT,
                tallas TEXT[],
                descripcion TEXT,
                barcode TEXT UNIQUE,
                fecha_creacion TIMESTAMPTZ DEFAULT NOW()
            );
        `);

        // 4. Tabla de VENTAS (Historial)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS ventas (
                orden TEXT PRIMARY KEY,
                total INTEGER,
                items JSONB,
                estado TEXT,
                fecha TIMESTAMP DEFAULT NOW(),
                datos_cliente JSONB,
                token TEXT
            );
        `);

        // 5. Tabla de CONFIGURACIÓN PROMO
        await pool.query(`
            CREATE TABLE IF NOT EXISTS config_promo (
                id SERIAL PRIMARY KEY,
                activo BOOLEAN DEFAULT false,
                titulo TEXT,
                subtitulo TEXT,
                contenido TEXT,
                tag TEXT
            );
        `);

        // 6. Tabla de CONFIGURACIÓN GENERAL (Para activar/desactivar envío gratis)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS configuracion (
                clave TEXT PRIMARY KEY,
                valor TEXT
            );
        `);
        // Insertar valor por defecto (Desactivado)
        await pool.query("INSERT INTO configuracion (clave, valor) VALUES ('envio_gratis', 'false') ON CONFLICT DO NOTHING;");
        
        // Insertar promo por defecto
        const countRes = await pool.query('SELECT count(*) FROM config_promo');
        if (parseInt(countRes.rows[0].count) === 0) {
            await pool.query("INSERT INTO config_promo (activo, titulo, subtitulo, contenido, tag) VALUES (false, '¡OFERTA FLASH!', 'Solo por hoy', 'Envío Gratis', 'APROVECHA')");
        }

        res.status(200).json({ 
            success: true, 
            message: "Base de datos configurada exitosamente. Usuario: admin / Pass: admin123"
        });

    } catch (error) {
        console.error("Error setup_db:", error);
        res.status(500).json({ error: error.message });
    }
}