# Deploy to Railway (Easiest & Fastest!)

Railway handles everything automatically - no Docker, no Python issues!

## Steps (2 minutes):

1. **Go to**: https://railway.app
2. **Sign up** with GitHub (1 click)
3. **New Project** → **Deploy from GitHub repo**
4. **Select** your `slitherworld` repo
5. **Add variables** (click Variables tab):

```
DATABASE_URL=postgresql://neondb_owner:npg_PyH0WK2kAbqj@ep-shiny-bread-ahldtw58-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require

UPSTASH_REDIS_REST_URL=https://legal-seasnail-37992.upstash.io

UPSTASH_REDIS_REST_TOKEN=AZRoAAIncDJjYWQzZjI0ZjlkOTA0NDFmYWFlNDZkY2I3NjZhNjdlMXAyMzc5OTI

SOLANA_TREASURY_PRIVATE_KEY=4yG1SAYwJYhh7WHDbk7Bu8LHbkxfQ1dJVUf1RdkZniC4CvzjndxuYqw1bsfz9tztxHPK8hSUyW6M9hZ9esmXEsn7

NEXT_PUBLIC_SOLANA_RPC=https://api.mainnet-beta.solana.com

PORT=3001

NODE_ENV=production
```

6. **Settings** → **Start Command**: `npm run server:prod`

7. **Deploy!** (takes 2-3 minutes)

8. **Get URL**: `https://slitherworld-production.up.railway.app`

## Why Railway is Better:

- ✅ No Docker issues
- ✅ Auto-detects Node.js
- ✅ Handles all dependencies automatically
- ✅ 2-3 minute deploy
- ✅ $5 free credit
- ✅ Then $5/month

## Cost:

- **Free**: $5 credit (lasts ~1 month)
- **After**: ~$5/month

**This will work!** Railway handles everything automatically.
