import { Pool } from '@neondatabase/serverless';

export default async function handler(req, res) {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("La variable DATABASE_URL no está configurada en Vercel");
    }

    const pool = new Pool({ connectionString: process.env.DATABASE_URL });

    // Asegurar que la tabla ventas existe (Movido desde webpay_init)
    await pool.query(`
        CREATE TABLE IF NOT EXISTS ventas (
            orden TEXT PRIMARY KEY,
            total INTEGER,
            items JSONB,
            estado TEXT,
            fecha TIMESTAMP DEFAULT NOW()
        )
    `);
    
    // Agregar columna para datos del cliente si no existe
    try {
        await pool.query("ALTER TABLE ventas ADD COLUMN IF NOT EXISTS datos_cliente JSONB");
    } catch (e) { /* Ignorar si ya existe */ }

    if (req.method === 'GET') {
      // Obtener últimas 20 ventas
      const { rows } = await pool.query('SELECT * FROM ventas ORDER BY fecha DESC LIMIT 20');
      res.json(rows);
    } else if (req.method === 'POST') {
      const { orden, total, items, estado, datos_cliente } = req.body;
      
      // 1. Guardar venta (items se guarda como JSON)
      await pool.query(
        'INSERT INTO ventas (orden, total, items, estado, datos_cliente) VALUES ($1, $2, $3, $4, $5)',
        [orden, total, JSON.stringify(items), estado, JSON.stringify(datos_cliente || {})]
      );

      // 2. Descontar stock (Iterar items)
      for (const item of items) {
          // Asumiendo que item.id corresponde al ID en la DB
          await pool.query('UPDATE productos SET stock = stock - $1 WHERE id = $2', [item.cantidad, item.id]);
      }

      res.json({ success: true });
    } else if (req.method === 'PUT') {
      // Actualizar estado de la venta (Ej: de PAGADO a ENTREGADO)
      const { orden, estado } = req.body;
      if (!orden || !estado) return res.status(400).json({ error: 'Faltan datos' });
      
      await pool.query('UPDATE ventas SET estado = $1 WHERE orden = $2', [estado, orden]);
      res.json({ success: true });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}