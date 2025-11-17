# 🚀 MAINNET QUICK START

## ✅ What's Done

Your code is now configured for **MAINNET** with **REAL MONEY**:

- ✅ Solana RPC: `https://api.mainnet-beta.solana.com`
- ✅ USDC Mint: `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v` (Mainnet USDC)
- ✅ Dev mode: Disabled
- ✅ Treasury wallet: Configured

---

## ⚠️ What You Need to Do

### 1. Fund Treasury (REQUIRED)

**Treasury Address**: 
```
4yG1SAYwJYhh7WHDbk7Bu8LHbkxfQ1dJVUf1RdkZniC4CvzjndxuYqw1bsfz9tztxHPK8hSUyW6M9hZ9esmXEsn7
```

**How to Fund**:
1. Open Phantom or Solflare wallet
2. Send 5-10 SOL to the address above
3. Verify on Solscan: https://solscan.io

**Why**: Treasury needs SOL to pay out winners

---

### 2. Update Render (Game Server)

Go to: https://dashboard.render.com

**Environment Variables to Update**:
```bash
NEXT_PUBLIC_SOLANA_RPC=https://api.mainnet-beta.solana.com
SOLANA_TREASURY_PRIVATE_KEY=4yG1SAYwJYhh7WHDbk7Bu8LHbkxfQ1dJVUf1RdkZniC4CvzjndxuYqw1bsfz9tztxHPK8hSUyW6M9hZ9esmXEsn7
NEXT_PUBLIC_USDC_MINT=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
DEV_MODE=false
NEXT_PUBLIC_DEV_MODE=false
```

After updating, Render will automatically redeploy.

---

### 3. Update Vercel (Frontend)

Go to: https://vercel.com/dashboard

**Environment Variables to Update**:
```bash
NEXT_PUBLIC_SOLANA_RPC=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_USDC_MINT=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
NEXT_PUBLIC_DEV_MODE=false
```

After updating, redeploy from Vercel dashboard.

---

### 4. Test Before Announcing

1. **Visit your site** (after deployments complete)
2. **Connect wallet** (mainnet)
3. **Create MICRO lobby** (0.05 SOL entry)
4. **Pay and play** (test with real money)
5. **Win the game** (verify payout received)
6. **Check Solscan** for transactions

---

## 🎮 Lobby Pricing

| Type   | Entry  | Winner Gets |
|--------|--------|-------------|
| FREE   | 0 SOL  | 0.05 SOL    |
| MICRO  | 0.05   | 80% of pot  |
| SMALL  | 0.25   | 80% of pot  |
| MEDIUM | 0.5    | 80% of pot  |
| LARGE  | 1 SOL  | 80% of pot  |
| WHALE  | 5 SOL  | 80% of pot  |

---

## 📊 Monitoring

**Check Treasury Balance**:
```bash
./scripts/deploy-mainnet.sh
```

**View Transactions**:
- https://solscan.io/account/4yG1SAYwJYhh7WHDbk7Bu8LHbkxfQ1dJVUf1RdkZniC4CvzjndxuYqw1bsfz9tztxHPK8hSUyW6M9hZ9esmXEsn7

**Server Logs**:
- Render: https://dashboard.render.com (click your service > Logs)

---

## 🚨 Emergency

If something goes wrong:

1. **Pause new lobbies** - Don't create new ones
2. **Check logs** - Look for errors in Render
3. **Verify transactions** - Check Solscan
4. **Revert to devnet** - Change RPC back to devnet if needed

---

## ✅ Launch Checklist

- [ ] Treasury funded with 5-10 SOL
- [ ] Render environment variables updated
- [ ] Vercel environment variables updated
- [ ] Both services redeployed
- [ ] Test payment with 0.05 SOL
- [ ] Verify payout received
- [ ] Check transaction on Solscan
- [ ] Monitor logs for 1 hour
- [ ] Ready to announce!

---

## 🎯 You're Ready!

Once all checkboxes are complete, you're live with **REAL MONEY**.

**Start small**: Begin with FREE and MICRO lobbies, scale up as you gain confidence.

**Full Guide**: See `MAINNET_DEPLOYMENT.md` for detailed information.

---

Last Updated: November 16, 2025
Status: Code Ready | Awaiting Funding & Deployment
