import { Redis } from '@upstash/redis'

// In-memory fallback for development
const inMemoryCache = new Map<string, { value: any; expiry: number }>()

let redis: Redis | null = null

try {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.REDIS_URL
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN
  
  if (redisUrl && redisToken) {
    // Upstash Redis REST API
    redis = new Redis({
      url: redisUrl,
      token: redisToken,
    })
    console.log('✅ Upstash Redis connected')
  } else {
    console.log('⚠️  Using in-memory cache (Redis not configured)')
  }
} catch (error) {
  console.warn('⚠️  Redis connection failed, using in-memory cache:', error)
}

export async function setCache(key: string, value: any, ttl: number = 3600): Promise<void> {
  if (redis) {
    await redis.set(key, JSON.stringify(value), { ex: ttl })
  } else {
    inMemoryCache.set(key, { value, expiry: Date.now() + ttl * 1000 })
  }
}

export async function getCache(key: string): Promise<any | null> {
  if (redis) {
    const data = await redis.get(key)
    return data ? (typeof data === 'string' ? JSON.parse(data) : data) : null
  } else {
    const cached = inMemoryCache.get(key)
    if (!cached) return null
    if (Date.now() > cached.expiry) {
      inMemoryCache.delete(key)
      return null
    }
    return cached.value
  }
}

export async function deleteCache(key: string): Promise<void> {
  if (redis) {
    await redis.del(key)
  } else {
    inMemoryCache.delete(key)
  }
}

export async function checkActiveGame(walletAddress: string): Promise<boolean> {
  const key = `active_game:${walletAddress}`
  if (redis) {
    const exists = await redis.exists(key)
    return exists > 0
  } else {
    const cached = inMemoryCache.get(key)
    if (!cached) return false
    if (Date.now() > cached.expiry) {
      inMemoryCache.delete(key)
      return false
    }
    return true
  }
}

export async function setActiveGame(walletAddress: string, lobbyId: string): Promise<void> {
  const key = `active_game:${walletAddress}`
  if (redis) {
    await redis.set(key, lobbyId, { ex: 3600 })
  } else {
    inMemoryCache.set(key, { value: lobbyId, expiry: Date.now() + 3600000 })
  }
}

export async function clearActiveGame(walletAddress: string): Promise<void> {
  const key = `active_game:${walletAddress}`
  if (redis) {
    await redis.del(key)
  } else {
    inMemoryCache.delete(key)
  }
}

export default redis
