// PromoCodeInput.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';

interface PromoCodeInputProps {
  onSuccess: () => void;
}

export function PromoCodeInput({ onSuccess }: PromoCodeInputProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const validateCode = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/promo/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }), // Asegúrate de que este formato es correcto
      });

      const data = await response.json();

      if (response.ok && data.valid) {
        setMessage(data.message);
        onSuccess();
      } else {
        setError(data.message || 'Invalid promo code.');
      }
    } catch (err) {
      console.error('Error validating promo code:', err);
      setError('Error validating code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex gap-2">
        <Input
          placeholder="Enter promo code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="flex-grow"
        />
        <Button 
          onClick={validateCode}
          disabled={loading || !code.trim()}
        >
          {loading ? 'Validating...' : 'Apply'}
        </Button>
      </div>
      
      {error && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-500 text-sm"
        >
          {error}
        </motion.p>
      )}
      
      {message && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-green-500 text-sm"
        >
          {message}
        </motion.p>
      )}
    </motion.div>
  );
}
