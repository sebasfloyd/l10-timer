import dynamic from 'next/dynamic'
import Link from 'next/link'
import { PricingSection } from '@/components/PricingSection'

const L10Timer = dynamic(() => import('@/components/L10Timer'), {
  ssr: false
})

export default function Home() {
  // Por ahora usaremos un estado local para simular el acceso
  // Luego lo reemplazaremos con autenticación real
  const hasAccess = false; // Esto luego vendrá de la verificación de pago

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            EOS Traction L10 Meeting Timer
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Run effective Level 10 Meetings with this specialized timer. Keep your team focused and meetings on track with predefined sections and time management.
          </p>
        </header>

        {hasAccess ? (
          <L10Timer />
        ) : (
          <PricingSection />
        )}

        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>
            Built with ❤️ by{' '}
            <Link 
              href="https://www.ruptiveai.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              Ruptive AI
            </Link>
          </p>
        </footer>
      </div>
    </main>
  )
}