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
    </div>
  );
}