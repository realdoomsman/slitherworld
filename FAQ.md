# Frequently Asked Questions (FAQ)

## General Questions

### What is Slither.io Solana Edition?

A real-time multiplayer snake game where players wager USDC on Solana. The last snake alive wins 80% of the pot. It features deterministic gameplay, server-authoritative physics running at 60Hz, and automated payouts.

### How is this different from regular Slither.io?

- **Real money wagers**: Entry fees in USDC
- **Winner takes pot**: 80% payout to winner
- **Deterministic**: No randomness, pure skill
- **Blockchain-based**: Transparent, verifiable on Solana
- **Instant payouts**: Automated via smart contracts

### Is this legal?

This is a skill-based game, not gambling. Players compete based on skill, not chance. However, legality varies by jurisdiction. Players are responsible for ensuring compliance with local laws.

## Gameplay Questions

### How do I play?

1. Connect your Solana wallet
2. Sign authentication message
3. Choose a lobby ($5, $25, $50, $100, or $500)
4. Pay entry fee in USDC
5. Wait for minimum players
6. Game starts automatically
7. Last snake alive wins!

### What are the controls?

**Desktop:**
- Mouse: Move snake direction
- Click/Hold: Boost

**Mobile:**
- Joystick: Control direction
- Boost button: Speed boost

### How does boosting work?

- Doubles your speed (3 → 6 units/tick)
- Drains 0.5 length per second
- Can't boost below initial length (50 units)
- Use strategically to escape or attack

### What happens when snakes collide?

- **Head-to-body**: Smaller snake dies instantly
- **Head-to-head**: Larger snake wins
- **Equal head-to-head**: Both die
- **Map boundaries**: Instant death

### How do I grow?

- Collect pellets (+2 length each)
- Kill other snakes (gain 30-50% of their length)
- Survive longer

### Is there randomness in the game?

No! Everything is deterministic:
- Pellets spawn in fixed grid positions
- Dead snakes drop pellets at exact death location
- Collision detection is precise
- No RNG in any game mechanic

## Payment Questions

### What cryptocurrencies are accepted?

Only USDC (USD Coin) on Solana mainnet.

### How much does it cost to play?

Entry fees vary by lobby:
- Micro: $5
- Small: $25
- Medium: $50
- Large: $100
- Whale: $500

### How do payouts work?

Automated and instant:
- Winner receives 80% of pot
- 15% dev fee
- 5% buyback & stake SLITHER tokens

Example: $100 lobby with 20 players
- Total pot: $2,000
- Winner gets: $1,600
- Dev fee: $300
- Buyback: $100

### When do I receive my winnings?

Immediately after the game ends. The payout transaction is sent automatically within seconds.

### What if the transaction fails?

The system will retry automatically. If it continues to fail, contact support with your match ID.

### Are there any fees?

- Entry fee: Included in lobby price
- Solana transaction fees: ~$0.00025 (negligible)
- No withdrawal fees

## Technical Questions

### What wallets are supported?

- Phantom
- Solflare
- Any Solana-compatible wallet

### What is x403 authentication?

A wallet signature-based authentication protocol. Instead of passwords, you sign a message with your wallet to prove ownership. More secure and no account needed.

### What is x402 payment protocol?

HTTP 402 Payment Required protocol. When you join a lobby, the server responds with payment instructions. Your wallet sends USDC, and the server verifies on-chain before admitting you.

### How is the game deterministic?

- Server is single source of truth
- All physics calculations on server
- Fixed pellet grid (no random spawns)
- Precise collision detection
- 60Hz tick rate (16.67ms per tick)

### What's the tick rate?

60Hz (60 ticks per second). This means the game state updates 60 times per second for smooth, responsive gameplay.

### How do you prevent cheating?

