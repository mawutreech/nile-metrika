import { PublicPageIntro } from "@/components/site/PublicPageIntro";

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
      <PublicPageIntro
        eyebrow="About"
        title="About Nile Metrica"
        description="Nile Metrica is a public-facing portal designed to make South Sudan’s statistical information more accessible, organized, and usable."
      />

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-semibold text-slate-900">Purpose</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            The portal brings together datasets, indicators, publications, and
            methodology so users can move more easily across public statistical
            resources in one place.
          </p>
        </section>

        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-semibold text-slate-900">Audience</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            Nile Metrica is intended for researchers, policy practitioners,
            institutions, journalists, students, and anyone who needs more
            structured access to public data and statistical outputs.
          </p>
        </section>

        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:col-span-2">
          <h2 className="text-xl font-semibold text-slate-900">Approach</h2>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-600">
            The focus of the portal is clarity: cleaner organization, easier
            navigation, better metadata, and simpler public access to
            publications, datasets, and indicators.
          </p>
        </section>
      </div>
    </main>
  );
}