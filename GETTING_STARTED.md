# 🚀 Getting Started with Slither.io Solana Edition

Welcome! This guide will get you up and running in **5 minutes**.

---

## ⚡ Quick Start (5 Minutes)

### Step 1: Install Dependencies (1 min)

```bash
npm install
```

### Step 2: Setup Environment (2 min)

```bash
# Copy environment template
cp .env.example .env

# Edit with your values
nano .env
```

**Minimum required:**
```bash
DATABASE_URL=postgresql://localhost:5432/slither
REDIS_URL=redis://localhost:6379
NEXT_PUBLIC_SOLANA_RPC=https://api.devnet.solana.com
SOLANA_TREASURY_PRIVATE_KEY=your_key_here
NEXT_PUBLIC_USDC_MINT=4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

### Step 3: Initialize Database (1 min)

```bash
npm run db:generate
npm run db:migrate
```

### Step 4: Start Servers (1 min)

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Game Server:**
```bash
npm run server
```

### Step 5: Open Browser

Visit: http://localhost:3000

**Done! 🎉**

---

## 📋 Prerequisites

Before you start, make sure you have:

- ✅ Node.js 18+ installed
- ✅ PostgreSQL running
- ✅ Redis running
- ✅ Solana wallet (Phantom/Solflare)

### Don't have these? Quick setup:

**macOS:**
```bash
# Install Homebrew if needed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node

# Install PostgreSQL
brew install postgresql@15
brew services start postgresql@15

# Install Redis
brew install redis
brew services start redis
```

**Ubuntu/Debian:**
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql

# Install Redis
sudo apt-get install redis-server
sudo systemctl start redis
```

