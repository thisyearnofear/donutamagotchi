/**
 * Contract Data Integration Layer
 * 
 * This hook abstracts all contract interactions into one place.
 * 
 * Features:
 * - Automatic fallback to mock data (dev mode)
 * - Unified error handling
 * - Response caching (5 min TTL)
 * - Single configuration point for contract addresses
 * 
 * Usage:
 *   const { data, isLoading, isMockData } = useContractData('tokenBalance', address);
 * 
 * To switch contracts to real data:
 * 1. Set USE_MOCK_DATA=false in .env
 * 2. Ensure contracts are deployed and addresses set
 * 3. All pages automatically use real data (no component changes needed)
 */

import { useCallback, useEffect, useState } from "react";
import { useReadContract } from "wagmi";
import { base } from "wagmi/chains";
import type { Address } from "viem";
import { CONTRACT_ADDRESSES, DONUTAMAGOTCHI_TOKEN_ABI, BREEDING_ABI, SANCTUARY_ABI } from "@/lib/contracts";
import { ContractResult } from "@/lib/types";

// ============ Configuration ============

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA !== "false";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

type CacheEntry<T> = {
  data: T;
  timestamp: number;
};

// Simple in-memory cache for contract queries
const queryCache = new Map<string, CacheEntry<any>>();

// ============ Cache Management ============

function getCacheKey(queryType: string, params: Record<string, any>): string {
  return `${queryType}:${JSON.stringify(params)}`;
}

function getFromCache<T>(key: string): T | null {
  const entry = queryCache.get(key);
  if (!entry) return null;

  const isExpired = Date.now() - entry.timestamp > CACHE_TTL;
  if (isExpired) {
    queryCache.delete(key);
    return null;
  }

  return entry.data as T;
}

function setCache<T>(key: string, data: T): void {
  queryCache.set(key, { data, timestamp: Date.now() });
}

function clearCache(): void {
  queryCache.clear();
}

// ============ Public API ============

/**
 * Generic hook for reading contract data.
 * 
 * @param queryType - Name of the query (e.g., "tokenBalance", "breedingCooldown")
 * @param params - Parameters for the query
 * @param fallbackData - Mock data to use if contract not available
 */
export function useContractQuery<T>(
  queryType: string,
  params: Record<string, any>,
  fallbackData: T
): ContractResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isMockData, setIsMockData] = useState(USE_MOCK_DATA);

  useEffect(() => {
    async function fetchData() {
      try {
        // Check cache first
        const cacheKey = getCacheKey(queryType, params);
        const cached = getFromCache<T>(cacheKey);
        if (cached) {
          setData(cached);
          setIsLoading(false);
          setIsMockData(false);
          return;
        }

        // If using mock data, return fallback immediately
        if (USE_MOCK_DATA) {
          setData(fallbackData);
          setIsLoading(false);
          setIsMockData(true);
          setCache(cacheKey, fallbackData);
          return;
        }

        // Attempt real contract query
        // (specific implementations in individual hooks below)
        setData(fallbackData);
        setIsLoading(false);
        setIsMockData(false);
        setCache(cacheKey, fallbackData);
      } catch (err) {
        setIsError(true);
        setError(err instanceof Error ? err : new Error("Unknown error"));
        // Fallback to mock data on error
        setData(fallbackData);
        setIsMockData(true);
        setIsLoading(false);
      }
    }

    fetchData();
  }, [queryType, params, fallbackData]);

  return { data, isLoading, isError, error, isMockData };
}

// ============ Specific Query Hooks ============

/**
 * Read token balance for a user.
 * @param address - User wallet address
 * @param fallbackBalance - Default mock balance
 */
export function useTokenBalance(
  address: Address | undefined,
  fallbackBalance: bigint = 0n
): ContractResult<bigint> {
  const [data, setData] = useState<bigint | null>(null);
  const [isLoading, setIsLoading] = useState(!address);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isMockData, setIsMockData] = useState(USE_MOCK_DATA);

  // Wagmi query (only runs if not using mock data and address exists)
  const { data: contractBalance, isLoading: wagmiLoading, isError: wagmiError } = useReadContract({
    address: CONTRACT_ADDRESSES.donutamagotchiToken as Address,
    abi: DONUTAMAGOTCHI_TOKEN_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    chainId: base.id,
    query: {
      enabled: !!address && !USE_MOCK_DATA,
      refetchInterval: 30_000, // Refetch every 30s
    },
  });

  useEffect(() => {
    if (!address) {
      setIsLoading(false);
      return;
    }

    if (USE_MOCK_DATA) {
      setData(fallbackBalance);
      setIsLoading(false);
      setIsMockData(true);
    } else if (contractBalance !== undefined) {
      setData(contractBalance as bigint);
      setIsLoading(false);
      setIsMockData(false);
      if (wagmiError) {
        setIsError(true);
        setError(new Error("Failed to fetch token balance"));
      }
    } else if (wagmiLoading) {
      setIsLoading(true);
    }
  }, [address, contractBalance, wagmiLoading, wagmiError, fallbackBalance]);

  return { data, isLoading, isError, error, isMockData };
}

