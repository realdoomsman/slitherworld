import { Snake, Pellet, GameState, PlayerInput, GAME_CONFIG } from '../../shared/types'
import { updateSnakePosition, checkSnakeCollisions, checkPelletCollisions, generateStaticPelletGrid, createPelletsFromDeath } from '../../shared/physics'

export class GameInstance {
  public id: string
  public state: GameState
  private playerInputs: Map<string, PlayerInput>
  private tickInterval: NodeJS.Timeout | null = null
  private onGameEnd: (winnerId: string, stats: Map<string, any>) => void
  private onKill?: (killerId: string, victimId: string) => void

  constructor(
    id: string,
    players: Array<{ id: string; walletAddress: string }>,
    onGameEnd: (winnerId: string, stats: Map<string, any>) => void,
    onKill?: (killerId: string, victimId: string) => void
  ) {
    this.id = id
    this.onGameEnd = onGameEnd
    this.onKill = onKill
    this.playerInputs = new Map()

    // Initialize game state
    this.state = {
      snakes: new Map(),
      pellets: generateStaticPelletGrid(),
      tick: 0,
      startTime: Date.now(),
    }

    // Spawn snakes in safe positions
    this.spawnSnakes(players)
  }

  private spawnSnakes(players: Array<{ id: string; walletAddress: string }>): void {
    const colors = ['#00ff00', '#ff0000', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']
    const angleStep = (Math.PI * 2) / players.length
    const spawnRadius = Math.min(GAME_CONFIG.MAP_WIDTH, GAME_CONFIG.MAP_HEIGHT) * 0.3

    players.forEach((player, index) => {
      const angle = angleStep * index
      const x = GAME_CONFIG.MAP_WIDTH / 2 + Math.cos(angle) * spawnRadius
      const y = GAME_CONFIG.MAP_HEIGHT / 2 + Math.sin(angle) * spawnRadius

      const snake: Snake = {
        id: player.id,
        walletAddress: player.walletAddress,
        segments: [{ x, y }],
        angle: angle + Math.PI,
        length: GAME_CONFIG.SNAKE_INITIAL_LENGTH,
        speed: GAME_CONFIG.SNAKE_BASE_SPEED,
        boosting: false,
        alive: true,
        killCount: 0,
        color: colors[index % colors.length],
      }

      this.state.snakes.set(player.id, snake)
      this.playerInputs.set(player.id, { angle: snake.angle, boosting: false })
    })
  }

  public start(): void {
    this.tickInterval = setInterval(() => this.tick(), GAME_CONFIG.TICK_MS)
  }

  public stop(): void {
    if (this.tickInterval) {
      clearInterval(this.tickInterval)
      this.tickInterval = null
    }
  }

  private tick(): void {
    this.state.tick++

    // Track alive snakes before collision
    const aliveBeforeCollision = new Set(
      Array.from(this.state.snakes.values())
        .filter(s => s.alive)
        .map(s => s.id)
    )

    // Update all snakes
    for (const [playerId, snake] of this.state.snakes) {
      const input = this.playerInputs.get(playerId)
      if (input && snake.alive) {
        snake.boosting = input.boosting
        updateSnakePosition(snake, input.angle, 1 / GAME_CONFIG.TICK_RATE)
      }
    }

    // Check collisions
    checkSnakeCollisions(Array.from(this.state.snakes.values()))

    // Detect kills (who died this tick)
    for (const [playerId, snake] of this.state.snakes) {
      if (aliveBeforeCollision.has(playerId) && !snake.alive) {
        // This snake just died - find who killed them
        const killer = Array.from(this.state.snakes.values())
          .find(s => s.id !== playerId && s.alive && s.killCount > 0)
        
        if (killer && this.onKill) {
          this.onKill(killer.id, playerId)
        }
      }
    }

    // Check pellet collection
    const collectedPellets = new Set<string>()
    for (const snake of this.state.snakes.values()) {
      const collected = checkPelletCollisions(snake, this.state.pellets)
      collected.forEach(p => collectedPellets.add(p.id))
    }

    // Remove collected pellets
    this.state.pellets = this.state.pellets.filter(p => !collectedPellets.has(p.id))

    // Create pellets from dead snakes
    for (const snake of this.state.snakes.values()) {
      if (!snake.alive && snake.segments.length > 0) {
        const deathPellets = createPelletsFromDeath(snake)
        this.state.pellets.push(...deathPellets)
        snake.segments = [] // Clear segments after death
      }
    }

    // Check win condition (only after 5 seconds of gameplay)
    const gameTime = Date.now() - this.state.startTime
    if (gameTime > 5000) {
      const aliveSnakes = Array.from(this.state.snakes.values()).filter(s => s.alive)
      if (aliveSnakes.length === 1 && this.state.snakes.size > 1) {
        // Only end if there were multiple players
        this.endGame(aliveSnakes[0])
      } else if (aliveSnakes.length === 0) {
        this.endGame(null)
      }
    }
  }

  private endGame(winner: Snake | null): void {
    this.stop()

    const stats = new Map()
    for (const [id, snake] of this.state.snakes) {
      stats.set(id, {
        finalLength: Math.floor(snake.length),
        killCount: snake.killCount,
        survivalTime: Math.floor((Date.now() - this.state.startTime) / 1000),
      })
    }

    this.onGameEnd(winner?.id || '', stats)
  }

  public updatePlayerInput(playerId: string, input: PlayerInput): void {
    // Validate input
    if (isNaN(input.angle) || !isFinite(input.angle)) return
    
    this.playerInputs.set(playerId, input)
  }

  public getSerializableState() {
    return {
      snakes: Array.from(this.state.snakes.values()).map(s => ({
        id: s.id,
        walletAddress: s.walletAddress,
        segments: s.segments,
        angle: s.angle,
        length: s.length,
        boosting: s.boosting,
        alive: s.alive,
        killCount: s.killCount,
        color: s.color,
      })),
      pellets: this.state.pellets,
      tick: this.state.tick,
    }
  }
}
