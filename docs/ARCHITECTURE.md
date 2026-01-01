# Technical Architecture

Donutamagotchi is a Next.js 16 app with on-chain smart contracts, Subgraph indexing, and Canvas-based animations.

## Tech Stack

| Component | Technology |
|-----------|-----------|
| **Frontend** | Next.js 16, React 19, TypeScript 5, Tailwind CSS |
| **Styling** | Tailwind CSS 3.4, Radix UI primitives |
| **Blockchain** | Wagmi 2.x, Viem 2.x, Base network |
| **State** | React Query (server state), React hooks (local state) |
| **Data Layer** | The Graph (subgraph), GraphQL |
| **Notifications** | Neynar SDK (Farcaster) |
| **Animation** | Canvas API, requestAnimationFrame |
| **Contracts** | Solidity 0.8.x, ERC20 |

## Project Structure

```
app/                          # Next.js pages & API routes
├── page.tsx, breeding/, donuts/, shop/, hall-of-fame/, transparency/, about/
├── api/breeding/sign/        # Breeding signatures
├── api/care-reward/          # Reward claims
├── api/neynar/user/          # Farcaster data
└── api/subgraph/account/     # Query proxy

components/                   # React components
├── donut-pet.tsx            # Canvas animation engine
├── traits-display.tsx       # Trait visualization
├── interaction-panel.tsx    # Feed/play/pet/poke buttons
├── breeding-*.tsx           # Breeding UI suite
├── nav-bar.tsx              # Navigation
└── ui/                      # Radix UI primitives

hooks/                        # Custom React hooks
├── useTraits.ts             # Trait generation & decay
├── useBreeding.ts, useAccountData.ts, useSanctuary.ts
├── useContractData.ts       # Generic contract queries
└── useNotifications.ts      # Farcaster push notifications

lib/                          # Core business logic
├── traits.ts                # Trait algorithms & decay
├── genetics.ts              # Breeding inheritance
├── physics.ts               # Animation physics & easing
├── earnings.ts, contracts.ts, subgraph.ts, feedback.ts
└── types.ts                 # TypeScript definitions

contracts/donutamagotchi/
├── DonutamagotchiToken.sol  # ERC20 + staking + vesting
├── DonutBreeding.sol        # Breeding logic, cooldown
└── DonutSanctuary.sol       # Retirement system

docs/                         # 3 focused documentation files
├── GETTING_STARTED.md       # Setup, quick start
├── FEATURES.md              # Feature reference
└── ARCHITECTURE.md          # This file
```

## Data Flow

### Trait Display Flow
```
User connects wallet (Wagmi)
  ↓
useAccountData fetches on-chain data (subgraph)
  ↓
useTraits generates base traits (deterministic, keccak256)
  ↓
Apply decay based on interaction timestamps
  ↓
DonutPet renders canvas with traits
  ↓
TraitsDisplay shows stats table
```

### Interaction Flow
```
User clicks "Feed" button
  ↓
Transaction via Wagmi
  ↓
Smart contract updates lastFedTime
  ↓
Subgraph indexes event (~15 sec delay)
  ↓
React Query invalidates cached data
  ↓
useTraits hook recalculates with new time
  ↓
Canvas re-renders with updated state
```

### Breeding Flow
```
User selects two parents
  ↓
Calculate compatibility score
  ↓
Preview 3 possible offspring
  ↓
User clicks "Breed" button
  ↓
API route generates signature (validation)
  ↓
Contract executes initiateBreed()
  ↓
Genetics data encoded on-chain (string)
  ↓
Offspring ID returned
  ↓
Subgraph indexes new offspring
  ↓
UI shows offspring in gallery
```

## State Management

**Global State** (Minimal):
- Wallet connection: Wagmi `useAccount()`
- Theme/settings: React Context

**Component State**:
- Canvas animation frame
- UI form inputs
- Modal open/close
- Filter selections

**Server State** (React Query):
- Contract data (balances, cooldowns)
- Subgraph data (accounts, offspring)
- API responses

**Derived State** (Computed):
- Traits from address + interaction times
- Lifecycle stage from age
- Breeding success rate from parent traits

## Smart Contract Architecture

### DonutamagotchiToken.sol
- ERC20 with staking & fee distribution
- Team vesting (7.5% over 12 months)
- Revenue processing: 25% LP / 30% burn / 45% treasury
- Care reward claiming

**Key State**:
```solidity
mapping(address => uint256) stakedBalance;
mapping(address => uint256) lastClaimTime;
uint256 totalStaked;
uint256 feePool;  // Accumulated ETH
address lpLockAddress;
address treasuryAddress;
```

### DonutBreeding.sol
- 24-hour cooldown
- Generation tracking
- Genetics data storage (encoded as string)
- Offspring registry

