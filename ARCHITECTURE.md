# System Architecture

## High-Level Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│  Browser (Desktop/Mobile)                                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Next.js UI  │  │ Canvas Game  │  │ Socket.io    │          │
│  │  Components  │  │  Renderer    │  │   Client     │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│         │                  │                  │                  │
│         └──────────────────┴──────────────────┘                  │
│                            │                                     │
└────────────────────────────┼─────────────────────────────────────┘
                             │
                    ┌────────┴────────┐
                    │   HTTPS/WSS     │
                    └────────┬────────┘
                             │
┌────────────────────────────┼─────────────────────────────────────┐
│                      API LAYER                                   │
├────────────────────────────┼─────────────────────────────────────┤
│  ┌─────────────────────────┴──────────────────────────┐         │
│  │         Next.js API Routes (Vercel)                │         │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐         │         │
│  │  │   Auth   │  │  Lobby   │  │  Stats   │         │         │
│  │  │   x403   │  │   x402   │  │ History  │         │         │
│  │  └──────────┘  └──────────┘  └──────────┘         │         │
│  └────────────────────────────────────────────────────┘         │
│                             │                                    │
│  ┌─────────────────────────┴──────────────────────────┐         │
│  │      Socket.io Game Server (Fly.io/Render)         │         │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐         │         │
│  │  │  Lobby   │  │   Game   │  │  60Hz    │         │         │
│  │  │ Manager  │  │ Instance │  │  Loop    │         │         │
│  │  └──────────┘  └──────────┘  └──────────┘         │         │
│  └────────────────────────────────────────────────────┘         │
└──────────────────────────┬───────────────────────────────────────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
┌─────────────▼──┐  ┌──────▼──────┐  ┌─▼──────────────┐
│   PostgreSQL   │  │    Redis    │  │  Solana RPC    │
│    (NeonDB)    │  │  (Upstash)  │  │   Mainnet      │
│                │  │             │  │                │
│  ┌──────────┐  │  │ ┌─────────┐ │  │ ┌────────────┐ │
│  │ Matches  │  │  │ │Sessions │ │  │ │   USDC     │ │
│  │ Players  │  │  │ │ Cache   │ │  │ │ Transfers  │ │
│  │  Txns    │  │  │ └─────────┘ │  │ └────────────┘ │
│  └──────────┘  │  └─────────────┘  └────────────────┘
└────────────────┘
```

## Component Architecture

### Frontend (Next.js)

```
app/
├── layout.tsx              # Root layout with WalletProvider
├── page.tsx                # Home page (lobby selection)
├── lobby/page.tsx          # Lobby waiting room
├── game/page.tsx           # Game canvas
├── stats/page.tsx          # Statistics dashboard
├── history/page.tsx        # Match history
└── api/                    # API routes
    ├── auth/
    │   ├── challenge/      # Generate signing challenge
    │   └── verify/         # Verify wallet signature
    ├── lobby/
    │   ├── create/         # Create lobby (HTTP 402)
    │   └── verify-payment/ # Verify USDC payment
    ├── stats/              # Game statistics
    ├── history/            # Player history
    └── health/             # Health check

components/
├── WalletProvider.tsx      # Solana wallet context
├── GameCanvas.tsx          # Canvas rendering + controls
└── MobileControls.tsx      # Touch joystick + boost
```

### Backend (Node.js)

```
server/
├── index.ts                # Socket.io server + Express
├── db/
│   ├── schema.ts           # Drizzle ORM schema
│   └── index.ts            # Database connection
├── game/
│   ├── GameInstance.ts     # Single game logic
│   └── LobbyManager.ts     # Multi-lobby management
├── solana/
│   ├── auth.ts             # x403 authentication
│   └── payments.ts         # x402 payment verification
└── utils/
    ├── redis.ts            # Redis client
    └── antibot.ts          # Bot detection
```

### Shared Code

```
shared/
├── types.ts                # TypeScript interfaces
└── physics.ts              # Deterministic physics engine
```

## Data Flow

### 1. Authentication Flow (x403)

```
Client                    API                     Database
  │                        │                         │
  │──── GET challenge ────>│                         │
  │<─── message + nonce ───│                         │
  │                        │                         │
  │ (sign with wallet)     │                         │
  │                        │                         │
  │──── POST verify ──────>│                         │
  │     + signature        │                         │
  │                        │──── verify sig ────────>│
  │                        │<─── create session ─────│
  │<─── session token ─────│                         │
