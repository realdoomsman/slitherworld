'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import GameCanvas from '@/components/GameCanvas'

function GameContent() {
  const searchParams = useSearchParams()
  const lobbyId = searchParams.get('lobby')

  if (!lobbyId) {
    return <div className="text-center p-8">No lobby specified</div>
  }

  return <GameCanvas lobbyId={lobbyId} />
}

export default function GamePage() {
  return (
    <Suspense fallback={<div>Loading game...</div>}>
      <GameContent />
    </Suspense>
  )
}
