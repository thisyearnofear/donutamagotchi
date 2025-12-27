/**
 * Unified hook for $DONUTAMAGOTCHI token operations
 * 
 * Provides a single source of truth for:
 * - Token balances (wallet + staked)
 * - Staking/unstaking
 * - Care streak info
 * - DPS boost status
 * - Pending fees
 * 
 * Design: ENHANCEMENT FIRST - consolidates token interactions
 */

import { useCallback, useMemo } from "react";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { base } from "wagmi/chains";
import type { Address } from "viem";
import { formatUnits } from "viem";

import { CONTRACT_ADDRESSES, DONUTAMAGOTCHI_TOKEN_ABI } from "@/lib/contracts";

// Types
export interface TokenStats {
    balance: bigint;
    staked: bigint;
    careStreak: number;
    careMultiplier: number;
    totalCareEarnings: bigint;
    hasDpsBoost: boolean;
    pendingFees: bigint;
}

export interface CareInfo {
    streak: number;
    multiplier: number;
    totalRewards: bigint;
    lastCare: number;
    streakActive: boolean;
    actionsToday: number;
}

export interface StakingInfo {
    staked: bigint;
    pending: bigint;
    hasDpsBoost: boolean;
    totalStakedGlobal: bigint;
    feePoolBalance: bigint;
}

// Check if token contract is deployed
const isTokenDeployed = CONTRACT_ADDRESSES.donutamagotchiToken !== "0x0000000000000000000000000000000000000000";

