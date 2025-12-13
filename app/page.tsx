"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { sdk } from "@farcaster/miniapp-sdk";
import {
  useAccount,
  useConnect,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { base } from "wagmi/chains";
import { formatEther, formatUnits, zeroAddress, type Address } from "viem";

import { Button } from "@/components/ui/button";
import { CONTRACT_ADDRESSES, MULTICALL_ABI } from "@/lib/contracts";
import { getEthPrice } from "@/lib/utils";
import {
  calculateSessionEarnings,
  calculateDailyRate,
  calculateTokensUntilNextMilestone,
} from "@/lib/earnings";
import { getLifecycleStage, getDPSMultiplier, getLifecycleInfo, getAgeInDays } from "@/lib/traits";
import { useAccountData } from "@/hooks/useAccountData";
import { useTraits } from "@/hooks/useTraits";
import { NavBar } from "@/components/nav-bar";
import { DonutPet } from "@/components/donut-pet";
import { CollapsibleStats } from "@/components/collapsible-stats";
import { CollapsibleAdvanced } from "@/components/collapsible-advanced";
import { InteractionPanel } from "@/components/interaction-panel";
import { AddToFarcasterDialog } from "@/components/add-to-farcaster-dialog";
import { BreedingBadge } from "@/components/breeding-badge";
import { RetirementBadge } from "@/components/retirement-badge";
import { DecayStatus } from "@/components/decay-status";
import { CareGuide } from "@/components/care-guide";
import { AccordionProvider } from "@/components/accordion-context";

type MiniAppContext = {
  user?: {
    fid: number;
    username?: string;
    displayName?: string;
    pfpUrl?: string;
  };
};

type MinerState = {
  epochId: bigint | number;
  initPrice: bigint;
  startTime: bigint | number;
  glazed: bigint;
  price: bigint;
  dps: bigint;
  nextDps: bigint;
  donutPrice: bigint;
  miner: Address;
  uri: string;
  ethBalance: bigint;
  wethBalance: bigint;
  donutBalance: bigint;
};

const DONUT_DECIMALS = 18;
const DEADLINE_BUFFER_SECONDS = 15 * 60;

const toBigInt = (value: bigint | number) =>
  typeof value === "bigint" ? value : BigInt(value);

const formatTokenAmount = (
  value: bigint,
  decimals: number,
  maximumFractionDigits = 2,
) => {
  if (value === 0n) return "0";
  const asNumber = Number(formatUnits(value, decimals));
  if (!Number.isFinite(asNumber)) {
    return formatUnits(value, decimals);
  }
  return asNumber.toLocaleString(undefined, {
    maximumFractionDigits,
  });
};

const formatEth = (value: bigint, maximumFractionDigits = 4) => {
  if (value === 0n) return "0";
  const asNumber = Number(formatEther(value));
  if (!Number.isFinite(asNumber)) {
    return formatEther(value);
  }
  return asNumber.toLocaleString(undefined, {
    maximumFractionDigits,
  });
};

export default function HomePage() {
  const readyRef = useRef(false);
  const autoConnectAttempted = useRef(false);
  const [context, setContext] = useState<MiniAppContext | null>(null);
  const [ethUsdPrice, setEthUsdPrice] = useState<number>(3500);
  const [glazeResult, setGlazeResult] = useState<"success" | "failure" | null>(null);
  const [petResponse, setPetResponse] = useState<string>("");
  const [gesture, setGesture] = useState<"bounce" | "wiggle" | "jump" | "spin" | "nod" | null>(null);
  const [lastInteractionTime, setLastInteractionTime] = useState<number>(Date.now());
  const [sessionStartEarnings, setSessionStartEarnings] = useState<bigint | null>(null);
  const glazeResultTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetGlazeResult = useCallback(() => {
    if (glazeResultTimeoutRef.current) {
      clearTimeout(glazeResultTimeoutRef.current);
      glazeResultTimeoutRef.current = null;
    }
    setGlazeResult(null);
  }, []);

  const showGlazeResult = useCallback(
    (result: "success" | "failure") => {
      if (glazeResultTimeoutRef.current) {
        clearTimeout(glazeResultTimeoutRef.current);
      }
      setGlazeResult(result);
      glazeResultTimeoutRef.current = setTimeout(() => {
        setGlazeResult(null);
        glazeResultTimeoutRef.current = null;
      }, 3000);
    },
    [],
  );

  useEffect(() => {
    let cancelled = false;
    const hydrateContext = async () => {
      try {
        const ctx = (await (sdk as unknown as {
          context: Promise<MiniAppContext> | MiniAppContext;
        }).context) as MiniAppContext;
        if (!cancelled) {
          setContext(ctx);
        }
      } catch {
        if (!cancelled) setContext(null);
      }
    };
    hydrateContext();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (glazeResultTimeoutRef.current) {
        clearTimeout(glazeResultTimeoutRef.current);
      }
    };
  }, []);

  const getPetResponse = useCallback((message: string, state: "idle" | "happy" | "excited" | "hungry" | "sleeping" | "dead" | "bored" | "petting") => {
    const msg = message.toLowerCase();

    // Positive keywords
    const positive = ["love", "cute", "good", "nice", "sweet", "yum", "delicious", "tasty", "best", "amazing", "awesome", "great"];
    const negative = ["bad", "ugly", "hate", "gross", "yuck", "worst", "terrible"];
    const food = ["hungry", "feed", "eat", "food", "donut", "snack"];
    const greetings = ["hi", "hello", "hey", "sup", "yo"];

    const hasPositive = positive.some(word => msg.includes(word));
    const hasNegative = negative.some(word => msg.includes(word));
    const hasFood = food.some(word => msg.includes(word));
    const hasGreeting = greetings.some(word => msg.includes(word));

    // State-based responses
    if (state === "dead") {
      return hasPositive ? "💀 *ghost noises*" : "💀 Too late...";
    }

    if (state === "hungry") {
      if (hasFood) return "😟 Yes please! I'm starving!";
      if (hasPositive) return "😟 Thanks but... I need food!";
      return "😟 *stomach rumbles*";
    }

    if (state === "sleeping") {
      return "😴 Zzz... *snoring*";
    }

    if (state === "bored") {
      if (hasPositive) return "😑 Thanks, I guess...";
      if (hasFood) return "😑 Not really hungry...";
      return "😑 *yawn*";
    }

    if (state === "excited" || state === "happy" || state === "petting") {
      if (hasPositive) return "😊 Aww thanks! You're the best!";
      if (hasFood) return "🤩 More donuts? YES!";
      if (hasGreeting) return "😊 Hey there friend!";
      return "😊 *happy donut noises*";
    }

    // Message-based responses
    if (hasNegative) return "😢 That's not very nice...";
    if (hasPositive) return "😊 You're so sweet!";
    if (hasFood) return "🍩 Mmm, I love donuts!";
    if (hasGreeting) return "👋 Hello!";

    // Default responses
    const defaults = [
      "🍩 *wiggles happily*",
      "😊 *blinks*",
      "🍩 I'm listening!",
      "😊 Tell me more!",
      "🍩 *donut sounds*"
    ];

    return defaults[Math.floor(Math.random() * defaults.length)];
  }, []);

  const handleMessageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomMessage(value);

    // Clear existing timeout
    if (petResponseTimeoutRef.current) {
      clearTimeout(petResponseTimeoutRef.current);
    }

    // Show response after user stops typing (500ms delay)
    if (value.trim().length > 2) {
      petResponseTimeoutRef.current = setTimeout(() => {
        const response = getPetResponse(value, petState.state);
        setPetResponse(response);

        // Clear response after 3 seconds
        setTimeout(() => setPetResponse(""), 3000);
      }, 500);
    } else {
      setPetResponse("");
    }
  }, [getPetResponse]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!readyRef.current) {
        readyRef.current = true;
        sdk.actions.ready().catch(() => { });
      }
    }, 1200);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const fetchPrice = async () => {
      const price = await getEthPrice();
      setEthUsdPrice(price);
    };
    fetchPrice();
    const interval = setInterval(fetchPrice, 60_000);
    return () => clearInterval(interval);
  }, []);

  const { address, isConnected } = useAccount();
  const { connectors, connectAsync, isPending: isConnecting } = useConnect();
  const primaryConnector = connectors[0];

  useEffect(() => {
    if (
      autoConnectAttempted.current ||
      isConnected ||
      !primaryConnector ||
      isConnecting
    ) {
      return;
    }
    autoConnectAttempted.current = true;
    connectAsync({
      connector: primaryConnector,
      chainId: base.id,
    }).catch(() => { });
  }, [connectAsync, isConnected, isConnecting, primaryConnector]);

  const { data: rawMinerState, refetch: refetchMinerState } = useReadContract({
    address: CONTRACT_ADDRESSES.multicall,
    abi: MULTICALL_ABI,
    functionName: "getMiner",
    args: [address ?? zeroAddress],
    chainId: base.id,
    query: {
      refetchInterval: 3_000,
    },
  });

  const minerState = useMemo(() => {
    if (!rawMinerState) return undefined;
    return rawMinerState as unknown as MinerState;
  }, [rawMinerState]);

  const { data: accountData } = useAccountData(address);

  useEffect(() => {
    if (!readyRef.current && minerState) {
      readyRef.current = true;
      sdk.actions.ready().catch(() => { });
    }
    // Set session start earnings on first load
    if (minerState && sessionStartEarnings === null) {
      setSessionStartEarnings(minerState.glazed);
    }
  }, [minerState, sessionStartEarnings]);

  const {
    data: txHash,
    writeContract,
    isPending: isWriting,
    reset: resetWrite,
  } = useWriteContract();

  const { data: receipt, isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash: txHash,
    chainId: base.id,
  });

  useEffect(() => {
    if (!receipt) return;
    if (receipt.status === "success" || receipt.status === "reverted") {
      showGlazeResult(receipt.status === "success" ? "success" : "failure");
      refetchMinerState();
      const resetTimer = setTimeout(() => {
        resetWrite();
      }, 500);
      return () => clearTimeout(resetTimer);
    }
    return;
  }, [receipt, refetchMinerState, resetWrite, showGlazeResult]);

  const minerAddress = minerState?.miner ?? zeroAddress;
  const hasMiner = minerAddress !== zeroAddress;

  // Get traits for the miner (includes decay calculations)
  const { traits } = useTraits({
    minerAddress: hasMiner ? minerAddress : zeroAddress,
    lastInteractionTime,
    lastFedTime: minerState?.startTime ? Number(minerState.startTime) * 1000 : Date.now(),
    currentTime: Date.now(),
  });

  const { data: neynarUser } = useQuery<{
    user: {
      fid: number | null;
      username: string | null;
      displayName: string | null;
      pfpUrl: string | null;
    } | null;
  }>({
    queryKey: ["neynar-user", minerAddress],
    queryFn: async () => {
      const res = await fetch(
        `/api/neynar/user?address=${encodeURIComponent(minerAddress)}`,
      );
      if (!res.ok) {
        throw new Error("Failed to load Farcaster profile.");
      }
      return (await res.json()) as {
        user: {
          fid: number | null;
          username: string | null;
          displayName: string | null;
          pfpUrl: string | null;
        } | null;
      };
    },
    enabled: hasMiner,
    staleTime: 60_000,
    retry: false,
  });

  const handlePetting = useCallback(() => {
    setGesture("nod");
    setLastInteractionTime(Date.now());
  }, []);

  const handleShake = useCallback(() => {
    setGesture("wiggle");
    setLastInteractionTime(Date.now());
  }, []);

  const handleGesture = useCallback((gesture: "bounce" | "wiggle" | "jump" | "spin" | "nod") => {
    setGesture(gesture);
    setLastInteractionTime(Date.now());
  }, []);

  const handleGlaze = useCallback(async () => {
    if (!minerState) return;
    resetGlazeResult();
    setLastInteractionTime(Date.now());
    setGesture("bounce");
    try {
      let targetAddress = address;
      if (!targetAddress) {
        if (!primaryConnector) {
          throw new Error("Wallet connector not available yet.");
        }
        const result = await connectAsync({
          connector: primaryConnector,
          chainId: base.id,
        });
        targetAddress = result.accounts[0];
      }
      if (!targetAddress) {
        throw new Error("Unable to determine wallet address.");
      }
      const price = minerState.price;
      const epochId = toBigInt(minerState.epochId);
      const deadline = BigInt(
        Math.floor(Date.now() / 1000) + DEADLINE_BUFFER_SECONDS,
      );
      const maxPrice = price === 0n ? 0n : (price * 105n) / 100n;
      await writeContract({
        account: targetAddress as Address,
        address: CONTRACT_ADDRESSES.multicall as Address,
        abi: MULTICALL_ABI,
        functionName: "mine",
        args: [
          CONTRACT_ADDRESSES.provider as Address,
          epochId,
          deadline,
          maxPrice,
          "Feeding my Donutamagotchi",
        ],
        value: price,
        chainId: base.id,
      });
    } catch (error) {
      console.error("Failed to feed:", error);
      showGlazeResult("failure");
      resetWrite();
    }
  }, [
    address,
    connectAsync,
    minerState,
    primaryConnector,
    resetGlazeResult,
    resetWrite,
    showGlazeResult,
    writeContract,
  ]);

  const [interpolatedGlazed, setInterpolatedGlazed] = useState<bigint | null>(null);
  const [glazeElapsedSeconds, setGlazeElapsedSeconds] = useState<number>(0);

  useEffect(() => {
    if (!minerState) {
      setInterpolatedGlazed(null);
      return;
    }
    setInterpolatedGlazed(minerState.glazed);
    const interval = setInterval(() => {
      if (minerState.nextDps > 0n) {
        setInterpolatedGlazed((prev) => {
          if (!prev) return minerState.glazed;
          return prev + minerState.nextDps;
        });
      }
    }, 1_000);
    return () => clearInterval(interval);
  }, [minerState]);

  useEffect(() => {
    if (!minerState) {
      setGlazeElapsedSeconds(0);
      return;
    }
    const startTimeSeconds = Number(minerState.startTime);
    const initialElapsed = Math.floor(Date.now() / 1000) - startTimeSeconds;
    setGlazeElapsedSeconds(initialElapsed);
    const interval = setInterval(() => {
      const currentElapsed = Math.floor(Date.now() / 1000) - startTimeSeconds;
      setGlazeElapsedSeconds(currentElapsed);
    }, 1_000);
    return () => clearInterval(interval);
  }, [minerState]);

  const glazedDisplay = minerState && interpolatedGlazed !== null
    ? formatTokenAmount(interpolatedGlazed, DONUT_DECIMALS, 2)
    : "0";

  const formatGlazeTime = (seconds: number): string => {
    if (seconds < 0) return "0s";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${secs}s`;
    return `${secs}s`;
  };

  const glazeTimeDisplay = minerState ? formatGlazeTime(glazeElapsedSeconds) : "0s";

  // Calculate age in days for retirement eligibility
  const ageInDays = Math.floor(glazeElapsedSeconds / 86400);

  const petState = useMemo(() => {
    if (!minerState) return { state: "sleeping" as const, happiness: 0, health: 0 };

    const maxDps = 4e18;
    const happiness = Math.min(100, (Number(minerState.nextDps) / maxDps) * 100);
    const health = minerState.initPrice > 0n
      ? Math.min(100, (Number(minerState.price) / (Number(minerState.initPrice) * 2)) * 100)
      : 0;

    // Boredom: no interaction for 5+ minutes
    const timeSinceInteraction = (Date.now() - lastInteractionTime) / 1000;
    const isBored = timeSinceInteraction > 300 && happiness < 60;

    let state: "idle" | "happy" | "excited" | "hungry" | "sleeping" | "dead" | "bored" | "petting" = "idle";

    if (health < 5) state = "dead";
    else if (health < 30) state = "hungry";
    else if (isWriting || isConfirming) state = "excited";
    else if (glazeResult === "success") state = "excited";
    else if (isBored) state = "bored";
    else if (happiness > 70) state = "happy";
    else if (glazeElapsedSeconds < 60) state = "excited";
    else if (!hasMiner) state = "sleeping";

    return { state, happiness, health };
  }, [minerState, isWriting, isConfirming, glazeResult, glazeElapsedSeconds, hasMiner, lastInteractionTime]);

  // Get lifecycle stage from elapsed time
  const lifecycleStage = getLifecycleStage(ageInDays);

  // Calculate earnings metrics using utility functions
  const sessionEarnings = useMemo(() => {
    return calculateSessionEarnings(sessionStartEarnings, interpolatedGlazed);
  }, [sessionStartEarnings, interpolatedGlazed]);

  const dailyEarningRate = useMemo(() => {
    if (!minerState) return 0;
    const baseRate = calculateDailyRate(minerState.nextDps, glazeElapsedSeconds);
    const dpsMultiplier = getDPSMultiplier(lifecycleStage, ageInDays);
    return baseRate * dpsMultiplier;
  }, [minerState, glazeElapsedSeconds, lifecycleStage, ageInDays]);

  const tokensUntilNextMilestone = useMemo(() => {
    return calculateTokensUntilNextMilestone(sessionEarnings);
  }, [sessionEarnings]);

  const buttonLabel = useMemo(() => {
    if (!minerState) return "LOADING...";
    if (glazeResult === "success") return "YUM! 😋";
    if (glazeResult === "failure") return "FAILED 😢";
    if (isWriting || isConfirming) return "FEEDING...";
    return "🍩 FEED";
  }, [glazeResult, isConfirming, isWriting, minerState]);

  const isGlazeDisabled = !minerState || isWriting || isConfirming || glazeResult !== null;

  const feedCost = minerState ? `Ξ${formatEth(minerState.price, 5)}` : "Ξ0";
  const feedCostUsd = minerState
    ? `$${(Number(formatEther(minerState.price)) * ethUsdPrice).toFixed(2)}`
    : "$0";

  const ownerName = neynarUser?.user?.displayName ||
    neynarUser?.user?.username ||
    (hasMiner ? `${minerAddress.slice(0, 6)}...${minerAddress.slice(-4)}` : "Nobody");

  return (
    <main className="flex h-screen w-screen justify-center overflow-hidden bg-gradient-to-b from-purple-900 via-pink-900 to-orange-900 font-mono text-white">
      <AddToFarcasterDialog showOnFirstVisit={true} />
      <AccordionProvider mode="single">
        <div
          className="relative flex h-full w-full max-w-[520px] flex-1 flex-col overflow-hidden px-3 pb-3"
          style={{
            paddingTop: "calc(env(safe-area-inset-top, 0px) + 8px)",
            paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 80px)",
          }}
        >
          <div className="flex flex-1 flex-col overflow-y-auto space-y-2">
            {/* Header */}
            <div className="bg-yellow-300 border-4 border-black rounded-2xl p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h1 className="text-2xl font-black text-center text-black tracking-tight">
                DONUTAMAGOTCHI
              </h1>
              <p className="text-center text-[10px] text-black/70 font-bold mt-0.5">
                OWNER: {ownerName}
              </p>
            </div>

            {/* Pet Display */}
            <div
              className="bg-cyan-300 border-4 border-black rounded-2xl p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-shadow"
              onClick={handlePetting}
              onDoubleClick={() => handleGesture("jump")}
            >
              <DonutPet
                state={petState.state}
                happiness={petState.happiness}
                health={petState.health}
                isAnimating={isWriting || isConfirming}
                gesture={gesture}
                onGestureComplete={() => setGesture(null)}
                traits={traits}
                createdAtSeconds={minerState?.startTime ? Number(minerState.startTime) : undefined}
              />
            </div>

            {/* Collapsible Stats (now always shows status indicator + key stats) */}
            <CollapsibleStats
              happiness={petState.happiness}
              health={petState.health}
              energy={glazedDisplay}
              age={glazeTimeDisplay}
              ageInDays={ageInDays}
              grooming={traits?.grooming ?? 50}
              energyLevel={traits?.energy ?? 50}
              satisfaction={traits?.satisfaction ?? 50}
              isDying={petState.state === "dead"}
              lastFedTime={minerState?.startTime ? Number(minerState.startTime) * 1000 : Date.now()}
              sessionEarnings={sessionEarnings}
              dailyEarningRate={dailyEarningRate}
              tokensUntilNextMilestone={tokensUntilNextMilestone}
            />

            {/* Interaction Panel - Core gameplay action */}
            <InteractionPanel
              petResponse={petResponse}
              isDisabled={isGlazeDisabled}
              onGesture={handleGesture}
              petState={petState.state}
            />

            {/* PROGRESSIVE DISCLOSURE: Show How to Play prominently for new users */}
            {/* CareGuide auto-expands for donuts < 7 days old */}
            {hasMiner && <CareGuide ageInDays={ageInDays} />}

            {/* Breeding Badge - Progressive: hidden early, teaser approaching, full when ready */}
            {hasMiner && (
              <BreedingBadge
                lifecycleStage={lifecycleStage}
                happiness={petState.happiness}
                ageInDays={ageInDays}
              />
            )}

            {/* Retirement Badge - Progressive: hidden until 60 days, teaser 60-89, full at 90+ */}
            {hasMiner && (
              <RetirementBadge ageInDays={ageInDays} />
            )}

            {/* Advanced Features - Only show for older donuts (7+ days) */}
            {hasMiner && ageInDays >= 7 && (
              <CollapsibleAdvanced
                traits={traits}
                lastInteractionTime={lastInteractionTime}
                lastFedTime={minerState?.startTime ? Number(minerState.startTime) * 1000 : Date.now()}
                createdAtSeconds={minerState?.startTime ? Number(minerState.startTime) : 0}
                hasMiner={hasMiner}
                minerState={minerState}
                ageInDays={ageInDays}
              />
            )}

            {/* Feed Button */}
            <Button
              className="w-full h-14 rounded-2xl bg-gradient-to-b from-pink-400 to-pink-600 border-4 border-black text-black text-lg font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              onClick={handleGlaze}
              disabled={isGlazeDisabled}
            >
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-base">{buttonLabel}</span>
                <span className="text-[10px] font-bold">{feedCost} ({feedCostUsd})</span>
              </div>
            </Button>

            {/* Breeding Badge - Progressive: hidden early, teaser approaching, full when ready */}
            {hasMiner && (
              <BreedingBadge
                lifecycleStage={lifecycleStage}
                happiness={petState.happiness}
                ageInDays={ageInDays}
              />
            )}

            {/* Retirement Badge - Progressive: hidden until 60 days, teaser 60-89, full at 90+ */}
            {hasMiner && (
              <RetirementBadge ageInDays={ageInDays} />
            )}

            {/* Advanced Features - Only show for older donuts (7+ days) */}
            {hasMiner && ageInDays >= 7 && (
              <CollapsibleAdvanced
                traits={traits}
                lastInteractionTime={lastInteractionTime}
                lastFedTime={minerState?.startTime ? Number(minerState.startTime) * 1000 : Date.now()}
                createdAtSeconds={minerState?.startTime ? Number(minerState.startTime) : 0}
                hasMiner={hasMiner}
                minerState={minerState}
                ageInDays={ageInDays}
              />
            )}

            {/* Wallet Info */}
            {address && (
              <div className="bg-lime-300 border-4 border-black rounded-xl p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="grid grid-cols-3 gap-1 text-center">
                  <div>
                    <div className="text-[8px] font-black text-black/60">DONUTS</div>
                    <div className="text-xs font-black text-black">
                      {minerState ? formatTokenAmount(minerState.donutBalance, DONUT_DECIMALS, 0) : "0"}
                    </div>
                  </div>
                  <div>
                    <div className="text-[8px] font-black text-black/60">ETH</div>
                    <div className="text-xs font-black text-black">
                      {minerState ? formatEth(minerState.ethBalance, 3) : "0"}
                    </div>
                  </div>
                  <div>
                    <div className="text-[8px] font-black text-black/60">WETH</div>
                    <div className="text-xs font-black text-black">
                      {minerState ? formatEth(minerState.wethBalance, 3) : "0"}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <NavBar />
      </AccordionProvider>
    </main>
  );
}