# Quick Start: Traits System

## What Players See

When you connect your wallet and have a donut:

1. **Your donut displays unique traits:**
   - **Personality**: Friendly, Energetic, Lazy, or Stubborn
   - **Color**: Pink, Blue, Purple, Yellow, Orange, or Green
   - **DPS Variance**: Shows ±5% earning modifier
   - **Social Score**: Numerical score (0-100)

2. **Personality affects how your donut behaves:**
   - **Energetic** donuts move faster and are highly expressive
   - **Friendly** donuts are slower and warmer in color
   - **Lazy** donuts barely animate and look sleepy
   - **Stubborn** donuts have distinctive round eyes

3. **Interact with your donut to develop traits:**
   - 🤚 **Pet** → Increases grooming (shiny appearance)
   - 🎪 **Play** → Increases energy (more bouncy)
   - 👆 **Poke** → Boosts energy temporarily
   - 🍩 **Feed** → Increases satisfaction (happy expression)

## For Developers

### Display Traits in Your Component

```typescript
import { useTraits } from "@/hooks/useTraits";

export function MyDonutComponent({ minerAddress }) {
  const { traits } = useTraits({
    minerAddress,
    lastInteractionTime: Date.now(),
    lastFedTime: Date.now(),
  });

  return (
    <>
      <DonutPet traits={traits} />
      <TraitsDisplay traits={traits} />
    </>
  );
}
```

### Access Individual Traits

```typescript
if (traits) {
  console.log(traits.personality);    // "Energetic" | "Friendly" | "Lazy" | "Stubborn"
  console.log(traits.coloring);       // "Pink" | "Blue" | "Purple" | "Yellow" | "Orange" | "Green"
  console.log(traits.earningPotential); // 0.95 to 1.05
  console.log(traits.socialScore);    // 0 to 100
  console.log(traits.grooming);       // 0 to 100 (development)
  console.log(traits.energy);         // 0 to 100 (development)
  console.log(traits.satisfaction);   // 0 to 100 (development)
}
```

### Update Traits After Interaction

```typescript
import { updateTraitFromInteraction } from "@/lib/traits";

// After user feeds donut
const updatedTraits = updateTraitFromInteraction(currentTraits, "feed");
// After user pets donut
const updatedTraits = updateTraitFromInteraction(currentTraits, "pet");
// After user plays
const updatedTraits = updateTraitFromInteraction(currentTraits, "play");
// After user pokes
const updatedTraits = updateTraitFromInteraction(currentTraits, "poke");
```

### Check Breeding Eligibility

```typescript
import { getBreedingSuccessRate } from "@/lib/traits";

const breedingChance = getBreedingSuccessRate(parent1Traits, parent2Traits);
console.log(`Breeding success rate: ${(breedingChance * 100).toFixed(1)}%`);

// Success rate = (health + cleanliness) / 2
// < 30%: High chance of sickly offspring
// 30-70%: Normal offspring  
// > 70%: Healthy offspring with bonus traits
```

## Understanding Stat Decay

### The Decay System
Stats naturally decrease over time to encourage daily engagement:

- **Health** (-0.5% per 30 min): Decreases unless fed recently
- **Happiness** (-1% per 30 min): Decreases unless played recently
- **Cleanliness** (-2% per 30 min): Decreases unless petted recently

### Ideal Daily Routine (Casual Player)
```
Feed every 4 hours     → Prevents health critical (< 5%)
Play every 6 hours     → Prevents happiness critical (< 30%)
Pet every 2 hours      → Prevents cleanliness critical (< 30%)

= 5-6 interactions/day for peak condition
```

### Reading the Stats
- **90-100%**: Perfect condition ✨
- **60-89%**: Good condition 😊
- **30-59%**: Needs attention 😐
- **10-29%**: Critical! 😟
- **< 10%**: Donut will die if not fed 💀

## Visual Indicators

### By Personality Type

| Personality | Speed | Color Tone | Eyes | Expression |
|---|---|---|---|---|
| Friendly | Slow | Warm pink | Normal | Heart particles |
| Energetic | Fast | Bright | Normal | Bouncy |
| Lazy | Very slow | Dull | Small | Bored "Z"s |
| Stubborn | Normal | Brown | Round | Resistant |

### By Coloring

Each color has a unique RGB palette:
- **Pink**: #F4A8C8 - Warm and friendly
- **Blue**: #64B4FF - Cool and calm
- **Purple**: #B464DC - Mysterious
- **Yellow**: #FFDC64 - Sunny
- **Orange**: #F4A460 - Warm and earthy
- **Green**: #82C878 - Natural

### Development Effects

As traits develop:
- Higher **grooming** → More saturated color
- Higher **energy** → Faster animation speed
- Higher **satisfaction** → Happy expression, heart particles

## FAQ

### Can I change my donut's traits?
Personality and coloring are fixed (based on address). But you can develop grooming, energy, and satisfaction through play!

### Are traits permanent?
Base traits (personality, color) are permanent. Development stats (grooming/energy/satisfaction) decay over time and need maintenance.

### Can I trade traits with other players?
No, traits are bound to the miner address. But you can breed to create new donuts with inherited traits!

### Do traits affect earning rates?
The ±5% DPS variance is **cosmetic only** - all donuts earn the same in practice.

### What's the rarest combination?
Rarity is equal across all traits. But unique **development levels** are rare - maintaining high grooming/energy/satisfaction is the real achievement!

## Next Features Coming

- **Trait mutations** during breeding (Phase 3)
- **Cosmetic cosmetics** that overlay on traits (Phase 4)
- **Achievement badges** for maintaining perfect stats
- **Legendary status** for donuts with 90+ days uptime and all stats > 80
- **Trait history** - track evolution over time

## Support

For issues or questions about traits:
1. Check `lib/traits.ts` for implementation details
2. See `docs/TRAIT_GENERATION.md` for algorithm explanation
3. Review `TRAITS_IMPLEMENTATION.md` for architecture overview
