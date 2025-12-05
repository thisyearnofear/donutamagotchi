# Phase 3: Breeding System Plan

## Overview

Phase 3 implements cross-player breeding, trait inheritance, and pedigree tracking. This is the capstone system that ties together all previous phases and creates long-term engagement through bloodline management.

## Architecture

### Smart Contract: DonutBreeding

```solidity
contract DonutBreeding {
  struct Offspring {
    address parent1;
    address parent2;
    address owner;
    uint256 createdAt;
    uint8 generation;
    bytes32 geneticsHash;  // Traits encoded
  }

  mapping(address => Offspring[]) public offspring;
  mapping(address => uint256) public lastBreedTime;  // 7-day cooldown

  event OffspringCreated(
    address indexed parent1,
    address indexed parent2,
    address indexed offspring,
    uint8 generation
  );

  function breed(
    address minerA,
    address minerB,
    address owner
  ) external payable {
    // 1. Validate both miners exist
    // 2. Validate both are Prime age (30-90 days)
    // 3. Validate breeding cooldown (7 days between breeds)
    // 4. Validate genetics viability (both parents > 30% health+cleanliness)
    // 5. Transfer breeding fee (1000 $DONUTAMAGOTCHI - burned)
    // 6. Calculate offspring traits
    // 7. Mint offspring NFT
    // 8. Emit event for indexing
  }
}
```

## Trait Inheritance System

### Genetic Crossover Algorithm

```typescript
function inheritTraits(parent1: Traits, parent2: Traits): Traits {
  // 1. PERSONALITY (70% inherit, 30% mutation)
  if (Math.random() < 0.7) {
    personality = Math.random() < 0.5 
      ? parent1.personality 
      : parent2.personality;
  } else {
    personality = randomMutation(personality);  // New type
  }

  // 2. COLORING (Blend parent colors)
  const color1 = getColorHSL(parent1.coloring);
  const color2 = getColorHSL(parent2.coloring);
  const blendedHSL = {
    h: (color1.h + color2.h) / 2,
    s: (color1.s + color2.s) / 2,
    l: (color1.l + color2.l) / 2,
  };
  coloring = findClosestColor(blendedHSL);  // Snap to 6 options

  // 3. EARNING POTENTIAL (Average with slight variance)
  earningPotential = (parent1.earningPotential + parent2.earningPotential) / 2;
  earningPotential += (Math.random() - 0.5) * 0.02;  // ±1% additional

  // 4. SOCIAL SCORE (Average both parents)
  socialScore = Math.floor((parent1.socialScore + parent2.socialScore) / 2);

  // 5. GENERATION (Increment to higher parent)
  generation = Math.max(parent1.generation, parent2.generation) + 1;

  return traits;
}
```

### Rarity System

```typescript
interface RarityTier {
  name: string;
  probability: number;
  traitModifier: number;  // Visual effect
  badge: string;
}

// Rare combos (all 6 colors × 4 personalities = 24 combos)
// Ultra-rare (specific color + personality + high social): 1 in 1000

const rarity = calculateRarity(personality, coloring, socialScore);
// Common → Uncommon → Rare → Legendary
```

## Frontend Components

### BreedingInterface Component

```typescript
<BreedingInterface>
  ├─ BreedingEligibility
  │  ├─ Require: Both donuts Prime age (30-90 days)
  │  ├─ Require: Both have >30% breeding viability
  │  ├─ Require: 7 days since last breed per donut
  │  └─ Cost: 1000 $DONUTAMAGOTCHI (burned)
  │
  ├─ PartnerSelection
  │  ├─ Search by address or FID
  │  ├─ View partner stats
  │  ├─ Preview offspring traits (show genetics blend)
  │  └─ Confirm breeding request
  │
  ├─ IncubationTimer
  │  ├─ Show: "Breeding in progress..."
  │  ├─ Timer: 1 day incubation
  │  ├─ Progress: 0-100%
  │  └─ Callback: Show offspring when complete
  │
  └─ OffspringDisplay
     ├─ New donut NFT
     ├─ Inherited traits
     ├─ Generation number
     ├─ Pedigree button
     └─ Mint to wallet button
```

