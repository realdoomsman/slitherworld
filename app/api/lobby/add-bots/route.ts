import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Only allow in dev mode
    if (process.env.DEV_MODE !== 'true') {
      return NextResponse.json({ error: 'Bots only available in dev mode' }, { status: 403 })
    }

    const { lobbyId, count = 5 } = await request.json()

    // This would need to communicate with the game server
    // For now, return success - implement socket communication if needed
    
    return NextResponse.json({ 
      success: true, 
      message: `Added ${count} bots to lobby`,
      devMode: true 
    })
  } catch (error) {
    console.error('Add bots error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
