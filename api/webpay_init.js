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
        // Configuración Transbank (Dinámica: Lee de variables de entorno o usa Integración por defecto)
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

            // 1. Verificar configuración en Base de Datos
            const configRes = await pool.query("SELECT valor FROM configuracion WHERE clave = 'envio_gratis'");
            const modoPruebaActivo = configRes.rows.length > 0 && configRes.rows[0].valor === 'true';

            // 2. Calcular envío real
            let envio = 4000;
            if (modoPruebaActivo) {
                envio = 0; // Modo pruebas activado
            } else if (tienePantalon && tieneTop) {
                envio = 0; // Promoción normal (Conjunto completo)
            }

            const totalReal = totalCalculado + envio;

            amountInt = Math.floor(totalReal);
        }

        // URL donde Transbank devolverá al cliente (IMPORTANTE: Usa tu dominio real de Vercel)
        const returnUrl = 'https://styleprouniformes.vercel.app/api/webpay_return';

        // 1. Solicitar Token a Transbank PRIMERO
        const createResponse = await tx.create(buyOrder, sessionId, amountInt, returnUrl);
        const token = createResponse.token;

        // 2. Guardar venta PENDIENTE con el TOKEN en la Base de Datos
        if (process.env.DATABASE_URL) {
            const pool = new Pool({ connectionString: process.env.DATABASE_URL });
            
            // Asegurar que la tabla existe (por si es la primera venta)
            await pool.query(`CREATE TABLE IF NOT EXISTS ventas (orden TEXT PRIMARY KEY, total INTEGER, items JSONB, estado TEXT, fecha TIMESTAMP DEFAULT NOW(), datos_cliente JSONB)`);
            
            // Asegurar que existe la columna token para guardar la referencia
            try {
                await pool.query("ALTER TABLE ventas ADD COLUMN IF NOT EXISTS token TEXT");
            } catch (e) { console.log("Columna token ya existe o error al crear:", e.message); }

            // --- CORRECCIÓN ERROR ON CONFLICT ---
            // Si la tabla ya existía sin PRIMARY KEY, esto agrega la restricción necesaria
            try {
                await pool.query("ALTER TABLE ventas ADD PRIMARY KEY (orden)");
            } catch (e) {
                // Si falla (porque ya existe o hay duplicados), aseguramos un índice único
                // Esto soluciona el error "there is no unique or exclusion constraint matching the ON CONFLICT specification"
                try { await pool.query("CREATE UNIQUE INDEX IF NOT EXISTS ventas_orden_idx ON ventas (orden)"); } catch (e2) {}
            }

            // Insertar o actualizar la orden pendiente
            // Usamos ON CONFLICT por si el usuario reintenta pagar la misma orden
            await pool.query(`
                INSERT INTO ventas (orden, total, items, estado, datos_cliente, token) 
                VALUES ($1, $2, $3, $4, $5, $6)
                ON CONFLICT (orden) DO UPDATE 
                SET total = $2, items = $3, estado = $4, datos_cliente = $5, fecha = NOW(), token = $6
            `, [buyOrder, amountInt, JSON.stringify(items || []), 'PENDIENTE', JSON.stringify(datosCliente || {}), token]);
        }
        res.status(200).json(createResponse);
    } catch (error) {
        console.error("Error Webpay Init:", error);
        res.status(500).json({ error: error.message });
    }
}