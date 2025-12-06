"use client";

interface BreedingBadgeProps {
  lifecycleStage: "birth" | "growth" | "prime" | "twilight";
  happiness: number;
}

export function BreedingBadge({ lifecycleStage, happiness }: BreedingBadgeProps) {
  const canBreed = lifecycleStage === "prime" && happiness >= 50;
  
  if (!canBreed) {
    return (
      <div className="bg-gray-400 border-3 border-black rounded-lg p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
        <div className="text-[10px] font-black text-black text-center">
          <div>🚫 BREEDING</div>
          <div className="text-[8px] mt-0.5">
            {lifecycleStage !== "prime" 
              ? "Unlock at Prime (day 30+)" 
              : "Need 50% happiness"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-green-400 border-3 border-black rounded-lg p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
      <div className="text-[10px] font-black text-black text-center">
        <div>✨ READY TO BREED</div>
        <div className="text-[8px] mt-0.5">Visit BREED tab</div>
      </div>
    </div>
  );
}
