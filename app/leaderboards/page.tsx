"use client";

import { useState, useMemo } from "react";
import { NavBar } from "@/components/nav-bar";

interface LeaderboardEntry {
  rank: number;
  ownerName: string;
  ownerAddress: string;
  donutName: string;
  value: string | number;
  badge?: string;
  detail?: string;
}

export default function LeaderboardsPage() {
  const [activeCategory, setActiveCategory] = useState<
    "earnings" | "age" | "bloodline" | "achievements"
  >("earnings");

  // Mock data - will be replaced with subgraph queries
  const earningsLeaderboard: LeaderboardEntry[] = [
    {
      rank: 1,
      ownerName: "King Glazer Pro",
      ownerAddress: "0x1234...5678",
      donutName: "Alpha Prime",
      value: "4,250 $DONUT",
      badge: "🥇",
      detail: "45 days old",
    },
    {
      rank: 2,
      ownerName: "Donut Whale",
      ownerAddress: "0x2345...6789",
      donutName: "Blue Moon",
      value: "3,890 $DONUT",
      badge: "🥈",
      detail: "38 days old",
    },
    {
      rank: 3,
      ownerName: "Sugar Rush",
      ownerAddress: "0x3456...7890",
      donutName: "Glazed Rebel",
      value: "3,120 $DONUT",
      badge: "🥉",
      detail: "32 days old",
    },
    {
      rank: 4,
      ownerName: "Sweet Tooth",
      ownerAddress: "0x4567...8901",
      donutName: "Pink Princess",
      value: "2,950 $DONUT",
      detail: "28 days old",
    },
    {
      rank: 5,
      ownerName: "Daily Grinder",
      ownerAddress: "0x5678...9012",
      donutName: "Golden Crust",
      value: "2,340 $DONUT",
      detail: "21 days old",
    },
  ];

  const ageLeaderboard: LeaderboardEntry[] = [
    {
      rank: 1,
      ownerName: "OG Enthusiast",
      ownerAddress: "0x1111...1111",
      donutName: "Ancient One",
      value: "156 days",
      badge: "⭐",
      detail: "4,890 $DONUT earned",
    },
    {
      rank: 2,
      ownerName: "Long Timer",
      ownerAddress: "0x2222...2222",
      donutName: "Survivor",
      value: "142 days",
      badge: "🌟",
      detail: "4,120 $DONUT earned",
    },
    {
      rank: 3,
      ownerName: "Steady Eddie",
      ownerAddress: "0x3333...3333",
      donutName: "Veteran",
      value: "128 days",
      detail: "3,890 $DONUT earned",
    },
    {
      rank: 4,
      ownerName: "Patient Player",
      ownerAddress: "0x4444...4444",
      donutName: "Persister",
      value: "115 days",
      detail: "3,450 $DONUT earned",
    },
    {
      rank: 5,
      ownerName: "Committed Caretaker",
      ownerAddress: "0x5555...5555",
      donutName: "Faithful",
      value: "103 days",
      detail: "2,980 $DONUT earned",
    },
  ];

  const bloodlineLeaderboard: LeaderboardEntry[] = [
    {
      rank: 1,
      ownerName: "Breeding Master",
      ownerAddress: "0x6666...6666",
      donutName: "Dynasty",
      value: "12 offspring",
      badge: "👑",
      detail: "Gen 4, 5 legendary ancestors",
    },
    {
      rank: 2,
      ownerName: "Family Builder",
      ownerAddress: "0x7777...7777",
      donutName: "Lineage",
      value: "9 offspring",
      badge: "🌳",
      detail: "Gen 3, 3 legendary ancestors",
    },
    {
      rank: 3,
      ownerName: "Genetic Expert",
      ownerAddress: "0x8888...8888",
      donutName: "Heritage",
      value: "8 offspring",
      detail: "Gen 3, 2 legendary ancestors",
    },
    {
      rank: 4,
      ownerName: "Breeding Enthusiast",
      ownerAddress: "0x9999...9999",
      donutName: "Bloodline",
      value: "6 offspring",
      detail: "Gen 2, 1 legendary ancestor",
    },
    {
      rank: 5,
      ownerName: "New Breeder",
      ownerAddress: "0xaaaa...aaaa",
      donutName: "Legacy",
      value: "4 offspring",
      detail: "Gen 2, First generation breeder",
    },
  ];

  const achievementsLeaderboard: LeaderboardEntry[] = [
    {
      rank: 1,
      ownerName: "Completionist",
      ownerAddress: "0xbbbb...bbbb",
      donutName: "Champion",
      value: "18 badges",
      badge: "🏅",
      detail: "All major achievements unlocked",
    },
    {
      rank: 2,
      ownerName: "Hall of Fame Star",
      ownerAddress: "0xcccc...cccc",
      donutName: "Legend",
      value: "15 badges",
      detail: "3 retired donuts + 2 legendary",
    },
    {
      rank: 3,
      ownerName: "Social Butterfly",
      ownerAddress: "0xdddd...dddd",
      donutName: "Popular",
      value: "12 badges",
      detail: "100+ pet visits, 50+ interactions",
    },
    {
      rank: 4,
      ownerName: "Cosmetics Collector",
      ownerAddress: "0xeeee...eeee",
      donutName: "Fashionista",
      value: "10 badges",
      detail: "25+ cosmetics owned",
    },
    {
      rank: 5,
      ownerName: "Daily Grinder",
      ownerAddress: "0xffff...ffff",
      donutName: "Consistent",
      value: "8 badges",
      detail: "30-day login streak",
    },
  ];

  const getLeaderboard = () => {
    switch (activeCategory) {
      case "earnings":
        return earningsLeaderboard;
      case "age":
        return ageLeaderboard;
      case "bloodline":
        return bloodlineLeaderboard;
      case "achievements":
        return achievementsLeaderboard;
      default:
        return earningsLeaderboard;
    }
  };

  const leaderboard = getLeaderboard();
  const categoryDescriptions = {
    earnings: "Lifetime $DONUT earned this week",
    age: "Days alive (most experienced donuts)",
    bloodline: "Largest family trees & generations",
    achievements: "Total achievement badges unlocked",
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
              🏆 LEADERBOARDS
            </h1>
            <p className="text-center text-[10px] text-black/70 font-bold mt-1">
              {categoryDescriptions[activeCategory]}
            </p>
          </div>

          {/* Category Tabs */}
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => setActiveCategory("earnings")}
              className={`py-2 px-2 rounded-lg border-3 border-black font-black text-[10px] transition-all ${
                activeCategory === "earnings"
                  ? "bg-pink-400 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  : "bg-white text-black/60 hover:bg-gray-100"
              }`}
            >
              💰 EARNINGS
            </button>
            <button
              onClick={() => setActiveCategory("age")}
              className={`py-2 px-2 rounded-lg border-3 border-black font-black text-[10px] transition-all ${
                activeCategory === "age"
                  ? "bg-pink-400 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  : "bg-white text-black/60 hover:bg-gray-100"
              }`}
            >
              📅 AGE
            </button>
            <button
              onClick={() => setActiveCategory("bloodline")}
              className={`py-2 px-2 rounded-lg border-3 border-black font-black text-[10px] transition-all ${
                activeCategory === "bloodline"
                  ? "bg-pink-400 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  : "bg-white text-black/60 hover:bg-gray-100"
              }`}
            >
              🌳 BLOODLINE
            </button>
            <button
              onClick={() => setActiveCategory("achievements")}
              className={`py-2 px-2 rounded-lg border-3 border-black font-black text-[10px] transition-all ${
                activeCategory === "achievements"
                  ? "bg-pink-400 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  : "bg-white text-black/60 hover:bg-gray-100"
              }`}
            >
              🏅 BADGES
            </button>
          </div>

          {/* Leaderboard Entries */}
          <div className="space-y-2 flex-1 overflow-y-auto">
            {leaderboard.map((entry) => (
              <div
                key={entry.rank}
                className={`border-4 border-black rounded-xl p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-2 ${
                  entry.rank === 1
                    ? "bg-yellow-200"
                    : entry.rank === 2
                      ? "bg-gray-200"
                      : entry.rank === 3
                        ? "bg-orange-200"
                        : "bg-white"
                }`}
              >
                {/* Rank and Name */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-lg font-black">
                      {entry.badge || `#${entry.rank}`}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-black text-black truncate">
                        {entry.donutName}
                      </div>
                      <div className="text-[10px] text-black/60 font-bold truncate">
                        @{entry.ownerName}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-black text-black">{entry.value}</div>
                    {entry.detail && (
                      <div className="text-[9px] text-black/60 font-bold">{entry.detail}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Info Box */}
          <div className="bg-lime-300 border-4 border-black rounded-xl p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-[10px] font-black text-black text-center space-y-1">
              <div>🎯 Rankings update every 30 minutes</div>
              <div>👀 View leaderboards to earn +10 $DONUTAMAGOTCHI</div>
            </div>
          </div>
        </div>
      </div>
      <NavBar />
    </main>
  );
}
