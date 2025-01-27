'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export function PricingSection() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscription = async (priceId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
        }),
      });
      
      const { sessionId } = await response.json();
      const stripe = await stripePromise;
      
      const { error } = await stripe!.redirectToCheckout({ sessionId });
      
      if (error) {
        console.error('Error:', error);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-8">Choose Your Plan</h2>
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="relative overflow-hidden">
          <CardHeader>
            <CardTitle>Monthly Plan</CardTitle>
            <CardDescription>Perfect for ongoing use</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-4">$4.99<span className="text-lg font-normal">/month</span></div>
            <ul className="space-y-2 mb-6">
              <li>✓ Full access to L10 Timer</li>
              <li>✓ All features included</li>
              <li>✓ Cancel anytime</li>
            </ul>
            <Button 
              onClick={() => handleSubscription(process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID!)}
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Start Monthly Plan'}
            </Button>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 rounded-bl text-sm">
            Best Value
          </div>
          <CardHeader>
            <CardTitle>Lifetime Access</CardTitle>
            <CardDescription>One-time payment, forever access</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-4">$49<span className="text-lg font-normal">/lifetime</span></div>
            <ul className="space-y-2 mb-6">
              <li>✓ Full access to L10 Timer</li>
              <li>✓ All features included</li>
              <li>✓ Never pay again</li>
              <li>✓ All future updates included</li>
            </ul>
            <Button 
              onClick={() => handleSubscription(process.env.NEXT_PUBLIC_STRIPE_LIFETIME_PRICE_ID!)}
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Get Lifetime Access'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}