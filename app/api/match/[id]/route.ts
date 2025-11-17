import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/server/db'
import { matches, matchPlayers } from '@/server/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const matchId = params.id

    // Fetch match data
    const matchResult = await db
      .select()
      .from(matches)
      .where(eq(matches.id, matchId))
      .limit(1)

    if (matchResult.length === 0) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 })
    }

    const match = matchResult[0]

    // Fetch all players in the match
    const players = await db
      .select()
      .from(matchPlayers)
      .where(eq(matchPlayers.matchId, matchId))

    // Find winner
    const winner = players.find(p => p.playerId === match.winnerId)

    if (!winner) {
      return NextResponse.json({ error: 'Winner not found' }, { status: 404 })
    }

    // Calculate duration
    const duration = match.endedAt && match.startedAt
      ? Math.floor((match.endedAt.getTime() - match.startedAt.getTime()) / 1000)
      : 0
    
    const minutes = Math.floor(duration / 60)
    const seconds = duration % 60
    const durationStr = `${minutes}:${seconds.toString().padStart(2, '0')}`

    return NextResponse.json({
      matchId: match.id,
      lobbyType: match.lobbyType,
      status: match.status,
      winner: {
        playerId: winner.playerId,
        nickname: winner.nickname,
        walletAddress: winner.walletAddress,
        kills: winner.kills || 0,
        length: winner.finalLength || 0,
      },
      winnerPayout: parseFloat(match.winnerPayout || '0'),
      totalPlayers: players.length,
      duration: durationStr,
      startedAt: match.startedAt,
      endedAt: match.endedAt,
    })
  } catch (error) {
    console.error('Match fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
