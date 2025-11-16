'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import SpectatorCanvas from '@/components/SpectatorCanvas'

function SpectateContent() {
  const searchParams = useSearchParams()
  const lobbyId = searchParams.get('lobby')

  if (!lobbyId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Spectator Mode</h1>
          <p className="text-gray-400">No lobby specified</p>
          <a href="/" className="text-green-400 hover:text-green-300 mt-4 inline-block">
            ← Back to Home
          </a>
        </div>
      </div>
    )
  }

  return <SpectatorCanvas lobbyId={lobbyId} />
}

export default function SpectatePage() {
  return (
    <Suspense fallback={<div>Loading spectator mode...</div>}>
      <SpectateContent />
    </Suspense>
  )
}
