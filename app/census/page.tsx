import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { PublicPageIntro } from "@/components/site/PublicPageIntro";
import { CensusOverviewMap } from "@/components/census/CensusOverviewMap";

type CountyPopulationRow = {
  id: string;
  name: string;
  slug: string;
  population: number | null;
  parent_name: string | null;
};

function formatPopulation(value: number | null) {
  if (value === null || Number.isNaN(value)) return "N/A";
  return new Intl.NumberFormat("en-US").format(value);
}

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

  const sortedCounties: CountyPopulationRow[] = (countyRows || []).map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    parent_name: row.parent_name,
    population: row.population === null ? null : Number(row.population),
  }));

  return (
    <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
      <PublicPageIntro
        eyebrow="Census"
        title="States, counties, and population"
        description="Browse the census geography hierarchy and review county population totals aggregated from payam-level population data."
      />

      <div className="mt-10 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <CensusOverviewMap counties={sortedCounties} />

        <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-slate-900">
              County population table
            </h2>
          </div>

          {countyError ? (
            <div className="px-6 py-6 text-sm text-rose-600">
              Failed to load county population data.
            </div>
          ) : sortedCounties.length > 0 ? (
            <div className="max-h-[560px] overflow-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="sticky top-0 bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left font-medium text-slate-600">
                      County
                    </th>
                    <th className="px-6 py-3 text-left font-medium text-slate-600">
                      State / Area
                    </th>
                    <th className="px-6 py-3 text-left font-medium text-slate-600">
                      Population
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {sortedCounties.map((county) => (
                    <tr key={county.id}>
                      <td className="px-6 py-4 text-slate-700">
                        <Link
                          href={`/census/${county.slug}`}
                          className="font-medium text-slate-900 transition hover:text-emerald-700"
                        >
                          {county.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-slate-700">
                        {county.parent_name || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-slate-700">
                        {formatPopulation(county.population)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-6 text-sm text-slate-600">
              No county population data available yet.
            </div>
          )}
        </div>
      </div>

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