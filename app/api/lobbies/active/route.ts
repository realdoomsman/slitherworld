import { NextResponse } from 'next/server'
import { db } from '@/server/db'
import { matches } from '@/server/db/schema'
import { eq, or } from 'drizzle-orm'

export async function GET() {
  try {
    // Get active matches
    const activeMatches = await db
      .select()
      .from(matches)
      .where(or(
        eq(matches.status, 'waiting'),
        eq(matches.status, 'active')
      ))
      .limit(20)

    return NextResponse.json(activeMatches)
  } catch (error) {
    console.error('Active lobbies error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
