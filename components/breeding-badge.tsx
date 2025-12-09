"use client";

import Link from "next/link";
import { LifecycleStage } from "@/lib/traits";

interface BreedingBadgeProps {
  lifecycleStage: LifecycleStage;
  happiness: number;
  ageInDays?: number;
}

export function BreedingBadge({ lifecycleStage, happiness, ageInDays = 0 }: BreedingBadgeProps) {
  const canBreed = lifecycleStage === "prime" && happiness >= 50;

  // Progressive disclosure: Don't show if far from eligibility
  // Birth (0-1 days) and early Growth (< 20 days): hide completely
  if (ageInDays < 20 && !canBreed) {
    return null;
  }

  // Near eligibility (20-29 days): show subtle teaser
  if (!canBreed && ageInDays >= 20 && ageInDays < 30) {
    const daysRemaining = 30 - ageInDays;
    return (
      <div className="bg-gray-200 border-2 border-gray-400 rounded-lg p-1.5 opacity-70">
        <div className="text-[9px] font-bold text-gray-600 text-center">
          💕 Breeding unlocks in {daysRemaining} day{daysRemaining !== 1 ? "s" : ""}
        </div>
      </div>
    );
  }

  // Prime but low happiness: show actionable tip
  if (!canBreed && lifecycleStage === "prime") {
    return (
      <div className="bg-yellow-200 border-2 border-yellow-500 rounded-lg p-2">
        <div className="text-[10px] font-black text-yellow-800 text-center">
          <div>💕 BREEDING ALMOST READY</div>
          <div className="text-[8px] mt-0.5 font-bold">
            Raise happiness to 50% to unlock
          </div>
        </div>
      </div>
    );
  }

  // Not prime after day 30 (twilight): don't show breeding badge
  if (!canBreed) {
    return null;
  }

  // READY TO BREED - Full display with link
  return (
    <Link href="/breeding">
      <div className="bg-gradient-to-r from-green-400 to-emerald-400 border-3 border-black rounded-lg p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all">
        <div className="text-[11px] font-black text-black text-center">
          <div className="flex items-center justify-center gap-1">
            <span className="animate-pulse">✨</span>
            <span>READY TO BREED</span>
            <span className="animate-pulse">✨</span>
          </div>
          <div className="text-[9px] mt-0.5 font-bold">Tap to find a partner</div>
        </div>
      </div>
    </Link>
  );
}
