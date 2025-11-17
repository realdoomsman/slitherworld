# 💰 Treasury Wallet Address

## Current Treasury Address

```
98cTHUmkwPBj64dus3Uvmjwb5XkdHc1kSdoNrzPQZQgb
```

## What This Address Is Used For

1. **Entry Fee Collection** - Players send SOL here to join paid games
2. **Payment Verification** - System checks transactions to this address
3. **Prize Pool** - All entry fees accumulate here

## How It Works

### For Players:
1. Player wants to join paid game (0.25 SOL)
2. System shows this treasury address
3. Player sends 0.25 SOL from their wallet to this address
4. Player copies transaction signature
5. System verifies the transaction
6. Player joins the game

### For You (Admin):
1. Entry fees accumulate in this wallet
2. After game ends, check winner page
3. Copy winner's wallet address
4. Send prize from this treasury wallet to winner

## View on Solscan

https://solscan.io/account/98cTHUmkwPBj64dus3Uvmjwb5XkdHc1kSdoNrzPQZQgb

## Check Balance

```bash
solana balance 98cTHUmkwPBj64dus3Uvmjwb5XkdHc1kSdoNrzPQZQgb
```

## Important Notes

⚠️ **Keep the private key secure!** It's in your `.env` file
⚠️ **This is MAINNET** - Real money transactions
⚠️ **Fund with SOL** - Need ~0.01 SOL for transaction fees

## Where This Address Is Used

- `app/lobby/page.tsx` - Shown to players during payment
- `app/api/lobby/verify-payment/route.ts` - Verifies payments to this address
- `.env` - Stored as `SOLANA_TREASURY_PRIVATE_KEY`
- `.env.production` - Production environment variable

## Payment Flow

```
Player Wallet → Treasury (98cTHU...) → Winner Wallet
     0.25 SOL         (accumulates)        2.0 SOL prize
```

## Example Transaction

When a player pays:
```
From: Player's wallet (e.g., 7xKXtg2CW87...)
To: 98cTHUmkwPBj64dus3Uvmjwb5XkdHc1kSdoNrzPQZQgb
Amount: 0.25 SOL
```

When you pay winner:
```
From: 98cTHUmkwPBj64dus3Uvmjwb5XkdHc1kSdoNrzPQZQgb
To: Winner's wallet (shown on winner page)
Amount: 2.0 SOL (or whatever the prize is)
```

---

**Last Updated**: Now
**Network**: Solana Mainnet
**Status**: Active ✅
