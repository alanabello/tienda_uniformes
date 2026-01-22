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
        // Configuración Transbank (Modo Integración/Pruebas)
        const tx = new WebpayPlus.Transaction(new Options(
            IntegrationCommerceCodes.WEBPAY_PLUS,
            IntegrationApiKeys.WEBPAY,
            Environment.Integration
        ));

        // BLINDAJE: Asegurar que body existe, si no, usar objeto vacío
        const body = req.body || {};
        const { amount, buyOrder, sessionId, items, datosCliente } = body;
        
        if (!amount || !buyOrder || !sessionId) {
            throw new Error("Faltan datos requeridos (monto, orden o sesión)");
        }
        
        // Transbank requiere monto entero (sin decimales)
        const amountInt = Math.floor(amount);
        
        // URL donde Transbank devolverá al cliente (IMPORTANTE: Usa tu dominio real de Vercel)
        const returnUrl = 'https://styleprouniformes.vercel.app/api/webpay_return';

        // 1. Guardar la venta como PENDIENTE en la base de datos
        if (process.env.DATABASE_URL) {
            const pool = new Pool({ connectionString: process.env.DATABASE_URL });
            // Crear tabla si no existe (útil para la primera vez)
            await pool.query(`
                CREATE TABLE IF NOT EXISTS ventas (
                    orden TEXT PRIMARY KEY,
                    total INTEGER,
                    items JSONB,
                    estado TEXT,
                    fecha TIMESTAMP DEFAULT NOW()
                )
            `);
            
            // Agregar columna para datos del cliente si no existe (Migración al vuelo)
            try {
                await pool.query("ALTER TABLE ventas ADD COLUMN IF NOT EXISTS datos_cliente JSONB");
            } catch (e) { /* Ignorar si ya existe */ }

            // Insertar la orden
            await pool.query('INSERT INTO ventas (orden, total, items, estado, datos_cliente) VALUES ($1, $2, $3, $4, $5)', [buyOrder, amountInt, JSON.stringify(items || []), 'PENDIENTE', JSON.stringify(datosCliente || {})]);
        }

        const createResponse = await tx.create(buyOrder, sessionId, amountInt, returnUrl);
        res.status(200).json(createResponse);
    } catch (error) {
        console.error("Error Webpay Init:", error);
        res.status(500).json({ error: error.message });
    }
}