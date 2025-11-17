# 🚀 MAINNET DEPLOYMENT - REAL MONEY MODE

## ✅ COMPLETED CHANGES

### 1. Network Configuration
- ✅ Switched from Solana devnet to **mainnet-beta**
- ✅ Updated RPC endpoint: `https://api.mainnet-beta.solana.com`
- ✅ Updated USDC mint: `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v` (Mainnet USDC)
- ✅ Disabled dev mode (no more 1-player testing)

### 2. Files Updated
- ✅ `.env` - Local development mainnet config
- ✅ `.env.production` - Production mainnet config
- ✅ `server/solana/payments.ts` - Mainnet RPC
- ✅ `server/solana/raydium.ts` - Mainnet tokens and RPC

---

## ⚠️ CRITICAL: BEFORE GOING LIVE

### 1. Fund Treasury Wallet

Your mainnet treasury wallet needs SOL for transaction fees:

**Treasury Address**: `4yG1SAYwJYhh7WHDbk7Bu8LHbkxfQ1dJVUf1RdkZniC4CvzjndxuYqw1bsfz9tztxHPK8hSUyW6M9hZ9esmXEsn7`

```bash
# Check current balance
solana balance 4yG1SAYwJYhh7WHDbk7Bu8LHbkxfQ1dJVUf1RdkZniC4CvzjndxuYqw1bsfz9tztxHPK8hSUyW6M9hZ9esmXEsn7

# Send SOL from your wallet (recommended: 5-10 SOL to start)
# Use Phantom or Solflare to send SOL to the treasury address
```

**Recommended Starting Balance**: 5-10 SOL
- Covers transaction fees for payouts
- Each payout costs ~0.000005 SOL
- 10 SOL = ~2 million payouts

### 2. Update Production Environment Variables

Update these in **Render** (game server):

```bash
NEXT_PUBLIC_SOLANA_RPC=https://api.mainnet-beta.solana.com
SOLANA_TREASURY_PRIVATE_KEY=4yG1SAYwJYhh7WHDbk7Bu8LHbkxfQ1dJVUf1RdkZniC4CvzjndxuYqw1bsfz9tztxHPK8hSUyW6M9hZ9esmXEsn7
NEXT_PUBLIC_USDC_MINT=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
DEV_MODE=false
NEXT_PUBLIC_DEV_MODE=false
```

Update these in **Vercel** (frontend):

```bash
NEXT_PUBLIC_SOLANA_RPC=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_USDC_MINT=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
NEXT_PUBLIC_DEV_MODE=false
```

### 3. Test Payment Flow

Before announcing to public:

1. **Connect your wallet** (mainnet)
2. **Create a FREE lobby** - Test game mechanics
3. **Create a MICRO lobby** (0.05 SOL) - Test with real money
4. **Verify payment** on Solscan: https://solscan.io
5. **Win the game** - Verify payout received
6. **Check treasury balance** - Ensure fees are collected

---

## 🎮 LOBBY PRICING (MAINNET)

| Lobby Type | Entry Fee | Min Players | Max Players | Winner Gets |
|------------|-----------|-------------|-------------|-------------|
| FREE       | 0 SOL     | 10          | 20          | 0.05 SOL    |
| MICRO      | 0.05 SOL  | 15          | 25          | 80% of pot  |
| SMALL      | 0.25 SOL  | 15          | 25          | 80% of pot  |
| MEDIUM     | 0.5 SOL   | 15          | 25          | 80% of pot  |
| LARGE      | 1 SOL     | 15          | 25          | 80% of pot  |
| WHALE      | 5 SOL     | 30          | 50          | 80% of pot  |

**Fee Structure**:
- 80% to winner
- 10% to treasury (operations)
- 10% to buyback (future token)

---

## 📊 MONITORING

### Check Treasury Balance

```bash
# Command line
solana balance 4yG1SAYwJYhh7WHDbk7Bu8LHbkxfQ1dJVUf1RdkZniC4CvzjndxuYqw1bsfz9tztxHPK8hSUyW6M9hZ9esmXEsn7

# Or check on Solscan
https://solscan.io/account/4yG1SAYwJYhh7WHDbk7Bu8LHbkxfQ1dJVUf1RdkZniC4CvzjndxuYqw1bsfz9tztxHPK8hSUyW6M9hZ9esmXEsn7
```

### Monitor Transactions

All payments and payouts are visible on-chain:
- **Solscan**: https://solscan.io
- **Solana Explorer**: https://explorer.solana.com

### Server Logs

```bash
# Render logs
# Go to: https://dashboard.render.com
# Click your service > Logs

# Look for:
✅ Payment verified: [signature]
✅ Payout sent: [amount] SOL to [address]
🔄 Executing buyback: [amount] SOL
```

---

## 🚨 SAFETY CHECKLIST

Before going live with real money:

- [ ] Treasury wallet funded with 5-10 SOL
- [ ] Render environment variables updated to mainnet
- [ ] Vercel environment variables updated to mainnet
- [ ] Test payment with 0.05 SOL (MICRO lobby)
- [ ] Verify payout received correctly
- [ ] Check transaction on Solscan
- [ ] Monitor server logs for errors
- [ ] Test on mobile device
- [ ] Have backup plan if issues arise

---

## 🎯 LAUNCH STRATEGY

### Phase 1: Soft Launch (First 24 Hours)
- Start with FREE and MICRO lobbies only
- Monitor closely for any issues
- Limit to 100 concurrent players
- Be ready to pause if needed

### Phase 2: Scale Up (Days 2-7)
- Enable SMALL and MEDIUM lobbies
- Increase player limits
- Monitor treasury balance
- Collect user feedback

### Phase 3: Full Launch (Week 2+)
- Enable LARGE and WHALE lobbies
- Full marketing push
- Community events
- Leaderboard prizes

---

## 💰 TREASURY MANAGEMENT

### When to Add More SOL

Add more SOL to treasury when:
- Balance drops below 2 SOL
- High payout volume expected
- Planning marketing campaign

### Withdrawing Profits

To withdraw accumulated fees:

```bash
# Calculate available funds
# Total Balance - (2 SOL reserve for payouts) = Withdrawable

# Send from treasury to your wallet
# Use a script or manual transaction
```

---

## 🔧 TROUBLESHOOTING

### "Insufficient treasury balance" Error

**Solution**: Fund treasury wallet with more SOL

### Payment Not Verified

**Possible causes**:
1. Transaction not confirmed yet (wait 30 seconds)
2. Wrong amount sent
3. Network congestion

**Solution**: Check transaction on Solscan, retry if needed

### Payout Failed

**Possible causes**:
1. Treasury out of SOL
2. Invalid recipient address
3. Network issues

**Solution**: Check logs, verify treasury balance, retry payout

---

## 📞 SUPPORT

If issues arise:
1. Check server logs in Render
2. Verify transactions on Solscan
3. Check treasury balance
4. Review error messages
5. Pause new lobbies if critical

---

## ✅ YOU'RE READY!

Your game is now configured for **MAINNET** with **REAL MONEY**.

**Next Steps**:
1. Fund treasury wallet (5-10 SOL)
2. Update Render environment variables
3. Update Vercel environment variables
4. Test with small amount (0.05 SOL)
5. Announce to community!

**Current Status**: ✅ Code Ready | ⚠️ Needs Funding & Deployment

---

Last Updated: November 16, 2025
Network: **MAINNET** (Real Money)
Status: Ready for Funding & Launch
