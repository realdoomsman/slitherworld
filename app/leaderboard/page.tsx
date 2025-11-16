'use client'

import { useEffect, useState } from 'react'

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'earnings' | 'wins' | 'length'>('earnings')

  useEffect(() => {
    fetchLeaderboard()
  }, [tab])

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch(`/api/leaderboard?type=${tab}`)
      const data = await res.json()
      setLeaderboard(data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-background opacity-20"></div>

      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center p-6 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <span className="text-4xl">🐍</span>
          <span className="text-2xl font-bold neon-text">SLITHER.WORLD</span>
        </div>
        <a href="/" className="neon-button-outline px-6 py-2 rounded-lg font-bold smooth-transition">
          ← Back to Game
        </a>
      </nav>

      <div className="relative z-10 max-w-6xl mx-auto p-8">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4 neon-text">🏆 LEADERBOARD</h1>
          <p className="text-xl text-gray-400">Top players across all game modes</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 justify-center">
          <button
            onClick={() => setTab('earnings')}
            className={`px-8 py-3 rounded-xl font-bold smooth-transition ${
              tab === 'earnings'
                ? 'neon-button'
                : 'neon-button-outline'
            }`}
          >
            💰 Top Earnings
          </button>
          <button
            onClick={() => setTab('wins')}
            className={`px-8 py-3 rounded-xl font-bold smooth-transition ${
              tab === 'wins'
                ? 'neon-button'
                : 'neon-button-outline'
            }`}
          >
            🏆 Most Wins
          </button>
          <button
            onClick={() => setTab('length')}
            className={`px-8 py-3 rounded-xl font-bold smooth-transition ${
              tab === 'length'
                ? 'neon-button'
                : 'neon-button-outline'
            }`}
          >
            🐍 Longest Snake
          </button>
        </div>

        {/* Leaderboard */}
        <div className="neon-border-green bg-black bg-opacity-60 backdrop-blur-sm rounded-2xl p-8">
          {loading ? (
            <p className="text-center text-gray-400 py-12">Loading champions...</p>
          ) : leaderboard.length === 0 ? (
            <p className="text-center text-gray-400 py-12">No data yet. Be the first champion!</p>
          ) : (
            <div className="space-y-3">
              {leaderboard.map((player: any, index: number) => (
                <div
                  key={player.wallet}
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    index === 0
                      ? 'bg-yellow-900 border-2 border-yellow-500'
                      : index === 1
                      ? 'bg-gray-700 border-2 border-gray-400'
                      : index === 2
                      ? 'bg-orange-900 border-2 border-orange-600'
                      : 'bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-bold w-12 text-center">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                    </span>
                    <div>
                      <p className="font-bold text-lg">
                        {player.wallet.slice(0, 4)}...{player.wallet.slice(-4)}
                      </p>
                      <p className="text-sm text-gray-400">
                        {player.matches} matches played
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {tab === 'earnings' && (
                      <p className="text-2xl font-bold text-green-400">
                        {player.value} SOL
                      </p>
                    )}
                    {tab === 'wins' && (
                      <p className="text-2xl font-bold text-yellow-400">
                        {player.value} wins
                      </p>
                    )}
                    {tab === 'length' && (
                      <p className="text-2xl font-bold text-purple-400">
                        {player.value} length
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
