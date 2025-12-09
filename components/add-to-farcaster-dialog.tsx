"use client";

import { useState, useCallback, useEffect } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import { X, Plus, Check, AlertCircle, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type DialogStep = "onboarding" | "add-farcaster";

type AddToFarcasterDialogProps = {
  showOnFirstVisit?: boolean;
  storageKey?: string;
};

const ONBOARDING_STORAGE_KEY = "donutamagotchi-onboarding-seen";

export function AddToFarcasterDialog({
  showOnFirstVisit = true,
  storageKey = "donutamagotchi-add-miniapp-prompt-shown",
}: AddToFarcasterDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<DialogStep>("onboarding");
  const [status, setStatus] = useState<"idle" | "adding" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (!showOnFirstVisit) return;

    try {
      const hasSeenOnboarding = localStorage.getItem(ONBOARDING_STORAGE_KEY);
      if (!hasSeenOnboarding) {
        // Show onboarding dialog after a short delay
        const timer = setTimeout(() => {
          setStep("onboarding");
          setIsOpen(true);
        }, 1500);

        return () => clearTimeout(timer);
      }
    } catch (error) {
      console.warn("Could not access localStorage:", error);
    }
  }, [showOnFirstVisit]);

  const handleOnboardingComplete = useCallback(() => {
    try {
      localStorage.setItem(ONBOARDING_STORAGE_KEY, "true");
      // Check if we should show Add to Farcaster next
      const hasSeenAddPrompt = localStorage.getItem(storageKey);
      if (!hasSeenAddPrompt) {
        setStep("add-farcaster");
        localStorage.setItem(storageKey, "true");
      } else {
        setIsOpen(false);
      }
    } catch {
      setIsOpen(false);
    }
  }, [storageKey]);

  const handleAddToFarcaster = useCallback(async () => {
    try {
      setStatus("adding");
      setErrorMessage("");

      await sdk.actions.addMiniApp();

      setStatus("success");
      setTimeout(() => {
        setIsOpen(false);
        setStatus("idle");
      }, 2000);
    } catch (error) {
      console.error("Failed to add Mini App:", error);

      const errorName = error instanceof Error ? error.name : "";
      if (errorName === "AddMiniApp.RejectedByUser") {
        setStatus("idle");
        return;
      }

      setStatus("error");

      const errorMsg = error instanceof Error ? error.message : "Failed to add app";

      if (errorName === "AddMiniApp.InvalidDomainManifest" || errorMsg.includes("domain")) {
        setErrorMessage("App must be on production domain with valid manifest");
      } else if (errorMsg.includes("not supported")) {
        setErrorMessage("This feature is not available in your current environment");
      } else {
        setErrorMessage("Unable to add app. Please try again.");
      }

      setTimeout(() => {
        setStatus("idle");
        setErrorMessage("");
      }, 5000);
    }
  }, []);

  const handleClose = useCallback(() => {
    if (status === "adding") return;
    // Mark onboarding as seen when closing
    try {
      localStorage.setItem(ONBOARDING_STORAGE_KEY, "true");
    } catch { /* ignore */ }
    setIsOpen(false);
    setStatus("idle");
    setErrorMessage("");
  }, [status]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm animate-in fade-in-0"
        onClick={handleClose}
      />

      {/* Dialog */}
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 animate-in fade-in-0 zoom-in-95">
        {step === "onboarding" ? (
          <OnboardingStep onComplete={handleOnboardingComplete} onClose={handleClose} />
        ) : (
          <AddFarcasterStep
            status={status}
            errorMessage={errorMessage}
            onAdd={handleAddToFarcaster}
            onClose={handleClose}
          />
        )}
      </div>
    </>
  );
}

