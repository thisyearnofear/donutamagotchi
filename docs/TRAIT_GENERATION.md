# Trait Generation Algorithm

## Overview
Traits are deterministically generated from a miner's blockchain address using cryptographic hashing. This ensures:
- Same traits for same address (consistency)
- Cryptographically secure randomness (fairness)
- No on-chain storage needed (efficiency)
- Verifiable through transaction history (transparency)

## Generation Process

### Input
```
Miner Address (e.g., 0x1234...5678)
```

### Step 1: Hash the Address
```typescript
const bytes = toBytes(minerAddress);
const hash = keccak256(bytes);
// Result: "0xabcd...ef12" (hex string)
```

### Step 2: Extract Numeric Pairs
Convert hex string to array of 0-255 values:
```
Hash: 0xAB CD EF 12 34 56 78 90
↓
[171, 205, 239, 18, 52, 86, 120, 144]
```

### Step 3: Generate Traits via Modulo Operations

#### Personality (4 types)
```
personality_index = hash[0] % 4
0 = "Friendly"
1 = "Energetic"  
2 = "Lazy"
3 = "Stubborn"
```

#### Coloring (6 colors)
```
color_index = hash[1] % 6
0 = "Pink"       → #F4A8C8
1 = "Blue"       → #64B4FF
2 = "Purple"     → #B464DC
3 = "Yellow"     → #FFDC64
4 = "Orange"     → #F4A460
5 = "Green"      → #82C878
```

#### Earning Potential (±5% variance)
```
earning_variance = (hash[2] % 11) - 5  // Range: -5 to +5
earning_multiplier = 1 + (variance / 100)
// Result: 0.95 to 1.05 (cosmetic only)
```

#### Social Score (0-100)
```
social_score = hash[3] % 101
// Range: 0 to 100
```

#### Development Attributes (initial state)
```
grooming = 50 + ((hash[4] % 51) - 25)      // Range: 25-75
energy = 50 + ((hash[5] % 51) - 25)        // Range: 25-75
satisfaction = 50 + ((hash[6] % 51) - 25)  // Range: 25-75
```

## Example Walkthrough

### Given Address
```
0x1234567890abcdef1234567890abcdef12345678
```

### Hashed (keccak256)
```
0x9a7c3e2f1b4d8a6c5e0f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c
```

### Extracted Values
```
9a = 154, 7c = 124, 3e = 62, 2f = 47, 1b = 27, 4d = 77, 8a = 138, 6c = 108
```

### Generated Traits
```
154 % 4 = 2           → "Lazy"
124 % 6 = 4           → "Orange" 
62 % 11 - 5 = 1       → 101% DPS (1.01x)
47 % 101 = 47         → Social Score: 47
27 % 51 - 25 = -23    → Grooming: 27
77 % 51 - 25 = 1      → Energy: 51
138 % 51 - 25 = 11    → Satisfaction: 61
```

### Result
```typescript
{
  personality: "Lazy",
  coloring: "Orange",
  earningPotential: 1.01,
  socialScore: 47,
  grooming: 27,
  energy: 51,
  satisfaction: 61
}
```

## Personality Effects on Visuals

### Animation Speed Multiplier
```typescript
const speeds = {
  "Friendly":  0.9,   // Slower, deliberate
  "Energetic": 1.4,   // Fast, zippy
  "Lazy":      0.5,   // Very slow
  "Stubborn":  1.1,   // Normal with attitude
}
```

### Eye Shape
```typescript
const eyeStyles = {
  "Friendly":  "normal",  // Standard oval eyes
  "Energetic": "normal",  // Standard, but blink faster
  "Lazy":      "small",   // Drowsy, smaller eyes
  "Stubborn":  "round",   // Wide, stubborn eyes
}
```

### Color Overlay
```typescript
const colorRGB = {
  "Pink":   {r: 244, g: 168, b: 200},
  "Blue":   {r: 100, g: 180, b: 255},
  "Purple": {r: 180, g: 100, b: 220},
  "Yellow": {r: 255, g: 220, b: 100},
  "Orange": {r: 244, g: 164, b: 96},
  "Green":  {r: 130, g: 200, b: 120},
}
```

## Trait Evolution via Interactions

### Decay Formula
```
current_stat = base_stat - (time_elapsed_minutes / 30) * decay_rate

where:
  decay_rate = { health: 0.5%, happiness: 1%, cleanliness: 2% }
```

### Interaction Bonuses
```
feed()  → +15 satisfaction
play()  → +10 energy, +5 satisfaction
pet()   → +10 grooming, +5 satisfaction
poke()  → +8 energy
```

## Properties

### Deterministic ✓
- Same address always produces same traits
- No random number generator (RNG) needed
- Reproducible offline

### Cryptographically Secure ✓
- Uses keccak256 hashing
- Infeasible to find address that produces specific traits
- No pre-image attacks viable

### Efficient ✓
- All computation client-side
- No database queries
- Single hash calculation per session
- O(1) complexity

### Fair ✓
- All traits equally likely (uniform distribution)
- No "lucky" addresses get better traits
- Cosmetic only (no P2W)

## Distribution Analysis

With 8 hash bytes and the selection methods:
- **Personality**: 4 options, each ~25% probability
- **Coloring**: 6 options, each ~16.7% probability
- **DPS**: 11 values (-5% to +5%), mostly centered around 0%
- **Social**: 101 values (0-100), uniform distribution

### Rarity Math
- Unique combinations: 4 × 6 × 11 × 101 = 26,664 possible trait sets
- Not considering secondary stats (grooming/energy/satisfaction)
- Very unlikely two players get identical traits

## Security Considerations

### What's Proven On-Chain
- Miner address (from transaction)
- Interaction timestamps
- Current stats (derived from blockchain data)

### What's Generated Off-Chain
- Trait types (personality, color)
- Development stats (grooming, energy, satisfaction)
- Cosmetic effects (colors, animations)

### Attack Vectors Mitigated
- Can't steal traits (bound to address)
- Can't randomize traits (deterministic)
- Can't fake traits (verifiable from address)
- Can't pre-generate rare traits (requires knowing miner address first)

## Future Enhancements

### Trait Mutations
```
When breeding:
  child_trait = select_random(parent_a_trait, parent_b_trait, mutation(0.3))
```

### Trait Levels
```
trait_level = floor(interaction_count / 10)
Unlocks rare animations/cosmetics at higher levels
```

### Legendary Traits
```
if trait_age_days > 90 AND all_stats > 80:
  badge = "Legendary"
  rarity_multiplier = 1.5x for cosmetics
```

## Code Reference

See `lib/traits.ts` for implementation:
- `generateTraits()` - Main generation function
- `hashToNumbers()` - Hash to numeric conversion
- `decayTraits()` - Stat decay calculation
- `updateTraitFromInteraction()` - Interaction bonus application
