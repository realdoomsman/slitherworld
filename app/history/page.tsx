'use client'

import { useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import Link from 'next/link'

export default function HistoryPage() {
  const { publicKey } = useWallet()
  const [matches, setMatches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (publicKey) {
      fetchHistory()
    }
  }, [publicKey])

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('sessionToken')
      const res = await fetch('/api/history', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      const data = await res.json()
      setMatches(data.matches || [])
    } catch (error) {
      console.error('Failed to fetch history:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!publicKey) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">Please connect your wallet</p>
          <Link href="/" className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg">
            Go Home
          </Link>
        </div>
      </div>
    )
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
          <h1 className="text-4xl font-bold neon-text">Match History</h1>
          <Link href="/" className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg">
            Back to Home
          </Link>
        </div>

        {matches.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-400">No matches played yet</p>
            <Link href="/" className="mt-4 inline-block px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg">
              Play Your First Game
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {matches.map((match: any) => (
              <div
                key={match.id}
                className="bg-gray-900 border-2 border-green-500 rounded-lg p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold">
                      {match.lobbyType} - ${match.entryFee}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {new Date(match.joinedAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    {match.placement === 1 ? (
                      <span className="px-4 py-2 bg-green-600 rounded-lg font-bold">
                        🏆 WINNER
                      </span>
                    ) : (
                      <span className="px-4 py-2 bg-gray-700 rounded-lg">
                        #{match.placement}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Final Length</p>
                    <p className="text-2xl font-bold text-green-400">{match.finalLength}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Kills</p>
                    <p className="text-2xl font-bold text-red-400">{match.killCount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Survival Time</p>
                    <p className="text-2xl font-bold">{match.survivalTime}s</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Payout</p>
                    <p className="text-2xl font-bold text-green-400">
                      {match.payout ? `$${match.payout}` : '-'}
                    </p>
                  </div>
                </div>

                {match.entryTxHash && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <a
                      href={`https://solscan.io/tx/${match.entryTxHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-green-400 hover:text-green-300"
                    >
                      View Entry Transaction →
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
