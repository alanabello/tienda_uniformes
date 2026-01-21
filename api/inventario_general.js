import { Pool } from '@neondatabase/serverless';

export default async function handler(req, res) {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL no está configurada.");
    }
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });

    // Crear tabla si no existe. Se ejecuta una sola vez.
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
        const { id, stock } = req.body;
        if (id === undefined || stock === undefined) {
            return res.status(400).json({ error: 'ID y stock son requeridos' });
        }
        await pool.query('UPDATE inventario_general SET stock = $1 WHERE id = $2', [stock, id]);
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