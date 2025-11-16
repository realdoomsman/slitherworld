# Quick Start Guide

Get Slither.io Solana Edition running locally in 5 minutes.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL running locally
- Redis running locally
- Solana CLI (optional, for wallet generation)

## Step 1: Clone & Install

```bash
# Clone the repository
git clone <your-repo-url>
cd slither-solana

# Install dependencies
npm install
```

## Step 2: Setup Database

### Option A: Local PostgreSQL

```bash
# Create database
createdb slither

# Set connection string
export DATABASE_URL="postgresql://localhost:5432/slither"
```

### Option B: NeonDB (Free Tier)

1. Sign up at [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string
4. Add to `.env`

## Step 3: Setup Redis

### Option A: Local Redis

```bash
# Start Redis
redis-server

# Set connection string
export REDIS_URL="redis://localhost:6379"
```

### Option B: Upstash (Free Tier)

1. Sign up at [upstash.com](https://upstash.com)
2. Create Redis database
3. Copy connection string
4. Add to `.env`

## Step 4: Configure Environment

```bash
# Copy example env file
cp .env.example .env

# Edit .env with your values
nano .env
```

### Minimum Required Variables

```bash
# Database
DATABASE_URL=postgresql://localhost:5432/slither

# Redis
REDIS_URL=redis://localhost:6379

# Solana (use devnet for testing)
NEXT_PUBLIC_SOLANA_RPC=https://api.devnet.solana.com
SOLANA_TREASURY_PRIVATE_KEY=your_base58_private_key
NEXT_PUBLIC_USDC_MINT=4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU

# Server
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
PORT=3001
```

### Generate Treasury Wallet

```bash
# Install Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

# Generate new wallet
solana-keygen new --outfile treasury.json

# Get private key in base58
cat treasury.json | jq -r '.privateKey' | base58

# Fund wallet (devnet)
solana airdrop 2 $(solana-keygen pubkey treasury.json) --url devnet
```

## Step 5: Initialize Database

```bash
# Generate schema
npm run db:generate

# Run migrations
npm run db:migrate

# (Optional) Open Drizzle Studio to view tables
npm run db:studio
```

## Step 6: Start Development Servers

### Terminal 1: Frontend

```bash
npm run dev
```

Frontend will be available at http://localhost:3000

### Terminal 2: Game Server

```bash
npm run server
```

Game server will be available at http://localhost:3001

## Step 7: Test the Application

1. Open http://localhost:3000
2. Click "Connect Wallet" (use Phantom or Solflare)
3. Click "Sign to Authenticate"
4. Choose a lobby type
5. (For testing, you can skip payment on devnet)

## Development Tips

### Hot Reload

Both frontend and backend support hot reload:
- Frontend: Automatic with Next.js
- Backend: Using `tsx watch`

### View Logs

```bash
# Frontend logs
# Check browser console

# Backend logs
# Check terminal running `npm run server`

# Database queries
# Enable in .env: DEBUG=drizzle:*
```

### Reset Database

```bash
# Drop all tables
psql $DATABASE_URL -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

# Re-run migrations
npm run db:migrate
```

### Clear Redis Cache

```bash
redis-cli FLUSHALL
```

## Testing

### Run Unit Tests

```bash
npm test
```

### Test Authentication

```bash
curl -X POST http://localhost:3000/api/auth/challenge \
  -H "Content-Type: application/json" \
  -d '{"walletAddress":"YOUR_WALLET_ADDRESS"}'
```

### Test Health Check

```bash
curl http://localhost:3000/api/health
```

### Monitor Game Server

```bash
# Check Socket.io connections
curl http://localhost:3001/socket.io/
```

## Common Issues

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

# Check connection string
echo $DATABASE_URL
```

### Redis Connection Failed

```bash
# Check Redis is running
redis-cli ping

# Should return: PONG
```

### Wallet Not Connecting

1. Make sure you have Phantom or Solflare installed
2. Switch to devnet in wallet settings
3. Clear browser cache
4. Try incognito mode

### Payment Verification Failed

1. Make sure you're on devnet
2. Check treasury wallet has SOL
3. Verify USDC mint address is correct for devnet
4. Check transaction on Solscan

## Development Workflow

### 1. Make Changes

Edit files in:
- `app/` - Frontend pages
- `components/` - React components
- `server/` - Backend logic
- `shared/` - Shared code

### 2. Test Locally

```bash
# Run both servers
npm run dev
npm run server
```

### 3. Check for Errors

```bash
# TypeScript errors
npx tsc --noEmit

# Linting
npx eslint .
```

### 4. Commit Changes

```bash
git add .
git commit -m "Your message"
git push
```

## Next Steps

- Read [README.md](README.md) for full documentation
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for production setup
- Review [TESTING.md](TESTING.md) for testing strategies
- See [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) for architecture

## Need Help?

- Check existing GitHub Issues
- Join Discord community
- Read Solana documentation
- Review Socket.io docs

## Useful Commands

```bash
# Install dependencies
npm install

# Start frontend
npm run dev

# Start backend
npm run server

# Generate DB schema
npm run db:generate

# Run migrations
npm run db:migrate

# Open DB studio
npm run db:studio

# Build for production
npm run build

# Start production
npm start

# Run tests
npm test
```

## Environment Variables Reference

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| DATABASE_URL | PostgreSQL connection string | Yes | - |
| REDIS_URL | Redis connection string | Yes | - |
| NEXT_PUBLIC_SOLANA_RPC | Solana RPC endpoint | Yes | - |
| SOLANA_TREASURY_PRIVATE_KEY | Treasury wallet private key | Yes | - |
| NEXT_PUBLIC_USDC_MINT | USDC token mint address | Yes | - |
| NEXT_PUBLIC_SOCKET_URL | Game server URL | Yes | - |
| PORT | Game server port | No | 3001 |
| STAKING_CONTRACT_ADDRESS | Staking contract | No | - |
| SLITHER_TOKEN_MINT | SLITHER token mint | No | - |

## Resources

- [Solana Docs](https://docs.solana.com)
- [Next.js Docs](https://nextjs.org/docs)
- [Socket.io Docs](https://socket.io/docs)
- [Drizzle ORM Docs](https://orm.drizzle.team)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

Happy coding! 🐍⚡
