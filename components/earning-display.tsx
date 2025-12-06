"use client";

interface EarningDisplayProps {
  baseRate: string; // formatted DONUT/sec
  multiplier: number; // 0-1 (50% = 0.5)
  lifecycleStage: "birth" | "growth" | "prime" | "twilight";
}

const stageLabels = {
  birth: "📦 BIRTH (0-1d)",
  growth: "🌱 GROWTH (1-30d)",
  prime: "⭐ PRIME (30-90d)",
  twilight: "🌙 TWILIGHT (90d+)",
};

export function EarningDisplay({ baseRate, multiplier, lifecycleStage }: EarningDisplayProps) {
  const multiplierPercent = Math.round(multiplier * 100);

  return (
    <div className="bg-lime-300 border-4 border-black rounded-xl p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <div className="space-y-2">
        <div className="text-[10px] font-black text-black">LIFECYCLE & EARNINGS</div>
        
        <div className="bg-white border-3 border-black rounded-lg p-2 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-black">{stageLabels[lifecycleStage]}</span>
            <span className="text-[10px] font-black text-black bg-yellow-300 px-2 py-1 rounded border-2 border-black">
              {multiplierPercent}%
            </span>
          </div>
          
          <div className="text-[9px] text-black/70 font-bold">
            Earning: {baseRate} × {multiplierPercent}% = <span className="font-black text-black">{baseRate}</span> actual
          </div>
        </div>
      </div>
    </div>
  );
}
