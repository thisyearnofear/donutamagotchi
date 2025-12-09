/**
 * Physics Engine for Pet Animation
 * 
 * Single source of truth for:
 * - Spring-based easing (replaces linear math)
 * - Gravity/weight simulation
 * - Momentum/inertia
 * - Responsive gesture physics
 * 
 * All animation math flows through here to ensure consistency.
 */

export interface PhysicsState {
  position: number; // Current position (0-100, normalized)
  velocity: number; // Current velocity
  targetPosition: number; // Where we're animating to
}

/**
 * Spring physics simulation with damping
 * Creates natural, responsive motion
 * 
 * @param current Current position/value
 * @param target Target position/value
 * @param velocity Current velocity
 * @param stiffness Spring stiffness (higher = snappier), 0.1-0.5 recommended
 * @param damping Damping ratio (higher = less bouncy), 0.8-1.0 recommended
 * @param deltaTime Time since last frame in seconds
 * @returns { position, velocity } New state
 */
export function simulateSpring(
  current: number,
  target: number,
  velocity: number,
  stiffness: number = 0.2,
  damping: number = 0.85,
  deltaTime: number = 0.016, // ~60fps
): { position: number; velocity: number } {
  const displacement = target - current;
  const springForce = displacement * stiffness;
  const dampingForce = velocity * damping;
  const acceleration = springForce - dampingForce;
  
  const newVelocity = velocity + acceleration * deltaTime;
  const newPosition = current + newVelocity * deltaTime;
  
  return {
    position: newPosition,
    velocity: newVelocity,
  };
}

/**
 * Gravity simulation - adds weight to movement
 * @param velocity Current vertical velocity
 * @param gravity Gravity strength (0.1-0.5 recommended)
 * @param deltaTime Time since last frame
 * @returns New velocity
 */
export function applyGravity(
  velocity: number,
  gravity: number = 0.3,
  deltaTime: number = 0.016,
): number {
  return velocity + gravity * deltaTime;
}

/**
 * Ground collision with bounce dampening
 * @param position Current vertical position
 * @param velocity Current vertical velocity
 * @param groundLevel Where the ground is
 * @param bounceDampen How much energy is lost (0-1, lower = more bouncy)
 * @returns { position, velocity } After collision
 */
export function handleGroundCollision(
  position: number,
  velocity: number,
  groundLevel: number = 0,
  bounceDampen: number = 0.6,
): { position: number; velocity: number } {
  if (position <= groundLevel && velocity < 0) {
    return {
      position: groundLevel,
      velocity: Math.abs(velocity) * bounceDampen, // Reverse and dampen
    };
  }
  return { position, velocity };
}

/**
 * Easing function for gesture animations
 * Provides more natural motion than linear interpolation
 * @param t Progress 0-1
 * @returns Eased value 0-1
 */
export function easeOutElastic(t: number): number {
  const c5 = (2 * Math.PI) / 4.5;
  return t === 0
    ? 0
    : t === 1
      ? 1
      : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c5) + 1;
}

/**
 * Easing for bounce effect (overshoot then settle)
 */
export function easeOutBounce(t: number): number {
  const n1 = 7.5625;
  const d1 = 2.75;

  if (t < 1 / d1) {
    return n1 * t * t;
  } else if (t < 2 / d1) {
    return n1 * (t -= 1.5 / d1) * t + 0.75;
  } else if (t < 2.5 / d1) {
    return n1 * (t -= 2.25 / d1) * t + 0.9375;
  } else {
    return n1 * (t -= 2.625 / d1) * t + 0.984375;
  }
}

/**
 * Smooth step interpolation (easeInOutQuad)
 */
