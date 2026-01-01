import { Address, toBytes, keccak256 } from "viem";

export type PersonalityType = "Friendly" | "Energetic" | "Lazy" | "Stubborn";
export type ColorType = "Pink" | "Blue" | "Purple" | "Yellow" | "Orange" | "Green";

export type LifecycleStage = "birth" | "growth" | "prime" | "twilight" | "dead";

export interface Traits {
  personality: PersonalityType;
  coloring: ColorType;
  earningPotential: number; // ±5% variance as a multiplier (0.95-1.05)
  socialScore: number; // 0-100
  grooming: number; // 0-100
  energy: number; // 0-100
  satisfaction: number; // 0-100
  generation?: number; // Gen 1 = original, Gen 2+ = offspring (default 1 for backward compat)
}

/**
 * Extract numeric values from a hex hash string
 */
function hashToNumbers(hash: string): number[] {
  const cleanHash = hash.replace("0x", "");
  const numbers: number[] = [];
  for (let i = 0; i < 8; i++) {
    const hexPair = cleanHash.substring(i * 2, i * 2 + 2);
    numbers.push(parseInt(hexPair, 16));
  }
  return numbers;
}

/**
 * Generate deterministic traits from a miner address
 * Uses hash of address to ensure same traits always returned for same address
 */
export function generateTraits(minerAddress: Address): Traits {
  // Create a hash of the address for deterministic randomness
  const bytes = toBytes(minerAddress);
  const hash = keccak256(bytes);

  // Extract numeric values from hash
  const hashNumbers = hashToNumbers(hash);

  // Personality (0-3)
  const personalityIndex = hashNumbers[0] % 4;
  const personalities: PersonalityType[] = ["Friendly", "Energetic", "Lazy", "Stubborn"];
  const personality = personalities[personalityIndex];

  // Coloring (0-5)
  const colorIndex = hashNumbers[1] % 6;
  const colors: ColorType[] = ["Pink", "Blue", "Purple", "Yellow", "Orange", "Green"];
  const coloring = colors[colorIndex];

  // Earning Potential (±5%, so 0.95-1.05)
  const earningPercentage = ((hashNumbers[2] % 11) - 5) / 100; // -5 to +5 percent
  const earningPotential = 1 + earningPercentage;

  // Social Score (0-100)
  const socialScore = hashNumbers[3] % 101;

  // Initial trait development scores (start moderate)
  const grooming = 50 + ((hashNumbers[4] % 51) - 25); // 25-75
  const energy = 50 + ((hashNumbers[5] % 51) - 25); // 25-75
  const satisfaction = 50 + ((hashNumbers[6] % 51) - 25); // 25-75

  return {
    personality,
    coloring,
    earningPotential,
    socialScore: Math.round(socialScore),
    grooming: Math.max(0, Math.min(100, grooming)),
    energy: Math.max(0, Math.min(100, energy)),
    satisfaction: Math.max(0, Math.min(100, satisfaction)),
    generation: 1, // Original miners are Gen 1
  };
}

/**
 * Get RGB color value for trait coloring
 */
export function getColorRGB(colorType: ColorType): { r: number; g: number; b: number } {
  const colors = {
    Pink: { r: 244, g: 168, b: 200 },
    Blue: { r: 100, g: 180, b: 255 },
    Purple: { r: 180, g: 100, b: 220 },
    Yellow: { r: 255, g: 220, b: 100 },
    Orange: { r: 244, g: 164, b: 96 },
    Green: { r: 130, g: 200, b: 120 },
  };
  return colors[colorType];
}

/**
 * Get hex color string for trait coloring
 */
export function getColorHex(colorType: ColorType): string {
  const rgb = getColorRGB(colorType);
  return `#${Math.round(rgb.r).toString(16).padStart(2, "0")}${Math.round(rgb.g).toString(16).padStart(2, "0")}${Math.round(rgb.b).toString(16).padStart(2, "0")}`;
}

/**
 * Get personality-based trait modifiers
 */
export function getPersonalityTraits(personality: PersonalityType) {
  const traits = {
    Friendly: {
      animationSpeed: 0.9, // Slightly slower, more deliberate
      expressiveness: 1.2, // More animated
      baseHappiness: 0.1, // Starts happier
      color: "#FFB6C1",
    },
    Energetic: {
      animationSpeed: 1.4, // Faster animations
      expressiveness: 1.5, // Very expressive
      baseHappiness: 0,
      color: "#FFD700",
    },
    Lazy: {
      animationSpeed: 0.5, // Much slower
      expressiveness: 0.6, // Less expressive
      baseHappiness: -0.1, // Starts less happy
      color: "#D2B48C",
    },
    Stubborn: {
      animationSpeed: 1.1,
      expressiveness: 0.8, // Less expressive
      baseHappiness: -0.05,
      color: "#8B4513",
    },
  };
  return traits[personality];
}

