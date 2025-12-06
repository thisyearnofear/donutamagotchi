"use client";

import { useState } from "react";
import { NavBar } from "@/components/nav-bar";
import { Button } from "@/components/ui/button";
import { RetiredDonutCard } from "@/components/hall-of-fame/retired-donut-card";

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

interface Achievement {
  id: string;
  name: string;
  emoji: string;
  description: string;
  hint: string;
  unlocked: boolean;
  unlockedAt?: string;
  category: "gameplay" | "breeding" | "social" | "cosmetics";
}

interface LeaderboardEntry {
  rank: number;
  ownerName: string;
  ownerAddress: string;
  donutName: string;
  value: string | number;
  badge?: string;
  detail?: string;
}

export default function HallOfFamePage() {
  const [activeTab, setActiveTab] = useState<"retired" | "legendary" | "achievements" | "leaderboards">("retired");
  const [sortBy, setSortBy] = useState<"age" | "earnings" | "recent">("age");
  const [filterCategory, setFilterCategory] = useState<"all" | "gameplay" | "breeding" | "social" | "cosmetics">("all");
  const [leaderboardCategory, setLeaderboardCategory] = useState<"earnings" | "age" | "bloodline" | "achievements">("earnings");

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

  // Achievement data
  const achievements: Achievement[] = [
    { id: "first_donut", name: "First Donut", emoji: "🍩", description: "Mint your first donut", hint: "Start your Donutamagotchi journey", unlocked: true, unlockedAt: "2024-11-20", category: "gameplay" },
    { id: "newborn", name: "Newborn", emoji: "🥚", description: "Reach Day 0 (obvious)", hint: "Just mint a donut!", unlocked: true, unlockedAt: "2024-11-20", category: "gameplay" },
    { id: "growth_spurt", name: "Growth Spurt", emoji: "🌱", description: "Reach Growth phase (Day 1-30)", hint: "Keep feeding your donut", unlocked: true, unlockedAt: "2024-11-25", category: "gameplay" },
    { id: "prime_time", name: "Prime Time", emoji: "⭐", description: "Reach Prime phase (Day 30+)", hint: "Your donut is fully mature!", unlocked: true, unlockedAt: "2024-12-01", category: "gameplay" },
    { id: "twilight", name: "Twilight Years", emoji: "🌙", description: "Reach Twilight phase (Day 90+)", hint: "Your donut is reaching elder status", unlocked: false, category: "gameplay" },
    { id: "legendary", name: "Legendary", emoji: "⭐⭐⭐", description: "Keep a donut alive for 100+ days", hint: "Be consistent in your care!", unlocked: false, category: "gameplay" },
    { id: "first_breed", name: "First Breeder", emoji: "💕", description: "Successfully breed your first offspring", hint: "Find a breeding partner and spend 1000 tokens", unlocked: false, category: "breeding" },
    { id: "family_builder", name: "Family Builder", emoji: "👨‍👩‍👧‍👦", description: "Produce 5 offspring", hint: "Keep breeding!", unlocked: false, category: "breeding" },
    { id: "dynasty", name: "Dynasty", emoji: "👑", description: "Create a family tree with 10+ members", hint: "Multi-generational breeding", unlocked: false, category: "breeding" },
    { id: "gen_master", name: "Generation Master", emoji: "📚", description: "Create a donut of Generation 4+", hint: "Keep breeding across generations", unlocked: false, category: "breeding" },
    { id: "social_butterfly", name: "Social Butterfly", emoji: "🦋", description: "Visit 50 different donuts", hint: "Explore the Donut Explorer!", unlocked: false, category: "social" },
    { id: "hall_of_famer", name: "Hall of Famer", emoji: "🏛️", description: "Retire a donut to the sanctuary", hint: "Keep a donut for 90+ days and retire it", unlocked: false, category: "social" },
    { id: "popular", name: "Popular", emoji: "😍", description: "Have 100+ views on your donut profile", hint: "Make your donut cool!", unlocked: false, category: "social" },
    { id: "community_star", name: "Community Star", emoji: "⭐", description: "Rank in top 100 of any leaderboard", hint: "Be the best in your category", unlocked: false, category: "social" },
    { id: "fashionista", name: "Fashionista", emoji: "👗", description: "Own 10 cosmetics", hint: "Shop for accessories!", unlocked: false, category: "cosmetics" },
    { id: "cosmetics_collector", name: "Collector's Edition", emoji: "🎨", description: "Own 25 unique cosmetics", hint: "Full wardrobe!", unlocked: false, category: "cosmetics" },
    { id: "rare_trait", name: "Rare Trait", emoji: "💎", description: "Own a donut with ultra-rare coloring (1 in 1000)", hint: "Lucky breeding!", unlocked: false, category: "cosmetics" },
  ];

  const filteredAchievements = achievements.filter(a => filterCategory === "all" || a.category === filterCategory);
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const progressPercent = Math.round((unlockedCount / totalCount) * 100);

  // Leaderboard data
  const earningsLeaderboard: LeaderboardEntry[] = [
    { rank: 1, ownerName: "King Glazer Pro", ownerAddress: "0x1234...5678", donutName: "Alpha Prime", value: "4,250 $DONUT", badge: "🥇", detail: "45 days old" },
    { rank: 2, ownerName: "Donut Whale", ownerAddress: "0x2345...6789", donutName: "Blue Moon", value: "3,890 $DONUT", badge: "🥈", detail: "38 days old" },
    { rank: 3, ownerName: "Sugar Rush", ownerAddress: "0x3456...7890", donutName: "Glazed Rebel", value: "3,120 $DONUT", badge: "🥉", detail: "32 days old" },
    { rank: 4, ownerName: "Sweet Tooth", ownerAddress: "0x4567...8901", donutName: "Pink Princess", value: "2,950 $DONUT", detail: "28 days old" },
    { rank: 5, ownerName: "Daily Grinder", ownerAddress: "0x5678...9012", donutName: "Golden Crust", value: "2,340 $DONUT", detail: "21 days old" },
  ];

  const ageLeaderboard: LeaderboardEntry[] = [
    { rank: 1, ownerName: "OG Enthusiast", ownerAddress: "0x1111...1111", donutName: "Ancient One", value: "156 days", badge: "⭐", detail: "4,890 $DONUT earned" },
    { rank: 2, ownerName: "Long Timer", ownerAddress: "0x2222...2222", donutName: "Survivor", value: "142 days", badge: "🌟", detail: "4,120 $DONUT earned" },
    { rank: 3, ownerName: "Steady Eddie", ownerAddress: "0x3333...3333", donutName: "Veteran", value: "128 days", detail: "3,890 $DONUT earned" },
    { rank: 4, ownerName: "Patient Player", ownerAddress: "0x4444...4444", donutName: "Persister", value: "115 days", detail: "3,450 $DONUT earned" },
    { rank: 5, ownerName: "Committed Caretaker", ownerAddress: "0x5555...5555", donutName: "Faithful", value: "103 days", detail: "2,980 $DONUT earned" },
  ];

  const bloodlineLeaderboard: LeaderboardEntry[] = [
    { rank: 1, ownerName: "Breeding Master", ownerAddress: "0x6666...6666", donutName: "Dynasty", value: "12 offspring", badge: "👑", detail: "Gen 4, 5 legendary ancestors" },
    { rank: 2, ownerName: "Family Builder", ownerAddress: "0x7777...7777", donutName: "Lineage", value: "9 offspring", badge: "🌳", detail: "Gen 3, 3 legendary ancestors" },
    { rank: 3, ownerName: "Genetic Expert", ownerAddress: "0x8888...8888", donutName: "Heritage", value: "8 offspring", detail: "Gen 3, 2 legendary ancestors" },
    { rank: 4, ownerName: "Breeding Enthusiast", ownerAddress: "0x9999...9999", donutName: "Bloodline", value: "6 offspring", detail: "Gen 2, 1 legendary ancestor" },
    { rank: 5, ownerName: "New Breeder", ownerAddress: "0xaaaa...aaaa", donutName: "Legacy", value: "4 offspring", detail: "Gen 2, First generation breeder" },
  ];

  const achievementsLeaderboard: LeaderboardEntry[] = [
    { rank: 1, ownerName: "Completionist", ownerAddress: "0xbbbb...bbbb", donutName: "Champion", value: "18 badges", badge: "🏅", detail: "All major achievements unlocked" },
    { rank: 2, ownerName: "Hall of Fame Star", ownerAddress: "0xcccc...cccc", donutName: "Legend", value: "15 badges", detail: "3 retired donuts + 2 legendary" },
    { rank: 3, ownerName: "Social Butterfly", ownerAddress: "0xdddd...dddd", donutName: "Popular", value: "12 badges", detail: "100+ pet visits, 50+ interactions" },
    { rank: 4, ownerName: "Cosmetics Collector", ownerAddress: "0xeeee...eeee", donutName: "Fashionista", value: "10 badges", detail: "25+ cosmetics owned" },
    { rank: 5, ownerName: "Daily Grinder", ownerAddress: "0xffff...ffff", donutName: "Consistent", value: "8 badges", detail: "30-day login streak" },
  ];

  const getLeaderboard = () => {
    switch (leaderboardCategory) {
      case "earnings": return earningsLeaderboard;
      case "age": return ageLeaderboard;
      case "bloodline": return bloodlineLeaderboard;
      case "achievements": return achievementsLeaderboard;
      default: return earningsLeaderboard;
    }
  };

  const leaderboard = getLeaderboard();
  const leaderboardDescriptions = {
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
              👑 ACHIEVEMENTS
            </h1>
            <p className="text-center text-[10px] text-black/70 font-bold mt-1">
              LEGENDARY DONUTS, BADGES & RANKINGS
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="grid grid-cols-4 gap-1">
            <button
              onClick={() => setActiveTab("retired")}
              className={`py-2 px-1 rounded-lg border-3 border-black font-black text-[9px] transition-all flex flex-col items-center gap-0.5 ${activeTab === "retired"
                ? "bg-pink-400 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                : "bg-white text-black/60 hover:bg-gray-100"
                }`}
            >
              <span className="text-sm">🏤</span>
              <span>RETIRED</span>
            </button>
            <button
              onClick={() => setActiveTab("legendary")}
              className={`py-2 px-1 rounded-lg border-3 border-black font-black text-[9px] transition-all flex flex-col items-center gap-0.5 ${activeTab === "legendary"
                ? "bg-pink-400 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                : "bg-white text-black/60 hover:bg-gray-100"
                }`}
            >
              <span className="text-sm">⭐</span>
              <span>LEGENDARY</span>
            </button>
            <button
              onClick={() => setActiveTab("achievements")}
              className={`py-2 px-1 rounded-lg border-3 border-black font-black text-[9px] transition-all flex flex-col items-center gap-0.5 ${activeTab === "achievements"
                ? "bg-pink-400 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                : "bg-white text-black/60 hover:bg-gray-100"
                }`}
            >
              <span className="text-sm">🏅</span>
              <span>BADGES</span>
            </button>
            <button
              onClick={() => setActiveTab("leaderboards")}
              className={`py-2 px-1 rounded-lg border-3 border-black font-black text-[9px] transition-all flex flex-col items-center gap-0.5 ${activeTab === "leaderboards"
                ? "bg-pink-400 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                : "bg-white text-black/60 hover:bg-gray-100"
                }`}
            >
              <span className="text-sm">🏆</span>
              <span>RANKS</span>
            </button>
          </div>

          {/* Content: Hall of Fame Tabs */}
          {(activeTab === "retired" || activeTab === "legendary") && (
            <>
              {/* Sort Options */}
              <div className="grid grid-cols-3 gap-2">
                <button onClick={() => setSortBy("age")} className={`py-2 px-2 rounded-lg border-3 border-black font-black text-[10px] transition-all ${sortBy === "age" ? "bg-purple-400 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" : "bg-white text-black/60 hover:bg-gray-100"}`}>AGE</button>
                <button onClick={() => setSortBy("earnings")} className={`py-2 px-2 rounded-lg border-3 border-black font-black text-[10px] transition-all ${sortBy === "earnings" ? "bg-purple-400 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" : "bg-white text-black/60 hover:bg-gray-100"}`}>💰</button>
                <button onClick={() => setSortBy("recent")} className={`py-2 px-2 rounded-lg border-3 border-black font-black text-[10px] transition-all ${sortBy === "recent" ? "bg-purple-400 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" : "bg-white text-black/60 hover:bg-gray-100"}`}>📅</button>
              </div>

              {/* Donuts List */}
              {sortedDonuts.length > 0 ? (
                <div className="space-y-2 flex-1 overflow-y-auto">
                  {sortedDonuts.map((donut) => (
                    <RetiredDonutCard key={donut.id} donut={donut} />
                  ))}
                </div>
              ) : (
                <div className="bg-white border-4 border-black rounded-xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex-1 flex flex-col items-center justify-center">
                  <div className="text-center space-y-3">
                    <div className="text-4xl">{activeTab === "retired" ? "🏤" : "⭐"}</div>
                    <div className="text-sm font-black text-black">No Legends Yet</div>
                    <p className="text-xs text-black/70 max-w-xs">{activeTab === "retired" ? "When donuts reach 90+ days and are retired, they'll appear here." : "Legendary survivors who reach 100+ days will be immortalized here."}</p>
                  </div>
                </div>
              )}

              <div className="bg-lime-300 border-4 border-black rounded-xl p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-[10px] font-black text-black text-center">🔮 Reach 90 days to unlock retirement • 100+ days for legendary status</div>
              </div>
            </>
          )}

          {/* Content: Achievements Tab */}
          {activeTab === "achievements" && (
            <>
              <div className="bg-white border-4 border-black rounded-xl p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-black text-black">PROGRESS</div>
                  <div className="text-xs font-black text-black">{unlockedCount}/{totalCount}</div>
                </div>
                <div className="w-full bg-gray-300 border-3 border-black rounded-full h-4">
                  <div className="h-full bg-gradient-to-r from-pink-400 to-purple-400 border-3 border-black rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
                </div>
                <div className="text-[10px] text-black/60 font-bold">{progressPercent}% Complete</div>
              </div>

              <div className="grid grid-cols-5 gap-1">
                {[{ id: "all", label: "ALL", emoji: "🏆" }, { id: "gameplay", label: "GAMEPLAY", emoji: "🎮" }, { id: "breeding", label: "BREEDING", emoji: "💕" }, { id: "social", label: "SOCIAL", emoji: "👥" }, { id: "cosmetics", label: "COSMETICS", emoji: "🎨" }].map((cat) => (
                  <button key={cat.id} onClick={() => setFilterCategory(cat.id as any)} className={`py-2 px-1 rounded-lg border-3 border-black font-black text-[9px] transition-all flex flex-col items-center gap-1 ${filterCategory === cat.id ? "bg-pink-400 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" : "bg-white text-black/60 hover:bg-gray-100"}`}>
                    <span className="text-lg">{cat.emoji}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2 flex-1 overflow-y-auto">
                {filteredAchievements.map((achievement) => (
                  <div key={achievement.id} className={`border-4 ${achievement.unlocked ? "border-black" : "border-gray-400"} rounded-xl p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-1 flex flex-col ${achievement.unlocked ? "bg-yellow-200" : "bg-gray-200 opacity-60"}`}>
                    <div className="text-3xl text-center">{achievement.emoji}</div>
                    <div className="text-xs font-black text-center text-black line-clamp-2">{achievement.name}</div>
                    <div className="text-[8px] text-black/60 text-center">{achievement.description}</div>
                    {achievement.unlocked ? (
                      <div className="bg-green-400 border-2 border-black rounded-lg py-0.5 text-center font-black text-[9px] text-black">✅ UNLOCKED</div>
                    ) : (
                      <div className="bg-gray-400 border-2 border-black rounded-lg py-0.5 text-center font-black text-[9px] text-black">🔒 LOCKED</div>
                    )}
                    {!achievement.unlocked && <div className="text-[8px] text-black/50 italic text-center">{achievement.hint}</div>}
                  </div>
                ))}
              </div>

              <div className="bg-lime-300 border-4 border-black rounded-xl p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-[10px] font-black text-black text-center space-y-1">
                  <div>🎯 Unlock achievements to earn prestige badges</div>
                  <div>🏆 Share your badges to flex your accomplishments</div>
                </div>
              </div>
            </>
          )}

          {/* Content: Leaderboards Tab */}
          {activeTab === "leaderboards" && (
            <>
              <div className="grid grid-cols-2 gap-1.5">
                <button onClick={() => setLeaderboardCategory("earnings")} className={`py-2 px-2 rounded-lg border-3 border-black font-black text-[10px] transition-all ${leaderboardCategory === "earnings" ? "bg-pink-400 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" : "bg-white text-black/60 hover:bg-gray-100"}`}>💰 EARNINGS</button>
                <button onClick={() => setLeaderboardCategory("age")} className={`py-2 px-2 rounded-lg border-3 border-black font-black text-[10px] transition-all ${leaderboardCategory === "age" ? "bg-pink-400 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" : "bg-white text-black/60 hover:bg-gray-100"}`}>📅 AGE</button>
                <button onClick={() => setLeaderboardCategory("bloodline")} className={`py-2 px-2 rounded-lg border-3 border-black font-black text-[10px] transition-all ${leaderboardCategory === "bloodline" ? "bg-pink-400 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" : "bg-white text-black/60 hover:bg-gray-100"}`}>🌳 BLOODLINE</button>
                <button onClick={() => setLeaderboardCategory("achievements")} className={`py-2 px-2 rounded-lg border-3 border-black font-black text-[10px] transition-all ${leaderboardCategory === "achievements" ? "bg-pink-400 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" : "bg-white text-black/60 hover:bg-gray-100"}`}>🏅 BADGES</button>
              </div>

              <div className="space-y-2 flex-1 overflow-y-auto">
                {leaderboard.map((entry) => (
                  <div key={entry.rank} className={`border-4 border-black rounded-xl p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-2 ${entry.rank === 1 ? "bg-yellow-200" : entry.rank === 2 ? "bg-gray-200" : entry.rank === 3 ? "bg-orange-200" : "bg-white"}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-lg font-black">{entry.badge || `#${entry.rank}`}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-black text-black truncate">{entry.donutName}</div>
                          <div className="text-[10px] text-black/60 font-bold truncate">@{entry.ownerName}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-black text-black">{entry.value}</div>
                        {entry.detail && <div className="text-[9px] text-black/60 font-bold">{entry.detail}</div>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-lime-300 border-4 border-black rounded-xl p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-[10px] font-black text-black text-center space-y-1">
                  <div>🎯 Rankings update every 30 minutes</div>
                  <div>👀 View leaderboards to earn +10 $DONUTAMAGOTCHI</div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <NavBar />
    </main>
  );
}
