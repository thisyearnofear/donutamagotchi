/**
 * Engagement System - Single Source of Truth
 * 
 * Consolidates all engagement mechanics into one module:
 * - Feeding status calculation (health, consequences)
 * - Reward multiplier logic
 * - Cosmetic interaction boosters
 * 
 * Core principle: Feed is CRITICAL (once per 24h)
 * Play/Pet are OPTIONAL (cosmetic only, no penalties)
 */

// ============ Types ============

export type FeedingStatus = "healthy" | "sad" | "neglected" | "dead";

export interface EngagementState {
  /** Hours since last feeding */
  hoursSinceFed: number;
  /** Days since last feeding (0, 1, 2, 3+) */
  daysSinceFed: number;
  /** Current feeding status */
  status: FeedingStatus;
  /** DPS multiplier based on feeding neglect */
  dpsMultiplier: number;
  /** Reward multiplier for next feed */
  feedRewardMultiplier: number;
  /** Whether donut can breed */
  canBreed: boolean;
  /** Whether donut must be retired */
  mustRetire: boolean;
  /** Human-readable status message */
  statusMessage: string;
  /** Visual emoji indicator */
  statusEmoji: string;
}

// ============ Configuration ============

const FEEDING_CONSTANTS = {
  // Time thresholds
  HOURS_PER_DAY: 24,
  AUTO_RETIRE_DAYS: 3,
  BREEDING_LOCK_DAYS: 2,
  
  // DPS penalties
  DPS_HEALTHY: 1.0,      // Day 0: Normal
  DPS_SAD: 0.8,          // Day 1: -20% DPS
  DPS_NEGLECTED: 0.6,    // Day 2: -40% DPS
  DPS_DEAD: 0.0,         // Day 3+: Can't earn
  
  // Feed reward multipliers (catch-up bonus)
  REWARD_ON_TIME: 1.0,         // Fed in last 24h
  REWARD_CATCH_UP: 1.5,        // Fed 24-48h ago
  REWARD_URGENT: 2.0,          // Fed 48h+ ago (last chance)
} as const;

// ============ Core Calculation ============

/**
 * Calculate feeding status and engagement state
 * 
 * @param lastFedTime - Timestamp of last feeding (milliseconds)
 * @returns EngagementState with all relevant metrics
 */
export function calculateEngagementState(
  lastFedTime: number,
  currentTime: number = Date.now()
): EngagementState {
  const millisecondsSinceFed = currentTime - lastFedTime;
  const hoursSinceFed = millisecondsSinceFed / (1000 * 60 * 60);
  const daysSinceFed = Math.floor(hoursSinceFed / FEEDING_CONSTANTS.HOURS_PER_DAY);
  
  // Determine status and multipliers
  let status: FeedingStatus;
  let dpsMultiplier: number;
  let feedRewardMultiplier: number;
  let canBreed: boolean;
  let mustRetire: boolean;
  let statusMessage: string;
  let statusEmoji: string;
  
  if (daysSinceFed === 0) {
    // Day 0: Healthy (fed today)
    status = "healthy";
    dpsMultiplier = FEEDING_CONSTANTS.DPS_HEALTHY;
    feedRewardMultiplier = FEEDING_CONSTANTS.REWARD_ON_TIME;
    canBreed = true;
    mustRetire = false;
    statusMessage = "✅ Healthy and happy";
    statusEmoji = "😊";
  } else if (daysSinceFed === 1) {
    // Day 1: Sad (missed one day)
    status = "sad";
    dpsMultiplier = FEEDING_CONSTANTS.DPS_SAD;
    feedRewardMultiplier = FEEDING_CONSTANTS.REWARD_CATCH_UP;
    canBreed = true;
    mustRetire = false;
    statusMessage = "😢 Hungry... feed soon";
    statusEmoji = "😟";
  } else if (daysSinceFed === 2) {
    // Day 2: Neglected (missed two days)
    status = "neglected";
    dpsMultiplier = FEEDING_CONSTANTS.DPS_NEGLECTED;
    feedRewardMultiplier = FEEDING_CONSTANTS.REWARD_URGENT;
    canBreed = false; // Can't breed when neglected
    mustRetire = false;
    statusMessage = "🔴 Critical! Auto-retire in 24h";
    statusEmoji = "😵";
  } else {
    // Day 3+: Dead (auto-retired)
    status = "dead";
    dpsMultiplier = FEEDING_CONSTANTS.DPS_DEAD;
    feedRewardMultiplier = 0;
    canBreed = false;
    mustRetire = true;
    statusMessage = "💀 Resting in sanctuary (retired)";
    statusEmoji = "💀";
  }
  
  return {
    hoursSinceFed: Math.round(hoursSinceFed * 10) / 10, // Round to 1 decimal
    daysSinceFed,
    status,
    dpsMultiplier,
    feedRewardMultiplier,
    canBreed,
    mustRetire,
    statusMessage,
    statusEmoji,
  };
}

