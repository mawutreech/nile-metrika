import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/common/PageHero";
import { Container } from "@/components/common/Container";
import { LineChartCard } from "@/components/charts/LineChartCard";
import { getIndicatorBySlug, getIndicatorSeries } from "@/lib/queries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const indicator = await getIndicatorBySlug(slug);

  if (!indicator) {
    return {
      title: "Indicator not found",
      description: "This indicator could not be found on Nile Metrika.",
    };
  }

  return {
    title: indicator.name,
    description:
      indicator.description || `${indicator.name} indicator on Nile Metrika.`,
  };
}

export default async function IndicatorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const indicator = await getIndicatorBySlug(slug);

  if (!indicator) return notFound();

  const series = await getIndicatorSeries(indicator.id);

  const latestPoint = series.length > 0 ? series[series.length - 1] : null;

  return (
    <>
      <PageHero
        title={indicator.name}
        description={indicator.description || "Indicator detail page"}
      />

      <section className="py-12">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <LineChartCard data={series} title={`${indicator.name} over time`} />

            <div className="nm-card p-6">
              <p className="text-sm text-slate-500">Latest value</p>
              <p className="mt-2 text-4xl font-semibold tracking-tight">
                {latestPoint ? latestPoint.value : "—"}
                <span className="ml-1 text-lg text-slate-500">
                  {indicator.unit || ""}
                </span>
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Reference period: {latestPoint ? latestPoint.label : "N/A"}
              </p>

              <div className="mt-8 space-y-4 text-sm text-slate-600">
                <div>
                  <p className="font-medium text-slate-900">Definition</p>
                  <p className="mt-1">
                    {indicator.description || "No description available."}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-slate-900">Source</p>
                  <p className="mt-1">
                    {indicator.source_agency?.name || "Unknown source"}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-slate-900">Frequency</p>
                  <p className="mt-1">{indicator.frequency || "Unknown frequency"}</p>
                </div>
                <div>
                  <p className="font-medium text-slate-900">Theme</p>
                  <p className="mt-1">{indicator.theme?.name || "Uncategorized"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 nm-card overflow-hidden">
            <div className="border-b border-slate-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">Data table</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left font-medium text-slate-600">
                      Period
                    </th>
                    <th className="px-6 py-3 text-left font-medium text-slate-600">
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {series.map((row) => (
                    <tr key={row.label}>
                      <td className="px-6 py-3 text-slate-700">{row.label}</td>
                      <td className="px-6 py-3 text-slate-700">
                        {row.value} {indicator.unit || ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}