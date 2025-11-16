'use client'

import { useEffect, useState } from 'react'

export default function LiveGamesPage() {
  const [activeGames, setActiveGames] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchActiveGames()
    const interval = setInterval(fetchActiveGames, 5000) // Refresh every 5s
    return () => clearInterval(interval)
  }, [])

  const fetchActiveGames = async () => {
    try {
      const res = await fetch('/api/lobbies/active')
      const data = await res.json()
      setActiveGames(data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching active games:', error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">👁️ Live Games</h1>
            <p className="text-gray-400">Watch active matches in real-time</p>
          </div>
          <a href="/" className="text-green-400 hover:text-green-300">← Back to Home</a>
        </div>

        {loading ? (
          <div className="text-center text-gray-400">Loading live games...</div>
        ) : activeGames.length === 0 ? (
          <div className="text-center">
            <div className="bg-gray-900 border-2 border-gray-700 rounded-lg p-12">
              <p className="text-2xl text-gray-400 mb-4">No active games right now</p>
              <p className="text-gray-500 mb-6">Be the first to start a match!</p>
              <a
                href="/"
                className="px-8 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-bold inline-block"
              >
                Start a Game
              </a>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeGames.map((game: any) => (
              <div
                key={game.id}
                className="bg-gray-900 border-2 border-purple-500 rounded-lg p-6 hover:border-purple-400 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">
                      {game.status === 'active' ? '🔴' : '⏳'}
                    </span>
                    <span className="text-sm font-bold text-purple-400">
                      {game.status === 'active' ? 'LIVE' : 'WAITING'}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {game.id.slice(0, 8)}
                  </span>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-400 mb-1">Entry Fee</p>
                  <p className="text-2xl font-bold text-green-400">
                    {parseFloat(game.entryFee).toFixed(2)} SOL
                  </p>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-400 mb-1">Pot Size</p>
                  <p className="text-xl font-bold text-yellow-400">
                    {parseFloat(game.potAmount).toFixed(2)} SOL
                  </p>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-400 mb-1">Lobby Type</p>
                  <p className="text-lg font-bold text-white uppercase">
                    {game.lobbyType}
                  </p>
                </div>

                {game.status === 'active' && (
                  <div className="mb-4 p-2 bg-red-900 bg-opacity-30 rounded">
                    <p className="text-xs text-red-400 text-center font-bold">
                      🔥 GAME IN PROGRESS
                    </p>
                  </div>
                )}

                <a
                  href={`/spectate?lobby=${game.id}`}
                  className="block w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold text-center transition-colors"
                >
                  👁️ Spectate
                </a>

                <p className="text-xs text-gray-500 text-center mt-2">
                  Started {new Date(game.startedAt).toLocaleTimeString()}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Info Box */}
        <div className="mt-12 bg-gray-900 border-2 border-blue-500 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">🎮 Spectator Mode</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-bold text-blue-400 mb-2">Features</h3>
              <ul className="space-y-2 text-gray-300">
                <li>✅ Watch any game for free</li>
                <li>✅ No wallet required</li>
                <li>✅ Real-time 60fps action</li>
                <li>✅ Follow leader or free camera</li>
                <li>✅ Live leaderboard</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold text-purple-400 mb-2">Camera Modes</h3>
              <ul className="space-y-2 text-gray-300">
                <li>🎯 <strong>Follow Leader:</strong> Auto-tracks longest snake</li>
                <li>🖱️ <strong>Free Camera:</strong> Click and drag to explore</li>
                <li>👀 Watch kills in real-time</li>
                <li>📊 See pot size and player count</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
