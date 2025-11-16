'use client'

import { useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

export default function ProfilePage() {
  const { publicKey } = useWallet()
  const [stats, setStats] = useState<any>(null)
  const [matches, setMatches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (publicKey) {
      fetchPlayerData()
    }
  }, [publicKey])

  const fetchPlayerData = async () => {
    try {
      const token = localStorage.getItem('sessionToken')
      
      // Fetch player stats
      const statsRes = await fetch('/api/player/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const statsData = await statsRes.json()
      setStats(statsData)

      // Fetch match history
      const matchesRes = await fetch('/api/player/matches', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const matchesData = await matchesRes.json()
      setMatches(matchesData)
      
      setLoading(false)
    } catch (error) {
      console.error('Error fetching player data:', error)
      setLoading(false)
    }
  }

  if (!publicKey) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-8">Player Profile</h1>
          <p className="text-gray-400 mb-8">Connect your wallet to view your profile</p>
          <WalletMultiButton />
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Player Profile</h1>
          <a href="/" className="text-green-400 hover:text-green-300">← Back to Game</a>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900 border-2 border-green-500 rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-2">Total Matches</p>
            <p className="text-4xl font-bold text-green-400">{stats?.totalMatches || 0}</p>
          </div>
          <div className="bg-gray-900 border-2 border-yellow-500 rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-2">Wins</p>
            <p className="text-4xl font-bold text-yellow-400">{stats?.wins || 0}</p>
          </div>
          <div className="bg-gray-900 border-2 border-blue-500 rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-2">Win Rate</p>
            <p className="text-4xl font-bold text-blue-400">
              {stats?.totalMatches > 0 ? ((stats.wins / stats.totalMatches) * 100).toFixed(1) : 0}%
            </p>
          </div>
          <div className="bg-gray-900 border-2 border-purple-500 rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-2">Total Earnings</p>
            <p className="text-4xl font-bold text-purple-400">{stats?.totalEarnings || 0} SOL</p>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="bg-gray-900 border-2 border-gray-700 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-gray-400 text-sm">Longest Snake</p>
              <p className="text-2xl font-bold text-green-400">{stats?.longestLength || 0}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Kills</p>
              <p className="text-2xl font-bold text-red-400">{stats?.totalKills || 0}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Avg Placement</p>
              <p className="text-2xl font-bold text-blue-400">{stats?.avgPlacement?.toFixed(1) || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Playtime</p>
              <p className="text-2xl font-bold text-purple-400">{stats?.totalPlaytime || 0}m</p>
            </div>
          </div>
        </div>

        {/* Match History */}
        <div className="bg-gray-900 border-2 border-gray-700 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Recent Matches</h2>
          {matches.length === 0 ? (
            <p className="text-gray-400">No matches played yet</p>
          ) : (
            <div className="space-y-4">
              {matches.map((match: any) => (
                <div key={match.id} className="bg-gray-800 rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <p className="font-bold">
                      {match.placement === 1 ? '🏆 Victory' : `#${match.placement} Place`}
                    </p>
                    <p className="text-sm text-gray-400">
                      {new Date(match.endedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-400">
                      {match.payout > 0 ? `+${match.payout} SOL` : '-'}
                    </p>
                    <p className="text-sm text-gray-400">
                      Length: {match.finalLength} • Kills: {match.killCount}
                    </p>
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
