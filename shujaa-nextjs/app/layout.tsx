import type { Metadata } from 'next'
import { DM_Sans, Playfair_Display } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Kenya Safari & Watamu Coast | Savanna & Mare Adventures',
  description: 'A nine-day coast-and-safari journey from Mombasa to Tsavo East and Watamu with Savanna & Mare Adventures.',
  themeColor: '#0f2219',
  icons: {
    icon: [
      { url: '/icon.svg',  type: 'image/svg+xml' },
      { url: '/icon.png',  type: 'image/png', sizes: '512x512' },
    ],
    apple: { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    shortcut: '/favicon.ico',
  },
  manifest: '/manifest.json',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${playfair.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  )
}

