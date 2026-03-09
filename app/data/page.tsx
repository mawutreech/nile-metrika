import type { Metadata } from "next";
import { PageHero } from "@/components/common/PageHero";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { ThemeCard } from "@/components/data/ThemeCard";
import { DatasetCard } from "@/components/data/DatasetCard";
import { IndicatorCard } from "@/components/data/IndicatorCard";
import { DataSearchForm } from "@/components/data/DataSearchForm";
import {
  getDatasets,
  getHomepageIndicators,
  getThemes,
  searchDatasets,
  searchIndicators,
  searchThemes,
} from "@/lib/queries";

export default async function DataPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const q = params?.q?.trim() || "";

  const themes = q ? await searchThemes(q) : await getThemes();
  const indicators = q ? await searchIndicators(q) : await getHomepageIndicators();
  const datasets = q ? await searchDatasets(q) : await getDatasets();

  return (
    <>
      <PageHero
        title="Data"
        description="Browse statistical data by theme, indicator, and dataset collection."
      />

      <section className="py-12">
        <Container>
          <DataSearchForm />
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <SectionHeading
            title="Themes"
            description={q ? `Search results for “${q}” in themes.` : undefined}
          />
          {themes.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {themes.map((theme) => (
                <ThemeCard
                  key={theme.id}
                  theme={{
                    id: theme.id,
                    name: theme.name,
                    slug: theme.slug,
                    description: theme.description || "",
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="nm-card p-6 text-sm text-slate-600">No themes found.</div>
          )}
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <SectionHeading
            title="Indicators"
            description={q ? `Search results for “${q}” in indicators.` : undefined}
          />
          {indicators.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {indicators.map((indicator) => (
                <IndicatorCard key={indicator.id} indicator={indicator} />
              ))}
            </div>
          ) : (
            <div className="nm-card p-6 text-sm text-slate-600">No indicators found.</div>
          )}
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <SectionHeading
            title="Datasets"
            description={q ? `Search results for “${q}” in datasets.` : undefined}
          />
          {datasets.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {datasets.map((dataset) => (
                <DatasetCard
                  key={dataset.id}
                  dataset={{
                    id: dataset.id,
                    title: dataset.title,
                    slug: dataset.slug,
                    description: dataset.description || "",
                    theme: dataset.theme?.name || "Uncategorized",
                    format: dataset.format || "Unknown",
                    updatedAt: dataset.update_date || "N/A",
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="nm-card p-6 text-sm text-slate-600">No datasets found.</div>
          )}
        </Container>
      </section>
    </>
  );
}

export const metadata: Metadata = {
  title: "Data",
  description:
    "Browse themes, indicators, and datasets across South Sudan's public statistics portal.",
};