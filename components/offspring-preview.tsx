"use client";

import { OffspringTraits, RarityTier } from "@/lib/genetics";
import { getColorHex } from "@/lib/traits";

interface OffspringPreviewProps {
  offspring: OffspringTraits;
  rarity: RarityTier;
  index: number; // For showing "Option 1, 2, 3"
}

export function OffspringPreview({ offspring, rarity, index }: OffspringPreviewProps) {
  const color = getColorHex(offspring.coloring);

  return (
    <div className={`border-4 border-black rounded-xl p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-2 ${rarity.color}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="text-[10px] font-black text-black/60">POSSIBLE OUTCOME {index}</div>
          <div className="text-sm font-black text-black">
            {offspring.personality} {offspring.coloring}
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-black" style={{ color: color }}>🍩</div>
          <div className="text-[9px] font-black text-black mt-1">{rarity.label}</div>
        </div>
      </div>

      {/* Traits Grid */}
      <div className="grid grid-cols-3 gap-2 bg-black/10 p-2 rounded-lg border-2 border-black">
        <div className="text-center">
          <div className="text-[9px] font-bold text-black/60">GEN</div>
          <div className="text-xs font-black text-black">{offspring.generation}</div>
        </div>
        <div className="text-center">
          <div className="text-[9px] font-bold text-black/60">EARNING</div>
          <div className="text-xs font-black text-black">{Math.round(offspring.earningPotential * 100)}%</div>
        </div>
        <div className="text-center">
          <div className="text-[9px] font-bold text-black/60">SOCIAL</div>
          <div className="text-xs font-black text-black">{offspring.socialScore}</div>
        </div>
      </div>

      {/* Stats Bars */}
      <div className="space-y-2">
        {/* Grooming */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] font-black text-black">✨ Grooming</span>
            <span className="text-[9px] font-black text-black">{offspring.grooming}%</span>
          </div>
          <div className="w-full bg-black/20 border-2 border-black rounded h-2">
            <div
              className="h-full bg-blue-400 rounded"
              style={{ width: `${offspring.grooming}%` }}
            />
          </div>
        </div>

        {/* Energy */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] font-black text-black">⚡ Energy</span>
            <span className="text-[9px] font-black text-black">{offspring.energy}%</span>
          </div>
          <div className="w-full bg-black/20 border-2 border-black rounded h-2">
            <div
              className="h-full bg-yellow-400 rounded"
              style={{ width: `${offspring.energy}%` }}
            />
          </div>
        </div>

        {/* Satisfaction */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] font-black text-black">😋 Satisfaction</span>
            <span className="text-[9px] font-black text-black">{offspring.satisfaction}%</span>
          </div>
          <div className="w-full bg-black/20 border-2 border-black rounded h-2">
            <div
              className="h-full bg-pink-400 rounded"
              style={{ width: `${offspring.satisfaction}%` }}
            />
          </div>
        </div>
      </div>

      {/* Rarity Score */}
      <div className="bg-black/10 border-2 border-black rounded-lg p-2 text-center">
        <div className="text-[9px] font-black text-black/60">RARITY SCORE</div>
        <div className="text-sm font-black text-black">{offspring.generation > 1 ? "+" : ""}{rarity.score}%</div>
      </div>
    </div>
  );
}
