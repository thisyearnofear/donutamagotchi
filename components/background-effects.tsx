"use client";

import { useEffect, useState } from "react";

export function BackgroundEffects() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Soft glowing orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-pink-300/30 blur-[100px] animate-float-slow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-cyan-300/20 blur-[100px] animate-float-delayed" />
      
      {/* Floating particles (CSS-based) */}
      <div className="absolute top-1/4 left-1/4 w-4 h-4 rounded-full bg-yellow-200/40 animate-float-particle-1" />
      <div className="absolute top-3/4 left-1/3 w-6 h-6 rounded-full bg-pink-200/40 animate-float-particle-2" />
      <div className="absolute top-1/2 right-1/4 w-3 h-3 rounded-full bg-purple-200/40 animate-float-particle-3" />
      
      {/* Grid pattern overlay (subtle texture) */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03]" />
    </div>
  );
}
