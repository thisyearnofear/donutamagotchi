"use client";

interface PetStatusIndicatorProps {
  health: number;
  lastFedTime: number; // milliseconds
  isDying: boolean;
}

export function PetStatusIndicator({ health, lastFedTime, isDying }: PetStatusIndicatorProps) {
  const minutesSinceFed = Math.floor((Date.now() - lastFedTime) / 1000 / 60);
  
  let status: "healthy" | "needs-care" | "critical" | "dead";
  let statusLabel: string;
  let statusEmoji: string;
  let bgColor: string;

  if (isDying) {
    status = "dead";
    statusLabel = "DYING";
    statusEmoji = "💀";
    bgColor = "bg-red-600";
  } else if (health < 20) {
    status = "critical";
    statusLabel = "CRITICAL";
    statusEmoji = "🔴";
    bgColor = "bg-red-500";
  } else if (health < 50) {
    status = "needs-care";
    statusLabel = "NEEDS CARE";
    statusEmoji = "🟡";
    bgColor = "bg-yellow-500";
  } else {
    status = "healthy";
    statusLabel = "HEALTHY";
    statusEmoji = "🟢";
    bgColor = "bg-green-500";
  }

  return (
    <div className={`${bgColor} border-4 border-black rounded-xl p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{statusEmoji}</span>
          <span className="font-black text-black text-sm">{statusLabel}</span>
        </div>
        <div className="text-right text-[10px] font-bold text-black">
          <div>Health: {health.toFixed(0)}%</div>
          <div>Last fed: {minutesSinceFed}m ago</div>
        </div>
      </div>
    </div>
  );
}
