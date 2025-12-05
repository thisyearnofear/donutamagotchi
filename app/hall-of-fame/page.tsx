"use client";

import { NavBar } from "@/components/nav-bar";

export default function HallOfFamePage() {
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

          {/* Placeholder Content */}
          <div className="bg-white border-4 border-black rounded-xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex-1 flex flex-col items-center justify-center">
            <div className="text-center space-y-3">
              <div className="text-4xl">🏆</div>
              <div className="text-sm font-black text-black">Coming Soon</div>
              <p className="text-xs text-black/70 max-w-xs">
                When donuts reach 90+ days and are retired, they'll appear here as immortal legends.
              </p>

              <div className="pt-4 space-y-2 text-left text-xs font-bold text-black/60">
                <div>✅ Retired donuts from sanctuary</div>
                <div>✅ Legendary survivors (100+ days)</div>
                <div>✅ Breeding achievements</div>
                <div>✅ Frozen stats & immortal badges</div>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-lime-300 border-4 border-black rounded-xl p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-[10px] font-black text-black text-center">
              Reach 90 days of age to unlock retirement & legacy features
            </div>
          </div>
        </div>
      </div>
      <NavBar />
    </main>
  );
}
