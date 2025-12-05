"use client";

import { getLifecycleInfo } from "@/lib/traits";

interface LifecycleDisplayProps {
  createdAtSeconds: number | undefined;
}

export function LifecycleDisplay({ createdAtSeconds }: LifecycleDisplayProps) {
  if (!createdAtSeconds) return null;

  const lifecycle = getLifecycleInfo(createdAtSeconds);

  const stageColors = {
    birth: "bg-blue-200",
    growth: "bg-green-200",
    prime: "bg-yellow-200",
    twilight: "bg-purple-200",
    dead: "bg-gray-300",
  };

  return (
    <div className={`border-4 border-black rounded-xl p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${stageColors[lifecycle.stage]}`}>
      {/* Lifecycle Stage */}
      <div className="text-center mb-2">
        <div className="text-3xl mb-1">{lifecycle.emoji}</div>
        <div className="text-xs font-black text-black uppercase">{lifecycle.stage}</div>
        <div className="text-[10px] font-bold text-black mt-1">{lifecycle.description}</div>
      </div>

      {/* Age and Stats */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t-2 border-black border-dashed text-center text-[10px]">
        <div>
          <div className="font-black text-black/60">AGE</div>
          <div className="font-black text-black">{lifecycle.ageInDays} day{lifecycle.ageInDays !== 1 ? "s" : ""}</div>
        </div>
        <div>
          <div className="font-black text-black/60">DPS</div>
          <div className="font-black text-black">{(lifecycle.dpsMultiplier * 100).toFixed(0)}%</div>
        </div>
      </div>

      {/* Breeding Status */}
      <div className="mt-2 text-center">
        <div className="text-[10px] font-black">
          {lifecycle.canBreed ? (
            <span className="text-green-600">✅ Can breed</span>
          ) : (
            <span className="text-red-600">❌ Cannot breed yet</span>
          )}
        </div>
      </div>

      {/* Progress to next stage */}
      {(lifecycle.stage === "birth" || lifecycle.stage === "growth") && (
        <ProgressBar lifecycle={lifecycle} />
      )}
    </div>
  );
}

function ProgressBar({ lifecycle }: { lifecycle: ReturnType<typeof getLifecycleInfo> }) {
  let daysLeft = 0;
  let stageName = "";

  if (lifecycle.stage === "birth") {
    daysLeft = 1 - lifecycle.ageInDays;
    stageName = "Growth";
  } else if (lifecycle.stage === "growth") {
    daysLeft = 30 - lifecycle.ageInDays;
    stageName = "Prime";
  }

  if (daysLeft <= 0) return null;

  const maxDays = lifecycle.stage === "birth" ? 1 : 29;
  const currentDays = lifecycle.stage === "birth" ? lifecycle.ageInDays : lifecycle.ageInDays - 1;
  const progress = Math.round((currentDays / maxDays) * 100);

  return (
    <div className="mt-2 pt-2 border-t-2 border-black border-dashed">
      <div className="text-[9px] font-black text-black/60 mb-1">
        Evolves to {stageName} in {Math.ceil(daysLeft)} day{Math.ceil(daysLeft) !== 1 ? "s" : ""}
      </div>
      <div className="flex gap-0.5 h-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 border border-black ${
              i < Math.ceil(progress / 10) ? "bg-blue-400" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
