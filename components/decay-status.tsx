"use client";

import { useMemo } from "react";

interface DecayStatusProps {
  satisfaction: number; // health
  energy: number; // happiness
  grooming: number; // cleanliness
}

export function DecayStatus({ satisfaction, energy, grooming }: DecayStatusProps) {
  const status = useMemo(() => {
    // Calculate urgency level
    const avgStat = (satisfaction + energy + grooming) / 3;
    
    if (avgStat >= 70) {
      return {
        level: "healthy",
        emoji: "💚",
        message: "Your donut is thriving!",
        bgColor: "bg-green-300",
        borderColor: "border-green-600",
        textColor: "text-green-900",
      };
    } else if (avgStat >= 50) {
      return {
        level: "good",
        emoji: "😊",
        message: "Your donut feels good.",
        bgColor: "bg-blue-300",
        borderColor: "border-blue-600",
        textColor: "text-blue-900",
      };
    } else if (avgStat >= 30) {
      return {
        level: "warning",
        emoji: "😟",
        message: "⚠️ Stats are declining. Time for care!",
        bgColor: "bg-yellow-300",
        borderColor: "border-yellow-600",
        textColor: "text-yellow-900",
      };
    } else {
      return {
        level: "critical",
        emoji: "😢",
        message: "🚨 CRITICAL! Feed and play immediately!",
        bgColor: "bg-red-300",
        borderColor: "border-red-600",
        textColor: "text-red-900",
      };
    }
  }, [satisfaction, energy, grooming]);

  return (
    <div
      className={`${status.bgColor} border-4 ${status.borderColor} rounded-xl p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}
    >
      <div className={`flex items-center gap-2 ${status.textColor}`}>
        <span className="text-xl">{status.emoji}</span>
        <div className="flex-1">
          <div className="font-black text-sm">{status.message}</div>
        </div>
      </div>
    </div>
  );
}