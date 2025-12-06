/**
 * Earnings Calculation Utilities
 * 
 * Pure functions for token earnings calculations.
 * Used by components and hooks to avoid duplicating math logic.
 */

import { formatUnits } from "viem";

const DONUT_DECIMALS = 18;
const CHEAPEST_COSMETIC = 50;

/**
 * Calculate tokens earned in a session
 * @param initialGlazed - Starting token amount (bigint)
 * @param currentGlazed - Current token amount (bigint)
 */
export function calculateSessionEarnings(
  initialGlazed: bigint | null,
  currentGlazed: bigint | null
): number {
  if (!initialGlazed || !currentGlazed) return 0;
  const earned = Number(
    formatUnits(currentGlazed - initialGlazed, DONUT_DECIMALS)
  );
  return Math.max(0, earned);
}

/**
 * Calculate projected daily earning rate
 * @param dpsPerSecond - Tokens per second (bigint)
 * @param elapsedSeconds - Seconds since start (need >=60s for accuracy)
 */
export function calculateDailyRate(
  dpsPerSecond: bigint,
  elapsedSeconds: number
): number {
  if (elapsedSeconds < 60) return 0;
  const dpsNum = Number(formatUnits(dpsPerSecond, DONUT_DECIMALS));
  const secondsInDay = 86400;
  return dpsNum * secondsInDay;
}

/**
 * Calculate tokens until next cosmetic milestone
 * @param currentEarnings - Current session earnings
 */
export function calculateTokensUntilNextMilestone(
  currentEarnings: number
): number {
  const currentInt = Math.floor(currentEarnings);
  const nextMilestoneValue =
    CHEAPEST_COSMETIC * (Math.floor(currentInt / CHEAPEST_COSMETIC) + 1);
  return Math.max(0, nextMilestoneValue - currentInt);
}

/**
 * Calculate retirement tier based on age
 * @param ageInDays - Pet age in days
 */
export function getRetirementTier(
  ageInDays: number
): "LEGENDARY" | "HONORED" | "CHERISHED" | undefined {
  if (ageInDays >= 120) return "LEGENDARY";
  if (ageInDays >= 100) return "HONORED";
  if (ageInDays >= 90) return "CHERISHED";
  return undefined;
}

/**
 * Check if pet is retirement eligible
 * @param ageInDays - Pet age in days
 */
export function isRetirementEligible(ageInDays: number): boolean {
  return ageInDays >= 90;
}
