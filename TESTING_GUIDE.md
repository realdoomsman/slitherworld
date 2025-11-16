# Testing Guide - Slither.World

## Dev Mode (Single Player Testing)

Dev mode is currently **ENABLED** in your `.env` file, which allows you to test the game solo!

### What Dev Mode Does:
- ✅ Games start with just **1 player** (you!)
- ✅ Countdown reduced to 1 second
- ✅ Perfect for testing gameplay mechanics
- ✅ Visual indicator on home page

### How to Test Solo:

1. **Open the game**: http://localhost:3000

2. **Connect your wallet** (Phantom/Solflare)

3. **Sign to authenticate**

4. **Join Free Play lobby** (no payment needed!)

5. **Game starts in 1 second** - you'll be playing solo!

6. **Test the controls**:
   - Mouse: Move to control direction
   - Space/Click: Boost
   - Eat pellets to grow
   - Avoid hitting yourself

---

## Multi-Player Testing

### Option 1: Multiple Browser Windows

1. Open **2-3 browser windows** (or incognito tabs)
2. Use **different wallets** in each window
3. All join the **same lobby type**
4. Game starts when min players join (or 1 in dev mode)

### Option 2: Multiple Devices

1. Open game on **phone + computer**
2. Connect different wallets
3. Join same lobby
4. Test real multiplayer!

---

## Disable Dev Mode (Production Testing)

To test with real player requirements:

1. Edit `.env`:
   ```bash
   DEV_MODE=false
   NEXT_PUBLIC_DEV_MODE=false
   ```

2. Restart servers:
   ```bash
   # Stop current processes
   # Then restart:
   npm run dev
   npm run server
   ```

3. Now lobbies require:
   - **Free Play**: 10 players
   - **Micro**: 15 players
   - **Small**: 15 players
   - **Medium**: 15 players
   - **Large**: 15 players
   - **Whale**: 30 players

---

## Testing Payments

### Free Lobby (No Payment)
- Join "Free Play"
- No transaction needed
- Winner gets 0.05 SOL from treasury

### Paid Lobbies (SOL Payment)
1. Make sure you have devnet SOL:
   ```bash
   solana airdrop 1 YOUR_WALLET_ADDRESS --url devnet
   ```

2. Join a paid lobby (Micro, Small, etc.)

3. Approve the SOL transfer transaction

4. Game starts when enough players join

---

## Testing Winner Payouts

1. **Play a game** (solo in dev mode is fine)

2. **Win the game** (last snake alive)

3. **Check your wallet** - you should receive:
   - Free lobby: 0.05 SOL
   - Paid lobby: 80% of pot

4. **Check transaction** on Solana Explorer (devnet)

---

## Quick Test Checklist

- [ ] Home page loads
- [ ] Wallet connects
- [ ] Authentication works
- [ ] Can join free lobby
- [ ] Game starts (1 second in dev mode)
- [ ] Controls work (mouse + boost)
- [ ] Can eat pellets
- [ ] Snake grows
- [ ] Can die (hit yourself)
- [ ] Winner payout received

---

## Troubleshooting

### Game won't start
- Check dev mode is enabled in `.env`
- Make sure you joined a lobby
- Check browser console for errors

### Can't connect wallet
- Install Phantom or Solflare
- Make sure wallet is on devnet
- Try refreshing the page

### Payment fails
- Get devnet SOL: `solana airdrop 1 YOUR_ADDRESS --url devnet`
- Check wallet has enough balance
- Try again in a few seconds

### Server not responding
- Check both servers are running:
  ```bash
  lsof -i :3000  # Frontend
  lsof -i :3004  # Game server
  ```
- Restart if needed

---

## Current Setup

**Dev Mode**: ✅ ENABLED  
**Frontend**: http://localhost:3000  
**Game Server**: Port 3004  
**Network**: Solana Devnet  
**Treasury**: 39PvZMnEsxrbtVqRZfRuRkeDPMQJVYcX1PAwRBjd5fao

---

## Next Steps

1. **Test solo** with dev mode
2. **Test multiplayer** with multiple windows
3. **Test payments** with devnet SOL
4. **Disable dev mode** for production testing
5. **Deploy** when ready!

Happy testing! 🎮
