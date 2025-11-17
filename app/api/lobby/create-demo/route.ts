import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const { nickname } = await request.json()

    if (!nickname || nickname.trim().length < 2) {
      return NextResponse.json({ error: 'Invalid nickname' }, { status: 400 })
    }

    // Create a simple demo lobby ID
    const lobbyId = `demo_${uuidv4()}`

    return NextResponse.json({
      lobbyId,
      nickname: nickname.trim(),
    })
  } catch (error) {
    console.error('Demo lobby creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