export function smoothstep(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

/**
 * Calculate squash/stretch for jump animations
 * @param progress 0-1 animation progress
 * @returns { scaleX, scaleY } Deformation
 */
export function calculateSquashStretch(progress: number): { scaleX: number; scaleY: number } {
  // At start and end, compress vertically
  // At peak, stretch vertically
  const peak = Math.sin(progress * Math.PI);
  const compress = 1 - peak * 0.15;
  const stretch = 1 + peak * 0.1;
  
  return {
    scaleX: compress,
    scaleY: stretch,
  };
}

/**
 * Wiggle/oscillation for happy animations
 * @param frame Current frame number
 * @param frequency How fast it wiggles
 * @param amplitude How much it moves
 * @returns Offset amount
 */
export function calculateWiggle(
  frame: number,
  frequency: number = 0.15,
  amplitude: number = 1,
): number {
  return Math.sin(frame * frequency) * amplitude;
}

/**
 * Idle breathing/bobbing motion
 * @param frame Current frame
 * @param speed Personality-adjusted speed
 * @returns Vertical offset
 */
export function calculateBreathing(frame: number, speed: number = 1): number {
  return Math.sin(frame * 0.05 * speed) * 5;
}

/**
 * Rotation from head shake or nodding
 * @param progress 0-1 animation progress
 * @param direction 1 or -1 for direction
 * @returns Rotation in radians
 */
export function calculateHeadShake(progress: number, direction: number = 1): number {
  // Ease in/out for natural motion
  const eased = progress < 0.5
    ? 2 * progress * progress
    : -1 + (4 - 2 * progress) * progress;
  return Math.sin(eased * Math.PI * 2) * 0.3 * direction;
}

/**
 * Decay velocity for natural slowdown
 * @param velocity Current velocity
 * @param friction Friction coefficient (0-1, higher = more friction)
 * @returns Decayed velocity
 */
export function applyFriction(velocity: number, friction: number = 0.95): number {
  return velocity * friction;
}

/**
 * Eye expression state based on pet emotional state
 * Used for exaggerated eye animations
 */
export interface EyeExpression {
  width: number;      // Eye width (scaled 0-1)
  height: number;     // Eye height (scaled 0-1)
  pupilOffset: number; // Pupil vertical offset (-1 to 1)
  rotation: number;   // Eye rotation in radians
  glanceOffset: number; // Horizontal eye shift for glancing (-1 to 1)
}

export interface EyebrowExpression {
  type: "curved" | "sharp" | "droopy" | "straight"; // Personality-based
  height: number;      // Vertical position offset
  angle: number;       // Rotation in radians
}

export interface EyeAppearance {
  pupilColor: string;   // Color tint for pupils
  eyeWhiteColor: string; // Optional tint for eye whites
}

/**
 * Calculate exaggerated eye expression based on emotional state
 * Wider eyes = happy/excited, droopy = sad/hungry
 * 
 * @param state Pet emotional state
 * @param frame Current frame for blinking
 * @returns Eye expression parameters
 */
export function calculateEyeExpression(state: string, frame: number): EyeExpression {
  // Frequent blinks (every 60-80 frames, faster than before)
  const blinkCycle = 70;
  const blinkPhase = Math.floor(frame / blinkCycle) % 30;
  const isBlink = blinkPhase < 3; // Blink duration: 3 frames
  
  // Occasional glances (look left/right) every 180+ frames
  const glanceCycle = Math.sin(frame * 0.004) * 0.3; // Gentle horizontal sway
  const glancePhase = Math.floor(frame / 180) % 10;
  const hasGlance = glancePhase > 2 ? glanceCycle : 0; // Random glances
  
  // Base eye dimensions (will be scaled based on state)
  let widthScale = 1;
  let heightScale = 1;
  let pupilOffset = 0;
  let rotation = 0;
  
  switch (state) {
    case "happy":
    case "excited":
    case "petting":
      // Wider, rounder eyes - happy expression
      widthScale = 1.3;
      heightScale = 1.2;
      // Gentle upward curve (smile lines)
      pupilOffset = 0.2;
      break;
    case "hungry":
    case "dead":
      // Droopy, sad eyes
      widthScale = 1.1;
      heightScale = 0.7;
      pupilOffset = -0.4; // Drooping down
      rotation = 0.15; // Slight angle down
      break;
    case "bored":
      // Half-closed, sleepy
      heightScale = 0.4;
      pupilOffset = 0.3;
      break;
    case "sleeping":
      heightScale = 0;
      break;
    default:
      // Neutral/idle
      widthScale = 1;
      heightScale = 1;
  }
  
  // Apply blink (close eyes briefly, more frequently)
  if (isBlink) heightScale *= 0.05;
  
  return {
    width: widthScale,
    height: Math.max(0.05, heightScale), // Minimum 5% height for blink
    pupilOffset,
    rotation,
    glanceOffset: hasGlance, // Horizontal eye shift for glancing
  };
}

/**
 * Calculate mouth expression shape
 * Happy arc vs sad downward curve
 */
export interface MouthExpression {
  type: "smile" | "frown" | "flat" | "surprised" | "open";
  intensity: number; // 0-1, how pronounced
}

/**
 * Calculate personality-based eyebrow expression
 * Different personality types have distinct eyebrow styles
 * @param personality Personality type
 * @param state Emotional state (affects height/angle)
 * @param frame For subtle breathing animations
 * @returns Eyebrow expression parameters
 */
export function calculateEyebrowExpression(personality: string, state: string, frame: number): EyebrowExpression {
  // Subtle breathing/bobbing of eyebrows
  const breatheAmount = Math.sin(frame * 0.03) * 0.15;
  
  // State-based height changes
  let stateHeightBoost = 0;
  let stateAngle = 0;
  
  switch (state) {
    case "happy":
    case "excited":
      stateHeightBoost = 3; // Eyebrows up when happy
      stateAngle = 0.1; // Slight upward angle
      break;
    case "hungry":
    case "dead":
      stateHeightBoost = -5; // Eyebrows down when sad
      stateAngle = -0.15; // Downward angle (concerned)
      break;
    case "bored":
      stateHeightBoost = -2;
      stateAngle = -0.05;
      break;
  }
  
  // Personality-based eyebrow shape
  let type: "curved" | "sharp" | "droopy" | "straight";
  switch (personality) {
    case "Friendly":
      type = "curved"; // Soft, welcoming
      break;
    case "Energetic":
      type = "sharp"; // Pointed, expressive
      break;
    case "Lazy":
      type = "droopy"; // Relaxed, sleepy
      break;
    case "Stubborn":
      type = "straight"; // Determined, firm
      break;
    default:
      type = "curved";
  }
  
  return {
    type,
    height: breatheAmount + stateHeightBoost,
    angle: stateAngle,
  };
}

/**
 * Get personality-based eye appearance
 * Includes pupil color tint based on personality
 * @param personality Personality type
 * @returns Eye appearance parameters
 */
export function getEyeAppearance(personality: string): EyeAppearance {
  // Subtle color tints for different personalities
  const appearances: { [key: string]: EyeAppearance } = {
    Friendly: {
      pupilColor: "#1a1a1a", // Warm black
      eyeWhiteColor: "#ffffff",
    },
    Energetic: {
      pupilColor: "#003d99", // Deep blue tint
      eyeWhiteColor: "#fffbf0", // Warm white
    },
    Lazy: {
      pupilColor: "#1a1a1a",
      eyeWhiteColor: "#fff9f0", // Sleepy warm white
    },
    Stubborn: {
      pupilColor: "#4d0000", // Deep red/brown tint
      eyeWhiteColor: "#ffffff",
    },
  };
  
  return appearances[personality] || appearances.Friendly;
}

/**
 * Calculate breathing animation for head (subtle tilt)
 * Makes idle animation more organic
 * @param frame Current frame
 * @param speed Personality-adjusted speed
 * @returns Head tilt rotation in radians
 */
export function calculateHeadBreathing(frame: number, speed: number = 1): number {
  // Gentle head bob side-to-side during breathing (not just vertical)
  return Math.sin(frame * 0.02 * speed) * 0.08; // Small rotation
}

/**
 * Calculate limb positions based on emotional state
 * Returns arm rotation and y-offset for cute posing
 */
export interface LimbExpression {
  leftArmRotation: number;   // Rotation in radians
  rightArmRotation: number;  // Rotation in radians
  armYOffset: number;        // Vertical position adjustment
}

export function calculateLimbExpression(state: string, frame: number): LimbExpression {
  // Gentle idle arm sway
  const idleSway = Math.sin(frame * 0.02) * 0.08;
  
  switch (state) {
    case "happy":
    case "petting":
      // Arms relaxed outward and up slightly
      return {
        leftArmRotation: -0.3,   // Left arm up
        rightArmRotation: 0.3,   // Right arm up
        armYOffset: -8,          // Lifted
      };
    case "excited":
      // Arms raised high with pulsing
      const pulse = Math.sin(frame * 0.08) * 0.2;
      return {
        leftArmRotation: -0.6 + pulse,
        rightArmRotation: 0.6 + pulse,
        armYOffset: -15,
      };
    case "hungry":
    case "dead":
      // Arms drooping down
      return {
        leftArmRotation: 0.4,
        rightArmRotation: -0.4,
        armYOffset: 15,
      };
    case "bored":
      // Arms loose, minimal movement
      return {
        leftArmRotation: idleSway * 0.5,
        rightArmRotation: -idleSway * 0.5,
        armYOffset: 5,
      };
    case "sleeping":
      // One arm under head
      return {
        leftArmRotation: 1.5,    // Tucked
        rightArmRotation: -1.5,
        armYOffset: 0,
      };
    default:
      // Neutral idle
      return {
        leftArmRotation: idleSway * 0.3,
        rightArmRotation: -idleSway * 0.3,
        armYOffset: 0,
      };
  }
}

/**
 * Mouth expression based on emotional state
 * @param state Pet emotional state
 * @param frame For subtle animations
 * @returns Mouth expression parameters
 */
export function calculateMouthExpression(state: string, frame: number): MouthExpression {
  // Subtle pulsing on certain states
  const pulse = Math.sin(frame * 0.05) * 0.2 + 0.8;
  
  switch (state) {
    case "happy":
    case "petting":
      return { type: "smile", intensity: 1 };
    case "excited":
      return { type: "surprised", intensity: pulse }; // Slightly varying
    case "hungry":
    case "dead":
      return { type: "frown", intensity: 1 };
    case "bored":
      return { type: "flat", intensity: 0.5 };
    case "sleeping":
      return { type: "open", intensity: 0.3 };
    default:
      return { type: "flat", intensity: 0.5 };
  }
}

/**
 * Particle system state for floating effects
 * Used for hearts, sparkles on happy/excited states
 */
export interface Particle {
  x: number;           // Relative X position
  y: number;           // Relative Y position
  vx: number;          // Velocity X
  vy: number;          // Velocity Y
  life: number;        // 0-1 (1 = fresh, 0 = dead)
  type: "heart" | "sparkle" | "star";
}

/**
 * Simulate particle physics (gravity, fade)
 * @param particle Particle to update
 * @param gravity Downward acceleration
 * @param friction Air resistance
 * @returns Updated particle
 */
export function updateParticle(
  particle: Particle,
  gravity: number = 0.15,
  friction: number = 0.98,
): Particle {
  return {
    ...particle,
    x: particle.x + particle.vx,
    y: particle.y + particle.vy + gravity,
    vy: particle.vy * friction,
    vx: particle.vx * friction,
    life: particle.life - 0.02, // Fade over time
  };
}

/**
 * Generate new particles for excited/happy bursts
 * Uses physics-based random spread
 * @param count How many particles to spawn
 * @param frame For deterministic randomness
 * @param speed Initial velocity spread
 * @returns Array of new particles
 */
export function spawnParticles(
  count: number,
  frame: number,
  speed: number = 3,
): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + (frame % 60) / 60;
    const r = speed * (0.7 + Math.random() * 0.3);
    const type: "heart" | "sparkle" | "star" = i % 3 === 0 ? "heart" : i % 3 === 1 ? "sparkle" : "star";
    
    particles.push({
      x: 0,
      y: 0,
      vx: Math.cos(angle) * r,
      vy: Math.sin(angle) * r - 1, // Upward bias
      life: 1,
      type,
    });
  }
  return particles;
}
