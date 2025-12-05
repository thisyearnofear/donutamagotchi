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

## What Makes Us Different

### vs King Glazer (Pool Model)
- **King Glazer**: Governance voting, strategy optimization, yield farming
- **Donutamagotchi**: Personal pets, generational legacy, trait development
- **Synergy**: Both operate on same $DONUT infrastructure, different use cases

### vs Other Frontends
- **Builder Codes (Generic Frontends)**: Simple UI, no persistence
- **Donutamagotchi**: Pet lifecycle, breeding, traits, sanctuary system
- **Differentiation**: True tamagotchi gameplay, not just theming

### vs Original Tamagotchi
- **Classic**: Time-based care, death/consequences
- **Donutamagotchi**: + Breeding system, trait inheritance, community interaction, tokenized engagement
- **Modern Take**: Digital pet game + blockchain composability

---

## Phase 1: Foundation (Weeks 1-3)

**Goal:** Add personality and progression to the existing donut

### Traits System

**Pet Attributes:**
- **Personality Type**: Friendly, Energetic, Lazy, Stubborn (affects animations/responses)
- **Coloring**: Hue variations (affects visual appearance)
- **Base Earning Potential**: ±5% DPS variance (cosmetic, no P2W)
- **Social Score**: 0-100 (increases via interactions with other donuts)

**Implementation:**
- Traits generated on miner creation (pseudo-random from `miner` address)
- Stored off-chain but verifiable (hash + contract address)
- Visual updates to DonutPet canvas (color variations, expression styles)
- No contract changes needed

### Trait Development

**How Traits Evolve Through Play:**
- **Grooming** (Petting): Increases shininess/color saturation
- **Energy** (Playing): Changes animation speed/intensity
- **Satisfaction** (Feeding): Shifts expression, increases idle happiness
- **Sociability** (Cross-donut interactions): Unlocks special poses/reactions

**Mechanics:**
- Track interactions via `lastInteractionTime` (existing)
- Add trait state object: `{ grooming: 0-100, energy: 0-100, ... }`
- Visual changes update in real-time as you play
- No storage needed (client-side + indexable events)

### Visual Improvements

**Donut Appearance Changes:**
- Color shifts based on personality + grooming
- Eyes change shape per personality type
- Animations speed up/slow down per energy level
- New idle poses based on trait combinations

**Pet Response Customization:**
- Lazy donut = slower, grumpy responses
- Energetic donut = bouncy, enthusiastic responses
- Friendly donut = heart particles, warm messages
- Stubborn donut = resistant to petting, needs feeding instead

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

**Smart Contract:** Simple ERC20 on Base, minting tied to game events

### Global Donut Explorer

**New Page:** `/donuts` - View all active miners

**Features:**
- List all active donuts sorted by: earnings/hour, age, health, personality
- Click to view full stats: owner, earnings, trait breakdown, health/happiness
- **You earn +10 $DONUTAMAGOTCHI tokens** when you view a donut
- **You earn +5 tokens** when you interact with someone else's donut (click it to poke)
- Search by owner name / Farcaster username
- Filter by trait type, earning rate, age range

