"use client";

import { useState, useMemo, useEffect } from "react";
import { getLifecycleStage } from "@/lib/traits";
import { NavBar } from "@/components/nav-bar";
import { Button } from "@/components/ui/button";
import { ExploreFilters } from "@/components/explore-filters";
import { FeaturedSection } from "@/components/featured-section";
import { DonutCard as DonutCardComponent } from "@/components/donut-card";
import { AccordionProvider } from "@/components/accordion-context";

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
  const [filterLifecycle, setFilterLifecycle] = useState<"all" | "prime" | "growth" | "birth">("prime");
  const [sortBy, setSortBy] = useState<"earnings" | "age" | "health">("earnings");
  const [showAllDonuts, setShowAllDonuts] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);

  const tips = [
    "💡 Tip: Filter by PRIME (⭐) to find breeding partners when your pet is ready!",
    "💡 Coming soon: Earn +10 $DONUTAMAGOTCHI when exploring other donuts"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % tips.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

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
      <AccordionProvider mode="single">
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

          {/* Rotating Tip Box */}
          <div className="bg-lime-300 border-4 border-black rounded-xl p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
            <div className="text-[10px] font-black text-black text-center">
              {tips[tipIndex]}
            </div>
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

          {/* Featured Section - only show when not viewing all */}
          {!showAllDonuts && sortedDonuts.length > 0 && (
            <FeaturedSection
              title="TRENDING PARTNERS"
              emoji="⭐"
              onViewAll={() => setShowAllDonuts(true)}
            >
              {sortedDonuts.slice(0, 2).map((donut) => {
                const stage = getLifecycleStage(donut.ageInDays);
                if (stage === "dead") return null;
                return <DonutCardComponent key={donut.id} donut={donut} stage={stage} />;
              })}
            </FeaturedSection>
          )}

          {/* Show filters only when viewing all */}
          {showAllDonuts && (
            <>
              <div className="flex items-center justify-between">
                <Button
                  onClick={() => setShowAllDonuts(false)}
                  className="text-xs font-black bg-white text-black border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  ← BACK TO FEATURED
                </Button>
              </div>
              <ExploreFilters
                filterLifecycle={filterLifecycle}
                onFilterLifecycle={setFilterLifecycle}
                sortBy={sortBy}
                onSortBy={setSortBy}
              />
            </>
          )}

          {/* Full Donuts List - only show when viewing all */}
          {showAllDonuts && (
            sortedDonuts.length > 0 ? (
              <div className="space-y-2 flex-1 overflow-y-auto">
                {sortedDonuts.map((donut) => {
                  const stage = getLifecycleStage(donut.ageInDays);
                  if (stage === "dead") return null;
                  return <DonutCardComponent key={donut.id} donut={donut} stage={stage} />;
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
            )
          )}
        </div>
      </div>
        <NavBar />
      </AccordionProvider>
    </main>
  );
}