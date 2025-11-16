# 🚀 Production Launch Guide

## Pre-Launch Checklist

### ✅ What's Already Done
- [x] Game engine complete
- [x] Payment system implemented
- [x] Wallet authentication
- [x] UI/UX polished
- [x] Mobile support
- [x] Spectator mode
- [x] Rate limiting added
- [x] Error handling improved
- [x] Session management
- [x] Loading states
- [x] Mobile menu
- [x] 404/Error pages

### 🔴 Critical - Must Do Before Launch

#### 1. Setup Production Services (30 minutes)

**A. Upstash Redis**
```bash
# 1. Go to https://console.upstash.com/redis
# 2. Create new database
# 3. Copy the REST URL
# 4. Add to .env.production
```

**B. Generate Mainnet Wallet**
```bash
# Install Solana CLI if not installed
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

# Generate new wallet
solana-keygen new --outfile treasury-mainnet.json

# Get the private key (base58)
cat treasury-mainnet.json | node -e "
const fs = require('fs');
const bs58 = require('bs58');
const data = JSON.parse(fs.readFileSync(0, 'utf-8'));
console.log(bs58.encode(Buffer.from(data)));
"

# IMPORTANT: Save this private key securely!
# IMPORTANT: Backup treasury-mainnet.json to a safe location!
```

**C. Fund Treasury Wallet**
```bash
# Get wallet address
solana-keygen pubkey treasury-mainnet.json

# Send SOL to this address (for transaction fees)
# Recommended: 1-2 SOL to start

# Verify balance
solana balance treasury-mainnet.json --url mainnet-beta
```

#### 2. Create Production Environment File

Create `.env.production`:
```bash
# Database (same as development)
DATABASE_URL=your_neondb_connection_string

# Redis (Upstash)
REDIS_URL=your_upstash_redis_url

# Solana MAINNET
NEXT_PUBLIC_SOLANA_RPC=https://api.mainnet-beta.solana.com
SOLANA_TREASURY_PRIVATE_KEY=your_mainnet_wallet_private_key
NEXT_PUBLIC_USDC_MINT=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v

# Production URLs (update after deployment)
NEXT_PUBLIC_APP_URL=https://slither.world
NEXT_PUBLIC_SOCKET_URL=https://api.slither.world

# Server
PORT=3001

# Optional: Token (if created)
SLITHER_TOKEN_MINT=your_token_mint_address
STAKING_CONTRACT_ADDRESS=your_staking_contract_address

# Disable dev mode
NEXT_PUBLIC_DEV_MODE=false
```

#### 3. Deploy Frontend to Vercel (10 minutes)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Add environment variables in Vercel dashboard:
# - DATABASE_URL
# - REDIS_URL
# - NEXT_PUBLIC_SOLANA_RPC
# - NEXT_PUBLIC_SOCKET_URL
# - NEXT_PUBLIC_USDC_MINT
# - NEXT_PUBLIC_APP_URL
# - NEXT_PUBLIC_DEV_MODE=false
```

#### 4. Deploy Game Server to Fly.io (15 minutes)

Create `fly.toml`:
```toml
app = "slither-game-server"
primary_region = "sjc"

[build]
  builder = "heroku/buildpacks:20"

[env]
  PORT = "3001"
  NODE_ENV = "production"

[[services]]
  internal_port = 3001
  protocol = "tcp"

  [[services.ports]]
    port = 80
    handlers = ["http"]

  [[services.ports]]
    port = 443
    handlers = ["tls", "http"]

[http_service]
  internal_port = 3001
  force_https = true
  auto_stop_machines = false
  auto_start_machines = true
  min_machines_running = 1
```

Deploy:
```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Login
fly auth login

# Launch app
fly launch --name slither-game-server --no-deploy

# Set secrets
fly secrets set DATABASE_URL="your_database_url"
fly secrets set REDIS_URL="your_redis_url"
fly secrets set SOLANA_TREASURY_PRIVATE_KEY="your_private_key"
fly secrets set NEXT_PUBLIC_SOLANA_RPC="https://api.mainnet-beta.solana.com"

# Deploy
fly deploy

