/**
 * Canonical Type Definitions
 * 
 * Single source of truth for all data types across the app.
 * Used by:
 * - Mock data (lib/mockData.ts)
 * - Contract integration (hooks/useContractData.ts)
 * - UI pages and components
 * 
 * Keep this organized by domain (donut state, breeding, shop, etc).
 */

// ============ Personality & Color Enums ============

export type Personality = "Friendly" | "Energetic" | "Lazy" | "Stubborn";
export type Color = "Pink" | "Blue" | "Purple" | "Yellow" | "Orange" | "Green";
export type Rarity = "common" | "rare" | "epic" | "legendary";
export type CosmeticCategory = "hats" | "animations" | "themes" | "names";
export type LifecycleStage = "birth" | "growth" | "prime" | "twilight";

// ============ Donut Explorer (Donuts Page) ============

export interface DonutCard {
  id: string;
  ownerName: string;
  ownerAddress: string;
  personality: Personality;
  color: Color;
  ageInDays: number;
  dpsEarningRate: string;
  health: number;
  generation: number;
}

// ============ Breeding Board ============

export interface BreedingPartner {
  id: string;
  minerAddress: string;
  ownerName: string;
  personality: Personality;
  color: Color;
  generation: number;
  ageInDays: number;
  health: number;
  breedingViability: number; // 0-100%
  canBreed: boolean;
  cooldownRemaining: string;
}

// ============ Cosmetics Shop ============

export interface CosmeticItem {
  id: string;
  name: string;
  emoji: string;
  category: CosmeticCategory;
  price: number;
  rarity: Rarity;
  description: string;
  owned: boolean;
}

// ============ Hall of Fame - Donuts ============

export interface LegendaryDonut {
  id: string;
  ownerName: string;
  ownerAddress: string;
  personality: Personality;
  color: Color;
  totalDaysAlive: number;
  totalEarningsDonut: string;
  totalEarningsEth: string;
  status: "retired" | "legendary";
  retiredAt: string;
  traits: {
    generation: number;
    offspringCount: number;
  };
}

// ============ Hall of Fame - Achievements ============

export interface Achievement {
  id: string;
  name: string;
  emoji: string;
  description: string;
  hint: string;
  unlocked: boolean;
  unlockedAt?: string;
  category: "gameplay" | "breeding" | "social" | "cosmetics";
}

// ============ Hall of Fame - Leaderboards ============

export interface LeaderboardEntry {
  rank: number;
  ownerName: string;
  ownerAddress: string;
  donutName: string;
  value: string | number;
  badge?: string;
  detail?: string;
}

export type LeaderboardCategory = "earnings" | "age" | "bloodline" | "achievements";

// ============ Token & Economics ============

export interface TokenBalance {
  balance: bigint;
  displayBalance: string; // Formatted with 2 decimals
  stakedBalance: bigint;
  displayStakedBalance: string;
}

export interface DailyEarnings {
  todayEarned: number; // Tokens
  sessionEarned: number; // Tokens since page load
  estimatedDaily: number; // Projection based on current session
  lastReward: string; // "daily_login" | "pet_interaction" | etc
}

// ============ Retirement & Sanctuary ============

export interface RetirementEligibility {
  eligible: boolean;
  daysAlive: number;
  daysUntilEligible: number; // 0 if eligible
  currentTier?: "LEGENDARY" | "HONORED" | "CHERISHED" | "RETIRED";
}

export interface RetiredDonut {
  tokenId: string;
  minerAddress: string;
  retiredBy: string;
  createdAtTimestamp: number;
  retiredAtTimestamp: number;
  totalEarningsDonut: string;
  totalEarningsWeth: string;
  finalGeneration: number;
  offspringCount: number;
  memorialText: string;
}

// ============ Breeding Mechanics ============

export interface BreedingCooldown {
  remaining: number; // Seconds
  displayRemaining: string; // "3d 5h 30m"
  canBreedNow: boolean;
  cooldownStartTime?: number;
}

export interface GeneticData {
  parentAPersonality: Personality;
  parentBPersonality: Personality;
  parentAColor: Color;
  parentBColor: Color;
  parentAGen: number;
  parentBGen: number;
  childGen: number;
}

// ============ Contract Integration ============

/**
 * Configuration for using real contracts vs mock data.
 * Set via environment variables.
 */
export interface ContractConfig {
  useMockData: boolean; // true in dev, false in production
  tokenAddress: string;
  breedingAddress: string;
  sanctuaryAddress: string;
}

/**
 * Result of any contract query/operation.
 * Standardizes error handling across hooks.
 */
export interface ContractResult<T> {
  data: T | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isMockData: boolean; // true if using mockData instead of contract
}

// ============ UI State ============

/**
 * Global notifications (token earned, breeding ready, etc).
 * Managed by useNotifications hook.
 */
export interface Notification {
  id: string;
  type: "success" | "warning" | "error" | "info";
  message: string;
  timestamp: number;
  duration?: number; // ms, 0 = infinite
}
