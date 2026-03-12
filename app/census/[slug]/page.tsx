import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { PublicPageIntro } from "@/components/site/PublicPageIntro";

function childLabel(type: string | null) {
  switch (type) {
    case "state":
    case "administrative_area":
      return "Counties";
    case "county":
      return "Payams";
    case "payam":
      return "Bomas";
    default:
      return "Sub-units";
  }
}

function unitTypeLabel(type: string | null) {
  switch (type) {
    case "state":
      return "State";
    case "administrative_area":
      return "Administrative area";
    case "county":
      return "County";
    case "payam":
      return "Payam";
    case "boma":
      return "Boma";
    default:
      return "Geographic unit";
  }
}

function formatPopulation(value: number | null) {
  if (value === null || Number.isNaN(value)) return null;
  return new Intl.NumberFormat("en-US").format(value);
}

export default async function CensusUnitPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: unit, error: unitError } = await supabase
    .from("geographic_units")
    .select("id, name, slug, type, parent_id")
    .eq("slug", slug)
    .single();

  if (unitError || !unit) {
    notFound();
  }

  const { data: children, error: childrenError } = await supabase
    .from("geographic_units")
    .select("id, name, slug, type")
    .eq("parent_id", unit.id)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  const childRows = children || [];
  const childIds = childRows.map((child) => child.id);

  let populationMap = new Map<string, number>();

  if (unit.type === "county") {
    // county page -> children are payams -> direct population lookup
    if (childIds.length > 0) {
      const { data: populations } = await supabase
        .from("census_population")
        .select("geographic_unit_id, population")
        .in("geographic_unit_id", childIds);

      populationMap = new Map(
        (populations || []).map((row) => [
          row.geographic_unit_id,
          Number(row.population || 0),
        ])
      );
    }
  } else if (unit.type === "state" || unit.type === "administrative_area") {
    // state/administrative_area page -> children are counties
    // aggregate county totals from their payams' populations
    if (childIds.length > 0) {
      const { data: payams } = await supabase
        .from("geographic_units")
        .select("id, parent_id")
        .eq("type", "payam")
        .in("parent_id", childIds);

      const payamRows = payams || [];
      const payamIds = payamRows.map((row) => row.id);

      const payamsByCounty = new Map<string, string[]>();
      for (const payam of payamRows) {
        if (!payam.parent_id) continue;
        const existing = payamsByCounty.get(payam.parent_id) || [];
        existing.push(payam.id);
        payamsByCounty.set(payam.parent_id, existing);
      }

      let populationByPayam = new Map<string, number>();
      if (payamIds.length > 0) {
        const { data: populations } = await supabase
          .from("census_population")
          .select("geographic_unit_id, population")
          .in("geographic_unit_id", payamIds);

        populationByPayam = new Map(
          (populations || []).map((row) => [
            row.geographic_unit_id,
            Number(row.population || 0),
          ])
        );
      }

      for (const countyId of childIds) {
        const countyPayamIds = payamsByCounty.get(countyId) || [];
        const total = countyPayamIds.reduce((sum, payamId) => {
          return sum + (populationByPayam.get(payamId) || 0);
        }, 0);

        populationMap.set(countyId, total);
      }
    }
  }

  const description =
    unit.type === "county"
      ? "Browse payams under this county and view population where available."
      : unit.type === "payam"
        ? "Browse bomas under this payam and view population where available."
        : unit.type === "state" || unit.type === "administrative_area"
          ? "Browse counties under this area and view aggregated population totals."
          : `Browse the hierarchy under this ${unitTypeLabel(unit.type).toLowerCase()}.`;

  return (
    <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
      <PublicPageIntro
        eyebrow="Census"
        title={unit.name}
        description={description}
      />

      <div className="mt-8 flex gap-3">
        <Link
          href="/census"
          className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Back to census
        </Link>
      </div>

      <div className="mt-10 rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            {childLabel(unit.type)}
          </h2>
        </div>

        {childrenError ? (
          <div className="px-6 py-6 text-sm text-rose-600">
            Failed to load child units.
          </div>
        ) : childRows.length > 0 ? (
          <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-3">
            {childRows.map((child) => {
              const population = populationMap.has(child.id)
                ? populationMap.get(child.id) ?? null
                : null;

              const formattedPopulation = formatPopulation(population);

              return (
                <Link
                  key={child.id}
                  href={`/census/${child.slug}`}
                  className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 transition hover:border-emerald-200 hover:bg-emerald-50"
                >
                  <h3 className="text-lg font-semibold text-slate-900">
                    {child.name}
                  </h3>

                  <p className="mt-2 text-sm text-slate-600">
                    {unitTypeLabel(child.type)}
                  </p>

                  {formattedPopulation ? (
                    <p className="mt-3 text-sm text-slate-700">
                      Population:{" "}
                      <span className="font-medium">{formattedPopulation}</span>
                    </p>
                  ) : (
                    <p className="mt-3 text-sm text-slate-400">
                      Population not available
                    </p>
                  )}

                  <p className="mt-4 text-sm font-medium text-emerald-700">
                    Open →
                  </p>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="px-6 py-6 text-sm text-slate-600">
            No child units available yet under this area.
          </div>
        )}
      </div>
    </main>
  );
}