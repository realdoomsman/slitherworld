# 🚀 Vercel Deployment Guide

## Step-by-Step Instructions

### 1. Login to Vercel

```bash
vercel login
```

This will:
- Open your browser
- Ask you to sign in (GitHub, GitLab, Bitbucket, or Email)
- Authenticate your CLI

**Choose**: GitHub (recommended) or Email

---

### 2. Deploy to Production

```bash
vercel --prod
```

**You'll be asked**:
- "Set up and deploy?" → **Yes**
- "Which scope?" → Choose your account
- "Link to existing project?" → **No**
- "What's your project's name?" → `slither-world` (or press Enter)
- "In which directory is your code located?" → `./` (press Enter)
- "Want to override the settings?" → **No**

**Wait**: Deployment takes 2-3 minutes

**Result**: You'll get a URL like `https://slither-world.vercel.app`

---

### 3. Add Environment Variables

After deployment, you need to add environment variables:

#### Option A: Via Dashboard (Recommended)

1. Go to: https://vercel.com/dashboard
2. Click on your project (`slither-world`)
3. Go to: **Settings** → **Environment Variables**
4. Add these variables (one by one):

```bash
# Database
DATABASE_URL
Value: postgresql://neondb_owner:npg_PyH0WK2kAbqj@ep-shiny-bread-ahldtw58-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require

# Redis
UPSTASH_REDIS_REST_URL
Value: https://legal-seasnail-37992.upstash.io

UPSTASH_REDIS_REST_TOKEN
Value: AZRoAAIncDJjYWQzZjI0ZjlkOTA0NDFmYWFlNDZkY2I3NjZhNjdlMXAyMzc5OTI

# Solana Mainnet
NEXT_PUBLIC_SOLANA_RPC
Value: https://api.mainnet-beta.solana.com

NEXT_PUBLIC_USDC_MINT
Value: EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v

# URLs (update after getting domain)
NEXT_PUBLIC_APP_URL
Value: https://slither-world.vercel.app

NEXT_PUBLIC_SOCKET_URL
Value: https://api.slither.world

# Features
NEXT_PUBLIC_DEV_MODE
Value: false
```

5. Click **Save** for each variable

#### Option B: Via CLI

```bash
# Set each variable
vercel env add NEXT_PUBLIC_SOLANA_RPC production
# Paste: https://api.mainnet-beta.solana.com

vercel env add NEXT_PUBLIC_USDC_MINT production
# Paste: EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v

vercel env add NEXT_PUBLIC_APP_URL production
# Paste: https://slither-world.vercel.app

vercel env add NEXT_PUBLIC_SOCKET_URL production
# Paste: https://api.slither.world

vercel env add NEXT_PUBLIC_DEV_MODE production
# Paste: false

# Add more as needed...
```

---

### 4. Redeploy with Environment Variables

After adding environment variables:

```bash
vercel --prod
```

This redeploys with the new environment variables.

---

### 5. Configure Custom Domain (Optional)

If you have `slither.world` domain:

#### Via Dashboard:
1. Go to: **Settings** → **Domains**
2. Click **Add**
3. Enter: `slither.world`
4. Follow DNS instructions

#### Via CLI:
```bash
vercel domains add slither.world
```

Then update DNS records as instructed.

---

## 🎯 Quick Commands

```bash
# Login
vercel login

# Deploy to production
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs

# Open project in browser
vercel open
```

---

## ✅ Verification

After deployment:

1. **Visit your site**:
   ```bash
   # Open in browser
   open https://slither-world.vercel.app
   ```

2. **Check it works**:
   - Page loads ✅
   - Wallet button appears ✅
   - Can connect wallet ✅

3. **Check environment variables**:
   - Go to Vercel dashboard
   - Settings → Environment Variables
   - Verify all are set ✅

---

## 🐛 Troubleshooting

### Build Fails
```bash
# Check build logs
vercel logs

# Common issues:
# - Missing dependencies → npm install
# - TypeScript errors → npm run build locally first
# - Environment variables → Add them in dashboard
```

### Site Loads but Errors
```bash
# Check runtime logs
vercel logs --follow

# Common issues:
# - Missing env vars → Add in dashboard
# - Wrong URLs → Update NEXT_PUBLIC_SOCKET_URL
```

### Can't Connect Wallet
```bash
# Check:
# 1. NEXT_PUBLIC_SOLANA_RPC is set
# 2. NEXT_PUBLIC_USDC_MINT is set
# 3. Browser console for errors
```

---

## 📊 What Gets Deployed

### Included:
- ✅ Frontend (Next.js app)
- ✅ API routes
- ✅ Static assets
- ✅ Environment variables

### NOT Included:
- ❌ Game server (deploy separately to Fly.io)
- ❌ Database (already on NeonDB)
- ❌ Redis (already on Upstash)

---

## 🔄 Redeploying

To redeploy after changes:

```bash
# Make your changes
git add .
git commit -m "Update"

# Deploy
vercel --prod
```

Or just:
```bash
vercel --prod
```

Vercel will automatically deploy from your local directory.

---

## 🎉 Success!

Once deployed, you should see:
- ✅ Deployment successful
- ✅ URL: https://slither-world.vercel.app
- ✅ Site loads
- ✅ Wallet connection works

---

## 📝 Next Steps

After Vercel deployment:
1. ✅ Frontend deployed
2. 🔴 Deploy game server to Fly.io
3. 🔴 Configure domain
4. 🔴 Test everything
5. 🔴 Launch!

---

Last Updated: November 16, 2025
Status: Ready to deploy
Command: `vercel --prod`
