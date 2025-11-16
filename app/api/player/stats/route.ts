import { NextRequest, NextResponse } from 'next/server'
import { validateSession } from '@/server/solana/auth'
import { db } from '@/server/db'
import { matches, matchPlayers } from '@/server/db/schema'
import { eq, sql } from 'drizzle-orm'

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

    // Get player stats
    const playerMatches = await db
      .select()
      .from(matchPlayers)
      .where(eq(matchPlayers.walletAddress, wallet))

    const totalMatches = playerMatches.length
    const wins = playerMatches.filter(m => m.placement === 1).length
    
    // Calculate total earnings
    const winningMatches = await db
      .select()
      .from(matches)
      .where(eq(matches.winnerAddress, wallet))
    
    const totalEarnings = winningMatches.reduce((sum, m) => 
      sum + parseFloat(m.winnerPayout || '0'), 0
    )

    // Get longest snake
    const longestLength = Math.max(...playerMatches.map(m => m.finalLength || 0), 0)
    
    // Get total kills
    const totalKills = playerMatches.reduce((sum, m) => sum + (m.killCount || 0), 0)
    
    // Calculate average placement
    const avgPlacement = totalMatches > 0
      ? playerMatches.reduce((sum, m) => sum + (m.placement || 0), 0) / totalMatches
      : 0

    return NextResponse.json({
      totalMatches,
      wins,
      totalEarnings: totalEarnings.toFixed(3),
      longestLength,
      totalKills,
      avgPlacement,
      winRate: totalMatches > 0 ? (wins / totalMatches) * 100 : 0
    })
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
