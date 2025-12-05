"use client";

import { useState } from "react";
import { getAgeInDays } from "@/lib/traits";
import { TraitsDisplay } from "./traits-display";
import { BreedingViability } from "./breeding-viability";
import { BreedingReadiness } from "./breeding-readiness";
import { LifecycleDisplay } from "./lifecycle-display";

interface CollapsibleAdvancedProps {
  traits: any;
  lastInteractionTime: number;
  lastFedTime: number;
  createdAtSeconds: number;
  hasMiner: boolean;
  minerState: any;
  ageInDays?: number;
}

export function CollapsibleAdvanced(props: CollapsibleAdvancedProps) {
  const [activeTab, setActiveTab] = useState<"traits" | "lifecycle" | "breeding">("traits");

  return (
    <div>
      <div className="flex gap-1">
        <TabButton
          active={activeTab === "traits"}
          onClick={() => setActiveTab("traits")}
          emoji="🧬"
          label="TRAITS"
        />
        <TabButton
          active={activeTab === "lifecycle"}
          onClick={() => setActiveTab("lifecycle")}
          emoji="📈"
          label="AGE"
        />
        <TabButton
          active={activeTab === "breeding"}
          onClick={() => setActiveTab("breeding")}
          emoji="💑"
          label="BREED"
        />
      </div>

      <div className="mt-2">
        {activeTab === "traits" && <TraitsDisplay traits={props.traits} />}
        {activeTab === "lifecycle" && props.hasMiner && props.minerState && (
          <LifecycleDisplay createdAtSeconds={props.createdAtSeconds} />
        )}
        {activeTab === "breeding" && props.hasMiner && (
          <BreedingReadiness
            createdAtSeconds={props.createdAtSeconds}
            health={props.traits?.satisfaction ?? 50}
            cleanliness={props.traits?.grooming ?? 50}
          />
        )}
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  emoji,
  label,
}: {
  active: boolean;
  onClick: () => void;
  emoji: string;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-2 px-2 rounded-lg border-2 border-black font-black text-xs transition-all ${
        active
          ? "bg-pink-400 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          : "bg-gray-600 text-white hover:bg-gray-500"
      }`}
    >
      <div className="text-lg">{emoji}</div>
      <div>{label}</div>
    </button>
  );
}
