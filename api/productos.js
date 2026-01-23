import { Pool } from '@neondatabase/serverless';

export default async function handler(req, res) {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("La variable DATABASE_URL no está configurada en Vercel");
    }

    const pool = new Pool({ connectionString: process.env.DATABASE_URL });

    // Asegurar columna stock_tallas (Migración automática)
    await pool.query("ALTER TABLE productos ADD COLUMN IF NOT EXISTS stock_tallas JSONB");

    if (req.method === 'GET') {
      // Obtener todos los productos ordenados por ID
      // Sincronizando stock con inventario_general si existe coincidencia de barcode
      const { rows } = await pool.query(`
        SELECT p.*, COALESCE(i.stock, p.stock) as stock, i.tallas as tallas_inventario
        FROM productos p
        LEFT JOIN inventario_general i ON p.barcode = i.barcode
        ORDER BY p.id ASC
      `);
      res.json(rows);
    } else if (req.method === 'POST') {
      // Crear producto
      const { nombre, precio, stock, categorias, imagenes, descripcion, mostrar, tallas, stock_tallas, mostrarColores, barcode } = req.body;
      await pool.query(
        'INSERT INTO productos (nombre, precio, stock, categorias, imagenes, descripcion, mostrar, tallas, stock_tallas, mostrar_colores, barcode) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
        [nombre, precio, stock, categorias, imagenes, descripcion, mostrar, tallas, stock_tallas || {}, mostrarColores, barcode]
      );
      res.json({ success: true });
    } else if (req.method === 'PUT') {
      // Actualizar producto (Stock o Visibilidad)
      const { id, stock, mostrar, tallas, stock_tallas } = req.body;
      
      if (stock !== undefined) {
        await pool.query('UPDATE productos SET stock = $1 WHERE id = $2', [stock, id]);
      }
      
      if (mostrar !== undefined) {
        await pool.query('UPDATE productos SET mostrar = $1 WHERE id = $2', [mostrar, id]);
      }

      if (tallas !== undefined || stock_tallas !== undefined) {
        await pool.query('UPDATE productos SET tallas = $1, stock_tallas = $2 WHERE id = $3', [tallas, stock_tallas, id]);
      }
      
      res.json({ success: true });
    } else if (req.method === 'PATCH') { // Nuevo método para actualizar stock por barcode
      const { barcode, cantidad } = req.body; // cantidad puede ser +1, -1, etc.
      if (barcode && cantidad !== undefined) {
        await pool.query(
          'UPDATE productos SET stock = stock + $1 WHERE barcode = $2 RETURNING id, nombre, stock',
          [cantidad, barcode]
        );
      }
      
      res.json({ success: true });
    } else if (req.method === 'DELETE') {
      const { id } = req.body;
      await pool.query('DELETE FROM productos WHERE id = $1', [id]);
      res.json({ success: true });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}