**Why It Works:**
- Drives discovery (seeing others' pets makes you want one)
- Creates FOMO ("that donut's cooler than mine")
- Rewards social engagement (viewing = earnings)
- No contract changes needed (just GraphQL queries)

### Hall of Fame

**New Page:** `/hall-of-fame` - Retired and legendary donuts

**Features:**
- All retired donuts (lifecycle ended)
- Donuts that reached max health/happiness
- Donuts that were bred (lineage tracker)
- Stats frozen at retirement: final earnings, age, trait summary
- Can view but not interact
- Search by owner/creation date

**Why It Works:**
- Honors player investment without breaking economics
- Provides goal/aspiration (want my donut in Hall of Fame)
- Creates narrative (see other players' achievements)

---

## Phase 2: Lifecycle (Weeks 4-5)

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

RETIRED (Optional)
├─ Leaves active rotation
├─ Cannot be stolen or fed
├─ Generates +0.1 $DONUTAMAGOTCHI/day forever
├─ Can visit (view-only)
└─ Contributes to breeding pool (offspring inherit genetics)
```

**Implementation:**
- Add `createdAt` timestamp to miner state (block time)
- Calculate age client-side: `(now - createdAt) / 86400`
- Scale DPS display and breeding eligibility based on age
- No contract changes (all calculated from existing data)

### Sanctuary System

**Retirement Option:**
- At Day 90+, owner can claim "Retirement Certificate" (free action)
- Donut leaves active rotation permanently
- Cannot be stolen, cannot mine anymore
- Generates passive $DONUTAMAGOTCHI (small, forever)
- Appears in Sanctuary + Hall of Fame

**Mechanics:**
- New contract: `DonutamagotchiSanctuary.sol` (ERC721 for retired donuts)
- Mints NFT representing retired donut with frozen stats
- Owner can visit, view, interact (emotional connection)
- Offspring inherit genetics from retired donuts (keeps legacy alive)

**Why This Matters:**
- **Solves casual player problem**: Don't lose everything when stolen, can retire with honor
- **Creates narrative closure**: Natural death → legacy, not sudden loss
- **Supports breeding**: Retired donuts' genetics circulate through offspring
- **Respects investment**: Player effort is immortalized

### Death & Legendary Status

**Alternative: Let It Die**
- If donut is stolen and not fed by new owner, health → 0
- Dies after 72 hours of neglect (new owner doesn't feed)
- Becomes "Legendary" in Hall of Fame (more prestigious than retirement)
- Greater bragging rights ("survived 120 days actively")

**Mechanics:**
- Track `lastFedAt` timestamp
- If `now - lastFedAt > 72 hours`, mark as dead
- Legendary donuts get special badge + ranking boost

**Why Both Options Matter:**
- Respects classic tamagotchi (can die from neglect)
- But also respects players who lose (can retire gracefully)
- Creates two paths to immortality: legendary or honored

### Companion Features

**Pet Age Display**
- Stats UI shows: "Age: 45 days (Prime)"
- Visual indicators: growth bar, maturity badge
- Milestone messages: "Your donut is now a Prime Earner!"

**Lifecycle Events**
- Pop-up notifications: "Your donut has matured!"
- Encourages check-ins at each stage
- Drives engagement spikes (want to celebrate milestones)

---

## Phase 3: Breeding (Weeks 6-8)

**Goal:** Enable players to create next generation, build bloodlines, extend ecosystem

### Breeding Mechanics

**Requirements:**
- Both donuts must be Prime age (30-90 days)
- Both must be owned by wallet addresses (or guild consensus if pooled)
- Breeding costs: 1000 $DONUTAMAGOTCHI (burned to reduce supply)
- Breeds can happen 1x per donut per 7 days (prevents farming)
- Offspring takes 1 day to "incubate" (suspense/engagement)

**Offspring Creation:**
```
Parent A (Energetic, Pink, High-Grooming)
+
Parent B (Friendly, Blue, High-Social)
=
Child (Balanced personality, Purple hue, both traits inherited)
```

**Trait Inheritance:**
- Personality: 70% chance inherit one parent's + 30% mutation
- Color: Blend of both (genetic crossover)
- Earning Potential: Average of both (no advantage, cosmetic)
- Gen Counter: Gen(child) = max(Gen(A), Gen(B)) + 1

**Implementation:**
- New contract: `DonutBreeding.sol` (tracks offspring data)
- Offspring NFT minted to owner, represents new donut
- Links to parent addresses (immutable genealogy)
- Stored on-chain for verifiability

### Breeding Mechanics Contract

**Smart Contract Addition (Minimal):**
```solidity
contract DonutBreeding {
  struct Offspring {
    uint256 parentA;
    uint256 parentB;
    address owner;
    uint256 createdAt;
    uint8 generation;
  }

  mapping(uint256 => Offspring) public offspring;
  
  function breed(
    address parentAMiner,
    address parentBMiner,
    string calldata metadata
  ) external {
    // Verify both parents exist and are Prime age
    // Transfer 1000 $DONUTAMAGOTCHI from msg.sender
    // Mint new offspring NFT
  }
}
```

**No Changes to Core $DONUT Contract**
- Existing mining contract unchanged
- New offspring compete as separate miners
- Treasury benefits from breeding fee demand

### Pedigree Tracking

**Bloodline Features:**
- Every donut has verifiable parents (on-chain)
- View full family tree: ancestors, siblings, offspring
- Rarity based on lineage: "3rd generation of the Alpha line"
- Breeding achievements: "Produced 10 offspring"

**Leaderboard Extensions:**
- Sort by bloodline rarity
- "Most prolific breeders"
- "Longest unbroken pedigree"
- Creates status/achievement system

### Cosmetic Breeding Outcomes

**Rare Trait Combinations (Cosmetic Only):**
- Breeding can create ultra-rare hues (1 in 1000 chance)
- Unique animation unlocks (special pose for rare combos)
- Legendary bloodline badges (if parents are legendary)
- Cosmetic NFTs minted for ultra-rare offspring

**Why Cosmetic-Only:**
- No P2W (rare traits = better earning potential ❌)
- No pressure to whale (bragging rights, not economics)
- Supports cosmetics market (players want rare cosmetics)

### Breeding Matchmaking (Social)

**New Feature:** Breeding Bulletin Board
- Browse available donuts seeking breeding partners
- Filter by: personality, generation, earning rate, trait combo
- Send breeding requests (owner must approve)
- Track breeding agreements off-chain (social feature, not contract)

**Why It Works:**
- Cross-player interaction (need someone else's donut)
- Social discovery (see other players' donuts)
- Negotiation mechanics (agree on offspring ownership split)
- Creates community memes ("breeding meta")

---

## Phase 4: Community & Leaderboards (Weeks 9-12)

**Goal:** Build social features that increase daily engagement and stickiness

### Leaderboard Overhaul

**New Ranking Systems:**

1. **Earnings Leaderboard**
   - Lifetime $DONUT earned
   - Current week earnings
   - Filter: by donut generation, age, personality

2. **Trait Rarity Leaderboard**
   - Ultra-rare trait combos
   - Highest social score
   - Best grooming level
   - Unique cosmetics collected

3. **Bloodline Leaderboard**
   - Most offspring produced
   - Longest unbroken pedigree
   - Most legendary ancestors
   - Largest family tree

4. **Player Achievement Leaderboard**
   - Total donuts retired
   - Total donuts bred
   - Days of consecutive care-taking
   - Rarest cosmetics owned

### Pet Discovery & Recommendations

**"Donut of the Day"**
- Randomly feature a player's donut
- Featured donut + owner get +50 $DONUTAMAGOTCHI
- All viewers who interact get +10 tokens
- Drives engagement for new/casual players

**"Suggested Breeding Partners"**
- Algorithm recommends compatible donuts
- Based on: personality balance, rarity, generation level
- Players can swipe through (Tinder-style)
- Creates organic social connections

**"Hall of Fame Spotlight"**
- Feature retired/legendary donuts
- Owner gets prestige badges
- Drives aspiration for new players

### Guild System (Optional Enhancement)

**If Implementing (Post-Phase 4):**
- Guilds collectively care for shared donut (similar to King Glazer)
- Guild vote on breeding partners
- Shared offspring = shared ownership
- Pooled cosmetics treasury

**Note:** This is optional. Core game works solo + breeding.

### Cosmetics & Customization

**Pet Customization Shop**

Earn through gameplay, spend on cosmetics:

**Hats & Accessories** (50-200 tokens)
- Wizard hat, crown, sunglasses, etc.
- Change donut visual appearance
- Persist across state changes

**Animations & Emotes** (100-300 tokens)
- New gestures (dab, wave, dance)
- Unique idle animations
- Personality-specific poses

**Themes & Skins** (200-500 tokens)
- Holiday variants (Halloween pumpkin donut, Christmas candy cane)
- Seasonal events (summer splash, winter frost)
- Mythical themes (dragon donut, space donut)

**Pet Name & Bio** (200 tokens, one-time)
- On-chain naming (immutable, unique)
- Creates identity
- Appears in leaderboards/explorer

**Sanctuary Upgrades** (500+ tokens)
- Luxury retirement homes
- Statues for legendary donuts
- Memorial plaques
- Cosmetic-only enhancements

**Cosmetics Burning**
- 30% of cosmetics revenue burned ($DONUTAMAGOTCHI)
- Reduces circulating supply
- Benefits holders long-term
- Creates deflationary pressure

### Social Interactions

**Pet Visiting System**
- View other donuts in real-time
- Interact: pet, poke, compliment
- Leave comments on pet pages
- Follow favorite donuts (get notifications of milestones)

**Achievements & Badges**
- "First Donut": Mint your first donut
- "Prime Time": Reach Prime age
- "Legendary": Reach 100+ days alive
- "Breeder": Produce 5 offspring
- "Collector": Own 10 cosmetics
- "Social Butterfly": Visit 50 different donuts
- "Hall of Famer": Retire a donut

**Notification System**
- Donut aging milestones
- Breeding offers received
- Followers viewing your donut
- Achievements unlocked
- Cosmetics available

---

## Token Economics: $DONUTAMAGOTCHI

### Supply & Distribution

**Total Supply:** 1 Billion $DONUTAMAGOTCHI

**Allocation:**
```
70% (700M) - Play-to-Earn Rewards
├─ Daily login: +10/day = 3.65B tokens/year (capped at 700M over time)
├─ Interactions: +5-25 per action
├─ Breeding: +25 per successful breed
└─ Social: +10 per viewing/following

20% (200M) - Treasury & Cosmetics Shop
├─ Cosmetics inventory budget
├─ Community events & giveaways
└─ Development fund

10% (100M) - Liquidity & Staking Rewards
├─ Initial DEX liquidity (Base, Uniswap V3)
├─ Staking rewards for governance (5% APY)
└─ Burns from cosmetic usage (deflationary)
```

### Revenue Model (Sustainable)

**Cosmetics Sales → Burning Cycle:**
1. Player earns $DONUTAMAGOTCHI through play
2. Player buys cosmetic (e.g., 200 tokens)
3. 30% burned (60 tokens removed from circulation)
4. 70% to treasury (140 tokens)
5. Treasury used for: rewards, liquidity support, operations

**Breeding Fees:**
1. Breeding costs 1000 $DONUTAMAGOTCHI
2. 100% burned (reduces supply)
3. Incentivizes long-term holding (supply scarcity)
4. Creates natural demand sink

**Staking Rewards:**
1. Stake 10M+ $DONUTAMAGOTCHI to vote on cosmetics
2. Earn 5% APY on staked amount
3. Treasury mints rewards (capped, sustainable)
4. Aligns long-term holders with ecosystem health

### Use Cases (Non-P2W)

| Token Use | Cost | Benefit | Availability |
|-----------|------|---------|--------------|
| Trait Customization | 50-500 | Visual uniqueness | All players |
| Breeding | 1000 | Create offspring | Prime age+ |
| Naming | 200 | Permanent identity | All players |
| Animation Unlock | 100-300 | New gestures | All players |
| Sanctuary Upgrade | 500+ | Legacy display | Retired donuts |
| Governance Vote | Stake 10M | Shape cosmetics | Long-term holders |
| Breeding Boost | 200 | Increased trait odds | Prime age+ |

### Price Dynamics & Sustainability

**Why $DONUTAMAGOTCHI Won't Hyperinflate:**
1. Burning mechanism (cosmetics, breeding)
2. Daily cap on minting (~2-5M max)
3. No external funding/presale (fair launch only)
4. Earning rate decreases with adoption
5. Staking rewards capped at 5% APY

**Price Floor Support:**
- Cosmetics always cost fixed $DONUTAMAGOTCHI
- Breeding always burns 1000 (real demand)
- Sanctuary access requires holding
- Staking generates yield (HODLing incentive)

---

## How We Serve the $DONUT Ecosystem

### Direct Value Contributions

**1. Mining Activity Acceleration**
- Trait-based engagement → daily feeding
- Breeding creates fresh donuts → new mining tiers
- Each donut generation feeds $DONUT circular economy
- Treasury profits from 15% of each feed transaction

**2. Liquidity Support**
- Cosmetics revenue can fund $DONUT-WETH LP maintenance
- Early protocols often need treasury support for liquidity
- Our economics can contribute without extracting value

**3. Network Effects**
- New player onboarding ("let me try tamagotchi") → education on $DONUT
- Cross-breeding drives player interaction → community growth
- Leaderboards drive competitiveness → more feeds
- More ecosystem participants = more protocol fees

**4. Protocol Development Signaling**
- We demonstrate demand for engagement features
- Show viable casual player monetization (without breaking economics)
- Prove tamagotchi mechanics work on top of Dutch auctions
- Can inform future $DONUT improvements

### Partnership Opportunities

**Builder Code Integration:**
- Our frontend operates as builder code (5% of feeds)
- Revenue supports cosmetics/events
- Demonstrates builder code viability

**Blazery Synergy:**
- Cosmetics revenue feeds treasury
- Treasury supports $DONUT-WETH LP
- LP buyback & burn benefits long-term holders

**Cross-Promotion:**
- King Glazer & Donutamagotchi co-exist peacefully
- Different use cases (DeFi vs casual play)
- Can drive traffic to each other

---

## Technical Implementation Notes

### Minimal Smart Contracts

**Only New Contracts Needed:**

1. **DonutamagotchiToken (ERC20)**
   - Standard token on Base
   - Minting tied to game events (oracle/backend)
   - Simple, audited, low risk

2. **DonutBreeding (ERC721)**
   - Tracks offspring metadata
   - Links to parent miners
   - Immutable genealogy

3. **DonutSanctuary (ERC721)**
   - Retired donut NFTs
   - Frozen stats + achievements
   - View-only interactions

**No Changes to $DONUT Contracts**
- Complete backward compatibility
- Use existing getMiner() calls
- Benefit from protocol improvements automatically

### Frontend & Indexing

**Subgraph Updates:**
- Index `DonutBreeding` events (pedigree)
- Track `DonutSanctuary` (retirements)
- Calculate age/generation client-side
- Maintain trait state off-chain (client cache)

**New Pages:**
- `/donuts` - Global explorer
- `/hall-of-fame` - Retired/legendary
- `/breeding` - Matchmaking board
- `/profile/[donut]` - Pet details
- `/leaderboards` - Multi-ranking system

**Client-Side Trait System:**
- Generate traits deterministically from miner address
- Calculate visual appearance in canvas
- Store trait state locally (can rebuild anytime)
- No persistent storage needed

### Performance & Scaling

**Optimizations:**
- Lazy load leaderboards (pagination)
- Cache explorer queries (30s)
- Client-side trait rendering (no server load)
- Breed contracts use lazy minting (scalable)

**Cost Considerations:**
- Breeding contracts: ~200k gas per breed (player pays)
- Token minting: Backend batches transactions
- No continuous on-chain state updates
- Sanctuary NFT: Standard ERC721 (cheap minting)

---

## Risks & Mitigations

### Token Dilution Risk
**Problem:** Too many $DONUTAMAGOTCHI = price death spiral
**Mitigation:** 
- Hard cap on daily minting (2-5M max)
- Burning mechanisms (cosmetics, breeding)
- Staking rewards (incentivizes long-term holding)
- Monitor & adjust seasonally

### P2W Perception Risk
**Problem:** Players feel cosmetics are "pay-to-win"
**Mitigation:**
- Cosmetics are purely visual (no stats impact)
- All cosmetics earnable through play
- Expensive cosmetics achievable in 2-4 weeks of play
- Clear messaging: "cosmetic only"

### Smart Contract Risk
**Problem:** New contracts have bugs
**Mitigation:**
- Simple, audited contracts (minimal code)
- No protocol-breaking changes (isolated contracts)
- Gradual rollout (breeding phase last)
- OpenZeppelin standards (battle-tested)

### Adoption Risk
**Problem:** Players don't care about traits/breeding
**Mitigation:**
- Phase 1 focuses on visual feedback (immediate gratification)
- Leaderboards drive competition (proven engagement)
- Cosmetics create social status (strong incentive)
- Start small, scale with demand

---

## Competitive Advantages

| Feature | Us | King Glazer | Generic Frontend |
|---------|--|----|---|
| Personal Pet | ✅ | ❌ Pool | ❌ Stateless |
| Trait System | ✅ | ❌ | ❌ |
| Breeding | ✅ | ❌ | ❌ |
| Lifecycle | ✅ | ❌ Infinite | ❌ |
| Cosmetics | ✅ | ❌ | ❌ |
| Social Leaderboards | ✅ | Partial (strategy) | ❌ |
| Storytelling | ✅ Bloodlines | ❌ | ❌ |

---

## Timeline & Milestones

| Phase | Duration | Key Deliverables | Metrics |
|-------|----------|------------------|---------|
| **Phase 1: Foundation** | Weeks 1-3 | Traits, $DONUTAMAGOTCHI token, Explorer | 50+ unique players, $0.10+ token price |
| **Phase 2: Lifecycle** | Weeks 4-5 | Age system, Sanctuary, Hall of Fame | 100+ retired donuts, 20% retention |
| **Phase 3: Breeding** | Weeks 6-8 | Breeding contracts, Pedigree, Matchmaking | 200+ successful breeds, community coordination |
| **Phase 4: Social** | Weeks 9-12 | Leaderboards, Cosmetics, Achievements | 500+ players, 10+ cosmetics sold daily |

**Success Metrics:**
- Daily active users (target: 300+ by month 3)
- Feeding frequency increase (target: +50% feeds/user)
- Token price stability ($0.05-0.20)
- Hall of Fame entries (target: 100+ by month 2)
- Breeding participation (target: 10% of active players breed)
- Cosmetics adoption (target: 30% of players own cosmetic)

---

## Conclusion

**Donutamagotchi** is not a competitor to $DONUT—it's a **gateway drug**.

We take casual players who love tamagotchi and turn them into $DONUT enthusiasts through:
- **Personal attachment** (your unique donut, your traits)
- **Generational gameplay** (breeding lineages, lasting legacy)
- **Community engagement** (leaderboards, cosmetics, social play)
- **Sustainable economics** ($DONUTAMAGOTCHI supports itself + feeds treasury)

We maintain 100% compatibility with existing infrastructure while adding the engagement layer that protocols need to break through to mainstream audiences.

**The goal:** Make $DONUT not just a token, but a pet you care about.
