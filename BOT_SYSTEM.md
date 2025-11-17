# 🤖 Bot System - Demo Mode

## Overview

The game now includes AI-controlled bots that automatically join FREE lobbies (demo mode) to provide instant gameplay without waiting for other players.

## How It Works

### Automatic Bot Addition
- When a player joins a **FREE lobby** (demo mode), 9 bots are automatically added
- This gives instant 10-player gameplay for testing and demo purposes
- Bots only appear in FREE lobbies (entry fee = 0 SOL)

### Bot Intelligence

Bots have three difficulty levels:
- **Easy (30%)**: Basic movement, less reactive
- **Medium (50%)**: Balanced AI, seeks pellets
- **Hard (20%)**: Smart AI, avoids danger, strategic boosting

### Bot Behaviors

1. **Wall Avoidance**: Bots detect and avoid map boundaries
2. **Pellet Seeking**: Bots move towards nearby pellets
3. **Danger Detection**: Bots avoid other snakes within 150 units
4. **Smart Boosting**: Bots boost when chasing pellets or escaping danger
5. **Random Movement**: Bots change direction periodically for unpredictability

## Implementation Details

### Files Modified
- `server/game/BotPlayer.ts` - Enhanced AI with smart behaviors
- `server/game/LobbyManager.ts` - Auto-add bots to FREE lobbies
- `server/index.ts` - Update bot inputs in game loop

### Bot AI Features

```typescript
// Bot decision making
1. Check for nearby danger (other snakes)
2. Check for walls
3. Look for nearby pellets
4. Random exploration

// Boosting logic
- Only boost if length >= 15
- Boost when chasing pellets
- Boost when escaping danger
```

### Bot Naming
- Bot IDs: `bot_[uuid]`
- Bot wallets: `BOT_0`, `BOT_1`, etc.
- Bots are filtered from leaderboards and stats

## User Experience

### Demo Mode Flow
1. Player clicks "Try Demo Mode"
2. FREE lobby is created
3. 9 bots instantly join
4. Game starts in 1 second
5. Player can test gameplay immediately

### Benefits
- **Instant Play**: No waiting for other players
- **Test Mechanics**: Learn controls and gameplay
- **No Risk**: Free to play, no wallet required
- **Realistic**: Bots provide competitive gameplay

## Configuration

### Adjust Bot Count
```typescript
// In LobbyManager.ts
if (isFreeGame && lobby.players.length === 1) {
  this.addBotsToLobby(lobbyId, 9) // Change number here
}
```

### Adjust Bot Difficulty
```typescript
// In LobbyManager.ts
const difficulty = rand < 0.3 ? 0.3 : rand < 0.8 ? 0.6 : 0.9
// Adjust percentages: easy, medium, hard
```

### Bot AI Parameters
```typescript
// In BotPlayer.ts
const dangerDistance = 150  // How far bots detect danger
const searchRadius = 300    // How far bots look for pellets
const margin = 200          // Wall avoidance distance
```

## Future Enhancements

Potential improvements:
- [ ] Named bots (e.g., "Bot Alice", "Bot Bob")
- [ ] Bot avatars/colors
- [ ] Difficulty selection for demo mode
- [ ] Bot learning from player behavior
- [ ] Team-based bot cooperation
- [ ] Bot chat messages (fun flavor text)

## Testing

To test bots:
1. Go to homepage
2. Click "Try Demo Mode"
3. Observe 9 bots join instantly
4. Watch bot behaviors:
   - Wall avoidance
   - Pellet collection
   - Danger avoidance
   - Boosting patterns

## Notes

- Bots only appear in FREE lobbies
- Bots don't receive payouts
- Bots are excluded from leaderboards
- Bots provide realistic competition
- Bot difficulty varies for balanced gameplay

---

**Status**: ✅ Implemented and Active
**Applies To**: FREE lobbies only (demo mode)
**Player Experience**: Instant 10-player gameplay
