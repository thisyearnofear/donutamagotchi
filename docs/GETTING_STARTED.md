# Getting Started with Donutamagotchi

## Overview

**Donutamagotchi** is a Farcaster mini-app that transforms $DONUT mining into an interactive tamagotchi experience. Each donut has unique traits, personality, and lifecycle stages. Care for your donut, breed offspring, and build lasting legacies.

## Quick Start

### For Players

1. **Open in Farcaster** → Launch the mini-app
2. **Connect Wallet** → Farcaster mini-app connector
3. **Meet Your Donut** → Unique traits based on your address
   - **Personality**: Friendly, Energetic, Lazy, or Stubborn
   - **Color**: Pink, Blue, Purple, Yellow, Orange, Green
   - **Stats**: Health, happiness, cleanliness (decay over time)
4. **Feed Once Per Day** (critical):
   - 🍩 Feed (once per 24h) → Keeps donut healthy, prevents auto-retirement

### For Developers

```bash
npm install
cp .env.example .env.local
# Set: CONTRACT_ADDRESS, BREEDING_CONTRACT, SANCTUARY_CONTRACT, SUBGRAPH_URL, NEYNAR_API_KEY
npm run dev
```

## Core Systems

### 1. Traits System

**Deterministic generation** from wallet address:

```typescript
import { useTraits } from "@/hooks/useTraits";

const { traits } = useTraits({ minerAddress, lastInteractionTime, lastFedTime });
// traits.personality, traits.coloring, traits.health, traits.happiness, traits.cleanliness
```

**Personality Effects**:
- **Energetic**: 1.4x speed, bouncy | **Friendly**: 0.9x speed, warm
- **Lazy**: 0.5x speed, sleepy eyes | **Stubborn**: 1.0x speed, round eyes

### 2. Lifecycle Stages

| Stage | Age | DPS | Status |
|-------|-----|-----|--------|
| Birth | 0-7d | 90% | Learning |
| Growth | 8-30d | 95% | Developing |
| Prime | 31-90d | 100% | Peak |
| Twilight | 90+d | 80% | Retire eligible |

### 3. Engagement System

**One-Daily-Minimum Model**:
- **Feed is CRITICAL**: Once per 24 hours to stay healthy
- **Play/Pet are OPTIONAL**: Cosmetic boosters, no penalties for skipping
- **Real consequences**: Miss 3 days = auto-retire to sanctuary

Status progression:
- Day 0 (< 24h): ✅ Healthy, 1.0x DPS, can breed
- Day 1 (24-48h): 😢 Sad, 0.8x DPS, 1.5x feed reward multiplier
- Day 2 (48-72h): 😵 Neglected, 0.6x DPS, 2.0x feed reward, can't breed
- Day 3+ (72h+): 💀 Dead, auto-retired to sanctuary

### 4. Breeding System

```typescript
import { useBreeding } from "@/hooks/useBreeding";
const { canBreed, cooldownRemaining, initiateBreed } = useBreeding(minerAddress);
```

**Inheritance**:
- Personality: 70% parent, 30% mutate
- Color: Blend with mutation chance
- Generation: max(parents) + 1
- Success rate: (health + cleanliness) / 2

### 5. Sanctuary & Retirement

Donuts 90+ days retire for passive income:
- **Bronze**: 10 DONUT/day | **Silver**: 25/day | **Gold**: 50/day | **Legendary**: 100/day

## Application Pages

| Route | Purpose |
|-------|---------|
| `/` | Main donut view, interactions |
| `/donuts` | Gallery of all donuts (explorer) |
| `/breeding` | Breed two parents, preview offspring |
| `/shop` | Buy cosmetics with tokens |
| `/hall-of-fame` | Retired donuts, leaderboards |
| `/transparency` | On-chain revenue breakdown |
| `/about` | Project info |

## Smart Contracts

### DonutamagotchiToken.sol
- ERC20 + staking + fee distribution
- Revenue split: 25% LP lock, 30% burn, 45% treasury
- Team vesting: 7.5% over 12 months

