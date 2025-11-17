#!/bin/bash

# 🚀 Mainnet Deployment Script
# This script helps you deploy to mainnet with real money

set -e

echo "🚀 MAINNET DEPLOYMENT CHECKLIST"
echo "================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Treasury address
TREASURY="4yG1SAYwJYhh7WHDbk7Bu8LHbkxfQ1dJVUf1RdkZniC4CvzjndxuYqw1bsfz9tztxHPK8hSUyW6M9hZ9esmXEsn7"

echo "📋 Pre-Deployment Checks"
echo "------------------------"

# Check if solana CLI is installed
if command -v solana &> /dev/null; then
    echo -e "${GREEN}✓${NC} Solana CLI installed"
    
    # Check treasury balance
    echo ""
    echo "💰 Checking Treasury Balance..."
    BALANCE=$(solana balance $TREASURY 2>/dev/null || echo "0")
    echo "   Treasury: $TREASURY"
    echo "   Balance: $BALANCE"
    
    if [[ "$BALANCE" == "0"* ]]; then
        echo -e "${RED}⚠️  WARNING: Treasury has no SOL!${NC}"
        echo "   You need to fund it before going live."
        echo "   Recommended: 5-10 SOL"
    else
        echo -e "${GREEN}✓${NC} Treasury funded"
    fi
else
    echo -e "${YELLOW}⚠${NC} Solana CLI not installed (optional)"
    echo "   Install: https://docs.solana.com/cli/install-solana-cli-tools"
fi

echo ""
echo "📝 Configuration Status"
echo "----------------------"

# Check .env file
if grep -q "api.mainnet-beta.solana.com" .env; then
    echo -e "${GREEN}✓${NC} Local .env configured for mainnet"
else
    echo -e "${RED}✗${NC} Local .env still on devnet"
fi

if grep -q "DEV_MODE=false" .env; then
    echo -e "${GREEN}✓${NC} Dev mode disabled"
else
    echo -e "${RED}✗${NC} Dev mode still enabled"
fi

echo ""
echo "🎯 Next Steps"
echo "-------------"
echo ""
echo "1. Fund Treasury Wallet (if not done):"
echo "   Address: $TREASURY"
echo "   Amount: 5-10 SOL"
echo "   Use Phantom or Solflare to send"
echo ""
echo "2. Update Render Environment Variables:"
echo "   Go to: https://dashboard.render.com"
echo "   Add/Update:"
echo "   - NEXT_PUBLIC_SOLANA_RPC=https://api.mainnet-beta.solana.com"
echo "   - SOLANA_TREASURY_PRIVATE_KEY=4yG1SAYwJYhh7WHDbk7Bu8LHbkxfQ1dJVUf1RdkZniC4CvzjndxuYqw1bsfz9tztxHPK8hSUyW6M9hZ9esmXEsn7"
echo "   - NEXT_PUBLIC_USDC_MINT=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
echo "   - DEV_MODE=false"
echo "   - NEXT_PUBLIC_DEV_MODE=false"
echo ""
echo "3. Update Vercel Environment Variables:"
echo "   Go to: https://vercel.com/dashboard"
echo "   Add/Update:"
echo "   - NEXT_PUBLIC_SOLANA_RPC=https://api.mainnet-beta.solana.com"
echo "   - NEXT_PUBLIC_USDC_MINT=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
echo "   - NEXT_PUBLIC_DEV_MODE=false"
echo ""
echo "4. Test with Small Amount:"
echo "   - Create MICRO lobby (0.05 SOL)"
echo "   - Verify payment on Solscan"
echo "   - Win and verify payout"
echo ""
echo "5. Monitor:"
echo "   - Render logs: https://dashboard.render.com"
echo "   - Solscan: https://solscan.io/account/$TREASURY"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANT: This is REAL MONEY. Test thoroughly!${NC}"
echo ""
echo "📖 Full guide: See MAINNET_DEPLOYMENT.md"
echo ""
