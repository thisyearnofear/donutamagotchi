/**
 * Genetics System for Donutamagotchi Breeding
 * 
 * Pure functions for trait inheritance, color blending, and rarity calculation.
 * All functions are deterministic and testable without external dependencies.
 */

import { Traits, PersonalityType, ColorType, getColorHex, getColorRGB } from "./traits";

// ============ Types ============

export interface RarityTier {
  name: "common" | "uncommon" | "rare" | "legendary";
  score: number; // 0-100
  label: string;
  color: string; // Tailwind class
}

export interface OffspringTraits extends Traits {
  generation: number;
  parentAPersonality: PersonalityType;
  parentBPersonality: PersonalityType;
  parentAColor: ColorType;
  parentBColor: ColorType;
}

export interface GeneticsData {
  traits: OffspringTraits;
  rarity: RarityTier;
  inheritanceNotes: string[];
}

// ============ Color System (HSL-based blending) ============

/**
 * Convert RGB to HSL for color blending
 */
function rgbToHsl(rgb: { r: number; g: number; b: number }): { h: number; s: number; l: number } {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  if (max === min) {
    return { h: 0, s: 0, l };
  }

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

  let h = 0;
  switch (max) {
    case r:
      h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
      break;
    case g:
      h = ((b - r) / d + 2) / 6;
      break;
    case b:
      h = ((r - g) / d + 4) / 6;
      break;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

/**
 * Convert HSL to RGB
 */
function hslToRgb(hsl: { h: number; s: number; l: number }): { r: number; g: number; b: number } {
  const h = hsl.h / 360;
  const s = hsl.s / 100;
  const l = hsl.l / 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

/**
 * Find closest standard color to blended HSL
 */
function findClosestColor(targetHsl: { h: number; s: number; l: number }): ColorType {
  const colors: ColorType[] = ["Pink", "Blue", "Purple", "Yellow", "Orange", "Green"];
  
  let closest: ColorType = "Pink";
  let minDistance = Infinity;

  for (const color of colors) {
    const rgb = getColorRGB(color);
    const hsl = rgbToHsl(rgb);
    
    // Calculate distance in HSL space (hue is circular, so special handling)
    const hueDiff = Math.min(Math.abs(hsl.h - targetHsl.h), 360 - Math.abs(hsl.h - targetHsl.h));
    const satDiff = Math.abs(hsl.s - targetHsl.s);
    const lightDiff = Math.abs(hsl.l - targetHsl.l);
    
    const distance = (hueDiff / 360) ** 2 + (satDiff / 100) ** 2 + (lightDiff / 100) ** 2;
    
    if (distance < minDistance) {
      minDistance = distance;
      closest = color;
    }
  }

  return closest;
}

/**
 * Blend two colors together using HSL space
 * Result snaps to closest standard color to maintain diversity
 */
export function blendColors(color1: ColorType, color2: ColorType): ColorType {
  const rgb1 = getColorRGB(color1);
  const rgb2 = getColorRGB(color2);
  
  const hsl1 = rgbToHsl(rgb1);
  const hsl2 = rgbToHsl(rgb2);

  // Average in HSL space (handle hue circularity)
  const avgHue = (hsl1.h + hsl2.h) / 2;
  const avgSat = (hsl1.s + hsl2.s) / 2;
  const avgLight = (hsl1.l + hsl2.l) / 2;

  const blendedHsl = { h: avgHue, s: avgSat, l: avgLight };
  return findClosestColor(blendedHsl);
}

// ============ Personality Inheritance ============

/**
 * Mutate personality to a random different one (10% chance during inheritance)
 */
function mutatePersonality(): PersonalityType {
  const personalities: PersonalityType[] = ["Friendly", "Energetic", "Lazy", "Stubborn"];
  const randomIndex = Math.floor(Math.random() * personalities.length);
  return personalities[randomIndex];
}

/**
 * Inherit personality from parents with mutation chance
 * 70% chance: inherit from either parent
 * 20% chance: hybrid of both (whichever is "more dominant")
 * 10% chance: random mutation to new type
 */
function inheritPersonality(parent1: PersonalityType, parent2: PersonalityType): [PersonalityType, string] {
  const roll = Math.random();

  if (roll < 0.7) {
    // Inherit from one parent
    const chosen = Math.random() < 0.5 ? parent1 : parent2;
    return [chosen, `Inherited ${chosen} from parent`];
  } else if (roll < 0.9) {
    // Hybrid - pick one but note both parents influenced it
    const hybrid = Math.random() < 0.5 ? parent1 : parent2;
    return [hybrid, `Hybrid of ${parent1} & ${parent2}`];
  } else {
    // Rare mutation
    const mutated = mutatePersonality();
    return [mutated, `Rare mutation! Got ${mutated}`];
  }
}

// ============ Trait Inheritance ============

/**
 * Inherit earning potential from parents with ±1% variance
 */
function inheritEarningPotential(parent1: number, parent2: number): number {
  const avgPotential = (parent1 + parent2) / 2;
  const variance = (Math.random() - 0.5) * 0.02; // ±1%
  const final = avgPotential + variance;
  return Math.max(0.95, Math.min(1.05, final)); // Clamp to ±5%
}

/**
 * Inherit social score as average of parents
 */
function inheritSocialScore(parent1: number, parent2: number): number {
  const avgScore = (parent1 + parent2) / 2;
  const noise = (Math.random() - 0.5) * 10; // ±5 points
  return Math.max(0, Math.min(100, Math.round(avgScore + noise)));
}

/**
 * Reset trait development scores for offspring (babies start learning fresh)
 * But influenced by parent genetics - higher parent scores = better starting point
 */
function inheritDevelopmentTraits(
  parent1Grooming: number,
  parent2Grooming: number,
  parent1Energy: number,
  parent2Energy: number,
  parent1Satisfaction: number,
  parent2Satisfaction: number,
): { grooming: number; energy: number; satisfaction: number } {
  // Babies start at 50% but influenced by parent averages
  const baseScore = 50;
  const parentBonus = 5; // Up to ±5% influence from parents
  
  const grooming = baseScore + ((parent1Grooming + parent2Grooming) / 2 - 50) * (parentBonus / 50);
  const energy = baseScore + ((parent1Energy + parent2Energy) / 2 - 50) * (parentBonus / 50);
  const satisfaction = baseScore + ((parent1Satisfaction + parent2Satisfaction) / 2 - 50) * (parentBonus / 50);
  
  return {
    grooming: Math.max(0, Math.min(100, Math.round(grooming))),
    energy: Math.max(0, Math.min(100, Math.round(energy))),
    satisfaction: Math.max(0, Math.min(100, Math.round(satisfaction))),
  };
}

/**
 * Core breeding function: inherit traits from two parents
 */
export function inheritTraits(parent1: Traits, parent2: Traits, parent1Gen: number, parent2Gen: number): OffspringTraits {
  // Personality inheritance
  const [personality, personalityNote] = inheritPersonality(parent1.personality, parent2.personality);

  // Color inheritance (blend then snap to closest)
  const color = blendColors(parent1.coloring, parent2.coloring);

  // Earning potential inheritance
  const earningPotential = inheritEarningPotential(parent1.earningPotential, parent2.earningPotential);

  // Social score inheritance
  const socialScore = inheritSocialScore(parent1.socialScore, parent2.socialScore);

  // Development trait inheritance
  const { grooming, energy, satisfaction } = inheritDevelopmentTraits(
    parent1.grooming,
    parent2.grooming,
    parent1.energy,
    parent2.energy,
    parent1.satisfaction,
    parent2.satisfaction,
  );

  // Generation (max of parents + 1)
  const generation = Math.max(parent1Gen, parent2Gen) + 1;

  return {
    personality,
    coloring: color,
    earningPotential,
    socialScore,
    grooming,
    energy,
    satisfaction,
    generation,
    parentAPersonality: parent1.personality,
    parentBPersonality: parent2.personality,
    parentAColor: parent1.coloring,
    parentBColor: parent2.coloring,
  };
}

// ============ Rarity Calculation ============

/**
 * Calculate rarity tier based on trait combination
 * 
 * Common: 60% of offspring (average traits)
 * Uncommon: 30% (good traits, unusual combos)
 * Rare: 8% (excellent traits, rare combos)
 * Legendary: 2% (perfect traits, ultra-rare mutations)
 */
export function calculateRarity(traits: OffspringTraits): RarityTier {
  // Score based on trait quality
  let score = 0;

  // Personality rarity (mutations are rare)
  const parentAvgPersonality = 2; // 4 personalities, so avg is well-distributed
  if (traits.personality !== traits.parentAPersonality && traits.personality !== traits.parentBPersonality) {
    // This is a mutation
    score += 40;
  }

  // Color rarity (pure blends are common, ultra-rare if blended color matches parent)
  const colorMatch = traits.coloring === traits.parentAColor || traits.coloring === traits.parentBColor;
  if (!colorMatch) {
    score += 15; // Unique color combo
  }

  // Trait quality (high social score + good development stats)
  const traitQuality = (traits.socialScore + traits.grooming + traits.energy + traits.satisfaction) / 4;
  if (traitQuality > 75) {
    score += 25;
  } else if (traitQuality > 60) {
    score += 15;
  } else if (traitQuality > 45) {
    score += 5;
  }

  // Earning potential rarity (extreme ±5% is rarer)
  if (traits.earningPotential > 1.04 || traits.earningPotential < 0.96) {
    score += 10;
  }

  // Generation bonus (later generations are slightly rarer)
  if (traits.generation >= 3) {
    score += 10;
  }

  // Determine tier
  if (score >= 90) {
    return {
      name: "legendary",
      score: Math.min(100, score),
      label: "🌟 LEGENDARY",
      color: "bg-purple-400",
    };
  } else if (score >= 50) {
    return {
      name: "rare",
      score,
      label: "✨ RARE",
      color: "bg-blue-400",
    };
  } else if (score >= 20) {
    return {
      name: "uncommon",
      score,
      label: "💎 UNCOMMON",
      color: "bg-green-400",
    };
  } else {
    return {
      name: "common",
      score,
      label: "🍩 COMMON",
      color: "bg-yellow-300",
    };
  }
}

// ============ Genetics Data Encoding ============

/**
 * Generate genetics data JSON for smart contract storage
 * Encodes all trait information for pedigree tracking
 */
export function generateGeneticsData(
  parent1: Traits,
  parent2: Traits,
  offspring: OffspringTraits,
): string {
  const data = {
    offspring: {
      personality: offspring.personality,
      coloring: offspring.coloring,
      earningPotential: offspring.earningPotential,
      socialScore: offspring.socialScore,
      generation: offspring.generation,
    },
    parents: {
      parent1: {
        personality: parent1.personality,
        coloring: parent1.coloring,
        earningPotential: parent1.earningPotential,
        socialScore: parent1.socialScore,
      },
      parent2: {
        personality: parent2.personality,
        coloring: parent2.coloring,
        earningPotential: parent2.earningPotential,
        socialScore: parent2.socialScore,
      },
    },
  };

  return JSON.stringify(data);
}

/**
 * Parse genetics data from contract storage
 */
export function parseGeneticsData(data: string): {
  offspring: Partial<OffspringTraits>;
  parents: {
    parent1: Partial<Traits>;
    parent2: Partial<Traits>;
  };
} {
  return JSON.parse(data);
}

// ============ Pedigree Helpers ============

/**
 * Build family tree from offspring info
 * Returns parents and siblings for lineage display
 */
export function buildFamilyContext(
  offspring: { parentAMiner: string; parentBMiner: string },
  currentDonutGen: number,
) {
  return {
    parentA: offspring.parentAMiner,
    parentB: offspring.parentBMiner,
    generation: currentDonutGen,
    isOffspring: true,
  };
}

/**
 * Calculate genetic diversity score (0-100)
 * Higher = more diverse genetic background
 * Used for leaderboards and trait selection
 */
export function calculateGeneticDiversity(generations: number, uniqueAncestors: number): number {
  // More generations = more time to diversify
  const generationScore = Math.min(generations / 5, 1) * 50; // Cap at 5 gens
  
  // More unique ancestors = better diversity
  const ancestorScore = Math.min(uniqueAncestors / 8, 1) * 50; // Cap at 8 ancestors
  
  return Math.round(generationScore + ancestorScore);
}

// ============ Offspring Preview ============

/**
 * Generate a list of possible offspring traits to show player before breeding
 * Shows 3 possible outcomes to set expectations
 */
export function generateOffspringPreviews(
  parent1: Traits,
  parent2: Traits,
  parent1Gen: number,
  parent2Gen: number,
  count: number = 3,
): GeneticsData[] {
  const previews: GeneticsData[] = [];

  // Run inheritance simulation multiple times to show variety
  for (let i = 0; i < count; i++) {
    const offspring = inheritTraits(parent1, parent2, parent1Gen, parent2Gen);
    const rarity = calculateRarity(offspring);
    const notes = [
      `${offspring.personality} personality`,
      `${offspring.coloring} coloring`,
      `Gen ${offspring.generation}`,
      `${Math.round(offspring.earningPotential * 100)}% earning potential`,
    ];

    previews.push({
      traits: offspring,
      rarity,
      inheritanceNotes: notes,
    });
  }

  return previews;
}
