# 🔴 Redis Setup Guide

## Why You Need Redis

Redis is used for:
- **Session storage** - Keep users logged in
- **Active game tracking** - Prevent duplicate games
- **Rate limiting** - Prevent abuse
- **Caching** - Speed up the app

**Currently**: Your app uses in-memory cache (works but resets on server restart)
**Production**: Need persistent Redis (Upstash)

---

## Option 1: Upstash (Recommended) ⭐

### Why Upstash?
- ✅ **FREE tier** (10,000 commands/day)
- ✅ Serverless (pay per use)
- ✅ Global edge network
- ✅ Easy setup (5 minutes)
- ✅ No credit card for free tier

### Step-by-Step Setup

#### 1. Create Account (2 minutes)
```bash
# Go to: https://console.upstash.com/
# Click "Sign Up"
# Use GitHub, Google, or Email
```

#### 2. Create Database (2 minutes)
```bash
# After login:
# 1. Click "Create Database"
# 2. Name: "slither-production"
# 3. Type: Regional (cheaper) or Global (faster)
# 4. Region: Choose closest to your users
#    - US West: us-west-1
#    - US East: us-east-1
#    - Europe: eu-west-1
# 5. Click "Create"
```

#### 3. Get Connection URL (1 minute)
```bash
# On database page:
# 1. Click on your database
# 2. Scroll to "REST API" section
# 3. Copy "UPSTASH_REDIS_REST_URL"
# 
# It looks like:
# https://your-db-name.upstash.io
```

#### 4. Add to Environment (1 minute)

**For Development** (`.env`):
```bash
# Add this line:
REDIS_URL=https://your-db-name.upstash.io
```

**For Production** (`.env.production`):
```bash
# Add this line:
REDIS_URL=https://your-db-name.upstash.io
```

**For Vercel**:
```bash
# In Vercel dashboard:
# Settings → Environment Variables → Add
# Name: REDIS_URL
# Value: https://your-db-name.upstash.io
```

**For Fly.io**:
```bash
fly secrets set REDIS_URL="https://your-db-name.upstash.io"
```

#### 5. Test It (1 minute)
```bash
# Restart your servers
npm run dev
npm run server

# Check logs - should see no Redis errors
# Try connecting wallet and signing in
# Sessions should persist now!
```

---

## Option 2: Redis Cloud (Alternative)

### Setup
```bash
# 1. Go to: https://redis.com/try-free/
# 2. Sign up (free tier: 30MB)
# 3. Create database
# 4. Get connection string
# 5. Add to .env:
REDIS_URL=redis://default:password@host:port
```

---

## Option 3: Local Redis (Development Only)

### Install Redis Locally

**macOS:**
```bash
# Install via Homebrew
brew install redis

# Start Redis
brew services start redis

# Or run manually
redis-server
```

**Linux:**
```bash
# Ubuntu/Debian
sudo apt-get install redis-server
sudo systemctl start redis

# Or run manually
redis-server
```

**Windows:**
```bash
# Use WSL2 or Docker
docker run -d -p 6379:6379 redis
```

### Configure for Local
```bash
# In .env:
REDIS_URL=redis://localhost:6379
```

---

## Verify Redis is Working

### Method 1: Check Logs
```bash
# Start your server
npm run server

# You should see:
# "Redis connected" or similar
# No "Redis not available" warnings
```

### Method 2: Test Session
```bash
# 1. Start app: npm run dev
# 2. Connect wallet
# 3. Sign message
# 4. Refresh page
# 5. Should still be logged in ✅
```

### Method 3: Check Upstash Dashboard
```bash
# Go to Upstash dashboard
# Click on your database
# See "Commands" graph
# Should show activity when you use the app
```

---

## Current Redis Usage in Your App

Your app uses Redis for:

### 1. Session Storage
```typescript
// lib/session.ts
// Stores: sessionToken → walletAddress
// Expires: 35 minutes
```

### 2. Active Game Tracking
```typescript
// server/utils/redis.ts
// Prevents users from joining multiple games
// Key: active_game:walletAddress
```

### 3. Rate Limiting
```typescript
// lib/rateLimit.ts
// Tracks API request counts
// Prevents abuse
```

