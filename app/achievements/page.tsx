"use client";

import { useState } from "react";
import { NavBar } from "@/components/nav-bar";

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

export default function AchievementsPage() {
  const [filterCategory, setFilterCategory] = useState<"all" | "gameplay" | "breeding" | "social" | "cosmetics">("all");

  // Mock data - will be replaced with actual achievement tracking
  const achievements: Achievement[] = [
    // Gameplay achievements
    {
      id: "first_donut",
      name: "First Donut",
      emoji: "🍩",
      description: "Mint your first donut",
      hint: "Start your Donutamagotchi journey",
      unlocked: true,
      unlockedAt: "2024-11-20",
      category: "gameplay",
    },
    {
      id: "newborn",
      name: "Newborn",
      emoji: "🥚",
      description: "Reach Day 0 (obvious)",
      hint: "Just mint a donut!",
      unlocked: true,
      unlockedAt: "2024-11-20",
      category: "gameplay",
    },
    {
      id: "growth_spurt",
      name: "Growth Spurt",
      emoji: "🌱",
      description: "Reach Growth phase (Day 1-30)",
      hint: "Keep feeding your donut",
      unlocked: true,
      unlockedAt: "2024-11-25",
      category: "gameplay",
    },
    {
      id: "prime_time",
      name: "Prime Time",
      emoji: "⭐",
      description: "Reach Prime phase (Day 30+)",
      hint: "Your donut is fully mature!",
      unlocked: true,
      unlockedAt: "2024-12-01",
      category: "gameplay",
    },
    {
      id: "twilight",
      name: "Twilight Years",
      emoji: "🌙",
      description: "Reach Twilight phase (Day 90+)",
      hint: "Your donut is reaching elder status",
      unlocked: false,
      category: "gameplay",
    },
    {
      id: "legendary",
      name: "Legendary",
      emoji: "⭐⭐⭐",
      description: "Keep a donut alive for 100+ days",
      hint: "Be consistent in your care!",
      unlocked: false,
      category: "gameplay",
    },

    // Breeding achievements
    {
      id: "first_breed",
      name: "First Breeder",
      emoji: "💕",
      description: "Successfully breed your first offspring",
      hint: "Find a breeding partner and spend 1000 tokens",
      unlocked: false,
      category: "breeding",
    },
    {
      id: "family_builder",
      name: "Family Builder",
      emoji: "👨‍👩‍👧‍👦",
      description: "Produce 5 offspring",
      hint: "Keep breeding!",
      unlocked: false,
      category: "breeding",
    },
    {
      id: "dynasty",
      name: "Dynasty",
      emoji: "👑",
      description: "Create a family tree with 10+ members",
      hint: "Multi-generational breeding",
      unlocked: false,
      category: "breeding",
    },
    {
      id: "gen_master",
      name: "Generation Master",
      emoji: "📚",
      description: "Create a donut of Generation 4+",
      hint: "Keep breeding across generations",
      unlocked: false,
      category: "breeding",
    },

    // Social achievements
    {
      id: "social_butterfly",
      name: "Social Butterfly",
      emoji: "🦋",
      description: "Visit 50 different donuts",
      hint: "Explore the Donut Explorer!",
      unlocked: false,
      category: "social",
    },
    {
      id: "hall_of_famer",
      name: "Hall of Famer",
      emoji: "🏛️",
      description: "Retire a donut to the sanctuary",
      hint: "Keep a donut for 90+ days and retire it",
      unlocked: false,
      category: "social",
    },
    {
      id: "popular",
      name: "Popular",
      emoji: "😍",
      description: "Have 100+ views on your donut profile",
      hint: "Make your donut cool!",
      unlocked: false,
      category: "social",
    },
    {
      id: "community_star",
      name: "Community Star",
      emoji: "⭐",
      description: "Rank in top 100 of any leaderboard",
      hint: "Be the best in your category",
      unlocked: false,
      category: "social",
    },

    // Cosmetics achievements
    {
      id: "fashionista",
      name: "Fashionista",
      emoji: "👗",
      description: "Own 10 cosmetics",
      hint: "Shop for accessories!",
      unlocked: false,
      category: "cosmetics",
    },
    {
      id: "cosmetics_collector",
      name: "Collector's Edition",
      emoji: "🎨",
      description: "Own 25 unique cosmetics",
      hint: "Full wardrobe!",
      unlocked: false,
      category: "cosmetics",
    },
    {
      id: "rare_trait",
      name: "Rare Trait",
      emoji: "💎",
      description: "Own a donut with ultra-rare coloring (1 in 1000)",
      hint: "Lucky breeding!",
      unlocked: false,
      category: "cosmetics",
    },
  ];

  const filteredAchievements = achievements.filter(
    (a) => filterCategory === "all" || a.category === filterCategory
  );

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;
  const progressPercent = Math.round((unlockedCount / totalCount) * 100);

  const categories = [
    { id: "all" as const, label: "ALL", emoji: "🏆" },
    { id: "gameplay" as const, label: "GAMEPLAY", emoji: "🎮" },
    { id: "breeding" as const, label: "BREEDING", emoji: "💕" },
    { id: "social" as const, label: "SOCIAL", emoji: "👥" },
    { id: "cosmetics" as const, label: "COSMETICS", emoji: "🎨" },
  ];

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
              🏅 ACHIEVEMENTS
            </h1>
            <p className="text-center text-[10px] text-black/70 font-bold mt-1">
              UNLOCK BADGES & PRESTIGE
            </p>
          </div>

          {/* Progress Bar */}
          <div className="bg-white border-4 border-black rounded-xl p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-[10px] font-black text-black">PROGRESS</div>
              <div className="text-xs font-black text-black">
                {unlockedCount}/{totalCount}
              </div>
            </div>
            <div className="w-full bg-gray-300 border-3 border-black rounded-full h-4">
              <div
                className="h-full bg-gradient-to-r from-pink-400 to-purple-400 border-3 border-black rounded-full transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="text-[10px] text-black/60 font-bold">{progressPercent}% Complete</div>
          </div>

          {/* Category Filter */}
          <div className="grid grid-cols-5 gap-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id)}
                className={`py-2 px-1 rounded-lg border-3 border-black font-black text-[9px] transition-all flex flex-col items-center gap-1 ${
                  filterCategory === cat.id
                    ? "bg-pink-400 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    : "bg-white text-black/60 hover:bg-gray-100"
                }`}
              >
                <span className="text-lg">{cat.emoji}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Achievements Grid */}
          <div className="grid grid-cols-2 gap-2 flex-1 overflow-y-auto">
            {filteredAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`border-4 ${
                  achievement.unlocked ? "border-black" : "border-gray-400"
                } rounded-xl p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-1 flex flex-col ${
                  achievement.unlocked ? "bg-yellow-200" : "bg-gray-200 opacity-60"
                }`}
              >
                {/* Emoji */}
                <div className="text-3xl text-center">{achievement.emoji}</div>

                {/* Name */}
                <div className="text-xs font-black text-center text-black line-clamp-2">
                  {achievement.name}
                </div>

                {/* Description */}
                <div className="text-[8px] text-black/60 text-center">{achievement.description}</div>

                {/* Status */}
                {achievement.unlocked ? (
                  <div className="bg-green-400 border-2 border-black rounded-lg py-0.5 text-center font-black text-[9px] text-black">
                    ✅ UNLOCKED
                  </div>
                ) : (
                  <div className="bg-gray-400 border-2 border-black rounded-lg py-0.5 text-center font-black text-[9px] text-black">
                    🔒 LOCKED
                  </div>
                )}

                {/* Hint */}
                {!achievement.unlocked && (
                  <div className="text-[8px] text-black/50 italic text-center">{achievement.hint}</div>
                )}
              </div>
            ))}
          </div>

          {/* Info Box */}
          <div className="bg-lime-300 border-4 border-black rounded-xl p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-[10px] font-black text-black text-center space-y-1">
              <div>🎯 Unlock achievements to earn prestige badges</div>
              <div>🏆 Share your badges to flex your accomplishments</div>
            </div>
          </div>
        </div>
      </div>
      <NavBar />
    </main>
  );
}
