
import { Button } from "@/components/ui/button";
import { useSanctuary } from "@/hooks/useSanctuary";
import { useAccount } from "wagmi";

interface RetiredDonutProps {
    donut: {
        id: string; // TokenID
        ownerAddress: string;
        personality: string;
        color: string;
        ownerName: string;
        totalDaysAlive: number;
        totalEarningsDonut: string;
        totalEarningsEth: string;
        retiredAt: string;
        traits: {
            generation: number;
            offspringCount: number;
        };
        status: "retired" | "legendary";
    };
}

export function RetiredDonutCard({ donut }: RetiredDonutProps) {
    const { address } = useAccount();
    const { claimIncome, getPendingIncome, isClaiming } = useSanctuary();

    const pendingIncome = getPendingIncome(donut.id);
    const isOwner = address?.toLowerCase() === donut.ownerAddress?.toLowerCase();

    return (
        <div className="bg-white border-4 border-black rounded-xl p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-2">
            <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <span className="text-lg">{donut.status === "legendary" ? "⭐" : "🏤"}</span>
                        <div>
                            <div className="text-xs font-black text-black">
                                🎭 {donut.personality} {donut.color} Donut
                            </div>
                            <div className="text-[10px] text-black/60 font-bold">{donut.ownerName}</div>
                        </div>
                    </div>
                </div>
                {donut.status === "legendary" && (
                    <span className="bg-yellow-300 text-black text-[10px] font-black px-2 py-1 rounded-lg border-2 border-black">
                        LEGENDARY
                    </span>
                )}
            </div>

            <div className="grid grid-cols-3 gap-2 text-center bg-gray-100 p-2 rounded-lg border-2 border-black">
                <div>
                    <div className="text-[9px] font-bold text-black/60">AGE</div>
                    <div className="text-xs font-black text-black">{donut.totalDaysAlive}d</div>
                </div>
                <div>
                    <div className="text-[9px] font-bold text-black/60">$DONUT</div>
                    <div className="text-xs font-black text-black">{donut.totalEarningsDonut}</div>
                </div>
                <div>
                    <div className="text-[9px] font-bold text-black/60">ETH</div>
                    <div className="text-xs font-black text-black">Ξ{donut.totalEarningsEth}</div>
                </div>
            </div>

            <div className="text-[10px] text-black/70 font-bold space-y-1">
                <div>
                    👶 Gen {donut.traits.generation} • 👨‍👩‍👧‍👦 {donut.traits.offspringCount} offspring
                </div>
                <div>📅 Retired {donut.retiredAt}</div>
            </div>

            {/* Claim Section for Owners */}
            {isOwner && pendingIncome > 0 && (
                <div className="bg-green-100 border-2 border-green-500 rounded-lg p-2 flex items-center justify-between">
                    <div className="text-[10px] font-black text-green-800">
                        +{pendingIncome.toFixed(2)} Pending
                    </div>
                    <Button
                        size="sm"
                        onClick={() => claimIncome(donut.id)}
                        disabled={isClaiming}
                        className="h-6 bg-green-500 text-white border-2 border-black text-[9px]"
                    >
                        {isClaiming ? "CLAIMING..." : "CLAIM"}
                    </Button>
                </div>
            )}

            <Button
                className="w-full bg-gradient-to-b from-pink-300 to-pink-400 border-3 border-black text-black text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
                disabled={true}
            >
                👁️ View Legacy
            </Button>
        </div>
    );
}
