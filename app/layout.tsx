import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { WalletProvider } from '@/components/WalletProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Slither.World',
  description: 'Real-time multiplayer snake game with USDC wagers. Winner takes 80% of the pot!',
  keywords: ['slither', 'multiplayer', 'snake game', 'crypto gaming', 'blockchain game'],
  authors: [{ name: 'Slither.World' }],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  openGraph: {
    title: 'Slither.World',
    description: 'Real-time multiplayer snake game. Winner takes 80%!',
    url: 'https://slither.world',
    siteName: 'Slither.World',
    images: [
      {
        url: '/banner.svg',
        width: 1500,
        height: 500,
        alt: 'Slither.World',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Slither.World',
    description: 'Real-time multiplayer snake game. Winner takes 80%!',
    images: ['/banner.svg'],
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/icon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletProvider>
          {children}
        </WalletProvider>
      </body>
    </html>
  )
}
