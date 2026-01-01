"use client";

import { getBreedingViability, Traits } from "@/lib/traits";

interface BreedingViabilityProps {
  traits: Traits | null;
  lastFedTime: number;
}

export function BreedingViability({
  traits,
  lastFedTime,
}: BreedingViabilityProps) {
  if (!traits) return null;

  const viability = getBreedingViability(traits, lastFedTime);

  const statusColors = {
    excellent: "bg-green-300",
    good: "bg-lime-300",
    normal: "bg-yellow-300",
    poor: "bg-orange-300",
    impossible: "bg-red-300",
  };

  return (
    <div className={`border-4 border-black rounded-xl p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${statusColors[viability.status]}`}>
      {/* Breeding Status */}
      <div className="text-center">
        <div className="text-[10px] font-black text-black/60 uppercase">Breeding Ready</div>
        <div className="text-xs font-black text-black">{viability.message}</div>
        <div className="text-[10px] font-bold text-black mt-1">
          Success Rate: {Math.round(viability.successRate)}%
        </div>
      </div>
    </div>
  );
}
