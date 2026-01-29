import { Pool } from '@neondatabase/serverless';
import jwt from 'jsonwebtoken';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Middleware de seguridad (mismo que en otros archivos)
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
        // Asegurar que la tabla existe antes de cualquier operación
        await pool.query(`CREATE TABLE IF NOT EXISTS configuracion (clave TEXT PRIMARY KEY, valor TEXT)`);

        if (req.method === 'GET') {
            // Obtener configuración (Público para que el carrito sepa si cobrar envío)
            const { rows } = await pool.query("SELECT valor FROM configuracion WHERE clave = 'envio_gratis'");
            const activo = rows.length > 0 ? rows[0].valor === 'true' : false;
            res.json({ envio_gratis: activo });
        } else if (req.method === 'POST') {
            // Guardar configuración (Protegido solo admin)
            await verifyToken(req);
            const { envio_gratis } = req.body;
            await pool.query(`
                INSERT INTO configuracion (clave, valor) VALUES ('envio_gratis', $1) 
                ON CONFLICT (clave) DO UPDATE SET valor = $1
            `, [String(envio_gratis)]);
            res.json({ success: true, estado: envio_gratis });
        }
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ error: error.message });
    }
}