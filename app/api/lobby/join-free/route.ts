import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/server/db'
import { matchPlayers } from '@/server/db/schema'

export async function POST(request: NextRequest) {
  try {
    const { lobbyId, walletAddress } = await request.json()

    if (!lobbyId || !walletAddress) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Create match_players entry for free lobby
    await db.insert(matchPlayers).values({
      matchId: lobbyId,
      walletAddress: walletAddress.trim(),
      entryTxHash: 'FREE_ENTRY',
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Join free lobby error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
