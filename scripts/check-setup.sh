#!/bin/bash

echo "🔍 Checking Slither.io Setup Status..."
echo ""

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js installed: $NODE_VERSION"
else
    echo "❌ Node.js not installed"
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo "✅ npm installed: $NPM_VERSION"
else
    echo "❌ npm not installed"
fi

# Check PostgreSQL
if command -v psql &> /dev/null; then
    PSQL_VERSION=$(psql --version | awk '{print $3}')
    echo "✅ PostgreSQL installed: $PSQL_VERSION"
else
    echo "⚠️  PostgreSQL not installed (optional - can use NeonDB)"
fi

# Check Redis
if command -v redis-cli &> /dev/null; then
    REDIS_VERSION=$(redis-cli --version | awk '{print $2}')
    echo "✅ Redis installed: $REDIS_VERSION"
    
    # Test Redis connection
    if redis-cli ping &> /dev/null; then
        echo "✅ Redis is running"
    else
        echo "⚠️  Redis installed but not running"
    fi
else
    echo "⚠️  Redis not installed (optional - can use Upstash)"
fi

# Check Solana CLI
if command -v solana &> /dev/null; then
    SOLANA_VERSION=$(solana --version | awk '{print $2}')
    echo "✅ Solana CLI installed: $SOLANA_VERSION"
else
    echo "⚠️  Solana CLI not installed (needed for wallet generation)"
fi

# Check .env file
if [ -f .env ]; then
    echo "✅ .env file exists"
    
    # Check if configured
    if grep -q "your_base58_private_key_here" .env; then
        echo "⚠️  .env needs configuration (treasury wallet)"
    else
        echo "✅ .env appears configured"
    fi
else
    echo "❌ .env file missing"
fi

# Check node_modules
if [ -d node_modules ]; then
    echo "✅ Dependencies installed"
else
    echo "❌ Dependencies not installed (run: npm install)"
fi

echo ""
echo "📋 Summary:"
echo "----------"

READY=true

if [ ! -d node_modules ]; then
    echo "❌ Run: npm install"
    READY=false
fi

if [ ! -f .env ]; then
    echo "❌ Run: cp .env.example .env"
    READY=false
fi

if grep -q "your_base58_private_key_here" .env 2>/dev/null; then
    echo "⚠️  Configure .env file (see SETUP_STATUS.md)"
    READY=false
fi

if ! command -v psql &> /dev/null && ! grep -q "neon.tech" .env 2>/dev/null; then
    echo "⚠️  Setup PostgreSQL or NeonDB"
    READY=false
fi

if ! command -v redis-cli &> /dev/null && ! grep -q "upstash" .env 2>/dev/null; then
    echo "⚠️  Setup Redis or Upstash"
    READY=false
fi

if [ "$READY" = true ]; then
    echo ""
    echo "🎉 Setup looks good! Ready to run:"
    echo "   Terminal 1: npm run dev"
    echo "   Terminal 2: npm run server"
else
    echo ""
    echo "📖 See SETUP_STATUS.md for next steps"
fi

echo ""
