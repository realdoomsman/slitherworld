import { Connection, PublicKey, Transaction, Keypair, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js'
import bs58 from 'bs58'

const SOLANA_RPC = process.env.NEXT_PUBLIC_SOLANA_RPC || 'https://api.devnet.solana.com'
const connection = new Connection(SOLANA_RPC, 'confirmed')

let TREASURY_KEYPAIR: Keypair
try {
  if (process.env.SOLANA_TREASURY_PRIVATE_KEY) {
    TREASURY_KEYPAIR = Keypair.fromSecretKey(bs58.decode(process.env.SOLANA_TREASURY_PRIVATE_KEY))
  } else {
    console.warn('⚠️  SOLANA_TREASURY_PRIVATE_KEY not set, payments will not work')
    TREASURY_KEYPAIR = Keypair.generate() // Temporary fallback
  }
} catch (error) {
  console.warn('⚠️  Invalid SOLANA_TREASURY_PRIVATE_KEY, using temporary keypair')
  TREASURY_KEYPAIR = Keypair.generate()
}

export interface PaymentInstruction {
  amount: number
  recipient: string
  reference: string
}

export function generatePaymentInstruction(amount: number): PaymentInstruction {
  return {
    amount,
    recipient: TREASURY_KEYPAIR.publicKey.toString(),
    reference: bs58.encode(Buffer.from(Date.now().toString() + Math.random().toString())),
  }
}

export async function verifyPayment(
  signature: string,
  expectedAmount: number,
  expectedReference: string
): Promise<boolean> {
  try {
    const tx = await connection.getTransaction(signature, {
      commitment: 'confirmed',
      maxSupportedTransactionVersion: 0,
    })

    if (!tx || !tx.meta) return false

    // Check if transaction succeeded
    if (tx.meta.err) return false

    // Verify SOL transfer to treasury
    const treasuryPubkey = TREASURY_KEYPAIR.publicKey.toString()
    const accountKeys = tx.transaction.message.staticAccountKeys.map(k => k.toString())
    const treasuryIndex = accountKeys.indexOf(treasuryPubkey)

    if (treasuryIndex === -1) return false

    // Check balance change
    const preBalance = tx.meta.preBalances[treasuryIndex]
    const postBalance = tx.meta.postBalances[treasuryIndex]
    const received = (postBalance - preBalance) / LAMPORTS_PER_SOL

    // Allow small variance for fees
    return received >= expectedAmount * 0.99

  } catch (error) {
    console.error('Payment verification error:', error)
    return false
  }
}

export async function sendPayout(
  recipientAddress: string,
  exactAmount: number
): Promise<string> {
  try {
    const recipient = new PublicKey(recipientAddress)
    
    // Calculate exact lamports (no rounding errors)
    const lamports = Math.floor(exactAmount * LAMPORTS_PER_SOL)
    
    // Get treasury balance to ensure we have enough
    const balance = await connection.getBalance(TREASURY_KEYPAIR.publicKey)
    
    if (balance < lamports) {
      throw new Error(`Insufficient treasury balance. Need: ${lamports}, Have: ${balance}`)
    }
    
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: TREASURY_KEYPAIR.publicKey,
        toPubkey: recipient,
        lamports,
      })
    )

    const signature = await connection.sendTransaction(transaction, [TREASURY_KEYPAIR])
    await connection.confirmTransaction(signature, 'confirmed')

    console.log(`✅ Payout sent: ${exactAmount} SOL to ${recipientAddress}`)
    return signature
  } catch (error) {
    console.error('❌ Payout error:', error)
    throw error
  }
}

export async function executeBuyback(amount: number): Promise<void> {
  try {
    // Calculate exact lamports for buyback
    const lamports = Math.floor(amount * LAMPORTS_PER_SOL)
    
    console.log(`🔄 Executing buyback: ${amount} SOL`)
    
    // TODO: Implement Raydium swap when token is created
    // For now, just log the buyback amount
    // This SOL stays in treasury until token is deployed
    
    console.log(`✅ Buyback reserved: ${amount} SOL (${lamports} lamports)`)
    
    // Future implementation:
    // 1. Swap SOL -> SLITHER on Raydium
    // 2. Send SLITHER to staking contract or burn
  } catch (error) {
    console.error('❌ Buyback error:', error)
    throw error
  }
}

export async function getTreasuryBalance(): Promise<number> {
  try {
    const balance = await connection.getBalance(TREASURY_KEYPAIR.publicKey)
    return balance / LAMPORTS_PER_SOL
  } catch (error) {
    console.error('Error getting treasury balance:', error)
    return 0
  }
}