**Key State**:
```solidity
mapping(address => uint256) lastBreedTime;
mapping(address => uint256) offspringCount;
mapping(uint256 => OffspringData) offspring;
uint256 constant BREEDING_COST = 1000e18;
```

### DonutSanctuary.sol
- Retirement eligibility (90+ days)
- Tier-based passive income
- Lifetime earnings tracking

**Tiers**:
- Bronze: 10 DONUT/day
- Silver: 25 DONUT/day
- Gold: 50 DONUT/day
- Legendary: 100 DONUT/day

## Core Algorithms

### Trait Generation (`lib/traits.ts`)

```typescript
// Pure deterministic from address
const hash = keccak256(toBytes(minerAddress));
const bytes = toBytes(hash);
const personalityIndex = bytes[0] % 4;  // 4 personalities
const colorIndex = bytes[1] % 6;        // 6 colors
const earningPotential = 0.95 + (bytes[2] % 11) * 0.01;  // ±5%
const socialScore = bytes[3] % 101;     // 0-100
```

### Trait Decay

```typescript
// Linear decay over time
healthDecay = initialHealth - (timeSinceLastFed / 30min) * 0.5%;
// Halts if interaction within threshold
if (now - lastFed < 5min) healthDecay = initialHealth;
```

### Genetics (`lib/genetics.ts`)

```typescript
// Trait inheritance
personality = Math.random() < 0.7 
  ? pickParentPersonality()    // 70% inherit
  : randomPersonality();        // 30% mutate

coloring = blendColors(parent1.color, parent2.color) + mutation;
generation = Math.max(parent1Gen, parent2Gen) + 1;
```

### Physics (`lib/physics.ts`)

```typescript
// Spring simulation
newVelocity = velocity * damping + (target - position) * stiffness;
newPosition = position + newVelocity;

// Gravity
velocity += gravity;

// Ground collision
if (position > ground) {
  velocity = -velocity * restitution;
  position = ground;
}
```

## API Routes

### `/api/breeding/sign` (POST)
Input: `{ parent1Miner, parent2Miner }`
Output: `{ signature, timestamp }`

### `/api/care-reward` (POST)
Input: `{ minerAddress, amount }`
Output: `{ signature, nonce }`

### `/api/neynar/user` (GET)
Query: `?fid=12345`
Output: `{ user: { fid, username, pfp } }`

### `/api/subgraph/account` (POST)
Input: `{ query, variables }`
Output: GraphQL response

## Performance Optimization

- **Code splitting**: Dynamic imports for pages
- **Memoization**: useMemo for trait calculations
- **Caching**: React Query (30s stale time)
- **Lazy loading**: Below-fold components
- **Canvas**: Single element, RAF-based timing
- **Contract calls**: Batched via Multicall, 30s cache

## Environment Variables

```bash
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_BREEDING_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_SANCTUARY_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_SUBGRAPH_URL=https://...
NEYNAR_API_KEY=...
```

## Deployment

**Frontend** (Vercel):
```bash
npm run build
vercel --prod
```

**Contracts** (Base):
```bash
forge create --rpc-url $BASE_RPC_URL --private-key $PRIVATE_KEY contracts/DonutamagotchiToken.sol:DonutamagotchiToken
```

**Subgraph** (The Graph):
```bash
graph deploy --product hosted-service username/donutamagotchi
```

## Security

- ✅ Input validation on all forms
- ✅ Signature verification for API routes
- ✅ Rate limiting on contract calls
- ✅ Safe arithmetic (BigInt)
- ✅ XSS protection (React escaping)
- ✅ Reentrancy guards (contracts)
- ✅ Access control (onlyOwner)
- ✅ Overflow protection (Solidity 0.8+)

## Testing Strategy

- **Unit**: Trait generation, decay, genetics
- **Integration**: Wagmi hooks, subgraph queries, API routes
- **E2E**: Connect → feed → breed → retire flows
- **Mobile**: Farcaster WebView compatibility

## Monitoring

**Logging**: Development only, Sentry for production
**Events**: On-chain event emission for transparency
**Analytics**: Track user actions, breeding rates, engagement

## Key Files by Responsibility

| Responsibility | Location |
|---|---|
| Trait system | `lib/traits.ts`, `hooks/useTraits.ts` |
| Animations | `lib/physics.ts`, `components/donut-pet.tsx` |
| Breeding | `lib/genetics.ts`, `DonutBreeding.sol` |
| Blockchain | `lib/contracts.ts`, `lib/wagmi.ts` |
| Data fetching | `lib/subgraph.ts`, `hooks/useAccountData.ts` |
| Notifications | `hooks/useNotifications.ts` |
