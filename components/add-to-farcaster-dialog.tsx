"use client";

import { useState, useCallback, useEffect } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import { X, Plus, Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type AddToFarcasterDialogProps = {
  showOnFirstVisit?: boolean;
  storageKey?: string;
};

export function AddToFarcasterDialog({
  showOnFirstVisit = true,
  storageKey = "donutamagotchi-add-miniapp-prompt-shown",
}: AddToFarcasterDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "adding" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (!showOnFirstVisit) return;

    try {
      const hasSeenPrompt = localStorage.getItem(storageKey);
      if (!hasSeenPrompt) {
        const timer = setTimeout(() => {
          setIsOpen(true);
          localStorage.setItem(storageKey, "true");
        }, 2000);

        return () => clearTimeout(timer);
      }
    } catch (error) {
      console.warn("Could not access localStorage:", error);
    }
  }, [showOnFirstVisit, storageKey]);

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
        <div className="relative mx-4 rounded-2xl border-4 border-black bg-gradient-to-b from-yellow-300 to-yellow-400 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          {/* Close button */}
          <button
            onClick={handleClose}
            disabled={status === "adding"}
            className="absolute right-3 top-3 rounded-lg border-2 border-black bg-white p-1 text-black transition-all hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Icon */}
          <div className="mb-4 flex justify-center">
            <div className="rounded-2xl border-4 border-black bg-pink-400 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="text-5xl">🍩</div>
            </div>
          </div>

          {/* Content */}
          <div className="mb-6 text-center">
            <h2 className="mb-2 text-3xl font-black text-black">
              TAKE ME WITH YOU! 
            </h2>
            <p className="text-sm font-bold text-black/70">
              Donut miss me and my shenanigans.
            </p>
          </div>

          {/* Error message */}
          {status === "error" && errorMessage && (
            <div className="mb-4 rounded-lg border-4 border-black bg-red-300 p-3 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <p className="text-sm font-black text-black">{errorMessage}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Button
              onClick={handleAddToFarcaster}
              disabled={status === "adding" || status === "success"}
              className={cn(
                "w-full gap-2 rounded-xl border-4 border-black py-6 text-lg font-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]",
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
              onClick={handleClose}
              disabled={status === "adding"}
              className="w-full rounded-xl border-4 border-black bg-white py-4 text-sm font-black text-black/60 hover:bg-gray-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]"
            >
              MAYBE LATER
            </Button>
          </div>

          {/* Benefits list */}
          <div className="mt-6 space-y-2 border-t-4 border-black border-dashed pt-4">
            <div className="flex items-center justify-center gap-2 text-sm font-bold text-black/80">
              <div className="text-lg">🚀</div>
              <span>Quick access from Farcaster</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm font-bold text-black/80">
              <div className="text-lg">🔔</div>
              <span>Get notified about your pet</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm font-bold text-black/80">
              <div className="text-lg">🎮</div>
              <span>Never miss feeding time</span>
            </div>
          </div>
        </div>
      </div>
    </>
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
