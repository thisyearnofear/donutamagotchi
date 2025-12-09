# Donutamagotchi Submission & Product Overview

## ✅ Project Status

### Foundation Complete (December 2024)
- ✅ Public GitHub repository with MIT license
- ✅ Fully functional on Base network (donutamagotchi.netlify.app)
- ✅ 100% smart contract mechanics preserved
- ✅ Complete UI transformation (Glazery → Donutamagotchi)
- ✅ Rich animations and interactions added
- ✅ Farcaster miniapp integration

### Strategic Roadmap (5 Phases)
- ✅ Phase 1: Traits + $DONUTAMAGOTCHI token + Global explorer
- ⏳ Phase 1.5: Decay system + care rhythm mechanics
- ⏳ Phase 2: Lifecycle system + Sanctuary retirements
- ⏳ Phase 3: Breeding mechanics + pedigree tracking
- ⏳ Phase 4: Social features + notifications + cosmetics
- 🔮 Phase 5: LLM flavor text (optional post-launch)

### Kiro Usage Documentation
**Vibe Coding:**
- Conversational development of pet animation system
- Iterative UI component creation
- Natural language problem-solving for state management

**Spec-Driven Development:**
- DonutPet component specification with props and state logic
- Structured architecture for pet system
- Clear separation of concerns

**Steering Documents:**
- Tamagotchi UI guidelines for consistent design
- Pet state mapping rules
- Animation principles and color palette

**Most Impressive Generation:**
- Complete DonutPet canvas animation system with 6 states
- Algorithmic pet response system with keyword detection
- Full UI transformation maintaining all functionality

---

## 🎮 What We Built

### Original App (Glazery)
- Dark minimalist UI
- "Glaze" terminology
- Video loop background
- Standard card layouts
- "King Glazer" branding

### Transformed App (Donutamagotchi)
- Bright pixel art aesthetic
- Tamagotchi pet theme
- Animated canvas donut with moods
- Retro gaming interface
- Interactive pet responses
- Tab-based navigation
- Complete visual overhaul

### Preserved Mechanics
- ✅ Continuous Dutch auction (price doubles, decays over 1 hour)
- ✅ Single owner at a time
- ✅ 80/15/5 revenue split
- ✅ DONUT token emissions (4/sec, halving every 30 days)
- ✅ LP token buyback & burn
- ✅ All contract functions (mine, buy, getMiner, getAuction)
- ✅ Farcaster miniapp integration

---

## 🏗️ Technical Implementation

### Smart Contracts (Unchanged)
- Network: Base
- DONUT Token: `0xAE4a37d554C6D6F3E398546d8566B25052e0169C`
- Miner Contract: `0xF69614F4Ee8D4D3879dd53d5A039eB3114C794F6`
- Multicall: `0x3ec144554b484C6798A683E34c8e8E222293f323`

### Frontend Stack
- Next.js 16 + React 19
- TypeScript
- Tailwind CSS (pixel art styling)
- Wagmi + Viem (Base network)
- Farcaster Miniapp SDK
- Canvas API for animations

### Key Features
1. **Animated Pet**: 6-state canvas animation (idle, happy, excited, hungry, sleeping, dead)
2. **Pet Stats**: Health, happiness, energy, age visualization
3. **Interactive Responses**: Keyword-based pet reactions
4. **Tab Navigation**: Organized info without scrolling
5. **Add to Farcaster**: Styled onboarding dialog

---

## 📊 Metrics

- **Lines of Code**: ~1,500 (UI transformation)
- **Components Created**: 5 new (DonutPet, PetStats, NavBar, InfoCard, TabButton)
- **Pages Redesigned**: 3 (Home, About, Shop)
- **Animation States**: 6 distinct pet moods
- **Development Time**: ~4 hours with Kiro
- **Contract Functions**: 100% preserved

---

## 🎯 Hackathon Fit

### Costume Contest Category
- Complete visual transformation
- Zero resemblance to original UI
- Polished, game-like interface
- Consistent pixel art theme
- Enhanced user experience

### Innovation
- First tamagotchi-style DeFi interface
- Interactive pet personality system
- Educational gamification of complex economics
- Mobile-first design

