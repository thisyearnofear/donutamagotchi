"use client";

interface PetStatsProps {
  happiness: number;
  health: number;
  energy: string;
  age: string;
}

export function PetStats({ happiness, health, energy, age }: PetStatsProps) {
  return (
    <div className="bg-white border-4 border-black rounded-xl p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-3">
      <PixelStatBar label="HEALTH" value={health} emoji="❤️" color="red" />
      <PixelStatBar label="HAPPY" value={happiness} emoji="😊" color="yellow" />
      
      <div className="grid grid-cols-2 gap-3 pt-2 border-t-4 border-black border-dashed">
        <StatDisplay label="ENERGY" value={energy} emoji="⚡" />
        <StatDisplay label="AGE" value={age} emoji="⏱️" />
      </div>
    </div>
  );
}

function PixelStatBar({ 
  label, 
  value, 
  emoji, 
  color 
}: { 
  label: string; 
  value: number; 
  emoji: string; 
  color: "red" | "yellow";
}) {
  const percentage = Math.max(0, Math.min(100, value));
  const blocks = Math.round(percentage / 10);
  
  const blockColor = color === "red"
    ? percentage > 60 ? "bg-green-500" : percentage > 30 ? "bg-yellow-500" : "bg-red-500"
    : percentage > 60 ? "bg-yellow-400" : percentage > 30 ? "bg-orange-400" : "bg-gray-400";

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-black text-black flex items-center gap-1">
          <span>{emoji}</span>
          <span>{label}</span>
        </span>
        <span className="text-xs font-black text-black">{Math.round(percentage)}%</span>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className={`h-4 flex-1 border-2 border-black ${
              i < blocks ? blockColor : "bg-gray-200"
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