export function useDonutamagotchiToken() {
    const { address } = useAccount();

    // ============ Read Operations ============

    // Get comprehensive user stats
    const { data: userStats, refetch: refetchStats } = useReadContract({
        address: CONTRACT_ADDRESSES.donutamagotchiToken as Address,
        abi: DONUTAMAGOTCHI_TOKEN_ABI,
        functionName: "getUserStats",
        args: address ? [address] : undefined,
        chainId: base.id,
        query: {
            enabled: !!address && isTokenDeployed,
            refetchInterval: 30_000,
        },
    });

    // Get care info
    const { data: careInfoRaw, refetch: refetchCareInfo } = useReadContract({
        address: CONTRACT_ADDRESSES.donutamagotchiToken as Address,
        abi: DONUTAMAGOTCHI_TOKEN_ABI,
        functionName: "getCareInfo",
        args: address ? [address] : undefined,
        chainId: base.id,
        query: {
            enabled: !!address && isTokenDeployed,
            refetchInterval: 60_000,
        },
    });

    // Get staking info
    const { data: stakingInfoRaw, refetch: refetchStaking } = useReadContract({
        address: CONTRACT_ADDRESSES.donutamagotchiToken as Address,
        abi: DONUTAMAGOTCHI_TOKEN_ABI,
        functionName: "getStakingInfo",
        args: address ? [address] : undefined,
        chainId: base.id,
        query: {
            enabled: !!address && isTokenDeployed,
            refetchInterval: 30_000,
        },
    });

    // ============ Write Operations ============

    const { writeContract, data: txHash, isPending: isWritePending, reset: resetWrite } = useWriteContract();

    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash: txHash,
        chainId: base.id,
    });

    // Stake tokens
    const stake = useCallback(async (amount: bigint) => {
        if (!address || !isTokenDeployed) return;

        writeContract({
            address: CONTRACT_ADDRESSES.donutamagotchiToken as Address,
            abi: DONUTAMAGOTCHI_TOKEN_ABI,
            functionName: "stake",
            args: [amount],
            chainId: base.id,
        });
    }, [address, writeContract]);

    // Unstake tokens
    const unstake = useCallback(async (amount: bigint) => {
        if (!address || !isTokenDeployed) return;

        writeContract({
            address: CONTRACT_ADDRESSES.donutamagotchiToken as Address,
            abi: DONUTAMAGOTCHI_TOKEN_ABI,
            functionName: "unstake",
            args: [amount],
            chainId: base.id,
        });
    }, [address, writeContract]);

    // Claim fees
    const claimFees = useCallback(async () => {
        if (!address || !isTokenDeployed) return;

        writeContract({
            address: CONTRACT_ADDRESSES.donutamagotchiToken as Address,
            abi: DONUTAMAGOTCHI_TOKEN_ABI,
            functionName: "claimFees",
            chainId: base.id,
        });
    }, [address, writeContract]);

    // Burn for breeding
    const burnForBreeding = useCallback(async () => {
        if (!address || !isTokenDeployed) return;

        writeContract({
            address: CONTRACT_ADDRESSES.donutamagotchiToken as Address,
            abi: DONUTAMAGOTCHI_TOKEN_ABI,
            functionName: "burnForBreeding",
            chainId: base.id,
        });
    }, [address, writeContract]);

    // Mint care reward (with signature)
    const mintCareReward = useCallback(async (
        to: Address,
        amount: bigint,
        reason: string,
        nonce: bigint,
        signature: `0x${string}`
    ) => {
        if (!address || !isTokenDeployed) return;

        writeContract({
            address: CONTRACT_ADDRESSES.donutamagotchiToken as Address,
            abi: DONUTAMAGOTCHI_TOKEN_ABI,
            functionName: "mintCareReward",
            args: [to, amount, reason, nonce, signature],
            chainId: base.id,
        });
    }, [address, writeContract]);

    // ============ Parsed Data ============

    const tokenStats = useMemo((): TokenStats | null => {
        if (!userStats) return null;
        const stats = userStats as [bigint, bigint, number, bigint, bigint, boolean, bigint];
        return {
            balance: stats[0],
            staked: stats[1],
            careStreak: Number(stats[2]),
            careMultiplier: Number(stats[3]),
            totalCareEarnings: stats[4],
            hasDpsBoost: stats[5],
            pendingFees: stats[6],
        };
    }, [userStats]);

    const careInfo = useMemo((): CareInfo | null => {
        if (!careInfoRaw) return null;
        const info = careInfoRaw as [number, bigint, bigint, bigint, boolean, bigint];
        return {
            streak: Number(info[0]),
            multiplier: Number(info[1]),
            totalRewards: info[2],
            lastCare: Number(info[3]),
            streakActive: info[4],
            actionsToday: Number(info[5]),
        };
    }, [careInfoRaw]);

    const stakingInfo = useMemo((): StakingInfo | null => {
        if (!stakingInfoRaw) return null;
        const info = stakingInfoRaw as [bigint, bigint, boolean, bigint, bigint];
        return {
            staked: info[0],
            pending: info[1],
            hasDpsBoost: info[2],
            totalStakedGlobal: info[3],
            feePoolBalance: info[4],
        };
    }, [stakingInfoRaw]);

    // ============ Display Helpers ============

    const formatTokens = (amount: bigint | undefined, decimals: number = 2): string => {
        if (!amount) return "0";
        return parseFloat(formatUnits(amount, 18)).toFixed(decimals);
    };

    const getStreakEmoji = (streak: number): string => {
        if (streak >= 30) return "🔥";
        if (streak >= 14) return "⭐";
        if (streak >= 7) return "✨";
        return "💫";
    };

    const getMultiplierLabel = (multiplier: number): string => {
        if (multiplier >= 200) return "2x (30 day streak!)";
        if (multiplier >= 150) return "1.5x (14 day streak)";
        if (multiplier >= 125) return "1.25x (7 day streak)";
        return "1x (base rate)";
    };

    // Refetch all data
    const refetchAll = useCallback(() => {
        refetchStats();
        refetchCareInfo();
        refetchStaking();
    }, [refetchStats, refetchCareInfo, refetchStaking]);

    return {
        // State
        isTokenDeployed,
        isWritePending,
        isConfirming,
        isConfirmed,
        txHash,

        // Data
        tokenStats,
        careInfo,
        stakingInfo,

        // Actions
        stake,
        unstake,
        claimFees,
        burnForBreeding,
        mintCareReward,
        refetchAll,
        resetWrite,

        // Helpers
        formatTokens,
        getStreakEmoji,
        getMultiplierLabel,
    };
}