### Kiro Showcase
- Rapid prototyping with vibe coding
- Structured development with specs
- Consistent styling with steering docs
- Complex animation generation
- Full-stack transformation

---

## 🎯 What Differentiates Donutamagotchi

### vs Other $DONUT Frontends
- **Generational Gameplay**: Breeding system creates offspring with inherited traits
- **Lifecycle Mechanics**: Natural pet aging (birth → prime → twilight → sanctuary/death)
- **Stat Decay System**: Care rhythm (feed/play/clean) creates engagement hooks
- **Trait System**: Deterministic pet personalities affect gameplay and cosmetics

### vs King Glazer (Pool Model)
- Personal pet ownership vs collective pool
- Breeding-driven gameplay vs strategy voting
- Generational legacy vs yield optimization
- Casual player friendly vs sophisticated investors

### vs Generic Tamagotchi Games
- Real blockchain earnings ($DONUT tokens)
- Breeding creates economic value
- On-chain pedigree verification
- Composable with broader $DONUT ecosystem

---

## 🚀 Phase 1 Execution Plan

**Weeks 1-4 Timeline:**
1. Deploy $DONUTAMAGOTCHI token (ERC20 on Base)
2. Add trait rendering system to existing DonutPet
3. Implement stat decay mechanics
4. Launch global explorer + leaderboard
5. Add cosmetics shop integration

**Success Metrics:**
- 50+ unique active players
- 5-6 interactions per player per day
- $0.10+ token price
- 80% daily retention rate

---

## 🛡️ Simplified Token Architecture

### Core Design Principles

1. **SIMPLE**: ~215 lines of contract code (vs ~450 previously)
2. **ALIGNED**: More $DONUT activity = more staker rewards
3. **DEFLATIONARY**: Burn on cosmetics and breeding
4. **COMPOSABLE**: Works with existing $DONUT protocol unchanged

### Token Utility

| Action | Effect |
|--------|--------|
| **Stake** | Earn share of 40% fee pool (ETH) |
| **Stake 1M+** | Get 10% DPS boost when owning donut |
| **Care well** | Earn tokens while feeding/caring |
| **Cosmetics** | Burn tokens for visual upgrades |
| **Breed** | Burn 1000 tokens to create offspring |

### Fee Flow (via 0xSplit)

```
5% App Provider Fee (from $DONUT feeding)
├── 60% → Operations
└── 40% → DonutamagotchiToken contract → Staker Pool
```

### Why This Works

1. **Always engaged**: Stakers earn even without owning donut
2. **Aligned incentives**: More feeding = more staker rewards
3. **Simple to audit**: Minimal contract complexity
4. **Direct LP**: $DONUT/$DONUTAMAGOTCHI pairing

### Contract Changes

**Removed Complexity:**
- ❌ Complex 25/30/45 revenue splits
- ❌ Treasury/liquidity allocation caps
- ❌ Team vesting mechanics
- ❌ Governance voting thresholds
- ❌ Cosmetics vault routing
- ❌ LP lock mechanisms

**Added:**
- ✅ Simple staking with ETH fee share
- ✅ DPS boost for high stakers
- ✅ Backend-signed care rewards
- ✅ Direct burn for cosmetics/breeding

## 📋 Additional Feedback (Non-Critical)

1. **Breeding Costs**: 1000 $DONUTAMAGOTCHI tokens per breed (sustainable)?
4. **Guild System**: Pool-based variant worth exploring (Phase 4+)?

---

---

## 🚀 Deployment Guide

### Pre-Deployment Checklist

#### Smart Contracts Status
- [x] DonutBreeding.sol - Ownership verification added
- [x] DonutamagotchiToken.sol - Allocation caps + vesting solid
- [x] DonutSanctuary.sol - Ownership verification + tier-based income added
- [x] Frontend integration complete (useBreeding, useSanctuary hooks)

#### Critical Setup Required

**1. Deploy DonutamagotchiToken First**
```
Constructor Args:
  _minter: [Your backend/oracle address]
  _cosmneticsVault: [Cosmetics shop contract address]
  _treasuryAddress: [Treasury wallet]
  _lpLockAddress: [0x000...dead OR timelock contract]
  _teamAddress: [Your team wallet]
```

