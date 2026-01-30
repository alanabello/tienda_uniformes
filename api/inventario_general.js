import { Pool } from '@neondatabase/serverless';
import jwt from 'jsonwebtoken';

// Instanciar el pool fuera del handler para reutilizar la conexión en entornos serverless
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Middleware/helper para verificar el token en cada petición protegida
const verifyToken = (req) => {
    return new Promise((resolve, reject) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Formato "Bearer TOKEN"

        if (token == null) {
            return reject({ status: 401, message: 'Acceso no autorizado. Token no proporcionado.' });
        }

        // Validación extra: Asegurar que el secreto existe antes de verificar
        if (!process.env.JWT_SECRET) {
            console.error("FATAL: JWT_SECRET no está definido en las variables de entorno.");
            return reject({ status: 500, message: 'Error interno: Configuración de seguridad faltante (JWT_SECRET).' });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return reject({ status: 403, message: 'Token inválido o expirado.' });
            }
            req.user = user; // Opcional: adjuntar info del usuario al request
            resolve();
        });
    });
};

export default async function handler(req, res) {
    // Configuración CORS para permitir conexión desde la App Móvil
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL no está configurada.");
    }

    // Asegurar que la tabla existe
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

    // Proteger rutas que modifican datos (POST, PUT, PATCH, DELETE)
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
        try {
            await verifyToken(req);
        } catch (authError) {
            // Asegurar que status sea un número válido para evitar caídas del servidor
            const status = authError.status || 500;
            return res.status(status).json({ error: authError.message || 'Error de autorización desconocido' });
        }
    }

    if (req.method === 'GET') {
      const { barcode } = req.query;
      if (barcode) {
        const { rows } = await pool.query('SELECT * FROM inventario_general WHERE barcode = $1', [barcode]);
        if (rows.length > 0) {
          res.json(rows[0]); // Devuelve solo el objeto encontrado
        } else {
          res.status(404).json({ error: 'Insumo no encontrado' });
        }
      } else {
        const { rows } = await pool.query('SELECT * FROM inventario_general ORDER BY nombre ASC');
        res.json(rows);
      }
    } else if (req.method === 'POST') {
      const { nombre, precio, stock, categoria, tallas, descripcion, barcode } = req.body;
      const { rows } = await pool.query(
        'INSERT INTO inventario_general (nombre, precio, stock, categoria, tallas, descripcion, barcode) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [nombre, precio, stock, categoria, tallas, descripcion, barcode]
      );
      res.status(201).json(rows[0]);
    } else if (req.method === 'PUT') {
        const { id, stock, tallas, categoria } = req.body;
        if (id === undefined || stock === undefined) {
            return res.status(400).json({ error: 'ID y stock son requeridos' });
        }
        
        if (tallas !== undefined || categoria !== undefined) {
            await pool.query('UPDATE inventario_general SET stock = $1, tallas = COALESCE($3, tallas), categoria = COALESCE($4, categoria) WHERE id = $2', [stock, id, tallas, categoria]);
        } else {
            await pool.query('UPDATE inventario_general SET stock = $1 WHERE id = $2', [stock, id]);
        }

        // Sincronizar stock en tabla productos (Tienda)
        await pool.query('UPDATE productos SET stock = $1 WHERE barcode = (SELECT barcode FROM inventario_general WHERE id = $2)', [stock, id]);
        
        // Ocultar producto en tienda si stock llega a 0
        if (stock <= 0) {
            await pool.query('UPDATE productos SET mostrar = false WHERE barcode = (SELECT barcode FROM inventario_general WHERE id = $1)', [id]);
        } else {
            // Auto-mostrar si hay stock
            await pool.query('UPDATE productos SET mostrar = true WHERE barcode = (SELECT barcode FROM inventario_general WHERE id = $1)', [id]);
        }

        res.json({ success: true, id, stock });
    } else if (req.method === 'PATCH') {
        const { barcode, cantidad } = req.body;
        if (!barcode || cantidad === undefined) {
            return res.status(400).json({ error: 'Barcode y cantidad son requeridos' });
        }
        const { rows } = await pool.query(
            'UPDATE inventario_general SET stock = stock + $1 WHERE barcode = $2 RETURNING *',
            [cantidad, barcode]
        );
        if (rows.length > 0) {
            // Sincronizar stock en tabla productos (Tienda)
            await pool.query('UPDATE productos SET stock = $1 WHERE barcode = $2', [rows[0].stock, barcode]);

            // Ocultar producto en tienda si stock llega a 0
            if (rows[0].stock <= 0) {
                await pool.query('UPDATE productos SET mostrar = false WHERE barcode = $1', [barcode]);
            } else {
                // Auto-mostrar si hay stock
                await pool.query('UPDATE productos SET mostrar = true WHERE barcode = $1', [barcode]);
            }
            res.json({ success: true, insumo: rows[0] });
        } else {
            res.status(404).json({ success: false, error: 'Insumo con ese barcode no encontrado para actualizar.' });
        }
    } else if (req.method === 'DELETE') {
        const { id } = req.body;
        if (id === undefined) {
            return res.status(400).json({ error: 'ID es requerido' });
        }
        await pool.query('DELETE FROM inventario_general WHERE id = $1', [id]);
        res.json({ success: true, id });
    }

  } catch (error) {
    console.error('Error en API de inventario general:', error);
    res.status(500).json({ error: error.message });
  }
}