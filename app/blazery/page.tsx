"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import {
  useAccount,
  useConnect,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { base } from "wagmi/chains";
import { formatEther, zeroAddress, type Address } from "viem";

import { Button } from "@/components/ui/button";
import { CONTRACT_ADDRESSES, MULTICALL_ABI } from "@/lib/contracts";
import { getEthPrice } from "@/lib/utils";
import { NavBar } from "@/components/nav-bar";

type MiniAppContext = {
  user?: {
    fid: number;
    username?: string;
    displayName?: string;
    pfpUrl?: string;
  };
};

type AuctionState = {
  epochId: bigint | number;
  initPrice: bigint;
  startTime: bigint | number;
  paymentToken: Address;
  price: bigint;
  paymentTokenPrice: bigint;
  wethAccumulated: bigint;
  wethBalance: bigint;
  paymentTokenBalance: bigint;
};

const DEADLINE_BUFFER_SECONDS = 5 * 60;
const LP_TOKEN_ADDRESS = "0xD1DbB2E56533C55C3A637D13C53aeEf65c5D5703" as Address;

const toBigInt = (value: bigint | number) =>
  typeof value === "bigint" ? value : BigInt(value);

const formatEth = (value: bigint, maximumFractionDigits = 4) => {
  if (value === 0n) return "0";
  const asNumber = Number(formatEther(value));
  if (!Number.isFinite(asNumber)) return formatEther(value);
  return asNumber.toLocaleString(undefined, { maximumFractionDigits });
};

