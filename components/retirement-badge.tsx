"use client";

import Link from "next/link";
import { isRetirementEligible, getRetirementTier } from "@/lib/earnings";

interface RetirementBadgeProps {
  ageInDays: number;
}

export function RetirementBadge({ ageInDays }: RetirementBadgeProps) {
  const eligible = isRetirementEligible(ageInDays);
  const tier = getRetirementTier(ageInDays);

  if (!eligible) {
    return (
      <div className="bg-gray-400 border-3 border-black rounded-lg p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
        <div className="text-[10px] font-black text-black text-center">
          <div>🏤 RETIREMENT</div>
          <div className="text-[8px] mt-0.5">
            Unlock at day 90 ({Math.max(0, 90 - ageInDays)} days remaining)
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link href="/hall-of-fame">
      <div className="bg-gradient-to-b from-purple-400 to-pink-400 border-3 border-black rounded-lg p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-shadow">
        <div className="text-[10px] font-black text-black text-center">
          <div>🏛️ READY FOR LEGACY</div>
          <div className="text-[8px] mt-0.5">
            {tier} Tier • Visit Hall of Fame to retire
          </div>
        </div>
      </div>
    </Link>
  );
}
