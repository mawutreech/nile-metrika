import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

export default async function IndicatorsPage() {
  const supabase = await createClient();

  const { data: indicators, error } = await supabase
    .from("indicators")
    .select(`
      id,
      name,
      slug,
      code,
      unit,
      frequency,
      description,
      theme:themes(name),
      source_agency:source_agencies(name)
    `)
    .order("name", { ascending: true });

  return (
    <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
          Indicators
        </p>
        <h1 className="mt-3 text-4xl font-semibold text-slate-900 sm:text-5xl">
          Explore key indicators
        </h1>
        <p className="mt-4 text-base leading-8 text-slate-600">
          Browse indicator definitions, frequencies, units, and linked public
          indicator pages.
        </p>
      </div>

      <div className="mt-10 rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            All indicators
          </h2>
        </div>

        {error ? (
          <div className="px-6 py-6 text-sm text-rose-600">
            Failed to load indicators.
          </div>
        ) : indicators && indicators.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {indicators.map((indicator) => {
              const themeName = Array.isArray(indicator.theme)
                ? indicator.theme[0]?.name
                : undefined;

              const sourceAgencyName = Array.isArray(indicator.source_agency)
                ? indicator.source_agency[0]?.name
                : undefined;

              return (
                <div
                  key={indicator.id}
                  className="flex flex-col gap-4 px-6 py-5 md:flex-row md:items-start md:justify-between"
                >
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold text-slate-900">
                      {indicator.name}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {themeName || "Uncategorized"} •{" "}
                      {indicator.frequency || "Unknown frequency"} •{" "}
                      {indicator.unit || "No unit"}
                    </p>

                    <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
                      {indicator.description || "No description available."}
                    </p>

                    <p className="mt-2 text-xs text-slate-400">
                      Code: {indicator.code || "N/A"} • Source:{" "}
                      {sourceAgencyName || "Unknown"}
                    </p>
                  </div>

                  <div>
                    <Link
                      href={`/indicators/${indicator.slug}`}
                      className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                      View indicator
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="px-6 py-6 text-sm text-slate-600">
            No indicators available yet.
          </div>
        )}
      </div>
    </main>
  );
}