/**
 * @deprecated Use calculateEngagementState() from lib/engagement.ts instead
 * 
 * Apply cosmetic decay to traits (visual only, no consequences)
 * Old system removed - keeping this stub for backwards compatibility only
 */
export function decayTraits(
  traits: Traits,
  _lastInteractionTime: number,
  lastFedTime: number,
  currentTime: number = Date.now(),
): Traits {
  // Import new engagement system for cosmetic decay
  const { applyCosmeticDecay } = require("./engagement");
  
  const millisecondsSinceFed = currentTime - lastFedTime;
  const hoursSinceFed = millisecondsSinceFed / (1000 * 60 * 60);
  
  return applyCosmeticDecay(traits, hoursSinceFed);
}

/**
 * Apply feed effect to traits
 * FEED is the ONLY interaction that resets the engagement counter
 * Play/Pet are optional cosmetic boosters (use applyPlayBoost/applyPetBoost instead)
 */
export function updateTraitFromFeed(traits: Traits): Traits {
  return {
    ...traits,
    satisfaction: Math.min(100, traits.satisfaction + 15),
  };
}

/**
 * Apply play boost to traits (cosmetic, optional)
 * No tracking required - just visual enhancement
 */
export function applyPlayBoost(traits: Traits): Traits {
  return {
    ...traits,
    energy: Math.min(100, traits.energy + 10),
    satisfaction: Math.min(100, traits.satisfaction + 5),
  };
}

/**
 * Apply pet boost to traits (cosmetic, optional)
 * No tracking required - just visual enhancement
 */
export function applyPetBoost(traits: Traits): Traits {
  return {
    ...traits,
    grooming: Math.min(100, traits.grooming + 10),
    satisfaction: Math.min(100, traits.satisfaction + 5),
  };
}

/**
 * @deprecated Use updateTraitFromFeed, applyPlayBoost, or applyPetBoost instead
 */
export function updateTraitFromInteraction(
  traits: Traits,
  interactionType: "feed" | "play" | "pet" | "poke",
): Traits {
  switch (interactionType) {
    case "feed":
      return updateTraitFromFeed(traits);
    case "play":
      return applyPlayBoost(traits);
    case "pet":
      return applyPetBoost(traits);
    case "poke":
      // Poke is no longer supported - use play instead
      return applyPlayBoost(traits);
  }
}

/**
 * Get breeding success rate based on parent traits
 * Success rate = (health + cleanliness) / 2
 */
export function getBreedingSuccessRate(parent1Traits: Traits, parent2Traits: Traits): number {
  const avgHealth = parent1Traits.satisfaction; // satisfaction represents health
  const avgCleanliness = (parent1Traits.grooming + parent2Traits.grooming) / 2;
  return (avgHealth + avgCleanliness) / 2;
}

/**
 * Get breeding viability status for a single donut
 */
export interface BreedingViability {
  canBreed: boolean;
  successRate: number; // 0-100
  status: "excellent" | "good" | "normal" | "poor" | "impossible";
  message: string;
}

export function getBreedingViability(traits: Traits, lastFedTime?: number): BreedingViability {
  const { calculateEngagementState } = require("./engagement");
  
  // Check engagement status first - can't breed if neglected
  if (lastFedTime !== undefined) {
    const engagement = calculateEngagementState(lastFedTime);
    if (!engagement.canBreed) {
      return {
        canBreed: false,
        successRate: 0,
        status: "impossible",
        message: `❌ Too neglected to breed. Feed your donut! (${engagement.statusMessage})`,
      };
    }
  }
  
  // Breed success based on trait health (satisfaction + grooming)
  const healthCleanliness = (traits.satisfaction + traits.grooming) / 2;
  const successRate = healthCleanliness;

  if (successRate >= 70) {
    return {
      canBreed: true,
      successRate,
      status: "excellent",
      message: "✨ Perfect breeding conditions! Healthy offspring likely.",
    };
  } else if (successRate >= 50) {
    return {
      canBreed: true,
      successRate,
      status: "good",
      message: "Good breeding conditions. Standard offspring expected.",
    };
  } else if (successRate >= 30) {
    return {
      canBreed: true,
      successRate,
      status: "normal",
      message: "Acceptable conditions, but consider improving stats first.",
    };
  } else if (successRate > 0) {
    return {
      canBreed: true,
      successRate,
      status: "poor",
      message: "⚠️ Poor conditions. Likely to produce sickly offspring.",
    };
  } else {
    return {
      canBreed: false,
      successRate: 0,
      status: "impossible",
      message: "❌ Too weak to breed. Feed and care for your donut!",
    };
  }
}

