#!/bin/bash

echo "🐍 Setting up Slither.io Solana Edition..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  Please update .env with your actual values!"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Drizzle schema
echo "🗄️  Generating database schema..."
npm run db:generate

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env with your database and Solana credentials"
echo "2. Run 'npm run db:migrate' to create database tables"
echo "3. Start the frontend: 'npm run dev'"
echo "4. Start the game server: 'npm run server'"
echo ""
echo "🎮 Happy gaming!"