const ERC20_ABI = [
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export default function BlazeryPage() {
  const readyRef = useRef(false);
  const autoConnectAttempted = useRef(false);
  const [context, setContext] = useState<MiniAppContext | null>(null);
  const [ethUsdPrice, setEthUsdPrice] = useState<number>(3500);
  const [blazeResult, setBlazeResult] = useState<"success" | "failure" | null>(null);
  const [txStep, setTxStep] = useState<"idle" | "approving" | "buying">("idle");
  const blazeResultTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetBlazeResult = useCallback(() => {
    if (blazeResultTimeoutRef.current) {
      clearTimeout(blazeResultTimeoutRef.current);
      blazeResultTimeoutRef.current = null;
    }
    setBlazeResult(null);
  }, []);

  const showBlazeResult = useCallback((result: "success" | "failure") => {
    if (blazeResultTimeoutRef.current) {
      clearTimeout(blazeResultTimeoutRef.current);
    }
    setBlazeResult(result);
    blazeResultTimeoutRef.current = setTimeout(() => {
      setBlazeResult(null);
      blazeResultTimeoutRef.current = null;
    }, 3000);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const hydrateContext = async () => {
      try {
        const ctx = (await (sdk as unknown as {
          context: Promise<MiniAppContext> | MiniAppContext;
        }).context) as MiniAppContext;
        if (!cancelled) setContext(ctx);
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
    const fetchPrice = async () => {
      const price = await getEthPrice();
      setEthUsdPrice(price);
    };
    fetchPrice();
    const interval = setInterval(fetchPrice, 60_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    return () => {
      if (blazeResultTimeoutRef.current) {
        clearTimeout(blazeResultTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!readyRef.current) {
        readyRef.current = true;
        sdk.actions.ready().catch(() => {});
      }
    }, 1200);
    return () => clearTimeout(timeout);
  }, []);

  const { address, isConnected } = useAccount();
  const { connectors, connectAsync, isPending: isConnecting } = useConnect();
  const primaryConnector = connectors[0];

  useEffect(() => {
    if (autoConnectAttempted.current || isConnected || !primaryConnector || isConnecting) {
      return;
    }
    autoConnectAttempted.current = true;
    connectAsync({
      connector: primaryConnector,
      chainId: base.id,
    }).catch(() => {});
  }, [connectAsync, isConnected, isConnecting, primaryConnector]);

  const { data: rawAuctionState, refetch: refetchAuctionState } = useReadContract({
    address: CONTRACT_ADDRESSES.multicall,
    abi: MULTICALL_ABI,
    functionName: "getAuction",
    args: [address ?? zeroAddress],
    chainId: base.id,
    query: {
      refetchInterval: 3_000,
    },
  });

  const auctionState = useMemo(() => {
    if (!rawAuctionState) return undefined;
    return rawAuctionState as unknown as AuctionState;
  }, [rawAuctionState]);

  useEffect(() => {
    if (!readyRef.current && auctionState) {
      readyRef.current = true;
      sdk.actions.ready().catch(() => {});
    }
  }, [auctionState]);

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

  const handleBlaze = useCallback(async () => {
    if (!auctionState) return;
    resetBlazeResult();
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

      const price = auctionState.price;
      const epochId = toBigInt(auctionState.epochId);
      const deadline = BigInt(Math.floor(Date.now() / 1000) + DEADLINE_BUFFER_SECONDS);
      const maxPaymentTokenAmount = price;

      if (txStep === "idle") {
        setTxStep("approving");
        await writeContract({
          account: targetAddress as Address,
          address: LP_TOKEN_ADDRESS,
          abi: ERC20_ABI,
          functionName: "approve",
          args: [CONTRACT_ADDRESSES.multicall as Address, price],
          chainId: base.id,
        });
        return;
      }

      if (txStep === "buying") {
        await writeContract({
          account: targetAddress as Address,
          address: CONTRACT_ADDRESSES.multicall as Address,
          abi: MULTICALL_ABI,
          functionName: "buy",
          args: [epochId, deadline, maxPaymentTokenAmount],
          chainId: base.id,
        });
      }
    } catch (error) {
      console.error("Failed to buy:", error);
      showBlazeResult("failure");
      setTxStep("idle");
      resetWrite();
    }
  }, [address, connectAsync, auctionState, primaryConnector, resetBlazeResult, resetWrite, showBlazeResult, writeContract, txStep]);

  useEffect(() => {
    if (!receipt) return;
    if (receipt.status === "success" || receipt.status === "reverted") {
      if (receipt.status === "reverted") {
        showBlazeResult("failure");
        setTxStep("idle");
        refetchAuctionState();
        const resetTimer = setTimeout(() => resetWrite(), 500);
        return () => clearTimeout(resetTimer);
      }

      if (txStep === "approving") {
        resetWrite();
        setTxStep("buying");
        return;
      }

      if (txStep === "buying") {
        showBlazeResult("success");
        setTxStep("idle");
        refetchAuctionState();
        const resetTimer = setTimeout(() => resetWrite(), 500);
        return () => clearTimeout(resetTimer);
      }
    }
    return;
  }, [receipt, refetchAuctionState, resetWrite, showBlazeResult, txStep]);

  useEffect(() => {
    if (txStep === "buying" && !isWriting && !isConfirming && !txHash) {
      handleBlaze();
    }
  }, [txStep, isWriting, isConfirming, txHash, handleBlaze]);

  const auctionPriceDisplay = auctionState ? formatEth(auctionState.price, 5) : "0";
  const claimableDisplay = auctionState ? formatEth(auctionState.wethAccumulated, 8) : "0";

  const buttonLabel = useMemo(() => {
    if (!auctionState) return "LOADING...";
    if (blazeResult === "success") return "SUCCESS! 🎉";
    if (blazeResult === "failure") return "FAILED 😢";
    if (isWriting || isConfirming) {
      if (txStep === "approving") return "APPROVING...";
      if (txStep === "buying") return "BUYING...";
      return "PROCESSING...";
    }
    return "🔥 BUY & BURN";
  }, [blazeResult, isConfirming, isWriting, auctionState, txStep]);

  const hasInsufficientLP = auctionState && auctionState.paymentTokenBalance < auctionState.price;

  const profitLoss = useMemo(() => {
    if (!auctionState) return null;
    const lpValueInEth = Number(formatEther(auctionState.price)) * Number(formatEther(auctionState.paymentTokenPrice));
    const lpValueInUsd = lpValueInEth * ethUsdPrice;
    const wethReceivedInEth = Number(formatEther(auctionState.wethAccumulated));
    const wethValueInUsd = wethReceivedInEth * ethUsdPrice;
    const profitLoss = wethValueInUsd - lpValueInUsd;
    return {
      profitLoss,
      isProfitable: profitLoss > 0,
      lpValueInUsd,
      wethValueInUsd,
    };
  }, [auctionState, ethUsdPrice]);

  const isBlazeDisabled = !auctionState || isWriting || isConfirming || blazeResult !== null || hasInsufficientLP;

  return (
    <main className="flex h-screen w-screen justify-center overflow-hidden bg-gradient-to-b from-purple-900 via-pink-900 to-orange-900 font-mono text-white">
      <div
        className="relative flex h-full w-full max-w-[520px] flex-1 flex-col overflow-hidden px-4 pb-4"
        style={{
          paddingTop: "calc(env(safe-area-inset-top, 0px) + 16px)",
          paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 80px)",
        }}
      >
        <div className="flex flex-1 flex-col overflow-y-auto space-y-3">
          <div className="bg-yellow-300 border-4 border-black rounded-2xl p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h1 className="text-3xl font-black text-center text-black tracking-tight">
              DONUT SHOP
            </h1>
            <p className="text-center text-xs text-black/70 font-bold mt-1">
              BUY & BURN LP TOKENS
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-pink-300 border-4 border-black rounded-xl p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="text-[10px] font-black text-black/60 mb-1">YOU PAY</div>
              <div className="text-xl font-black text-black">{auctionPriceDisplay}</div>
              <div className="text-[10px] font-black text-black/60">LP TOKENS</div>
              <div className="text-xs font-bold text-black/80 mt-1">
                $
                {auctionState
                  ? (
                      Number(formatEther(auctionState.price)) *
                      Number(formatEther(auctionState.paymentTokenPrice)) *
                      ethUsdPrice
                    ).toFixed(2)
                  : "0.00"}
              </div>
            </div>

            <div className="bg-cyan-300 border-4 border-black rounded-xl p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="text-[10px] font-black text-black/60 mb-1">YOU GET</div>
              <div className="text-xl font-black text-black">Ξ{claimableDisplay}</div>
              <div className="text-[10px] font-black text-black/60">WETH</div>
              <div className="text-xs font-bold text-black/80 mt-1">
                $
                {auctionState
                  ? (Number(formatEther(auctionState.wethAccumulated)) * ethUsdPrice).toFixed(2)
                  : "0.00"}
              </div>
            </div>
          </div>

          {profitLoss && (
            <div className={`border-4 border-black rounded-xl p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
              profitLoss.isProfitable ? "bg-green-300" : "bg-red-300"
            }`}>
              <div className="text-center text-sm font-black text-black">
                {profitLoss.isProfitable ? "💰 PROFITABLE!" : "⚠️ UNPROFITABLE"}
              </div>
              <div className="text-center text-xs font-bold text-black/80 mt-1">
                {profitLoss.profitLoss >= 0 ? "+" : ""}${profitLoss.profitLoss.toFixed(2)}
              </div>
            </div>
          )}

          <Button
            className="w-full h-16 rounded-2xl bg-gradient-to-b from-orange-400 to-orange-600 border-4 border-black text-black text-xl font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            onClick={handleBlaze}
            disabled={isBlazeDisabled}
          >
            {buttonLabel}
          </Button>

          <div className="bg-white border-4 border-black rounded-xl p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between">
              <div className="text-xs font-black text-black">
                YOUR LP: {address && auctionState?.paymentTokenBalance
                  ? formatEth(auctionState.paymentTokenBalance, 4)
                  : "0"}
              </div>
              <a
                href="https://app.uniswap.org/explore/pools/base/0xD1DbB2E56533C55C3A637D13C53aeEf65c5D5703"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-black text-pink-600 hover:text-pink-700 transition-colors"
              >
                GET LP →
              </a>
            </div>
          </div>

          <div className="bg-lime-300 border-4 border-black rounded-xl p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-xs font-black text-black/80 space-y-1">
              <p>💡 This burns LP tokens to reduce supply and increase DONUT value!</p>
              <p>🔥 Treasury uses 15% of all feeds to buy & burn LP</p>
            </div>
          </div>
        </div>
      </div>
      <NavBar />
    </main>
  );
}