```

### 2. Payment Flow (x402)

```
Client                    API                   Solana
  │                        │                      │
  │──── POST create ──────>│                      │
  │     lobby              │                      │
  │<─── 402 Payment ───────│                      │
  │     Required           │                      │
  │     + instructions     │                      │
  │                        │                      │
  │──── send USDC ─────────┼─────────────────────>│
  │     transaction        │                      │
  │                        │                      │
  │──── POST verify ──────>│                      │
  │     payment            │                      │
  │                        │──── verify tx ───────>│
  │                        │<─── confirmed ────────│
  │<─── lobby joined ──────│                      │
```

### 3. Game Loop (60Hz)

```
Server                    Clients
  │                         │
  │◄──── player input ──────┤ (continuous)
  │                         │
  │ ┌─────────────────┐     │
  │ │  Every 16.67ms  │     │
  │ │  (60Hz tick)    │     │
  │ │                 │     │
  │ │ 1. Update pos   │     │
  │ │ 2. Check collis │     │
  │ │ 3. Collect food │     │
  │ │ 4. Check winner │     │
  │ └─────────────────┘     │
  │                         │
  │───── game state ───────>│ (60Hz broadcast)
  │                         │
  │                         │ (render at 60fps)
```

### 4. Payout Flow

```
Server                  Solana                Database
  │                       │                      │
  │ (game ends)           │                      │
  │                       │                      │
  │──── calculate ────────┼─────────────────────>│
  │     winner            │                      │
  │     80% payout        │                      │
  │                       │                      │
  │──── send USDC ───────>│                      │
  │     to winner         │                      │
  │<──── tx hash ─────────│                      │
  │                       │                      │
  │──── record ───────────┼─────────────────────>│
  │     payout            │                      │
  │                       │                      │
  │──── buyback ─────────>│                      │
  │     5% SLITHER        │                      │
  │                       │                      │
  │──── stake ───────────>│                      │
  │     in contract       │                      │
```

## Database Schema

```sql
┌─────────────────┐
│     users       │
├─────────────────┤
│ id (PK)         │
│ wallet_address  │◄────┐
│ created_at      │     │
└─────────────────┘     │
                        │
┌─────────────────┐     │
│    matches      │     │
├─────────────────┤     │
│ id (PK)         │◄────┼────┐
│ lobby_type      │     │    │
│ entry_fee       │     │    │
│ pot_amount      │     │    │
│ winner_address  │─────┘    │
│ winner_payout   │          │
│ payout_tx_hash  │          │
│ started_at      │          │
│ ended_at        │          │
│ status          │          │
└─────────────────┘          │
                             │
┌─────────────────┐          │
│ match_players   │          │
├─────────────────┤          │
│ id (PK)         │          │
│ match_id (FK)   │──────────┘
│ wallet_address  │
│ entry_tx_hash   │
│ final_length    │
│ kill_count      │
│ survival_time   │
│ placement       │
│ joined_at       │
└─────────────────┘

┌─────────────────┐
│  transactions   │
├─────────────────┤
│ id (PK)         │
│ wallet_address  │
│ tx_hash         │
│ type            │
│ amount          │
│ match_id (FK)   │
│ status          │
│ created_at      │
└─────────────────┘

┌─────────────────┐
│    sessions     │
├─────────────────┤
│ id (PK)         │
│ wallet_address  │
│ token           │
│ challenge       │
│ expires_at      │
│ created_at      │
└─────────────────┘
```

## Game State Management

### Server State

```typescript
GameInstance {
  id: string
  state: {
    snakes: Map<playerId, Snake>
    pellets: Pellet[]
    tick: number
    startTime: number
  }
  playerInputs: Map<playerId, Input>
  tickInterval: NodeJS.Timeout
}

Snake {
  id: string
  walletAddress: string
  segments: Vector2[]
  angle: number
  length: number
  boosting: boolean
  alive: boolean
  killCount: number
  color: string
}
```

### Client State

```typescript
GameCanvas {
  socket: Socket
  gameState: GameState | null
  mySnakeId: string | null
  camera: { x: number, y: number }
  input: { angle: number, boosting: boolean }
}
```

## Network Protocol

### Socket.io Events

**Client → Server:**
- `authenticate` - Send session token
- `join_lobby` - Join game lobby
- `player_input` - Send movement input

**Server → Client:**
- `authenticated` - Auth successful
- `lobby_update` - Lobby state changed
- `game_state` - Game state (60Hz)
- `game_end` - Match finished
- `error` - Error message

### Message Format

```typescript
// Player Input
{
  angle: number,      // -π to π
  boosting: boolean   // true/false
}

