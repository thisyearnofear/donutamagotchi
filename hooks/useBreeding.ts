import { useCallback, useState } from "react";
import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from "wagmi";
import { base } from "wagmi/chains";
import type { Address } from "viem";

import { CONTRACT_ADDRESSES, BREEDING_ABI, DONUTAMAGOTCHI_TOKEN_ABI } from "@/lib/contracts";

export interface BreedingStatus {
  canBreed: boolean;
  cooldownRemaining: number; // seconds remaining
  generation: number;
}

export interface OffspringData {
  tokenId: bigint;
  parentAMiner: Address;
  parentBMiner: Address;
  owner: Address;
  createdAt: bigint;
  generation: number;
  geneticData: string;
}

/**
 * Hook for breeding mechanics
 * Handles:
 * - Token approval for breeding cost
 * - Breeding transaction
 * - Cooldown tracking
 * - Offspring retrieval
 */
export function useBreeding(minerAddress?: Address) {
  const [breeding, setBreeding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { address } = useAccount();

  // Get breeding cooldown for this miner
  const { data: cooldownData, refetch: refetchCooldown } = useReadContract({
    address: CONTRACT_ADDRESSES.donutBreeding as Address,
    abi: BREEDING_ABI,
    functionName: "getBreedingCooldown",
    args: minerAddress ? [minerAddress] : undefined,
    chainId: base.id,
    query: {
      enabled: !!minerAddress,
      refetchInterval: 30_000, // Refetch every 30s
    },
  });

  // Get generation for this miner
  const { data: generationData } = useReadContract({
    address: CONTRACT_ADDRESSES.donutBreeding as Address,
    abi: BREEDING_ABI,
    functionName: "getMaxGenerationForMiner",
    args: minerAddress ? [minerAddress] : undefined,
    chainId: base.id,
    query: {
      enabled: !!minerAddress,
    },
  });

  // Get all offspring by owner
  const { data: userOffspring, refetch: refetchOffspring } = useReadContract({
    address: CONTRACT_ADDRESSES.donutBreeding as Address,
    abi: BREEDING_ABI,
    functionName: "getOffspringByOwner",
    args: minerAddress ? [minerAddress] : undefined,
    chainId: base.id,
    query: {
      enabled: !!minerAddress,
    },
  });

  // Token approval for breeding cost
  const {
    writeContract: approveToken,
    isPending: isApproving,
    data: approveTxHash,
  } = useWriteContract();

  const { data: approveReceipt, isLoading: isConfirmingApproval } =
    useWaitForTransactionReceipt({
      hash: approveTxHash,
      chainId: base.id,
    });

  // Breeding transaction
  const {
    writeContract: performBreeding,
    isPending: isBreeding,
    data: breedingTxHash,
  } = useWriteContract();

  const { data: breedingReceipt, isLoading: isConfirmingBreeding } =
    useWaitForTransactionReceipt({
      hash: breedingTxHash,
      chainId: base.id,
    });

  // Approve token spending for breeding
  const handleApproveToken = useCallback(async () => {
    if (!minerAddress) {
      setError("Miner address required");
      return;
    }

    try {
      setError(null);
      const breedingCost = 1000n * 10n ** 18n; // 1000 tokens with 18 decimals

      approveToken({
        address: CONTRACT_ADDRESSES.donutamagotchiToken as Address,
        abi: DONUTAMAGOTCHI_TOKEN_ABI,
        functionName: "approve",
        args: [CONTRACT_ADDRESSES.donutBreeding as Address, breedingCost],
        chainId: base.id,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Approval failed");
    }
  }, [minerAddress, approveToken]);

  // Perform breeding
  const handleBreed = useCallback(
    async (parentAMiner: Address, parentBMiner: Address) => {
      if (!minerAddress || !address) {
        setError("Miner address and wallet connection required");
        return;
      }

      try {
        setError(null);
        setBreeding(true);

        // 1. Get Signature from API
        const response = await fetch("/api/breeding/sign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            parentAMiner,
            parentBMiner,
            userAddress: address
          })
        });

        if (!response.ok) throw new Error("Failed to get breeding signature");

        const { signature, geneticData } = await response.json();

        // 2. Submit Transaction
        performBreeding({
          address: CONTRACT_ADDRESSES.donutBreeding as Address,
          abi: BREEDING_ABI,
          functionName: "breed",
          args: [parentAMiner, parentBMiner, geneticData, signature],
          chainId: base.id,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Breeding failed");
        setBreeding(false);
      }
    },
    [minerAddress, address, performBreeding]
  );

  // Get breeding status for a miner
  const getBreedingStatus = useCallback((): BreedingStatus => {
    return {
      canBreed: !cooldownData || cooldownData === 0n,
      cooldownRemaining: cooldownData ? Number(cooldownData) : 0,
      generation: generationData ? Number(generationData) : 0,
    };
  }, [cooldownData, generationData]);

  // Format cooldown for display
  const formatCooldown = useCallback((seconds: number): string => {
    if (seconds <= 0) return "Ready to breed!";

    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);

    if (days > 0) return `${days}d ${hours}h remaining`;
    if (hours > 0) return `${hours}h ${mins}m remaining`;
    return `${mins}m remaining`;
  }, []);

  return {
    // Status
    breeding: breeding || isBreeding || isConfirmingBreeding,
    approving: isApproving || isConfirmingApproval,
    error,

    // Handlers
    handleApproveToken,
    handleBreed,

    // Data
    breedingStatus: getBreedingStatus(),
    userOffspring: (userOffspring as bigint[]) || [],
    cooldownRemaining: cooldownData ? Number(cooldownData) : 0,
    generation: generationData ? Number(generationData) : 0,

    // Utilities
    formatCooldown,
    refetchCooldown,
    refetchOffspring,

    // Transaction status
    approveTxHash,
    breedingTxHash,
    isApprovalConfirmed: approveReceipt?.status === "success",
    isBreedingConfirmed: breedingReceipt?.status === "success",
  };
}
