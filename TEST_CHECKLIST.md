# Testing Checklist for Slither.World

## 🧪 Test the Shared Lobby System

### Test 1: Single Player Flow
1. Open the site in browser
2. Enter nickname: "TestPlayer1"
3. Enter wallet: `7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU`
4. Click "Free Play"
5. **Expected**: Should see waiting room with:
   - "Connecting..." then "Waiting Room"
   - Player count: 1/5
   - Your name in the player list with "YOU" badge
   - Progress bar at 20%

### Test 2: Multiple Players (Same Lobby)
1. Open site in **incognito/private window**
2. Enter nickname: "TestPlayer2"
3. Enter different wallet address
4. Click "Free Play"
5. **Expected**: 
   - Should join THE SAME lobby as TestPlayer1
   - Player count: 2/5
   - Both players visible in the list
   - Progress bar at 40%

### Test 3: Check Console Logs
Open browser console (F12) and look for:
- ✅ "Socket connected, authenticating..."
- ✅ "Authenticated, joining lobby: [lobby-id]"
- ✅ "Lobby update received: {...}"
- ✅ "Player joining existing FREE lobby: [same-lobby-id]"

### Test 4: Game Start (Need 5 Players)
Open 5 browser windows/tabs (use incognito):
1. Join with 5 different nicknames
2. **Expected**:
   - All 5 see each other in waiting room
   - Progress bar reaches 100%
   - Message: "🎉 Starting soon..."
   - Game starts after 3 seconds

### Test 5: Paid Lobby (Separate)
1. Click "Paid Game" instead
2. **Expected**:
   - Different lobby ID than FREE lobby
   - Shows payment screen
   - Separate from free players

## 🐛 Common Issues to Check

### Issue: Blank/Loading Screen
- Check browser console for errors
- Verify NEXT_PUBLIC_SOCKET_URL is set correctly
- Check if server is running

### Issue: Not Joining Same Lobby
- Check console for "Created new FREE lobby" vs "joining existing"
- Should only see "Created new" once, then "joining existing"

### Issue: Players Not Showing in List
- Check console for "Lobby update received"
- Verify socket connection is established
- Check server logs

## 📊 What to Look For

### Success Indicators:
- ✅ Multiple players see same lobby ID
- ✅ Player list updates in real-time
- ✅ Progress bar fills as players join
- ✅ Game starts automatically at 5 players
- ✅ No duplicate lobbies created

### Failure Indicators:
- ❌ Each player gets different lobby ID
- ❌ Player list stays empty
- ❌ "Connecting..." never changes
- ❌ Console shows socket errors
- ❌ Multiple "Created new lobby" messages

## 🔧 Quick Fixes

### If Socket Won't Connect:
```bash
# Check if server is running
curl https://your-server.com/health

# Check environment variable
echo $NEXT_PUBLIC_SOCKET_URL
```

### If Lobbies Not Shared:
- Check database for multiple waiting lobbies
- Verify the lobby/create API is using the new code
- Check server logs for "joining existing" messages

## 📝 Test Results

Record your findings:
- [ ] Homepage loads correctly
- [ ] Wallet input works
- [ ] Waiting room appears
- [ ] Player list shows correctly
- [ ] Multiple players join same lobby
- [ ] Progress bar updates
- [ ] Game starts at 5 players
- [ ] Paid lobby is separate from free

---

## Quick Test Command

To test the API directly:
```bash
# Test lobby creation
curl -X POST https://your-site.com/api/lobby/create \
  -H "Content-Type: application/json" \
  -d '{
    "lobbyType": "FREE",
    "nickname": "TestPlayer",
    "walletAddress": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"
  }'

# Should return same lobbyId if called twice
```
