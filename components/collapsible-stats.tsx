"use client";

import { useState } from "react";
import { PetStats } from "./pet-stats";
import { useAccordion } from "./accordion-context";

interface CollapsibleStatsProps {
  happiness: number;
  health: number;
  energy: string;
  age: string;
  ageInDays?: number;
  grooming: number;
  energyLevel: number;
  satisfaction: number;
  isDying: boolean;
  lastFedTime?: number;
  accordionId?: string;
  sessionEarnings?: number;
  dailyEarningRate?: number;
  tokensUntilNextMilestone?: number;
}

const ACCORDION_ID = "stats";

export function CollapsibleStats(props: CollapsibleStatsProps) {
  const accordionId = props.accordionId || ACCORDION_ID;
  const [fallbackOpen, setFallbackOpen] = useState(false);

  let accordion: ReturnType<typeof useAccordion> | null = null;
  try {
    accordion = useAccordion();
  } catch {
    // Not inside AccordionProvider, use local state fallback
  }

  const isOpen = accordion ? accordion.isOpen(accordionId) : fallbackOpen;
  const handleToggle = () => {
    if (accordion) {
      accordion.toggle(accordionId);
    } else {
      setFallbackOpen((prev) => !prev);
    }
  };

  return (
    <div className="space-y-2">
      <div className="mt-2">
        <PetStats {...props} lastFedTime={props.lastFedTime} />
      </div>

      <button
        onClick={handleToggle}
        className="w-full bg-purple-400 border-4 border-black rounded-xl p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all font-black text-black text-sm"
      >
        <div className="flex items-center justify-between">
          <span>📋 DETAILED STATS</span>
          <span className="text-xs">{isOpen ? "▼" : "▶"}</span>
        </div>
      </button>

      {isOpen && (
        <div className="bg-purple-200 border-3 border-black rounded-xl p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <div className="text-[9px] font-black text-black space-y-1">
            <div>🧹 Grooming: {props.grooming.toFixed(0)}% (cosmetic effect)</div>
            <div>⚡ Energy Level: {props.energyLevel.toFixed(0)}% (internal stat)</div>
            <div>😋 Satisfaction: {props.satisfaction.toFixed(0)}% (internal stat)</div>
          </div>
        </div>
      )}
    </div>
  );
}
