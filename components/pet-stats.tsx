"use client";

import { getRetirementTier, isRetirementEligible } from "@/lib/earnings";

interface PetStatsProps {
  happiness: number;
  health: number;
  energy: string;
  age: string;
  ageInDays?: number; // For retirement eligibility check
  grooming?: number;
  energyLevel?: number;
  satisfaction?: number;
  isDying?: boolean;
  lastFedTime?: number; // milliseconds
  sessionEarnings?: number; // Tokens earned this session
  dailyEarningRate?: number; // Estimated tokens per day
  tokensUntilNextMilestone?: number; // Tokens until next cosmetic
};

export function PetStats({ 
  happiness, 
  health, 
  energy, 
  age,
  ageInDays = 0,
  grooming = 50,
  energyLevel = 50,
  satisfaction = 50,
  isDying = false,
  lastFedTime = Date.now(),
  sessionEarnings = 0,
  dailyEarningRate = 0,
  tokensUntilNextMilestone = 0
}: PetStatsProps) {
  // Determine critical status
  const isCriticalHealth = health < 10;
  const isCriticalHappiness = happiness < 10;
  const isWarningHealth = health < 30;
  const isWarningHappiness = happiness < 30;

  // Status indicator
  let status: "healthy" | "needs-care" | "critical" | "dead";
  let statusLabel: string;
  let statusEmoji: string;
  let statusBg: string;

  if (isDying) {
    status = "dead";
    statusLabel = "DYING";
    statusEmoji = "💀";
    statusBg = "bg-red-600";
  } else if (health < 20) {
    status = "critical";
    statusLabel = "CRITICAL";
    statusEmoji = "🔴";
    statusBg = "bg-red-500";
  } else if (health < 50) {
    status = "needs-care";
    statusLabel = "NEEDS CARE";
    statusEmoji = "🟡";
    statusBg = "bg-yellow-500";
  } else {
    status = "healthy";
    statusLabel = "HEALTHY";
    statusEmoji = "🟢";
    statusBg = "bg-green-500";
  }

  const minutesSinceFed = Math.floor((Date.now() - lastFedTime) / 1000 / 60);
  
  // Retirement eligibility check
  const eligible = isRetirementEligible(ageInDays);
  const tier = getRetirementTier(ageInDays);

  return (
    <div className={`border-4 border-black rounded-xl p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-3 ${
      isDying ? "bg-red-200 animate-pulse" : "bg-white"
    }`}>
      {/* Status Indicator */}
      <div className={`${statusBg} border-3 border-black rounded-lg p-2`}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-lg">{statusEmoji}</span>
            <span className="font-black text-black text-sm">{statusLabel}</span>
          </div>
          <div className="text-right text-[9px] font-bold text-black">
            <div>Health: {health.toFixed(0)}%</div>
            <div>Fed: {minutesSinceFed}m ago</div>
          </div>
        </div>
      </div>
      {/* Critical Alerts */}
      {(isCriticalHealth || isCriticalHappiness) && (
        <div className="bg-red-500 border-2 border-black rounded-lg p-2 text-center">
          <div className="text-xs font-black text-white">
            ⚠️ {isCriticalHealth ? "HEALTH CRITICAL!" : "VERY UNHAPPY!"} ⚠️
          </div>
        </div>
      )}

      {/* Warning Alerts */}
      {(isWarningHealth || isWarningHappiness) && !isCriticalHealth && !isCriticalHappiness && (
        <div className="bg-yellow-400 border-2 border-black rounded-lg p-1.5 text-center">
          <div className="text-[10px] font-black text-black">
            {isWarningHealth ? "Your donut needs food!" : "Your donut is sad..."}
          </div>
        </div>
      )}

      <div>
        <PixelStatBar label="HEALTH" value={health} emoji="❤️" color="red" />
        <div className="text-[8px] text-black/60 font-bold ml-6 mt-0.5">↳ Affects feeding urgency</div>
      </div>
      <div>
        <PixelStatBar label="HAPPY" value={happiness} emoji="😊" color="yellow" />
        <div className="text-[8px] text-black/60 font-bold ml-6 mt-0.5">↳ Affects breeding viability</div>
      </div>
      
      {/* Development stats (shown conditionally) */}
      <div className="pt-1 border-t-2 border-black border-dashed space-y-2">
        <PixelStatBar label="GROOMING" value={grooming} emoji="✨" color="yellow" size="small" />
        <PixelStatBar label="ENERGY" value={energyLevel} emoji="⚡" color="yellow" size="small" />
        <PixelStatBar label="SATISFIED" value={satisfaction} emoji="😋" color="yellow" size="small" />
      </div>

      {/* Earnings Section */}
      {(sessionEarnings > 0 || dailyEarningRate > 0) && (
        <div className="bg-gradient-to-br from-amber-100 to-yellow-100 border-3 border-black rounded-lg p-2">
          <div className="text-[9px] font-black text-black space-y-1">
            {sessionEarnings > 0 && (
              <div className="flex items-center justify-between">
                <span>💰 Session Earnings:</span>
                <span className="text-xs">{sessionEarnings.toFixed(1)} $DONUT</span>
              </div>
            )}
            {dailyEarningRate > 0 && (
              <div className="flex items-center justify-between">
                <span>📊 Est. Daily Rate:</span>
                <span className="text-xs">{dailyEarningRate.toFixed(1)} $DONUT/day</span>
              </div>
            )}
            {tokensUntilNextMilestone > 0 && (
              <div className="flex items-center justify-between text-amber-700">
                <span>🎯 Next Cosmetic:</span>
                <span className="text-xs font-bold">{tokensUntilNextMilestone.toFixed(0)} more</span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-3 pt-2 border-t-4 border-black border-dashed">
          <StatDisplay label="ENERGY" value={energy} emoji="⚡" />
          <StatDisplay label="AGE" value={age} emoji="⏱️" />
        </div>

        {/* Retirement Eligibility Badge */}
        {eligible && tier && (
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 border-3 border-black rounded-lg p-2 text-center">
            <div className="text-xs font-black text-white mb-1">🏛️ HALL OF FAME ELIGIBLE</div>
            <div className="text-[9px] font-bold text-white">{tier} Tier • Retire to Sanctuary</div>
          </div>
        )}
      </div>
    </div>
  );
}

function PixelStatBar({ 
  label, 
  value, 
  emoji, 
  color,
  size = "normal"
}: { 
  label: string; 
  value: number; 
  emoji: string; 
  color: "red" | "yellow";
  size?: "normal" | "small";
}) {
  const percentage = Math.max(0, Math.min(100, value));
  const blocks = Math.round(percentage / 10);
  const blockCount = size === "small" ? 5 : 10;
  const scaledBlocks = Math.round((percentage / 100) * blockCount);
  
  const blockColor = color === "red"
    ? percentage > 60 ? "bg-green-500" : percentage > 30 ? "bg-yellow-500" : "bg-red-500"
    : percentage > 60 ? "bg-yellow-400" : percentage > 30 ? "bg-orange-400" : "bg-gray-400";

  const textSize = size === "small" ? "text-[10px]" : "text-xs";
  const barHeight = size === "small" ? "h-2" : "h-4";
  const labelGap = size === "small" ? "gap-0.5" : "gap-1";
  const barGap = size === "small" ? "gap-0.5" : "gap-1";

  return (
    <div>
      <div className="flex items-center justify-between mb-0.5">
        <span className={`${textSize} font-black text-black flex items-center ${labelGap}`}>
          <span>{emoji}</span>
          <span>{label}</span>
        </span>
        <span className={`${textSize} font-black text-black`}>{Math.round(percentage)}%</span>
      </div>
      <div className={`flex ${barGap}`}>
        {Array.from({ length: blockCount }).map((_, i) => (
          <div
            key={i}
            className={`${barHeight} flex-1 border-2 border-black ${
              i < scaledBlocks ? blockColor : "bg-gray-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function StatDisplay({ 
  label, 
  value, 
  emoji 
}: { 
  label: string; 
  value: string; 
  emoji: string;
}) {
  return (
    <div className="text-center">
      <div className="text-2xl mb-1">{emoji}</div>
      <div className="text-[10px] font-black text-black/60">{label}</div>
      <div className="text-sm font-black text-black">{value}</div>
    </div>
  );
}
