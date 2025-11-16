'use client'

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { usePathname } from 'next/navigation'
import MobileMenu from './MobileMenu'

export default function Navigation() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <nav className="flex justify-between items-center p-4 md:p-6 border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <span className="text-3xl">🐍</span>
        <a href="/" className="text-xl md:text-2xl font-bold text-white hover:text-green-400 transition-colors">
          SLITHER.WORLD
        </a>
      </div>
      
      {/* Desktop Navigation */}
      <div className="hidden md:flex gap-6 items-center mr-4">
        <a 
          href="/" 
          className={`transition-colors ${isActive('/') ? 'text-green-400 font-semibold' : 'text-gray-300 hover:text-green-400'}`}
        >
          Play
        </a>
        <a 
          href="/leaderboard" 
          className={`transition-colors ${isActive('/leaderboard') ? 'text-green-400 font-semibold' : 'text-gray-300 hover:text-green-400'}`}
        >
          Leaderboard
        </a>
        <a 
          href="/live" 
          className={`transition-colors ${isActive('/live') ? 'text-purple-400 font-semibold' : 'text-gray-300 hover:text-purple-400'}`}
        >
          Watch Live
        </a>
        <a 
          href="/profile" 
          className={`transition-colors ${isActive('/profile') ? 'text-green-400 font-semibold' : 'text-gray-300 hover:text-green-400'}`}
        >
          Profile
        </a>
      </div>

      {/* Mobile & Wallet */}
      <div className="flex items-center gap-2">
        <WalletMultiButton className="!bg-green-600 hover:!bg-green-700 !rounded-lg !px-3 md:!px-4 !py-2 !font-semibold !text-xs md:!text-sm !transition-colors" />
        <MobileMenu />
      </div>
    </nav>
  )
}