---

## Troubleshooting

### Error: "Redis not available"
```bash
# This is OK for development!
# App falls back to in-memory cache
# But for production, you NEED Redis

# Fix:
# 1. Create Upstash account
# 2. Get REDIS_URL
# 3. Add to .env
# 4. Restart server
```

### Error: "Connection refused"
```bash
# If using local Redis:
# Make sure Redis is running:
redis-cli ping
# Should return: PONG

# If not running:
brew services start redis  # macOS
sudo systemctl start redis # Linux
```

### Error: "Authentication failed"
```bash
# Check your REDIS_URL format:
# Upstash: https://your-db.upstash.io
# Redis Cloud: redis://user:pass@host:port
# Local: redis://localhost:6379
```

### Sessions not persisting
```bash
# 1. Check REDIS_URL is set
echo $REDIS_URL

# 2. Check Redis is connected
# Look for "Redis connected" in logs

# 3. Check Upstash dashboard
# Should see commands being executed
```

---

## Production Checklist

Before going live:
- [ ] Upstash account created
- [ ] Database created
- [ ] REDIS_URL added to `.env.production`
- [ ] REDIS_URL added to Vercel
- [ ] REDIS_URL added to Fly.io secrets
- [ ] Tested session persistence
- [ ] Tested rate limiting
- [ ] Checked Upstash dashboard shows activity

---

## Cost Breakdown

### Upstash Free Tier
- **Commands**: 10,000/day
- **Storage**: 256 MB
- **Bandwidth**: 200 MB/day
- **Cost**: $0

**Estimated usage for 100 users/day:**
- Sessions: ~200 commands
- Rate limiting: ~500 commands
- Active games: ~100 commands
- **Total**: ~800 commands/day
- **Well within free tier!** ✅

### Upstash Paid (if you exceed free tier)
- **Pay-as-you-go**: $0.20 per 100K commands
- **For 1M commands/month**: ~$2/month
- **Very affordable!**

---

## Quick Commands

### Check Redis Connection
```bash
# If using Upstash REST API
curl https://your-db.upstash.io/ping

# If using local Redis
redis-cli ping
```

### View All Keys (debugging)
```bash
# Local Redis
redis-cli keys "*"

# Upstash (via dashboard)
# Go to Data Browser tab
```

### Clear All Data (if needed)
```bash
# Local Redis
redis-cli FLUSHALL

# Upstash (via dashboard)
# Data Browser → Flush Database
```

---

## Summary

### For Development (Right Now)
```bash
# Option 1: Use in-memory (already working)
# No setup needed, but sessions reset on restart

# Option 2: Use Upstash free tier (recommended)
# 5 minutes setup, persistent sessions
```

### For Production (Before Launch)
```bash
# MUST use Upstash or Redis Cloud
# In-memory won't work with multiple servers
# Sessions would be lost on restart
```

### Recommended Setup
```bash
# 1. Create Upstash account (free)
# 2. Create database
# 3. Copy REDIS_URL
# 4. Add to .env and .env.production
# 5. Add to Vercel and Fly.io
# 6. Done! ✅
```

---

## Next Steps

1. **Right Now** (Optional):
   - Create Upstash account
   - Add REDIS_URL to `.env`
   - Test locally

2. **Before Production** (Required):
   - Create Upstash account (if not done)
   - Add REDIS_URL to `.env.production`
   - Add to Vercel environment variables
   - Add to Fly.io secrets

---

## Need Help?

### Upstash Support
- Docs: https://docs.upstash.com/redis
- Discord: https://discord.gg/upstash
- Email: support@upstash.com

### Your Redis Code
- Session management: `lib/session.ts`
- Redis utils: `server/utils/redis.ts`
- Rate limiting: `lib/rateLimit.ts`

---

**TL;DR**: 
1. Go to https://console.upstash.com/
2. Create free account
3. Create database
4. Copy REDIS_URL
5. Add to `.env`
6. Done! ✅

---

Last Updated: November 16, 2025
Difficulty: ⭐ Easy (5 minutes)
Cost: 💰 FREE (free tier)
Required: ✅ Yes (for production)
