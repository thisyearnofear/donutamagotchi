"use client";

import { useState } from "react";
import { NavBar } from "@/components/nav-bar";
import { Button } from "@/components/ui/button";

interface LegendaryDonut {
  id: string;
  ownerName: string;
  ownerAddress: string;
  personality: "Friendly" | "Energetic" | "Lazy" | "Stubborn";
  color: string;
  totalDaysAlive: number;
  totalEarningsDonut: string;
  totalEarningsEth: string;
  status: "retired" | "legendary";
  retiredAt: string;
  traits: {
    generation: number;
    offspringCount: number;
  };
}

export default function HallOfFamePage() {
  const [activeTab, setActiveTab] = useState<"retired" | "legendary">("retired");
  const [sortBy, setSortBy] = useState<"age" | "earnings" | "recent">("age");

  // Mock data - will be replaced with subgraph queries
  const legendaryDonuts: LegendaryDonut[] = [
    {
      id: "0x1",
      ownerName: "Alpha Glazer",
      ownerAddress: "0x1234...5678",
      personality: "Energetic",
      color: "Pink",
      totalDaysAlive: 156,
      totalEarningsDonut: "2,340",
      totalEarningsEth: "1.23",
      status: "legendary",
      retiredAt: "2024-12-01",
      traits: { generation: 1, offspringCount: 3 },
    },
    {
      id: "0x2",
      ownerName: "Donut Keeper",
      ownerAddress: "0x2345...6789",
      personality: "Friendly",
      color: "Blue",
      totalDaysAlive: 127,
      totalEarningsDonut: "1,890",
      totalEarningsEth: "0.98",
      status: "retired",
      retiredAt: "2024-11-15",
      traits: { generation: 2, offspringCount: 1 },
    },
  ];

  const filteredDonuts = legendaryDonuts.filter((d) =>
    activeTab === "retired" ? d.status === "retired" : d.status === "legendary"
  );

  const sortedDonuts = [...filteredDonuts].sort((a, b) => {
    if (sortBy === "age") return b.totalDaysAlive - a.totalDaysAlive;
    if (sortBy === "earnings") return parseInt(b.totalEarningsDonut) - parseInt(a.totalEarningsDonut);
    return new Date(b.retiredAt).getTime() - new Date(a.retiredAt).getTime();
  });

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
              🏛️ HALL OF FAME
            </h1>
            <p className="text-center text-[10px] text-black/70 font-bold mt-1">
              LEGENDARY DONUTS & LEGACY
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("retired")}
              className={`flex-1 py-2 px-3 rounded-xl border-4 border-black font-black text-xs transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                activeTab === "retired"
                  ? "bg-pink-400 text-black"
                  : "bg-gray-600 text-white hover:bg-gray-500"
              }`}
            >
              <div className="text-lg">🏤</div>
              <div>RETIRED</div>
            </button>
            <button
              onClick={() => setActiveTab("legendary")}
              className={`flex-1 py-2 px-3 rounded-xl border-4 border-black font-black text-xs transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                activeTab === "legendary"
                  ? "bg-pink-400 text-black"
                  : "bg-gray-600 text-white hover:bg-gray-500"
              }`}
            >
              <div className="text-lg">⭐</div>
              <div>LEGENDARY</div>
            </button>
          </div>

          {/* Sort Options */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setSortBy("age")}
              className={`py-2 px-2 rounded-lg border-3 border-black font-black text-[10px] transition-all ${
                sortBy === "age"
                  ? "bg-purple-400 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  : "bg-white text-black/60 hover:bg-gray-100"
              }`}
            >
              AGE
            </button>
            <button
              onClick={() => setSortBy("earnings")}
              className={`py-2 px-2 rounded-lg border-3 border-black font-black text-[10px] transition-all ${
                sortBy === "earnings"
                  ? "bg-purple-400 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  : "bg-white text-black/60 hover:bg-gray-100"
              }`}
            >
              💰
            </button>
            <button
              onClick={() => setSortBy("recent")}
              className={`py-2 px-2 rounded-lg border-3 border-black font-black text-[10px] transition-all ${
                sortBy === "recent"
                  ? "bg-purple-400 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  : "bg-white text-black/60 hover:bg-gray-100"
              }`}
            >
              📅
            </button>
          </div>

          {/* Donuts List */}
          {sortedDonuts.length > 0 ? (
            <div className="space-y-2 flex-1 overflow-y-auto">
              {sortedDonuts.map((donut) => (
                <div
                  key={donut.id}
                  className="bg-white border-4 border-black rounded-xl p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-2"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {donut.status === "legendary" ? "⭐" : "🏤"}
                        </span>
                        <div>
                          <div className="text-xs font-black text-black">
                            🎭 {donut.personality} {donut.color} Donut
                          </div>
                          <div className="text-[10px] text-black/60 font-bold">
                            {donut.ownerName}
                          </div>
                        </div>
                      </div>
                    </div>
                    {donut.status === "legendary" && (
                      <span className="bg-yellow-300 text-black text-[10px] font-black px-2 py-1 rounded-lg border-2 border-black">
                        LEGENDARY
                      </span>
                    )}
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-2 text-center bg-gray-100 p-2 rounded-lg border-2 border-black">
                    <div>
                      <div className="text-[9px] font-bold text-black/60">AGE</div>
                      <div className="text-xs font-black text-black">
                        {donut.totalDaysAlive}d
                      </div>
                    </div>
                    <div>
                      <div className="text-[9px] font-bold text-black/60">$DONUT</div>
                      <div className="text-xs font-black text-black">
                        {donut.totalEarningsDonut}
                      </div>
                    </div>
                    <div>
                      <div className="text-[9px] font-bold text-black/60">ETH</div>
                      <div className="text-xs font-black text-black">
                        Ξ{donut.totalEarningsEth}
                      </div>
                    </div>
                  </div>

                  {/* Legacy Info */}
                  <div className="text-[10px] text-black/70 font-bold space-y-1">
                    <div>
                      👶 Gen {donut.traits.generation} • 👨‍👩‍👧‍👦{" "}
                      {donut.traits.offspringCount} offspring
                    </div>
                    <div>📅 Retired {donut.retiredAt}</div>
                  </div>

                  {/* View Button */}
                  <Button
                    className="w-full bg-gradient-to-b from-pink-300 to-pink-400 border-3 border-black text-black text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
                    disabled={true}
                  >
                    👁️ View Legacy
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border-4 border-black rounded-xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex-1 flex flex-col items-center justify-center">
              <div className="text-center space-y-3">
                <div className="text-4xl">
                  {activeTab === "retired" ? "🏤" : "⭐"}
                </div>
                <div className="text-sm font-black text-black">No Legends Yet</div>
                <p className="text-xs text-black/70 max-w-xs">
                  {activeTab === "retired"
                    ? "When donuts reach 90+ days and are retired, they'll appear here."
                    : "Legendary survivors who reach 100+ days will be immortalized here."}
                </p>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-lime-300 border-4 border-black rounded-xl p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-[10px] font-black text-black text-center">
              🔮 Reach 90 days to unlock retirement • 100+ days for legendary status
            </div>
          </div>
        </div>
      </div>
      <NavBar />
    </main>
  );
}
