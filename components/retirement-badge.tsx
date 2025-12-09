"use client";

import Link from "next/link";
import { isRetirementEligible, getRetirementTier } from "@/lib/earnings";

interface RetirementBadgeProps {
  ageInDays: number;
}

export function RetirementBadge({ ageInDays }: RetirementBadgeProps) {
  const eligible = isRetirementEligible(ageInDays);
  const tier = getRetirementTier(ageInDays);

  // Progressive disclosure: Don't show for young donuts (< 60 days)
  if (ageInDays < 60 && !eligible) {
    return null;
  }

  // Approaching eligibility (60-89 days): subtle teaser
  if (!eligible && ageInDays >= 60) {
    const daysRemaining = 90 - ageInDays;
    return (
      <div className="bg-gray-200 border-2 border-gray-400 rounded-lg p-1.5 opacity-70">
        <div className="text-[9px] font-bold text-gray-600 text-center">
          🏛️ Retirement unlocks in {daysRemaining} day{daysRemaining !== 1 ? "s" : ""}
        </div>
      </div>
    );
  }

  // Not eligible (safety fallback)
  if (!eligible) {
    return null;
  }

  // ELIGIBLE - Full display with link
  return (
    <Link href="/hall-of-fame">
      <div className="bg-gradient-to-r from-purple-400 to-pink-400 border-3 border-black rounded-lg p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-shadow">
        <div className="text-[11px] font-black text-black text-center">
          <div className="flex items-center justify-center gap-1">
            <span>🏛️</span>
            <span>READY FOR LEGACY</span>
            <span>👑</span>
          </div>
          <div className="text-[9px] mt-0.5 font-bold">
            {tier} Tier • Tap to enter Hall of Fame
          </div>
        </div>
      </div>
    </Link>
  );
}
