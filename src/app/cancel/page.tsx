import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function CancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Payment Cancelled</h1>
        <p className="text-xl text-gray-600 mb-8">
          No worries! You can try again whenever you're ready.
        </p>
        <Link href="/">
          <Button variant="outline">Return to L10 Timer</Button>
        </Link>
      </div>
    </div>
  );
}