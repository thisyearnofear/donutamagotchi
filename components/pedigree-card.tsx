"use client";

interface PedigreeCardProps {
  generation: number;
  parentAPersonality?: string;
  parentBPersonality?: string;
  parentAColor?: string;
  parentBColor?: string;
  offspring?: number; // Count of offspring
  compact?: boolean; // Compact view for display cards
}

export function PedigreeCard({
  generation,
  parentAPersonality,
  parentBPersonality,
  parentAColor,
  parentBColor,
  offspring = 0,
  compact = false,
}: PedigreeCardProps) {
  if (compact) {
    return (
      <div className="text-center text-[10px] font-bold">
        <div className="text-black/70">GEN {generation}</div>
        <div className="text-black/60 mt-0.5">{offspring} offspring</div>
      </div>
    );
  }

  return (
    <div className="border-4 border-black rounded-xl p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white space-y-2">
      {/* Generation Badge */}
      <div className="flex items-center justify-between">
        <div className="text-xs font-black text-black">BLOODLINE</div>
        <div className="bg-yellow-300 border-2 border-black rounded-lg px-2 py-1 text-sm font-black text-black">
          GEN {generation}
        </div>
      </div>

      {/* Pedigree Tree (Simple Visual) */}
      <div className="bg-gray-100 border-2 border-black rounded-lg p-2">
        <div className="text-center space-y-2">
          {/* Parents */}
          {parentAPersonality && parentBPersonality ? (
            <>
              <div className="text-[9px] font-black text-black/60 mb-1">PARENTS</div>
              <div className="flex items-center justify-center gap-2">
                <div className="text-center text-[10px] font-black">
                  <div className="text-lg">🍩</div>
                  <div className="text-black">{parentAPersonality}</div>
                  <div className="text-[8px] text-black/60">{parentAColor}</div>
                </div>
                <div className="text-lg font-black text-black">+</div>
                <div className="text-center text-[10px] font-black">
                  <div className="text-lg">🍩</div>
                  <div className="text-black">{parentBPersonality}</div>
                  <div className="text-[8px] text-black/60">{parentBColor}</div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-[9px] text-black/60 font-bold">Original Donut (Gen 1)</div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2">
        <div className="text-center">
          <div className="text-[9px] font-black text-black/60">GENERATION</div>
          <div className="text-lg font-black text-black">{generation}</div>
        </div>
        <div className="text-center">
          <div className="text-[9px] font-black text-black/60">OFFSPRING</div>
          <div className="text-lg font-black text-black">{offspring}</div>
        </div>
      </div>
    </div>
  );
}
