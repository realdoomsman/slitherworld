import { NextRequest, NextResponse } from 'next/server'
import { validateSession } from '@/server/solana/auth'
import { db } from '@/server/db'
import { matches, matchPlayers } from '@/server/db/schema'
import { eq, desc } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const wallet = await validateSession(token)
    if (!wallet) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }

    // Get player's matches
    const playerMatches = await db
      .select({
        id: matchPlayers.matchId,
        placement: matchPlayers.placement,
        finalLength: matchPlayers.finalLength,
        killCount: matchPlayers.killCount,
        survivalTime: matchPlayers.survivalTime,
        endedAt: matches.endedAt,
        payout: matches.winnerPayout,
        isWinner: matches.winnerAddress
      })
      .from(matchPlayers)
      .leftJoin(matches, eq(matchPlayers.matchId, matches.id))
      .where(eq(matchPlayers.walletAddress, wallet))
      .orderBy(desc(matches.endedAt))
      .limit(20)

    const formattedMatches = playerMatches.map(m => ({
      id: m.id,
      placement: m.placement,
      finalLength: m.finalLength,
      killCount: m.killCount,
      survivalTime: m.survivalTime,
      endedAt: m.endedAt,
      payout: m.isWinner === wallet ? parseFloat(m.payout || '0') : 0
    }))

    return NextResponse.json(formattedMatches)
  } catch (error) {
    console.error('Matches error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
