"use client";

import { ReactNode } from "react";

interface FeaturedSectionProps {
  title: string;
  emoji?: string;
  children: ReactNode;
  viewAllLabel?: string;
  onViewAll?: () => void;
}

export function FeaturedSection({
  title,
  emoji,
  children,
  viewAllLabel = "EXPLORE",
  onViewAll,
}: FeaturedSectionProps) {
  return (
    <div className="space-y-2 animate-in fade-in-50 slide-in-from-top-2 duration-300">
      <div className="flex items-center justify-between px-0.5">
        <div className="text-[10px] font-black text-white/90">
          {emoji && `${emoji} `}
          {title}
        </div>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-[9px] font-black text-white/60 hover:text-white/90 active:text-white transition-colors hover:translate-x-0.5 active:translate-x-0 active:translate-y-0.5 transition-transform duration-100"
          >
            {viewAllLabel} →
          </button>
        )}
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}