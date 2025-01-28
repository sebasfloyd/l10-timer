// src/pages/api/stripe/checkout.ts

import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

// Verificar que la clave secreta de Stripe esté configurada
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { priceId, mode } = req.body;

    // Validar el modo
    const validModes: Array<'payment' | 'subscription'> = ['payment', 'subscription'];
    if (!validModes.includes(mode)) {
      return res.status(400).json({ error: `Invalid mode. Expected one of: ${validModes.join(', ')}` });
    }

    try {
      // Verificar que el priceId corresponde al modo seleccionado
      const price = await stripe.prices.retrieve(priceId);
      if (!price) {
        return res.status(400).json({ error: 'Invalid priceId: Price not found.' });
      }

      if (mode === 'subscription' && !price.recurring) {
        return res.status(400).json({ error: 'The selected price is not recurring. Please use a recurring price for subscriptions.' });
      }

      if (mode === 'payment' && price.recurring) {
        return res.status(400).json({ error: 'The selected price is recurring. Please use a one-time price for payments.' });
      }

      // Crear la sesión de checkout
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: mode, // 'payment' o 'subscription'
        success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_URL}/cancel`,
        allow_promotion_codes: true,
      });

      return res.status(200).json({ sessionId: session.id });
    } catch (error: any) {
      console.error('Error creating checkout session:', error);

      if (error.type === 'StripeInvalidRequestError') {
        return res.status(400).json({ error: error.message });
      }

      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
