# 🧪 TEST YOUR GAME NOW!

## ✅ Servers Running

- Frontend: http://localhost:3000 ✅
- Game Server: Port 3004 ✅

---

## 🎮 How to Test

### Step 1: Open Homepage
```
http://localhost:3000
```

### Step 2: Enter Nickname
- Type any nickname (2-20 characters)
- Buttons will become enabled

### Step 3: Click "Free Play"
- No payment needed
- Tests the flow

### Step 4: Enter Wallet Address
- Use any Solana wallet address
- Can be fake for testing: `7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU`

### Step 5: Click "Join Game"
- Should redirect to game
- Socket connects
- Waits for 5 players

### Step 6: Test with Multiple Windows
- Open 5 browser windows
- Enter different nicknames
- All join same FREE lobby
- Game should start!

---

## 💰 Treasury Wallet

**Address**: `DDps8rsxmUJzvAzzf5prFYzdTKL3PLo5vDbi2kdfbpjR`

**Current Balance**: 0 SOL

**Fund with**: 5-10 SOL before launching

**Check Balance**:
```bash
solana balance DDps8rsxmUJzvAzzf5prFYzdTKL3PLo5vDbi2kdfbpjR
```

**Solscan**:
https://solscan.io/account/DDps8rsxmUJzvAzzf5prFYzdTKL3PLo5vDbi2kdfbpjR

---

## 🔍 Troubleshooting

### "Just loading"
- Check if nickname is entered
- Buttons are disabled until nickname entered
- Check browser console (F12) for errors

### Can't join game
- Check game server is running (port 3004)
- Check SOCKET_URL in .env
- Check browser console for connection errors

### Payment verification fails
- Make sure using mainnet RPC
- Check transaction on Solscan
- Wait 30 seconds for confirmation

---

## ✅ Mainnet Configuration

```bash
# .env file
NEXT_PUBLIC_SOLANA_RPC=https://api.mainnet-beta.solana.com ✅
SOLANA_TREASURY_PRIVATE_KEY=configured ✅
DEV_MODE=false ✅
```

Everything is set to MAINNET! 🎉

---

## 🚀 Ready to Deploy

Once testing looks good:

1. **Fund treasury** (5-10 SOL)
2. **Push to GitHub** (already done ✅)
3. **Deploy to Render** (should auto-deploy)
4. **Update env vars** in Render dashboard
5. **Test on production**
6. **Launch!** 🎉

---

**Status**: Ready for Testing
**Servers**: Running
**Mainnet**: Configured
**Treasury**: DDps8rsxmUJzvAzzf5prFYzdTKL3PLo5vDbi2kdfbpjR
