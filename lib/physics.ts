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
