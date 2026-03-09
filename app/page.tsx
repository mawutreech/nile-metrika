import { Hero } from "@/components/home/Hero";
import { SearchBlock } from "@/components/home/SearchBlock";
import { QuickAccess } from "@/components/home/QuickAccess";
import { ThemeShortcutStrip } from "@/components/home/ThemeShortcutStrip";
import { FeaturedIndicators } from "@/components/home/FeaturedIndicators";
import { ThemeGrid } from "@/components/home/ThemeGrid";
import { LatestPublications } from "@/components/home/LatestPublications";

export default function HomePage() {
  return (
    <>
      <Hero />
      <QuickAccess />
      <SearchBlock />
      <ThemeShortcutStrip />
      <FeaturedIndicators />
      <ThemeGrid />
      <LatestPublications />
    </>
  );
}