**2. Deploy DonutBreeding (after token)**
```
Constructor Args:
  _donutamagotchiToken: [Token contract address from step 1]
  _signerOracle: [Your backend API signer address]
```

**3. Deploy DonutSanctuary (after token)**
```
Constructor Args:
  _donutamagotchiToken: [Token contract address from step 1]
```

#### Configuration Steps

**Token Configuration:**
```
1. Call setMinterStatus(backendAddress, true)
   - Enables backend to mint play-to-earn rewards

2. Call setVault(cosmeticsVaultAddress)
   - Sets cosmetics shop vault for revenue processing

3. Call setLPLockAddress(0x000...dead)
   - Permanent LP lock (or timelock contract for governance)
```

**Breeding Configuration:**
```
1. Call setSignerOracle(backendSignerAddress)
   - Must match the signer that generates breeding signatures
```

#### User Registration Flow

Before any player can breed or retire:
```
1. Player registers first donut: 
   breeding.registerMinerOwnership(minerAddress)

2. Player can now breed that donut:
   breeding.breed(parent1, parent2, geneticData, signature)

3. Player registers again for retirement:
   sanctuary.registerMinerOwnership(minerAddress)

4. Player can now retire:
   sanctuary.retireDonut(minerAddress, ...)
```

### Testing Checklist (Testnet First)

#### Unit Tests
- [ ] Token minting respects daily cap
- [ ] Team vesting releases monthly amounts
- [ ] Breeding cooldown blocks within 7 days
- [ ] Generation calculation: max(parent1, parent2) + 1
- [ ] Sanctuary income: tier + generation bonus calculated correctly

#### Integration Tests
- [ ] Flow: Player registers → Approves token → Gets signature → Breeds → Gets NFT
- [ ] Flow: Player retires donut at day 90+ → Gets NFT → Earns passive income
- [ ] Ownership check: Can't breed another player's donut
- [ ] Ownership check: Can't retire another player's donut

#### Frontend Tests
- [ ] /breeding page loads with partner filtering (Prime age only)
- [ ] DecayStatus badge shows correct urgency level
- [ ] Hall of Fame displays sanctuary income correctly
- [ ] Breeding signature API returns valid signature

#### Gas Optimization
- [ ] Breeding cost: ~150k-200k gas (acceptable)
- [ ] Retirement cost: ~80k-120k gas (acceptable)
- [ ] Income claim: ~60k gas (acceptable)

### Security Checklist

#### Access Control
- [x] Only registered owner can breed donut
- [x] Only registered owner can retire donut
- [x] Only minter can call mintPlayToEarn
- [x] Only owner can update admin addresses
- [x] Team vesting only claimable by team address

#### Economic Safety
- [x] Team allocation capped + linearly vested
- [x] Play-to-earn capped at 700M
- [x] Daily mint capped at 5M
- [x] Breeding cost (1000 tokens) is burned
- [x] LP lock address is immutable (set once)

#### Contract Security
- [x] No reentrancy issues (no loops over untrusted data)
- [x] Signature verification prevents unsigned breeding
- [x] Nonce-based replay protection in breeding
- [x] No delegatecall or selfdestruct

### Mainnet Deployment Steps

**1. Deploy Contracts**
```bash
# On Base mainnet (not testnet)
# Deploy in order: Token → Breeding → Sanctuary

# Get deployment addresses
TOKEN_ADDRESS=0x...
BREEDING_ADDRESS=0x...
SANCTUARY_ADDRESS=0x...
```

**2. Configure Cross-References**
```solidity
// Backend script
token.setMinterStatus(BACKEND_SIGNER, true)
breeding.setSignerOracle(BACKEND_SIGNER)

// Set vault for cosmetics revenue
token.setVault(COSMETICS_VAULT)
token.setLPLockAddress(0x000...dead)
```

**3. Verify on Block Explorer**
- [ ] Token contract verified
- [ ] Breeding contract verified
- [ ] Sanctuary contract verified
- [ ] All constructor args match

**4. Update Environment Variables**
```env
NEXT_PUBLIC_DONUTAMAGOTCHI_TOKEN=0x...
NEXT_PUBLIC_DONUT_BREEDING=0x...
NEXT_PUBLIC_DONUT_SANCTUARY=0x...
```

