import { Socket } from 'socket.io'
import { GameInstance } from '../game/GameInstance'

interface DisconnectedPlayer {
  socketId: string
  walletAddress: string
  lobbyId: string
  disconnectedAt: number
}

const disconnectedPlayers = new Map<string, DisconnectedPlayer>()
const RECONNECT_WINDOW = 60 * 1000 // 60 seconds to reconnect

export function handlePlayerDisconnect(
  socket: Socket,
  walletAddress: string,
  lobbyId: string
) {
  // Store disconnection info
  disconnectedPlayers.set(walletAddress, {
    socketId: socket.id,
    walletAddress,
    lobbyId,
    disconnectedAt: Date.now(),
  })

  // Remove after reconnect window expires
  setTimeout(() => {
    disconnectedPlayers.delete(walletAddress)
  }, RECONNECT_WINDOW)
}

export function handlePlayerReconnect(
  socket: Socket,
  walletAddress: string,
  game: GameInstance
): boolean {
  const disconnectedInfo = disconnectedPlayers.get(walletAddress)
  
  if (!disconnectedInfo) {
    return false // No recent disconnection
  }

  const timeSinceDisconnect = Date.now() - disconnectedInfo.disconnectedAt
  
  if (timeSinceDisconnect > RECONNECT_WINDOW) {
    disconnectedPlayers.delete(walletAddress)
    return false // Reconnect window expired
  }

  // TODO: Implement reconnection logic
  // For now, just clear the disconnection record
  disconnectedPlayers.delete(walletAddress)
  return false
}

export function cleanupExpiredDisconnections() {
  const now = Date.now()
  for (const [wallet, info] of disconnectedPlayers.entries()) {
    if (now - info.disconnectedAt > RECONNECT_WINDOW) {
      disconnectedPlayers.delete(wallet)
    }
  }
}

// Clean up every minute
setInterval(cleanupExpiredDisconnections, 60 * 1000)
