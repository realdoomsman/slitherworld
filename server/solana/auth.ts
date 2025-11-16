import { PublicKey } from '@solana/web3.js'
import nacl from 'tweetnacl'
import bs58 from 'bs58'
import { v4 as uuidv4 } from 'uuid'
import { db } from '../db'
import { sessions } from '../db/schema'
import { eq } from 'drizzle-orm'

export interface AuthChallenge {
  message: string
  timestamp: number
}

export function generateChallenge(walletAddress: string): AuthChallenge {
  const timestamp = Date.now()
  const message = `Sign this message to authenticate with Slither.io\n\nWallet: ${walletAddress}\nTimestamp: ${timestamp}\nNonce: ${uuidv4()}`
  
  return { message, timestamp }
}

export function verifySignature(
  message: string,
  signature: string,
  publicKey: string
): boolean {
  try {
    const messageBytes = new TextEncoder().encode(message)
    const signatureBytes = bs58.decode(signature)
    const publicKeyBytes = new PublicKey(publicKey).toBytes()

    return nacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes)
  } catch (error) {
    console.error('Signature verification error:', error)
    return false
  }
}

export async function createSession(walletAddress: string, challenge: string): Promise<string> {
  const token = uuidv4()
  const expiresAt = new Date(Date.now() + 35 * 60 * 1000) // 35 minutes

  // Delete existing session
  await db.delete(sessions).where(eq(sessions.walletAddress, walletAddress))

  // Create new session
  await db.insert(sessions).values({
    walletAddress,
    token,
    challenge,
    expiresAt,
  })

  return token
}

export async function validateSession(token: string): Promise<string | null> {
  const result = await db.select().from(sessions).where(eq(sessions.token, token)).limit(1)
  
  if (result.length === 0) return null
  
  const session = result[0]
  if (new Date() > session.expiresAt) {
    await db.delete(sessions).where(eq(sessions.token, token))
    return null
  }

  return session.walletAddress
}
