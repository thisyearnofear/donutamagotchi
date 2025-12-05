"use client";

import { useMemo } from "react";
import { Address, zeroAddress } from "viem";
import { generateTraits, decayTraits, updateTraitFromInteraction, Traits } from "@/lib/traits";

interface UseTraitsOptions {
  minerAddress?: Address;
  lastInteractionTime?: number;
  lastFedTime?: number;
  currentTime?: number;
}

/**
 * Hook to manage pet traits
 * Generates traits deterministically from miner address
 * Calculates decay based on interaction times
 */
export function useTraits({
  minerAddress = zeroAddress,
  lastInteractionTime = Date.now(),
  lastFedTime = Date.now(),
  currentTime = Date.now(),
}: UseTraitsOptions = {}) {
  const traits = useMemo(() => {
    if (minerAddress === zeroAddress) {
      return null;
    }

    const baseTraits = generateTraits(minerAddress);
    const decayedTraits = decayTraits(baseTraits, lastInteractionTime, lastFedTime, currentTime);

    return decayedTraits;
  }, [minerAddress, lastInteractionTime, lastFedTime, currentTime]);

  const updateTraits = (interactionType: "feed" | "play" | "pet" | "poke"): Traits | null => {
    if (!traits) return null;
    return updateTraitFromInteraction(traits, interactionType);
  };

  return {
    traits,
    updateTraits,
  };
}
