import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { db } from '@/server/db'
import { matches } from '@/server/db/schema'
import { eq, and } from 'drizzle-orm'

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

    const entryFee = lobbyType === 'FREE' ? '0' : '0.25'

    // Check if there's an active game running
    const activeGames = await db
      .select()
      .from(matches)
      .where(
        and(
          eq(matches.lobbyType, lobbyType),
          eq(matches.status, 'active')
        )
      )
      .limit(1)

    if (activeGames.length > 0) {
      return NextResponse.json({ 
        error: 'Game in progress',
        gameInProgress: true,
        message: 'A game is currently running. Please wait for it to finish.'
      }, { status: 409 })
    }

    // Find existing waiting lobby for this type
    const existingLobbies = await db
      .select()
      .from(matches)
      .where(
        and(
          eq(matches.lobbyType, lobbyType),
          eq(matches.status, 'waiting')
        )
      )
      .limit(1)

    let lobbyId: string

    if (existingLobbies.length > 0) {
      // Join existing lobby
      lobbyId = existingLobbies[0].id
      console.log(`Player joining existing ${lobbyType} lobby: ${lobbyId}`)
    } else {
      // Create new lobby
      lobbyId = uuidv4()
      await db.insert(matches).values({
        id: lobbyId,
        lobbyType,
        entryFee,
        potAmount: '0',
        status: 'waiting',
        startedAt: new Date(),
      })
      console.log(`Created new ${lobbyType} lobby: ${lobbyId}`)
    }

    return NextResponse.json({
      lobbyId,
      lobbyType,
      entryFee: parseFloat(entryFee),
      nickname: nickname.trim(),
      walletAddress: walletAddress.trim(),
      isNewLobby: existingLobbies.length === 0,
    })
  } catch (error) {
    console.error('Lobby creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