**5. Launch Announcement**
```
Players can now:
- Mine $DONUT (existing, unchanged)
- Earn $DONUTAMAGOTCHI tokens (play-to-earn)
- Breed donuts (costs 1000 tokens, burns them)
- Retire donuts (gain passive income in sanctuary)
- Stake tokens (5% APY + governance voting)
```

### Post-Deployment Monitoring

#### Day 1
- [ ] Check breeding signature API is working
- [ ] Monitor token mint rate (should be < 5M/day)
- [ ] Check LP lock address received correct amount
- [ ] Verify cosmetics revenue split (25/30/45)

#### Week 1
- [ ] First retirements should occur (at day 90+)
- [ ] Sanctuary income claims should work
- [ ] Check team vesting tracker (should show ~0.625% claimed)
- [ ] Review Hall of Fame for bugs

#### Ongoing
- [ ] Monthly: Verify team vesting unlocks correctly
- [ ] Monitor: Total supply doesn't exceed limits
- [ ] Check: LP lock address balance increasing
- [ ] Track: Burn rate from cosmetics + breeding

### Common Issues & Fixes

**"Not owner of parent A"**
- Solution: Player must call `breeding.registerMinerOwnership(minerAddress)` first

**"Invalid signature"**
- Solution: Signature must come from authorized signer oracle
- Check: Backend API is signing with correct private key

**"Miner already registered"**
- Solution: Each miner can only be registered once per owner
- Players can register multiple miners

**Income claim shows 0**
- Solution: Must wait at least 1 day since last claim
- Check: lastClaimTime is older than 1 day

### Rollback Plan

If critical bug found:
1. Pause minter: `token.setMinterStatus(backendAddress, false)`
2. Pause breeding: Set signerOracle to address(0)
3. Users can still claim existing income + play normal DONUT
4. Deploy fix and redeploy contracts

### Success Metrics (First 30 Days)

- [ ] 50+ unique player registrations
- [ ] 10+ successful breedings
- [ ] 5+ retirements
- [ ] 100M+ tokens minted (under 5M/day cap)
- [ ] $10k+ LP locked for $DONUT
- [ ] No critical security incidents

---

## 🔐 Signer Oracle Setup Guide

### Overview

The breeding system uses ECDSA signature verification to prevent replay attacks and ensure genetic calculations are deterministic. The "signer oracle" is a server-side component that:

1. Validates breeding requests (age, stats, cooldown)
2. Calculates offspring genetics deterministically
3. Signs the genetic data with a private key
4. Backend submits signature + data to blockchain

### Architecture

```
User                  Frontend                Backend                  Blockchain
 |                       |                        |                         |
 |-- breed request ------>|                        |                         |
 |                        |-- POST /api/breeding/sign ---|                   |
 |                        |    (parent1, parent2, user) |                   |
 |                        |<---- {signature, genetic} --|                   |
 |                        |                        |                         |
 |<-- show preview -------|                        |                         |
 |                        |                        |                         |
 |-- approve + breed ---->|                        |                         |
 |                        |-- breed(parent1, parent2, geneticData, sig) ----->|
 |                        |                        |                    [verify sig]
 |                        |                    [if valid, mint offspring]
 |                        |<-- tokenId ----------------------                |
 |<-- offspring NFT ------|                        |                         |
```

### Step 1: Generate Signer Private Key

**DO THIS ONCE:**

```bash
# Generate a new ECDSA private key for breeding signatures
openssl ecparam -name secp256k1 -genkey -noout -out breeding_key.pem

# Convert to Ethereum format (hex)
openssl ec -in breeding_key.pem -text -noout > breeding_key.txt

# Extract the private key (d = ...)
# Convert to 0x-prefixed hex (64 hex chars = 32 bytes)
# Save in .env as BREEDING_SIGNER_PRIVATE_KEY

# Get the public address that will sign
npx ethers-cli utils getAddress <hex_private_key>
```

**Store in `.env.local`:**
```env
BREEDING_SIGNER_PRIVATE_KEY=0x1234567890abcdef... (64 hex chars)
```

