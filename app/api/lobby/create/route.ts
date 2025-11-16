import { NextRequest, NextResponse } from 'next/server'
import { validateSession } from '@/server/solana/auth'
import { generatePaymentInstruction } from '@/server/solana/payments'
import { db } from '@/server/db'
import { matches } from '@/server/db/schema'
import { LOBBY_TYPES } from '@/shared/types'
import { rateLimit, RATE_LIMITS } from '@/lib/rateLimit'
import { checkActiveGame } from '@/server/utils/redis'

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

    // Rate limiting per wallet
    if (!rateLimit(`lobby:${wallet}`, RATE_LIMITS.LOBBY_CREATE)) {
      return NextResponse.json(
        { error: 'Too many lobby creation attempts. Please wait a moment.' },
        { status: 429 }
      )
    }

    // Check if player already in a game
    const hasActiveGame = await checkActiveGame(wallet)
    if (hasActiveGame) {
      return NextResponse.json(
        { error: 'You are already in an active game' },
        { status: 400 }
      )
    }

    const { lobbyType } = await request.json()
    
    if (!LOBBY_TYPES[lobbyType as keyof typeof LOBBY_TYPES]) {
      return NextResponse.json({ error: 'Invalid lobby type' }, { status: 400 })
    }

    const config = LOBBY_TYPES[lobbyType as keyof typeof LOBBY_TYPES]
    
    // Create match record
    const matchId = crypto.randomUUID()
    await db.insert(matches).values({
      id: matchId,
      lobbyType,
      entryFee: config.entryFee.toString(),
      potAmount: '0',
      startedAt: new Date(),
      status: 'waiting',
    })

    // Generate payment instruction (HTTP 402)
    const paymentInstruction = generatePaymentInstruction(config.entryFee)

    return NextResponse.json({
      lobbyId: matchId,
      payment: paymentInstruction,
    }, { status: 402 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
