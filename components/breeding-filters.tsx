"use client";

import { useState } from "react";
import { useAccordion } from "./accordion-context";

const ACCORDION_ID = "breeding-filters";

interface BreedingFiltersProps {
  filterPersonality: string;
  onFilterPersonality: (personality: string) => void;
  sortBy: "generation" | "age" | "viability";
  onSortBy: (sort: "generation" | "age" | "viability") => void;
}

const personalities = ["Friendly", "Energetic", "Lazy", "Stubborn"];

export function BreedingFilters(props: BreedingFiltersProps) {
  const [fallbackOpen, setFallbackOpen] = useState(true);

  let accordion: ReturnType<typeof useAccordion> | null = null;
  try {
    accordion = useAccordion();
  } catch {
    // Not inside AccordionProvider, use local state fallback
  }

  const isOpen = accordion ? accordion.isOpen(ACCORDION_ID) : fallbackOpen;
  const handleToggle = () => {
    if (accordion) {
      accordion.toggle(ACCORDION_ID);
    } else {
      setFallbackOpen((prev) => !prev);
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={handleToggle}
        className="w-full bg-cyan-400 border-4 border-black rounded-xl p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all font-black text-black text-sm"
      >
        <div className="flex items-center justify-between">
          <span>🎯 FILTERS & SORT</span>
          <span className="text-xs">{isOpen ? "▼" : "▶"}</span>
        </div>
      </button>

      {isOpen && (
        <div className="bg-cyan-200 border-3 border-black rounded-xl p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] space-y-2">
          {/* Personality Filter */}
          <div>
            <div className="text-[10px] font-black text-black mb-1">PERSONALITY</div>
            <div className="grid grid-cols-4 gap-1">
              {personalities.map((p) => (
                <button
                  key={p}
                  onClick={() => props.onFilterPersonality(p)}
                  className={`py-1.5 px-1 rounded-lg border-2 border-black font-black text-[9px] transition-all ${
                    props.filterPersonality === p
                      ? "bg-yellow-400 text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                      : "bg-white text-black/60 hover:bg-gray-100"
                  }`}
                >
                  {p.slice(0, 4).toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div>
            <div className="text-[10px] font-black text-black mb-1">SORT BY</div>
            <div className="grid grid-cols-3 gap-1">
              <button
                onClick={() => props.onSortBy("viability")}
                className={`py-1.5 px-1 rounded-lg border-2 border-black font-black text-[9px] transition-all ${
                  props.sortBy === "viability"
                    ? "bg-yellow-400 text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                    : "bg-white text-black/60 hover:bg-gray-100"
                }`}
              >
                💪 VIAB
              </button>
              <button
                onClick={() => props.onSortBy("generation")}
                className={`py-1.5 px-1 rounded-lg border-2 border-black font-black text-[9px] transition-all ${
                  props.sortBy === "generation"
                    ? "bg-yellow-400 text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                    : "bg-white text-black/60 hover:bg-gray-100"
                }`}
              >
                👶 GEN
              </button>
              <button
                onClick={() => props.onSortBy("age")}
                className={`py-1.5 px-1 rounded-lg border-2 border-black font-black text-[9px] transition-all ${
                  props.sortBy === "age"
                    ? "bg-yellow-400 text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                    : "bg-white text-black/60 hover:bg-gray-100"
                }`}
              >
                📅 AGE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}