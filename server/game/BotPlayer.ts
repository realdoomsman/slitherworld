import { PlayerInput } from '../../shared/types'

export class BotPlayer {
  private id: string
  private currentAngle: number = Math.random() * Math.PI * 2
  private targetAngle: number = this.currentAngle
  private changeDirectionTimer: number = 0
  private boostTimer: number = 0

  constructor(id: string) {
    this.id = id
  }

  public getInput(): PlayerInput {
    // Change direction randomly every 2-5 seconds
    this.changeDirectionTimer++
    if (this.changeDirectionTimer > 60 + Math.random() * 180) {
      this.targetAngle = Math.random() * Math.PI * 2
      this.changeDirectionTimer = 0
    }

    // Smoothly turn towards target angle
    let angleDiff = this.targetAngle - this.currentAngle
    if (angleDiff > Math.PI) angleDiff -= Math.PI * 2
    if (angleDiff < -Math.PI) angleDiff += Math.PI * 2
    
    this.currentAngle += angleDiff * 0.05

    // Boost randomly
    this.boostTimer++
    const boosting = this.boostTimer % 300 < 60 // Boost for 1 second every 5 seconds

    return {
      angle: this.currentAngle,
      boosting,
    }
  }

  public getId(): string {
    return this.id
  }
}
