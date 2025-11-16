import { NextResponse } from 'next/server'
import { db } from '@/server/db'
import { matches, matchPlayers } from '@/server/db/schema'
import { sql } from 'drizzle-orm'

export async function GET() {
  try {
    // Get global statistics
    const [matchStats] = await db
      .select({
        totalMatches: sql<number>`count(*)`,
        totalPot: sql<number>`sum(cast(${matches.potAmount} as decimal))`,
      })
      .from(matches)

    const [playerStats] = await db
      .select({
        totalPlayers: sql<number>`count(distinct ${matchPlayers.walletAddress})`,
      })
      .from(matchPlayers)

    return NextResponse.json({
      totalMatches: matchStats?.totalMatches || 0,
      totalPot: matchStats?.totalPot || 0,
      totalPlayers: playerStats?.totalPlayers || 0,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
