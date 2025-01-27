import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { code, type } = await req.json();

    // Verificar el código en la base de datos
    const promoCode = await validatePromoCode(code);
    
    if (!promoCode) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 400 });
    }

    switch (promoCode.type) {
      case 'TRIAL':
        // Crear una suscripción con trial period
        const trialSession = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [{
            price: process.env.STRIPE_MONTHLY_PRICE_ID,
            quantity: 1,
          }],
          mode: 'subscription',
          subscription_data: {
            trial_period_days: promoCode.duration * 30, // Convertir meses a días
          },
          success_url: `${process.env.NEXT_PUBLIC_URL}/success`,
          cancel_url: `${process.env.NEXT_PUBLIC_URL}/cancel`,
        });
        return NextResponse.json({ sessionId: trialSession.id });

      case 'LIFETIME':
        // Crear una compra única para acceso lifetime
        const lifetimeSession = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [{
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'L10 Timer Lifetime Access',
                description: 'Lifetime access to L10 Timer Professional',
              },
              unit_amount: 4900, // $49.00
            },
            quantity: 1,
          }],
          mode: 'payment',
          success_url: `${process.env.NEXT_PUBLIC_URL}/success`,
          cancel_url: `${process.env.NEXT_PUBLIC_URL}/cancel`,
        });
        return NextResponse.json({ sessionId: lifetimeSession.id });

      default:
        return NextResponse.json({ error: 'Invalid code type' }, { status: 400 });
    }
  } catch (err) {
    console.error('Error processing promo code:', err);
    return NextResponse.json(
      { error: 'Error processing promo code' },
      { status: 500 }
    );
  }
}