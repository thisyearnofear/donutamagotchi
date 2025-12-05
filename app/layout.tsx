import "@/app/globals.css";
import type { Metadata } from "next";
import { Providers } from "@/components/providers";

const appDomain = "https://glazecorp.vercel.app";
const heroImageUrl = `${appDomain}/media/hero.png`;
const splashImageUrl = `${appDomain}/media/splash.png`;

const miniAppEmbed = {
  version: "1",
  imageUrl: heroImageUrl,
  button: {
    title: "Play Donutamagotchi",
    action: {
      type: "launch_miniapp" as const,
      name: "Donutamagotchi",
      url: appDomain,
      splashImageUrl,
      splashBackgroundColor: "#FEE7EC",
    },
  },
};

export const metadata: Metadata = {
  title: "Donutamagotchi",
  description: "Care for your virtual donut pet and earn $DONUT tokens on Base",
  openGraph: {
    title: "Donutamagotchi",
    description: "Feed your donut pet, earn tokens, and compete to be the best caretaker!",
    url: appDomain,
    images: [
      {
        url: heroImageUrl,
      },
    ],
  },
  other: {
    "fc:miniapp": JSON.stringify(miniAppEmbed),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
