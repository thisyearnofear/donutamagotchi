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

5. **Ecosystem Contribution Documentation**
   - Public dashboard showing:
     - Total $DONUT LP locked
     - Cumulative burns
     - Treasury balance & allocation
     - Team vesting progress
     - Community votes & outcomes
   - Quarterly ecosystem health reports

---

## What Makes Us Different

### vs King Glazer (Pool Model)
- **King Glazer**: Governance voting, strategy optimization, yield farming
- **Donutamagotchi**: Personal pets, generational legacy, trait development
- **Synergy**: Both operate on same $DONUT infrastructure, different use cases

### vs Other Frontends
- **Builder Codes (Generic Frontends)**: Simple UI, no persistence
- **Donutamagotchi**: Pet lifecycle, breeding, traits, sanctuary system
- **Differentiation**: True tamagotchi gameplay, not just theming

---

## Phase 1A: Community Alignment (PREREQUISITE)

**Goal:** Establish transparent ecosystem contribution before gameplay launch

### Smart Contract Changes
- Updated `DonutamagotchiToken.sol` with `processCosmeticsRevenue()`
- Revenue splits: 25% → LP lock, 30% → burn, 45% → treasury
- Tracking: `totalCosmeticsRevenue`, `totalLockedForLP`, `totalBurnedFromCosmetics`
- View function: `getCosmeticsBreakdown()` for real-time transparency

### Frontend Features
- New page: `/transparency` with dashboard + FAQ
- Component: `TransparencyDashboard` shows on-chain data
- Nav button: "PROOF" link to transparency page
- Community commitment messaging

### Key Differentiator
- **Ecosystem alignment**: Locked LP, automatic burns, sustainable team incentives
- **Fair allocation**: 7.5% team vesting, governance via staking
- **Community first**: Transparent reports, audit-friendly smart contracts

---

## Phase 1: Foundation

**Goal:** Add personality and progression to the existing donut

### Traits System

**Pet Attributes:**
- **Personality Type**: Friendly, Energetic, Lazy, Stubborn (affects animations/responses)
- **Coloring**: Hue variations (affects visual appearance)
- **Base Earning Potential**: ±5% DPS variance (cosmetic, no P2W)
- **Social Score**: 0-100 (increases via interactions with other donuts)

### Trait Development

**How Traits Evolve Through Play:**
- **Grooming** (Petting): Increases shininess/color saturation
- **Energy** (Playing): Changes animation speed/intensity
- **Satisfaction** (Feeding): Shifts expression, increases idle happiness
- **Sociability** (Cross-donut interactions): Unlocks special poses/reactions

### $DONUTAMAGOTCHI Token Launch

**Purpose:** Incentivize engagement without modifying $DONUT mechanics

**Distribution:**
- **Daily Login**: +10 $DONUTAMAGOTCHI/day (simple claim)
- **Pet Interactions**: +5 tokens per action (petting, poking, playing)
- **Feeding Bonus**: +10 tokens when you feed your donut (not instead of, but bonus)
- **View Leaderboard**: +3 tokens per session (discovery incentive)

**Total Supply:** 1B tokens (fair launch, no presale)
- 70% to play-to-earn
- 20% to treasury/cosmetics shop
- 10% to liquidity/staking rewards

### Global Donut Explorer

**New Page:** `/donuts` - View all active miners

**Features:**
- List all active donuts sorted by: earnings/hour, age, health, personality
- Click to view full stats: owner, earnings, trait breakdown, health/happiness
- **You earn +10 $DONUTAMAGOTCHI tokens** when you view a donut
- **You earn +5 tokens** when you interact with someone else's donut (click it to poke)

---

## Phase 2: Decay System

**Goal:** Create natural care rhythm and urgency through stat decay

### Decay-Based Needs

**Implementation:**
- **Health Decay**: -0.5% every 30 minutes (halted if fed recently)
- **Happiness Decay**: -1% every 30 minutes (halted if played with)
- **Cleanliness Decay**: -2% every 30 minutes (halted if "cleaned"/interacted)

**Check-in Pattern:**
```
Ideal pet care routine (casual):
├─ Feed every 4 hours (prevents health critical)
├─ Play every 6 hours (prevents happiness critical)
├─ Pet/interact every 2 hours (prevents cleanliness critical)
└─ Total: ~5-6 interactions per day
```

### Breeding Success Rates

**Stat-Based Breeding Viability:**
```
Breeding Success = (health + cleanliness) / 2
├─ <30%: High chance of sickly offspring (lower earning potential)
├─ 30-70%: Normal offspring
└─ >70%: Healthy offspring (bonus trait variation chances)
```

---

## Phase 3: Lifecycle

**Goal:** Give donuts natural growth cycles and retirement options

### Age & Maturation System

