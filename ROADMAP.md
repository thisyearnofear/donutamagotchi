# Donutamagotchi - Kiroween Hackathon Roadmap

## Project Overview
Transform the Glazery donut mining app into a tamagotchi-style game while preserving all smart contract mechanics and economics.

**Current App**: Donut mining via continuous Dutch auction on Base
**Target**: Tamagotchi pet interface where the donut is an animated creature that responds to mining activity

**Hackathon Category**: Costume Contest (haunting UI transformation)
**Bonus Categories**: Best Startup Project, Most Creative

---

## Phase 1: Setup & Documentation (30 min)
- [x] Clone reference repos (aptogotchi, petty, AI-tamago)
- [ ] Create `.kiro` directory structure
- [ ] Add OSI-approved license (MIT)
- [ ] Document existing app mechanics in README

---

## Phase 2: Tamagotchi Core Design (1 hour)
### Pet States Based on Mining Activity
- **Idle**: No active miner (sleeping/sad donut)
- **Happy**: Actively mining, good glaze rate
- **Excited**: Just glazed successfully
- **Hungry**: Low mining time, needs new glaze
- **Dead/Ghost**: Auction price decayed to near zero

### Visual Elements
- Animated donut sprite with expressions
- Health bar = time remaining before price decay
- Happiness meter = glaze rate (DPS)
- Energy = glazed amount accumulated
- Background changes based on state

---

## Phase 3: UI Components (2 hours)
### New Components to Build
1. **DonutPet Component**
   - Canvas/SVG animated donut with face
   - State-based animations (idle, eating, happy, sleeping)
   - Particle effects for glazing action

2. **PetStats Component**
   - Health bar (auction price decay timer)
   - Happiness meter (DPS visualization)
   - Energy counter (glazed donuts)
   - Age/time as King Glazer

3. **InteractionButtons Component**
   - "Feed" button (glaze action)
   - "Pet" button (view stats)
   - "Play" button (navigate to Blazery)

### Modified Components
- Replace video loop with animated pet
- Redesign stats cards as pet attributes
- Add pixel art styling/retro game aesthetic

---

## Phase 4: Animation & Assets (1.5 hours)
### Asset Creation
- Donut sprite sheets (5 states minimum)
- Pixel art UI elements
- Sound effects (optional, toggle-able)
- Background scenes (kitchen, bakery theme)

### Animation Logic
- Smooth transitions between states
- Idle animations (breathing, blinking)
- Action animations (eating = glazing)
- Success/failure feedback animations

---

## Phase 5: Smart Contract Integration (1 hour)
### Map Contract Data to Pet Attributes
- `minerState.nextDps` → Happiness level
- `minerState.price` decay → Health/hunger
- `glazeElapsedSeconds` → Pet age
- `interpolatedGlazed` → Energy/food collected
- Transaction states → Animation triggers

### Event Handlers
- On glaze success: Happy animation + particles
- On glaze failure: Sad animation
- On price decay: Hunger warnings
- On new King Glazer: Ownership transfer animation

---

## Phase 6: Polish & UX (1 hour)
- Smooth state transitions
- Loading states with themed spinners
- Error messages in game-style notifications
- Tutorial/onboarding for first-time users
- Responsive design for mobile

---

## Phase 7: Kiro Documentation (1 hour)
### Document in `.kiro` Directory
1. **Specs**: Component specifications for pet system
2. **Hooks**: Automation workflows used
3. **Steering**: Custom instructions for UI generation
4. **Development Log**: How Kiro helped build features

### Write-up for Submission
- Vibe coding: Conversational development of pet animations
- Spec-driven: Structured component architecture
- MCP usage: Any external tools integrated
- Most impressive generation: Complex animation logic

---

## Phase 8: Deployment & Demo (1 hour)
- Deploy to Vercel/production
- Record 3-minute demo video
- Prepare submission materials:
  - GitHub repo (public, with `.kiro` dir)
  - Demo video (YouTube/Vimeo)
  - Write-up document
  - Category selection

---

## Technical Stack
- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS, pixel art aesthetic
- **Animation**: CSS animations, Canvas/SVG
- **Blockchain**: Wagmi, Viem, Base network
- **Existing**: Farcaster miniapp SDK integration

---

## Success Criteria
✅ All smart contract mechanics preserved
✅ Tamagotchi-style pet interface
✅ State-based animations and interactions
✅ Polished, game-like UX
✅ Mobile-responsive
✅ `.kiro` directory with documentation
✅ 3-minute demo video
✅ Public repo with OSI license

---

## Timeline Estimate
**Total**: ~9 hours of focused development
**Deadline**: Check hackathon submission date
**Buffer**: 2-3 hours for unexpected issues

---

## Next Steps
1. Set up `.kiro` directory structure
2. Add MIT license
3. Start Phase 2: Design pet states and mechanics
