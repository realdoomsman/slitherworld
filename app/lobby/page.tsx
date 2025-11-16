'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { PublicKey, Transaction, SystemProgram } from '@solana/web3.js'

function LobbyContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { publicKey, sendTransaction } = useWallet()
  const { connection } = useConnection()
  const [lobbyId, setLobbyId] = useState<string | null>(null)
  const [paymentInfo, setPaymentInfo] = useState<any>(null)
  const [status, setStatus] = useState<'payment' | 'waiting' | 'ready'>('payment')
  const [mounted, setMounted] = useState(false)

  const lobbyType = searchParams.get('type')

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!publicKey || !lobbyType) return

    createLobby()
  }, [publicKey, lobbyType])

  const createLobby = async () => {
    try {
      const token = localStorage.getItem('sessionToken')
      console.log('Creating lobby with type:', lobbyType)
      
      const res = await fetch('/api/lobby/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ lobbyType }),
      })

      console.log('Lobby creation response status:', res.status)
      const data = await res.json()
      console.log('Lobby creation response:', data)
      
      if (data.error) {
        console.error('Lobby creation failed:', data.error)
        alert('Failed to create lobby: ' + data.error)
        return
      }
      
      setLobbyId(data.lobbyId)
      setPaymentInfo(data.payment)
    } catch (error) {
      console.error('Lobby creation error:', error)
      alert('Error creating lobby. Check console.')
    }
  }

  const handlePayment = async () => {
    if (!publicKey || !paymentInfo) return

    try {
      // Free lobby - skip payment
      if (paymentInfo.amount === 0) {
        const token = localStorage.getItem('sessionToken')
        await fetch('/api/lobby/join-free', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ lobbyId }),
        })

        setStatus('waiting')
        router.push(`/game?lobby=${lobbyId}`)
        return
      }

      // Paid lobby - process payment
      const recipient = new PublicKey(paymentInfo.recipient)

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipient,
          lamports: paymentInfo.amount * 1e9, // Convert SOL to lamports
        })
      )

      const signature = await sendTransaction(transaction, connection)
      await connection.confirmTransaction(signature, 'confirmed')

      // Verify payment
      const token = localStorage.getItem('sessionToken')
      await fetch('/api/lobby/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          lobbyId,
          txHash: signature,
          reference: paymentInfo.reference,
          expectedAmount: paymentInfo.amount,
        }),
      })

      setStatus('waiting')
      router.push(`/game?lobby=${lobbyId}`)
    } catch (error) {
      console.error('Payment error:', error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-gray-900 border-2 border-green-500 rounded-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-center">Join Lobby</h2>

        {status === 'payment' && paymentInfo && (
          <div>
            {paymentInfo.amount === 0 ? (
              <>
                <p className="text-center mb-2 text-2xl text-green-400">FREE LOBBY</p>
                <p className="text-center mb-4 text-sm text-gray-400">Winner gets 0.05 SOL prize!</p>
                <button
                  onClick={handlePayment}
                  className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold"
                >
                  Join Free Game
                </button>
              </>
            ) : (
              <>
                <p className="text-center mb-4">Entry Fee: {paymentInfo.amount} SOL</p>
                <button
                  onClick={handlePayment}
                  className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold"
                >
                  Pay & Join
                </button>
              </>
            )}
          </div>
        )}

        {status === 'waiting' && (
          <div className="text-center">
            <div className="animate-pulse mb-4">
              <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
            <p>Waiting for players...</p>
            {mounted && process.env.NEXT_PUBLIC_DEV_MODE === 'true' && (
              <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-500 rounded-lg">
                <p className="text-yellow-400 text-sm mb-3">🧪 Dev Mode Active</p>
                <p className="text-xs text-gray-400 mb-3">Game will start with just you!</p>
                <p className="text-xs text-gray-500">Tip: Open multiple browser windows to test multiplayer</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function LobbyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LobbyContent />
    </Suspense>
  )
}
