import { NextRequest, NextResponse } from 'next/server'
import { validateSession } from '@/server/solana/auth'
import { db } from '@/server/db'
import { matchPlayers } from '@/server/db/schema'

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const wallet = await validateSession(token)
    if (!wallet) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }

    const { lobbyId } = await request.json()

    // Add player to free match
    await db.insert(matchPlayers).values({
      matchId: lobbyId,
      walletAddress: wallet,
      entryTxHash: 'FREE_ENTRY',
    })

    return NextResponse.json({ success: true, lobbyId })
  } catch (error) {
    console.error('Free lobby join error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
