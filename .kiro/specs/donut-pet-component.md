# DonutPet Component Specification

## Purpose
Main animated tamagotchi character that responds to mining state and user actions.

## Props
```typescript
interface DonutPetProps {
  state: 'idle' | 'happy' | 'excited' | 'hungry' | 'sleeping' | 'dead';
  happiness: number; // 0-100
  health: number; // 0-100
  isAnimating: boolean;
  onInteraction?: () => void;
}
```

## State Calculation
```typescript
// From minerState
const happiness = (Number(minerState.nextDps) / MAX_DPS) * 100;
const health = (Number(minerState.price) / (Number(minerState.initPrice) * 2)) * 100;

// Determine pet state
if (health < 10) state = 'dead';
else if (health < 30) state = 'hungry';
else if (isWriting || isConfirming) state = 'excited';
else if (happiness > 70) state = 'happy';
else if (glazeElapsedSeconds < 60) state = 'excited';
else state = 'idle';
```

## Animation States
- **idle**: Gentle breathing, occasional blink
- **happy**: Bouncing, sparkles
- **excited**: Rapid movement, eating animation
- **hungry**: Slow movement, sad expression
- **sleeping**: Closed eyes, Z's floating
- **dead**: Ghost sprite, floating

## Rendering
- Canvas-based for smooth 60fps animations
- Sprite sheets for different states
- Particle system for effects
- Responsive sizing (scales with viewport)

## Interactions
- Click/tap triggers idle animation
- Responds to transaction states
- Shows feedback for user actions
