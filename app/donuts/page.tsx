"use client";

import { useState, useMemo } from "react";
import { NavBar } from "@/components/nav-bar";
import { Button } from "@/components/ui/button";

interface DonutCard {
  id: string;
  ownerName: string;
  ownerAddress: string;
  personality: "Friendly" | "Energetic" | "Lazy" | "Stubborn";
  color: string;
  ageInDays: number;
  dpsEarningRate: string;
  health: number;
  generation: number;
}

export default function DonutsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLifecycle, setFilterLifecycle] = useState<"all" | "prime" | "growth" | "birth">("all");
  const [sortBy, setSortBy] = useState<"earnings" | "age" | "health">("earnings");

  // Mock data - will be replaced with subgraph queries
  const allDonuts: DonutCard[] = [
    {
      id: "0x1",
      ownerName: "Glazier Max",
      ownerAddress: "0x1234...5678",
      personality: "Energetic",
      color: "Pink",
      ageInDays: 45,
      dpsEarningRate: "2.1 DONUT/sec",
      health: 92,
      generation: 1,
    },
    {
      id: "0x2",
      ownerName: "Donut Enthusiast",
      ownerAddress: "0x2345...6789",
      personality: "Friendly",
      color: "Blue",
      ageInDays: 65,
      dpsEarningRate: "4.0 DONUT/sec",
      health: 75,
      generation: 2,
    },
    {
      id: "0x3",
      ownerName: "Sweet Tooth",
      ownerAddress: "0x3456...7890",
      personality: "Lazy",
      color: "Purple",
      ageInDays: 8,
      dpsEarningRate: "1.2 DONUT/sec",
      health: 68,
      generation: 1,
    },
  ];

  const getLifecycleStage = (days: number) => {
    if (days < 1) return "birth";
    if (days < 30) return "growth";
    if (days < 90) return "prime";
    return "twilight";
  };

  const filteredBySearch = allDonuts.filter(
    (donut) =>
      donut.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donut.ownerAddress.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredByLifecycle =
    filterLifecycle === "all"
      ? filteredBySearch
      : filteredBySearch.filter((donut) => getLifecycleStage(donut.ageInDays) === filterLifecycle);

  const sortedDonuts = [...filteredByLifecycle].sort((a, b) => {
    if (sortBy === "earnings") {
      const aRate = parseFloat(a.dpsEarningRate);
      const bRate = parseFloat(b.dpsEarningRate);
      return bRate - aRate;
    }
    if (sortBy === "age") return b.ageInDays - a.ageInDays;
    return b.health - a.health;
  });

  const getLifecycleColor = (stage: string) => {
    switch (stage) {
      case "birth":
        return "bg-blue-100 text-blue-900 border-blue-300";
      case "growth":
        return "bg-green-100 text-green-900 border-green-300";
      case "prime":
        return "bg-purple-100 text-purple-900 border-purple-300";
      case "twilight":
        return "bg-orange-100 text-orange-900 border-orange-300";
      default:
        return "bg-gray-100 text-gray-900 border-gray-300";
    }
  };

  const getLifecycleEmoji = (stage: string) => {
    switch (stage) {
      case "birth":
        return "🥚";
      case "growth":
        return "🌱";
      case "prime":
        return "⭐";
      case "twilight":
        return "🌙";
      default:
        return "🍩";
    }
  };

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
              🌍 DONUT EXPLORER
            </h1>
            <p className="text-center text-[10px] text-black/70 font-bold mt-1">
              DISCOVER ALL ACTIVE DONUTS
            </p>
          </div>

          {/* Search Bar */}
          <div className="bg-white border-4 border-black rounded-xl p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by owner or address..."
              className="w-full bg-transparent text-black placeholder-black/40 text-xs font-bold focus:outline-none"
            />
          </div>

          {/* Filter Options */}
          <div className="grid grid-cols-4 gap-1.5">
            <button
              onClick={() => setFilterLifecycle("all")}
              className={`py-2 px-2 rounded-lg border-3 border-black font-black text-[10px] transition-all ${
                filterLifecycle === "all"
                  ? "bg-pink-400 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  : "bg-white text-black/60 hover:bg-gray-100"
              }`}
            >
              ALL
            </button>
            <button
              onClick={() => setFilterLifecycle("prime")}
              className={`py-2 px-2 rounded-lg border-3 border-black font-black text-[10px] transition-all ${
                filterLifecycle === "prime"
                  ? "bg-purple-400 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  : "bg-white text-black/60 hover:bg-gray-100"
              }`}
            >
              ⭐ PRIME
            </button>
            <button
              onClick={() => setFilterLifecycle("growth")}
              className={`py-2 px-2 rounded-lg border-3 border-black font-black text-[10px] transition-all ${
                filterLifecycle === "growth"
                  ? "bg-green-400 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  : "bg-white text-black/60 hover:bg-gray-100"
              }`}
            >
              🌱
            </button>
            <button
              onClick={() => setFilterLifecycle("birth")}
              className={`py-2 px-2 rounded-lg border-3 border-black font-black text-[10px] transition-all ${
                filterLifecycle === "birth"
                  ? "bg-blue-400 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  : "bg-white text-black/60 hover:bg-gray-100"
              }`}
            >
              🥚
            </button>
          </div>

          {/* Sort Options */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setSortBy("earnings")}
              className={`py-2 px-2 rounded-lg border-3 border-black font-black text-[10px] transition-all ${
                sortBy === "earnings"
                  ? "bg-yellow-400 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  : "bg-white text-black/60 hover:bg-gray-100"
              }`}
            >
              💰 EARNINGS
            </button>
            <button
              onClick={() => setSortBy("age")}
              className={`py-2 px-2 rounded-lg border-3 border-black font-black text-[10px] transition-all ${
                sortBy === "age"
                  ? "bg-yellow-400 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  : "bg-white text-black/60 hover:bg-gray-100"
              }`}
            >
              📅 AGE
            </button>
            <button
              onClick={() => setSortBy("health")}
              className={`py-2 px-2 rounded-lg border-3 border-black font-black text-[10px] transition-all ${
                sortBy === "health"
                  ? "bg-yellow-400 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  : "bg-white text-black/60 hover:bg-gray-100"
              }`}
            >
              ❤️ HEALTH
            </button>
          </div>

          {/* Donuts List */}
          {sortedDonuts.length > 0 ? (
            <div className="space-y-2 flex-1 overflow-y-auto">
              {sortedDonuts.map((donut) => {
                const stage = getLifecycleStage(donut.ageInDays);
                return (
                  <div
                    key={donut.id}
                    className="bg-white border-4 border-black rounded-xl p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-2"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🎭</span>
                          <div>
                            <div className="text-xs font-black text-black">
                              {donut.personality} {donut.color}
                            </div>
                            <div className="text-[10px] text-black/60 font-bold">
                              @{donut.ownerName}
                            </div>
                          </div>
                        </div>
                      </div>
                      <span
                        className={`text-lg px-2 py-1 rounded-lg border-2 border-black font-black text-[10px] ${getLifecycleColor(
                          stage
                        )}`}
                      >
                        {getLifecycleEmoji(stage)} {stage.toUpperCase()}
                      </span>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-2 text-center bg-gray-100 p-2 rounded-lg border-2 border-black">
                      <div>
                        <div className="text-[9px] font-bold text-black/60">AGE</div>
                        <div className="text-xs font-black text-black">{donut.ageInDays}d</div>
                      </div>
                      <div>
                        <div className="text-[9px] font-bold text-black/60">EARNING</div>
                        <div className="text-xs font-black text-black">
                          {donut.dpsEarningRate}
                        </div>
                      </div>
                      <div>
                        <div className="text-[9px] font-bold text-black/60">HEALTH</div>
                        <div className="text-xs font-black text-black">{Math.round(donut.health)}%</div>
                      </div>
                    </div>

                    {/* Generation */}
                    <div className="text-[10px] text-black/70 font-bold">
                      👶 Generation {donut.generation}
                    </div>

                    {/* View Button */}
                    <Button
                      className="w-full bg-gradient-to-b from-cyan-400 to-cyan-500 border-3 border-black text-black text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
                      disabled={true}
                    >
                      👁️ VIEW DETAILS
                    </Button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white border-4 border-black rounded-xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex-1 flex flex-col items-center justify-center">
              <div className="text-center space-y-3">
                <div className="text-4xl">🔍</div>
                <div className="text-sm font-black text-black">No Donuts Found</div>
                <p className="text-xs text-black/70 max-w-xs">
                  Try adjusting your search or filter to find active donuts
                </p>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-lime-300 border-4 border-black rounded-xl p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-[10px] font-black text-black text-center">
              💡 Coming soon: Earn +10 $DONUTAMAGOTCHI when exploring other donuts
            </div>
          </div>
        </div>
      </div>
      <NavBar />
    </main>
  );
}