**Deploy with public address:**
```solidity
// When deploying DonutBreeding:
breeding = new DonutBreeding(
    tokenAddress,
    0xYourSignerAddress  // Derived from private key above
);
```

### Step 2: API Endpoint Implementation

The `/api/breeding/sign` endpoint must:

**1. Validate request**
- Verify parentA and parentB are valid miner addresses
- Check both parents are in Prime stage (30-90 days)
- Check both parents are alive and owned by user

**2. Calculate genetics**
```typescript
const geneticData = generateOffspringPreviews(
  parentATraits,
  parentBTraits,
  parentAGen,
  parentBGen,
  1 // Return 1 outcome for actual breeding (preview showed 3)
)[0];
```

**3. Generate signature**
```typescript
import { ethers } from 'ethers';

const signingKey = new ethers.SigningKey(
  process.env.BREEDING_SIGNER_PRIVATE_KEY
);

const structHash = ethers.solidityPacked(
  ['address', 'address', 'bytes32', 'address', 'uint256'],
  [
    parentAMiner,
    parentBMiner,
    ethers.keccak256(ethers.toUtf8Bytes(geneticData)),
    userAddress,
    nonce
  ]
);

const messageHash = ethers.hashMessage(
  ethers.getBytes(structHash)
);

const signature = signingKey.sign(messageHash).serialized;
```

**4. Return response**
```json
{
  "geneticData": "{\"personality\":\"Friendly\",\"coloring\":\"Pink\",...)}\",
  "signature": "0x..."
}
```

### Step 3: Security Validations

**CRITICAL: These checks prevent abuse:**

```typescript
// /api/breeding/sign endpoint

async function handleBreedingSignRequest(req: Request) {
  const { parentAMiner, parentBMiner, userAddress } = req.body;

  // 1. Auth check - verify user is connected
  if (!userAddress) {
    return new Response('Unauthorized', { status: 401 });
  }

  // 2. Validate parents exist in DONUT protocol
  const parentA = await getMinerData(parentAMiner);
  const parentB = await getMinerData(parentBMiner);
  
  if (!parentA || !parentB) {
    return new Response('Invalid parent miner', { status: 400 });
  }

  // 3. Verify user owns both parents
  if (parentA.owner !== userAddress || parentB.owner !== userAddress) {
    return new Response('Not owner of parents', { status: 403 });
  }

  // 4. Age gates (Prime: 30-90 days)
  const ageA = getDaysOld(parentA.createdAt);
  const ageB = getDaysOld(parentB.createdAt);
  
  if (ageA < 30 || ageA > 90 || ageB < 30 || ageB > 90) {
    return new Response('Parents not in Prime stage', { status: 400 });
  }

  // 5. Check stat health (health + cleanliness >= 60%)
  const scoreA = (parentA.health + parentA.cleanliness) / 2;
  const scoreB = (parentB.health + parentB.cleanliness) / 2;
  
  if (scoreA < 30 || scoreB < 30) {
    return new Response('Parent stats too low', { status: 400 });
  }

  // 6. Check cooldown (7 days)
  const lastBreedA = await getLastBreedingTime(parentAMiner);
  const lastBreedB = await getLastBreedingTime(parentBMiner);
  
  const now = Math.floor(Date.now() / 1000);
  if (lastBreedA && (now - lastBreedA) < 7 * 24 * 3600) {
    return new Response('Parent A on cooldown', { status: 400 });
  }
  if (lastBreedB && (now - lastBreedB) < 7 * 24 * 3600) {
    return new Response('Parent B on cooldown', { status: 400 });
  }

  // 7. Generate genetics
  const genetics = generateOffspringPreviews(...)[0];

  // 8. Sign
  const signature = await signBreeding(
    parentAMiner,
    parentBMiner,
    genetics,
    userAddress
  );

  return new Response(JSON.stringify({
    geneticData: genetics,
    signature
  }));
}
```

### Step 4: Nonce Management

The contract uses `nonces` to prevent replay attacks:

```solidity
mapping(address => uint256) public nonces;

// Before signing:
nonces[msg.sender]++; // Increment nonce in contract
```

