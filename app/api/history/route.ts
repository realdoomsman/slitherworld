import { NextRequest, NextResponse } from 'next/server'
import { validateSession } from '@/server/solana/auth'
import { db } from '@/server/db'
import { matchPlayers, matches } from '@/server/db/schema'
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

    // Get player's match history
    const playerMatches = await db
      .select({
        id: matches.id,
        lobbyType: matches.lobbyType,
        entryFee: matches.entryFee,
        finalLength: matchPlayers.finalLength,
        killCount: matchPlayers.killCount,
        survivalTime: matchPlayers.survivalTime,
        placement: matchPlayers.placement,
        joinedAt: matchPlayers.joinedAt,
        entryTxHash: matchPlayers.entryTxHash,
        payout: matches.winnerPayout,
        isWinner: matches.winnerAddress,
      })
      .from(matchPlayers)
      .innerJoin(matches, eq(matchPlayers.matchId, matches.id))
      .where(eq(matchPlayers.walletAddress, wallet))
      .orderBy(desc(matchPlayers.joinedAt))
      .limit(50)

    return NextResponse.json({
      matches: playerMatches.map(m => ({
        ...m,
        payout: m.isWinner === wallet ? m.payout : null,
      })),
    })
  } catch (error) {
    console.error('History fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
