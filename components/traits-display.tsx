"use client";

import { Traits } from "@/lib/traits";

interface TraitsDisplayProps {
  traits: Traits | null;
}

export function TraitsDisplay({ traits }: TraitsDisplayProps) {
  if (!traits) return null;

  return (
    <div className="bg-gradient-to-b from-purple-300 to-pink-300 border-4 border-black rounded-xl p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <div className="grid grid-cols-2 gap-2 text-center">
        <div>
          <div className="text-[8px] font-black text-black/60 uppercase">Personality</div>
          <div className="text-xs font-black text-black">{traits.personality}</div>
        </div>
        <div>
          <div className="text-[8px] font-black text-black/60 uppercase">Color</div>
          <div className="text-xs font-black text-black">{traits.coloring}</div>
        </div>
        <div>
          <div className="text-[8px] font-black text-black/60 uppercase">DPS</div>
          <div className="text-xs font-black text-black">{(traits.earningPotential * 100).toFixed(0)}%</div>
        </div>
        <div>
          <div className="text-[8px] font-black text-black/60 uppercase">Social</div>
          <div className="text-xs font-black text-black">{traits.socialScore}</div>
        </div>
      </div>
    </div>
  );
}
