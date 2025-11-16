# 🚀 Deploy to Vercel NOW

## ✅ Build Successful!

Your app builds without errors. Ready to deploy!

---

## Step 1: Login to Vercel

Run this command:
```bash
vercel login
```

**What happens**:
- Opens your browser
- Choose: GitHub, GitLab, Bitbucket, or Email
- Sign in
- CLI will be authenticated

**Recommended**: Use GitHub

---

## Step 2: Deploy

Run this command:
```bash
vercel --prod
```

**You'll be asked**:

1. **"Set up and deploy?"**
   - Answer: `Y` (Yes)

2. **"Which scope?"**
   - Choose your account (press Enter)

3. **"Link to existing project?"**
   - Answer: `N` (No)

4. **"What's your project's name?"**
   - Type: `slither-world` (or press Enter for default)

5. **"In which directory is your code located?"**
   - Press Enter (uses current directory)

6. **"Want to override the settings?"**
   - Answer: `N` (No)

**Wait**: 2-3 minutes for deployment

**Result**: You'll get a URL like:
```
https://slither-world.vercel.app
```

---

## Step 3: Add Environment Variables

After deployment, go to Vercel dashboard:

1. Visit: https://vercel.com/dashboard
2. Click on your project: `slither-world`
3. Go to: **Settings** → **Environment Variables**
4. Add these variables:

### Required Variables:

```
NEXT_PUBLIC_SOLANA_RPC
https://api.mainnet-beta.solana.com

NEXT_PUBLIC_USDC_MINT
EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v

NEXT_PUBLIC_APP_URL
https://slither-world.vercel.app

NEXT_PUBLIC_SOCKET_URL
http://localhost:3004

NEXT_PUBLIC_DEV_MODE
false

DATABASE_URL
postgresql://neondb_owner:npg_PyH0WK2kAbqj@ep-shiny-bread-ahldtw58-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require

UPSTASH_REDIS_REST_URL
https://legal-seasnail-37992.upstash.io

UPSTASH_REDIS_REST_TOKEN
AZRoAAIncDJjYWQzZjI0ZjlkOTA0NDFmYWFlNDZkY2I3NjZhNjdlMXAyMzc5OTI
```

5. Click **Save** after adding each variable

---

## Step 4: Redeploy

After adding environment variables:

```bash
vercel --prod
```

This redeploys with the new environment variables.

---

## Step 5: Test

Visit your site:
```bash
open https://slither-world.vercel.app
```

Check:
- ✅ Page loads
- ✅ Wallet button appears
- ✅ Can connect wallet
- ✅ Can sign message

---

## 🎉 Success!

Your frontend is now live on Vercel!

**Next**: Deploy game server to Fly.io

---

## Quick Commands

```bash
# Login
vercel login

# Deploy
vercel --prod

# View logs
vercel logs

# Open dashboard
vercel open
```

---

Last Updated: November 16, 2025
Status: Ready to deploy
Command: `vercel login` then `vercel --prod`
