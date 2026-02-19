import Transbank from 'transbank-sdk';
const { WebpayPlus, Options, IntegrationCommerceCodes, IntegrationApiKeys, Environment } = Transbank;
import { Pool } from '@neondatabase/serverless';
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    try {
        // Configuración Transbank (Dinámica: Lee de variables de entorno o usa Integración por defecto)
        const commerceCode = process.env.WEBPAY_COMMERCE_CODE || IntegrationCommerceCodes.WEBPAY_PLUS;
        const apiKey = process.env.WEBPAY_API_KEY || IntegrationApiKeys.WEBPAY;
        const environment = process.env.WEBPAY_ENV === 'production' ? Environment.Production : Environment.Integration;

        const tx = new WebpayPlus.Transaction(new Options(
            commerceCode,
            apiKey,
            environment
        ));

        // Transbank envía el token por POST o GET
        // BLINDAJE: Usar encadenamiento opcional (?.) o valores por defecto para evitar crash
        const query = req.query || {};
        const body = req.body || {};
        
        const token = query.token_ws || body.token_ws;
        const tbkToken = query.TBK_TOKEN || body.TBK_TOKEN; // Caso anular compra
        const tbkOrdenCompra = query.TBK_ORDEN_COMPRA || body.TBK_ORDEN_COMPRA; // Capturar orden anulada

        // Función segura para redirigir (compatible con Vercel y Node puro)
        const safeRedirect = (url) => {
            if (typeof res.redirect === 'function') return res.redirect(url);
            res.writeHead(302, { Location: url });
            res.end();
        };

        // Si el usuario anuló la compra en el formulario bancario
        if (tbkToken && !token) {
            // Actualizar estado a ANULADO en la base de datos
            if (process.env.DATABASE_URL && tbkOrdenCompra) {
                const pool = new Pool({ connectionString: process.env.DATABASE_URL });
                await pool.query("UPDATE ventas SET estado = 'ANULADO' WHERE orden = $1", [tbkOrdenCompra]);
            }
            return safeRedirect('/pago-fallido.html?motivo=anulado');
        }

        if (!token) {
            return safeRedirect('/pago-fallido.html?motivo=error');
        }

        // Confirmar la transacción con Transbank
        const commitResponse = await tx.commit(token);

        if (commitResponse.status === 'AUTHORIZED' && commitResponse.response_code === 0) {
            // PAGO EXITOSO
            // Actualizar estado a PAGADO en la base de datos
            if (process.env.DATABASE_URL) {
                const pool = new Pool({ connectionString: process.env.DATABASE_URL });
                
                // 1. Actualizamos a PAGADO y recuperamos items, datos del cliente y total
                const result = await pool.query("UPDATE ventas SET estado = 'PAGADO' WHERE orden = $1 RETURNING items, datos_cliente, total", [commitResponse.buy_order]);
                
                // 2. Si la venta existe, descontamos el stock de cada producto
                if (result.rows.length > 0) {
                    const venta = result.rows[0];
                    const items = venta.items;
                    const cliente = venta.datos_cliente || {};
                    
                    for (const item of items) {
                        // 1. Actualizar inventario_general si existe coincidencia por barcode
                        await pool.query(`
                            UPDATE inventario_general 
                            SET stock = stock - $1 
                            WHERE barcode = (SELECT barcode FROM productos WHERE id = $2)
                        `, [item.cantidad, item.id]);

                        // 2. Actualizar productos (siempre, como respaldo)
                        await pool.query(`
                            UPDATE productos 
                            SET stock = stock - $1,
                                stock_tallas = CASE WHEN stock_tallas ? $3 THEN jsonb_set(stock_tallas, ARRAY[$3], (COALESCE((stock_tallas->>$3)::int, 0) - $1)::text::jsonb) ELSE stock_tallas END
                            WHERE id = $2
                        `, [item.cantidad, item.id, item.talla]);

                        // 3. Ocultar automáticamente si el stock llega a 0
                        await pool.query(`
                            UPDATE productos 
                            SET mostrar = false 
                            WHERE id = $1 AND (
                                stock <= 0 OR 
                                (barcode IS NOT NULL AND (SELECT stock FROM inventario_general WHERE barcode = productos.barcode) <= 0)
                            )
                        `, [item.id]);
                    }

                    // --- 3. Enviar correo de confirmación DIRECTAMENTE ---
                    if (process.env.EMAIL_USER && process.env.EMAIL_PASS && cliente.email) {
                        try {
                            const transporter = nodemailer.createTransport({
                                service: 'gmail',
                                auth: {
                                    user: process.env.EMAIL_USER,
                                    pass: process.env.EMAIL_PASS
                                }
                            });

                            const itemsHtml = items.map(i => 
                                `<li style="margin-bottom: 5px;">
                                    <strong>${i.nombre}</strong> x${i.cantidad} <br>
                                    <small>Talla: ${i.talla || 'Única'} | $${(i.precio * i.cantidad).toLocaleString('es-CL')}</small>
                                </li>`
                            ).join('');

                            const mailOptions = {
                                from: `"StylePro Uniformes" <${process.env.EMAIL_USER}>`,
                                to: [cliente.email, process.env.EMAIL_USER],
                                subject: `✅ Comprobante de Pago - Orden #${commitResponse.buy_order}`,
                                html: `
                                    <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
                                        <div style="background-color: #008080; color: white; padding: 20px; text-align: center;">
                                            <h2 style="margin: 0;">¡Pago Exitoso!</h2>
                                            <p style="margin: 5px 0 0;">Gracias por tu compra, ${cliente.nombre || 'Cliente'}</p>
                                        </div>
                                        <div style="padding: 20px;">
                                            <p>Hemos recibido tu pago correctamente. Aquí tienes el detalle:</p>
                                            <div style="background: #f9f9f9; padding: 15px; border-radius: 6px; margin: 20px 0;">
                                                <h3 style="margin-top: 0; color: #008080;">📦 Orden #${commitResponse.buy_order}</h3>
                                                <ul style="padding-left: 20px;">${itemsHtml}</ul>
                                                <hr style="border: 0; border-top: 1px solid #ddd; margin: 10px 0;">
                                                <p style="font-weight: bold; font-size: 1.1em; text-align: right;">Total: $${parseInt(venta.total).toLocaleString('es-CL')}</p>
                                            </div>
                                            <p style="font-size: 0.9em; color: #666; text-align: center;">Te notificaremos cuando tu pedido sea despachado.</p>
                                        </div>
                                    </div>
                                `
                            };

                            await transporter.sendMail(mailOptions);
                            console.log(`Correo enviado exitosamente a ${cliente.email}`);
                        } catch (emailError) {
                            console.error("Error enviando correo (Nodemailer):", emailError);
                        }
                    }
                }
            }
            
            // Redirigir a página de éxito
            safeRedirect(`/exito.html?orden=${commitResponse.buy_order}&monto=${commitResponse.amount}`);
        } else {
            // PAGO RECHAZADO
            safeRedirect('/pago-fallido.html?motivo=rechazado');
        }
    } catch (error) {
        console.error("Error Webpay Commit:", error);
        // Si el token ya fue usado o expiró
        // Usamos writeHead manual por si res.redirect falló
        res.writeHead(302, { Location: '/pago-fallido.html?motivo=excepcion' });
        res.end();
    }
}