# Animation & Interaction Improvements

## New Pet States
- **bored**: Triggered when no interaction for 5+ minutes AND happiness < 60%
  - Paler color, half-closed eyes, flat mouth
  - Floating "Z" indicators
- **petting**: Triggered by player interactions
  - Shows happy face with particles

## New Gestures
All gestures are player-triggered and automatically complete:
- **bounce**: Vertical up/down motion (triggered on FEED)
- **wiggle**: Side-to-side wobble (GREEN button, pet action)
- **jump**: Large upward arc (DOUBLE-CLICK pet, YELLOW button)
- **spin**: Full 360° rotation (BLUE button, play action)
- **nod**: Head tilt rhythm (CLICK pet, single pet action)

## Player Interaction Methods

### Direct Pet Interaction
- **Single Click**: Pet nods (petting interaction)
- **Double Click**: Pet jumps (poking/play)

### Action Buttons (3-button row above feed button)
- 🎪 **Play** (BLUE): Spin gesture
- 🤚 **Pet** (GREEN): Wiggle gesture  
- 👆 **Poke** (YELLOW): Jump gesture

### Feed Button
- 🍩 **FEED**: Bounce gesture + state update

## Animation System

### State-Based Rendering
All drawing now uses canvas `ctx.save()`/`ctx.restore()` for clean transforms:
- Translation (position offset)
- Rotation (for gestures)
- Scale (reserved for future features)

### Enhanced Visual Effects
- **Particles**: Now 12 count (was 8), with colorful gradient
- **Boredom Indicators**: Animated floating Z's
- **Breathing**: Smooth sine-wave y-offset (when idle)

## Interaction Tracking
- `lastInteractionTime`: Records timestamp of any player action
- Prevents boredom state while engaged
- Resets on: button clicks, pet clicks, feeding, any gesture

## Code Improvements (Per Core Principles)

### ENHANCEMENT FIRST ✓
- Enhanced existing `DonutPet` component with gesture prop
- Added new parameters to existing components instead of creating new ones
- Consolidated all drawing logic into single component

### AGGRESSIVE CONSOLIDATION ✓
- Gesture animation logic centralized in one switch statement
- Drawing functions (frosting, face, particles, boredom) kept modular but compact
- Removed redundant breathing effect when gesture active

### DRY ✓
- Single gesture callback handler reused for all buttons
- Pet response function updated once to handle all states
- Canvas transform ops apply to all drawing calls uniformly

### MODULAR ✓
- `PetGesture` type exported for reuse
- `onGestureComplete` callback for gesture lifecycle
- Drawing helpers remain pure functions

### ORGANIZED ✓
- State types clearly defined at top
- Drawing functions follow object (face, frosting, particles, boredom)
- Event handlers grouped by interaction type

## Performance Considerations
- Canvas animations use `requestAnimationFrame` (no scheduling overhead)
- Gesture frame counter resets after completion
- No memory leaks: proper cleanup in useEffect return
