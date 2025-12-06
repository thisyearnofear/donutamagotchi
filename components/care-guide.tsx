"use client";

import { useState } from "react";

export function CareGuide() {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-purple-400 border-3 border-black rounded-lg p-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
      >
        <div className="text-[10px] font-black text-black">📖 QUICK GUIDE</div>
      </button>
    );
  }

  return (
    <div className="bg-purple-300 border-4 border-black rounded-xl p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black text-black">📖 HOW TO PLAY</span>
        <button
          onClick={() => setIsOpen(false)}
          className="text-xs font-black text-black hover:bg-black/10 rounded px-1"
        >
          ✕
        </button>
      </div>

      <div className="space-y-1 text-[9px] text-black font-bold">
        <div><span className="font-black">🍩 FEED:</span> Pet needs to eat every 4h</div>
        <div><span className="font-black">😊 PLAY:</span> Raise happiness every 6h</div>
        <div><span className="font-black">🤗 PET:</span> Improve cleanliness every 2h</div>
        <div className="bg-white border-2 border-black rounded p-1 mt-2">
          <div><span className="font-black">30 DAYS:</span> Reach PRIME age</div>
          <div><span className="font-black">90 DAYS:</span> Eligible for retirement</div>
          <div><span className="font-black">100+ DAYS:</span> Become LEGENDARY</div>
        </div>
        <div className="text-[8px] text-black/60 mt-1">💡 Well-cared donuts earn more $DONUT per second!</div>
      </div>
    </div>
  );
}
