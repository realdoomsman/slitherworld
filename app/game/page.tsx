'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import GameCanvas from '@/components/GameCanvas'

function GameContent() {
  const searchParams = useSearchParams()
  const lobbyId = searchParams.get('lobby')
  const nickname = searchParams.get('nickname') || localStorage.getItem('playerNickname') || 'Player'
  const walletAddress = searchParams.get('wallet') || ''

  if (!lobbyId) {
    return <div className="text-center p-8">No lobby specified</div>
  }

  if (!walletAddress) {
    return <div className="text-center p-8">No wallet address provided</div>
  }

  return <GameCanvas lobbyId={lobbyId} nickname={nickname} walletAddress={walletAddress} />
}

export default function GamePage() {
  return (
    <Suspense fallback={<div>Loading game...</div>}>
      <GameContent />
    </Suspense>
  )
}