**Windows:**
- Download Node.js from [nodejs.org](https://nodejs.org)
- Download PostgreSQL from [postgresql.org](https://postgresql.org)
- Download Redis from [redis.io](https://redis.io)

---

## 🎮 First Time Setup

### 1. Generate Solana Wallet

```bash
# Install Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

# Generate wallet
solana-keygen new --outfile treasury.json

# Get private key
cat treasury.json | jq -r '.privateKey' | base58

# Copy this to SOLANA_TREASURY_PRIVATE_KEY in .env
```

### 2. Fund Wallet (Devnet)

```bash
# Get wallet address
solana-keygen pubkey treasury.json

# Airdrop SOL
solana airdrop 2 $(solana-keygen pubkey treasury.json) --url devnet
```

### 3. Create Database

```bash
# Create database
createdb slither

# Or using psql
psql -c "CREATE DATABASE slither;"
```

### 4. Test Connection

```bash
# Test database
psql slither -c "SELECT 1;"

# Test Redis
redis-cli ping
# Should return: PONG
```

---

## 🧪 Verify Installation

### Check Services

```bash
# Check Node.js
node --version
# Should be v18.x.x or higher

# Check npm
npm --version
# Should be 9.x.x or higher

# Check PostgreSQL
psql --version
# Should be 15.x or higher

# Check Redis
redis-cli --version
# Should be 7.x or higher
```

### Test API

```bash
# Start servers first, then:

# Test health endpoint
curl http://localhost:3000/api/health

# Should return:
# {"status":"healthy","timestamp":"...","services":{"database":"connected","api":"running"}}
```

---

## 🎯 Development Workflow

### Daily Development

```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend
npm run server

# Terminal 3: Database Studio (optional)
npm run db:studio
```

### Making Changes

1. **Edit files** in `app/`, `components/`, or `server/`
2. **Save** - Hot reload happens automatically
3. **Test** in browser at http://localhost:3000
4. **Check logs** in terminal

### Common Commands

```bash
# Install new package
npm install package-name

# Update dependencies
npm update

# Check TypeScript errors
npx tsc --noEmit

# Format code (if you have prettier)
npx prettier --write .

# Build for production
npm run build

# Start production server
npm start
```

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 3001
lsof -ti:3001 | xargs kill -9
```

### Database Connection Failed

```bash
# Check PostgreSQL is running
pg_isready

# Restart PostgreSQL
brew services restart postgresql@15  # macOS
sudo systemctl restart postgresql    # Linux

# Check connection string
echo $DATABASE_URL
```

### Redis Connection Failed

```bash
# Check Redis is running
redis-cli ping

# Restart Redis
brew services restart redis          # macOS
sudo systemctl restart redis         # Linux

# Check connection string
echo $REDIS_URL
```

### Module Not Found

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors

```bash
# Regenerate types
npm run db:generate

# Check for errors
npx tsc --noEmit
```

---

## 📚 Next Steps

### Learn the Codebase

1. **Read Documentation**
   - [README.md](README.md) - Overview
   - [ARCHITECTURE.md](ARCHITECTURE.md) - System design
   - [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Features

2. **Explore Code**
   - `shared/types.ts` - Type definitions
   - `shared/physics.ts` - Game physics
   - `server/game/GameInstance.ts` - Game logic
   - `components/GameCanvas.tsx` - Rendering

3. **Try Examples**
   - Connect wallet
   - Create lobby
   - Play game
   - Check stats

### Customize

1. **Change Lobby Fees**
   - Edit `shared/types.ts` (LOBBY_TYPES)

2. **Adjust Game Speed**
   - Edit `shared/types.ts` (GAME_CONFIG)

3. **Modify UI**
   - Edit `app/page.tsx`
   - Edit `app/globals.css`

4. **Add Features**
   - Create new API route
   - Add new component
   - Update game logic

### Deploy

When ready for production:

1. **Read Deployment Guide**
   - [DEPLOYMENT.md](DEPLOYMENT.md)

2. **Setup Services**
   - Vercel (frontend)
   - Fly.io (backend)
   - NeonDB (database)
   - Upstash (Redis)

3. **Configure Domain**
   - Point DNS to Vercel
   - Setup SSL with Cloudflare

4. **Launch!**
   - Test thoroughly
   - Monitor logs
   - Celebrate 🎉

---

## 🎓 Learning Resources

### Solana Development
- [Solana Docs](https://docs.solana.com)
- [Solana Cookbook](https://solanacookbook.com)
- [Anchor Framework](https://www.anchor-lang.com)

### Next.js
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

### Game Development
- [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [Socket.io Docs](https://socket.io/docs)
- [Game Loop Pattern](https://gameprogrammingpatterns.com/game-loop.html)

### Database
- [Drizzle ORM](https://orm.drizzle.team)
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com)
- [Redis Commands](https://redis.io/commands)

---

## 💡 Tips & Best Practices

### Development

1. **Use TypeScript**: Catch errors early
2. **Test Locally**: Before deploying
3. **Read Logs**: Understand what's happening
4. **Git Commits**: Commit often, meaningful messages
5. **Documentation**: Update docs when changing code

### Performance

1. **Monitor Tick Rate**: Should stay at 60Hz
2. **Check Memory**: Watch for leaks
3. **Optimize Queries**: Use indexes
4. **Cache Wisely**: Use Redis for hot data
5. **Profile Code**: Find bottlenecks

### Security

1. **Never Commit**: Private keys or secrets
2. **Validate Input**: Server-side always
3. **Rate Limit**: Prevent abuse
4. **Update Deps**: Keep packages current
5. **Test Payments**: On devnet first

---

## 🤝 Getting Help

### Documentation
- Check [FAQ.md](FAQ.md) first
- Read [TESTING.md](TESTING.md) for testing
- See [ARCHITECTURE.md](ARCHITECTURE.md) for design

### Community
- GitHub Issues: Bug reports
- Discord: Community chat (coming soon)
- Twitter: @SlitherSolana

### Support
- Email: support@slither.world
- Response time: 24-48 hours

---

## ✅ Checklist

Before you start developing:

- [ ] Node.js 18+ installed
- [ ] PostgreSQL running
- [ ] Redis running
- [ ] Dependencies installed (`npm install`)
- [ ] Environment configured (`.env`)
- [ ] Database initialized (`npm run db:migrate`)
- [ ] Servers running (`npm run dev` + `npm run server`)
- [ ] Browser open (http://localhost:3000)
- [ ] Wallet connected
- [ ] Documentation read

**All checked?** You're ready to build! 🚀

---

## 🎉 Welcome to the Team!

You now have a complete, production-ready multiplayer game with blockchain integration. The possibilities are endless:

- Add new game modes
- Create tournaments
- Build mobile app
- Launch token
- Grow community

**Happy coding!** 🐍⚡

---

**Need help?** Check [FAQ.md](FAQ.md) or open an issue on GitHub.

**Ready to deploy?** Read [DEPLOYMENT.md](DEPLOYMENT.md).

**Want to contribute?** PRs welcome!
