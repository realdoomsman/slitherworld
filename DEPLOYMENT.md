# Deployment Guide

## Prerequisites

1. **Solana Wallet**: Treasury wallet with USDC for payouts
2. **Database**: PostgreSQL instance (NeonDB recommended)
3. **Redis**: Redis instance for session management
4. **Domain**: Custom domain (e.g., slither.world)

## Step 1: Database Setup (NeonDB)

1. Create account at [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string
4. Update `DATABASE_URL` in environment variables

```bash
# Run migrations
npm run db:generate
npm run db:migrate
```

## Step 2: Redis Setup

### Option A: Redis Cloud
1. Create account at [redis.com](https://redis.com)
2. Create database
3. Copy connection string
4. Update `REDIS_URL`

### Option B: Upstash
1. Create account at [upstash.com](https://upstash.com)
2. Create Redis database
3. Copy REST URL
4. Update `REDIS_URL`

## Step 3: Solana Configuration

### Generate Treasury Wallet
```bash
solana-keygen new --outfile treasury.json
```

### Get Private Key in Base58
```bash
cat treasury.json | jq -r '.privateKey' | base58
```

### Fund Treasury
- Send SOL for transaction fees
- Send USDC for payouts

### Environment Variables
```bash
SOLANA_TREASURY_PRIVATE_KEY=<base58_private_key>
NEXT_PUBLIC_SOLANA_RPC=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_USDC_MINT=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
```

## Step 4: Frontend Deployment (Vercel)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `DATABASE_URL`
   - `REDIS_URL`
   - `NEXT_PUBLIC_SOLANA_RPC`
   - `NEXT_PUBLIC_USDC_MINT`
   - `NEXT_PUBLIC_SOCKET_URL` (will be backend URL)

4. Deploy

## Step 5: Backend Deployment (Fly.io)

### Install Fly CLI
```bash
curl -L https://fly.io/install.sh | sh
```

### Login
```bash
fly auth login
```

### Create App
```bash
fly launch --name slither-game-server
```

### Set Secrets
```bash
fly secrets set DATABASE_URL="postgresql://..."
fly secrets set REDIS_URL="redis://..."
fly secrets set SOLANA_TREASURY_PRIVATE_KEY="..."
fly secrets set NEXT_PUBLIC_SOLANA_RPC="https://api.mainnet-beta.solana.com"
fly secrets set NEXT_PUBLIC_USDC_MINT="EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
```

### Deploy
```bash
fly deploy
```

### Scale for Production
```bash
fly scale count 2  # 2 instances
fly scale vm shared-cpu-2x  # 2 CPU, 4GB RAM
```

## Step 6: Alternative Backend (Render)

1. Create account at [render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub repository
4. Configure:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run server`
5. Add environment variables
6. Deploy

## Step 7: Cloudflare Setup

### DNS Configuration
1. Add domain to Cloudflare
2. Update nameservers
3. Add DNS records:
   - `A` record: `@` → Vercel IP
   - `CNAME` record: `api` → Backend URL

### Security Rules
1. Enable DDoS protection
2. Set up rate limiting:
   - `/api/*` → 100 requests/minute
   - `/socket.io/*` → 1000 requests/minute
3. Enable Bot Fight Mode

### SSL/TLS
1. Set SSL/TLS mode to "Full (strict)"
2. Enable "Always Use HTTPS"
3. Enable HTTP/3

## Step 8: Monitoring

### Sentry (Error Tracking)
```bash
npm install @sentry/nextjs
```

Add to `next.config.js`:
```javascript
const { withSentryConfig } = require('@sentry/nextjs')

module.exports = withSentryConfig(nextConfig, {
  org: 'your-org',
  project: 'slither-solana',
})
```

### Datadog (Performance)
1. Create account at [datadoghq.com](https://datadoghq.com)
2. Install agent on backend
3. Monitor:
   - Game tick rate
   - Player count
   - Transaction success rate
   - API latency

## Step 9: Testing

### Load Testing
```bash
npm install -g artillery

# Create load-test.yml
artillery run load-test.yml
```

### Test Checklist
- [ ] Wallet authentication works
- [ ] Payment flow completes
- [ ] Game starts with minimum players
- [ ] 60Hz tick rate maintained
- [ ] Winner receives payout
- [ ] Mobile controls work
- [ ] Multiple lobbies run simultaneously

## Step 10: Launch

1. Test on devnet first
2. Run beta with small lobbies ($5)
3. Monitor for 24 hours
4. Gradually enable larger lobbies
5. Announce on Twitter/Discord

## Scaling Considerations

### Database
- Enable connection pooling
- Add read replicas for analytics
- Index frequently queried fields

### Backend
- Auto-scale based on player count
- Use sticky sessions for Socket.io
- Consider Redis Pub/Sub for multi-instance

### Frontend
- Enable Vercel Edge Network
- Optimize images and assets
- Implement service worker for offline support

## Cost Estimates (Monthly)

- **Vercel Pro**: $20
- **NeonDB**: $19 (Starter)
- **Redis Cloud**: $10 (30MB)
- **Fly.io**: $15-50 (depending on scale)
- **Cloudflare**: Free (Pro $20 optional)
- **Domain**: $12/year

**Total**: ~$75-100/month for 500 concurrent users

## Security Checklist

- [ ] Treasury private key stored securely
- [ ] Rate limiting enabled
- [ ] CORS configured correctly
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (Drizzle ORM)
- [ ] XSS prevention
- [ ] HTTPS enforced
- [ ] Session tokens expire
- [ ] One game per wallet enforced
- [ ] Payment verification on-chain

## Support

For deployment issues:
- Check logs: `fly logs` or Vercel dashboard
- Monitor database: `npm run db:studio`
- Test payments on devnet first
- Join Discord for community support
