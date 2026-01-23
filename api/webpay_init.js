import Transbank from 'transbank-sdk';
const { WebpayPlus, Options, IntegrationCommerceCodes, IntegrationApiKeys, Environment } = Transbank;

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
        
        // Transbank requiere monto entero (sin decimales)
        const amountInt = Math.floor(amount);
        
        // URL donde Transbank devolverá al cliente (IMPORTANTE: Usa tu dominio real de Vercel)
        const returnUrl = 'https://styleprouniformes.vercel.app/api/webpay_return';

        const createResponse = await tx.create(buyOrder, sessionId, amountInt, returnUrl);
        res.status(200).json(createResponse);
    } catch (error) {
        console.error("Error Webpay Init:", error);
        res.status(500).json({ error: error.message });
    }
}