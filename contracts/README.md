# Donutamagotchi Smart Contracts

This directory contains all smart contracts for the Donutamagotchi ecosystem.

## Contract Structure

### `/donutamagotchi`
All new contracts specific to the $DONUTAMAGOTCHI token and ecosystem features.

#### DonutamagotchiToken.sol
**ERC20 token for the Donutamagotchi ecosystem**

- **Total Supply**: 1 Billion tokens
- **Distribution**:
  - 70% (700M) → Play-to-earn rewards
  - 20% (200M) → Treasury & cosmetics operations
  - 10% (100M) → Liquidity & staking rewards

**Key Features**:
- Minting tied to game events (oracle-based)
- Daily mint cap: 5M tokens/day (prevents hyperinflation)
- 30% of cosmetics revenue auto-burns (deflationary)
- 1000 tokens burned per breeding (demand sink)
- Staking for 5% APY + governance voting (10M+ to vote)
- No presale or whitelist (fair launch)

**Minting Reasons**:
```
- daily_login: +10 tokens
- pet_interaction: +5 tokens
- feeding_bonus: +10 tokens
- donut_explorer: +10 tokens (discovering other pets)
- breeding: +25 tokens (for offspring owners)
```

**Staking Benefits**:
- 5% annual percentage yield (APY)
- Governance voting rights (10M+ staked)
- Vote on cosmetics shop additions

---

#### DonutBreeding.sol
**ERC721 NFT contract tracking offspring and pedigree**

- **Purpose**: Create and track breeding relationships between parent donuts
- **Parents**: Referenced by miner contract address (not NFT ID) since donuts are tracked in $DONUT mining protocol
- **Cost**: 1000 $DONUTAMAGOTCHI per breed (burned)
- **Cooldown**: 7 days between breeds for same parent

**Key Features**:
- Offspring NFTs store genetic data (trait inheritance info)
- Generation tracking (offspring = max(parentGen) + 1)
- Pedigree queries (all offspring by parent/owner)
- Breeding readiness checks
- Family tree retrieval (parents + generations)

**Traits Inherited**:
```
- Personality: 70% inherit one parent's + 30% mutation
- Color: Genetic blending of both parents
- Earning Potential: Average of both (cosmetic, no P2W)
- Generation: max(parentGen) + 1
```

**Events**:
```
OffspringCreated: When breeding succeeds
BreedingCooldownApplied: When breeding cooldown starts
```

---

#### DonutSanctuary.sol
**ERC721 NFT contract for retired donuts**

- **Purpose**: Preserve retired donuts in perpetuity
- **Retirement Requirement**: Minimum 90 days old
- **Effect**: Cannot be stolen, cannot mine, generates passive income
- **Passive Income**: 0.1 $DONUTAMAGOTCHI per day forever

**Key Features**:
- Frozen stats at retirement (immutable legacy)
- Hall of Fame tiers based on achievement:
  - **LEGENDARY**: 120+ days AND 2000+ $DONUT earned
  - **HONORED**: 90+ days AND 1000+ $DONUT earned
  - **CHERISHED**: 90+ days (baseline)
  - **RETIRED**: Generic retirement
- Memorial text (epitaph) for each donut
- Lifetime earnings tracked (DONUT + WETH)
- Offspring count preserved (legacy lives on)

**Inheritance**:
- Retired donuts' genetics can be inherited via breeding offspring
- Breeding with a retired parent's offspring maintains bloodline
- Creates "legacy" gameplay (dead donuts live through descendants)

---

## Integration Notes

### With $DONUT Protocol
- **No changes to core $DONUT contracts** - full backward compatibility
- Donutamagotchi operates as enhancement layer (builder code model)
- Treasury collects cosmetics revenue to support $DONUT-WETH liquidity pool
- Breeding mechanics independent from mining mechanics

### Frontend Integration
1. **Token Minting**: Backend oracle calls `mintPlayToEarn()` with game events
2. **Breeding Flow**:
   - User approves 1000 $DONUTAMAGOTCHI for DonutBreeding
   - Frontend calls `breed(parentA, parentB, geneticData)`
   - NFT minted to offspring owner
3. **Retirement Flow**:
   - User calls `retireDonut()` with final stats
   - NFT minted to Sanctuary
   - Donut no longer mineable
4. **Staking**: User calls `stake()` with tokens → earns 5% APY

---

## Deployment Checklist

### Pre-Deployment
- [ ] Audit contracts (especially token minting caps)
- [ ] Test on Base testnet
- [ ] Verify minter address (backend oracle)
- [ ] Verify cosmetics vault address
- [ ] Verify treasury address

### Deployment Order
1. **DonutamagotchiToken** - Deploy first (others depend on it)
2. **DonutBreeding** - Needs token address
3. **DonutSanctuary** - Independent, can deploy anytime
4. Update contract addresses in frontend (`lib/contracts.ts`)

### Post-Deployment
- [ ] Add liquidity to DEX (Uniswap V3 on Base)
- [ ] Configure minter in token contract
- [ ] Test breeding flow end-to-end
- [ ] Launch staking pool
- [ ] Enable cosmetics shop

---

## Security Considerations

1. **Token Minting**: Gated behind minter role (backend oracle only)
2. **Daily Cap**: Prevents runaway inflation
3. **Breeding Cost**: Burned immediately (no rug risk)
4. **Retirement**: Immutable once set (preserves trust)
5. **Staking**: Tokens locked in contract (cannot be withdrawn without claiming rewards)

---

## Future Enhancements

- **Guild System**: Collective donut ownership with shared cosmetics treasury
- **Cross-Chain**: Bridge $DONUTAMAGOTCHI to other chains (Optimism, Arbitrum)
- **Cosmetics NFTs**: Ultra-rare trait combinations minted as NFTs
- **Marketplace**: Secondary trading of breeding offspring NFTs
