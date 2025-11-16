# 🚀 Complete Setup Guide

## ✅ What I've Done For You

1. ✅ **Branding Updated**
   - Changed to "SLITHER.WORLD"
   - Removed "Solana Edition"
   - Cleaned up icon (removed logos)
   - Simplified banner

2. ✅ **Solana Wallet Created**
   - Generated treasury wallet
   - Private key added to .env
   - Public key: `BZ5iLt4omL8f1pxvpvubx2zGTy7PGt72fA4uruvkZdSs`
   - Configured for devnet

3. ✅ **Dependencies Installed**
   - All npm packages ready
   - 1,380 packages installed

---

## 🎯 Next: Setup Database & Redis (2 Options)

### Option A: Free Cloud Services (Recommended - 5 minutes)

#### 1. Setup NeonDB (Free PostgreSQL)

1. Go to https://neon.tech
2. Click "Sign Up" (use GitHub/Google)
3. Create new project
4. Copy the connection string
5. Update `.env`:
   ```bash
   DATABASE_URL=postgresql://user:pass@host/dbname
   ```

#### 2. Setup Upstash (Free Redis)

1. Go to https://upstash.com
2. Sign up (use GitHub/Google)
3. Create Redis database
4. Copy connection string
5. Update `.env`:
   ```bash
   REDIS_URL=redis://default:pass@host:port
   ```

---

### Option B: Local Services (If you prefer local)

#### Install PostgreSQL
```bash
# macOS
brew install postgresql@15
brew services start postgresql@15
createdb slither

# Linux
sudo apt install postgresql
sudo systemctl start postgresql
sudo -u postgres createdb slither
```

#### Install Redis
```bash
# macOS
brew install redis
brew services start redis

# Linux
sudo apt install redis-server
sudo systemctl start redis
```

Your `.env` is already configured for local:
```bash
DATABASE_URL=postgresql://localhost:5432/slither
REDIS_URL=redis://localhost:6379
```

---

## 🚀 After Database & Redis Setup

### 1. Initialize Database
```bash
npm run db:generate
npm run db:migrate
```

### 2. Start the App

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Game Server:**
```bash
npm run server
```

### 3. Open Browser
```bash
open http://localhost:3000
```

---

## 💰 Fund Your Wallet (Devnet)

Your wallet needs SOL for transaction fees:

```bash
# Try airdrop (may hit rate limit)
solana airdrop 2 BZ5iLt4omL8f1pxvpvubx2zGTy7PGt72fA4uruvkZdSs --url devnet

# Or use faucet
# Visit: https://faucet.solana.com
# Paste: BZ5iLt4omL8f1pxvpvubx2zGTy7PGt72fA4uruvkZdSs
```

---

## 🔍 Check Status

```bash
# Check setup
bash scripts/check-setup.sh

# Check wallet balance
solana balance BZ5iLt4omL8f1pxvpvubx2zGTy7PGt72fA4uruvkZdSs --url devnet

# View database
npm run db:studio
```

---

## ⚡ Quick Setup (Cloud Services)

1. **NeonDB** (2 min)
   - https://neon.tech → Sign up → Create project → Copy connection string

2. **Upstash** (2 min)
   - https://upstash.com → Sign up → Create Redis → Copy connection string

3. **Update .env** (1 min)
   - Paste both connection strings

4. **Initialize** (1 min)
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

5. **Run** (1 min)
   ```bash
   npm run dev        # Terminal 1
   npm run server     # Terminal 2
   ```

**Total: 7 minutes to running app!**

---

## 🆘 Troubleshooting

### "Cannot connect to database"
- Check DATABASE_URL in .env
- Make sure NeonDB project is active
- Or install PostgreSQL locally

### "Redis connection failed"
- Check REDIS_URL in .env
- Make sure Upstash database is active
- Or install Redis locally

### "Airdrop failed"
- Rate limit hit, try again in 1 hour
- Or use web faucet: https://faucet.solana.com

### "Port already in use"
```bash
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
```

---

## 📋 Your Configuration

```bash
# Wallet
Public Key:  BZ5iLt4omL8f1pxvpvubx2zGTy7PGt72fA4uruvkZdSs
Private Key: ✅ Configured in .env
Network:     Devnet (safe for testing)

# Services Needed
Database:    ⚠️  Setup NeonDB or PostgreSQL
Redis:       ⚠️  Setup Upstash or Redis
```

---

## 🎉 You're Almost There!

Just setup database and Redis (5 minutes), then you're ready to play!

**Recommended:** Use NeonDB + Upstash (both free, no installation needed)
