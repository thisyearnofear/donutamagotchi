"use client";

import { getBreedingViability, getCareRoutine, Traits } from "@/lib/traits";

interface BreedingViabilityProps {
  traits: Traits | null;
  lastInteractionTime: number;
  lastFedTime: number;
}

export function BreedingViability({
  traits,
  lastInteractionTime,
  lastFedTime,
}: BreedingViabilityProps) {
  if (!traits) return null;

  const viability = getBreedingViability(traits);
  const routine = getCareRoutine(lastInteractionTime, lastFedTime);

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
      <div className="text-center mb-2">
        <div className="text-[10px] font-black text-black/60 uppercase">Breeding Ready</div>
        <div className="text-xs font-black text-black">{viability.message}</div>
        <div className="text-[10px] font-bold text-black mt-1">
          Success Rate: {Math.round(viability.successRate)}%
        </div>
      </div>

      {/* Care Routine */}
      <div className="grid grid-cols-3 gap-2 text-center text-[10px] pt-2 border-t-2 border-black border-dashed">
        <div>
          <div className="font-black text-black/60">Feed</div>
          <div className={`font-black ${routine.feedDueIn === "NOW!" ? "text-red-600" : "text-black"}`}>
            {routine.feedDueIn}
          </div>
        </div>
        <div>
          <div className="font-black text-black/60">Play</div>
          <div className={`font-black ${routine.playDueIn === "NOW!" ? "text-red-600" : "text-black"}`}>
            {routine.playDueIn}
          </div>
        </div>
        <div>
          <div className="font-black text-black/60">Pet</div>
          <div className={`font-black ${routine.petDueIn === "NOW!" ? "text-red-600" : "text-black"}`}>
            {routine.petDueIn}
          </div>
        </div>
      </div>
    </div>
  );
}
