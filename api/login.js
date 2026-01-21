import { Pool } from '@neondatabase/serverless';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { user, pass } = req.body;
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
        console.error('JWT_SECRET no está configurado en las variables de entorno.');
        return res.status(500).json({ error: 'Error de configuración del servidor.' });
    }

    try {
        // 1. Buscar el usuario en la base de datos Neon
        const { rows } = await pool.query('SELECT * FROM usuarios WHERE username = $1', [user]);

        if (rows.length > 0) {
            const dbUser = rows[0];

            // 2. Comparar contraseña encriptada
            if (await bcrypt.compare(pass, dbUser.password)) {
                const token = jwt.sign({ user: dbUser.username, role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
                return res.status(200).json({ success: true, token: token });
            }
        }

        return res.status(401).json({ success: false, error: 'Usuario o contraseña incorrectos.' });
    } catch (error) {
        console.error('Error en login:', error);
        return res.status(500).json({ error: 'Error interno del servidor.' });
    }
}