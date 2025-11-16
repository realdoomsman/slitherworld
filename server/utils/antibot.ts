interface MovementPattern {
  positions: Array<{ x: number; y: number; timestamp: number }>
  lastCheck: number
}

const playerPatterns = new Map<string, MovementPattern>()

export function trackMovement(playerId: string, x: number, y: number): void {
  const now = Date.now()
  
  if (!playerPatterns.has(playerId)) {
    playerPatterns.set(playerId, {
      positions: [],
      lastCheck: now,
    })
  }

  const pattern = playerPatterns.get(playerId)!
  pattern.positions.push({ x, y, timestamp: now })

  // Keep only last 60 positions (1 second at 60Hz)
  if (pattern.positions.length > 60) {
    pattern.positions.shift()
  }
}

export function detectAbnormalMovement(playerId: string): boolean {
  const pattern = playerPatterns.get(playerId)
  if (!pattern || pattern.positions.length < 10) return false

  const positions = pattern.positions
  
  // Check for impossible velocity
  for (let i = 1; i < positions.length; i++) {
    const prev = positions[i - 1]
    const curr = positions[i]
    
    const dx = curr.x - prev.x
    const dy = curr.y - prev.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    const timeDiff = (curr.timestamp - prev.timestamp) / 1000
    
    const velocity = distance / timeDiff
    
    // Max velocity with boost is 6 units/tick * 60 ticks = 360 units/sec
    if (velocity > 400) {
      return true
    }
  }

  // Check for perfect patterns (bot-like behavior)
  const angles: number[] = []
  for (let i = 2; i < positions.length; i++) {
    const p1 = positions[i - 2]
    const p2 = positions[i - 1]
    const p3 = positions[i]
    
    const angle1 = Math.atan2(p2.y - p1.y, p2.x - p1.x)
    const angle2 = Math.atan2(p3.y - p2.y, p3.x - p2.x)
    
    angles.push(Math.abs(angle2 - angle1))
  }

  // Check if all angles are suspiciously similar
  if (angles.length > 20) {
    const avgAngle = angles.reduce((a, b) => a + b, 0) / angles.length
    const variance = angles.reduce((sum, angle) => sum + Math.pow(angle - avgAngle, 2), 0) / angles.length
    
    // Very low variance indicates bot
    if (variance < 0.001) {
      return true
    }
  }

  return false
}

export function clearPlayerPattern(playerId: string): void {
  playerPatterns.delete(playerId)
}
