export default async function handler(req, res) {
  // 1. Solo permitir peticiones POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { user, pass } = req.body;

    // 2. Obtener credenciales seguras desde las variables de entorno de Vercel
    const ADMIN_USER = process.env.ADMIN_USER;
    const ADMIN_PASS = process.env.ADMIN_PASS;

    // 3. Comparar las credenciales
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      // Si son correctas, enviar éxito
      res.status(200).json({ success: true, message: 'Autenticación exitosa' });
    } else {
      // Si son incorrectas, enviar error
      res.status(401).json({ success: false, error: 'Credenciales incorrectas' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
}