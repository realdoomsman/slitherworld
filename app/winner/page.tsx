'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

function WinnerContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [matchData, setMatchData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const matchId = searchParams.get('match')
    if (!matchId) {
      router.push('/')
      return
    }

    // Fetch match data
    fetch(`/api/match/${matchId}`)
      .then(res => res.json())
      .then(data => {
        setMatchData(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load match:', err)
        setLoading(false)
      })
  }, [])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Copied to clipboard!')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-green-400 text-xl">Loading match results...</p>
        </div>
      </div>
    )
  }

  if (!matchData || !matchData.winner) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-400 mb-4">Match Not Found</h1>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-green-600 hover:bg-green-500 rounded-lg font-bold"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
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
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 text-gray-300 hover:text-green-400 transition-colors"
          >
            ← Home
          </button>
        </div>
      </nav>

      {/* Winner Display */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Trophy Animation */}
        <div className="text-center mb-8">
          <div className="text-9xl mb-6 animate-bounce">🏆</div>
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent">
            WINNER!
          </h1>
        </div>

        {/* Winner Card */}
        <div className="bg-gradient-to-br from-yellow-900/30 to-black border-4 border-yellow-500 rounded-3xl p-8 mb-8 shadow-2xl shadow-yellow-500/50">
          <div className="text-center mb-6">
            <p className="text-gray-400 text-lg mb-2">Champion</p>
            <h2 className="text-5xl font-bold text-yellow-400 mb-4">
              Winner
            </h2>
            <div className="inline-block bg-yellow-500/20 border-2 border-yellow-500 rounded-xl px-6 py-3">
              <p className="text-sm text-gray-400 mb-1">Prize Won</p>
              <p className="text-4xl font-bold text-yellow-400">
                {matchData.winnerPayout} SOL
              </p>
            </div>
          </div>

          {/* Winner Wallet */}
          <div className="bg-black/50 border-2 border-yellow-500/30 rounded-xl p-6 mb-6">
            <p className="text-sm text-gray-400 mb-2">Winner's Wallet Address</p>
            <div className="flex items-center gap-3">
              <code className="flex-1 text-yellow-400 font-mono text-sm break-all bg-black/50 p-3 rounded-lg">
                {matchData.winner.walletAddress}
              </code>
              <button
                onClick={() => copyToClipboard(matchData.winner.walletAddress)}
                className="px-4 py-3 bg-yellow-600 hover:bg-yellow-500 rounded-lg font-bold whitespace-nowrap transition-colors"
              >
                📋 Copy
              </button>
            </div>
          </div>

          {/* Match Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-black/50 border border-yellow-500/30 rounded-xl p-4 text-center">
              <p className="text-gray-400 text-sm mb-1">Kills</p>
              <p className="text-2xl font-bold text-yellow-400">{matchData.winner.kills || 0}</p>
            </div>
            <div className="bg-black/50 border border-yellow-500/30 rounded-xl p-4 text-center">
              <p className="text-gray-400 text-sm mb-1">Final Length</p>
              <p className="text-2xl font-bold text-yellow-400">{Math.floor(matchData.winner.length || 0)}</p>
            </div>
            <div className="bg-black/50 border border-yellow-500/30 rounded-xl p-4 text-center">
              <p className="text-gray-400 text-sm mb-1">Players</p>
              <p className="text-2xl font-bold text-yellow-400">{matchData.totalPlayers || 0}</p>
            </div>
            <div className="bg-black/50 border border-yellow-500/30 rounded-xl p-4 text-center">
              <p className="text-gray-400 text-sm mb-1">Duration</p>
              <p className="text-2xl font-bold text-yellow-400">{matchData.duration || '0:00'}</p>
            </div>
          </div>
        </div>

        {/* Payment Instructions */}
        <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-green-500/30 rounded-2xl p-8 mb-6">
          <h3 className="text-2xl font-bold text-green-400 mb-4 flex items-center gap-2">
            <span>💰</span>
            <span>Send Prize Payment</span>
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-green-400 font-bold text-sm">1</span>
              </div>
              <div>
                <p className="text-white font-bold mb-1">Copy Winner's Wallet Address</p>
                <p className="text-gray-400 text-sm">Use the copy button above</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-green-400 font-bold text-sm">2</span>
              </div>
              <div>
                <p className="text-white font-bold mb-1">Open Phantom Wallet</p>
                <p className="text-gray-400 text-sm">Or any Solana wallet</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-green-400 font-bold text-sm">3</span>
              </div>
              <div>
                <p className="text-white font-bold mb-1">Send {matchData.winnerPayout} SOL</p>
                <p className="text-gray-400 text-sm">To the winner's address</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => router.push('/')}
            className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-xl font-bold text-xl transition-all"
          >
            🎮 Play Again
          </button>
          <button
            onClick={() => router.push('/leaderboard')}
            className="px-8 py-4 bg-gray-800 hover:bg-gray-700 border-2 border-gray-700 rounded-xl font-bold text-xl transition-all"
          >
            🏆 Leaderboard
          </button>
        </div>
      </div>
    </div>
  )
}

export default function WinnerPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <WinnerContent />
    </Suspense>
  )
}
