# Donutamagotchi Smart Contracts

This directory contains all smart contracts for the Donutamagotchi ecosystem.

## Design Principles

- **SIMPLE**: Minimal code, easy to audit
- **ALIGNED**: More $DONUT activity = more staker rewards
- **DEFLATIONARY**: Burn on cosmetics and breeding
- **COMPOSABLE**: Works with existing $DONUT protocol unchanged

---

## Contract Structure

### `/donutamagotchi`

#### DonutamagotchiToken.sol (~215 lines)

**Simplified ERC20 token with staking and fee share**

**Core Features**:
- **Staking**: Stake tokens to earn share of ETH fee pool
- **DPS Boost**: 1M+ staked = 10% DPS boost when owning donut
- **Burn**: Used for cosmetics and breeding
- **Care Rewards**: Backend-signed minting for gameplay actions

**Token Info**:
- **Total Supply**: 1 Billion tokens (fixed, no inflation)
- **Distribution**: Minted to initial holder for LP seeding + rewards reserve

**Staking Benefits**:
| Stake Amount | Benefit |
|--------------|---------|
| Any | Share of 40% fee pool (ETH) |
| 1M+ | 10% DPS boost when owning donut |

**Fee Flow (via 0xSplit)**:
```
5% App Provider Fee (from $DONUT feeding)
├── 60% → Operations
└── 40% → Staker Pool → Contract receives ETH → Stakers claim
```

**Care Rewards** (backend-signed):
```
feeding: Tokens for feeding your donut
daily_checkin: Small tokens for daily engagement
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

1. **Staking**:
   ```typescript
   // Stake tokens
   await token.stake(amount);
   
   // Claim ETH fees
   await token.claimFees();
   
   // Check DPS boost
   const hasBoost = await token.hasDPSBoost(userAddress);
   ```

2. **Care Rewards** (backend signs, frontend claims):
   ```typescript
   // Backend generates signature for care reward
   const sig = await signCareReward(user, amount, reason, nonce);
   
   // Frontend claims
   await token.mintCareReward(user, amount, reason, nonce, sig);
   ```

3. **Breeding** (Phase 2):
   ```typescript
   // Burn tokens for breeding
   await token.burnForBreeding();
   
   // Then call breeding contract
   await breeding.breed(parentA, parentB, geneticData, signature);
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

2. Configure 0xSplit:
   - Create split with 60/40 (ops/token contract)
   - Set as app provider address in $DONUT

3. Seed LP:
   - Create $DONUT/$DONUTAMAGOTCHI pool
   - Add initial liquidity

4. Reserve tokens:
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
5. **Emergency withdraw**: Only if no stakers (safety valve)

---

## Removed Complexity

The following were intentionally removed for simplicity:
- ❌ Complex allocation caps (70/20/10 splits)
- ❌ Treasury minting functions
- ❌ Team vesting (handled externally)
- ❌ Governance voting thresholds
- ❌ Cosmetics vault routing (25/30/45 splits)
- ❌ LP lock mechanisms

The new design is ~215 lines vs ~450 lines previously.
