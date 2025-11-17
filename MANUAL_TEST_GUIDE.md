# Manual Testing Guide

## 🧪 How to Test the Shared Lobby System

### Quick Test (2 minutes)

1. **Open your deployed site**: https://slitherworld-eg387l902-realdoomsmans-projects.vercel.app

2. **First Player**:
   - Enter nickname: `Player1`
   - Enter wallet: `7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU`
   - Click "Free Play"
   - **Note the Lobby ID** shown in waiting room (e.g., "Lobby: abc12345...")

3. **Second Player** (open in incognito/private window):
   - Enter nickname: `Player2`
   - Enter wallet: `8yKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsV`
   - Click "Free Play"
   - **Check if Lobby ID matches Player1's**

### ✅ Success Indicators

If working correctly, you should see:

**In Player 1's window:**
- Waiting Room appears
- Shows "1 / 5" initially
- Then updates to "2 / 5" when Player 2 joins
- Player list shows both "Player1" and "Player2"
- Progress bar at 40%

**In Player 2's window:**
- Same Lobby ID as Player 1
- Shows "2 / 5"
- Both players visible in list
- Progress bar at 40%

### ❌ Failure Indicators

If NOT working:
- Different Lobby IDs for each player
- Player count stays at "1 / 5"
- Only see yourself in player list
- Console shows errors

### 🔍 Check Browser Console

Press F12 and look for:
```
Socket connected, authenticating...
Authenticated, joining lobby: [lobby-id]
Lobby update received: {players: [...], playerCount: 2, ...}
```

### 📊 What Each Test Proves

| Test | What It Checks |
|------|----------------|
| Same Lobby ID | Shared lobby system works |
| Player count updates | Real-time sync works |
| Both names in list | Socket communication works |
| Progress bar fills | UI updates correctly |

### 🚀 Full Test (5 players)

To test game start:
1. Open 5 browser windows (use incognito)
2. Join with 5 different nicknames
3. All should see same lobby
4. At 5/5, game should start in 3 seconds
5. Waiting room disappears
6. Game canvas appears

### 🐛 Common Issues

**Issue: "Connecting..." never changes**
- Check if server is running
- Verify NEXT_PUBLIC_SOCKET_URL is set
- Check browser console for errors

**Issue: Different lobby IDs**
- Database might have old lobbies
- Try clearing database or wait for lobbies to expire
- Check server logs

**Issue: Can't see other players**
- Socket connection issue
- Check if both players connected to same server
- Verify lobby_update event is being sent

### 📝 Test Results Template

Copy this and fill it out:

```
Date: ___________
Time: ___________

✅ Homepage loads
✅ Can enter nickname and wallet
✅ "Free Play" button works
✅ Waiting room appears
✅ Shows correct lobby ID
✅ Player count shows correctly
✅ Second player joins SAME lobby
✅ Both players visible in list
✅ Progress bar updates
✅ Game starts at 5 players

Issues found:
- 
- 
- 

Notes:
- 
```

### 🎯 Quick Verification

Run this in browser console on the waiting room page:
```javascript
// Check if lobby info is updating
console.log('Lobby Players:', window.lobbyPlayers)
console.log('Lobby Info:', window.lobbyInfo)
```

### 📞 If Something's Wrong

1. Check browser console (F12)
2. Check server logs (if you have access)
3. Try clearing browser cache
4. Try different browser
5. Check if server is running

---

## Expected Behavior Summary

**Correct Flow:**
1. Player clicks "Free Play"
2. API checks for existing FREE lobby
3. If exists → Join it
4. If not → Create new one
5. All players join same lobby
6. Game starts when 5 players join

**What You Should See:**
- One lobby ID shared by all FREE players
- Different lobby ID for PAID players
- Real-time player list updates
- Progress bar filling up
- Game starting automatically

---

Good luck testing! 🎮
