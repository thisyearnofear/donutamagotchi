"use client";

import { useState } from "react";
import { NavBar } from "@/components/nav-bar";

export default function DonutsPage() {
  const [searchQuery, setSearchQuery] = useState("");

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
              placeholder="Search by owner or FID..."
              className="w-full bg-transparent text-black placeholder-black/40 text-xs font-bold focus:outline-none"
            />
          </div>

          {/* Filter Options */}
          <div className="grid grid-cols-3 gap-2">
            <button className="bg-blue-400 border-3 border-black rounded-lg p-2 text-xs font-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              All
            </button>
            <button className="bg-green-400 border-3 border-black rounded-lg p-2 text-xs font-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              Prime
            </button>
            <button className="bg-purple-400 border-3 border-black rounded-lg p-2 text-xs font-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              Traits
            </button>
          </div>

          {/* Placeholder Content */}
          <div className="bg-white border-4 border-black rounded-xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex-1 flex flex-col items-center justify-center">
            <div className="text-center space-y-3">
              <div className="text-4xl">🔍</div>
              <div className="text-sm font-black text-black">Coming Soon</div>
              <p className="text-xs text-black/70 max-w-xs">
                Global donut explorer with live stats, filtering, and social discovery features coming in Phase 3.
              </p>

              <div className="pt-4 space-y-2 text-left text-xs font-bold text-black/60">
                <div>✅ Browse all active miners</div>
                <div>✅ Filter by lifecycle stage</div>
                <div>✅ Sort by earnings, traits, age</div>
                <div>✅ View detailed pet profiles</div>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-lime-300 border-4 border-black rounded-xl p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-[10px] font-black text-black text-center">
              Earn +10 $DONUTAMAGOTCHI when exploring other donuts
            </div>
          </div>
        </div>
      </div>
      <NavBar />
    </main>
  );
}
