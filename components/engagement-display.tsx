"use client";

import { EngagementState } from "@/lib/engagement";

interface EngagementDisplayProps {
  engagement: EngagementState | null;
}

/**
 * Display current feeding status and engagement state
 * Shows:
 * - Status emoji + message
 * - Days since fed
 * - DPS multiplier
 * - Feed reward multiplier (if applicable)
 * - Warning/critical indicators
 */
export function EngagementDisplay({ engagement }: EngagementDisplayProps) {
  if (!engagement) return null;

  const getBackgroundColor = () => {
    switch (engagement.status) {
      case "healthy":
        return "bg-green-300 border-green-600";
      case "sad":
        return "bg-yellow-300 border-yellow-600";
      case "neglected":
        return "bg-red-300 border-red-600";
      case "dead":
        return "bg-gray-400 border-gray-600";
    }
  };

  const getTextColor = () => {
    switch (engagement.status) {
      case "healthy":
        return "text-green-900";
      case "sad":
        return "text-yellow-900";
      case "neglected":
        return "text-red-900";
      case "dead":
        return "text-gray-900";
    }
  };

  return (
    <div
      className={`border-4 border-black rounded-xl p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${getBackgroundColor()}`}
    >
      {/* Status Message */}
      <div className="text-center mb-2">
        <p className={`text-sm font-black ${getTextColor()}`}>
          {engagement.statusEmoji} {engagement.statusMessage}
        </p>
      </div>

      {/* Status Details Grid */}
      <div className="grid grid-cols-2 gap-2">
        {/* Days Since Fed */}
        <div className="bg-white/50 border-2 border-black rounded-lg p-2">
          <p className="text-[10px] font-bold text-black/60">Days Since Fed</p>
          <p className="text-lg font-black text-black">{engagement.daysSinceFed}</p>
        </div>

        {/* DPS Multiplier */}
        <div className="bg-white/50 border-2 border-black rounded-lg p-2">
          <p className="text-[10px] font-bold text-black/60">DPS Multiplier</p>
          <p className="text-lg font-black text-black">{(engagement.dpsMultiplier * 100).toFixed(0)}%</p>
        </div>

        {/* Feed Reward Multiplier (if not dead) */}
        {engagement.status !== "dead" && (
          <div className="bg-white/50 border-2 border-black rounded-lg p-2 col-span-2">
            <p className="text-[10px] font-bold text-black/60">Next Feed Reward</p>
            <p className="text-lg font-black text-black">
              {engagement.feedRewardMultiplier.toFixed(1)}x
              {engagement.feedRewardMultiplier > 1.0 && (
                <span className="text-[10px] ml-1">🎁 Catch-up bonus!</span>
              )}
            </p>
          </div>
        )}

        {/* Can Breed Status */}
        <div className="bg-white/50 border-2 border-black rounded-lg p-2 col-span-2">
          <p className="text-[10px] font-bold text-black/60">Can Breed</p>
          <p className="text-lg font-black text-black">
            {engagement.canBreed ? "✅ Yes" : "❌ No"}
          </p>
        </div>
      </div>

      {/* Critical Warning */}
      {engagement.daysSinceFed >= 2 && (
        <div className="mt-2 bg-red-500 border-2 border-black rounded-lg p-2">
          <p className="text-[10px] font-black text-white text-center">
            ⚠️ Will retire in {3 - engagement.daysSinceFed} day{3 - engagement.daysSinceFed !== 1 ? "s" : ""}
          </p>
        </div>
      )}
    </div>
  );
}
