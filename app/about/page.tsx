"use client";

import { useEffect, useRef, useState } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import { NavBar } from "@/components/nav-bar";
import { AddToFarcasterButton } from "@/components/add-to-farcaster-button";
import { DuneDashboardButton } from "@/components/dune-dashboard-button";

type MiniAppContext = {
  user?: {
    fid: number;
    username?: string;
    displayName?: string;
    pfpUrl?: string;
  };
};

type Tab = "basics" | "money" | "strategy";

export default function AboutPage() {
  const readyRef = useRef(false);
  const [context, setContext] = useState<MiniAppContext | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("basics");

  useEffect(() => {
    let cancelled = false;
    const hydrateContext = async () => {
      try {
        const ctx = (await (sdk as unknown as {
          context: Promise<MiniAppContext> | MiniAppContext;
        }).context) as MiniAppContext;
        if (!cancelled) {
          setContext(ctx);
        }
      } catch {
        if (!cancelled) setContext(null);
      }
    };
    hydrateContext();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!readyRef.current) {
        readyRef.current = true;
        sdk.actions.ready().catch(() => {});
      }
    }, 1200);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <main className="flex h-screen w-screen justify-center overflow-hidden bg-gradient-to-b from-purple-900 via-pink-900 to-orange-900 font-mono text-white">
      <div
        className="relative flex h-full w-full max-w-[520px] flex-1 flex-col overflow-hidden px-4 pb-4"
        style={{
          paddingTop: "calc(env(safe-area-inset-top, 0px) + 16px)",
          paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 80px)",
        }}
      >
        <div className="flex flex-1 flex-col overflow-hidden space-y-3">
          <div className="bg-yellow-300 border-4 border-black rounded-2xl p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h1 className="text-3xl font-black text-center text-black tracking-tight">
              HOW TO PLAY
            </h1>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <AddToFarcasterButton variant="default" />
            <DuneDashboardButton variant="default" />
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2">
            <TabButton
              active={activeTab === "basics"}
              onClick={() => setActiveTab("basics")}
              emoji="🎮"
              label="BASICS"
            />
            <TabButton
              active={activeTab === "money"}
              onClick={() => setActiveTab("money")}
              emoji="💰"
              label="MONEY"
            />
            <TabButton
              active={activeTab === "strategy"}
              onClick={() => setActiveTab("strategy")}
              emoji="🧠"
              label="TIPS"
            />
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === "basics" && (
              <div className="space-y-3">
                <InfoCard emoji="🍩" title="WHAT IS THIS?">
                  <p className="text-center">Virtual pet game where you care for a donut by feeding it with ETH!</p>
                </InfoCard>

                <InfoCard emoji="🎯" title="HOW IT WORKS">
                  <ul className="text-center space-y-1">
                    <li>• ONE owner at a time</li>
                    <li>• Feed with ETH to own</li>
                    <li>• Price doubles after feed</li>
                    <li>• Decays to 0 in 1 hour</li>
                    <li>• Earn DONUT while owning</li>
                  </ul>
                </InfoCard>

                <InfoCard emoji="📊" title="PET STATS">
                  <ul className="text-center space-y-1">
                    <li><strong>Health:</strong> Time until decay</li>
                    <li><strong>Happy:</strong> Earning rate</li>
                    <li><strong>Energy:</strong> Donuts earned</li>
                    <li><strong>Age:</strong> Time as owner</li>
                  </ul>
                </InfoCard>

                <InfoCard emoji="🎨" title="PET MOODS">
                  <div className="text-center space-y-1">
                    <div>😊 Happy • 🤩 Excited</div>
                    <div>😟 Hungry • 😴 Sleeping</div>
                    <div>💀 Dead</div>
                  </div>
                </InfoCard>
              </div>
            )}

            {activeTab === "money" && (
              <div className="space-y-3">
                <InfoCard emoji="💸" title="REVENUE SPLIT">
                  <ul className="text-center space-y-1">
                    <li>• 80% → Previous owner</li>
                    <li>• 15% → Treasury (buyback)</li>
                    <li>• 5% → App provider</li>
                  </ul>
                </InfoCard>

                <InfoCard emoji="✨" title="DONUT TOKENS">
                  <ul className="text-center space-y-1">
                    <li>• Starts at 4 DONUT/sec</li>
                    <li>• Halves every 30 days</li>
                    <li>• Min 0.01 DONUT/sec forever</li>
                    <li>• Earn while you own pet</li>
                  </ul>
                </InfoCard>

                <InfoCard emoji="🔥" title="SHOP (BUYBACK)">
                  <ul className="text-center space-y-1">
                    <li>• Burns LP tokens</li>
                    <li>• Reduces supply</li>
                    <li>• Increases DONUT value</li>
                    <li>• Treasury funded by feeds</li>
                  </ul>
                </InfoCard>
              </div>
            )}

            {activeTab === "strategy" && (
              <div className="space-y-3">
                <InfoCard emoji="💡" title="WINNING TIPS">
                  <ul className="text-center space-y-1">
                    <li>• Buy when price is low</li>
                    <li>• Hold to earn DONUTs</li>
                    <li>• Profit when next person buys</li>
                    <li>• Watch the decay timer!</li>
                  </ul>
                </InfoCard>

                <InfoCard emoji="⚡" title="QUICK MATH">
                  <p className="text-center">
                    You pay X ETH<br/>
                    Next person pays 2X ETH<br/>
                    You get 80% of 2X = 1.6X<br/>
                    <strong className="text-green-400">Profit: 0.6X ETH + DONUTs!</strong>
                  </p>
                </InfoCard>

                <InfoCard emoji="⚠️" title="RISKS">
                  <ul className="text-center space-y-1">
                    <li>• Price decays over time</li>
                    <li>• May not sell if too high</li>
                    <li>• Competition is fierce</li>
                    <li>• Time your entry!</li>
                  </ul>
                </InfoCard>

                <InfoCard emoji="🎯" title="PRO MOVES">
                  <ul className="text-center space-y-1">
                    <li>• Feed during high activity</li>
                    <li>• Monitor decay closely</li>
                    <li>• Accumulate DONUTs</li>
                    <li>• Use Shop for LP burns</li>
                  </ul>
                </InfoCard>
              </div>
            )}
          </div>
        </div>
      </div>
      <NavBar />
    </main>
  );
}

function TabButton({ 
  active, 
  onClick, 
  emoji, 
  label 
}: { 
  active: boolean; 
  onClick: () => void; 
  emoji: string; 
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-2 px-3 rounded-xl border-4 border-black font-black text-xs transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
        active
          ? "bg-pink-400 text-black"
          : "bg-white text-black/60 hover:bg-gray-100"
      }`}
    >
      <div className="text-lg">{emoji}</div>
      <div>{label}</div>
    </button>
  );
}

function InfoCard({ 
  emoji, 
  title, 
  children 
}: { 
  emoji: string; 
  title: string; 
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border-4 border-black rounded-xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <div className="flex flex-col items-center gap-2 mb-3">
        <span className="text-3xl">{emoji}</span>
        <h2 className="text-sm font-black text-black">{title}</h2>
      </div>
      <div className="text-xs text-black/80 font-bold">
        {children}
      </div>
    </div>
  );
}
