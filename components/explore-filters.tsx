"use client";

import { useState } from "react";
import { useAccordion } from "./accordion-context";

const ACCORDION_ID = "filters";

interface ExploreFiltersProps {
  filterLifecycle: "all" | "prime" | "growth" | "birth";
  onFilterLifecycle: (filter: "all" | "prime" | "growth" | "birth") => void;
  sortBy: "earnings" | "age" | "health";
  onSortBy: (sort: "earnings" | "age" | "health") => void;
}

export function ExploreFilters(props: ExploreFiltersProps) {
  const [fallbackOpen, setFallbackOpen] = useState(false);

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
        className="w-full bg-yellow-400 border-4 border-black rounded-xl p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all font-black text-black text-sm"
      >
        <div className="flex items-center justify-between">
          <span>🔍 FILTERS & SORT</span>
          <span className="text-xs">{isOpen ? "▼" : "▶"}</span>
        </div>
      </button>

      {isOpen && (
        <div className="bg-yellow-200 border-3 border-black rounded-xl p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] space-y-2">
          {/* Lifecycle Filter */}
          <div>
            <div className="text-[10px] font-black text-black mb-1">LIFECYCLE</div>
            <div className="grid grid-cols-4 gap-1">
              <button
                onClick={() => props.onFilterLifecycle("prime")}
                className={`py-1.5 px-1 rounded-lg border-2 border-black font-black text-[9px] transition-all ${
                  props.filterLifecycle === "prime"
                    ? "bg-purple-400 text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                    : "bg-white text-black/60 hover:bg-gray-100"
                }`}
              >
                ⭐
              </button>
              <button
                onClick={() => props.onFilterLifecycle("growth")}
                className={`py-1.5 px-1 rounded-lg border-2 border-black font-black text-[9px] transition-all ${
                  props.filterLifecycle === "growth"
                    ? "bg-green-400 text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                    : "bg-white text-black/60 hover:bg-gray-100"
                }`}
              >
                🌱
              </button>
              <button
                onClick={() => props.onFilterLifecycle("birth")}
                className={`py-1.5 px-1 rounded-lg border-2 border-black font-black text-[9px] transition-all ${
                  props.filterLifecycle === "birth"
                    ? "bg-blue-400 text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                    : "bg-white text-black/60 hover:bg-gray-100"
                }`}
              >
                🥚
              </button>
            </div>
          </div>

          {/* Sort Options */}
          <div>
            <div className="text-[10px] font-black text-black mb-1">SORT BY</div>
            <div className="grid grid-cols-3 gap-1">
              <button
                onClick={() => props.onSortBy("earnings")}
                className={`py-1.5 px-1 rounded-lg border-2 border-black font-black text-[9px] transition-all ${
                  props.sortBy === "earnings"
                    ? "bg-yellow-400 text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                    : "bg-white text-black/60 hover:bg-gray-100"
                }`}
              >
                💰 EARN
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
              <button
                onClick={() => props.onSortBy("health")}
                className={`py-1.5 px-1 rounded-lg border-2 border-black font-black text-[9px] transition-all ${
                  props.sortBy === "health"
                    ? "bg-yellow-400 text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                    : "bg-white text-black/60 hover:bg-gray-100"
                }`}
              >
                ❤️ HP
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