### BreedingBoard Component (Marketplace)

```typescript
<BreedingBoard>
  ├─ ListingCard (for each available donut)
  │  ├─ Owner: FarcasterUsername
  │  ├─ Donut stats: Personality, Color, Gen, Age
  │  ├─ Breeding viability: % success chance
  │  ├─ Last bred: X days ago
  │  ├─ Traits preview: Visual representation
  │  └─ Action button: "Request Breeding"
  │
  ├─ FilterOptions
  │  ├─ Generation: Gen 1, Gen 2+, etc
  │  ├─ Personality: Friendly, Energetic, Lazy, Stubborn
  │  ├─ Color: All 6 options
  │  ├─ Viability: Excellent, Good, Normal, Poor
  │  └─ Sort: By age, generation, viability
  │
  └─ PendingRequests
     ├─ Show incoming breeding offers
     ├─ Accept/Reject buttons
     ├─ View requester's donut
     └─ Confirm breeding terms
```

### PedigreeViewer Component

```typescript
<PedigreeViewer>
  ├─ Family Tree View
  │  ├─ Current donut (center)
  │  ├─ Parents (above)
  │  ├─ Grandparents (further above)
  │  ├─ Offspring (below)
  │  └─ Siblings (side)
  │
  ├─ LineageStats
  │  ├─ Generation: 1, 2, 3+
  │  ├─ Total ancestors: N
  │  ├─ Total offspring: N
  │  ├─ Unique bloodlines: N
  │  └─ Rarity rank: #N
  │
  └─ BloodlineMetadata
     ├─ "Alpha Line" (first generation)
     ├─ "Dragon Line" (fire-themed color combo)
     ├─ "Pure Energetic" (personality preserved 3+ generations)
     └─ Custom user-named lines
```

## Game Mechanics

### Breeding Cooldown

```
Each donut: 7 days between breeds
├─ Day 0: Breed happens
├─ Days 0-7: "Last bred: X days ago" shown
└─ Day 7+: "Ready to breed" status
```

### Offspring Generation

```
Breeding Request → 1 Day Incubation → New Donut NFT Minted

During incubation:
├─ Parent 1: "Incubating (Day 1/1)"
├─ Parent 2: "Incubating (Day 1/1)"
└─ Owner: Notification "Your donuts are breeding!"

On completion:
├─ New NFT minted to owner
├─ Traits determined by genetics
├─ Generation counter incremented
└─ Pedigree links created
```

### Trait Probability Matrix

```
Personality Inheritance:
  ├─ 70% chance: Inherit from either parent
  ├─ 20% chance: Hybrid of both
  └─ 10% chance: Rare mutation (1 in 40 chance)

Color Inheritance:
  ├─ Direct blend of parent colors in HSL space
  ├─ Snapped to closest standard color
  ├─ Ultra-rare combos (1 in 1000):
  │  ├─ Perfect blend results in unique hue
  │  ├─ Special animation unlock
  │  └─ Cosmetic NFT mint
  └─ No pure colors (always blended)

Earning Potential:
  ├─ Average of parents: (P1 + P2) / 2
  ├─ Additional ±1% variance (random)
  └─ Net effect: ±5% like parents
```

## Integration Flow

```
Main Page
├─ BreedingViability component shows readiness
├─ Button: "Ready to breed!" → Opens BreedingInterface
├─ BreedingInterface
│  ├─ Validate eligibility
│  ├─ Show breeding cost (1000 $DONUTAMAGOTCHI)
│  ├─ Search partner donut
│  ├─ Preview offspring traits
│  ├─ Execute breed transaction
│  └─ Show incubation timer
│
└─ /donuts/[address] (Donut Profile Page)
   ├─ DonutStats (existing)
   ├─ BreedingStatus (new)
   ├─ PedigreeViewer (new)
   ├─ ListBreedingOffer button (new)
   └─ OffspringList (new)
```

## Leaderboards Integration

### New Leaderboard Categories

