"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Traits } from "@/lib/traits";

interface InteractionPanelProps {
  petResponse: string;
  isDisabled: boolean;
  onGesture: (gesture: "bounce" | "wiggle" | "jump" | "spin" | "nod") => void;
  petState: "idle" | "happy" | "excited" | "hungry" | "sleeping" | "dead" | "bored" | "petting";
  traits?: Traits | null;
}

const RESPONSES = {
  gm: {
    Friendly: [
      "☀️ gm bestie!",
      "😊 Good morning friend!",
      "👋 Hiiiii!",
      "🍩 Ready for a great day?",
      "🌅 You shine brighter than glaze!"
    ],
    Energetic: [
      "🚀 GM GM GM!",
      "⚡️ LETS GOOOO!",
      "🏃‍♂️ Up and running!",
      "🤩 HYPED for today!",
      "🌅 WAKE UP ITS DONUT TIME!"
    ],
    Lazy: [
      "😴 gm...",
      "🛌 5 more minutes?",
      "🥱 *yawn* hey...",
      "💤 zzz... oh, gm.",
      "☕️ need coffee first..."
    ],
    Stubborn: [
      "😑 gm.",
      "🍩 I'm awake, okay?",
      "😒 Too early.",
      "😐 Morning.",
      "🌫️ Hmph. gm."
    ]
  },
  donut: {
    Friendly: [
      "🍩 I love being a donut!",
      "🥰 You're sweet like sugar!",
      "😋 We make a great team!",
      "🍩 Hug me!",
      "💕 Sprinkles of love!"
    ],
    Energetic: [
      "🍩 BEST SHAPE EVER!",
      "🤪 ROUND POWER!",
      "🍩 ROLL OUT!",
      "🤩 SUGAR RUSH!",
      "⚡️ DONUT ENERGY!"
    ],
    Lazy: [
      "🍩 Round is the best shape for napping.",
      "🤤 Mmm... me.",
      "🍩 Too round to move.",
      "🛋️ Donut disturb.",
      "🥱 Soft and sweet."
    ],
    Stubborn: [
      "🍩 I am the best donut.",
      "😤 Acknowledged.",
      "🍩 Yeah, I know I'm cool.",
      "🛡️ Tough crust.",
      "😐 I'm not just a snack."
    ]
  },
  glazed: {
    Friendly: [
      "✨ Shining for you!",
      "🥰 Feeling fresh!",
      "💫 So sparkly!",
      "🍩 Glazed with love!",
      "✨ Glow up!"
    ],
    Energetic: [
      "🤩 BLINDINGLY SHINY!",
      "⚡️ MAX GLOSS!",
      "✨ SPARKLE POWER!",
      "🌟 WATCH ME SHINE!",
      "💫 ZOOM ZOOM!"
    ],
    Lazy: [
      "✨ Shiny nap spot.",
      "🫠 Melting...",
      "😴 Glazed over eyes...",
      "✨ Sticky situation.",
      "🥱 Too bright..."
    ],
    Stubborn: [
      "😎 Deal with it.",
      "✨ Naturally perfect.",
      "🛡️ Armor up.",
      "💎 Hard as diamond.",
      "✨ Yeah, I shine."
    ]
  }
};

export function InteractionPanel({ petResponse, isDisabled, onGesture, petState, traits }: InteractionPanelProps) {
  const [currentResponse, setCurrentResponse] = useState("");

  const handleInteraction = (type: keyof typeof RESPONSES) => {
    const personality = traits?.personality || "Friendly";
    const personalityResponses = RESPONSES[type][personality];
    const randomResponse = personalityResponses[Math.floor(Math.random() * personalityResponses.length)];
    
    setCurrentResponse(randomResponse);
    
    // Personality-based gestures
    let gesture: "bounce" | "wiggle" | "jump" | "spin" | "nod" = "bounce";
    
    if (personality === "Energetic") gesture = Math.random() > 0.5 ? "jump" : "spin";
    else if (personality === "Lazy") gesture = "nod";
    else if (personality === "Stubborn") gesture = "wiggle";
    else gesture = "bounce"; // Friendly default

    onGesture(gesture);

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