import { Pool } from '@neondatabase/serverless';
import jwt from 'jsonwebtoken';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Helper de seguridad (mismo que en otros archivos)
const verifyToken = (req) => {
    return new Promise((resolve, reject) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (token == null) return reject({ status: 401, message: 'No autorizado' });

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) return reject({ status: 403, message: 'Token inválido' });
            req.user = user;
            resolve();
        });
    });
};

export default async function handler(req, res) {
    try {
        // 1. Asegurar que la tabla existe (Auto-migración simple)
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
        
        // 2. Asegurar que existe al menos una fila de configuración
        const countRes = await pool.query('SELECT count(*) FROM config_promo');
        if (parseInt(countRes.rows[0].count) === 0) {
            await pool.query("INSERT INTO config_promo (activo, titulo, subtitulo, contenido, tag) VALUES (false, '¡OFERTA FLASH!', 'Solo por hoy', 'Envío Gratis', 'APROVECHA')");
        }

        if (req.method === 'GET') {
            // Obtener configuración (Público)
            const { rows } = await pool.query('SELECT * FROM config_promo LIMIT 1');
            res.json(rows[0]);
        } else if (req.method === 'POST') {
            // Guardar configuración (Protegido)
            await verifyToken(req);
            
            const { activo, titulo, subtitulo, contenido, tag } = req.body;
            
            // Actualizamos siempre la primera fila (o todas, ya que solo debería haber una config)
            await pool.query(
                'UPDATE config_promo SET activo = $1, titulo = $2, subtitulo = $3, contenido = $4, tag = $5', 
                [activo, titulo, subtitulo, contenido, tag]
            );
            
            res.json({ success: true });
        } else {
            res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}
