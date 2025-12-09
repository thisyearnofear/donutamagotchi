"use client";

import { useState, useEffect } from "react";
import { useAccordion } from "./accordion-context";

const ACCORDION_ID = "guide";
const GUIDE_DISMISSED_KEY = "donutamagotchi-guide-dismissed";

interface CareGuideProps {
  ageInDays?: number; // Auto-expand for new donuts
}

export function CareGuide({ ageInDays = 0 }: CareGuideProps) {
  const [fallbackOpen, setFallbackOpen] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  let accordion: ReturnType<typeof useAccordion> | null = null;
  try {
    accordion = useAccordion();
  } catch {
    // Not inside AccordionProvider, use local state fallback
  }

  // Auto-expand for new donuts (first 7 days) unless user dismissed
  useEffect(() => {
    if (hasInitialized) return;

    const shouldAutoExpand = ageInDays < 7;
    if (shouldAutoExpand) {
      try {
        const dismissed = localStorage.getItem(GUIDE_DISMISSED_KEY);
        if (!dismissed) {
          if (accordion) {
            accordion.open(ACCORDION_ID);
          } else {
            setFallbackOpen(true);
          }
        }
      } catch {
        // Default to expanded for new users
        if (accordion) {
          accordion.open(ACCORDION_ID);
        } else {
          setFallbackOpen(true);
        }
      }
    }
    setHasInitialized(true);
  }, [ageInDays, accordion, hasInitialized]);

  const isOpen = accordion ? accordion.isOpen(ACCORDION_ID) : fallbackOpen;

  const handleToggle = () => {
    if (accordion) {
      accordion.toggle(ACCORDION_ID);
    } else {
      setFallbackOpen((prev) => !prev);
    }
  };

  const handleClose = () => {
    // Remember that user dismissed the guide
    try {
      localStorage.setItem(GUIDE_DISMISSED_KEY, "true");
    } catch { /* ignore */ }

    if (accordion) {
      accordion.close(ACCORDION_ID);
    } else {
      setFallbackOpen(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={handleToggle}
        className="w-full bg-purple-400 border-3 border-black rounded-lg p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
      >
        <div className="flex items-center justify-center gap-2">
          <span className="text-sm">📖</span>
          <span className="text-xs font-black text-black">HOW TO PLAY</span>
          <span className="text-xs">▶</span>
        </div>
      </button>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-300 to-purple-400 border-4 border-black rounded-xl p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-black text-black flex items-center gap-1">
          📖 HOW TO PLAY
        </span>
        <button
          onClick={handleClose}
          className="text-xs font-black text-black hover:bg-black/10 rounded-lg px-2 py-1 border-2 border-black bg-white"
        >
          ✕
        </button>
      </div>

      {/* Core Actions - Simplified and clear */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2 bg-white border-2 border-black rounded-lg p-2">
          <span className="text-lg">🍩</span>
          <div className="flex-1">
            <div className="text-xs font-black text-black">FEED</div>
            <div className="text-[9px] text-black/70 font-bold">Every 4h • Keeps health up</div>
          </div>
          <div className="text-[9px] font-black text-pink-600 bg-pink-100 px-1.5 py-0.5 rounded border border-pink-300">
            COSTS ETH
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white border-2 border-black rounded-lg p-2">
          <span className="text-lg">🎪</span>
          <div className="flex-1">
            <div className="text-xs font-black text-black">PLAY</div>
            <div className="text-[9px] text-black/70 font-bold">Every 6h • Boosts happiness</div>
          </div>
          <div className="text-[9px] font-black text-green-600 bg-green-100 px-1.5 py-0.5 rounded border border-green-300">
            FREE
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white border-2 border-black rounded-lg p-2">
          <span className="text-lg">🤚</span>
          <div className="flex-1">
            <div className="text-xs font-black text-black">PET</div>
            <div className="text-[9px] text-black/70 font-bold">Every 2h • Improves grooming</div>
          </div>
          <div className="text-[9px] font-black text-green-600 bg-green-100 px-1.5 py-0.5 rounded border border-green-300">
            FREE
          </div>
        </div>
      </div>

      {/* Milestones - Compact */}
      <div className="bg-yellow-100 border-2 border-black rounded-lg p-2 mb-2">
        <div className="text-[10px] font-black text-black mb-1">🎯 MILESTONES</div>
        <div className="grid grid-cols-3 gap-1 text-[9px] font-bold text-black/80">
          <div className="text-center">
            <div className="font-black">30 days</div>
            <div className="text-[8px]">Prime Age</div>
          </div>
          <div className="text-center">
            <div className="font-black">90 days</div>
            <div className="text-[8px]">Retirement</div>
          </div>
          <div className="text-center">
            <div className="font-black">100+ days</div>
            <div className="text-[8px]">Legendary</div>
          </div>
        </div>
      </div>

      <div className="text-[9px] text-center font-bold text-black/70">
        💡 Happy donuts earn more $DONUT per second!
      </div>
    </div>
  );
}
