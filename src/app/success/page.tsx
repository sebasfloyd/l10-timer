import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        <h1 className="text-4xl font-bold text-green-600 mb-4">🎉 Thank You!</h1>
        <p className="text-xl text-gray-600 mb-8">
          Your payment was successful. You now have access to L10 Timer.
        </p>
        <Link href="/">
          <Button>Start Using L10 Timer</Button>
        </Link>
      </div>
    </div>
  );
}