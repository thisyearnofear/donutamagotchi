"use client";

interface BreedingPartner {
  id: string;
  minerAddress: string;
  ownerName: string;
  personality: "Friendly" | "Energetic" | "Lazy" | "Stubborn";
  color: string;
  generation: number;
  ageInDays: number;
  health: number;
  breedingViability: number;
  canBreed: boolean;
  cooldownRemaining: string;
}

interface PartnerCardProps {
  partner: BreedingPartner;
  isSelected: boolean;
  onSelect: (partner: BreedingPartner) => void;
}

export function PartnerCard({ partner, isSelected, onSelect }: PartnerCardProps) {
  return (
    <div
      className={`border-4 border-black rounded-xl p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-2 cursor-pointer transition-all ${
        isSelected ? "bg-pink-300" : "bg-white hover:bg-pink-50"
      }`}
      onClick={() => onSelect(partner)}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎭</span>
            <div>
              <div className="text-xs font-black text-black">
                {partner.personality} {partner.color}
              </div>
              <div className="text-[10px] text-black/60 font-bold">
                @{partner.ownerName}
              </div>
            </div>
          </div>
        </div>
        <span
          className={`text-lg px-2 py-1 rounded-lg border-2 border-black font-black text-[10px] ${
            partner.canBreed
              ? "bg-green-300 text-black"
              : "bg-gray-300 text-black/60"
          }`}
        >
          {partner.canBreed ? "✅" : "⏳"}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 text-center bg-gray-100 p-2 rounded-lg border-2 border-black">
        <div>
          <div className="text-[9px] font-bold text-black/60">GEN</div>
          <div className="text-xs font-black text-black">{partner.generation}</div>
        </div>
        <div>
          <div className="text-[9px] font-bold text-black/60">AGE</div>
          <div className="text-xs font-black text-black">{partner.ageInDays}d</div>
        </div>
        <div>
          <div className="text-[9px] font-bold text-black/60">HEALTH</div>
          <div className="text-xs font-black text-black">
            {Math.round(partner.health)}%
          </div>
        </div>
      </div>

      {/* Viability Bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black text-black">VIABILITY</span>
          <span className="text-[10px] font-black text-black">
            {Math.round(partner.breedingViability)}%
          </span>
        </div>
        <div className="w-full bg-gray-300 border-2 border-black rounded-full h-3">
          <div
            className={`h-full rounded-full border-2 border-black transition-all ${
              partner.breedingViability > 70
                ? "bg-green-400"
                : partner.breedingViability > 40
                  ? "bg-yellow-400"
                  : "bg-red-400"
            }`}
            style={{ width: `${partner.breedingViability}%` }}
          />
        </div>
      </div>

      {/* Cooldown Status */}
      <div className="text-[10px] text-black/70 font-bold">
        {partner.canBreed ? "🟢 Ready to breed!" : `⏳ ${partner.cooldownRemaining}`}
      </div>
    </div>
  );
}
