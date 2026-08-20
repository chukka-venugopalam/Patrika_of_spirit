import type { Metadata } from 'next'
import NavBar from '@/components/NavBar'
import './globals.css'

export const metadata: Metadata = {
  title: 'AwareNet',
  description: 'Track how awareness propagates, not just how many people saw it.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        {children}
      </body>
    </html>
  )
}
