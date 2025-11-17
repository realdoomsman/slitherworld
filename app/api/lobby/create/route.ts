import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { db } from '@/server/db'
import { matches } from '@/server/db/schema'

export async function POST(request: NextRequest) {
  try {
    const { lobbyType, nickname, walletAddress } = await request.json()

    if (!nickname || nickname.trim().length < 2) {
      return NextResponse.json({ error: 'Invalid nickname' }, { status: 400 })
    }

    if (!walletAddress || walletAddress.trim().length < 32) {
      return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 })
    }

    if (lobbyType !== 'FREE' && lobbyType !== 'PAID') {
      return NextResponse.json({ error: 'Invalid lobby type' }, { status: 400 })
    }

    const lobbyId = uuidv4()
    const entryFee = lobbyType === 'FREE' ? '0' : '0.25'

    // Create match in database
    await db.insert(matches).values({
      id: lobbyId,
      lobbyType,
      entryFee,
      potAmount: '0',
      status: 'waiting',
      startedAt: new Date(),
    })

    return NextResponse.json({
      lobbyId,
      lobbyType,
      entryFee: parseFloat(entryFee),
      nickname: nickname.trim(),
      walletAddress: walletAddress.trim(),
    })
  } catch (error) {
    console.error('Lobby creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
