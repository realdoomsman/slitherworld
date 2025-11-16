# Testing Guide

## Unit Tests

### Physics Engine Tests

Test deterministic behavior:

```typescript
// Test snake movement
const snake = createSnake()
updateSnakePosition(snake, 0, 1/60)
// Assert position changed by expected amount

// Test collision detection
const snake1 = createSnake({ x: 100, y: 100 })
const snake2 = createSnake({ x: 100, y: 100 })
checkSnakeCollisions([snake1, snake2])
// Assert both snakes died (head-to-head, equal length)

// Test pellet collection
const snake = createSnake()
const pellets = [{ id: '1', position: { x: 100, y: 100 }, value: 2 }]
const collected = checkPelletCollisions(snake, pellets)
// Assert pellet collected and length increased
```

### Payment Verification Tests

```typescript
// Test signature verification
const message = "Test message"
const signature = await wallet.signMessage(message)
const isValid = verifySignature(message, signature, wallet.publicKey)
// Assert signature is valid

// Test payment verification
const txHash = "mock_transaction_hash"
const isValid = await verifyPayment(txHash, 5, "reference")
// Assert payment verified correctly
```

## Integration Tests

### Authentication Flow

1. Request challenge: `POST /api/auth/challenge`
2. Sign message with wallet
3. Verify signature: `POST /api/auth/verify`
4. Assert session token received

### Lobby Creation Flow

1. Authenticate
2. Create lobby: `POST /api/lobby/create`
3. Assert HTTP 402 response with payment instructions
4. Send USDC transaction
5. Verify payment: `POST /api/lobby/verify-payment`
6. Assert player added to lobby

### Game Flow

1. Connect to Socket.io server
2. Authenticate with session token
3. Join lobby
4. Wait for game start
5. Send player inputs
6. Receive game state updates at 60Hz
7. Assert game ends when one player remains
8. Assert winner receives payout

## Load Testing

### Install Artillery

```bash
npm install -g artillery
```

### Create Load Test Configuration

```yaml
# load-test.yml
config:
  target: "http://localhost:3001"
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up"
    - duration: 120
      arrivalRate: 50
      name: "Sustained load"
    - duration: 60
      arrivalRate: 100
      name: "Peak load"
  socketio:
    transports: ["websocket"]

scenarios:
  - name: "Game Session"
    engine: socketio
    flow:
      - emit:
          channel: "authenticate"
          data:
            token: "test_token"
      - emit:
          channel: "join_lobby"
          data:
            lobbyId: "test_lobby"
      - think: 1
      - emit:
          channel: "player_input"
          data:
            angle: 0
            boosting: false
      - think: 5
```

### Run Load Test

```bash
artillery run load-test.yml
```

### Expected Results

- **Response Time**: < 50ms p95
- **Tick Rate**: Consistent 60Hz
- **Error Rate**: < 0.1%
- **Concurrent Users**: 500+

## Performance Benchmarks

### Server Tick Rate

```bash
# Monitor tick rate
node scripts/monitor-tick-rate.js
```

Expected: 60 ticks/second ± 1

### Database Query Performance

```sql
-- Check slow queries
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
WHERE mean_exec_time > 100
ORDER BY mean_exec_time DESC
LIMIT 10;
```

### Memory Usage

```bash
# Monitor memory
node --expose-gc server/index.ts
```

Expected: < 500MB per game instance

## Manual Testing Checklist

### Desktop

- [ ] Wallet connects successfully
- [ ] Authentication works
- [ ] Can create and join lobby
- [ ] Payment flow completes
- [ ] Game renders at 60fps
- [ ] Mouse controls work smoothly
- [ ] Boost button works
- [ ] Collisions detected correctly
- [ ] Pellets collected properly
- [ ] Leaderboard updates
- [ ] Game ends correctly
- [ ] Winner receives payout
- [ ] Transaction history shows

### Mobile

- [ ] Wallet connects on mobile
- [ ] Touch controls work
- [ ] Joystick responsive
- [ ] Boost button works
- [ ] Game renders smoothly
- [ ] No lag or stuttering
- [ ] Can complete full game

### Edge Cases

- [ ] Disconnect during game
- [ ] Reconnect to active game
- [ ] Multiple tabs (should prevent)
- [ ] Insufficient USDC balance
- [ ] Network timeout
- [ ] Server restart during game
- [ ] Invalid signature
- [ ] Expired session
- [ ] Duplicate payment

## Security Testing

### Authentication

```bash
# Test invalid signature
curl -X POST http://localhost:3000/api/auth/verify \
  -H "Content-Type: application/json" \
  -d '{"walletAddress":"invalid","signature":"invalid","message":"test"}'

# Expected: 401 Unauthorized
```

### Payment Verification

```bash
# Test invalid transaction
curl -X POST http://localhost:3000/api/lobby/verify-payment \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer valid_token" \
  -d '{"lobbyId":"test","txHash":"invalid","reference":"ref","expectedAmount":5}'

# Expected: 400 Bad Request
```

### Rate Limiting

```bash
# Send 1000 requests rapidly
for i in {1..1000}; do
  curl http://localhost:3000/api/auth/challenge &
done

# Expected: Some requests return 429 Too Many Requests
```

### Anti-Bot Detection

```javascript
// Send impossible velocity
socket.emit('player_input', {
  angle: 0,
  boosting: true,
  // Move 1000 units in one tick (impossible)
})

// Expected: Player kicked or movement rejected
```

## Monitoring

### Key Metrics

1. **Game Performance**
   - Tick rate: 60Hz ± 1
   - Player count per lobby
   - Active lobbies
   - Average game duration

2. **API Performance**
   - Request latency (p50, p95, p99)
   - Error rate
   - Throughput (req/sec)

3. **Database**
   - Query time
   - Connection pool usage
   - Slow queries

4. **Blockchain**
   - Transaction success rate
   - Confirmation time
   - Gas fees

### Alerts

Set up alerts for:
- Tick rate drops below 55Hz
- API latency > 100ms p95
- Error rate > 1%
- Database connections > 80%
- Failed transactions > 5%

## Debugging

### Enable Debug Logs

```bash
DEBUG=* npm run server
```

### Check Game State

```javascript
// In browser console
socket.emit('debug_state')
socket.on('debug_state', (state) => {
  console.log('Game State:', state)
})
```

### Monitor Network

```bash
# Check Socket.io connections
netstat -an | grep 3001

# Monitor bandwidth
iftop -i eth0
```

### Database Queries

```bash
# Open Drizzle Studio
npm run db:studio

# Check active connections
SELECT * FROM pg_stat_activity;
```

## Continuous Integration

### GitHub Actions

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run test
      - run: npm run build
```

## Pre-Launch Checklist

- [ ] All unit tests pass
- [ ] Integration tests pass
- [ ] Load test successful (500 users)
- [ ] Security audit complete
- [ ] Performance benchmarks met
- [ ] Mobile testing complete
- [ ] Payment flow tested on devnet
- [ ] Monitoring configured
- [ ] Alerts set up
- [ ] Backup strategy in place
- [ ] Rollback plan documented
