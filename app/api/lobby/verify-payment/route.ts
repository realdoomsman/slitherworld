import { NextRequest, NextResponse } from 'next/server'
import { validateSession } from '@/server/solana/auth'
import { verifyPayment } from '@/server/solana/payments'
import { db } from '@/server/db'
import { matchPlayers, transactions, matches } from '@/server/db/schema'
import { eq } from 'drizzle-orm'

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

    const { lobbyId, txHash, reference, expectedAmount } = await request.json()

    // Verify payment on-chain
    const isValid = await verifyPayment(txHash, expectedAmount, reference)
    if (!isValid) {
      return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 })
    }

    // Record transaction
    await db.insert(transactions).values({
      walletAddress: wallet,
      txHash,
      type: 'entry',
      amount: expectedAmount.toString(),
      matchId: lobbyId,
      status: 'completed',
    })

    // Add player to match
    await db.insert(matchPlayers).values({
      matchId: lobbyId,
      walletAddress: wallet,
      entryTxHash: txHash,
    })

    // Update pot amount
    const match = await db.select().from(matches).where(eq(matches.id, lobbyId)).limit(1)
    if (match.length > 0) {
      const currentPot = parseFloat(match[0].potAmount)
      await db.update(matches)
        .set({ potAmount: (currentPot + expectedAmount).toString() })
        .where(eq(matches.id, lobbyId))
    }

    return NextResponse.json({ success: true, lobbyId })
  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
