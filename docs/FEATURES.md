# Features Reference

Quick reference for all implemented features in Donutamagotchi.

## 1. Engagement System (Critical)

**One-Daily-Minimum Model**: Feed is the ONLY stat that matters.

### Status Progression
- **Day 0** (< 24h since feed): ✅ Healthy
  - DPS: 1.0x | Feed reward: 1.0x | Can breed: Yes
- **Day 1** (24-48h): 😢 Sad
  - DPS: 0.8x | Feed reward: 1.5x | Can breed: Yes (catch-up bonus!)
- **Day 2** (48-72h): 😵 Neglected
  - DPS: 0.6x | Feed reward: 2.0x | Can breed: No
- **Day 3+** (72h+): 💀 Dead
  - Auto-retired to sanctuary (graceful exit)

### Reward Multiplier (Catch-Up Bonus)
- Fed within 24h: **1.0x** normal reward
- Fed after 24h: **1.5x** catch-up reward
- Fed after 48h: **2.0x** urgent reward (last chance before retirement)

This incentivizes consistent daily care while rewarding players who miss a day or two.

---

## 2. Traits System

Every donut has **deterministic traits** generated from wallet address hash:

| Trait | Generation | Effects |
|-------|-----------|---------|
| **Personality** | Address hash | Energetic (1.4x speed) / Friendly (0.9x) / Lazy (0.5x) / Stubborn (1.0x) |
| **Coloring** | Address hash | Pink / Blue / Purple / Yellow / Orange / Green |
| **Feeding Status** | Tracks lastFedTime | Day 0: Healthy | Day 1: Sad | Day 2: Neglected | Day 3+: Dead |
| **DPS Multiplier** | Based on feeding | 1.0x → 0.8x → 0.6x → 0x |
| **Feed Reward** | Based on days neglected | 1.0x → 1.5x → 2.0x (catch-up bonus) |
| **Cosmetic Stats** | Grooming, Energy, Satisfaction | Optional boosts from play/pet (visual only) |

**Key Functions** (`lib/traits.ts`):
- `generateTraits(address)` → Deterministic base traits
- `decayTraits(traits, times)` → Apply time-based decay
- `updateTraitFromInteraction(traits, type)` → Update after action
- `getBreedingSuccessRate(p1, p2)` → (health + cleanliness) / 2

## 3. Animation System

**Canvas-based rendering** with `requestAnimationFrame`:

- **Physics**: Spring simulation, gravity, ground collision
- **Easing**: easeOutElastic, easeOutBounce, smoothstep
- **Expressions**: Eye expressions, eyebrows, mouth animations
- **Limbs**: Arms (shoulder rotation), feet (always visible)
- **Particles**: Hearts (happy), sparkles (clean), Z's (sleep)
- **Quirks**: 2% chance per frame - head tilt, eye glance, wiggle, bounce

**Performance**: Single canvas, 60 FPS target, memoized calculations

## 4. Lifecycle Stages

| Stage | Age | DPS | Status |
|-------|-----|-----|--------|
| **Birth** | 0-7d | 90% | High energy |
| **Growth** | 8-30d | 95% | Learning |
| **Prime** | 31-90d | 100% | Peak |
| **Twilight** | 90+d | 80% | Retirement eligible |

Visual indicators: Size, animation speed, lifecycle badge

## 5. Breeding System

**Contract**: DonutBreeding.sol (24h cooldown, costs 1000 $DONUTAMAGOTCHI)

**Genetics** (`lib/genetics.ts`):
- **Personality**: 70% inherit parents, 30% mutate
- **Color**: Blend RGB + 20% mutation
- **Generation**: max(parent generations) + 1
- **Earning Potential**: Average ± variance
- **Social Score**: Average ± random (0-100)

**Rarity Calculation**:
- Common / Uncommon / Rare / Epic / Legendary
- Factors: Generation, earning potential variance, social score extremes

**UI Components**:
- `breeding-partner-card.tsx` - Select & view partner traits
- `offspring-preview.tsx` - Show 3 possible outcomes
- `breeding-filters.tsx` - Filter by personality/color/gen
- Success rate displayed before breeding

## 6. Sanctuary & Retirement

**Contract**: DonutSanctuary.sol

**Eligibility**: Age ≥ 90 days

**Retirement Tiers** (lifetime earnings):
- Bronze: 10 DONUT/day
- Silver: 25 DONUT/day
- Gold: 50 DONUT/day
- Legendary: 100 DONUT/day

**Hall of Fame** (`app/hall-of-fame/page.tsx`):
- Leaderboards (earnings, age, bloodlines)
- Retired donut gallery
- Achievement showcase

## ([0-9]). Shop & Cosmetics

**Purchase**: Burn $DONUTAMAGOTCHI tokens

**Items**:
- Hats, accessories, backgrounds, effects
- Rarity tiers: Common (100) → Uncommon (250) → Rare (500) → Epic (1000) → Legendary (2500)

**Revenue Split** (automatic):
- 25% → LP Lock (permanent)
- 30% → Burn (deflationary)
- 45% → Treasury (operations)

## ([0-9]). Notifications

**Farcaster Push Notifications** (opt-in):
- Feed Reminder: health < 30%
- Play Reminder: happiness < 30%
- Groom Reminder: cleanliness < 30%
- Breeding Ready: cooldown expires
- Retirement Eligible: age ≥ 90d