# Check status
fly status
fly logs
```

#### 5. Configure Domain (10 minutes)

**For Vercel (Frontend):**
1. Go to Vercel dashboard → Your project → Settings → Domains
2. Add `slither.world`
3. Add DNS records as instructed

**For Fly.io (Game Server):**
```bash
# Add custom domain
fly certs add api.slither.world

# Add DNS record:
# Type: CNAME
# Name: api
# Value: slither-game-server.fly.dev
```

**Update Environment Variables:**
```bash
# In Vercel dashboard, update:
NEXT_PUBLIC_SOCKET_URL=https://api.slither.world
NEXT_PUBLIC_APP_URL=https://slither.world

# Redeploy
vercel --prod
```

---

## 🧪 Testing Before Launch (Critical!)

### 1. Smoke Tests
```bash
# Test health endpoint
curl https://api.slither.world/health

# Should return: {"status":"healthy",...}
```

### 2. Manual Testing Checklist
- [ ] Visit https://slither.world
- [ ] Connect wallet (Phantom/Solflare)
- [ ] Sign authentication message
- [ ] Try to join FREE lobby
- [ ] Verify game starts
- [ ] Test movement and controls
- [ ] Test on mobile device
- [ ] Test spectator mode
- [ ] Check leaderboard loads
- [ ] Check profile page

### 3. Payment Testing (CRITICAL!)
```bash
# Start with small amounts!
# Test with 0.01 SOL first
```

- [ ] Create paid lobby (Micro - 0.05 SOL)
- [ ] Complete payment transaction
- [ ] Verify lobby starts
- [ ] Play and win game
- [ ] Verify payout received
- [ ] Check transaction in database

### 4. Load Testing
```bash
# Use Artillery or similar
npm install -g artillery

# Create test-load.yml:
# config:
#   target: 'https://slither.world'
#   phases:
#     - duration: 60
#       arrivalRate: 10
# scenarios:
#   - flow:
#       - get:
#           url: "/"

artillery run test-load.yml
```

---

## 🔒 Security Checklist

### Before Going Live
- [ ] Treasury wallet private key stored securely (NOT in git)
- [ ] Backup of treasury wallet saved offline
- [ ] Environment variables not in repository
- [ ] Rate limiting enabled (✅ Done)
- [ ] CORS configured properly
- [ ] HTTPS enforced
- [ ] Database connection secure
- [ ] Session tokens expire properly (✅ Done)
- [ ] Input validation on all endpoints (✅ Done)

### Monitoring Setup
- [ ] Setup error tracking (Sentry recommended)
- [ ] Setup uptime monitoring (UptimeRobot/Pingdom)
- [ ] Setup log aggregation
- [ ] Setup alerts for critical errors

---

## 📊 Post-Launch Monitoring

### Day 1 - Watch Closely
- Monitor error logs every hour
- Check transaction success rate
- Watch for any payment issues
- Monitor server performance
- Check user feedback

### Week 1 - Daily Checks
- Review error logs daily
- Check payment success rate
- Monitor concurrent users
- Review user feedback
- Check database performance

### Metrics to Track
- Total users (wallet connections)
- Games played
- Revenue (SOL wagered)
- Average game length
- Concurrent players (peak)
- Error rate
- Payment success rate
- Mobile vs Desktop usage

---

## 🚨 Emergency Procedures

### If Server Crashes
```bash
# Check status
fly status

# View logs
fly logs

# Restart
fly apps restart slither-game-server

