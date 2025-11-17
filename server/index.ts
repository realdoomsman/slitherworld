import 'dotenv/config'
import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { LobbyManager } from './game/LobbyManager'
import { validateSession } from './solana/auth'
import { db } from './db'
import { matches, matchPlayers, transactions } from './db/schema'
import { sendPayout, executeBuyback } from './solana/payments'
import { eq } from 'drizzle-orm'
import { LOBBY_TYPES } from '../shared/types'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
})

app.use(express.json())

const lobbyManager = new LobbyManager(
  async (lobbyId, winnerId, stats) => {
    await handleGameEnd(lobbyId, winnerId, stats)
  },
  (lobbyId, killerId, victimId) => {
    // Broadcast kill event
    const killerWallet = lobbyManager.getPlayerWallet(killerId) || killerId
    const victimWallet = lobbyManager.getPlayerWallet(victimId) || victimId
    io.to(lobbyId).emit('player_killed', {
      killer: killerWallet,
      victim: victimWallet
    })
  }
)

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)

  let authenticatedWallet: string | null = null
  let currentLobby: string | null = null

  socket.on('authenticate', async (data: { nickname?: string; walletAddress?: string }) => {
    console.log('Authenticate request received', data)
    
    // New system: just store nickname and wallet
    if (data.nickname && data.walletAddress) {
      authenticatedWallet = data.walletAddress
      console.log(`Player authenticated: ${data.nickname} (${data.walletAddress.slice(0, 8)}...)`)
      socket.emit('authenticated', { 
        wallet: data.walletAddress,
        nickname: data.nickname 
      })
    } else {
      console.log('Authentication failed - missing nickname or wallet')
      socket.emit('auth_error', { message: 'Nickname and wallet required' })
    }
  })

  socket.on('join_lobby', async (data: { lobbyId: string; nickname?: string }) => {
    console.log(`Player ${socket.id} joining lobby ${data.lobbyId}`)
    
    // Requires authentication
    if (!authenticatedWallet) {
      socket.emit('error', { message: 'Not authenticated' })
      return
    }
    
    // Check if lobby exists in manager, if not create it from database
    let lobby = lobbyManager.getLobby(data.lobbyId)
    if (!lobby) {
      // Fetch from database
      const matchResult = await db.select().from(matches).where(eq(matches.id, data.lobbyId)).limit(1)
      if (matchResult.length > 0) {
        const match = matchResult[0]
        const lobbyType = match.lobbyType as keyof typeof LOBBY_TYPES
        
        // Create lobby in manager with the same ID
        lobby = {
          id: data.lobbyId,
          entryFee: parseFloat(match.entryFee),
          minPlayers: LOBBY_TYPES[lobbyType].minPlayers,
          maxPlayers: LOBBY_TYPES[lobbyType].maxPlayers,
          status: 'waiting' as const,
          players: [],
        }
        lobbyManager['lobbies'].set(data.lobbyId, lobby)
        console.log(`Created lobby ${data.lobbyId} from database`)
      }
    }
    
    const success = lobbyManager.joinLobby(data.lobbyId, socket.id, authenticatedWallet, data.nickname)
    if (success) {
      currentLobby = data.lobbyId
      socket.join(data.lobbyId)
      
      lobby = lobbyManager.getLobby(data.lobbyId)
      console.log(`Lobby ${data.lobbyId} status: ${lobby?.status}, players: ${lobby?.players.length}`)
      
      // Send lobby update with player details
      const lobbyUpdate = {
        players: lobby?.players.map(playerId => ({
          id: playerId,
          nickname: lobbyManager.getPlayerNickname(playerId) || 'Player'
        })) || [],
        playerCount: lobby?.players.length || 0,
        requiredPlayers: lobby?.minPlayers || 5,
        status: lobby?.status
      }
      
      io.to(data.lobbyId).emit('lobby_update', lobbyUpdate)
    } else {
      console.log(`Failed to join lobby ${data.lobbyId}`)
      socket.emit('error', { message: 'Failed to join lobby' })
    }
  })

  socket.on('player_input', (data: { angle: number; boosting: boolean }) => {
    if (!currentLobby) return

    const game = lobbyManager.getGame(currentLobby)
    if (game) {
      // Temporarily disable strict validation for smoother gameplay
      // TODO: Re-enable with better thresholds after testing
      
      // Validate input (anti-cheat) - DISABLED FOR NOW
      // const gameState = game.getSerializableState()
      // const mySnake = gameState.snakes.find((s: any) => s.id === socket.id)
      
      // if (mySnake && mySnake.segments.length > 0) {
      //   const { validatePlayerInput } = require('./validation/movement')
      //   const isValid = validatePlayerInput(socket.id, data, mySnake.segments[0])
        
      //   if (!isValid) {
      //     console.warn(`Blocked invalid input from ${socket.id}`)
      //     socket.emit('error', { message: 'Invalid movement detected' })
      //     return
      //   }
      // }
      
      game.updatePlayerInput(socket.id, data)
    }
  })

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
    if (currentLobby) {
      lobbyManager.leaveLobby(socket.id)
    }
  })
})

