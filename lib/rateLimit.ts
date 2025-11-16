// Simple in-memory rate limiter
// For production, use Redis-based rate limiting

interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key)
    }
  }
}, 5 * 60 * 1000)

export interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

export function rateLimit(identifier: string, config: RateLimitConfig): boolean {
  const now = Date.now()
  const entry = rateLimitStore.get(identifier)

  if (!entry || now > entry.resetTime) {
    // New window
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + config.windowMs,
    })
    return true
  }

  if (entry.count >= config.maxRequests) {
    // Rate limit exceeded
    return false
  }

  // Increment count
  entry.count++
  return true
}

export function getRateLimitInfo(identifier: string): {
  remaining: number
  resetTime: number
} | null {
  const entry = rateLimitStore.get(identifier)
  if (!entry) return null

  return {
    remaining: Math.max(0, entry.count),
    resetTime: entry.resetTime,
  }
}

// Preset configurations
export const RATE_LIMITS = {
  AUTH: { maxRequests: 5, windowMs: 15 * 60 * 1000 }, // 5 per 15 minutes
  LOBBY_CREATE: { maxRequests: 10, windowMs: 60 * 1000 }, // 10 per minute
  API_GENERAL: { maxRequests: 100, windowMs: 60 * 1000 }, // 100 per minute
  PAYMENT: { maxRequests: 3, windowMs: 60 * 1000 }, // 3 per minute
}
