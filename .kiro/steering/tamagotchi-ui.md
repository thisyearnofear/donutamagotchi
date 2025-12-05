# Tamagotchi UI Development Guidelines

## Design Philosophy
- Pixel art aesthetic with retro gaming feel
- Smooth animations and state transitions
- Mobile-first responsive design
- Preserve all smart contract functionality

## Pet State Mapping
- `minerState.nextDps` → Happiness level (0-100%)
- `minerState.price` decay → Health/Hunger (100% at 2x, 0% at 0)
- `glazeElapsedSeconds` → Pet age display
- `interpolatedGlazed` → Energy/food collected
- Transaction pending → Eating animation
- Transaction success → Happy animation
- Transaction failure → Sad animation

## Animation Principles
- 60fps smooth transitions
- Idle animations every 3-5 seconds
- State changes trigger 1-2 second animations
- Particle effects for successful actions
- No jarring transitions

## Color Palette
- Primary: Pink (#ec4899) - existing brand color
- Background: Dark (#000000, #18181b)
- Accent: Warm pastels for pet states
- Health bar: Green → Yellow → Red gradient

## Component Structure
- DonutPet: Main animated character
- PetStats: Health, happiness, energy bars
- ActionButtons: Feed (glaze), Pet, Play
- StatusMessages: Game-style notifications
