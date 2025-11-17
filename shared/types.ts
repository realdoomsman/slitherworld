export interface Vector2 {
  x: number
  y: number
}

export interface Snake {
  id: string
  walletAddress: string
  segments: Vector2[]
  angle: number
  length: number
  speed: number
  boosting: boolean
  alive: boolean
  killCount: number
  color: string
}

export interface Pellet {
  id: string
  position: Vector2
  value: number
  radius?: number
}

export interface GameState {
  snakes: Map<string, Snake>
  pellets: Pellet[]
  tick: number
  startTime: number
}

export interface PlayerInput {
  angle: number
  boosting: boolean
}

export const GAME_CONFIG = {
  TICK_RATE: 60,
  TICK_MS: 1000 / 60,
  MAP_WIDTH: 4000,
  MAP_HEIGHT: 4000,
  SNAKE_BASE_SPEED: 4,
  SNAKE_BOOST_SPEED: 8,
  SNAKE_BOOST_DRAIN: 0, // No drain - boost based on collected pellets
  SNAKE_INITIAL_LENGTH: 10, // Start small
  SNAKE_MIN_BOOST_LENGTH: 15, // Need at least 15 length to boost
  SNAKE_SEGMENT_SPACING: 8,
  SNAKE_RADIUS: 10,
  SNAKE_TURN_SPEED: 0.12, // Faster turning
  PELLET_VALUE: 2,
  PELLET_RADIUS: 5,
  PELLET_GRID_SIZE: 100,
  PELLET_GRID_SPACING: 200,
}

export interface LobbyConfig {
  id: string
  entryFee: number
  minPlayers: number
  maxPlayers: number
  status: 'waiting' | 'starting' | 'active' | 'finished'
  players: string[]
  matchId?: string
}

export const LOBBY_TYPES = {
  FREE: { entryFee: 0, minPlayers: 5, maxPlayers: 5, winnerPrize: 0.05 },
  PAID: { entryFee: 0.25, minPlayers: 10, maxPlayers: 10 },
}