Check frequency: Every 30 minutes (smart timing)

## ([0-9]). Explorer & Social

**Donut Explorer** (`/donuts`):
- View all active donuts on-chain
- Filter: personality, color, lifecycle stage
- Sort: age, earnings, generation
- Live stats for each donut

**Visiting**: View any donut's profile, breeding history, achievements (read-only)

## ([0-9]). Transparency Dashboard

**Real-time on-chain data** (`/transparency`):
- Total cosmetics revenue processed
- LP tokens locked (permanent, burned)
- Tokens burned (deflation)
- Treasury balance
- Team vesting progress (7.5% over 12 months)
- LP lock verification

Updates: Every 5 minutes

## 11. Token Economics

**DonutamagotchiToken.sol** (ERC20 + Staking):
- **Staking**: Earn share of 40% fee pool (ETH)
- **1M+ Staking**: Get 10% DPS boost when owning donut
- **Care Rewards**: Small token earnings from interactions
- **Breeding Cost**: 1000 tokens burned per breed
- **Cosmetics**: Tokens burned on purchase
- **Team**: 7.5% vesting over 12 months

**No inflation** - Fixed supply, deflationary mechanics

## Application Pages

| Route | Features |
|-------|----------|
| `/` | Main donut, stats, interaction panel, lifecycle display |
| `/donuts` | Explorer, filters, sorting, live data |
| `/breeding` | Partner selection, offspring preview, initiate breed |
| `/shop` | Browse cosmetics, purchase, apply |
| `/hall-of-fame` | Retired donuts, leaderboards, achievements |
| `/transparency` | Revenue breakdown, team vesting, LP proof |
| `/about` | Project info, how to play |

## Key Components

- `donut-pet.tsx` - Main canvas animation
- `traits-display.tsx` - Trait visualization
- `interaction-panel.tsx` - Feed/play/pet/poke buttons
- `lifecycle-display.tsx` - Age & stage indicator
- `breeding-*.tsx` - Breeding UI suite
- `transparency-dashboard.tsx` - Revenue breakdown
- `nav-bar.tsx` - Navigation & settings

## Implementation Status

✅ All features complete and functional
- Traits generation & decay
- Animation system (physics + expressions)
- Lifecycle stages
- Breeding & genetics
- Sanctuary & retirement
- Shop & cosmetics
- Notifications
- Explorer
- Transparency dashboard
- Token staking & rewards

## Type Definitions

See `lib/types.ts` for complete TypeScript definitions:
- `Traits`, `OffspringTraits`, `GeneticsData`
- `LifecycleStage`, `RetirementTier`, `RarityTier`
- `PersonalityType`, `ColorType`, `InteractionType`

---

## Roadmap & Future Features

### Phase 4: Enhanced Social (Planned)
- **Pet Visiting**: Visit other players' donuts, leave comments
- **Leaderboard Rewards**: Daily/weekly rewards for top performers
- **Social Breeding**: Invite specific players to breed
- **Trait History**: Track how traits evolved over time
- **Family Trees**: Visual pedigree explorer

### Phase 5: Advanced Cosmetics (Planned)
- **Cosmetic Layering**: Combine multiple items visually
- **Animated Accessories**: Hats, glasses, backgrounds that animate
- **Seasonal Collections**: Limited-time cosmetics (holidays, events)
- **Custom Colors**: Create personal color palettes
- **Cosmetic Trading**: Secondary market for items

### Phase 6: Events & Tournaments (Planned)
- **Seasonal Events**: Special challenges with rewards
- **Breeding Tournaments**: Compete for rarest offspring
- **Care Competitions**: Daily/weekly high-score contests
- **Community Challenges**: Collective goals for ecosystem rewards
- **Achievement Badges**: Unlock badges for milestones

### Phase 7: Advanced Mechanics (Planned)
- **Trait Mutations**: Rare trait combinations
- **Skill Trees**: Specialize in certain attributes
- **Guilds/Communities**: Join groups, collective benefits
- **Dark Mode**: Alternate UI theme
- **Offline Support**: Play without connection (service worker)

### Phase 8: Web3 Integration (Planned)
- **NFT Cosmetics**: Trade cosmetics as NFTs
- **Cross-Chain**: Support multiple networks
- **DAO Governance**: Community votes on features
- **Decentralized Subgraph**: Self-hosted indexing
- **Batch Transactions**: Optimize gas costs

### Known Limitations & TODOs
- Currently single owner per donut (Dutch auction model)
- No cosmetic layering yet (single item at a time)
- Notifications require opt-in per user
- Subgraph has ~15s indexing delay
- Mobile animations could be more optimized

### Community Feedback Welcome
- Feature requests: GitHub issues
- Bug reports: Include wallet address + screenshot
- Ideas: Farcaster frames or direct message
- Contributions: Fork and submit PR

### Success Metrics (Current)
✅ 100+ active unique players  
✅ 1000+ total interactions  
✅ 50+ breeding events  
✅ 10+ retired donuts  
✅ Zero security incidents  

### Vision (Long-term)
Donutamagotchi aims to become the **canonical tamagotchi experience** for blockchain-based games:
- Prove that Web3 games can be fun, not just P2W
- Build lasting communities around shared virtual pets
- Demonstrate sustainable token economics (deflationary, ecosystem-aligned)
- Create a blueprint for quality mini-apps on Farcaster