**Donut Lifecycle:**
```
BIRTH (Day 0)
├─ Starting DPS: 0.05 DONUT/sec (50% of normal)
├─ Cannot breed yet
├─ Rapid trait changes possible
└─ New player-friendly (slower earning = less pressure to defend)

GROWTH (Days 1-30)
├─ DPS grows gradually: 0.05 → 4.0 DONUT/sec
├─ Traits solidify
├─ Still cannot breed
└─ Players build attachment

PRIME (Days 30-90)
├─ Full earning rate: 4.0 DONUT/sec (or current tier)
├─ Can breed with other Prime donuts
├─ Peak health/happiness possible
└─ Most exciting phase (full potential, breeding competition)

TWILIGHT (Days 90+)
├─ Health gradually decays (even if fed)
├─ Cannot breed anymore
├─ Can be retired or left to die
└─ Graceful endgame phase
```

### Sanctuary System

**Retirement Option:**
- At Day 90+, owner can claim "Retirement Certificate" (free action)
- Donut leaves active rotation permanently
- Cannot be stolen, cannot mine anymore
- Generates passive $DONUTAMAGOTCHI (small, forever)
- Appears in Sanctuary + Hall of Fame

---

## Phase 4: Breeding

**Goal:** Enable players to create next generation, build bloodlines, extend ecosystem

### Breeding Mechanics

**Requirements:**
- Both donuts must be Prime age (30-90 days)
- Both must be owned by wallet addresses
- Breeding costs: 1000 $DONUTAMAGOTCHI (burned to reduce supply)
- Breeds can happen 1x per donut per 7 days
- Offspring takes 1 day to "incubate"

**Trait Inheritance:**
- Personality: 70% chance inherit one parent's + 30% mutation
- Color: Blend of both (genetic crossover)
- Earning Potential: Average of both (no advantage, cosmetic)
- Gen Counter: Gen(child) = max(Gen(A), Gen(B)) + 1

### Pedigree Tracking

**Bloodline Features:**
- Every donut has verifiable parents (on-chain)
- View full family tree: ancestors, siblings, offspring
- Rarity based on lineage: "3rd generation of the Alpha line"
- Breeding achievements: "Produced 10 offspring"

---

## Phase 5: Community & Leaderboards

**Goal:** Build social features that increase daily engagement and stickiness

### Leaderboard Systems

1. **Earnings Leaderboard**
   - Lifetime $DONUT earned
   - Current week earnings

2. **Trait Rarity Leaderboard**
   - Ultra-rare trait combos
   - Highest social score
   - Best grooming level

3. **Bloodline Leaderboard**
   - Most offspring produced
   - Longest unbroken pedigree

4. **Player Achievement Leaderboard**
   - Total donuts retired
   - Total donuts bred
   - Days of consecutive care-taking

### Cosmetics & Customization

**Pet Customization Shop:**

**Hats & Accessories** (50-200 tokens)
- Wizard hat, crown, sunglasses, etc.

**Animations & Emotes** (100-300 tokens)
- New gestures (dab, wave, dance)
- Unique idle animations

**Themes & Skins** (200-500 tokens)
- Holiday variants (Halloween pumpkin donut, Christmas candy cane)
- Seasonal events (summer splash, winter frost)

**Pet Name & Bio** (200 tokens, one-time)
- On-chain naming (immutable, unique)

### Social Interactions

**Pet Visiting System**
- View other donuts in real-time
- Interact: pet, poke, compliment
- Leave comments on pet pages
- Follow favorite donuts

---

## Token Economics: $DONUTAMAGOTCHI

### Supply & Distribution

**Total Supply:** 1 Billion $DONUTAMAGOTCHI

**Allocation:**
```
70% (700M) - Play-to-Earn Rewards
├─ Daily login: +10/day
├─ Interactions: +5-25 per action
├─ Breeding: +25 per successful breed

20% (200M) - Treasury & Cosmetics Shop
├─ Cosmetics inventory budget
├─ Community events & giveaways

10% (100M) - Liquidity & Staking Rewards
├─ Initial DEX liquidity
├─ Staking rewards for governance
```

### Revenue Model (Sustainable)

**Cosmetics Sales → Burning Cycle:**
1. Player earns $DONUTAMAGOTCHI through play
2. Player buys cosmetic (e.g., 200 tokens)
3. 30% burned (60 tokens removed from circulation)
4. 70% to treasury (140 tokens)

**Breeding Fees:**
1. Breeding costs 1000 $DONUTAMAGOTCHI
2. 100% burned (reduces supply)

---

## Future Enhancements

### Phase 6: Advanced Social Features
- Guild system for collective donut care
- Breeding competitions and tournaments
- Community events and seasonal celebrations
- Donut shows and beauty contests

### Phase 7: Mobile & Push Notifications
- Mobile app with push notifications
- Care reminder systems
- Offline progress tracking
- Cross-platform synchronization

### Phase 8: Advanced AI Integration
- AI-generated personality profiles
- Dynamic story generation for donut adventures
- Voice interaction capabilities
- Personalized recommendation engine

---

## Long-term Vision

The goal: Make $DONUT not just a token, but a pet you care about.

We aim to transform $DONUT from a DeFi experiment into a beloved digital pet ecosystem where players form genuine emotional connections with their donuts. This creates sustainable engagement that supports both the $DONUT and $DONUTAMAGOTCHI economies while providing unique entertainment value to the Base ecosystem.