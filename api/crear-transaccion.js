import { WebpayPlus } from 'transbank-sdk';

// Configuración de integración (Pruebas)
WebpayPlus.configureForIntegration(
  WebpayPlus.IntegrationCommerceCodes.WEBPAY_PLUS,
  WebpayPlus.IntegrationApiKeys.WEBPAY
);

export default async function handler(req, res) {
  // Habilitar CORS para que tu página pueda comunicarse con este servidor
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { monto, orden } = req.body;

  // Generar URL dinámica (funciona en localhost y en cualquier dominio de Vercel)
  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const host = req.headers['host'];
  const returnUrl = `${protocol}://${host}/api/confirmar-transaccion`;

  try {
    const response = await WebpayPlus.Transaction.create(
      orden,
      "sesion-" + Date.now(),
      monto,
      returnUrl
    );
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}