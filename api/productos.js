import { Pool } from '@neondatabase/serverless';

export default async function handler(req, res) {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    if (req.method === 'GET') {
      // Obtener todos los productos ordenados por ID
      const { rows } = await pool.query('SELECT * FROM productos ORDER BY id ASC');
      res.json(rows);
    } else if (req.method === 'POST') {
      // Crear producto (Usado para la migración)
      const { nombre, precio, stock, categorias, imagenes, descripcion, mostrar } = req.body;
      await pool.query(
        'INSERT INTO productos (nombre, precio, stock, categorias, imagenes, descripcion, mostrar) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [nombre, precio, stock, categorias, imagenes, descripcion, mostrar]
      );
      res.json({ success: true });
    } else if (req.method === 'PUT') {
      // Actualizar producto (Stock o Visibilidad)
      const { id, stock, mostrar } = req.body;
      
      if (stock !== undefined) {
        await pool.query('UPDATE productos SET stock = $1 WHERE id = $2', [stock, id]);
      }
      
      if (mostrar !== undefined) {
        await pool.query('UPDATE productos SET mostrar = $1 WHERE id = $2', [mostrar, id]);
      }
      
      res.json({ success: true });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}