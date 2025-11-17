'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

const TREASURY_ADDRESS = 'GpWkVYPmc5rRFRXCRhdHH2zcSYExy19vwYeeG8GunVF7'

const LOBBY_INFO: Record<string, { name: string; fee: number; players: number }> = {
  FREE: { name: 'Free Play', fee: 0, players: 5 },
  PAID: { name: 'Paid Game', fee: 0.25, players: 10 },
}

function LobbyContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [lobbyId, setLobbyId] = useState<string | null>(null)
  const [lobbyType, setLobbyType] = useState<string | null>(null)
  const [nickname, setNickname] = useState<string>('')
  const [walletAddress, setWalletAddress] = useState<string>('')
  const [transactionSig, setTransactionSig] = useState<string>('')
  const [status, setStatus] = useState<'setup' | 'payment' | 'verifying' | 'verified' | 'error'>('setup')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const type = searchParams.get('type')
    const savedNickname = localStorage.getItem('playerNickname') || ''
    const savedWallet = localStorage.getItem('playerWallet') || ''
    
    setLobbyType(type)
    setNickname(savedNickname)
    setWalletAddress(savedWallet)
    
    // Auto-create lobby if we have all info
    if (type && savedNickname && savedWallet && !lobbyId) {
      createLobbyAndJoin(type, savedNickname, savedWallet)
    }
  }, [])
  
  const createLobbyAndJoin = async (type: string, nick: string, wallet: string) => {
    try {
      const res = await fetch('/api/lobby/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          lobbyType: type, 
          nickname: nick,
          walletAddress: wallet
        }),
      })

      const data = await res.json()
      
      if (data.error) {
        setErrorMessage(data.error)
        setStatus('error')
        return
      }
      
      setLobbyId(data.lobbyId)
      
      // For FREE lobbies, go straight to game (waiting room)
      if (type === 'FREE') {
        router.push(`/game?lobby=${data.lobbyId}&nickname=${encodeURIComponent(nick)}&wallet=${encodeURIComponent(wallet)}`)
      } else {
        // For PAID lobbies, show payment screen
        setStatus('payment')
      }
    } catch (error) {
      console.error('Lobby creation error:', error)
      setErrorMessage('Failed to create lobby')
      setStatus('error')
    }
  }

  const handleSetupComplete = async () => {
    if (!walletAddress.trim() || walletAddress.trim().length < 32) {
      alert('Please enter a valid Solana wallet address')
      return
    }

    try {
      const res = await fetch('/api/lobby/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          lobbyType, 
          nickname,
          walletAddress: walletAddress.trim()
        }),
      })

      const data = await res.json()
      
      if (data.error) {
        setErrorMessage(data.error)
        setStatus('error')
        return
      }
      
      setLobbyId(data.lobbyId)
      setStatus('payment')
    } catch (error) {
      console.error('Lobby creation error:', error)
      setErrorMessage('Failed to create lobby')
      setStatus('error')
    }
  }

  const handleVerifyPayment = async () => {
    if (!transactionSig.trim()) {
      alert('Please enter transaction signature')
      return
    }

    setStatus('verifying')
    setErrorMessage('')

    try {
      const lobbyInfo = LOBBY_INFO[lobbyType || 'FREE']
      
      const res = await fetch('/api/lobby/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionSignature: transactionSig.trim(),
          expectedAmount: lobbyInfo.fee,
          playerWallet: walletAddress.trim(),
          lobbyId,
        }),
      })

      const data = await res.json()

      if (data.error) {
        setErrorMessage(data.error)
        setStatus('error')
        return
      }

      if (data.verified) {
        setStatus('verified')
        // Redirect to game immediately
        router.push(`/game?lobby=${lobbyId}&nickname=${encodeURIComponent(nickname)}&wallet=${encodeURIComponent(walletAddress)}`)
      }
    } catch (error) {
      console.error('Verification error:', error)
      setErrorMessage('Verification failed. Please try again.')
      setStatus('error')
    }
  }

  const handleJoinFree = async () => {
    // For free lobbies, create match_players entry via API then join
    try {
      await fetch('/api/lobby/join-free', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lobbyId,
          walletAddress: walletAddress.trim(),
        }),
      })
    } catch (error) {
      console.error('Join error:', error)
    }
    
    router.push(`/game?lobby=${lobbyId}&nickname=${encodeURIComponent(nickname)}&wallet=${encodeURIComponent(walletAddress)}`)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Copied to clipboard!')
  }

  if (!mounted || !lobbyType || !lobbyId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const lobbyInfo = LOBBY_INFO[lobbyType]

  return (
    <div className="min-h-screen bg-black p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-400 mb-2">{lobbyInfo.name} Lobby</h1>
          {lobbyId && <p className="text-gray-400">Lobby ID: {lobbyId.slice(0, 8)}...</p>}
          <p className="text-gray-400">Players: {lobbyInfo.players}</p>
        </div>

        {/* Setup: Enter Wallet Address */}
        {status === 'setup' && (
          <div className="bg-gray-900 border-2 border-green-500/30 rounded-2xl p-6 md:p-8 mb-6">
            <h2 className="text-2xl font-bold text-center mb-6 text-green-400">
              Enter Your Wallet Address
            </h2>
            <p className="text-gray-400 text-center mb-6">
              We need your Solana wallet address to verify your payment
            </p>
            
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-300 mb-2">
                Your Solana Wallet Address
              </label>
              <input
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="e.g., 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"
                className="w-full px-4 py-3 bg-black/50 border-2 border-green-500/30 rounded-xl text-white text-sm font-mono focus:outline-none focus:border-green-500 transition-colors mb-2"
              />
              <p className="text-xs text-gray-500">
                This is the wallet you'll send payment from. Find it in Phantom under Settings → Your Wallet Address
              </p>
            </div>

            {errorMessage && (
              <div className="bg-red-900/20 border border-red-500 rounded-lg p-3 mb-4">
                <p className="text-red-400 text-sm">{errorMessage}</p>
              </div>
            )}

            <button
              onClick={handleSetupComplete}
              disabled={!walletAddress.trim()}
              className="w-full px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed rounded-xl font-bold text-xl transition-all"
            >
              Continue to Payment
            </button>
          </div>
        )}

        {/* Payment Instructions */}
        {status === 'payment' && (
          <div className="bg-gray-900 border-2 border-green-500/30 rounded-2xl p-6 md:p-8 mb-6">
            {lobbyInfo.fee === 0 ? (
            // Free Lobby
            <div className="text-center">
              <div className="text-6xl mb-4">🎮</div>
              <h2 className="text-3xl font-bold text-green-400 mb-4">FREE TO PLAY</h2>
              <p className="text-gray-400 mb-6">Winner gets 0.05 SOL prize!</p>
              <button
                onClick={handleJoinFree}
                className="w-full px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-xl font-bold text-xl transition-all"
              >
                Join Game
              </button>
            </div>
          ) : (
            // Paid Lobby
            <>
              <h2 className="text-2xl font-bold text-center mb-6 text-green-400">
                Payment Required
              </h2>

              {/* Entry Fee */}
              <div className="bg-black/50 rounded-xl p-6 mb-6 text-center">
                <p className="text-gray-400 mb-2">Entry Fee</p>
                <p className="text-5xl font-bold text-yellow-400">{lobbyInfo.fee} SOL</p>
              </div>

              {/* Your Wallet */}
              <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-4 mb-6">
                <p className="text-xs text-gray-400 mb-1">Your Wallet:</p>
                <p className="text-sm text-green-400 font-mono break-all">{walletAddress}</p>
              </div>

              {/* Instructions */}
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-green-400 font-bold text-sm">1</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white mb-2">Send SOL to Treasury</h3>
                    <div className="bg-black/50 rounded-lg p-3 mb-2">
                      <p className="text-xs text-gray-400 mb-1">Treasury Address:</p>
                      <p className="text-sm text-green-400 font-mono break-all">{TREASURY_ADDRESS}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(TREASURY_ADDRESS)}
                      className="text-xs text-green-400 hover:text-green-300"
                    >
                      📋 Copy Address
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-green-400 font-bold text-sm">2</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white mb-2">Send from YOUR Wallet</h3>
                    <p className="text-sm text-gray-400 mb-2">
                      Open Phantom and send exactly <span className="text-yellow-400 font-bold">{lobbyInfo.fee} SOL</span> to the treasury address above
                    </p>
                    <p className="text-sm text-yellow-400 font-bold">
                      ⚠️ MUST send from: {walletAddress.slice(0, 8)}...{walletAddress.slice(-8)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-green-400 font-bold text-sm">3</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white mb-2">Copy Transaction Signature</h3>
                    <p className="text-sm text-gray-400">
                      After sending, copy the transaction signature from your wallet or Solscan
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-green-400 font-bold text-sm">4</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white mb-2">Paste & Verify</h3>
                    <p className="text-sm text-gray-400">
                      Paste the transaction signature below to verify your payment
                    </p>
                  </div>
                </div>
              </div>

              {/* Verification Form */}
              <div className="border-t border-gray-700 pt-6">
                <label className="block text-sm font-bold text-gray-300 mb-2">
                  Transaction Signature
                </label>
                <input
                  type="text"
                  value={transactionSig}
                  onChange={(e) => setTransactionSig(e.target.value)}
                  placeholder="Paste transaction signature here..."
                  disabled={status !== 'payment'}
                  className="w-full px-4 py-3 bg-black/50 border-2 border-green-500/30 rounded-xl text-white text-sm font-mono focus:outline-none focus:border-green-500 transition-colors disabled:opacity-50 mb-4"
                />

                {errorMessage && (
                  <div className="bg-red-900/20 border border-red-500 rounded-lg p-3 mb-4">
                    <p className="text-red-400 text-sm">{errorMessage}</p>
                  </div>
                )}

                <button
                  onClick={handleVerifyPayment}
                  disabled={!transactionSig.trim()}
                  className="w-full px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed rounded-xl font-bold text-xl transition-all"
                >
                  Verify Payment
                </button>
              </div>
            </>
          )}
          </div>
        )}

        {/* Verifying State */}
        {status === 'verifying' && (
          <div className="bg-gray-900 border-2 border-green-500/30 rounded-2xl p-6 md:p-8 mb-6 text-center">
            <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-green-400 mb-2">Verifying Payment...</h2>
            <p className="text-gray-400">Checking blockchain for your transaction</p>
          </div>
        )}

        {/* Verified State */}
        {status === 'verified' && (
          <div className="bg-gray-900 border-2 border-green-500/30 rounded-2xl p-6 md:p-8 mb-6 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-green-400 mb-2">Payment Verified!</h2>
            <p className="text-gray-400">Joining game...</p>
          </div>
        )}

        {/* Help */}
        <div className="text-center text-sm text-gray-500">
          <p>Need help? Check <a href="https://solscan.io" target="_blank" className="text-green-400 hover:text-green-300">Solscan</a> for your transaction</p>
        </div>
      </div>
    </div>
  )
}

export default function LobbyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <LobbyContent />
    </Suspense>
  )
}