// Game State
{
  snakes: Snake[],
  pellets: Pellet[],
  tick: number
}

// Game End
{
  winnerId: string,
  winnerPayout: number,
  stats: Map<playerId, Stats>
}
```

## Security Architecture

### Authentication Layers

1. **Wallet Signature**: Cryptographic proof of ownership
2. **Session Token**: 35-minute TTL, stored in Redis
3. **One Game Rule**: Redis check prevents multi-accounting
4. **Rate Limiting**: Cloudflare + Express middleware

### Payment Verification

1. **Client sends transaction**
2. **Server fetches from Solana**
3. **Verify recipient = treasury**
4. **Verify amount ≥ entry fee**
5. **Verify reference in transaction**
6. **Check not already used**

### Anti-Bot System

1. **Track movement patterns**
2. **Detect impossible velocity**
3. **Check for perfect patterns**
4. **Flag suspicious behavior**
5. **Auto-kick if confirmed**

## Scaling Strategy

### Horizontal Scaling

```
                    ┌──────────────┐
                    │ Load Balancer│
                    │  (Fly.io)    │
                    └──────┬───────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   ┌────▼────┐       ┌─────▼────┐      ┌─────▼────┐
   │ Server 1│       │ Server 2 │      │ Server 3 │
   │ 5 games │       │ 5 games  │      │ 5 games  │
   └────┬────┘       └─────┬────┘      └─────┬────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
                    ┌──────▼───────┐
                    │ Redis Pub/Sub│
                    │ (Shared State)│
                    └──────────────┘
```

### Database Optimization

- **Connection Pooling**: Max 20 connections per instance
- **Read Replicas**: For stats and history queries
- **Indexes**: On wallet_address, match_id, created_at
- **Partitioning**: Matches table by date

### Caching Strategy

- **Session Tokens**: Redis (35 min TTL)
- **Active Games**: Redis (1 hour TTL)
- **Stats**: Redis (5 min TTL)
- **Leaderboards**: Redis (1 min TTL)

## Monitoring & Observability

### Metrics

1. **Game Performance**
   - Tick rate (target: 60Hz)
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

### Logging

```
[timestamp] [level] [component] message
2025-11-16 12:00:00 INFO GameInstance Game started: lobby-123
2025-11-16 12:00:01 DEBUG Physics Snake moved: player-456
2025-11-16 12:00:02 WARN AntiBot Suspicious movement: player-789
2025-11-16 12:00:03 ERROR Payment Verification failed: tx-abc
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Cloudflare CDN                        │
│              (DDoS Protection + SSL)                     │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
┌───────▼────────┐       ┌────────▼────────┐
│  Vercel Edge   │       │   Fly.io        │
│  (Frontend)    │       │  (Game Server)  │
│                │       │                 │
│  - Next.js     │       │  - Socket.io    │
│  - API Routes  │       │  - Game Loop    │
│  - Static      │       │  - 60Hz Tick    │
└───────┬────────┘       └────────┬────────┘
        │                         │
        └────────────┬────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
┌───────▼────────┐       ┌────────▼────────┐
│   NeonDB       │       │   Upstash       │
│  (PostgreSQL)  │       │   (Redis)       │
└────────────────┘       └─────────────────┘
```

## Cost Breakdown (Monthly)

| Service | Tier | Cost | Notes |
|---------|------|------|-------|
| Vercel | Pro | $20 | Frontend hosting |
| Fly.io | 2x shared-cpu-2x | $30 | Game servers |
| NeonDB | Starter | $19 | PostgreSQL |
| Upstash | Pay-as-you-go | $10 | Redis |
| Cloudflare | Free | $0 | CDN + DDoS |
| Domain | - | $1 | slither.world |
| **Total** | | **$80** | ~500 concurrent users |

## Performance Benchmarks

| Metric | Target | Actual |
|--------|--------|--------|
| Tick Rate | 60Hz | 59-61Hz |
| Client FPS | 60fps | 55-60fps |
| API Latency (p95) | <50ms | 35ms |
| Socket Latency | <30ms | 20ms |
| DB Query Time | <10ms | 5ms |
| Concurrent Users | 500+ | 750+ |

---

**Last Updated**: November 2025  
**Version**: 1.0.0
