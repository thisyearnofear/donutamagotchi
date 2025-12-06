"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { UrlObject } from "url";

export function NavBar() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-black border-t-4 border-yellow-300 overflow-x-auto"
      style={{
        paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 8px)",
        paddingTop: "8px",
      }}
    >
      <div className="flex justify-center items-center max-w-[520px] mx-auto px-2 gap-1 min-w-min overflow-x-auto">
        <NavButton href="/" active={pathname === "/"} emoji="🍩" label="PET" />
        <NavButton href="/donuts" active={pathname === "/donuts"} emoji="🌍" label="EXPLORE" />
        <NavButton href="/breeding" active={pathname === "/breeding"} emoji="💕" label="BREED" />
        <NavButton href="/leaderboards" active={pathname === "/leaderboards"} emoji="🏆" label="RANK" />
        <NavButton href="/achievements" active={pathname === "/achievements"} emoji="🏅" label="BADGES" />
        <NavButton href="/shop" active={pathname === "/shop"} emoji="🎨" label="SHOP" />
        <NavButton href="/hall-of-fame" active={pathname === "/hall-of-fame"} emoji="👑" label="FAME" />
        <NavButton href="/blazery" active={pathname === "/blazery"} emoji="🔥" label="OVEN" />
      </div>
    </nav>
  );
}

function NavButton({ 
  href, 
  active, 
  emoji, 
  label 
}: { 
  href: string | UrlObject; 
  active: boolean; 
  emoji: string; 
  label: string;
}) {
  return (
    <Link
      href={href as any}
      className={cn(
        "flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg border-2 transition-all",
        active
          ? "bg-pink-400 border-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          : "bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
      )}
    >
      <span className="text-xl">{emoji}</span>
      <span className="text-[10px] font-black">{label}</span>
    </Link>
  );
}
