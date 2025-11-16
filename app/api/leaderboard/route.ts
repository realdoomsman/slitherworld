import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/server/db'
import { matches, matchPlayers } from '@/server/db/schema'
import { eq, desc, sql } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'earnings'

    let leaderboardData: any[] = []

    if (type === 'earnings') {
      // Top earners
      const winners = await db
        .select({
          wallet: matches.winnerAddress,
          totalEarnings: sql<number>`SUM(CAST(${matches.winnerPayout} AS DECIMAL))`,
          matches: sql<number>`COUNT(*)`,
        })
        .from(matches)
        .where(sql`${matches.winnerAddress} IS NOT NULL`)
        .groupBy(matches.winnerAddress)
        .orderBy(desc(sql`SUM(CAST(${matches.winnerPayout} AS DECIMAL))`))
        .limit(100)

      leaderboardData = winners.map(w => ({
        wallet: w.wallet,
        value: parseFloat(w.totalEarnings?.toString() || '0').toFixed(3),
        matches: w.matches
      }))
    } else if (type === 'wins') {
      // Most wins
      const winners = await db
        .select({
          wallet: matches.winnerAddress,
          wins: sql<number>`COUNT(*)`,
          totalMatches: sql<number>`COUNT(*)`,
        })
        .from(matches)
        .where(sql`${matches.winnerAddress} IS NOT NULL`)
        .groupBy(matches.winnerAddress)
        .orderBy(desc(sql`COUNT(*)`))
        .limit(100)

      leaderboardData = winners.map(w => ({
        wallet: w.wallet,
        value: w.wins,
        matches: w.totalMatches
      }))
    } else if (type === 'length') {
      // Longest snakes
      const longest = await db
        .select({
          wallet: matchPlayers.walletAddress,
          maxLength: sql<number>`MAX(${matchPlayers.finalLength})`,
          matches: sql<number>`COUNT(*)`,
        })
        .from(matchPlayers)
        .groupBy(matchPlayers.walletAddress)
        .orderBy(desc(sql`MAX(${matchPlayers.finalLength})`))
        .limit(100)

      leaderboardData = longest.map(l => ({
        wallet: l.wallet,
        value: l.maxLength,
        matches: l.matches
      }))
    }

    return NextResponse.json(leaderboardData)
  } catch (error) {
    console.error('Leaderboard error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
