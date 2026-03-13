import { PublicPageIntro } from "@/components/site/PublicPageIntro";

export default function MethodologyPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
      <PublicPageIntro
        eyebrow="Methodology"
        title="Sources and definitions"
        description="Read notes on sources, definitions, concepts, and methodological practices used across the portal."
      />

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-semibold text-slate-900">Sources</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            Nile Metrica brings together structured public information from
            recognized statistical and institutional sources. Source agencies
            are shown where available on datasets and indicators.
          </p>
        </section>

        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-semibold text-slate-900">Definitions</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            Indicator units, frequencies, and descriptions are provided to help
            users interpret values consistently and understand what each measure
            represents.
          </p>
        </section>

        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-semibold text-slate-900">Notes</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            Publication dates, update dates, and metadata are included where
            available. Users should review source notes carefully before using
            data for formal reporting or analysis.
          </p>
        </section>

        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-semibold text-slate-900">Use</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            The portal is designed to support research, planning, policy work,
            and public understanding through cleaner access to structured
            statistical information.
          </p>
        </section>
      </div>
    </main>
  );
}