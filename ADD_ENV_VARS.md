# Add Environment Variables to Vercel

## Your Site is Live! 🎉

**URL**: https://slitherworld-g56k81hxj-realdoomsmans-projects.vercel.app

But you need to add environment variables for it to work properly.

---

## Quick Method: Via Dashboard

1. **Go to**: https://vercel.com/dashboard
2. **Click**: Your project "slitherworld"
3. **Go to**: Settings → Environment Variables
4. **Add these variables** (one by one):

### Required Variables:

```
Name: NEXT_PUBLIC_SOLANA_RPC
Value: https://api.mainnet-beta.solana.com

Name: NEXT_PUBLIC_USDC_MINT
Value: EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v

Name: NEXT_PUBLIC_APP_URL
Value: https://slitherworld-g56k81hxj-realdoomsmans-projects.vercel.app

Name: NEXT_PUBLIC_SOCKET_URL
Value: http://localhost:3004

Name: NEXT_PUBLIC_DEV_MODE
Value: false

Name: DATABASE_URL
Value: postgresql://neondb_owner:npg_PyH0WK2kAbqj@ep-shiny-bread-ahldtw58-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require

Name: UPSTASH_REDIS_REST_URL
Value: https://legal-seasnail-37992.upstash.io

Name: UPSTASH_REDIS_REST_TOKEN
Value: AZRoAAIncDJjYWQzZjI0ZjlkOTA0NDFmYWFlNDZkY2I3NjZhNjdlMXAyMzc5OTI
```

5. **Click Save** after each variable
6. **Redeploy**: Run `vercel --prod` again

---

## After Adding Variables

```bash
# Redeploy with environment variables
vercel --prod
```

Then your site will be fully functional!

---

## Next: Deploy Game Server

After Vercel is working, deploy the game server to Fly.io:

```bash
fly launch --name slither-game-server
```

---

**Current Status**: Frontend deployed, needs environment variables
**Next Step**: Add env vars in Vercel dashboard
