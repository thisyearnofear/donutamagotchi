"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { useAccordion } from "./accordion-context";

interface InteractionPanelProps {
  customMessage: string;
  onMessageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  petResponse: string;
  isDisabled: boolean;
  onGesture: (gesture: "bounce" | "wiggle" | "jump" | "spin" | "nod") => void;
  accordionId?: string;
}

const ACCORDION_ID = "interact";

export function InteractionPanel(props: InteractionPanelProps) {
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
    <div>
      <button
        onClick={handleToggle}
        className="w-full bg-blue-400 border-4 border-black rounded-xl p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all font-black text-black text-sm"
      >
        <div className="flex items-center justify-between">
          <span>💬 INTERACT</span>
          <span className="text-xs">{isOpen ? "▼" : "▶"}</span>
        </div>
      </button>

      {isOpen && (
        <div className="mt-2 space-y-2">
          {/* Message Input */}
          <div className="space-y-1">
            <div className="bg-white border-4 border-black rounded-xl p-1.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <input
                type="text"
                value={props.customMessage}
                onChange={props.onMessageChange}
                placeholder="Say something nice..."
                maxLength={100}
                className="w-full bg-transparent text-black placeholder-black/40 text-xs font-bold focus:outline-none disabled:opacity-40"
                disabled={props.isDisabled}
              />
            </div>

            {/* Pet Response */}
            {props.petResponse && (
              <div className="bg-pink-300 border-4 border-black rounded-xl p-1.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-in slide-in-from-top-2">
                <p className="text-center text-xs font-black text-black">
                  {props.petResponse}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-2">
            <Button
              className="h-12 rounded-xl bg-gradient-to-b from-blue-400 to-blue-600 border-4 border-black text-black font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all text-xs"
              onClick={() => props.onGesture("spin")}
              disabled={props.isDisabled}
              title="Play"
            >
              🎪
            </Button>
            <Button
              className="h-12 rounded-xl bg-gradient-to-b from-green-400 to-green-600 border-4 border-black text-black font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all text-xs"
              onClick={() => props.onGesture("wiggle")}
              disabled={props.isDisabled}
              title="Pet"
            >
              🤚
            </Button>
            <Button
              className="h-12 rounded-xl bg-gradient-to-b from-yellow-400 to-yellow-600 border-4 border-black text-black font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all text-xs"
              onClick={() => props.onGesture("jump")}
              disabled={props.isDisabled}
              title="Poke"
            >
              👆
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
