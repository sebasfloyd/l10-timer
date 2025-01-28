// /app/api/stripe/checkout/route.ts

import { NextResponse } from 'next/server';
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16', // Asegúrate de que esta es la versión correcta de la API de Stripe
});

export async function POST(request: Request) {
  try {
    const { priceId, mode } = await request.json();

    // Validar el modo
    const validModes: Array<'payment' | 'subscription'> = ['payment', 'subscription'];
    if (!validModes.includes(mode)) {
      return NextResponse.json(
        { error: `Invalid mode. Expected one of: ${validModes.join(', ')}` },
        { status: 400 }
      );
    }

    // Validar que el priceId existe y corresponde al modo
    const price = await stripe.prices.retrieve(priceId);
    if (!price) {
      return NextResponse.json(
        { error: 'Invalid priceId: Price not found.' },
        { status: 400 }
      );
    }

    if (mode === 'subscription' && !price.recurring) {
      return NextResponse.json(
        { error: 'The selected price is not recurring. Please use a recurring price for subscriptions.' },
        { status: 400 }
      );
    }

    if (mode === 'payment' && price.recurring) {
      return NextResponse.json(
        { error: 'The selected price is recurring. Please use a one-time price for payments.' },
        { status: 400 }
      );
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

    return NextResponse.json({ sessionId: session.id });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);

    if (error.type === 'StripeInvalidRequestError') {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