// ============ Cosmetic Interactions (Optional Boosters) ============

/**
 * Apply play boost to traits (cosmetic, optional)
 * No penalties if skipped, just visual enhancement
 */
export function applyPlayBoost(traits: {
  energy: number;
  satisfaction: number;
}): typeof traits {
  return {
    energy: Math.min(100, traits.energy + 10),
    satisfaction: Math.min(100, traits.satisfaction + 5),
  };
}

/**
 * Apply pet boost to traits (cosmetic, optional)
 * No penalties if skipped, just visual enhancement
 */
export function applyPetBoost(traits: {
  grooming: number;
  satisfaction: number;
}): typeof traits {
  return {
    grooming: Math.min(100, traits.grooming + 10),
    satisfaction: Math.min(100, traits.satisfaction + 5),
  };
}

/**
 * Apply cosmetic stat decay (visual only, no consequences)
 * These stats don't gate any features, just for visual appeal
 */
export function applyCosmeticDecay(
  traits: {
    grooming: number;
    energy: number;
    satisfaction: number;
  },
  hoursSinceFed: number
): typeof traits {
  // Slow decay: -5% per day
  const decayMultiplier = Math.max(0, 1 - (hoursSinceFed / 24) * 0.05);
  
  return {
    grooming: Math.max(0, Math.min(100, traits.grooming * decayMultiplier)),
    energy: Math.max(0, Math.min(100, traits.energy * decayMultiplier)),
    satisfaction: Math.max(0, Math.min(100, traits.satisfaction * decayMultiplier)),
  };
}

// ============ Feed Effect ============

/**
 * Apply feeding effect to traits
 * This is the ONLY interaction that has real consequences
 */
export function applyFeedEffect(traits: {
  satisfaction: number;
}): typeof traits {
  return {
    satisfaction: Math.min(100, traits.satisfaction + 15),
  };
}

// ============ Helper Functions ============

/**
 * Get human-readable time until next auto-retire
 */
export function getTimeUntilRetire(daysSinceFed: number): string {
  const daysLeft = Math.max(0, FEEDING_CONSTANTS.AUTO_RETIRE_DAYS - daysSinceFed);
  
  if (daysLeft === 0) return "NOW!";
  if (daysLeft === 1) return "24 hours";
  return `${daysLeft} days`;
}

/**
 * Check if donut should show critical warning
 */
export function isCritical(status: FeedingStatus): boolean {
  return status === "neglected" || status === "dead";
}

/**
 * Check if donut should show warning
 */
export function isWarning(status: FeedingStatus): boolean {
  return status === "sad" || status === "neglected" || status === "dead";
}

/**
 * Get animation state based on feeding status
 */
export function getAnimationState(status: FeedingStatus): "normal" | "sad" | "distressed" | "dead" {
  switch (status) {
    case "healthy":
      return "normal";
    case "sad":
      return "sad";
    case "neglected":
      return "distressed";
    case "dead":
      return "dead";
  }
}
