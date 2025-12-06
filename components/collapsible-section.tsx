"use client";

import { useState } from "react";
import { useAccordion } from "./accordion-context";

interface CollapsibleSectionProps {
  id: string;
  title: string;
  emoji?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  bgColor?: string;
}

export function CollapsibleSection({
  id,
  title,
  emoji,
  children,
  defaultOpen = false,
  bgColor = "bg-white",
}: CollapsibleSectionProps) {
  const [fallbackOpen, setFallbackOpen] = useState(defaultOpen);

  let accordion: ReturnType<typeof useAccordion> | null = null;
  try {
    accordion = useAccordion();
  } catch {
    // Not inside AccordionProvider, use local state fallback
  }

  const isOpen = accordion ? accordion.isOpen(id) : fallbackOpen;
  const handleToggle = () => {
    if (accordion) {
      accordion.toggle(id);
    } else {
      setFallbackOpen((prev) => !prev);
    }
  };

  return (
    <div className="space-y-1">
      <button
        onClick={handleToggle}
        className={`w-full ${bgColor} border-3 border-black rounded-lg p-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black text-black">
            {emoji && `${emoji} `}
            {title}
          </span>
          <span className="text-xs">{isOpen ? "▼" : "▶"}</span>
        </div>
      </button>

      {isOpen && (
        <div className={`${bgColor} border-3 border-black rounded-lg p-1.5 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]`}>
          {children}
        </div>
      )}
    </div>
  );
}