// Step 1: Onboarding Tutorial
function OnboardingStep({
  onComplete,
  onClose
}: {
  onComplete: () => void;
  onClose: () => void;
}) {
  return (
    <div className="relative mx-4 rounded-2xl border-4 border-black bg-gradient-to-b from-cyan-300 to-cyan-400 p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute right-3 top-3 rounded-lg border-2 border-black bg-white p-1 text-black transition-all hover:bg-gray-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
        aria-label="Close"
      >
        <X className="h-4 w-4" />
      </button>

      {/* Icon */}
      <div className="mb-3 flex justify-center">
        <div className="rounded-2xl border-4 border-black bg-pink-400 p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="text-4xl">🍩</div>
        </div>
      </div>

      {/* Title - Emphasize $DONUT ecosystem */}
      <div className="mb-4 text-center">
        <h2 className="mb-1 text-xl font-black text-black">
          WELCOME TO DONUTAMAGOTCHI!
        </h2>
        <p className="text-xs font-bold text-black/70">
          The tamagotchi layer for the <span className="text-pink-700">$DONUT</span> ecosystem
        </p>
      </div>

      {/* How to Play Steps - More compact */}
      <div className="mb-4 space-y-2">
        <div className="flex items-center gap-2 rounded-lg border-2 border-black bg-white p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-black bg-pink-400 text-lg">
            🍩
          </div>
          <div className="flex-1">
            <div className="text-xs font-black text-black">1. FEED YOUR DONUT</div>
            <div className="text-[10px] font-bold text-black/60">Pay ETH → Earn $DONUT tokens</div>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-lg border-2 border-black bg-white p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-black bg-blue-400 text-lg">
            🎪
          </div>
          <div className="flex-1">
            <div className="text-xs font-black text-black">2. PLAY & CARE DAILY</div>
            <div className="text-[10px] font-bold text-black/60">Happy donuts earn more $DONUT</div>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-lg border-2 border-black bg-white p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-black bg-green-400 text-lg">
            📈
          </div>
          <div className="flex-1">
            <div className="text-xs font-black text-black">3. GROW & BREED</div>
            <div className="text-[10px] font-bold text-black/60">Unlock features at 30 & 90 days</div>
          </div>
        </div>
      </div>

      {/* Token education - Both tokens explained compactly */}
      <div className="mb-4 rounded-lg border-2 border-black bg-gradient-to-r from-yellow-200 to-pink-200 p-2">
        <div className="grid grid-cols-2 gap-2 text-center">
          <div>
            <div className="text-[10px] font-black text-black">🍩 $DONUT</div>
            <div className="text-[8px] font-bold text-black/60">Earn by feeding</div>
          </div>
          <div>
            <div className="text-[10px] font-black text-black">✨ $DONUTAMAGOTCHI</div>
            <div className="text-[8px] font-bold text-black/60">Stake for rewards</div>
          </div>
        </div>
        <div className="text-[8px] text-center font-bold text-black/50 mt-1 border-t border-black/20 pt-1">
          40% of fees → Stakers • Paired LP
        </div>
      </div>

      {/* CTA - Leads to Farcaster */}
      <Button
        onClick={onComplete}
        className="w-full gap-2 rounded-xl border-4 border-black bg-gradient-to-b from-pink-400 to-pink-600 py-5 text-base font-black text-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]"
      >
        <span>CONTINUE</span>
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
}

// Step 2: Add to Farcaster - Emphasize value
function AddFarcasterStep({
  status,
  errorMessage,
  onAdd,
  onClose,
}: {
  status: "idle" | "adding" | "success" | "error";
  errorMessage: string;
  onAdd: () => void;
  onClose: () => void;
}) {
  return (
    <div className="relative mx-4 rounded-2xl border-4 border-black bg-gradient-to-b from-yellow-300 to-yellow-400 p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      {/* Close button */}
      <button
        onClick={onClose}
        disabled={status === "adding"}
        className="absolute right-3 top-3 rounded-lg border-2 border-black bg-white p-1 text-black transition-all hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
        aria-label="Close"
      >
        <X className="h-4 w-4" />
      </button>

      {/* Icon */}
      <div className="mb-3 flex justify-center">
        <div className="rounded-2xl border-4 border-black bg-purple-400 p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="text-4xl">🔔</div>
        </div>
      </div>

      {/* Content - Emphasize care reminders */}
      <div className="mb-4 text-center">
        <h2 className="mb-1 text-xl font-black text-black">
          NEVER MISS A FEEDING!
        </h2>
        <p className="text-xs font-bold text-black/70">
          Add to Farcaster for care reminders
        </p>
      </div>

      {/* Benefits - More specific to gameplay */}
      <div className="mb-4 space-y-1.5">
        <div className="flex items-center gap-2 text-sm font-bold text-black/80">
          <div className="text-base">⏰</div>
          <span className="text-xs">Get feeding & care reminders</span>
        </div>
        <div className="flex items-center gap-2 text-sm font-bold text-black/80">
          <div className="text-base">💕</div>
          <span className="text-xs">Breeding notifications when ready</span>
        </div>
        <div className="flex items-center gap-2 text-sm font-bold text-black/80">
          <div className="text-base">🏆</div>
          <span className="text-xs">Milestone achievements & events</span>
        </div>
      </div>

      {/* Error message */}
      {status === "error" && errorMessage && (
        <div className="mb-3 rounded-lg border-3 border-black bg-red-300 p-2 text-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-xs font-black text-black">{errorMessage}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-2">
        <Button
          onClick={onAdd}
          disabled={status === "adding" || status === "success"}
          className={cn(
            "w-full gap-2 rounded-xl border-4 border-black py-5 text-base font-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]",
            status === "idle" && "bg-gradient-to-b from-pink-400 to-pink-600 text-black",
            status === "success" && "bg-gradient-to-b from-green-400 to-green-600 text-black",
            status === "error" && "bg-gradient-to-b from-red-400 to-red-600 text-white"
          )}
        >
          {status === "adding" && (
            <>
              <div className="h-5 w-5 animate-spin rounded-full border-4 border-current border-t-transparent" />
              <span>ADDING...</span>
            </>
          )}
          {status === "success" && (
            <>
              <Check className="h-5 w-5" />
              <span>SUCCESS! 🎉</span>
            </>
          )}
          {status === "error" && (
            <>
              <AlertCircle className="h-5 w-5" />
              <span>TRY AGAIN</span>
            </>
          )}
          {status === "idle" && (
            <>
              <Plus className="h-5 w-5" />
              <span>ADD TO FARCASTER</span>
            </>
          )}
        </Button>

        <Button
          onClick={onClose}
          disabled={status === "adding"}
          className="w-full rounded-xl border-3 border-black bg-white py-3 text-xs font-black text-black/50 hover:bg-gray-100 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px]"
        >
          I&apos;LL DO THIS LATER
        </Button>
      </div>
    </div>
  );
}

export function useAddToFarcasterDialog() {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return {
    isOpen,
    open,
    close,
    Dialog: () => <AddToFarcasterDialog showOnFirstVisit={false} />,
  };
}