# Scale up if needed
fly scale count 2
```

### If Payments Fail
1. Check treasury wallet balance
2. Check Solana network status
3. Review transaction logs
4. Contact affected users
5. Manual refunds if needed

### If Database Issues
1. Check NeonDB dashboard
2. Review connection pool
3. Check for long-running queries
4. Scale up if needed

### Emergency Contacts
- Vercel Support: https://vercel.com/support
- Fly.io Support: https://fly.io/docs/about/support/
- NeonDB Support: https://neon.tech/docs/introduction/support
- Upstash Support: https://upstash.com/docs/common/help/support

---

## 💰 Cost Breakdown

### Monthly Costs
| Service | Plan | Cost |
|---------|------|------|
| Vercel | Pro | $20 |
| Fly.io | 1x shared-cpu-2x | $15-30 |
| NeonDB | Starter | $19 |
| Upstash Redis | Pay-as-you-go | $5-10 |
| Domain | - | $1 |
| **Total** | | **$60-80/month** |

### One-Time Costs
- Domain registration: $10-15/year
- Treasury wallet funding: 1-2 SOL (~$100-200)
- Token creation (optional): ~$10
- **Total**: ~$120-225

---

## 🎯 Launch Day Plan

### T-24 Hours
- [ ] Final code review
- [ ] All tests passing
- [ ] Production environment configured
- [ ] Monitoring setup complete
- [ ] Emergency procedures documented

### T-12 Hours
- [ ] Deploy to production
- [ ] Run smoke tests
- [ ] Test payment flow
- [ ] Verify all features work
- [ ] Check mobile experience

### T-6 Hours
- [ ] Final security review
- [ ] Backup all data
- [ ] Prepare announcement
- [ ] Alert monitoring active

### T-1 Hour
- [ ] Final system check
- [ ] Monitor dashboards ready
- [ ] Support channels ready
- [ ] Team on standby

### Launch! 🚀
1. Announce on Twitter
2. Post in Discord
3. Share on Reddit (r/solana, r/CryptoGaming)
4. Monitor closely for first hour
5. Respond to user feedback
6. Fix any critical issues immediately

### T+1 Hour
- Review error logs
- Check user feedback
- Monitor server performance
- Verify payments working

### T+24 Hours
- Review first day metrics
- Address any issues
- Plan improvements
- Thank early users

---

## 📱 Marketing Checklist

### Pre-Launch
- [ ] Create Twitter account
- [ ] Create Discord server
- [ ] Prepare announcement tweet
- [ ] Create demo video/GIF
- [ ] Prepare press kit

### Launch Day
- [ ] Tweet announcement
- [ ] Post in Discord
- [ ] Share on Reddit
- [ ] Post on Product Hunt
- [ ] Reach out to crypto influencers

### Post-Launch
- [ ] Daily updates on Twitter
- [ ] Engage with community
- [ ] Share user wins
- [ ] Collect testimonials
- [ ] Plan tournaments

---

## 🎮 Soft Launch Strategy (Recommended)

### Phase 1: Friends & Family (Day 1-3)
- Invite 10-20 people you know
- Test with real money (small amounts)
- Gather feedback
- Fix critical bugs

### Phase 2: Limited Public (Day 4-7)
- Announce to small crypto communities
- Limit to 100 users
- Monitor closely
- Iterate based on feedback

### Phase 3: Full Launch (Day 8+)
- Public announcement
- Full marketing push
- Scale up servers
- Monitor and optimize

---

## ✅ Final Pre-Launch Checklist

### Technical
- [ ] Production environment configured
- [ ] Frontend deployed to Vercel
- [ ] Game server deployed to Fly.io
- [ ] Domain configured and SSL active
- [ ] Database optimized
- [ ] Redis configured
- [ ] Rate limiting active
- [ ] Error tracking setup
- [ ] Monitoring active

### Business
- [ ] Treasury wallet funded
- [ ] Backup wallet secured
- [ ] Terms of service ready
- [ ] Privacy policy ready
- [ ] Support email setup
- [ ] Social media accounts created

### Testing
- [ ] All features tested
- [ ] Payment flow tested with real SOL
- [ ] Mobile experience tested
- [ ] Load testing completed
- [ ] Security review done

### Marketing
- [ ] Announcement prepared
- [ ] Demo video ready
- [ ] Social media ready
- [ ] Community channels setup

---

## 🎉 You're Ready to Launch!

Once all checkboxes are complete, you're ready to go live!

**Remember:**
- Start small (soft launch)
- Monitor closely
- Respond quickly to issues
- Iterate based on feedback
- Scale gradually

**Good luck! 🚀**

---

## 📞 Support

If you need help during launch:
1. Check error logs first
2. Review this guide
3. Check service status pages
4. Contact service support if needed

---

Last Updated: November 16, 2025
Status: Ready for Production
Next Step: Follow this guide step by step
