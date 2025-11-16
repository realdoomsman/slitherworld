# Deploy to Render (5 Minutes)

Render is faster and easier than Fly.io!

## Steps:

1. **Go to**: https://render.com
2. **Sign up** with GitHub
3. **New** → **Web Service**
4. **Connect** your GitHub repo
5. **Configure**:
   - Name: `slither-game-server`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm run server:prod`
   - Plan: Free (or Starter $7/month)

6. **Add Environment Variables**:
   ```
   DATABASE_URL=postgresql://neondb_owner:npg_PyH0WK2kAbqj@ep-shiny-bread-ahldtw58-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
   
   UPSTASH_REDIS_REST_URL=https://legal-seasnail-37992.upstash.io
   
   UPSTASH_REDIS_REST_TOKEN=AZRoAAIncDJjYWQzZjI0ZjlkOTA0NDFmYWFlNDZkY2I3NjZhNjdlMXAyMzc5OTI
   
   SOLANA_TREASURY_PRIVATE_KEY=4yG1SAYwJYhh7WHDbk7Bu8LHbkxfQ1dJVUf1RdkZniC4CvzjndxuYqw1bsfz9tztxHPK8hSUyW6M9hZ9esmXEsn7
   
   NEXT_PUBLIC_SOLANA_RPC=https://api.mainnet-beta.solana.com
   
   PORT=3001
   
   NODE_ENV=production
   ```

7. **Click Deploy**

8. **Wait 3-5 minutes** (much faster than Fly.io!)

9. **Get your URL**: `https://slither-game-server.onrender.com`

10. **Update Vercel**:
    ```bash
    vercel env rm NEXT_PUBLIC_SOCKET_URL production
    vercel env add NEXT_PUBLIC_SOCKET_URL production
    # Enter: https://slither-game-server.onrender.com
    
    vercel --prod
    ```

**Done!** Fully deployed and working 24/7!

## Why Render is Better:

- ✅ Faster deployment (3-5 min vs 15+ min)
- ✅ Easier setup (web UI vs CLI)
- ✅ Free tier available
- ✅ Auto-deploys from GitHub
- ✅ Built-in SSL
- ✅ No Docker needed

## Cost:

- **Free**: $0/month (sleeps after 15 min inactivity)
- **Starter**: $7/month (always on, recommended)
