import { LobbyConfig, LOBBY_TYPES } from '../../shared/types'
import { GameInstance } from './GameInstance'
import { v4 as uuidv4 } from 'uuid'

export class LobbyManager {
  private lobbies: Map<string, LobbyConfig> = new Map()
  private games: Map<string, GameInstance> = new Map()
  private playerToLobby: Map<string, string> = new Map()
  private playerToWallet: Map<string, string> = new Map()
  private playerToNickname: Map<string, string> = new Map()
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

  public getPlayerNickname(playerId: string): string | undefined {
    return this.playerToNickname.get(playerId)
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

  public joinLobby(lobbyId: string, playerId: string, walletAddress: string, nickname?: string): boolean {
    const lobby = this.lobbies.get(lobbyId)
    if (!lobby) return false
    if (lobby.status !== 'waiting') return false
    if (lobby.players.length >= lobby.maxPlayers) return false
    if (this.playerToLobby.has(playerId)) return false

    lobby.players.push(playerId)
    this.playerToLobby.set(playerId, lobbyId)
    this.playerToWallet.set(playerId, walletAddress)
    if (nickname) {
      this.playerToNickname.set(playerId, nickname)
    }

    // Auto-start if minimum players reached
    if (lobby.players.length >= lobby.minPlayers) {
      setTimeout(() => this.startLobby(lobbyId), 3000)
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
    
    console.log(`Starting lobby ${lobbyId}: ${lobby.players.length}/${lobby.minPlayers} players`)
    
    if (lobby.players.length < lobby.minPlayers) return

    lobby.status = 'active'
    console.log(`Lobby ${lobbyId} now active, creating game instance`)

    // Create game instance
    const players = lobby.players.map(id => ({
      id,
      walletAddress: this.playerToWallet.get(id) || id,
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
