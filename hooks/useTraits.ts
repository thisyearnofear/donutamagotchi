"use client";

import { useMemo } from "react";
import { Address, zeroAddress } from "viem";
import { generateTraits, updateTraitFromFeed, applyPlayBoost, applyPetBoost, Traits } from "@/lib/traits";
import { calculateEngagementState, applyCosmeticDecay, EngagementState } from "@/lib/engagement";

interface UseTraitsOptions {
  minerAddress?: Address;
  lastFedTime?: number;
  currentTime?: number;
}

export interface UseTraitsReturn {
  traits: Traits | null;
  engagement: EngagementState | null;
  updateTraitsFromFeed: () => Traits | null;
  updateTraitsFromPlay: () => Traits | null;
  updateTraitsFromPet: () => Traits | null;
}

/**
 * Hook to manage pet traits with engagement system
 * 
 * NEW MODEL: Feed is CRITICAL (once per 24h)
 * Play/Pet are OPTIONAL (cosmetic boosters only)
 * 
 * Generates traits deterministically from miner address
 * Calculates engagement state based on lastFedTime only
 */
export function useTraits({
  minerAddress = zeroAddress,
  lastFedTime = Date.now(),
  currentTime = Date.now(),
}: UseTraitsOptions = {}): UseTraitsReturn {
  const { traits, engagement } = useMemo(() => {
    if (minerAddress === zeroAddress) {
      return { traits: null, engagement: null };
    }

    // Generate base traits (deterministic, never changes)
    const baseTraits = generateTraits(minerAddress);
    
    // Calculate engagement state (feeding status only)
    const engagementState = calculateEngagementState(lastFedTime, currentTime);
    
    // Apply cosmetic decay (visual only, no consequences)
    const decayedTraits = applyCosmeticDecay(baseTraits, engagementState.hoursSinceFed);

    return { traits: decayedTraits, engagement: engagementState };
  }, [minerAddress, lastFedTime, currentTime]);

  const updateTraitsFromFeed = (): Traits | null => {
    if (!traits) return null;
    return updateTraitFromFeed(traits);
  };

  const updateTraitsFromPlay = (): Traits | null => {
    if (!traits) return null;
    return applyPlayBoost(traits);
  };

  const updateTraitsFromPet = (): Traits | null => {
    if (!traits) return null;
    return applyPetBoost(traits);
  };

  return {
    traits,
    engagement,
    updateTraitsFromFeed,
    updateTraitsFromPlay,
    updateTraitsFromPet,
  };
}