// Game state broadcast loop (30Hz for better performance)
setInterval(() => {
  // Broadcast to all active games
  const allLobbies = lobbyManager.getAllLobbies()
  
  for (const lobby of allLobbies) {
    const game = lobbyManager.getGame(lobby.id)
    if (game) {
      const state = game.getSerializableState()
      
      // Broadcast to players
      io.to(lobby.id).emit('game_state', state)
    }
  }
}, 1000 / 30) // 30Hz broadcast (matches game tick rate)

async function handleGameEnd(lobbyId: string, winnerId: string, stats: Map<string, any>) {
  try {
    const lobby = lobbyManager.getLobby(lobbyId)
    if (!lobby) return

    // Get winner's wallet address
    const winnerWallet = lobbyManager.getPlayerWallet(winnerId)
    console.log(`Game ended. Winner socket: ${winnerId}, wallet: ${winnerWallet}`)

    // Get match from database
    const matchResult = await db.select().from(matches).where(eq(matches.id, lobbyId)).limit(1)
    if (matchResult.length === 0) return

    const match = matchResult[0]
    const isFreeGame = lobby.entryFee === 0

    // Calculate exact payouts (all payments already in treasury)
    let winnerPayout: number
    let buybackAmount = 0

    if (isFreeGame) {
      // Free game: fixed prize from treasury
      winnerPayout = 0.05
    } else {
      // Paid game: Calculate from THIS match's pot only
      // All entry fees are already in treasury
      const potAmount = lobby.entryFee * lobby.players.length
      
      // 80% to winner, 15% to buybacks, 5% stays in treasury for operations
      winnerPayout = Math.floor(potAmount * 0.80 * LAMPORTS_PER_SOL) / LAMPORTS_PER_SOL  // Exact amount
      buybackAmount = Math.floor(potAmount * 0.15 * LAMPORTS_PER_SOL) / LAMPORTS_PER_SOL  // Exact amount
      
      console.log(`Pot: ${potAmount} SOL | Winner: ${winnerPayout} SOL | Buyback: ${buybackAmount} SOL`)
    }

    // Update match with winner
    await db.update(matches)
      .set({
        winnerAddress: winnerWallet || winnerId,
        winnerPayout: winnerPayout.toString(),
        endedAt: new Date(),
        status: 'finished',
      })
      .where(eq(matches.id, lobbyId))

    // Update player stats
    let placement = 1
    for (const [playerId, playerStats] of stats) {
      await db.update(matchPlayers)
        .set({
          finalLength: playerStats.finalLength,
          killCount: playerStats.killCount,
          survivalTime: playerStats.survivalTime,
          placement,
        })
        .where(eq(matchPlayers.matchId, lobbyId))

      placement++
    }

    // Send payout to winner (only if we have a valid wallet address)
    if (winnerWallet) {
      try {
        const payoutTx = await sendPayout(winnerWallet, winnerPayout)
      
        await db.update(matches)
          .set({ payoutTxHash: payoutTx })
          .where(eq(matches.id, lobbyId))

        await db.insert(transactions).values({
          walletAddress: winnerWallet,
          txHash: payoutTx,
          type: 'payout',
          amount: winnerPayout.toString(),
          matchId: lobbyId,
          status: 'completed',
        })
      } catch (error) {
        console.error('Payout error:', error)
      }
    } else {
      console.log(`Skipping payout - no wallet address found for winner ${winnerId}`)
    }

    // Execute buyback (only for paid games)
    if (!isFreeGame && buybackAmount > 0) {
      try {
        const { executeBuyback } = require('./solana/payments')
        
        // Execute buyback (stays in treasury until token is deployed)
        await executeBuyback(buybackAmount)
        console.log(`Buyback reserved: ${buybackAmount} SOL`)
        
        // TODO: Stake or burn the purchased tokens
        // await stakeSLITHER(purchasedAmount)
        
        await executeBuyback(buybackAmount)
      } catch (error) {
        console.error('Buyback failed:', error)
      }
    }

    // Notify players
    io.to(lobbyId).emit('game_end', {
      winnerId,
      winnerPayout,
      isFreeGame,
      stats: Array.from(stats.entries()),
    })
  } catch (error) {
    console.error('Game end handling error:', error)
  }
}

const PORT = process.env.PORT || 3001
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
