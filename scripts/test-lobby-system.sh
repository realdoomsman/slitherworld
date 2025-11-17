#!/bin/bash

# Test script for shared lobby system
# This tests if the API correctly returns the same lobby for multiple requests

echo "🧪 Testing Shared Lobby System..."
echo ""

API_URL="${1:-http://localhost:3000}"

echo "Testing against: $API_URL"
echo ""

# Test 1: Create first lobby
echo "📝 Test 1: Creating first FREE lobby..."
RESPONSE1=$(curl -s -X POST "$API_URL/api/lobby/create" \
  -H "Content-Type: application/json" \
  -d '{
    "lobbyType": "FREE",
    "nickname": "Player1",
    "walletAddress": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"
  }')

LOBBY1=$(echo $RESPONSE1 | grep -o '"lobbyId":"[^"]*"' | cut -d'"' -f4)
echo "Response: $RESPONSE1"
echo "Lobby ID: $LOBBY1"
echo ""

# Test 2: Try to create second lobby (should join first)
echo "📝 Test 2: Creating second FREE lobby (should join first)..."
sleep 1
RESPONSE2=$(curl -s -X POST "$API_URL/api/lobby/create" \
  -H "Content-Type: application/json" \
  -d '{
    "lobbyType": "FREE",
    "nickname": "Player2",
    "walletAddress": "8yKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsV"
  }')

LOBBY2=$(echo $RESPONSE2 | grep -o '"lobbyId":"[^"]*"' | cut -d'"' -f4)
echo "Response: $RESPONSE2"
echo "Lobby ID: $LOBBY2"
echo ""

# Test 3: Create PAID lobby (should be different)
echo "📝 Test 3: Creating PAID lobby (should be different)..."
sleep 1
RESPONSE3=$(curl -s -X POST "$API_URL/api/lobby/create" \
  -H "Content-Type: application/json" \
  -d '{
    "lobbyType": "PAID",
    "nickname": "Player3",
    "walletAddress": "9zKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsW"
  }')

LOBBY3=$(echo $RESPONSE3 | grep -o '"lobbyId":"[^"]*"' | cut -d'"' -f4)
echo "Response: $RESPONSE3"
echo "Lobby ID: $LOBBY3"
echo ""

# Results
echo "================================"
echo "📊 TEST RESULTS"
echo "================================"
echo ""

if [ "$LOBBY1" = "$LOBBY2" ]; then
  echo "✅ PASS: FREE lobbies share same ID"
  echo "   Lobby 1: $LOBBY1"
  echo "   Lobby 2: $LOBBY2"
else
  echo "❌ FAIL: FREE lobbies have different IDs"
  echo "   Lobby 1: $LOBBY1"
  echo "   Lobby 2: $LOBBY2"
fi
echo ""

if [ "$LOBBY1" != "$LOBBY3" ]; then
  echo "✅ PASS: PAID lobby has different ID from FREE"
  echo "   FREE:  $LOBBY1"
  echo "   PAID:  $LOBBY3"
else
  echo "❌ FAIL: PAID lobby has same ID as FREE"
  echo "   FREE:  $LOBBY1"
  echo "   PAID:  $LOBBY3"
fi
echo ""

echo "================================"
echo "Test complete!"
echo ""
echo "Usage: ./scripts/test-lobby-system.sh [API_URL]"
echo "Example: ./scripts/test-lobby-system.sh https://your-site.com"
