import { LobbyConfig, LOBBY_TYPES } from '../../shared/types'
import { GameInstance } from './GameInstance'
import { BotPlayer } from './BotPlayer'
import { v4 as uuidv4 } from 'uuid'

export class LobbyManager {
  private lobbies: Map<string, LobbyConfig> = new Map()
  private games: Map<string, GameInstance> = new Map()
  private playerToLobby: Map<string, string> = new Map()
  private playerToWallet: Map<string, string> = new Map()
  private bots: Map<string, BotPlayer> = new Map()
  private onGameEnd: (lobbyId: string, winnerId: string, stats: Map<string, any>) => void
  private onKill?: (lobbyId: string, killerId: string, victimId: string) => void

  constructor(
    onGameEnd: (lobbyId: string, winnerId: string, stats: Map<string, any>) => void,
    onKill?: (lobbyId: string, killerId: string, victimId: string) => void
  ) {
    this.onGameEnd = onGameEnd
    this.onKill = onKill
  }

  public getPlayerWallet(playerId: string): string | undefined {
    return this.playerToWallet.get(playerId)
  }

  public addBotsToLobby(lobbyId: string, count: number): void {
    const lobby = this.lobbies.get(lobbyId)
    if (!lobby || lobby.status !== 'waiting') return

    for (let i = 0; i < count; i++) {
      if (lobby.players.length >= lobby.maxPlayers) break
      
      const botId = `bot_${uuidv4()}`
      const bot = new BotPlayer(botId)
      this.bots.set(botId, bot)
      
      lobby.players.push(botId)
      this.playerToLobby.set(botId, lobbyId)
    }

    // Check if we can start now
    const devMode = process.env.DEV_MODE === 'true'
    const minRequired = devMode ? 1 : lobby.minPlayers

    if (lobby.players.length >= minRequired) {
      setTimeout(() => this.startLobby(lobbyId), 1000)
    }
  }

  public createLobby(type: keyof typeof LOBBY_TYPES): LobbyConfig {
    const config = LOBBY_TYPES[type]
    const lobby: LobbyConfig = {
      id: uuidv4(),
      entryFee: config.entryFee,
      minPlayers: config.minPlayers,
      maxPlayers: config.maxPlayers,
      status: 'waiting',
      players: [],
    }

    this.lobbies.set(lobby.id, lobby)
    return lobby
  }

  public joinLobby(lobbyId: string, playerId: string, walletAddress: string): boolean {
    const lobby = this.lobbies.get(lobbyId)
    if (!lobby) return false
    if (lobby.status !== 'waiting') return false
    if (lobby.players.length >= lobby.maxPlayers) return false
    if (this.playerToLobby.has(playerId)) return false

    lobby.players.push(playerId)
    this.playerToLobby.set(playerId, lobbyId)
    this.playerToWallet.set(playerId, walletAddress)

    // Dev mode: start with 1 player for testing
    const devMode = process.env.DEV_MODE === 'true'
    const minRequired = devMode ? 1 : lobby.minPlayers

    // Auto-start if minimum players reached
    if (lobby.players.length >= minRequired) {
      setTimeout(() => this.startLobby(lobbyId), devMode ? 1000 : 3000)
    }

    return true
  }

  public leaveLobby(playerId: string): void {
    const lobbyId = this.playerToLobby.get(playerId)
    if (!lobbyId) return

    const lobby = this.lobbies.get(lobbyId)
    if (lobby && lobby.status === 'waiting') {
      lobby.players = lobby.players.filter(p => p !== playerId)
      this.playerToLobby.delete(playerId)
    }
  }

  private startLobby(lobbyId: string): void {
    const lobby = this.lobbies.get(lobbyId)
    if (!lobby || lobby.status !== 'waiting') return
    
    // Dev mode: allow starting with 1 player
    const devMode = process.env.DEV_MODE === 'true'
    const minRequired = devMode ? 1 : lobby.minPlayers
    
    console.log(`Starting lobby ${lobbyId}: ${lobby.players.length}/${minRequired} players (dev: ${devMode})`)
    
    if (lobby.players.length < minRequired) return

    lobby.status = 'active'
    console.log(`Lobby ${lobbyId} now active, creating game instance`)

    // Create game instance
    const players = lobby.players.map(id => ({
      id,
      walletAddress: id, // In real implementation, map to wallet
    }))

    const game = new GameInstance(
      lobbyId,
      players,
      (winnerId, stats) => this.handleGameEnd(lobbyId, winnerId, stats),
      this.onKill ? (killerId, victimId) => this.onKill!(lobbyId, killerId, victimId) : undefined
    )

    this.games.set(lobbyId, game)
    game.start()
    console.log(`Game ${lobbyId} started with ${players.length} players`)
  }

  private handleGameEnd(lobbyId: string, winnerId: string, stats: Map<string, any>): void {
    const lobby = this.lobbies.get(lobbyId)
    if (lobby) {
      lobby.status = 'finished'
    }

    this.games.delete(lobbyId)
    
    // Clear player mappings
    for (const playerId of lobby?.players || []) {
      this.playerToLobby.delete(playerId)
    }

    this.onGameEnd(lobbyId, winnerId, stats)
  }

  public getGame(lobbyId: string): GameInstance | undefined {
    return this.games.get(lobbyId)
  }

  public getLobby(lobbyId: string): LobbyConfig | undefined {
    return this.lobbies.get(lobbyId)
  }

  public getAvailableLobbies(): LobbyConfig[] {
    return Array.from(this.lobbies.values()).filter(l => l.status === 'waiting')
  }

  public getAllLobbies(): LobbyConfig[] {
    return Array.from(this.lobbies.values())
  }

  public getPlayerLobby(playerId: string): string | undefined {
    return this.playerToLobby.get(playerId)
  }
}
