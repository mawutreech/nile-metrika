import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { SearchBlock } from "@/components/home/SearchBlock";
import { QuickAccess } from "@/components/home/QuickAccess";
import { ThemeShortcutStrip } from "@/components/home/ThemeShortcutStrip";
import { PortalSummaryRow } from "@/components/home/PortalSummaryRow";
import { FeaturedIndicators } from "@/components/home/FeaturedIndicators";
import { ThemeGrid } from "@/components/home/ThemeGrid";
import { MapSnapshot } from "@/components/home/MapSnapshot";
import { LatestPublications } from "@/components/home/LatestPublications";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Explore South Sudan's public statistics, indicators, datasets, and publications through Nile Metrika.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <QuickAccess />
      <SearchBlock />
      <ThemeShortcutStrip />
      <PortalSummaryRow />
      <FeaturedIndicators />
      <ThemeGrid />
      <MapSnapshot />
      <LatestPublications />
    </>
  );
}