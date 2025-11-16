'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import bs58 from 'bs58'

export default function Home() {
  const { publicKey, signMessage, disconnect } = useWallet()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [sessionToken, setSessionToken] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    const token = localStorage.getItem('sessionToken')
    if (token && publicKey) {
      setSessionToken(token)
      setIsAuthenticated(true)
    }
  }, [publicKey])

  // Reset auth when wallet disconnects
  useEffect(() => {
    if (!publicKey) {
      setIsAuthenticated(false)
      setSessionToken(null)
      localStorage.removeItem('sessionToken')
    }
  }, [publicKey])

  const handleAuthenticate = async () => {
    if (!publicKey || !signMessage || isAuthenticating) return

    setIsAuthenticating(true)
    try {
      console.log('Starting authentication for:', publicKey.toString())
      
      // Get challenge
      const challengeRes = await fetch('/api/auth/challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: publicKey.toString() }),
      })
      const { message } = await challengeRes.json()
      console.log('Got challenge:', message)

      // Sign message
      const messageBytes = new TextEncoder().encode(message)
      const signature = await signMessage(messageBytes)
      const signatureBase58 = bs58.encode(signature)
      console.log('Signed message')

      // Verify signature
      const verifyRes = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: publicKey.toString(),
          signature: signatureBase58,
          message,
        }),
      })

      const verifyData = await verifyRes.json()
      console.log('Verify response:', verifyData)
      
      if (verifyData.error) {
        alert('Authentication failed: ' + verifyData.error)
        setIsAuthenticating(false)
        return
      }

      const { token } = verifyData
      localStorage.setItem('sessionToken', token)
      setSessionToken(token)
      setIsAuthenticated(true)
      console.log('Authentication successful!')
    } catch (error) {
      console.error('Authentication error:', error)
      alert('Authentication failed. Please try again.')
    } finally {
      setIsAuthenticating(false)
    }
  }

  const handleDisconnect = async () => {
    await disconnect()
    setIsAuthenticated(false)
    setSessionToken(null)
    localStorage.removeItem('sessionToken')
  }

  const lobbyTypes = [
    { name: 'Free Play', fee: 0, type: 'FREE', prize: 0.05 },
    { name: 'Micro', fee: 0.05, type: 'MICRO' },
    { name: 'Small', fee: 0.25, type: 'SMALL' },
    { name: 'Medium', fee: 0.5, type: 'MEDIUM' },
    { name: 'Large', fee: 1, type: 'LARGE' },
    { name: 'Whale', fee: 5, type: 'WHALE' },
  ]

  const handleJoinLobby = (type: string) => {
    router.push(`/lobby?type=${type}`)
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Subtle Background */}
      <div className="absolute inset-0 grid-background opacity-10"></div>

      {/* Navigation Bar */}
      <nav className="relative z-10 flex justify-between items-center p-4 md:p-6 border-b border-green-500/20 bg-gray-900/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
          </div>
          <span className="text-xl md:text-2xl font-bold text-green-400">SLITHER.WORLD</span>
        </div>
        <div className="hidden md:flex gap-6 items-center mr-4">
          <a href="/" className="text-gray-300 hover:text-green-400 transition-colors">Play</a>
          <a href="/leaderboard" className="text-gray-300 hover:text-green-400 transition-colors">Leaderboard</a>
          <a href="/live" className="text-gray-300 hover:text-purple-400 transition-colors">Watch Live</a>
          {isAuthenticated && (
            <a href="/profile" className="text-gray-300 hover:text-green-400 transition-colors">Profile</a>
          )}
        </div>
        <div className="flex items-center gap-3">
          {mounted && (
            <>
              <WalletMultiButton className="!bg-green-600 hover:!bg-green-700 !rounded-lg !px-4 !py-2 !font-semibold !text-sm !transition-colors" />
              {publicKey && isAuthenticated && (
                <button
                  onClick={handleDisconnect}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold text-sm transition-colors"
                >
                  Disconnect
                </button>
              )}
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 md:px-8 py-12 md:py-20">
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-4 text-green-400">
          SLITHER.WORLD
        </h1>
        <p className="text-lg md:text-xl text-center mb-3 text-gray-300">
          Multiplayer Snake Battles on Solana
        </p>
        <p className="text-sm md:text-base text-center mb-8 text-gray-500 max-w-2xl">
          Winner takes 80% • 15% Buybacks • Pure Skill
        </p>

        {/* Auth Flow */}
        {!mounted ? (
          <div className="h-12"></div>
        ) : !publicKey ? (
          <div className="text-center mb-12">
            <p className="text-gray-300 mb-4">Connect your wallet to start playing</p>
            <WalletMultiButton className="!bg-green-600 hover:!bg-green-700 !rounded-lg !px-8 !py-3 !font-bold !text-lg" />
          </div>
        ) : !isAuthenticated ? (
          <div className="text-center mb-12">
            <p className="text-gray-300 mb-4">Sign a message to authenticate</p>
            <button
              onClick={handleAuthenticate}
              disabled={isAuthenticating}
              className="px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded-lg font-bold text-lg transition-colors"
            >
              {isAuthenticating ? 'Signing...' : 'Sign Message'}
            </button>
          </div>
        ) : null}

        {/* Quick Actions */}
        {!isAuthenticated && (
          <div className="flex gap-4 mb-12">
            <a
              href="/live"
              className="px-6 py-2 bg-green-600/20 hover:bg-green-600/30 border border-green-500/50 rounded-lg font-semibold transition-colors text-green-400"
            >
              Watch Live
            </a>
            <a
              href="/leaderboard"
              className="px-6 py-2 bg-green-600/20 hover:bg-green-600/30 border border-green-500/50 rounded-lg font-semibold transition-colors text-green-400"
            >
              Leaderboard
            </a>
          </div>
        )}

        {/* Game Modes */}
        {isAuthenticated && (
          <div className="w-full max-w-5xl">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-white">Select Game Mode</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lobbyTypes.map((lobby) => (
                <button
                  key={lobby.type}
                  onClick={() => handleJoinLobby(lobby.type)}
                  className={`${
                    lobby.type === 'WHALE' 
                      ? 'bg-gradient-to-br from-green-600 to-emerald-700 md:col-span-2 lg:col-span-3 border-2 border-green-400' 
                      : lobby.fee === 0
                      ? 'bg-gradient-to-br from-green-600/80 to-emerald-600/80 border border-green-500/50'
                      : 'bg-gradient-to-br from-gray-800 to-gray-900 border border-green-500/30'
                  } p-6 rounded-xl hover:scale-105 hover:border-green-400 transition-all text-left`}
                >
                  <div className="flex justify-between items-start mb-3">
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
                    {lobby.type === 'WHALE' && (
                      <span className="px-2 py-1 bg-green-500 text-black rounded text-xs font-bold">
                        WHALE
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 text-sm text-gray-200">
                    {lobby.prize ? (
                      <div className="flex justify-between">
                        <span>Prize Pool</span>
                        <span className="font-bold">{lobby.prize} SOL</span>
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
        )}

        {/* How to Play */}
        {!isAuthenticated && (
          <div className="w-full max-w-4xl mt-16 px-4">
            <h2 className="text-2xl font-bold text-center mb-8 text-green-400">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="p-6 bg-gray-900/50 rounded-lg border border-green-500/20">
                <div className="w-12 h-12 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center mb-4 mx-auto">
                  <span className="text-green-400 font-bold">1</span>
                </div>
                <h3 className="text-lg font-bold mb-2 text-white text-center">Connect Wallet</h3>
                <p className="text-sm text-gray-400 text-center">Connect your Solana wallet and sign to authenticate</p>
              </div>
              <div className="p-6 bg-gray-900/50 rounded-lg border border-green-500/20">
                <div className="w-12 h-12 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center mb-4 mx-auto">
                  <span className="text-green-400 font-bold">2</span>
                </div>
                <h3 className="text-lg font-bold mb-2 text-white text-center">Choose Lobby</h3>
                <p className="text-sm text-gray-400 text-center">Select free or paid lobby, entry fee goes to pot</p>
              </div>
              <div className="p-6 bg-gray-900/50 rounded-lg border border-green-500/20">
                <div className="w-12 h-12 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center mb-4 mx-auto">
                  <span className="text-green-400 font-bold">3</span>
                </div>
                <h3 className="text-lg font-bold mb-2 text-white text-center">Win & Earn</h3>
                <p className="text-sm text-gray-400 text-center">Last snake alive wins 80% of the pot instantly</p>
              </div>
            </div>

            {/* Token Info */}
            <div className="p-6 bg-gray-900/50 rounded-lg border border-green-500/20">
              <h3 className="text-lg font-bold mb-4 text-green-400 text-center">Token Contract</h3>
              <div className="flex items-center justify-center gap-3">
                <code className="px-4 py-2 bg-black/50 rounded text-green-400 text-sm font-mono">
                  Coming Soon
                </code>
                <button className="px-4 py-2 bg-green-600/20 hover:bg-green-600/30 border border-green-500/50 rounded text-green-400 text-sm font-semibold transition-colors">
                  Copy
                </button>
              </div>
              <p className="text-xs text-gray-500 text-center mt-3">15% of each pot goes to automatic token buybacks</p>
            </div>
          </div>
        )}

        {mounted && process.env.NEXT_PUBLIC_DEV_MODE === 'true' && (
          <div className="mt-8 px-6 py-3 bg-yellow-900/30 border border-yellow-500 rounded-lg">
            <p className="text-yellow-400 font-semibold text-sm">DEV MODE: Games start with 1 player</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="relative z-10 border-t border-gray-800 py-6 text-center text-gray-500 text-sm bg-gray-900/50">
        <p>Powered by Solana</p>
      </div>
    </div>
  )
}
