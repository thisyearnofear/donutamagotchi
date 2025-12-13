"use client";

import { useState } from "react";
import { Button } from "./ui/button";

interface InteractionPanelProps {
  petResponse: string;
  isDisabled: boolean;
  onGesture: (gesture: "bounce" | "wiggle" | "jump" | "spin" | "nod") => void;
  petState: "idle" | "happy" | "excited" | "hungry" | "sleeping" | "dead" | "bored" | "petting";
}

const RESPONSES = {
  gm: [
    "☀️ gm gm!",
    "🌅 Rise and grind!",
    "😊 Good morning!",
    "🍩 Morning vibes!",
    "👋 Hey early bird!"
  ],
  donut: [
    "🍩 I AM a donut!",
    "🤔 Donut inception?",
    "😋 Donut talk!",
    "🍩 You get me!",
    "💭 Donut dreams..."
  ],
  glazed: [
    "✨ Stay glazed!",
    "🤩 Glazed and amazed!",
    "😎 Keep it sweet!",
    "💫 Glaze gang!",
    "🍩 Glazed > plain"
  ]
};

export function InteractionPanel({ petResponse, isDisabled, onGesture, petState }: InteractionPanelProps) {
  const [currentResponse, setCurrentResponse] = useState("");

  const handleInteraction = (type: keyof typeof RESPONSES) => {
    const responses = RESPONSES[type];
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    setCurrentResponse(randomResponse);
    onGesture("bounce");

    setTimeout(() => setCurrentResponse(""), 3000);
  };

  return (
    <div className="space-y-2">
      {/* Pet Response Display */}
      {(currentResponse || petResponse) && (
        <div className="bg-pink-300 border-4 border-black rounded-xl p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-in slide-in-from-top-2">
          <p className="text-center text-xs font-black text-black">
            {currentResponse || petResponse}
          </p>
        </div>
      )}

      {/* Interaction Buttons */}
      <div className="grid grid-cols-3 gap-2">
        <Button
          className="h-12 rounded-xl bg-gradient-to-b from-yellow-300 to-yellow-500 border-4 border-black text-black font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all text-xs"
          onClick={() => handleInteraction("gm")}
          disabled={isDisabled}
        >
          gm
        </Button>
        <Button
          className="h-12 rounded-xl bg-gradient-to-b from-pink-300 to-pink-500 border-4 border-black text-black font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all text-xs"
          onClick={() => handleInteraction("donut")}
          disabled={isDisabled}
        >
          donut
        </Button>
        <Button
          className="h-12 rounded-xl bg-gradient-to-b from-purple-300 to-purple-500 border-4 border-black text-black font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all text-xs"
          onClick={() => handleInteraction("glazed")}
          disabled={isDisabled}
        >
          glazed
        </Button>
      </div>
    </div>
  );
}