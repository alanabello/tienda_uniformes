import { Pool } from '@neondatabase/serverless';

export default async function handler(req, res) {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("La variable DATABASE_URL no está configurada en Vercel");
    }

    const pool = new Pool({ connectionString: process.env.DATABASE_URL });

    if (req.method === 'GET') {
      // Obtener últimas 20 ventas
      const { rows } = await pool.query('SELECT * FROM ventas ORDER BY fecha DESC LIMIT 20');
      res.json(rows);
    } else if (req.method === 'POST') {
      const { orden, total, items, estado } = req.body;
      
      // 1. Guardar venta (items se guarda como JSON)
      await pool.query(
        'INSERT INTO ventas (orden, total, items, estado) VALUES ($1, $2, $3, $4)',
        [orden, total, JSON.stringify(items), estado]
      );

      // 2. Descontar stock (Iterar items)
      for (const item of items) {
          // Asumiendo que item.id corresponde al ID en la DB
          await pool.query('UPDATE productos SET stock = stock - $1 WHERE id = $2', [item.cantidad, item.id]);
      }

      res.json({ success: true });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}