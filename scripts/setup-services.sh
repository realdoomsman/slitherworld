#!/bin/bash

echo "🚀 Slither.World - Service Setup Helper"
echo "========================================"
echo ""

echo "You need to setup 2 free cloud services:"
echo ""

echo "1️⃣  NeonDB (PostgreSQL Database)"
echo "   → Go to: https://neon.tech"
echo "   → Sign up (free)"
echo "   → Create new project"
echo "   → Copy connection string"
echo ""

echo "2️⃣  Upstash (Redis Cache)"
echo "   → Go to: https://upstash.com"
echo "   → Sign up (free)"
echo "   → Create Redis database"
echo "   → Copy connection string"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

read -p "Have you created both services? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "No problem! Create them first, then run this script again."
    echo ""
    echo "Quick links:"
    echo "  NeonDB:  https://neon.tech"
    echo "  Upstash: https://upstash.com"
    exit 0
fi

echo ""
echo "Great! Let's configure your .env file..."
echo ""

# Get DATABASE_URL
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 NeonDB Connection String"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "From NeonDB dashboard, copy the connection string."
echo "It looks like: postgresql://user:pass@host/dbname"
echo ""
read -p "Paste your NeonDB connection string: " DATABASE_URL

# Get REDIS_URL
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "⚡ Upstash Redis Connection String"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "From Upstash dashboard, copy the connection string."
echo "It looks like: redis://default:pass@host:port"
echo ""
read -p "Paste your Upstash connection string: " REDIS_URL

# Update .env file
echo ""
echo "Updating .env file..."

# Backup .env
cp .env .env.backup

# Update DATABASE_URL
if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "s|DATABASE_URL=.*|DATABASE_URL=$DATABASE_URL|" .env
    sed -i '' "s|REDIS_URL=.*|REDIS_URL=$REDIS_URL|" .env
else
    sed -i "s|DATABASE_URL=.*|DATABASE_URL=$DATABASE_URL|" .env
    sed -i "s|REDIS_URL=.*|REDIS_URL=$REDIS_URL|" .env
fi

echo "✅ .env file updated!"
echo ""

# Test connections
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🧪 Testing Connections..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Initialize database
echo "Initializing database..."
npm run db:generate > /dev/null 2>&1
npm run db:migrate > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Database connected and initialized!"
else
    echo "⚠️  Database connection issue. Check your connection string."
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 Setup Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Next steps:"
echo ""
echo "1. Start frontend:"
echo "   npm run dev"
echo ""
echo "2. Start game server (new terminal):"
echo "   npm run server"
echo ""
echo "3. Open browser:"
echo "   http://localhost:3000"
echo ""
echo "🎮 Have fun!"
echo ""
