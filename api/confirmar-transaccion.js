import { WebpayPlus } from 'transbank-sdk';

export default async function handler(req, res) {
  const { token_ws } = req.query; 

  // Si el usuario cancela el pago en el formulario de Webpay
  if (!token_ws) {
     return res.redirect("https://tiendauniformes.vercel.app/pago-fallido.html");
  }

  try {
    // Confirmar la transacción con Transbank
    const result = await WebpayPlus.Transaction.commit(token_ws);

    if (result.status === "AUTHORIZED") {
      // PAGO EXITOSO: Redirigir al index con mensaje de éxito
      res.redirect("https://tiendauniformes.vercel.app/pago-exitoso.html");
    } else {
      // PAGO RECHAZADO
      res.redirect("https://tiendauniformes.vercel.app/pago-fallido.html");
    }
  } catch (error) {
    console.error(error);
    res.redirect("https://tiendauniformes.vercel.app/pago-fallido.html");
  }
}