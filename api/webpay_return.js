import { WebpayPlus, Options, IntegrationCommerceCodes, IntegrationApiKeys, Environment } from 'transbank-sdk';
import { Pool } from '@neondatabase/serverless';

export default async function handler(req, res) {
    try {
        // Configuración Transbank
        const tx = new WebpayPlus.Transaction(new Options(
            IntegrationCommerceCodes.WEBPAY_PLUS,
            IntegrationApiKeys.WEBPAY,
            Environment.Integration
        ));

        // Transbank envía el token por POST o GET
        const token = req.query.token_ws || req.body.token_ws;
        const tbkToken = req.query.TBK_TOKEN || req.body.TBK_TOKEN; // Caso anular compra

        // Si el usuario anuló la compra en el formulario bancario
        if (tbkToken && !token) {
            return res.redirect('/carrito.html?error=compra_anulada');
        }

        if (!token) {
            return res.redirect('/carrito.html?error=token_faltante');
        }

        // Confirmar la transacción con Transbank
        const commitResponse = await tx.commit(token);

        if (commitResponse.status === 'AUTHORIZED' && commitResponse.response_code === 0) {
            // PAGO EXITOSO
            // Actualizar estado a PAGADO en la base de datos
            if (process.env.DATABASE_URL) {
                const pool = new Pool({ connectionString: process.env.DATABASE_URL });
                
                // 1. Actualizamos a PAGADO y recuperamos los items vendidos (RETURNING items)
                const result = await pool.query("UPDATE ventas SET estado = 'PAGADO' WHERE orden = $1 RETURNING items", [commitResponse.buy_order]);
                
                // 2. Si la venta existe, descontamos el stock de cada producto
                if (result.rows.length > 0) {
                    const items = result.rows[0].items; // Postgres parsea el JSONB automáticamente
                    for (const item of items) {
                        // Restar la cantidad comprada al stock actual
                        await pool.query('UPDATE productos SET stock = stock - $1 WHERE id = $2', [item.cantidad, item.id]);
                    }
                }
            }
            
            // Redirigir a página de éxito
            res.redirect(`/exito.html?orden=${commitResponse.buy_order}&monto=${commitResponse.amount}`);
        } else {
            // PAGO RECHAZADO
            res.redirect('/carrito.html?error=pago_rechazado');
        }
    } catch (error) {
        console.error("Error Webpay Commit:", error);
        // Si el token ya fue usado o expiró
        res.redirect('/carrito.html?error=transaccion_invalida');
    }
}