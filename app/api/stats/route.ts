import { NextResponse } from 'next/server'
import { db } from '@/server/db'
import { matches, matchPlayers, transactions } from '@/server/db/schema'
import { sql, desc } from 'drizzle-orm'

export async function GET() {
  try {
    // Total matches
    const totalMatches = await db.select({ count: sql<number>`count(*)` }).from(matches)
    
    // Total volume
    const totalVolume = await db.select({ 
      sum: sql<number>`sum(cast(pot_amount as decimal))` 
    }).from(matches)
    
    // Recent winners
    const recentWinners = await db.select({
      walletAddress: matches.winnerAddress,
      payout: matches.winnerPayout,
      endedAt: matches.endedAt,
    })
    .from(matches)
    .where(sql`winner_address IS NOT NULL`)
    .orderBy(desc(matches.endedAt))
    .limit(10)

    // Top players by kills
    const topPlayers = await db.select({
      walletAddress: matchPlayers.walletAddress,
      totalKills: sql<number>`sum(kill_count)`,
      totalMatches: sql<number>`count(*)`,
    })
    .from(matchPlayers)
    .groupBy(matchPlayers.walletAddress)
    .orderBy(desc(sql`sum(kill_count)`))
    .limit(10)

    return NextResponse.json({
      totalMatches: totalMatches[0]?.count || 0,
      totalVolume: totalVolume[0]?.sum || 0,
      recentWinners,
      topPlayers,
    })
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
