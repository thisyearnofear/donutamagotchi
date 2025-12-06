
import { useCallback, useState } from "react";
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { base } from "wagmi/chains";
import type { Address } from "viem";

import { CONTRACT_ADDRESSES, SANCTUARY_ABI } from "@/lib/contracts";

export function useSanctuary() {
    const [error, setError] = useState<string | null>(null);

    // Claim Transaction
    const {
        writeContract: performClaim,
        isPending: isClaiming,
        data: claimTxHash,
    } = useWriteContract();

    const { isLoading: isConfirmingClaim, isSuccess: isClaimSuccess } =
        useWaitForTransactionReceipt({
            hash: claimTxHash,
            chainId: base.id,
        });

    const claimIncome = useCallback(async (tokenId: string) => {
        try {
            setError(null);
            performClaim({
                address: CONTRACT_ADDRESSES.donutSanctuary as Address,
                abi: SANCTUARY_ABI,
                functionName: "claimIncome",
                args: [BigInt(tokenId)],
                chainId: base.id,
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Claim failed");
        }
    }, [performClaim]);

    // Read Pending Income
    const getPendingIncome = (tokenId: string) => {
        const { data } = useReadContract({
            address: CONTRACT_ADDRESSES.donutSanctuary as Address,
            abi: SANCTUARY_ABI,
            functionName: "calculatePassiveIncome",
            args: [BigInt(tokenId)],
            chainId: base.id,
            query: {
                // Only fetch if tokenId is valid
                enabled: !!tokenId,
                refetchInterval: 60_000,
            }
        });
        return data ? Number(data) / 1e18 : 0;
    };

    return {
        claimIncome,
        getPendingIncome,
        isClaiming: isClaiming || isConfirmingClaim,
        isClaimSuccess,
        error
    };
}
