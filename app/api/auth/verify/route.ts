import { NextRequest, NextResponse } from 'next/server'
import { verifySignature, createSession } from '@/server/solana/auth'
import { rateLimit, RATE_LIMITS } from '@/lib/rateLimit'

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, signature, message } = await request.json()
    
    if (!walletAddress || !signature || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    if (!rateLimit(`verify:${clientIp}`, RATE_LIMITS.AUTH)) {
      return NextResponse.json(
        { error: 'Too many verification attempts. Please try again later.' },
        { status: 429 }
      )
    }

    // Verify the signature
    const isValid = verifySignature(message, signature, walletAddress)
    
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    // Create session
    const token = await createSession(walletAddress, message)
    
    return NextResponse.json({ token, walletAddress })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