```
1. BREEDING LEADERBOARD
   ├─ Most offspring (ranked by count)
   ├─ Longest unbroken pedigree (generations)
   ├─ Most successful line (offspring health %)
   └─ Rarest bloodline (rarity score)

2. GENERATIONAL LEADERBOARD
   ├─ Highest generation donut
   ├─ Gen 1 survivors (original miners still alive)
   ├─ Most diverse Gen 2+ (various bloodlines bred)
   └─ Youngest generation (fastest reproduction)

3. TRAIT RARITY LEADERBOARD
   ├─ Most unique color combos owned
   ├─ Most rare personality mutations
   ├─ Highest avg offspring rarity
   └─ Legendary trait preservation
```

## Code Structure

### New Files

```
lib/genetics.ts
├─ inheritTraits()
├─ calculateRarity()
├─ blendColors()
├─ mutatePersonality()
└─ generateGeneticsHash()

components/breeding-interface.tsx
├─ BreedingEligibility
├─ PartnerSelection
├─ IncubationTimer
└─ OffspringDisplay

components/breeding-board.tsx
├─ ListingCard
├─ FilterOptions
└─ PendingRequests

components/pedigree-viewer.tsx
├─ FamilyTree
├─ LineageStats
└─ BloodlineMetadata

app/donuts/[address]/page.tsx
├─ DonutProfile
├─ BreedingStatus
├─ PedigreeViewer
└─ OffspringList

app/breeding-board/page.tsx
├─ BreedingBoard UI
└─ Filtering/Search
```

### Modified Files

```
lib/traits.ts
├─ Add: generation field
├─ Add: parentAddresses field
├─ Export: genetics functions

components/breeding-viability.tsx
├─ Add: BreedingUI button
└─ Show: "Ready to breed" status

app/page.tsx
├─ Add: BreedingInterface modal
└─ Trigger: On breeding readiness

components/nav-bar.tsx
├─ Add: BreedingBoard link
└─ Badge: Pending requests count
```

## Implementation Timeline

### Week 1: Contract & Genetics
- [ ] Write DonutBreeding.sol
- [ ] Test trait inheritance
- [ ] Test rarity calculation
- [ ] Deploy to testnet

### Week 2: Frontend Integration
- [ ] Build BreedingInterface
- [ ] Build BreedingBoard
- [ ] Build PedigreeViewer
- [ ] Integrate with wallet

### Week 3: Polish & Leaderboards
- [ ] Add leaderboard categories
- [ ] Implement breeding notifications
- [ ] Test cross-player breeding flow
- [ ] Cosmetics for rare traits

### Week 4: Launch & Monitor
- [ ] Deploy contracts to mainnet
- [ ] Go live with breeding
- [ ] Monitor gas costs
- [ ] Iterate on UX

## Success Metrics

✅ **Breeding Volume**
  - Target: 20+ breeds per week
  - Tracks: Player engagement

✅ **Offspring Distribution**
  - Target: Even spread across traits
  - Tracks: Genetics fairness

✅ **Bloodline Formation**
  - Target: 5+ unique mega-families by month 3
  - Tracks: Long-term community building

✅ **Leaderboard Activity**
  - Target: 50+ unique players breeding
  - Tracks: System adoption

## Risk Mitigation

**Gas Costs**
- Breed transaction: ~200k gas
- Consider: Base L2 for cheap transactions

**Trait Inflation**
- Cap: Max 5 generations without reset
- Monitor: Rare trait distribution

**Breeding Spam**
- Cooldown: 7 days per donut
- Fee: 1000 $DONUTAMAGOTCHI burned

**Contract Bugs**
- Audit: Before mainnet deployment
- Testing: Extensive trait generation tests

## Future Enhancements (Post-Launch)

1. **Trait Trading**
   - Cosmetic traits as NFTs
   - Rare traits marketplace

2. **Guild Breeding**
   - Shared ownership of breeding pairs
   - Guild treasury funds breeding

3. **Trait Locking**
   - "Guaranteed" offspring traits
   - Premium breeding option

4. **Breeding Tournaments**
   - Time-limited events
   - Bonus offspring quality
   - Limited edition traits

5. **Ancestral Bonuses**
   - Donuts from legendary ancestors get boost
   - Dynasty system

---

**Phase 3 is ready to implement. All systems are architected and documented.**
