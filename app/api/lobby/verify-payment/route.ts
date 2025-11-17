import { NextRequest, NextResponse } from 'next/server'
import { Connection, PublicKey } from '@solana/web3.js'

const TREASURY_ADDRESS = '4yG1SAYwJYhh7WHDbk7Bu8LHbkxfQ1dJVUf1RdkZniC4CvzjndxuYqw1bsfz9tztxHPK8hSUyW6M9hZ9esmXEsn7'

export async function POST(request: NextRequest) {
  try {
    const { transactionSignature, expectedAmount, playerWallet, lobbyId } = await request.json()

    if (!transactionSignature) {
      return NextResponse.json({ error: 'Transaction signature required' }, { status: 400 })
    }

    if (!playerWallet) {
      return NextResponse.json({ error: 'Wallet address required' }, { status: 400 })
    }

    // Connect to Solana
    const connection = new Connection(
      process.env.NEXT_PUBLIC_SOLANA_RPC || 'https://api.mainnet-beta.solana.com',
      'confirmed'
    )

    // Get transaction details
    const tx = await connection.getTransaction(transactionSignature, {
      commitment: 'confirmed',
      maxSupportedTransactionVersion: 0,
    })

    if (!tx || !tx.meta) {
      return NextResponse.json({ error: 'Transaction not found. Wait 30 seconds and try again.' }, { status: 404 })
    }

    // Check if transaction succeeded
    if (tx.meta.err) {
      return NextResponse.json({ error: 'Transaction failed on blockchain' }, { status: 400 })
    }

    // Get sender and recipient from transaction
    const accountKeys = tx.transaction.message.staticAccountKeys.map(k => k.toString())
    
    // First account is usually the sender (fee payer)
    const sender = accountKeys[0]
    
    // Verify sender matches player's wallet
    if (sender.toLowerCase() !== playerWallet.toLowerCase()) {
      return NextResponse.json({ 
        error: `Payment must come from your wallet (${playerWallet.slice(0, 8)}...). This transaction came from ${sender.slice(0, 8)}...` 
      }, { status: 400 })
    }

    // Verify payment to treasury
    const treasuryPubkey = new PublicKey(TREASURY_ADDRESS)
    const treasuryIndex = accountKeys.indexOf(treasuryPubkey.toString())

    if (treasuryIndex === -1) {
      return NextResponse.json({ error: 'Payment not sent to treasury wallet' }, { status: 400 })
    }

    // Check amount received
    const preBalance = tx.meta.preBalances[treasuryIndex]
    const postBalance = tx.meta.postBalances[treasuryIndex]
    const received = (postBalance - preBalance) / 1e9 // Convert lamports to SOL

    // Allow 2% variance for fees
    if (received < expectedAmount * 0.98) {
      return NextResponse.json({ 
        error: `Insufficient amount. Expected ${expectedAmount} SOL, received ${received.toFixed(4)} SOL` 
      }, { status: 400 })
    }

    // Payment verified! Now create match_players entry
    if (lobbyId) {
      const { db } = await import('@/server/db')
      const { matchPlayers } = await import('@/server/db/schema')
      
      try {
        await db.insert(matchPlayers).values({
          matchId: lobbyId,
          walletAddress: playerWallet,
          entryTxHash: transactionSignature,
        })
        console.log(`Created match_players entry for ${playerWallet} in lobby ${lobbyId}`)
      } catch (dbError) {
        console.error('Database error:', dbError)
        // Continue anyway - payment is verified
      }
    }

    return NextResponse.json({
      success: true,
      verified: true,
      amount: received,
      transactionSignature,
      timestamp: tx.blockTime,
      sender,
    })

  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json({ error: 'Verification failed. Please try again.' }, { status: 500 })
  }
}
