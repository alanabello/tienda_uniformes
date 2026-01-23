import Transbank from 'transbank-sdk';
const { WebpayPlus, Options, IntegrationCommerceCodes, IntegrationApiKeys, Environment } = Transbank;
import { Pool } from '@neondatabase/serverless';

export default async function handler(req, res) {
    try {
        // Configuración Transbank
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

        // Función segura para redirigir (compatible con Vercel y Node puro)
        const safeRedirect = (url) => {
            if (typeof res.redirect === 'function') return res.redirect(url);
            res.writeHead(302, { Location: url });
            res.end();
        };

        // Si el usuario anuló la compra en el formulario bancario
        if (tbkToken && !token) {
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
                
                // 1. Actualizamos a PAGADO y recuperamos los items vendidos (RETURNING items)
                const result = await pool.query("UPDATE ventas SET estado = 'PAGADO' WHERE orden = $1 RETURNING items", [commitResponse.buy_order]);
                
                // 2. Si la venta existe, descontamos el stock de cada producto
                if (result.rows.length > 0) {
                    const items = result.rows[0].items; // Postgres parsea el JSONB automáticamente
                    for (const item of items) {
                        // 1. Actualizar inventario_general si existe coincidencia por barcode
                        await pool.query(`
                            UPDATE inventario_general 
                            SET stock = stock - $1 
                            WHERE barcode = (SELECT barcode FROM productos WHERE id = $2)
                        `, [item.cantidad, item.id]);

                        // 2. Actualizar productos (siempre, como respaldo)
                        await pool.query('UPDATE productos SET stock = stock - $1 WHERE id = $2', [item.cantidad, item.id]);

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