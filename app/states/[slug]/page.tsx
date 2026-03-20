import { notFound } from "next/navigation";
import { getStateBySlug, statesData } from "@/lib/statesData";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return statesData.map((item) => ({
    slug: item.slug,
  }));
}

export default async function StatePage({ params }: Props) {
  const { slug } = await params;
  const entry = getStateBySlug(slug);

  if (!entry) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#3f7f68]">
            {entry.region}
          </p>

          <h1 className="mt-3 text-4xl font-semibold text-[#2f2f2f] sm:text-5xl">
            {entry.name}
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-8 text-[#555]">
            {entry.description}
          </p>

          <div className="mt-8 border border-[#d8d8d8] bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#3f7f68]">
              Census snapshot
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <div className="border border-[#ececec] p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">
                  Population
                </p>
                <p className="mt-2 text-lg font-semibold text-[#2f2f2f]">
                  {entry.census.population || "To be added"}
                </p>
              </div>

              <div className="border border-[#ececec] p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">
                  Counties
                </p>
                <p className="mt-2 text-lg font-semibold text-[#2f2f2f]">
                  {entry.census.counties || "To be added"}
                </p>
              </div>

              <div className="border border-[#ececec] p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">
                  Capital
                </p>
                <p className="mt-2 text-lg font-semibold text-[#2f2f2f]">
                  {entry.census.capital || "To be added"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="border border-[#d8d8d8] bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#3f7f68]">
              Map
            </p>

            <div className="mt-4 overflow-hidden border border-[#ececec] bg-[#fafafa]">
              <img
                src={entry.mapImage}
                alt={`${entry.name} map`}
                className="w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}