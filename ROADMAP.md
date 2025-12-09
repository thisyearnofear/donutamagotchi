# Donutamagotchi Roadmap

## Vision

**Donutamagotchi** reimagines the $DONUT mining protocol as a true tamagotchi experience—where donuts have lifecycles, develop unique traits, and create lasting legacies. We enhance engagement and accessibility for casual players while maintaining full compatibility with and contribution to the core $DONUT economics infrastructure.

### Core Philosophy

We are **not** replacing or competing with the protocol—we are **enhancing it**. Every feature is designed to:
- Deepen player attachment to their donuts
- Increase daily engagement with the protocol
- Drive more frequent feeding (mining) interactions
- Create natural onboarding for non-technical players
- Keep players engaged even when they don't own the donut

---

## The Two-Token Model

### $DONUT (Existing Protocol - Unchanged)
- Earned by feeding (mining) the donut
- 80/15/5 fee split on each feed
- 4 DONUT/sec emissions (halving every 30 days)
- Single owner at a time (Dutch auction)

### $DONUTAMAGOTCHI (Our Enhancement Layer)
- **Earned** by caring well for your donut
- **Staked** to earn share of app fees + DPS boost
- **Burned** for cosmetics and breeding
- **Paired** with $DONUT in LP (direct value link)

---

## How We Enhance the $DONUT Ecosystem

### Fee Share Model (via 0xSplits)

The 5% app provider fee from each $DONUT feed is routed to a 0xSplit:

```
5% App Provider Fee
├── 60% → Operations (development, hosting, etc.)
└── 40% → $DONUTAMAGOTCHI Staker Pool
```

**This creates:**
- Passive income for $DONUTAMAGOTCHI stakers
- Alignment with $DONUT ecosystem (more feeds = more rewards)
- Reason to stay engaged even without owning a donut

### Token Utility (Simple & Clear)

| Action | Effect |
|--------|--------|
| **Stake** | Earn share of 40% fee pool (ETH) |
| **Stake 1M+** | Get 10% DPS boost when owning donut |
| **Care well** | Earn tokens while feeding/caring |
| **Cosmetics** | Burn tokens for visual upgrades |
| **Breed** | Burn 1000 tokens to create offspring |

### Deflationary Mechanics

1. **Cosmetics** - Tokens burned directly on purchase
2. **Breeding** - 1000 tokens burned per breed
3. **No inflation** - Fixed supply, no complex minting schedules

### Liquidity

- Primary LP: **$DONUT / $DONUTAMAGOTCHI**
- This directly ties the two tokens together
- Success of one drives demand for the other

---

## Development Phases

### Phase 0: Core Token (CURRENT)

**Goal:** Launch simplified $DONUTAMAGOTCHI with fee share staking

- [ ] Deploy simplified `DonutamagotchiToken.sol` (~150 lines)
- [ ] Configure 0xSplit for app provider fee
- [ ] Seed $DONUT/$DONUTAMAGOTCHI LP
- [ ] Frontend: Staking UI + fee claim
- [ ] Backend: Sign care rewards on feeding

### Phase 1: Foundation (COMPLETED)

**Goal:** Add personality and progression to the existing donut

- [x] Traits System: Personality types, coloring, social scores
- [x] Global Donut Explorer: View all active miners
- [x] Decay-Based Needs: Health, happiness, cleanliness decay
- [x] Lifecycle Stages: Birth → Growth → Prime → Twilight

### Phase 2: Breeding (NEXT)

**Goal:** Enable players to create next generation, build bloodlines

- [ ] Deploy `DonutBreeding.sol`
- [ ] Trait inheritance with mutation chance
- [ ] Offspring gallery and family trees

### Phase 3: Farcaster Mini App (ACTIVE)

**Goal:** Mobile-friendly Farcaster integration for social engagement

- [x] Farcaster Mini App Integration
- [x] Push Notifications: Care reminders
- [ ] Social Features: Pet visiting, leaderboards

### Phase 4: Cosmetics & Sanctuary (FUTURE)

**Goal:** Additional engagement and retirement options

- [ ] Simple cosmetics shop (burn to buy)
- [ ] Sanctuary for retired donuts
- [ ] Hall of Fame

---

## Engagement Model

### When You OWN the Donut

```
Feed → Earn $DONUT + $DONUTAMAGOTCHI
Play/Pet → Earn small $DONUTAMAGOTCHI
Stake → Get 10% DPS boost (if 1M+ staked)
```

### When You DON'T Own the Donut

```
Stake → Earn ETH from fee pool
Daily check-in → Small $DONUTAMAGOTCHI rewards (future)
Watch price → Re-claim when affordable
```

This solves the core engagement problem: **users have a reason to stay even when outbid**.

---

## Contract Architecture (Simplified)

```
Core Contracts:
├── DonutamagotchiToken.sol   # ERC20 + Staking + Fee Share (~150 lines)
├── DonutBreeding.sol         # Breeding mechanics (Phase 2)
└── DonutSanctuary.sol        # Retirement mechanics (Phase 4)

External:
├── 0xSplit                   # App fee distribution
└── Uniswap V3                # $DONUT/$DONUTAMAGOTCHI LP
```

### Removed Complexity

The following overcomplicated features have been removed:
- ❌ Complex 25/30/45 revenue splits
- ❌ Treasury/liquidity allocation caps
- ❌ Team vesting contracts
- ❌ Multi-tier governance thresholds
- ❌ Cosmetics vault routing

---

### Success Metrics

- Daily active users engaging with pets
- Fee pool distributions to stakers
- $DONUT/$DONUTAMAGOTCHI LP growth
- Community breeding and lineage building