### DonutBreeding.sol
- 24h cooldown between breeds
- Generation tracking
- Genetics data storage

### DonutSanctuary.sol
- Retirement at 90+ days
- Tier-based passive income

## Project Structure

```
app/                    # Next.js pages (/, /breeding, /donuts, etc.)
├── api/               # API routes (breeding/sign, care-reward, subgraph)
components/            # React components (donut-pet, traits-display, etc.)
hooks/                 # Custom hooks (useTraits, useBreeding, etc.)
lib/                   # Core logic (traits.ts, genetics.ts, physics.ts)
contracts/             # Solidity contracts
public/.well-known/    # Farcaster manifest
```

## Key Hooks & Functions

**Hooks**:
- `useTraits()` → Generate/manage traits
- `useBreeding()` → Breeding logic
- `useAccountData()` → Fetch on-chain data
- `useSanctuary()` → Retirement status
- `useNotifications()` → Push notifications

**Core Functions** (`lib/traits.ts`):
- `generateTraits(address)` → Deterministic traits
- `decayTraits(traits, times)` → Apply decay
- `updateTraitFromInteraction(traits, type)` → Update after action
- `getBreedingSuccessRate(parent1, parent2)` → Calculate compatibility

**Genetics** (`lib/genetics.ts`):
- `inheritTraits(p1, p2, gen1, gen2)` → Calculate offspring
- `blendColors(c1, c2)` → Color mixing
- `calculateRarity(traits)` → Rarity tier

**Physics** (`lib/physics.ts`):
- `simulateSpring()` → Spring physics
- `calculateEyeExpression()` → Eye animations
- `calculateBreathing()` → Idle animation

## Development Workflow

### Adding Features

1. **New Trait**: `lib/types.ts` → `lib/traits.ts` → `components/donut-pet.tsx`
2. **New Interaction**: `lib/traits.ts` → `components/interaction-panel.tsx`
3. **New Animation**: `lib/physics.ts` → `components/donut-pet.tsx`

### Testing

```bash
npm run lint           # Linting
npm run build          # Production build
# Mobile: Deploy → Update .well-known/farcaster.json → Test in Warpcast
```

## API Routes

- `/api/neynar/user` → Farcaster user data
- `/api/subgraph/account` → On-chain donut data
- `/api/breeding/sign` → Breeding signatures
- `/api/care-reward` → Reward claims

## Common Issues

| Issue | Solution |
|-------|----------|
| Traits not showing | Check wallet connection, verify subgraph accessible |
| Breeding fails | Check 24h cooldown, health >30%, token allowance |
| Animation lag | Reduce particle count, check personality speed |

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Blockchain**: Wagmi 2.x, Viem 2.x, Base network
- **Data**: The Graph (subgraph), GraphQL
- **Notifications**: Neynar SDK (Farcaster)
- **Animation**: Canvas API, requestAnimationFrame

## Environment Variables

```bash
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...              # Token contract
NEXT_PUBLIC_BREEDING_CONTRACT_ADDRESS=0x...     # Breeding contract
NEXT_PUBLIC_SANCTUARY_CONTRACT_ADDRESS=0x...    # Sanctuary contract
NEXT_PUBLIC_SUBGRAPH_URL=https://...            # The Graph endpoint
NEYNAR_API_KEY=...                              # Farcaster notifications
```

## Resources

- **Detailed Features**: See `FEATURES.md`
- **Architecture**: See `ARCHITECTURE.md`
- **Contracts**: `contracts/donutamagotchi/`
- **Types**: `lib/types.ts`

## Quick Reference

**Interaction Effects**:
- Feed → +15 health, +5 satisfaction
- Play → +10 energy, +5 satisfaction
- Pet → +10 grooming, +5 satisfaction
- Poke → +8 energy

**Breeding Requirements**:
- Both parents health >30%
- 24h cooldown expired
- 1000 DONUTAMAGOTCHI burned

**Retirement Requirements**:
- Age ≥90 days
- Not currently owned (optional)

**Animation Frame Rate**: 60 FPS target via `requestAnimationFrame`
