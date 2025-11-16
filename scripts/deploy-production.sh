#!/bin/bash

# Production Deployment Script
# Run this to deploy both frontend and backend

set -e

echo "🚀 Starting Production Deployment..."
echo ""

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo "❌ Error: .env.production not found"
    echo "Please create .env.production from .env.production.example"
    exit 1
fi

# Load production environment
export $(cat .env.production | xargs)

echo "📦 Building application..."
npm run build

echo ""
echo "🌐 Deploying Frontend to Vercel..."
vercel --prod

echo ""
echo "🎮 Deploying Game Server to Fly.io..."
fly deploy

echo ""
echo "✅ Deployment Complete!"
echo ""
echo "Next steps:"
echo "1. Test the deployment: https://slither.world"
echo "2. Check game server: https://api.slither.world/health"
echo "3. Monitor logs: fly logs"
echo "4. Monitor Vercel: vercel logs"
echo ""
echo "🎉 Your game is now live!"
