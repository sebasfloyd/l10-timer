import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EOS Traction L10 Meeting Timer | Ruptive AI',
  description: 'A professional timer for running effective Level 10 Meetings following the EOS Traction methodology. Keep your meetings on track and productive.',
  keywords: [
    'EOS',
    'Traction',
    'L10',
    'Level 10 Meeting',
    'Meeting Timer',
    'EOS Timer',
    'Ruptive AI',
    'Business Management',
    'Meeting Management'
  ],
  authors: [{ name: 'Ruptive AI', url: 'https://www.ruptiveai.com' }],
  creator: 'Ruptive AI',
  publisher: 'Ruptive AI',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://l10timer.ruptiveai.com',
    siteName: 'EOS Traction L10 Meeting Timer',
    title: 'EOS Traction L10 Meeting Timer | Ruptive AI',
    description: 'Professional timer for Level 10 Meetings',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'EOS Traction L10 Meeting Timer'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EOS Traction L10 Meeting Timer | Ruptive AI',
    description: 'Professional timer for Level 10 Meetings',
    images: ['/og-image.png']
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}