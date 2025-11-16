#!/bin/bash

# Production Testing Script
# Run this to verify production deployment

set -e

echo "🧪 Testing Production Deployment..."
echo ""

# Test frontend
echo "Testing Frontend..."
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://slither.world)
if [ $FRONTEND_STATUS -eq 200 ]; then
    echo "✅ Frontend is up (Status: $FRONTEND_STATUS)"
else
    echo "❌ Frontend error (Status: $FRONTEND_STATUS)"
fi

echo ""

# Test game server health
echo "Testing Game Server..."
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://api.slither.world/health)
if [ $BACKEND_STATUS -eq 200 ]; then
    echo "✅ Game Server is healthy (Status: $BACKEND_STATUS)"
    curl -s https://api.slither.world/health | jq '.'
else
    echo "❌ Game Server error (Status: $BACKEND_STATUS)"
fi

echo ""

# Test database connection (via health endpoint)
echo "Testing Database Connection..."
DB_STATUS=$(curl -s https://api.slither.world/health | jq -r '.services.database')
if [ "$DB_STATUS" = "connected" ]; then
    echo "✅ Database is connected"
else
    echo "❌ Database connection failed"
fi

echo ""
echo "🎉 Production tests complete!"
