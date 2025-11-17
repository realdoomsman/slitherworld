'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  const [nickname, setNickname] = useState('')
  const [walletAddress, setWalletAddress] = useState('')

  useEffect(() => {
    const savedNickname = localStorage.getItem('playerNickname')
    const savedWallet = localStorage.getItem('playerWallet')
    if (savedNickname) setNickname(savedNickname)
    if (savedWallet) setWalletAddress(savedWallet)
  }, [])

  const handleJoinLobby = (type: string) => {
    if (!nickname.trim()) {
      alert('Please enter a nickname!')
      return
    }
    if (nickname.trim().length < 2 || nickname.trim().length > 20) {
      alert('Nickname must be 2-20 characters!')
      return
    }
    if (!walletAddress.trim() || walletAddress.trim().length < 32) {
      alert('Please enter your Solana wallet address!')
      return
    }
    
    localStorage.setItem('playerNickname', nickname.trim())
    localStorage.setItem('playerWallet', walletAddress.trim())
    router.push(`/lobby?type=${type}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      {/* Navigation */}
      <nav className="border-b border-green-500/20 bg-black/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/icon.svg" alt="Logo" className="w-10 h-10" />
            <span className="text-2xl font-bold text-green-400">SLITHER.WORLD</span>
          </div>
          <div className="flex gap-4">
            <a href="/leaderboard" className="px-4 py-2 text-gray-300 hover:text-green-400 transition-colors">
              Leaderboard
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-bold mb-3 bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 bg-clip-text text-transparent">
            SLITHER.WORLD
          </h1>
          <p className="text-lg text-gray-400">Snake Battle Royale on Solana</p>
        </div>

        {/* Player Setup Card */}
        <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-green-500/30 rounded-2xl p-6 mb-6 shadow-2xl">
          <h2 className="text-xl font-bold text-green-400 mb-4">Setup Your Player</h2>
          
          <div className="space-y-4">
            {/* Nickname */}
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">
                Nickname
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Enter your nickname..."
                maxLength={20}
                className="w-full px-4 py-3 bg-black/50 border-2 border-gray-700 rounded-xl text-white text-lg focus:outline-none focus:border-green-500 transition-all"
              />
            </div>
            
            {/* Wallet */}
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">
                Solana Wallet Address (for payouts)
              </label>
              <input
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="Paste your wallet address here..."
                className="w-full px-4 py-3 bg-black/50 border-2 border-gray-700 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-green-500 transition-all"
              />
              <p className="text-xs text-gray-500 mt-2">
                Open Phantom wallet → Settings → Copy your wallet address
              </p>
            </div>
          </div>
        </div>

        {/* Game Modes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Free Play */}
          <button
            onClick={() => handleJoinLobby('FREE')}
            disabled={!nickname.trim() || !walletAddress.trim()}
            className="group relative bg-gradient-to-br from-green-600 to-emerald-700 p-6 rounded-2xl border-2 border-green-400 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/50 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
          >
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">Free Play</h3>
              <div className="text-5xl font-black mb-3 text-yellow-300">FREE</div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between px-4">
                  <span>Players:</span>
                  <span className="font-bold">5</span>
                </div>
                <div className="flex justify-between px-4">
                  <span>Winner Gets:</span>
                  <span className="font-bold text-yellow-300">0.05 SOL</span>
                </div>
              </div>
            </div>
          </button>

          {/* Paid Game */}
          <button
            onClick={() => handleJoinLobby('PAID')}
            disabled={!nickname.trim() || !walletAddress.trim()}
            className="group relative bg-gradient-to-br from-purple-900 to-gray-900 p-6 rounded-2xl border-2 border-purple-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
          >
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">Paid Game</h3>
              <div className="text-5xl font-black mb-3 text-yellow-300">0.25 SOL</div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between px-4">
                  <span>Players:</span>
                  <span className="font-bold">10</span>
                </div>
                <div className="flex justify-between px-4">
                  <span>Winner Gets:</span>
                  <span className="font-bold text-yellow-300">2 SOL</span>
                </div>
              </div>
            </div>
          </button>
        </div>

        {/* How to Play */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-bold text-center mb-4 text-gray-300">How to Play</h3>
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <p className="text-gray-400 font-bold mb-1">Move</p>
              <p className="text-gray-500 text-xs">Mouse</p>
            </div>
            <div>
              <p className="text-gray-400 font-bold mb-1">Boost</p>
              <p className="text-gray-500 text-xs">Click/Space</p>
            </div>
            <div>
              <p className="text-gray-400 font-bold mb-1">Win</p>
              <p className="text-gray-500 text-xs">Last Alive</p>
            </div>
          </div>
        </div>

        {/* Contract Address */}
        <div className="bg-black/50 border border-gray-800 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-2 text-center">Contract Address</p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-2">
            <code className="text-xs text-green-400 font-mono break-all text-center">
              2C1m2VEM24pMvyjrCEg6jr3thVaQDRp332V9q7zApump
            </code>
            <button
              onClick={() => {
                navigator.clipboard.writeText('2C1m2VEM24pMvyjrCEg6jr3thVaQDRp332V9q7zApump')
                alert('Copied!')
              }}
              className="text-xs text-gray-400 hover:text-green-400 transition-colors whitespace-nowrap"
            >
              Copy
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
