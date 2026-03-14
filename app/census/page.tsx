import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { PublicPageIntro } from "@/components/site/PublicPageIntro";
import { CensusOverviewInteractive } from "@/components/census/CensusOverviewInteractive";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "South Sudan Census Explorer",
  description:
    "Explore South Sudan’s states, counties, payams, population totals, and administrative hierarchy through the census explorer.",
  alternates: {
    canonical: "https://nilemetrica.com/census",
  },
};
type CountyPopulationRow = {
  id: string;
  name: string;
  slug: string;
  population: number | null;
  parent_name: string | null;
};

export default async function CensusPage() {
  const supabase = await createClient();

  const { data: topUnits, error: topUnitsError } = await supabase
    .from("geographic_units")
    .select("id, name, slug, type")
    .in("type", ["state", "administrative_area"])
    .is("parent_id", null)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  const { data: countyRows, error: countyError } = await supabase
    .from("census_county_population")
    .select("id, name, slug, parent_name, population")
    .order("population", { ascending: false })
    .order("name", { ascending: true });

  const sortedCounties: CountyPopulationRow[] = (countyRows || []).map(
    (row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      parent_name: row.parent_name,
      population: row.population === null ? null : Number(row.population),
    })
  );

  return (
    <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
      <PublicPageIntro
        eyebrow="Census"
        title="States, counties, and population"
        description="Browse the census geography hierarchy and explore county population totals aggregated from payam-level population data."
      />

      {countyError ? (
        <div className="mt-10 rounded-[1.75rem] border border-slate-200 bg-white px-6 py-6 text-sm text-rose-600 shadow-sm">
          Failed to load county population data.
        </div>
      ) : (
        <CensusOverviewInteractive counties={sortedCounties} />
      )}

      <div className="mt-10 rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Top-level census areas
          </h2>
        </div>

        {topUnitsError ? (
          <div className="px-6 py-6 text-sm text-rose-600">
            Failed to load census areas.
          </div>
        ) : topUnits && topUnits.length > 0 ? (
          <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-3">
            {topUnits.map((unit) => (
              <Link
                key={unit.id}
                href={`/census/${unit.slug}`}
                className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 transition hover:border-emerald-200 hover:bg-emerald-50"
              >
                <h3 className="text-lg font-semibold text-slate-900">
                  {unit.name}
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  {unit.type === "state" ? "State" : "Administrative area"}
                </p>
                <p className="mt-4 text-sm font-medium text-emerald-700">
                  Open hierarchy →
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="px-6 py-6 text-sm text-slate-600">
            No census areas available yet.
          </div>
        )}
      </div>
    </main>
  );
}