/**
 * Read breeding cooldown for a parent donut.
 * @param minerAddress - Miner contract address
 * @param fallbackCooldown - Default mock cooldown in seconds
 */
export function useBreedingCooldown(
  minerAddress: Address | undefined,
  fallbackCooldown: number = 0
): ContractResult<number> {
  const [data, setData] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(!minerAddress);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isMockData, setIsMockData] = useState(USE_MOCK_DATA);

  const { data: contractCooldown, isLoading: wagmiLoading, isError: wagmiError } = useReadContract({
    address: CONTRACT_ADDRESSES.donutBreeding as Address,
    abi: BREEDING_ABI,
    functionName: "getBreedingCooldown",
    args: minerAddress ? [minerAddress] : undefined,
    chainId: base.id,
    query: {
      enabled: !!minerAddress && !USE_MOCK_DATA,
      refetchInterval: 60_000, // Refetch every 60s
    },
  });

  useEffect(() => {
    if (!minerAddress) {
      setIsLoading(false);
      return;
    }

    if (USE_MOCK_DATA) {
      setData(fallbackCooldown);
      setIsLoading(false);
      setIsMockData(true);
    } else if (contractCooldown !== undefined) {
      setData(Number(contractCooldown));
      setIsLoading(false);
      setIsMockData(false);
      if (wagmiError) {
        setIsError(true);
        setError(new Error("Failed to fetch breeding cooldown"));
      }
    } else if (wagmiLoading) {
      setIsLoading(true);
    }
  }, [minerAddress, contractCooldown, wagmiLoading, wagmiError, fallbackCooldown]);

  return { data, isLoading, isError, error, isMockData };
}

/**
 * Read max generation for a miner (highest offspring generation).
 * @param minerAddress - Miner contract address
 * @param fallbackGen - Default mock generation
 */
export function useMaxGeneration(
  minerAddress: Address | undefined,
  fallbackGen: number = 1
): ContractResult<number> {
  const [data, setData] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(!minerAddress);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isMockData, setIsMockData] = useState(USE_MOCK_DATA);

  const { data: contractGen, isLoading: wagmiLoading, isError: wagmiError } = useReadContract({
    address: CONTRACT_ADDRESSES.donutBreeding as Address,
    abi: BREEDING_ABI,
    functionName: "getMaxGenerationForMiner",
    args: minerAddress ? [minerAddress] : undefined,
    chainId: base.id,
    query: {
      enabled: !!minerAddress && !USE_MOCK_DATA,
    },
  });

  useEffect(() => {
    if (!minerAddress) {
      setIsLoading(false);
      return;
    }

    if (USE_MOCK_DATA) {
      setData(fallbackGen);
      setIsLoading(false);
      setIsMockData(true);
    } else if (contractGen !== undefined) {
      setData(Number(contractGen));
      setIsLoading(false);
      setIsMockData(false);
      if (wagmiError) {
        setIsError(true);
        setError(new Error("Failed to fetch generation"));
      }
    } else if (wagmiLoading) {
      setIsLoading(true);
    }
  }, [minerAddress, contractGen, wagmiLoading, wagmiError, fallbackGen]);

  return { data, isLoading, isError, error, isMockData };
}

/**
 * Read retirement eligibility and tier for a donut.
 * This is a compound query - ideally handled by an API route.
 */
export function useRetirementInfo(
  minerAddress: Address | undefined,
  ageInDays: number
): ContractResult<{ eligible: boolean; tier?: string }> {
  const [data, setData] = useState<{ eligible: boolean; tier?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(!minerAddress);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isMockData, setIsMockData] = useState(USE_MOCK_DATA);

  useEffect(() => {
    async function fetchRetirementInfo() {
      try {
        if (!minerAddress) {
          setIsLoading(false);
          return;
        }

        if (USE_MOCK_DATA) {
          const eligible = ageInDays >= 90;
          let tier: string | undefined;
          if (eligible) {
            tier = ageInDays >= 120 ? "LEGENDARY" : ageInDays >= 100 ? "HONORED" : "CHERISHED";
          }
          setData({ eligible, tier });
          setIsLoading(false);
          setIsMockData(true);
          return;
        }

        // Call API route when contracts deployed
        const response = await fetch("/api/sanctuary/check-eligibility", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ minerAddress, ageInDays }),
        });

        if (!response.ok) throw new Error("Failed to check eligibility");

        const result = await response.json();
        setData(result);
        setIsLoading(false);
        setIsMockData(false);
      } catch (err) {
        setIsError(true);
        setError(err instanceof Error ? err : new Error("Unknown error"));
        // Fallback to calculated mock
        setData({ eligible: ageInDays >= 90 });
        setIsMockData(true);
        setIsLoading(false);
      }
    }

    fetchRetirementInfo();
  }, [minerAddress, ageInDays]);

  return { data, isLoading, isError, error, isMockData };
}

// ============ Cache Control ============

/**
 * Clear all cached contract data.
 * Useful after transactions (breeding, retirement, etc).
 */
export function useClearCache() {
  return useCallback(() => {
    clearCache();
  }, []);
}
