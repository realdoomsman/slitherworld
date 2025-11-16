import { PlayerInput, GAME_CONFIG } from '../../shared/types'

interface PlayerState {
  lastInput: PlayerInput
  lastPosition: { x: number; y: number }
  lastUpdateTime: number
  violations: number
}

const playerStates = new Map<string, PlayerState>()

export function validatePlayerInput(
  playerId: string,
  input: PlayerInput,
  currentPosition: { x: number; y: number }
): boolean {
  // Anti-cheat temporarily disabled for smooth gameplay
  // Server-authoritative physics handles most exploits
  // TODO: Re-enable with better tuning after launch
  return true
  
  /* DISABLED - TOO STRICT
  const now = Date.now()
  const state = playerStates.get(playerId)

  // First input - initialize
  if (!state) {
    playerStates.set(playerId, {
      lastInput: input,
      lastPosition: currentPosition,
      lastUpdateTime: now,
      violations: 0
    })
    return true
  }

  const timeDelta = (now - state.lastUpdateTime) / 1000 // seconds

  // Check 1: Reasonable update frequency (not too fast)
  // Allow faster updates for smooth gameplay
  if (timeDelta < 0.001) { // Changed from 0.01 to 0.001 (1ms minimum)
    state.violations++
    console.warn(`Player ${playerId}: Input too frequent`)
    return false
  }

  // Check 2: Angle change is within turn speed limits
  const angleDiff = Math.abs(input.angle - state.lastInput.angle)
  const maxAngleChange = GAME_CONFIG.SNAKE_TURN_SPEED * 10 // Allow some buffer
  
  if (angleDiff > maxAngleChange && angleDiff < (Math.PI * 2 - maxAngleChange)) {
    state.violations++
    console.warn(`Player ${playerId}: Impossible angle change ${angleDiff}`)
    if (state.violations > 5) {
      return false // Block after repeated violations
    }
  }

  // Check 3: Position hasn't teleported
  const distance = Math.sqrt(
    Math.pow(currentPosition.x - state.lastPosition.x, 2) +
    Math.pow(currentPosition.y - state.lastPosition.y, 2)
  )
  
  const maxSpeed = input.boosting ? GAME_CONFIG.SNAKE_BOOST_SPEED : GAME_CONFIG.SNAKE_BASE_SPEED
  const maxDistance = maxSpeed * timeDelta * 200 // Increased buffer for lag (was 100)
  
  if (distance > maxDistance) {
    state.violations++
    console.warn(`Player ${playerId}: Teleport detected ${distance} > ${maxDistance}`)
    if (state.violations > 10) { // Increased tolerance (was 3)
      return false
    }
  }

  // Check 4: Not stuck (no input for too long)
  if (timeDelta > 5 && distance < 10) {
    console.warn(`Player ${playerId}: Possible AFK or stuck`)
  }

  // Update state
  state.lastInput = input
  state.lastPosition = currentPosition
  state.lastUpdateTime = now
  
  // Decay violations over time
  if (state.violations > 0 && timeDelta > 1) {
    state.violations = Math.max(0, state.violations - 1)
  }

  return true
  */
}

export function clearPlayerState(playerId: string): void {
  playerStates.delete(playerId)
}

export function getPlayerViolations(playerId: string): number {
  return playerStates.get(playerId)?.violations || 0
}
