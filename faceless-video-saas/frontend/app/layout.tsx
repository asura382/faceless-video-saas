import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Faceless Video - AI Video Generation',
  description: 'Create viral faceless videos using free AI. No subscription required.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-dark-900 text-white">
        {children}
      </body>
    </html>
  )
}
