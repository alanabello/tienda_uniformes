import Transbank from 'transbank-sdk';
const { WebpayPlus, Options, IntegrationCommerceCodes, IntegrationApiKeys, Environment } = Transbank;
import { Pool } from '@neondatabase/serverless';

export default async function handler(req, res) {
    // Configuración de CORS para permitir peticiones desde tu App/Web
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Método no permitido" });
    }

    try {
        // Configuración Transbank (Dinámica: Producción o Integración)
        const commerceCode = process.env.WEBPAY_COMMERCE_CODE || IntegrationCommerceCodes.WEBPAY_PLUS;
        const apiKey = process.env.WEBPAY_API_KEY || IntegrationApiKeys.WEBPAY;
        const environment = process.env.WEBPAY_ENV === 'production' ? Environment.Production : Environment.Integration;

        const tx = new WebpayPlus.Transaction(new Options(
            commerceCode,
            apiKey,
            environment
        ));

        // BLINDAJE: Asegurar que body existe, si no, usar objeto vacío
        const body = req.body || {};
        const { amount, buyOrder, sessionId, items, datosCliente } = body;
        
        if (!amount || !buyOrder || !sessionId) {
            throw new Error("Faltan datos requeridos (monto, orden o sesión)");
        }

        let amountInt = Math.floor(amount);

        // --- SEGURIDAD: Validar precios con la base de datos ---
        // Esto evita que un usuario modifique el HTML/JS para pagar $1
        if (process.env.DATABASE_URL && items && Array.isArray(items)) {
            const pool = new Pool({ connectionString: process.env.DATABASE_URL });
            let totalCalculado = 0;
            let tienePantalon = false;
            let tieneTop = false;

            for (const item of items) {
                const resProd = await pool.query('SELECT precio, categorias FROM productos WHERE id = $1', [item.id]);
                if (resProd.rows.length > 0) {
                    const prod = resProd.rows[0];
                    totalCalculado += (prod.precio * item.cantidad);
                    
                    // Lógica de envío (Debe coincidir con carrito.js)
                    const cats = prod.categorias || [];
                    if (cats.includes('Pantalones')) tienePantalon = true;
                    else tieneTop = true; // Si no es pantalón, cuenta como top/otro
                }
            }

            let envio = (tienePantalon && tieneTop) ? 0 : 4000;
            const totalReal = totalCalculado + envio;

            // Si el monto enviado es menor al real, usamos el real para evitar fraudes
            if (totalReal > amountInt) {
                console.log(`⚠️ ALERTA DE SEGURIDAD: Cliente envió $${amountInt}, pero el total real es $${totalReal}. Se forzó el precio real.`);
                amountInt = Math.floor(totalReal);
            }
        }

        // --- PERSISTENCIA: Guardar venta PENDIENTE ---
        // Necesario para que webpay_return.js pueda confirmar la venta y descontar stock
        if (process.env.DATABASE_URL) {
            const pool = new Pool({ connectionString: process.env.DATABASE_URL });
            
            // Asegurar que la tabla existe (por si es la primera venta)
            await pool.query(`CREATE TABLE IF NOT EXISTS ventas (orden TEXT PRIMARY KEY, total INTEGER, items JSONB, estado TEXT, fecha TIMESTAMP DEFAULT NOW(), datos_cliente JSONB)`);
            
            // Insertar o actualizar la orden pendiente
            // Usamos ON CONFLICT por si el usuario reintenta pagar la misma orden
            await pool.query(`
                INSERT INTO ventas (orden, total, items, estado, datos_cliente) 
                VALUES ($1, $2, $3, $4, $5)
                ON CONFLICT (orden) DO UPDATE 
                SET total = $2, items = $3, estado = $4, datos_cliente = $5, fecha = NOW()
            `, [buyOrder, amountInt, JSON.stringify(items || []), 'PENDIENTE', JSON.stringify(datosCliente || {})]);
        }
        
        // URL donde Transbank devolverá al cliente (IMPORTANTE: Usa tu dominio real de Vercel)
        const returnUrl = 'https://styleprouniformes.vercel.app/api/webpay_return';

        const createResponse = await tx.create(buyOrder, sessionId, amountInt, returnUrl);
        res.status(200).json(createResponse);
    } catch (error) {
        console.error("Error Webpay Init:", error);
        res.status(500).json({ error: error.message });
    }
}