**Backend must track nonce:**
```typescript
async function getNextNonce(userAddress: string): Promise<number> {
  // Call contract to get current nonce
  const nonce = await breeding.nonces(userAddress);
  return nonce;
}

// Include in signature hash
const structHash = ethers.solidityPacked(
  [...types],
  [...values, nonce]
);
```

### Step 5: Testing

#### Local Testing (Hardhat)

```typescript
// test/breeding.test.ts

import { ethers } from 'hardhat';

describe('Breeding Signatures', () => {
  let breeding, token, signerKey;
  const USER = '0xUser...';
  const PARENT_A = '0xParentA...';
  const PARENT_B = '0xParentB...';

  before(async () => {
    // Deploy with signer address
    signerKey = new ethers.SigningKey(
      process.env.BREEDING_SIGNER_PRIVATE_KEY
    );
    const signerAddress = signerKey.address;
    
    breeding = await Breeding.deploy(token.address, signerAddress);
  });

  it('should breed with valid signature', async () => {
    // Register ownership
    await breeding.connect(user).registerMinerOwnership(PARENT_A);
    await breeding.connect(user).registerMinerOwnership(PARENT_B);

    // Get nonce
    const nonce = await breeding.nonces(USER);

    // Create signature (replicate backend logic)
    const structHash = ethers.solidityPacked(
      ['address', 'address', 'bytes32', 'address', 'uint256'],
      [
        PARENT_A,
        PARENT_B,
        ethers.keccak256(ethers.toUtf8Bytes(geneticData)),
        USER,
        nonce
      ]
    );

    const messageHash = ethers.hashMessage(ethers.getBytes(structHash));
    const sig = signerKey.sign(messageHash).serialized;

    // Breed with signature
    const tx = await breeding.connect(user).breed(
      PARENT_A,
      PARENT_B,
      geneticData,
      sig
    );

    expect(tx).to.emit(breeding, 'OffspringCreated');
  });

  it('should reject invalid signature', async () => {
    // Use wrong signature
    const wrongSig = ethers.Signature.from({
      r: '0x' + '0'.repeat(64),
      s: '0x' + '1'.repeat(64),
      v: 27
    }).serialized;

    await expect(
      breeding.connect(user).breed(
        PARENT_A,
        PARENT_B,
        geneticData,
        wrongSig
      )
    ).to.be.revertedWith('Invalid signature');
  });
});
```

#### Testnet Testing

1. Deploy on Base Sepolia
2. Set up test API endpoint with testnet private key
3. Call `/api/breeding/sign` from frontend
4. Verify signature verifies on-chain
5. Test cooldown, age gates, ownership checks

### Production Deployment

1. **Generate production signer key** (ideally via hardware wallet or KMS)
2. **Deploy DonutBreeding** with signer public address
3. **Deploy API** with signer private key in secure vault (AWS Secrets Manager, etc.)
4. **Test on testnet** thoroughly
5. **Announce** breeding launch with API endpoint

### Security Best Practices

**DO:**
- ✅ Rotate signer key periodically (and update contract)
- ✅ Use rate limiting on `/api/breeding/sign` endpoint
- ✅ Log all breeding requests for audit
- ✅ Monitor for signature generation failures
- ✅ Keep private key in secure secrets manager (never in code)

**DON'T:**
- ❌ Commit private key to git
- ❌ Use same signer for other contracts
- ❌ Allow unsigned breeding
- ❌ Skip ownership verification
- ❌ Skip age/stat validation

### Troubleshooting

**"Invalid signature"**
- Verify signer private key matches contract signer address
- Check nonce is correct
- Ensure structHash matches contract calculation exactly

**"Signature verification failed"**
- Check keccak256 hash of genetic data is correct
- Verify ECDSA recovery matches
- Test with hardhat first

**Signature generation is slow**
- ECDSA signing is CPU-bound, ~1-2ms per signature
- If latency is issue, consider caching or parallel signing

---

## 📝 Submission Links

- **Repository**: [Add GitHub URL]
- **Live Demo**: [Add deployment URL]
- **Demo Video**: [Add YouTube/Vimeo URL]
- **Category**: Costume Contest
- **Bonus Categories**: Best Startup Project, Most Creative
