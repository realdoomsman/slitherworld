'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function StatsPage() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats')
      const data = await res.json()
      setStats(data)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold neon-text">Game Statistics</h1>
          <Link href="/" className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg">
            Back to Home
          </Link>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-900 border-2 border-green-500 rounded-lg p-6">
            <h3 className="text-gray-400 text-sm mb-2">Total Matches</h3>
            <p className="text-4xl font-bold text-green-400">{stats?.totalMatches || 0}</p>
          </div>
          <div className="bg-gray-900 border-2 border-green-500 rounded-lg p-6">
            <h3 className="text-gray-400 text-sm mb-2">Total Volume</h3>
            <p className="text-4xl font-bold text-green-400">${stats?.totalVolume || 0}</p>
          </div>
        </div>

        {/* Recent Winners */}
        <div className="bg-gray-900 border-2 border-green-500 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Recent Winners</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-2">Wallet</th>
                  <th className="text-right py-2">Payout</th>
                  <th className="text-right py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentWinners?.map((winner: any, idx: number) => (
                  <tr key={idx} className="border-b border-gray-800">
                    <td className="py-3 font-mono text-sm">
                      {winner.walletAddress?.slice(0, 8)}...{winner.walletAddress?.slice(-6)}
                    </td>
                    <td className="text-right text-green-400">${winner.payout}</td>
                    <td className="text-right text-gray-400 text-sm">
                      {new Date(winner.endedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Players */}
        <div className="bg-gray-900 border-2 border-green-500 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Top Players (By Kills)</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-2">Rank</th>
                  <th className="text-left py-2">Wallet</th>
                  <th className="text-right py-2">Total Kills</th>
                  <th className="text-right py-2">Matches</th>
                </tr>
              </thead>
              <tbody>
                {stats?.topPlayers?.map((player: any, idx: number) => (
                  <tr key={idx} className="border-b border-gray-800">
                    <td className="py-3 font-bold text-green-400">#{idx + 1}</td>
                    <td className="font-mono text-sm">
                      {player.walletAddress?.slice(0, 8)}...{player.walletAddress?.slice(-6)}
                    </td>
                    <td className="text-right">{player.totalKills}</td>
                    <td className="text-right text-gray-400">{player.totalMatches}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
