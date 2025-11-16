# ✅ READY TO GO!

## What's Done ✅

### 1. Branding Fixed
- ✅ Changed to "SLITHER.WORLD"
- ✅ Removed "Solana Edition"
- ✅ Cleaned icon (no logos)
- ✅ Simplified banner

### 2. Wallet Created
- ✅ Treasury wallet generated
- ✅ Private key in .env
- ✅ Public key: `BZ5iLt4omL8f1pxvpvubx2zGTy7PGt72fA4uruvkZdSs`
- ✅ Configured for devnet

### 3. Everything Else
- ✅ Dependencies installed
- ✅ Code complete
- ✅ Documentation ready

---

## What You Need To Do (5 Minutes)

### Step 1: Setup Database (2 min)

**Go to:** https://neon.tech

1. Click "Sign Up" (use GitHub)
2. Create new project
3. Copy connection string (looks like `postgresql://...`)
4. Keep it ready for next step

### Step 2: Setup Redis (2 min)

**Go to:** https://upstash.com

1. Click "Sign Up" (use GitHub)
2. Create Redis database
3. Copy connection string (looks like `redis://...`)
4. Keep it ready for next step

### Step 3: Configure & Run (1 min)

```bash
# Run the setup script
bash scripts/setup-services.sh

# It will ask for your connection strings
# Paste them when prompted

# Then start the app:
npm run dev        # Terminal 1
npm run server     # Terminal 2

# Open browser:
open http://localhost:3000
```

---

## Alternative: Manual Setup

If you prefer to edit .env manually:

1. Open `.env` file
2. Replace these lines:
   ```bash
   DATABASE_URL=your_neondb_connection_string
   REDIS_URL=your_upstash_connection_string
   ```
3. Save file
4. Run:
   ```bash
   npm run db:generate
   npm run db:migrate
   npm run dev
   npm run server  # new terminal
   ```

---

## Quick Links

- **NeonDB**: https://neon.tech (free PostgreSQL)
- **Upstash**: https://upstash.com (free Redis)
- **Solana Faucet**: https://faucet.solana.com (get devnet SOL)

---

## Your Wallet Info

```
Public Key:  BZ5iLt4omL8f1pxvpvubx2zGTy7PGt72fA4uruvkZdSs
Private Key: ✅ Saved in .env
Network:     Devnet (safe for testing)
Balance:     Get SOL from faucet
```

To fund wallet:
```bash
# Option 1: Command line (may hit rate limit)
solana airdrop 2 BZ5iLt4omL8f1pxvpvubx2zGTy7PGt72fA4uruvkZdSs --url devnet

# Option 2: Web faucet (always works)
# Visit: https://faucet.solana.com
# Paste: BZ5iLt4omL8f1pxvpvubx2zGTy7PGt72fA4uruvkZdSs
```

---

## Troubleshooting

### "Cannot connect to database"
- Check DATABASE_URL is correct
- Make sure you copied the full connection string from NeonDB

### "Redis connection failed"
- Check REDIS_URL is correct
- Make sure you copied the full connection string from Upstash

### "Port already in use"
```bash
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
```

---

## 🎉 That's It!

Just setup NeonDB + Upstash (5 minutes), then you're playing!

**Total time:** 5 minutes to running game 🚀
