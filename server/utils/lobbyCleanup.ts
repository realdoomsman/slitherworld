import { db } from '../db'
import { matches } from '../db/schema'
import { eq, and, lt } from 'drizzle-orm'

// Clean up abandoned lobbies
export async function cleanupAbandonedLobbies() {
  try {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000)
    
    // Find lobbies that are still "waiting" after 30 minutes
    const abandonedLobbies = await db
      .select()
      .from(matches)
      .where(
        and(
          eq(matches.status, 'waiting'),
          lt(matches.startedAt, thirtyMinutesAgo)
        )
      )

    if (abandonedLobbies.length > 0) {
      // Mark as cancelled
      for (const lobby of abandonedLobbies) {
        await db
          .update(matches)
          .set({ status: 'cancelled', endedAt: new Date() })
          .where(eq(matches.id, lobby.id))
      }
      
      console.log(`Cleaned up ${abandonedLobbies.length} abandoned lobbies`)
    }
  } catch (error) {
    console.error('Error cleaning up lobbies:', error)
  }
}

// Clean up old completed matches (older than 30 days)
export async function cleanupOldMatches() {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    
    const result = await db
      .delete(matches)
      .where(
        and(
          eq(matches.status, 'completed'),
          lt(matches.endedAt, thirtyDaysAgo)
        )
      )

    console.log('Cleaned up old matches')
  } catch (error) {
    console.error('Error cleaning up old matches:', error)
  }
}

// Run cleanup every 10 minutes
export function startLobbyCleanup() {
  // Initial cleanup
  cleanupAbandonedLobbies()
  
  // Periodic cleanup
  setInterval(cleanupAbandonedLobbies, 10 * 60 * 1000) // Every 10 minutes
  
  // Daily cleanup of old matches
  setInterval(cleanupOldMatches, 24 * 60 * 60 * 1000) // Every 24 hours
  
  console.log('Lobby cleanup service started')
}
