# 📋 TODO: Remaining Tasks

## ✅ What's Done

- ✅ Homepage with nickname input
- ✅ 2 lobbies (FREE + PAID)
- ✅ Payment verification system
- ✅ Wallet address validation
- ✅ Game mechanics (snake, pellets, collisions)
- ✅ Real-time multiplayer (Socket.io)
- ✅ Mobile controls
- ✅ Spectator mode
- ✅ Database schema
- ✅ Mainnet configuration

---

## ⚠️ What Needs to Be Done

### 1. **Connect Lobby to Game Server**
**Status**: ❌ Not connected

**Issue**: 
- Lobby page creates lobby in database
- But doesn't connect to Socket.io game server
- Players can't actually join the game

**Fix Needed**:
- Update `server/index.ts` to handle wallet-based authentication
- Connect lobby creation to LobbyManager
- Allow players to join with nickname + wallet
- Start game when enough players join

**Files to Update**:
- `server/index.ts` - Socket authentication
- `app/game/page.tsx` - Pass wallet + nickname
- `components/GameCanvas.tsx` - Use nickname in game

---

### 2. **Update GameCanvas for New System**
**Status**: ⚠️ Needs update

**Issue**:
- GameCanvas expects wallet authentication
- Needs to work with nickname system
- Should display nicknames instead of wallet addresses

**Fix Needed**:
- Remove wallet connection requirement
- Accept nickname from localStorage
- Display nicknames in game UI
- Show nicknames in leaderboard

**Files to Update**:
- `components/GameCanvas.tsx`

---

### 3. **Post-Game Payouts**
**Status**: ⚠️ Needs update

**Issue**:
- Payout system expects wallet from session
- Needs to use wallet from lobby creation
- Must send SOL to winner's wallet

**Fix Needed**:
- Store wallet address in match_players table
- Retrieve winner's wallet after game
- Send payout to correct wallet
- Handle FREE lobby prize (0.05 SOL)

**Files to Update**:
- `server/index.ts` - handleGameEnd function
- Database schema - ensure wallet stored

---

### 4. **Lobby Waiting Room**
**Status**: ❌ Missing

**Issue**:
- After payment verification, no waiting room
- Players don't see other players joining
- No countdown before game starts

**Fix Needed**:
- Create waiting room UI
- Show player count (e.g., "3/10 players")
- Display joined players list
- Countdown when minimum reached
- Auto-redirect to game when starting

**Files to Create/Update**:
- `app/lobby/[id]/page.tsx` - Waiting room
- Or update `app/lobby/page.tsx` to show waiting state

---

### 5. **Database Integration**
**Status**: ⚠️ Partial

**Issue**:
- Lobby creates match in database
- But doesn't create match_players entries
- Winner wallet not stored for payout

**Fix Needed**:
- Insert match_players when player joins
- Store wallet address in match_players
- Link payment verification to database
- Update match status when game starts/ends

**Files to Update**:
- `app/api/lobby/verify-payment/route.ts`
- `server/index.ts`

---

### 6. **Error Handling**
**Status**: ⚠️ Basic only

**Needs**:
- Handle payment verification failures gracefully
- Show clear error messages
- Allow retry on failed verification
- Handle disconnections during game
- Refund logic if game doesn't start

---

### 7. **Testing**
**Status**: ❌ Not tested

**Needs**:
- Test on devnet first
- Test payment flow end-to-end
- Test with multiple players
- Test game mechanics
- Test payout system
- Test edge cases (disconnects, etc.)

---

## 🎯 Priority Order

### HIGH PRIORITY (Must have for launch)

1. **Connect Lobby to Game Server** ⭐⭐⭐
   - Most critical
   - Without this, game doesn't work
   - ~2 hours work

2. **Update GameCanvas** ⭐⭐⭐
   - Needed for gameplay
   - Show nicknames
   - ~1 hour work

3. **Post-Game Payouts** ⭐⭐⭐
   - Core feature
   - Winner needs to get paid
   - ~1 hour work

4. **Database Integration** ⭐⭐
   - Store player data
   - Track matches
   - ~1 hour work

### MEDIUM PRIORITY (Nice to have)

5. **Lobby Waiting Room** ⭐⭐
   - Better UX
   - Shows progress
   - ~2 hours work

6. **Error Handling** ⭐
   - Polish
   - Better UX
   - ~1 hour work

### LOW PRIORITY (Can add later)

7. **Testing** ⭐
   - Important but can iterate
   - Ongoing

---

## 📝 Detailed Next Steps

### Step 1: Connect Lobby to Game Server

**In `server/index.ts`**:
```typescript
socket.on('join_lobby', async (data: { 
  lobbyId: string, 
  nickname: string,
  walletAddress: string 
}) => {
  // Verify payment in database
  // Add player to lobby
  // Start game when enough players
})
```

**In `app/game/page.tsx`**:
```typescript
// Get lobby ID from URL
// Get nickname + wallet from localStorage
// Connect to socket
// Send join_lobby event
```

### Step 2: Update GameCanvas

**Remove**:
- Wallet authentication
- Session token

**Add**:
- Nickname from localStorage
- Display nicknames in UI
- Show nicknames in kill feed

### Step 3: Fix Payouts

**In `server/index.ts` handleGameEnd**:
```typescript
// Get winner's wallet from database
// Send payout to that wallet
// Handle FREE lobby (0.05 SOL prize)
```

---

## ⏱️ Time Estimate

- **High Priority**: ~5 hours
- **Medium Priority**: ~3 hours
- **Low Priority**: Ongoing

**Total to MVP**: ~5 hours of focused work

---

## 🚀 After These Are Done

You'll have a fully functional game:
- ✅ Players can join lobbies
- ✅ Payment verification works
- ✅ Games start automatically
- ✅ Real-time multiplayer gameplay
- ✅ Winners get paid
- ✅ Everything tracked in database

---

**Status**: 70% Complete
**Remaining**: Core integration work
**ETA to Launch**: 5 hours
