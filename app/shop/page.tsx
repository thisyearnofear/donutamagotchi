"use client";

import { useState } from "react";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { base } from "wagmi/chains";
import type { Address } from "viem";
import { NavBar } from "@/components/nav-bar";
import { Button } from "@/components/ui/button";
import { FeaturedSection } from "@/components/featured-section";
import { AccordionProvider } from "@/components/accordion-context";
import { CONTRACT_ADDRESSES, DONUTAMAGOTCHI_TOKEN_ABI } from "@/lib/contracts";

interface CosmeticItem {
  id: string;
  name: string;
  emoji: string;
  category: "hats" | "animations" | "themes" | "names";
  price: number;
  rarity: "common" | "rare" | "epic" | "legendary";
  description: string;
  owned: boolean;
}

export default function ShopPage() {
  const { address } = useAccount();
  const [activeCategory, setActiveCategory] = useState<"hats" | "animations" | "themes" | "names">("hats");
  const [purchasingId, setPurchasingId] = useState<string | null>(null);
  const [showAllInCategory, setShowAllInCategory] = useState(false);

  // Get user's token balance
  const { data: userTokenBalance = 0n } = useReadContract({
    address: CONTRACT_ADDRESSES.donutamagotchiToken as Address,
    abi: DONUTAMAGOTCHI_TOKEN_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    chainId: base.id,
    query: {
      enabled: !!address,
      refetchInterval: 10_000,
    },
  });

  // Purchase cosmetic
  const { writeContract: purchaseCosmetic, isPending: isPurchasing } = useWriteContract();
  const { data: purchaseTxHash } = useWriteContract();
  const { data: purchaseReceipt } = useWaitForTransactionReceipt({
    hash: purchaseTxHash,
    chainId: base.id,
  });

  const handlePurchase = async (item: CosmeticItem) => {
    if (!address) {
      alert("Please connect your wallet first");
      return;
    }

    const purchaseCost = BigInt(item.price) * 10n ** 18n;
    const balance = typeof userTokenBalance === 'bigint' ? userTokenBalance : 0n;
    
    if (balance < purchaseCost) {
      alert("Insufficient $DONUTAMAGOTCHI balance");
      return;
    }

    setPurchasingId(item.id);
    
    // In a real implementation, this would:
    // 1. Call token.approve(shopContract, cost)
    // 2. Call shop.purchaseCosmetic(cosmetic)
    // 3. Mint cosmetic NFT to user
    // 4. Burn 30% of cost from treasury
    // For now, we show success message
    
    setTimeout(() => {
      alert(`✅ Purchase successful! You now own ${item.name}`);
      setPurchasingId(null);
    }, 2000);
  };

  const userBalanceDisplay = (Number(userTokenBalance) / 1e18).toLocaleString(undefined, {
    maximumFractionDigits: 2,
  });

  const cosmetics: CosmeticItem[] = [
    // Hats
    {
      id: "hat_1",
      name: "Wizard Hat",
      emoji: "🧙‍♂️",
      category: "hats",
      price: 50,
      rarity: "common",
      description: "Classic wizard hat for your donut",
      owned: false,
    },
    {
      id: "hat_2",
      name: "Crown",
      emoji: "👑",
      category: "hats",
      price: 150,
      rarity: "rare",
      description: "Royal crown for premium donuts",
      owned: false,
    },
    {
      id: "hat_3",
      name: "Party Hat",
      emoji: "🎉",
      category: "hats",
      price: 75,
      rarity: "common",
      description: "Celebrate with style",
      owned: false,
    },
    // Animations
    {
      id: "anim_1",
      name: "Dab Emote",
      emoji: "🙌",
      category: "animations",
      price: 100,
      rarity: "rare",
      description: "Show off with a dab",
      owned: false,
    },
    {
      id: "anim_2",
      name: "Victory Dance",
      emoji: "💃",
      category: "animations",
      price: 200,
      rarity: "epic",
      description: "Celebrate your wins",
      owned: false,
    },
    // Themes
    {
      id: "theme_1",
      name: "Halloween",
      emoji: "🎃",
      category: "themes",
      price: 200,
      rarity: "rare",
      description: "Spooky donut variant",
      owned: false,
    },
    {
      id: "theme_2",
      name: "Space Explorer",
      emoji: "🚀",
      category: "themes",
      price: 300,
      rarity: "epic",
      description: "Futuristic donut edition",
      owned: false,
    },
    // Names
    {
      id: "name_1",
      name: "Custom Name",
      emoji: "✏️",
      category: "names",
      price: 200,
      rarity: "rare",
      description: "Immortalize your donut's name on-chain",
      owned: false,
    },
  ];

  const filteredItems = cosmetics.filter((item) => item.category === activeCategory);
  const featuredItems = filteredItems.slice(0, 2);
  const remainingItems = filteredItems.slice(2);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-gray-200";
      case "rare":
        return "bg-blue-200";
      case "epic":
        return "bg-purple-200";
      case "legendary":
        return "bg-yellow-200";
      default:
        return "bg-gray-200";
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "border-gray-400";
      case "rare":
        return "border-blue-400";
      case "epic":
        return "border-purple-400";
      case "legendary":
        return "border-yellow-400";
      default:
        return "border-gray-400";
    }
  };

  const handleCategoryChange = (category: "hats" | "animations" | "themes" | "names") => {
    setActiveCategory(category);
    setShowAllInCategory(false);
  };

  return (
    <main className="flex h-screen w-screen justify-center overflow-hidden bg-gradient-to-b from-purple-900 via-pink-900 to-orange-900 font-mono text-white">
      <AccordionProvider mode="single">
        <div
          className="relative flex h-full w-full max-w-[520px] flex-1 flex-col overflow-hidden px-3 pb-3"
          style={{
            paddingTop: "calc(env(safe-area-inset-top, 0px) + 8px)",
            paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 80px)",
          }}
        >
        <div className="flex flex-1 flex-col overflow-y-auto space-y-3">
          {/* Header */}
          <div className="bg-yellow-300 border-4 border-black rounded-2xl p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h1 className="text-2xl font-black text-center text-black tracking-tight">
              🎨 COSMETICS SHOP
            </h1>
            <p className="text-center text-[10px] text-black/70 font-bold mt-1">
              CUSTOMIZE YOUR DONUT
            </p>
          </div>

          {/* Token Balance */}
          <div className="bg-pink-300 border-4 border-black rounded-xl p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-black text-black">YOUR BALANCE</div>
              <div className="text-sm font-black text-black">
                {address ? `${userBalanceDisplay} $DONUTAMAGOTCHI` : "Connect wallet"}
              </div>
            </div>
            <div className="text-[9px] text-black/60 font-bold mt-1">
              💡 Earn tokens through daily play, interactions, and breeding
            </div>
          </div>

          {/* Featured Section */}
          {!showAllInCategory && featuredItems.length > 0 && (
            <FeaturedSection
              title={`${activeCategory.toUpperCase().replace("_", " ")} COSMETICS`}
              emoji="✨"
              viewAllLabel="EXPLORE"
              onViewAll={() => setShowAllInCategory(true)}
            >
              <div className="grid grid-cols-2 gap-2">
                {featuredItems.map((item) => (
                  <div
                    key={item.id}
                    className={`border-4 ${getRarityBorder(
                      item.rarity
                    )} rounded-xl p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${getRarityColor(
                      item.rarity
                    )} space-y-2`}
                  >
                    {/* Emoji */}
                    <div className="text-3xl text-center">{item.emoji}</div>

                    {/* Name & Rarity */}
                    <div>
                      <div className="text-xs font-black text-black text-center">{item.name}</div>
                      <div className="text-[9px] text-black/60 font-bold text-center uppercase">
                        {item.rarity}
                      </div>
                    </div>

                    {/* Description */}
                    <div className="text-[9px] text-black/70 text-center">{item.description}</div>

                    {/* Price or Owned */}
                    {item.owned ? (
                      <div className="bg-green-400 border-2 border-black rounded-lg py-1 text-center font-black text-[10px] text-black">
                        ✅ OWNED
                      </div>
                    ) : (
                      <>
                        <div className="bg-yellow-200 border-2 border-black rounded-lg py-1 text-center font-black text-[11px] text-black">
                           {item.price} TOKENS
                         </div>
                         <Button
                           className="w-full bg-gradient-to-b from-pink-400 to-pink-600 border-2 border-black text-black text-[10px] font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 py-1 h-auto"
                           disabled={!address || Number(userTokenBalance) / 1e18 < item.price || purchasingId === item.id}
                           onClick={() => handlePurchase(item)}
                         >
                           {purchasingId === item.id ? "⏳ BUYING..." : "BUY"}
                         </Button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </FeaturedSection>
          )}

          {/* Category Tabs */}
          <div className="grid grid-cols-4 gap-1.5">
            <button
              onClick={() => handleCategoryChange("hats")}
              className={`py-2 px-2 rounded-lg border-3 border-black font-black text-[10px] transition-all duration-200 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] ${
                activeCategory === "hats"
                  ? "bg-pink-400 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] scale-95"
                  : "bg-white text-black/60 hover:bg-gray-100 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              }`}
            >
              👒
              <div>HATS</div>
            </button>
            <button
              onClick={() => handleCategoryChange("animations")}
              className={`py-2 px-2 rounded-lg border-3 border-black font-black text-[10px] transition-all duration-200 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] ${
                activeCategory === "animations"
                  ? "bg-pink-400 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] scale-95"
                  : "bg-white text-black/60 hover:bg-gray-100 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              }`}
            >
              🎬
              <div>ANIM</div>
            </button>
            <button
              onClick={() => handleCategoryChange("themes")}
              className={`py-2 px-2 rounded-lg border-3 border-black font-black text-[10px] transition-all duration-200 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] ${
                activeCategory === "themes"
                  ? "bg-pink-400 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] scale-95"
                  : "bg-white text-black/60 hover:bg-gray-100 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              }`}
            >
              🎨
              <div>THEMES</div>
            </button>
            <button
              onClick={() => handleCategoryChange("names")}
              className={`py-2 px-2 rounded-lg border-3 border-black font-black text-[10px] transition-all duration-200 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] ${
                activeCategory === "names"
                  ? "bg-pink-400 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] scale-95"
                  : "bg-white text-black/60 hover:bg-gray-100 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              }`}
            >
              ✏️
              <div>NAMES</div>
            </button>
          </div>

          {/* Items Grid */}
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-2 gap-2 flex-1 overflow-y-auto">
              {(showAllInCategory ? filteredItems : remainingItems).map((item) => (
                <div
                  key={item.id}
                  className={`border-4 ${getRarityBorder(
                    item.rarity
                  )} rounded-xl p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${getRarityColor(
                    item.rarity
                  )} space-y-2`}
                >
                  {/* Emoji */}
                  <div className="text-3xl text-center">{item.emoji}</div>

                  {/* Name & Rarity */}
                  <div>
                    <div className="text-xs font-black text-black text-center">{item.name}</div>
                    <div className="text-[9px] text-black/60 font-bold text-center uppercase">
                      {item.rarity}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="text-[9px] text-black/70 text-center">{item.description}</div>

                  {/* Price or Owned */}
                  {item.owned ? (
                    <div className="bg-green-400 border-2 border-black rounded-lg py-1 text-center font-black text-[10px] text-black">
                      ✅ OWNED
                    </div>
                  ) : (
                    <>
                      <div className="bg-yellow-200 border-2 border-black rounded-lg py-1 text-center font-black text-[11px] text-black">
                         {item.price} TOKENS
                       </div>
                       <Button
                         className="w-full bg-gradient-to-b from-pink-400 to-pink-600 border-2 border-black text-black text-[10px] font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 py-1 h-auto"
                         disabled={!address || Number(userTokenBalance) / 1e18 < item.price || purchasingId === item.id}
                         onClick={() => handlePurchase(item)}
                       >
                         {purchasingId === item.id ? "⏳ BUYING..." : "BUY"}
                       </Button>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border-4 border-black rounded-xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex-1 flex flex-col items-center justify-center">
              <div className="text-center space-y-3">
                <div className="text-4xl">🛍️</div>
                <div className="text-sm font-black text-black">Coming Soon</div>
                <p className="text-xs text-black/70 max-w-xs">
                  More cosmetics will be added soon as $DONUTAMAGOTCHI token launches
                </p>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-lime-300 border-4 border-black rounded-xl p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-[10px] font-black text-black text-center space-y-1">
              <div>🔥 30% of cosmetics revenue is burned to reduce token supply</div>
              <div>📈 Rare cosmetics unlock at higher breeding tiers</div>
            </div>
          </div>
        </div>
      </div>
        <NavBar />
      </AccordionProvider>
    </main>
  );
}