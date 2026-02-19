import { Pool } from '@neondatabase/serverless';
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    // Configuración CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Método no permitido" });
    }

    const { orden } = req.body;
    if (!orden) return res.status(400).json({ error: "Falta el número de orden" });

    try {
        const pool = new Pool({ connectionString: process.env.DATABASE_URL });
        const { rows } = await pool.query("SELECT * FROM ventas WHERE orden = $1", [orden]);

        if (rows.length === 0) return res.status(404).json({ error: "Orden no encontrada" });

        const venta = rows[0];
        const cliente = venta.datos_cliente || {};
        const items = venta.items || [];

        if (!cliente.email) return res.status(400).json({ error: "El cliente no tiene email registrado" });

        // Configurar transporte de correo (Gmail)
        // Asegúrate de tener EMAIL_USER y EMAIL_PASS en tus variables de entorno
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Generar lista de productos HTML
        const itemsHtml = items.map(i => 
            `<li style="margin-bottom: 5px;">
                <strong>${i.nombre}</strong> x${i.cantidad} <br>
                <small>Talla: ${i.talla || 'Única'} | $${(i.precio * i.cantidad).toLocaleString('es-CL')}</small>
            </li>`
        ).join('');

        const mailOptions = {
            from: `"StylePro Uniformes" <${process.env.EMAIL_USER}>`,
            to: [cliente.email, process.env.EMAIL_USER], // Enviar al cliente y copia al admin
            subject: `✅ Comprobante de Pago - Orden #${orden}`,
            html: `
                <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
                    <div style="background-color: #008080; color: white; padding: 20px; text-align: center;">
                        <h2 style="margin: 0;">¡Pago Exitoso!</h2>
                        <p style="margin: 5px 0 0;">Gracias por tu compra, ${cliente.nombre}</p>
                    </div>
                    <div style="padding: 20px;">
                        <p>Hemos recibido tu pago correctamente. Aquí tienes el detalle:</p>
                        <div style="background: #f9f9f9; padding: 15px; border-radius: 6px; margin: 20px 0;">
                            <h3 style="margin-top: 0; color: #008080;">📦 Orden #${orden}</h3>
                            <ul style="padding-left: 20px;">${itemsHtml}</ul>
                            <hr style="border: 0; border-top: 1px solid #ddd; margin: 10px 0;">
                            <p style="font-weight: bold; font-size: 1.1em; text-align: right;">Total: $${parseInt(venta.total).toLocaleString('es-CL')}</p>
                        </div>
                        <div style="margin-bottom: 20px;">
                            <p><strong>📍 Envío a:</strong> ${cliente.direccion}, ${cliente.comuna}</p>
                            <p><strong>📞 Teléfono:</strong> ${cliente.telefono}</p>
                        </div>
                        <p style="font-size: 0.9em; color: #666; text-align: center;">Te notificaremos cuando tu pedido sea despachado.</p>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'Correo enviado' });

    } catch (error) {
        console.error("Error enviando correo:", error);
        res.status(500).json({ error: error.message });
    }
}