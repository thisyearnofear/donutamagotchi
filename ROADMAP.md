# Donutamagotchi Roadmap

## Vision

**Donutamagotchi** reimagines the $DONUT mining protocol as a true tamagotchi experience—where donuts have lifecycles, develop unique traits, and create lasting legacies. We enhance engagement and accessibility for casual players while maintaining full compatibility with and contribution to the core $DONUT economics infrastructure.

### Core Philosophy

We are **not** replacing or competing with the protocol—we are **enhancing it**. Every feature is designed to:
- Deepen player attachment to their donuts
- Increase daily engagement with the protocol
- Drive more frequent feeding (mining) interactions
- Create natural onboarding for non-technical players
- Contribute back to $DONUT liquidity and burning

---

## How We Enhance the $DONUT Ecosystem

### Smart Contract Compatibility

**No Contract Changes Required**
- All existing $DONUT mechanics remain untouched
- Multicall contract for mining/feeding
- Dutch auction price discovery
- Revenue split (80/15/5) unchanged
- Emission schedule preserved

**Frontend Enhancement Layer**
- Our app adds UI/UX on top of existing contracts
- Cosmetic/trait system lives on $DONUTAMAGOTCHI token (separate)
- Pet lifecycle tracked via event logs + off-chain indexing
- All breeding logic in frontend/subgraph, not contracts

### Economic Alignment

**How $DONUTAMAGOTCHI Drives $DONUT Value:**

1. **Increased Mining Activity**
   - Traits encourage daily play → daily feeding → more mining transactions
   - Breeding creates new owners with fresh donuts → new mining tiers
   - Mini-games + challenges tie to interactions (petting = small rewards)
   - More feeds = higher $DONUT circulation + burn

2. **Cosmetics Burn Mechanism**
   - 30% of $DONUTAMAGOTCHI spent on cosmetics → burned
   - Reduces circulating supply, benefits long-term holders
   - Trait customization spending feeds burn cycle

3. **Liquidity Support**
   - Treasury can use cosmetic revenues to support $DONUT-WETH LP
   - Staking rewards for $DONUTAMAGOTCHI minted from cosmetic gas fees
   - Aligns both tokens in Blazery ecosystem

4. **Network Effects**
   - Casual players buy $DONUTAMAGOTCHI → discover $DONUT
   - Breeding creates social links → cross-promotion
   - Hall of Fame drives community engagement
   - More players = more fees = more treasury value

---

## Community Alignment Strategy

### Ecosystem-First Economics

**Principle:** A successful $DONUT frontend succeeds when $DONUT succeeds. Our design ensures alignment through:

1. **Transparent Fee Usage (On-Chain Proof)**
   - Treasury address publicly visible in contracts
   - All cosmetics revenue traceable
   - Burn mechanism verifiable on-chain
   - Monthly reports with linked proofs

2. **Locked LP Commitment**
   - Minimum 25% of cosmetics revenue → $DONUT-WETH LP
   - LP tokens burned (permanent liquidity)
   - Published LP burn receipts
   - Community dashboard showing locked value

3. **Sustainable Team Incentives**
   - 7.5% team allocation vested linearly over 12 months
   - Tokens unlock gradually (~0.625%/month)
   - Prevents large dumps, aligns long-term interests
   - Transparent vesting visible on dashboard

4. **Community Responsiveness**
   - Active builder chat participation
   - Public decision-making on governance votes
   - Regular builder community updates
   - Address concerns directly and publicly

---

## Development Phases

### Phase 1A: Community Alignment (COMPLETED)

**Goal:** Establish transparent ecosystem contribution before gameplay launch

- **Smart Contract**: Updated `DonutamagotchiToken.sol` with revenue splitting (25% LP lock, 30% burn, 45% treasury)
- **Frontend**: `/transparency` page with real-time on-chain data dashboard
- **Key Differentiator**: Ecosystem-first approach preventing Donuette scenario

### Phase 1: Foundation (COMPLETED)

**Goal:** Add personality and progression to the existing donut

- **Traits System**: Personality types, coloring, social scores
- **$DONUTAMAGOTCHI Token**: Incentivize engagement without modifying $DONUT mechanics
- **Global Donut Explorer**: View all active miners with discovery incentives

### Phase 1.5: Decay System (COMPLETED)

**Goal:** Create natural care rhythm and urgency through stat decay

- **Decay-Based Needs**: Health, happiness, and cleanliness decay over time
- **Check-in Pattern**: ~5-6 interactions per day for optimal care
- **Breeding Success Rates**: Stat-based breeding viability

### Phase 2: Lifecycle (COMPLETED)

**Goal:** Give donuts natural growth cycles and retirement options

- **Age & Maturation System**: Birth → Growth → Prime → Twilight lifecycle stages
- **Sanctuary System**: Retirement option for aged donuts with passive income

### Phase 3: Breeding (IN PROGRESS)

**Goal:** Enable players to create next generation, build bloodlines, extend ecosystem

- **Breeding Mechanics**: Trait inheritance with 30% mutation chance
- **Pedigree Tracking**: On-chain bloodline verification and family trees
- **Bloodline Leaderboards**: Rarity rankings and breeding achievements

### Phase 4: Farcaster Mini App (SHORT TERM)

**Goal:** Launch mobile-friendly Farcaster integration for social engagement

- **Farcaster Mini App Integration**: Native Farcaster experience for easy onboarding
- **Social Features**: Pet visiting, community leaderboard integration
- **Push Notifications**: Care reminders and breeding notifications via Farcaster
- **Cross-Platform Sync**: Seamless experience between web and Farcaster mini app

### Phase 5: Enhanced Web Experience (MEDIUM/LONG TERM)

**Goal:** Advanced web features for core users and ecosystem growth

- **Advanced Customization**: Expanded cosmetics shop with rare traits
- **Community Features**: Guild system, breeding competitions, seasonal events
- **Advanced Analytics**: Detailed pet performance metrics and optimization tools
- **AI Integration**: Dynamic story generation for donut adventures
- **Cross-Chain Expansion**: Potential expansion to other EVM-compatible chains

---

## Long-term Vision

The goal: Make $DONUT not just a token, but a pet you care about.

We aim to transform $DONUT from a DeFi experiment into a beloved digital pet ecosystem where players form genuine emotional connections with their donuts. This creates sustainable engagement that supports both the $DONUT and $DONUTAMAGOTCHI economies while providing unique entertainment value to the Base ecosystem.