- Server-authoritative (client can't fake position)
- Input validation (reject impossible movements)
- Anti-bot detection (pattern analysis)
- One game per wallet
- On-chain payment verification

### Can I play on mobile?

Yes! The game is fully responsive with touch controls (joystick + boost button).

### What's the minimum internet speed?

Recommended: 5 Mbps download, 1 Mbps upload, <100ms ping

## Account & Security

### Do I need to create an account?

No! Just connect your Solana wallet. Your wallet address is your identity.

### How is my wallet secured?

- You control your private keys
- We never ask for your seed phrase
- Signatures are verified cryptographically
- Sessions expire after 35 minutes

### Can I play multiple games at once?

No. One active game per wallet to prevent multi-accounting.

### What if I disconnect during a game?

Your snake will continue moving in the last direction until you reconnect or die. Try to reconnect quickly!

### Can I get a refund?

No refunds once a game starts. Entry fees are non-refundable.

## Troubleshooting

### My wallet won't connect

1. Make sure you have Phantom or Solflare installed
2. Refresh the page
3. Try a different browser
4. Clear cache and cookies
5. Check wallet is on Solana mainnet

### Payment verification failed

1. Check you have enough USDC
2. Verify you're on mainnet (not devnet)
3. Wait for transaction confirmation
4. Check transaction on Solscan
5. Contact support if issue persists

### Game is laggy

1. Close other tabs/applications
2. Check your internet connection
3. Try a different browser
4. Reduce browser zoom to 100%
5. Update your graphics drivers

### I can't see my snake

1. Refresh the page
2. Check browser console for errors
3. Try a different browser
4. Disable browser extensions
5. Contact support

### Leaderboard not updating

This is a visual bug. The server still tracks your stats correctly. Refresh the page.

## Strategy & Tips

### How do I win?

- **Early game**: Collect pellets safely
- **Mid game**: Hunt smaller snakes
- **Late game**: Avoid risks, play defensive
- **Use boost wisely**: Escape danger or secure kills
- **Watch the map**: Stay away from edges

### Best strategies?

1. **Circle smaller snakes**: Trap them
2. **Boost through gaps**: Risky but effective
3. **Stay near center**: More escape routes
4. **Watch your length**: Don't boost too much
5. **Predict movements**: Cut off opponents

### Common mistakes?

- Boosting too much (lose length)
- Playing too aggressive early
- Getting trapped at edges
- Not watching behind you
- Chasing kills when ahead

## Community & Support

### Where can I get help?

- GitHub Issues: Bug reports
- Discord: Community support
- Email: support@slither.world
- Twitter: @SlitherSolana

### How do I report a bug?

1. Open GitHub issue
2. Include:
   - Browser and OS
   - Steps to reproduce
   - Screenshots/video
   - Match ID (if applicable)

### Can I contribute?

Yes! The project is open source. Submit PRs on GitHub.

### Is there a Discord?

Yes! Join for:
- Strategy discussions
- Tournament announcements
- Community events
- Support

### Are there tournaments?

Coming soon! Follow on Twitter for announcements.

## Economics

### What is SLITHER token?

The native token of the platform. 5% of every pot is used to buy and stake SLITHER tokens.

### How does buyback work?

After each match:
1. 5% of pot converted to USDC
2. USDC swapped for SLITHER on Raydium
3. SLITHER tokens staked in contract
4. Staking rewards distributed to holders

### Can I stake SLITHER?

Yes! Stake to earn rewards from the 5% buyback pool.

### What's the token distribution?

- 40% Community rewards
- 20% Staking pool
- 20% Team (vested)
- 10% Liquidity
- 10% Treasury

## Roadmap

### What's coming next?

**Phase 2:**
- Tournament mode
- Team battles
- Custom skins (NFTs)
- Spectator mode
- Replay system

**Phase 3:**
- Seasonal leaderboards
- Achievement system
- Referral program
- Mobile app
- Discord bot

**Phase 4:**
- DAO governance
- Custom game modes
- Map editor
- Esports integration

### When is mobile app launching?

Q2 2026 (tentative)

### Will there be NFTs?

Yes! Custom snake skins as NFTs. Purely cosmetic, no gameplay advantage.

## Statistics

### Where can I see my stats?

Visit `/history` page to see:
- Match history
- Win rate
- Total kills
- Total earnings
- Survival time

### Is there a leaderboard?

Yes! Visit `/stats` page for:
- Top players by kills
- Recent winners
- Total volume
- Match count

### How is ranking calculated?

Based on:
- Total kills (primary)
- Win rate
- Average placement
- Total matches played

## Privacy

### What data do you collect?

- Wallet address (public)
- Match statistics
- Transaction hashes
- Session tokens (temporary)

### Do you sell my data?

No. We never sell user data.

### Can I delete my data?

Yes. Contact support to request data deletion.

### Is my wallet address public?

Yes. All blockchain transactions are public. Your wallet address is visible in leaderboards and match history.

## Miscellaneous

### What's the maximum players per game?

- Standard lobbies: 15-25 players
- Whale mode: 30-50 players

### How long does a game last?

Average: 5-10 minutes
Maximum: 15 minutes (then sudden death)

### What happens in sudden death?

Map shrinks gradually, forcing players together.

### Can I spectate games?

Not yet. Coming in Phase 2.

### Is there a practice mode?

Not yet. Coming soon with AI opponents.

### What browsers are supported?

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Brave

### Does it work on iPad?

Yes! Use touch controls.

### What about accessibility?

We're working on:
- Colorblind modes
- Keyboard-only controls
- Screen reader support
- High contrast mode

---

**Still have questions?**

- Join our Discord
- Email support@slither.world
- Check GitHub discussions
- Follow @SlitherSolana on Twitter

**Last Updated**: November 2025
