"use client";

import { useState } from "react";
import { PetStats } from "./pet-stats";

interface CollapsibleStatsProps {
  happiness: number;
  health: number;
  energy: string;
  age: string;
  grooming: number;
  energyLevel: number;
  satisfaction: number;
  isDying: boolean;
}

export function CollapsibleStats(props: CollapsibleStatsProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-purple-400 border-4 border-black rounded-xl p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all font-black text-black text-sm"
      >
        <div className="flex items-center justify-between">
          <span>📊 STATS</span>
          <span className="text-xs">{isOpen ? "▼" : "▶"}</span>
        </div>
      </button>

      {isOpen && (
        <div className="mt-2">
          <PetStats {...props} />
        </div>
      )}
    </div>
  );
}
