"use client";

import { Button } from "./ui/button";

interface DonutCardProps {
  donut: {
    id: string;
    ownerName: string;
    ownerAddress: string;
    personality: "Friendly" | "Energetic" | "Lazy" | "Stubborn";
    color: string;
    ageInDays: number;
    dpsEarningRate: string;
    health: number;
    generation: number;
  };
  stage: "birth" | "growth" | "prime" | "twilight";
}

const getLifecycleColor = (stage: string) => {
  switch (stage) {
    case "birth":
      return "bg-blue-100 text-blue-900 border-blue-300";
    case "growth":
      return "bg-green-100 text-green-900 border-green-300";
    case "prime":
      return "bg-purple-100 text-purple-900 border-purple-300";
    case "twilight":
      return "bg-orange-100 text-orange-900 border-orange-300";
    default:
      return "bg-gray-100 text-gray-900 border-gray-300";
  }
};

const getLifecycleEmoji = (stage: string) => {
  switch (stage) {
    case "birth":
      return "🥚";
    case "growth":
      return "🌱";
    case "prime":
      return "⭐";
    case "twilight":
      return "🌙";
    default:
      return "🍩";
  }
};

export function DonutCard({ donut, stage }: DonutCardProps) {
  return (
    <div className="bg-white border-4 border-black rounded-xl p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-2">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎭</span>
            <div>
              <div className="text-xs font-black text-black">
                {donut.personality} {donut.color}
              </div>
              <div className="text-[10px] text-black/60 font-bold">
                @{donut.ownerName}
              </div>
            </div>
          </div>
        </div>
        <span
          className={`text-lg px-2 py-1 rounded-lg border-2 border-black font-black text-[10px] ${getLifecycleColor(stage)}`}
        >
          {getLifecycleEmoji(stage)} {stage.toUpperCase()}
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-2 text-center bg-gray-100 p-2 rounded-lg border-2 border-black">
        <div>
          <div className="text-[9px] font-bold text-black/60">AGE</div>
          <div className="text-xs font-black text-black">{donut.ageInDays}d</div>
        </div>
        <div>
          <div className="text-[9px] font-bold text-black/60">EARNING</div>
          <div className="text-xs font-black text-black">{donut.dpsEarningRate}</div>
        </div>
        <div>
          <div className="text-[9px] font-bold text-black/60">HEALTH</div>
          <div className="text-xs font-black text-black">{Math.round(donut.health)}%</div>
        </div>
      </div>

      {/* Generation */}
      <div className="text-[10px] text-black/70 font-bold">
        👶 Generation {donut.generation}
      </div>

      {/* View Button */}
      <Button
        className="w-full bg-gradient-to-b from-cyan-400 to-cyan-500 border-3 border-black text-black text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
        disabled={true}
      >
        👁️ VIEW DETAILS
      </Button>
    </div>
  );
}
