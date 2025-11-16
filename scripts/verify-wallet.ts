import 'dotenv/config'
import { Keypair, Connection, LAMPORTS_PER_SOL } from '@solana/web3.js'
import bs58 from 'bs58'

async function verifyWallet() {
  console.log('🔐 Verifying Mainnet Wallet...\n')

  try {
    // Get private key from env
    const privateKey = process.env.SOLANA_TREASURY_PRIVATE_KEY
    
    if (!privateKey) {
      console.error('❌ SOLANA_TREASURY_PRIVATE_KEY not found in .env')
      process.exit(1)
    }

    // Create keypair from private key
    const keypair = Keypair.fromSecretKey(bs58.decode(privateKey))
    const publicKey = keypair.publicKey.toString()

    console.log('✅ Wallet Address:', publicKey)
    console.log('')

    // Connect to mainnet
    const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed')
    
    // Get balance
    const balance = await connection.getBalance(keypair.publicKey)
    const solBalance = balance / LAMPORTS_PER_SOL

    console.log('💰 Balance:', solBalance, 'SOL')
    console.log('')

    // Check if funded
    if (solBalance === 0) {
      console.log('⚠️  WARNING: Wallet has 0 SOL!')
      console.log('📝 You need to fund this wallet with 1-2 SOL for transaction fees')
      console.log('')
      console.log('Send SOL to:', publicKey)
      console.log('')
    } else if (solBalance < 0.5) {
      console.log('⚠️  WARNING: Low balance!')
      console.log('📝 Recommended: Add more SOL for transaction fees')
      console.log('')
    } else {
      console.log('✅ Wallet is funded and ready!')
      console.log('')
    }

    console.log('🎉 Wallet verification complete!')
    
  } catch (error) {
    console.error('❌ Wallet verification failed:', error)
  }

  process.exit(0)
}

verifyWallet()
