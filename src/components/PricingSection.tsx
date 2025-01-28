'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { PromoCodeInput } from './PromoCodeInput';

interface PricingSectionProps {
  onAccess: () => void;
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export function PricingSection({ onAccess }: PricingSectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);

  const handleCheckout = async (priceId: string, mode: 'subscription' | 'payment') => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          mode, // Enviar el modo junto con el priceId
        }),
      });
      
      const { sessionId, error } = await response.json();

      if (error) {
        console.error('Error:', error);
        alert(error); // Opcional: Mostrar alerta al usuario
        return;
      }

      const stripe = await stripePromise;
      
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      const { error: stripeError } = await stripe.redirectToCheckout({ sessionId });
      
      if (stripeError) {
        console.error('Stripe Error:', stripeError);
      }
    } catch (err) {
      console.error('Error:', err);
      alert('An unexpected error occurred. Please try again.'); // Opcional: Mostrar alerta al usuario
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccessGranted = () => {
    setHasAccess(true);
    onAccess(); // Notificar al componente padre
  };

  if (hasAccess) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold text-green-600 mb-4">
          Welcome to L10 Timer!
        </h2>
        <p className="text-gray-600">
          You now have full access to all features.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-8">Choose Your Plan</h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Plan Mensual */}
        <Card className="relative overflow-hidden">
          <CardHeader>
            <CardTitle>Monthly Plan</CardTitle>
            <CardDescription>Perfect for ongoing use</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-4">$4.99
              <span className="text-lg font-normal">/month</span>
            </div>
            <ul className="space-y-2 mb-6">
              <li>✓ Full access to L10 Timer</li>
              <li>✓ All features included</li>
              <li>✓ Cancel anytime</li>
            </ul>
            <Button 
              onClick={() => handleCheckout('price_1QlyNZHMM0hLyRSjxgTmxaPy', 'subscription')}
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Start Monthly Plan'}
            </Button>
          </CardContent>
        </Card>

        {/* Acceso de por Vida */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 rounded-bl text-sm">
            Best Value
          </div>
          <CardHeader>
            <CardTitle>Lifetime Access</CardTitle>
            <CardDescription>One-time payment, forever access</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-4">$49
              <span className="text-lg font-normal">/lifetime</span>
            </div>
            <ul className="space-y-2 mb-6">
              <li>✓ Full access to L10 Timer</li>
              <li>✓ All features included</li>
              <li>✓ Never pay again</li>
              <li>✓ All future updates included</li>
            </ul>
            <Button 
              onClick={() => handleCheckout('price_1QlyNZHMM0hLyRSjpJFPxXmK', 'payment')}
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Get Lifetime Access'}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="max-w-md mx-auto p-6 mt-8">
        <CardContent>
          <h3 className="text-lg font-semibold mb-4">Have a promo code?</h3>
          <PromoCodeInput onSuccess={handleAccessGranted} />
        </CardContent>
      </Card>
    </div>
  );
}
