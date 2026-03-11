import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <section className="border-b border-slate-200 bg-gradient-to-b from-emerald-50 to-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 sm:py-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:gap-10 lg:py-14">
          <div>
            <div className="inline-flex rounded-full border border-emerald-200 bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700 sm:text-xs">
              South Sudan Data Portal
            </div>

            <h1 className="mt-5 max-w-3xl text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Find data, indicators, and publications
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Browse structured public information from one place.
            </p>

            <form action="/search" method="GET" className="mt-6 max-w-2xl">
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="text"
                  name="q"
                  placeholder="Search the portal..."
                  className="w-full rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm text-slate-900 placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  className="rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-800"
                >
                  Search
                </button>
              </div>
            </form>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/data"
                className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Explore data
              </Link>
              <Link
                href="/publications"
                className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Browse publications
              </Link>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-emerald-100 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Quick access
            </p>

            <div className="mt-4 grid gap-3">
              <QuickLink
                title="Data"
                description="Find downloadable datasets and linked indicators."
                href="/data"
              />
              <QuickLink
                title="Indicators"
                description="Review measures, values, and indicator pages."
                href="/indicators"
              />
              <QuickLink
                title="Publications"
                description="Open reports, bulletins, and briefs."
                href="/publications"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:py-14">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 sm:text-sm">
            Start here
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">
            Go directly to the section you need.
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
            Use the homepage cards, the section header above, or search to move
            quickly across the portal.
          </p>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-2 lg:gap-6">
          <SectionCard
            eyebrow="Publications"
            title="Reports and statistical outputs"
            description="Access reports, bulletins, briefs, and other outputs that explain trends and support public understanding."
            primaryHref="/publications"
            primaryLabel="Go to publications"
          />

          <SectionCard
            eyebrow="Data"
            title="Explore datasets and measurable trends"
            description="Browse data resources and indicator series that support planning, research, and policy analysis."
            primaryHref="/data"
            primaryLabel="Browse data"
            secondaryHref="/indicators"
            secondaryLabel="Browse indicators"
          />
        </div>
      </section>
    </main>
  );
}

function QuickLink({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 transition hover:border-emerald-200 hover:bg-emerald-50"
    >
      <p className="text-sm font-semibold text-slate-900">{title}</p>
      <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
    </Link>
  );
}

function SectionCard({
  eyebrow,
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: {
  eyebrow: string;
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 sm:text-sm">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-2xl font-semibold text-slate-900">{title}</h2>
      <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
        {description}
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href={primaryHref}
          className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          {primaryLabel}
        </Link>

        {secondaryHref && secondaryLabel ? (
          <Link
            href={secondaryHref}
            className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            {secondaryLabel}
          </Link>
        ) : null}
      </div>
    </div>
  );
}