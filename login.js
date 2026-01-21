import jwt from 'jsonwebtoken';

export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { user, pass } = req.body;

    // IMPORTANTE: Mueve estas credenciales a variables de entorno en Vercel.
    // No dejes valores sensibles directamente en el código.
    const ADMIN_USER = process.env.ADMIN_USER;
    const ADMIN_PASS = process.env.ADMIN_PASS;
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET || !ADMIN_USER || !ADMIN_PASS) {
        console.error('Una o más variables de entorno (JWT_SECRET, ADMIN_USER, ADMIN_PASS) no están configuradas en Vercel.');
        return res.status(500).json({ error: 'Error de configuración del servidor.' });
    }

    if (user === ADMIN_USER && pass === ADMIN_PASS) {
        // Las credenciales son correctas, se crea el token JWT
        const token = jwt.sign(
            { user: user, role: 'admin' }, // Payload: información que quieres guardar en el token
            JWT_SECRET,
            { expiresIn: '8h' } // El token expirará en 8 horas
        );

        res.status(200).json({ success: true, token: token });
    } else {
        // Credenciales incorrectas
        res.status(401).json({ success: false, error: 'Usuario o contraseña incorrectos.' });
    }
}