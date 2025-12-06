"use client";

import { getLifecycleInfo } from "@/lib/traits";
import { getRetirementTier } from "@/lib/earnings";
import { Button } from "./ui/button";

interface BreedingReadinessProps {
  createdAtSeconds: number;
  health: number;
  cleanliness: number;
  cooldownRemaining?: number; // Seconds until can breed again (from contract)
}

export function BreedingReadiness(props: BreedingReadinessProps) {
  const lifecycleInfo = getLifecycleInfo(props.createdAtSeconds * 1000);
  const breedingScore = (props.health + props.cleanliness) / 2;

  // Check if breeding is on cooldown (from contract)
  const isOnCooldown = props.cooldownRemaining && props.cooldownRemaining > 0;
  const canBreed = lifecycleInfo.stage === "prime" && breedingScore >= 30 && !isOnCooldown;
  const isExcellent = breedingScore >= 70;
  const isGood = breedingScore >= 50;

  // Format cooldown time
  const formatCooldown = (seconds: number): string => {
    if (seconds <= 0) return "Ready!";
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  const getStatusColor = () => {
    if (!canBreed) return "bg-gray-400";
    if (isExcellent) return "bg-green-400";
    if (isGood) return "bg-yellow-400";
    return "bg-orange-400";
  };

  const getStatusText = () => {
    if (lifecycleInfo.stage !== "prime")
      return `🚫 Ready at Prime (day 30+)`;
    if (breedingScore >= 70)
      return "✨ Excellent breeding conditions!";
    if (breedingScore >= 50)
      return "👍 Good breeding conditions";
    if (breedingScore >= 30)
      return "⚠️ Poor breeding conditions";
    return "❌ Too weak to breed";
  };

  return (
    <div className="space-y-2">
      <div className={`${getStatusColor()} border-4 border-black rounded-xl p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-black text-black">BREEDING READINESS</span>
            <span className="text-sm font-black text-black">{Math.round(breedingScore)}%</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-black/20 border-2 border-black rounded-lg h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-400 to-purple-400 transition-all"
              style={{ width: `${Math.min(100, breedingScore)}%` }}
            />
          </div>

          {/* Status Message */}
          <div className="text-center text-[11px] font-black text-black">
            {getStatusText()}
          </div>

          {/* Breeding Requirements */}
          <div className="space-y-1 text-[10px] text-black font-bold">
            <div className="flex items-center gap-1">
              <span>{lifecycleInfo.stage === "prime" ? "✅" : "⭕"}</span>
              <span>Prime Age (30-90 days)</span>
            </div>
            <div className="flex items-center gap-1">
              <span>{props.health >= 50 ? "✅" : "⭕"}</span>
              <span>Health ≥ 50% ({Math.round(props.health)}%)</span>
            </div>
            <div className="flex items-center gap-1">
              <span>{props.cleanliness >= 50 ? "✅" : "⭕"}</span>
              <span>Cleanliness ≥ 50% ({Math.round(props.cleanliness)}%)</span>
            </div>
            {isOnCooldown && (
              <div className="flex items-center gap-1 text-amber-700 font-bold">
                <span>⏳</span>
                <span>Cooldown: {formatCooldown(props.cooldownRemaining!)}</span>
              </div>
            )}
          </div>

          {/* Breeding Cost Info */}
          {canBreed && (
            <div className="bg-white/50 border-2 border-black rounded-lg p-2 text-center">
              <div className="text-[9px] font-black text-black/70">BREEDING COST</div>
              <div className="text-xs font-black text-black">1000 $DONUTAMAGOTCHI</div>
              <div className="text-[9px] text-black/60 font-bold">(Future token)</div>
            </div>
          )}

          {/* Breed Button */}
          {canBreed ? (
            <Button
              className="w-full bg-gradient-to-b from-pink-400 to-pink-600 border-3 border-black text-black text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50"
              disabled={true}
            >
              💑 FIND PARTNER (Coming Soon)
            </Button>
          ) : (
            <Button
              className="w-full bg-gray-400 border-3 border-black text-black text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              disabled={true}
            >
              🔒 Not Ready to Breed
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
