"use client";

import { useState, useMemo, useCallback } from "react";
import { useAccount } from "wagmi";
import { NavBar } from "@/components/nav-bar";
import { Button } from "@/components/ui/button";
import { BreedingFilters } from "@/components/breeding-filters";
import { CollapsibleSection } from "@/components/collapsible-section";
import { FeaturedSection } from "@/components/featured-section";
import { PartnerCard } from "@/components/breeding-partner-card";
import { OffspringPreview } from "@/components/offspring-preview";
import { PedigreeCard } from "@/components/pedigree-card";
import { AccordionProvider } from "@/components/accordion-context";
import { generateOffspringPreviews } from "@/lib/genetics";
import { Traits } from "@/lib/traits";

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
  traits?: Traits;
}

export default function BreedingPage() {
  const { address } = useAccount();
  const [filterPersonality, setFilterPersonality] = useState<string>("Friendly");
  const [sortBy, setSortBy] = useState<"generation" | "age" | "viability">("viability");
  const [selectedPartner, setSelectedPartner] = useState<BreedingPartner | null>(null);
  const [showAllPartners, setShowAllPartners] = useState(false);
  const [offspringPreviews, setOffspringPreviews] = useState<ReturnType<typeof generateOffspringPreviews> | null>(null);

  // Mock current donut (in production, get from useTraits hook)
  const currentDonut: Traits | null = null; // TODO: Get from parent page context
  const currentDonutGen = 1; // TODO: Get from parent page context

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
      traits: {
        personality: "Energetic",
        coloring: "Pink",
        earningPotential: 1.02,
        socialScore: 85,
        grooming: 75,
        energy: 88,
        satisfaction: 80,
        generation: 1,
      },
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
      traits: {
        personality: "Friendly",
        coloring: "Blue",
        earningPotential: 0.98,
        socialScore: 72,
        grooming: 68,
        energy: 70,
        satisfaction: 75,
        generation: 2,
      },
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
      traits: {
        personality: "Lazy",
        coloring: "Purple",
        earningPotential: 1.0,
        socialScore: 55,
        grooming: 60,
        energy: 50,
        satisfaction: 65,
        generation: 1,
      },
    },
  ];

  const filteredPartners = useMemo(() => {
    let filtered = availablePartners.filter((p) => p.personality === filterPersonality);

    return filtered.sort((a, b) => {
      if (sortBy === "generation") return b.generation - a.generation;
      if (sortBy === "age") return b.ageInDays - a.ageInDays;
      return b.breedingViability - a.breedingViability;
    });
  }, [filterPersonality, sortBy]);

  const personalities = ["Friendly", "Energetic", "Lazy", "Stubborn"];

  // Handle partner selection and generate offspring previews
  const handlePartnerSelect = useCallback(
    (partner: BreedingPartner) => {
      setSelectedPartner(partner);
      
      // Generate offspring previews if both donut traits are available
      if (currentDonut && partner.traits) {
        const previews = generateOffspringPreviews(
          currentDonut,
          partner.traits,
          currentDonutGen,
          partner.generation,
          3, // Show 3 possible outcomes
        );
        setOffspringPreviews(previews);
      }
    },
    [currentDonut, currentDonutGen],
  );

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
          <div className="flex flex-1 flex-col overflow-y-auto space-y-2">
            {/* Header */}
            <div className="bg-yellow-300 border-4 border-black rounded-2xl p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h1 className="text-2xl font-black text-center text-black tracking-tight">
                💕 BREEDING BOARD
              </h1>
              <p className="text-center text-[10px] text-black/70 font-bold mt-1">
                FIND YOUR PERFECT MATCH
              </p>
            </div>

            {/* Requirements & Cost - Collapsible */}
            <CollapsibleSection
              id="breeding-info"
              title="REQUIREMENTS & COST"
              emoji="✨"
              bgColor="bg-white"
            >
              <div className="space-y-1 text-[9px] text-black/70 font-bold">
                <div>📅 PRIME age (30+ days)</div>
                <div>❤️ Health & happiness 50%+</div>
                <div>💕 Partner: PRIME, 50%+ viability</div>
                <div>💰 Cost: 1000 $DONUTAMAGOTCHI (burned)</div>
              </div>
            </CollapsibleSection>

            {/* Featured Section */}
            {!showAllPartners && filteredPartners.length > 0 && (
              <FeaturedSection
                title="RECOMMENDED PARTNERS"
                emoji="💕"
                viewAllLabel={`View all ${filteredPartners.length}`}
                onViewAll={() => setShowAllPartners(true)}
              >
                {filteredPartners.slice(0, 3).map((partner) => (
                  <PartnerCard key={partner.id} partner={partner} isSelected={selectedPartner?.id === partner.id} onSelect={handlePartnerSelect} />
                ))}
              </FeaturedSection>
            )}

            {/* Filters & Sort */}
            <BreedingFilters
              filterPersonality={filterPersonality}
              onFilterPersonality={setFilterPersonality}
              sortBy={sortBy}
              onSortBy={setSortBy}
            />

            {/* Partners List */}
            {filteredPartners.length > 0 ? (
             <div className="space-y-2 flex-1 overflow-y-auto">
                {(showAllPartners ? filteredPartners : filteredPartners.slice(3)).map((partner) => (
                  <PartnerCard key={partner.id} partner={partner} isSelected={selectedPartner?.id === partner.id} onSelect={handlePartnerSelect} />
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

          {/* Offspring Preview Section */}
          {selectedPartner && offspringPreviews && (
            <div className="space-y-2">
              <div className="bg-yellow-300 border-4 border-black rounded-xl p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-[10px] font-black text-black text-center">
                  POSSIBLE OUTCOMES
                </div>
              </div>
              <div className="space-y-2">
                {offspringPreviews.map((preview, idx) => (
                  <OffspringPreview
                    key={idx}
                    offspring={preview.traits}
                    rarity={preview.rarity}
                    index={idx + 1}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Selected Partner Info & Breeding Action */}
          {selectedPartner && (
            <div className="bg-pink-300 border-4 border-black rounded-xl p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-2">
              <div className="text-[10px] font-black text-black/70">BREEDING REQUEST</div>
              <div className="text-xs font-black text-black">
                Breed with {selectedPartner.ownerName}?
              </div>
              <div className="text-[9px] text-black/60 space-y-1">
                <div>👶 Expected offspring: Gen {selectedPartner.generation + 1}</div>
                <div>💰 Cost: 1000 $DONUTAMAGOTCHI (burned)</div>
                <div>⏳ Incubation: 1 day</div>
                <div>❤️ Both parents on 7-day cooldown</div>
              </div>

              <Button
                className="w-full bg-gradient-to-b from-purple-400 to-purple-600 border-3 border-black text-black text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50"
                disabled={!selectedPartner.canBreed || !currentDonut}
              >
                {!currentDonut
                  ? "💔 LOAD YOUR DONUT"
                  : selectedPartner.canBreed
                  ? "💕 CONFIRM BREEDING"
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
      </AccordionProvider>
    </main>
  );
}
