# Donutamagotchi Smart Contracts

This directory contains all smart contracts for the Donutamagotchi ecosystem.

## Design Principles

- **ALIGNED**: More daily care = more rewards = more sticky
- **DEFLATIONARY**: Burn on cosmetics and breeding
- **ENGAGING**: Streak system rewards consistency
- **COMPOSABLE**: Works with existing $DONUT protocol unchanged

---

## Contract Structure

### `/donutamagotchi`

#### DonutamagotchiToken.sol (~320 lines)

**Enhanced ERC20 token with staking, streaks, and cosmetics**

**Core Features**:
- **Staking**: Stake tokens to earn share of ETH fee pool
- **DPS Boost**: 1M+ staked = 10% boost on CARE REWARDS
- **Care Streaks**: Daily engagement multipliers (up to 2x at 30 days)
- **Cosmetics**: On-chain ownership with burn mechanics
- **Burn**: Used for cosmetics and breeding

**Token Info**:
- **Total Supply**: 1 Billion tokens (fixed, no inflation)
- **Distribution**: Minted to initial holder for LP seeding + rewards reserve

**Staking Benefits**:
| Stake Amount | Benefit |
|--------------|---------|
| Any | Share of 40% fee pool (ETH) |
| 1M+ | 10% bonus on all care rewards |

**Care Streak System**:
| Streak Days | Multiplier |
|-------------|------------|
| 0-6 | 1x (base rate) |
| 7-13 | 1.25x |
| 14-29 | 1.5x |
| 30+ | 2x |

- Streak window: 36 hours between care actions
- Same-day actions don't increment streak
- Streak broken if gap > 36 hours

**Cosmetics**:
- On-chain ownership via `ownedCosmetics[user][cosmeticId]`
- `purchaseCosmetic(bytes32 cosmeticId)` burns tokens
- Admin sets prices via `setCosmeticPrice()`

**Care Rewards** (backend-signed):
```
feeding: 10 tokens × streak multiplier × DPS boost
petting: 2 tokens × streak multiplier × DPS boost
daily_checkin: 5 tokens × streak multiplier × DPS boost
playing: 3 tokens × streak multiplier × DPS boost
```

**Fee Flow (via 0xSplit)**:
```
5% App Provider Fee (from $DONUT feeding)
├── 60% → Operations
└── 40% → Staker Pool → Contract receives ETH → Stakers claim
```

---

#### DonutBreeding.sol (Phase 2)

**ERC721 NFT contract tracking offspring and pedigree**

- **Cost**: 1000 $DONUTAMAGOTCHI burned per breed
- **Parents**: Referenced by miner address
- **Cooldown**: 7 days between breeds
- **Generation**: max(parentGen) + 1

**Traits Inherited**:
```
- Personality: 70% inherit + 30% mutation
- Color: Genetic blending
- Generation: Tracked on-chain
```

---

#### DonutSanctuary.sol (Phase 3+)

**ERC721 NFT for retired donuts**

- **Requirement**: 90+ days old
- **Effect**: Preserved in Hall of Fame forever
- **Tiers**: Legendary, Honored, Cherished, Retired
- **Passive Income**: Tier-based daily $DONUTAMAGOTCHI distribution

---

## Integration

### With $DONUT Protocol
- **No changes** to core $DONUT contracts
- Donutamagotchi is a pure enhancement layer
- Fee routing via 0xSplit (app provider address)

### With 0xSplit
Configure the app provider address in $DONUT to point to a 0xSplit:
- 60% → Operations wallet
- 40% → DonutamagotchiToken contract (staker pool)

### Frontend Integration

1. **Unified Token Hook**:
   ```typescript
   import { useDonutamagotchiToken } from "@/hooks/useDonutamagotchiToken";
   
   const { 
     tokenStats,     // balance, staked, careStreak, etc.
     careInfo,       // streak, multiplier, lastCare
     stakingInfo,    // pending fees, DPS boost
     stake, unstake, claimFees,
   } = useDonutamagotchiToken();
   ```

2. **Care Rewards** (via API):
   ```typescript
   // Request signature from backend
   const response = await fetch("/api/care-reward", {
     method: "POST",
     body: JSON.stringify({ address, action: "feeding" }),
   });
   const { to, amount, reason, nonce, signature } = await response.json();
   
   // Claim on-chain
   await token.mintCareReward(to, amount, reason, nonce, signature);
   ```

3. **Cosmetics**:
   ```typescript
   // Purchase (burns tokens)
   await token.purchaseCosmetic(cosmeticId);
   
   // Check ownership
   const owns = await token.ownsCosmetic(user, cosmeticId);
   ```

---

## Deployment

### Phase 0: Core Token

1. Deploy `DonutamagotchiToken.sol`:
   ```
   Constructor args:
   - _careSigner: Backend signer address
   - _initialHolder: Your wallet (for LP seeding)
   ```

2. Set cosmetic prices:
   ```solidity
   token.setCosmeticPrice(keccak256("hat_crown"), 100e18);  // 100 tokens
   token.setCosmeticPrice(keccak256("aura_fire"), 250e18); // 250 tokens
   ```

3. Configure 0xSplit:
   - Create split with 60/40 (ops/token contract)
   - Set as app provider address in $DONUT

4. Seed LP:
   - Create $DONUT/$DONUTAMAGOTCHI pool
   - Add initial liquidity

5. Reserve tokens:
   - Transfer portion to contract for care rewards
   - Keep portion for future breeding/cosmetics

### Phase 2: Breeding

1. Deploy `DonutBreeding.sol`
2. Update frontend

### Phase 3+: Sanctuary

1. Deploy `DonutSanctuary.sol`
2. Add Hall of Fame UI

---

## Security

1. **No inflation**: Total supply fixed at 1B
2. **Signed minting**: Only backend can authorize care rewards
3. **Replay protection**: Signatures can only be used once
4. **Staker safety**: Tokens locked in contract, ETH distributed proportionally
5. **Rate limiting**: Backend limits care actions per hour
6. **Emergency withdraw**: Only if no stakers (safety valve)

---

## Key Contract Functions

### User Functions
| Function | Description |
|----------|-------------|
| `stake(amount)` | Stake tokens for fees + boost |
| `unstake(amount)` | Withdraw staked tokens |
| `claimFees()` | Claim pending ETH share |
| `purchaseCosmetic(id)` | Buy cosmetic (burns tokens) |
| `burnForBreeding()` | Burn 1000 tokens for breeding |

### View Functions
| Function | Description |
|----------|-------------|
| `getUserStats(user)` | All user data in one call |
| `getCareInfo(user)` | Streak and care details |
| `getStakingInfo(user)` | Staking and fee details |
| `getCareMultiplier(user)` | Current streak multiplier |
| `ownsCosmetic(user, id)` | Check cosmetic ownership |

### Admin Functions
| Function | Description |
|----------|-------------|
| `setCosmeticPrice(id, price)` | Set/update cosmetic price |
| `setCareSigner(address)` | Update reward signer |
| `emergencyWithdraw()` | Safety valve (no stakers only) |

