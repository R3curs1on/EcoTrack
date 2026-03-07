import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'EcoTrack - Biodiversity Monitoring',
  description: 'A serene, nature-inspired dashboard for tracking and monitoring biodiversity, species populations, and food chain relationships.',
  keywords: ['biodiversity', 'ecology', 'conservation', 'species tracking', 'ecosystem'],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#2d5a3d',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={plusJakarta.variable}>
      <body className="font-sans min-h-screen">{children}</body>
    </html>
  )
}
