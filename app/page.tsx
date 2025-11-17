'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import bs58 from 'bs58'

export default function Home() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [nickname, setNickname] = useState('')

  useEffect(() => {
    setMounted(true)
    const savedNickname = localStorage.getItem('playerNickname')
    if (savedNickname) {
      setNickname(savedNickname)
    }
  }, [])

  const handleJoinLobby = (type: string) => {
    if (!nickname.trim()) {
      alert('Please enter a nickname first!')
      return
    }
    if (nickname.trim().length < 2 || nickname.trim().length > 20) {
      alert('Nickname must be 2-20 characters!')
      return
    }
    localStorage.setItem('playerNickname', nickname.trim())
    router.push(`/lobby?type=${type}`)
  }

  const lobbyTypes = [
    { name: 'Free Play', fee: 0, type: 'FREE', prize: 0.05, players: 5 },
    { name: 'Paid Game', fee: 0.25, type: 'PAID', players: 10 },
  ]



  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Subtle Background */}
      <div className="absolute inset-0 grid-background opacity-10"></div>

      {/* Navigation Bar */}
      <nav className="relative z-10 flex justify-between items-center p-4 md:p-6 border-b border-green-500/20 bg-gray-900/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <img src="/icon.svg" alt="Slither.World" className="w-10 h-10" />
          <span className="text-xl md:text-2xl font-bold text-green-400">SLITHER.WORLD</span>
        </div>
        <div className="hidden md:flex gap-6 items-center mr-4">
          <a href="/" className="text-gray-300 hover:text-green-400 transition-colors">Play</a>
          <a href="/leaderboard" className="text-gray-300 hover:text-green-400 transition-colors">Leaderboard</a>
          <a href="/live" className="text-gray-300 hover:text-purple-400 transition-colors">Watch Live</a>
        </div>
        <div className="flex items-center gap-3">
          {/* No wallet needed */}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 md:px-8 py-12 md:py-20">
        <div className="mb-6 relative">
          <div className="absolute inset-0 bg-green-500/20 blur-3xl animate-pulse"></div>
          <h1 className="text-5xl md:text-7xl font-bold text-center mb-4 relative bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 bg-clip-text text-transparent animate-pulse">
            SLITHER.WORLD
          </h1>
        </div>
        <p className="text-xl md:text-2xl text-center mb-3 text-gray-200 font-semibold">
          Multiplayer Snake Battles on Solana
        </p>
        <div className="flex items-center gap-3 mb-8">
          <div className="px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full">
            <span className="text-green-400 font-bold">80% Winner</span>
          </div>
          <div className="px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full">
            <span className="text-green-400 font-bold">15% Buybacks</span>
          </div>
          <div className="px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full">
            <span className="text-green-400 font-bold">Pure Skill</span>
          </div>
        </div>

        {/* Nickname Input */}
        <div className="w-full max-w-md mb-12">
          <div className="bg-gray-900/90 p-6 rounded-2xl border-2 border-green-500/30">
            <h3 className="text-xl font-bold text-center mb-4 text-green-400">Enter Nickname</h3>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Your nickname..."
              maxLength={20}
              className="w-full px-4 py-3 bg-black/50 border-2 border-green-500/30 rounded-xl text-white text-center focus:outline-none focus:border-green-500 transition-colors"
            />
            <p className="text-xs text-gray-500 text-center mt-2">2-20 characters</p>
          </div>
        </div>

        {/* Game Modes */}
        <div className="w-full max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">Select Game Mode</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lobbyTypes.map((lobby) => (
              <button
                key={lobby.type}
                onClick={() => handleJoinLobby(lobby.type)}
                disabled={!nickname.trim()}
                className={`${
                  lobby.fee === 0
                    ? 'bg-gradient-to-br from-green-600/80 to-emerald-600/80 border border-green-500/50 shadow-md shadow-green-500/30'
                    : 'bg-gradient-to-br from-gray-800 to-gray-900 border border-green-500/30 hover:shadow-md hover:shadow-green-500/20'
                } p-6 rounded-xl hover:scale-105 hover:border-green-400 transition-all text-left relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <div className="flex justify-between items-start mb-3 relative z-10">
                  <div>
                    <h3 className="text-xl font-bold mb-1 text-white">
                      {lobby.name}
                    </h3>
                    {lobby.fee === 0 ? (
                      <p className="text-3xl font-bold text-white">FREE</p>
                    ) : (
                      <p className="text-3xl font-bold text-white">{lobby.fee} SOL</p>
                    )}
                  </div>
                </div>

                <div className="space-y-1 text-sm text-gray-200">
                  <div className="flex justify-between">
                    <span>Players</span>
                    <span className="font-bold">{lobby.players}</span>
                  </div>
                  {lobby.prize ? (
                    <div className="flex justify-between">
                      <span>Winner Gets</span>
                      <span className="font-bold text-yellow-400">{lobby.prize} SOL</span>
                    </div>
                  ) : (
                    <div className="flex justify-between">
                      <span>Winner Takes</span>
                      <span className="font-bold">80%</span>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* How to Play */}
        <div className="w-full max-w-4xl mt-16 px-4">
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 bg-gray-900/50 rounded-lg border border-green-500/20 hover:border-green-500/50 hover:bg-gray-900/70 transition-all hover:scale-105">
              <div className="w-12 h-12 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center mb-4 mx-auto">
                <span className="text-green-400 font-bold">1</span>
              </div>
              <h3 className="text-lg font-bold mb-2 text-white text-center">Enter Nickname</h3>
              <p className="text-sm text-gray-400 text-center">Choose your player name (2-20 characters)</p>
            </div>
            <div className="p-6 bg-gray-900/50 rounded-lg border border-green-500/20">
              <div className="w-12 h-12 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center mb-4 mx-auto">
                <span className="text-green-400 font-bold">2</span>
              </div>
              <h3 className="text-lg font-bold mb-2 text-white text-center">Send Payment</h3>
              <p className="text-sm text-gray-400 text-center">Send SOL to our wallet with your lobby ID</p>
            </div>
            <div className="p-6 bg-gray-900/50 rounded-lg border border-green-500/20">
              <div className="w-12 h-12 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center mb-4 mx-auto">
                <span className="text-green-400 font-bold">3</span>
              </div>
              <h3 className="text-lg font-bold mb-2 text-white text-center">Win & Earn</h3>
              <p className="text-sm text-gray-400 text-center">Last snake alive wins 80% of the pot!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 border-t border-gray-800 py-6 text-center text-gray-500 text-sm bg-gray-900/50">
        <p>Powered by Solana</p>
      </div>
    </div>
  )
}