/**
 * @deprecated Use calculateEngagementState() from lib/engagement.ts instead
 * This function is no longer used - engagement now tracks only lastFedTime
 */
export interface CareRoutine {
  feedDueIn: string;
  playDueIn: string;
  petDueIn: string;
  urgent: boolean;
}

export function getCareRoutine(
  _lastInteractionTime: number,
  lastFedTime: number,
  currentTime: number = Date.now(),
): CareRoutine {
  const { calculateEngagementState, getTimeUntilRetire } = require("./engagement");
  
  const engagement = calculateEngagementState(lastFedTime, currentTime);
  const timeUntilRetire = getTimeUntilRetire(engagement.daysSinceFed);
  
  // Legacy format - only feed matters now
  return {
    feedDueIn: timeUntilRetire,
    playDueIn: "Optional",
    petDueIn: "Optional",
    urgent: engagement.daysSinceFed >= 2,
  };
}

/**
 * Calculate pet age in days from creation timestamp
 */
export function getAgeInDays(createdAtSeconds: number, currentTime: number = Date.now()): number {
  const createdAtMs = createdAtSeconds * 1000;
  const ageMs = currentTime - createdAtMs;
  return Math.floor(ageMs / (1000 * 60 * 60 * 24));
}

/**
 * Get lifecycle stage based on age
 * Birth: 0-1 days
 * Growth: 1-30 days
 * Prime: 30-90 days
 * Twilight: 90+ days
 */
export function getLifecycleStage(ageInDays: number): LifecycleStage {
  if (ageInDays < 1) return "birth";
  if (ageInDays < 30) return "growth";
  if (ageInDays < 90) return "prime";
  return "twilight";
}

/**
 * Get DPS multiplier based on lifecycle stage
 * Birth donuts earn less to prevent early domination
 */
export function getDPSMultiplier(stage: LifecycleStage, ageInDays: number): number {
  switch (stage) {
    case "birth":
      // 0-1 days: 50% DPS (0.05 DONUT/sec instead of normal rate)
      return 0.5;
    case "growth":
      // 1-30 days: Gradually scale from 50% to 100%
      // growth_progress = (ageInDays - 1) / 29
      const growthDays = Math.min(ageInDays - 1, 29);
      return 0.5 + (growthDays / 29) * 0.5;
    case "prime":
      // 30-90 days: Full earning rate
      return 1;
    case "twilight":
      // 90+ days: Still earning but decaying
      return 1;
    default:
      return 1;
  }
}

/**
 * Get lifecycle info for display
 */
export interface LifecycleInfo {
  stage: LifecycleStage;
  ageInDays: number;
  dpsMultiplier: number;
  canBreed: boolean;
  description: string;
  emoji: string;
}

export function getLifecycleInfo(
  createdAtSeconds: number,
  currentTime: number = Date.now(),
): LifecycleInfo {
  const ageInDays = getAgeInDays(createdAtSeconds, currentTime);
  const stage = getLifecycleStage(ageInDays);
  const dpsMultiplier = getDPSMultiplier(stage, ageInDays);

  const stageInfo = {
    birth: {
      description: "Just hatched! Weak but learning.",
      emoji: "🥚",
      canBreed: false,
    },
    growth: {
      description: `Growing strong... ${Math.floor(((ageInDays - 1) / 29) * 100)}% mature`,
      emoji: "🌱",
      canBreed: false,
    },
    prime: {
      description: "At peak power! Ready to breed.",
      emoji: "⭐",
      canBreed: true,
    },
    twilight: {
      description: "Aging gracefully. Time to plan legacy.",
      emoji: "🌙",
      canBreed: false,
    },
    dead: {
      description: "Resting in legend.",
      emoji: "💀",
      canBreed: false,
    },
  };

  const info = stageInfo[stage];

  return {
    stage,
    ageInDays,
    dpsMultiplier,
    canBreed: info.canBreed,
    description: info.description,
    emoji: info.emoji,
  };
}
