"use client";

import { useState, useMemo } from "react";
import { useAccount } from "wagmi";
import { NavBar } from "@/components/nav-bar";
import { Button } from "@/components/ui/button";

interface BreedingPartner {
  id: string;
  minerAddress: string;
  ownerName: string;
  personality: "Friendly" | "Energetic" | "Lazy" | "Stubborn";
  color: string;
  generation: number;
  ageInDays: number;
  health: number;
  breedingViability: number; // 0-100%
  canBreed: boolean;
  cooldownRemaining: string;
}

export default function BreedingPage() {
  const { address } = useAccount();
  const [filterPersonality, setFilterPersonality] = useState<string | "all">("all");
  const [sortBy, setSortBy] = useState<"generation" | "age" | "viability">("viability");
  const [selectedPartner, setSelectedPartner] = useState<BreedingPartner | null>(null);

  // Mock data - will be replaced with subgraph queries
  const availablePartners: BreedingPartner[] = [
    {
      id: "0x1",
      minerAddress: "0x1234...5678",
      ownerName: "Donut Enthusiast",
      personality: "Energetic",
      color: "Pink",
      generation: 1,
      ageInDays: 45,
      health: 92,
      breedingViability: 92,
      canBreed: true,
      cooldownRemaining: "Ready!",
    },
    {
      id: "0x2",
      minerAddress: "0x2345...6789",
      ownerName: "Sweet Tooth",
      personality: "Friendly",
      color: "Blue",
      generation: 2,
      ageInDays: 65,
      health: 78,
      breedingViability: 78,
      canBreed: true,
      cooldownRemaining: "Ready!",
    },
    {
      id: "0x3",
      minerAddress: "0x3456...7890",
      ownerName: "Lazy Glazer",
      personality: "Lazy",
      color: "Purple",
      ageInDays: 50,
      health: 68,
      breedingViability: 68,
      canBreed: false,
      cooldownRemaining: "3d 5h remaining",
      generation: 1,
    },
  ];

  const filteredPartners = useMemo(() => {
    let filtered = availablePartners;

    if (filterPersonality !== "all") {
      filtered = filtered.filter((p) => p.personality === filterPersonality);
    }

    return filtered.sort((a, b) => {
      if (sortBy === "generation") return b.generation - a.generation;
      if (sortBy === "age") return b.ageInDays - a.ageInDays;
      return b.breedingViability - a.breedingViability;
    });
  }, [filterPersonality, sortBy]);

  const personalities = ["Friendly", "Energetic", "Lazy", "Stubborn"];

  return (
    <main className="flex h-screen w-screen justify-center overflow-hidden bg-gradient-to-b from-purple-900 via-pink-900 to-orange-900 font-mono text-white">
      <div
        className="relative flex h-full w-full max-w-[520px] flex-1 flex-col overflow-hidden px-3 pb-3"
        style={{
          paddingTop: "calc(env(safe-area-inset-top, 0px) + 8px)",
          paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 80px)",
        }}
      >
        <div className="flex flex-1 flex-col overflow-y-auto space-y-3">
          {/* Header */}
          <div className="bg-yellow-300 border-4 border-black rounded-2xl p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h1 className="text-2xl font-black text-center text-black tracking-tight">
              💕 BREEDING BOARD
            </h1>
            <p className="text-center text-[10px] text-black/70 font-bold mt-1">
              FIND YOUR PERFECT MATCH
            </p>
          </div>

          {/* Requirements */}
          <div className="bg-white border-4 border-black rounded-xl p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="space-y-1">
              <div className="text-[10px] font-black text-black">✨ BREEDING REQUIREMENTS</div>
              <div className="text-[9px] text-black/70 font-bold space-y-0.5">
                <div>📅 Your donut: PRIME age (30+ days)</div>
                <div>❤️ Health & happiness: 50%+ each</div>
                <div>💕 Partner: PRIME age, 50%+ breeding viability</div>
                <div>💰 Cost: 1000 $DONUTAMAGOTCHI (burned)</div>
              </div>
            </div>
          </div>

          {/* Cost Info */}
          <div className="bg-pink-300 border-4 border-black rounded-xl p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-black text-black">BREEDING COST</div>
              <div className="text-sm font-black text-black">1000 $DONUTAMAGOTCHI</div>
            </div>
            <div className="text-[9px] text-black/60 font-bold mt-1">
              💡 Cost is burned (removed from circulation)
            </div>
          </div>

          {/* Personality Filter */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-black text-white/80">PERSONALITY:</div>
            <div className="grid grid-cols-4 gap-1.5">
              <button
                onClick={() => setFilterPersonality("all")}
                className={`py-2 px-2 rounded-lg border-3 border-black font-black text-[10px] transition-all ${
                  filterPersonality === "all"
                    ? "bg-yellow-400 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    : "bg-white text-black/60 hover:bg-gray-100"
                }`}
              >
                ALL
              </button>
              {personalities.map((p) => (
                <button
                  key={p}
                  onClick={() => setFilterPersonality(p)}
                  className={`py-2 px-2 rounded-lg border-3 border-black font-black text-[10px] transition-all ${
                    filterPersonality === p
                      ? "bg-yellow-400 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      : "bg-white text-black/60 hover:bg-gray-100"
                  }`}
                >
                  {p.slice(0, 4).toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setSortBy("viability")}
              className={`py-2 px-2 rounded-lg border-3 border-black font-black text-[10px] transition-all ${
                sortBy === "viability"
                  ? "bg-cyan-400 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  : "bg-white text-black/60 hover:bg-gray-100"
              }`}
            >
              💪 VIABILITY
            </button>
            <button
              onClick={() => setSortBy("generation")}
              className={`py-2 px-2 rounded-lg border-3 border-black font-black text-[10px] transition-all ${
                sortBy === "generation"
                  ? "bg-cyan-400 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  : "bg-white text-black/60 hover:bg-gray-100"
              }`}
            >
              👶 GEN
            </button>
            <button
              onClick={() => setSortBy("age")}
              className={`py-2 px-2 rounded-lg border-3 border-black font-black text-[10px] transition-all ${
                sortBy === "age"
                  ? "bg-cyan-400 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  : "bg-white text-black/60 hover:bg-gray-100"
              }`}
            >
              📅 AGE
            </button>
          </div>

          {/* Partners List */}
          {filteredPartners.length > 0 ? (
            <div className="space-y-2 flex-1 overflow-y-auto">
              {filteredPartners.map((partner) => (
                <div
                  key={partner.id}
                  className={`border-4 border-black rounded-xl p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-2 cursor-pointer transition-all ${
                    selectedPartner?.id === partner.id
                      ? "bg-pink-300"
                      : "bg-white hover:bg-pink-50"
                  }`}
                  onClick={() => setSelectedPartner(partner)}
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
              ))}
            </div>
          ) : (
            <div className="bg-white border-4 border-black rounded-xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex-1 flex flex-col items-center justify-center">
              <div className="text-center space-y-3">
                <div className="text-4xl">💔</div>
                <div className="text-sm font-black text-black">No Matches Found</div>
                <p className="text-xs text-black/70 max-w-xs">
                  Try adjusting your filters to find breeding partners
                </p>
              </div>
            </div>
          )}

          {/* Selected Partner Info */}
          {selectedPartner && (
            <div className="bg-pink-300 border-4 border-black rounded-xl p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-2">
              <div className="text-[10px] font-black text-black/70">BREEDING OFFER</div>
              <div className="text-xs font-black text-black">
                Send breeding request to {selectedPartner.ownerName}?
              </div>
              <div className="text-[9px] text-black/60 space-y-1">
                <div>📊 Expected offspring: Gen {selectedPartner.generation + 1}</div>
                <div>💰 Cost: 1000 $DONUTAMAGOTCHI (burned)</div>
                <div>⏳ Incubation: 1 day</div>
              </div>

              <Button
                className="w-full bg-gradient-to-b from-purple-400 to-purple-600 border-3 border-black text-black text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50"
                disabled={!selectedPartner.canBreed}
              >
                {selectedPartner.canBreed
                  ? "💕 SEND BREEDING REQUEST"
                  : "⏳ PARTNER ON COOLDOWN"}
              </Button>
            </div>
          )}

          {/* Info */}
          <div className="bg-lime-300 border-4 border-black rounded-xl p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-[10px] font-black text-black text-center space-y-1">
              <div>🔒 Both partners must approve the breeding</div>
              <div>📅 Cooldown: 7 days between breeds</div>
            </div>
          </div>
        </div>
      </div>
      <NavBar />
    </main>
  );
}
