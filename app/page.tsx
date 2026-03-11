import Link from "next/link";

const quickSections = [
  {
    title: "Data",
    description:
      "Browse downloadable datasets and structured statistical resources.",
    href: "/data",
    cta: "Explore data",
  },
  {
    title: "Indicators",
    description:
      "Review key indicators, definitions, and time-series values.",
    href: "/indicators",
    cta: "View indicators",
  },
  {
    title: "Publications",
    description:
      "Access reports, bulletins, briefs, and other published outputs.",
    href: "/publications",
    cta: "Browse publications",
  },
  {
    title: "Methodology",
    description:
      "Learn about sources, concepts, definitions, and data practices.",
    href: "/methodology",
    cta: "Read methodology",
  },
];

const highlights = [
  {
    title: "Structured public data",
    description:
      "Access cleaner, more organized statistical information in one place.",
  },
  {
    title: "Research-ready resources",
    description:
      "Use publications, datasets, and indicators to support analysis and policy work.",
  },
  {
    title: "Simple navigation",
    description:
      "Jump directly to sections through the header menu and homepage cards.",
  },
];

export default function HomePage() {
  return (
    <main>
      <section className="border-b border-slate-200 bg-gradient-to-b from-emerald-50 to-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-10 lg:py-20">
          <div>
            <div className="inline-flex rounded-full border border-emerald-200 bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700 sm:text-xs">
              South Sudan Data Portal
            </div>

            <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Accessible, trusted, and structured statistical information.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              Nile Metrika helps users quickly find datasets, indicators,
              publications, and methodology without digging through long pages
              or disconnected sources.
            </p>

            <form action="/search" method="GET" className="mt-7 max-w-2xl">
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="text"
                  name="q"
                  placeholder="Search publications, datasets, and indicators..."
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

            <div className="mt-7 flex flex-wrap gap-3">
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
                description="Find downloadable datasets and metadata."
                href="/data"
              />
              <QuickLink
                title="Indicators"
                description="Review key measures and time-series values."
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

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:py-16">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 sm:text-sm">
            Navigate faster
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">
            Start from the section you need.
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
            The homepage is intentionally shorter now. Use the cards below or
            the dropdown navigation above to jump directly to the right part of
            the portal.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {quickSections.map((section) => (
            <Link
              key={section.title}
              href={section.href}
              className="group rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md sm:p-6"
            >
              <h3 className="text-lg font-semibold text-slate-900 sm:text-xl">
                {section.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {section.description}
              </p>
              <p className="mt-5 text-sm font-medium text-emerald-700 transition group-hover:text-emerald-800">
                {section.cta} →
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:py-16">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 sm:text-sm">
              Why Nile Metrika
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">
              A cleaner way to discover public statistics.
            </h2>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {highlights.map((item) => (
              <div
                key={item.title}
                className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 sm:p-6"
              >
                <h3 className="text-base font-semibold text-slate-900 sm:text-lg">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:py-16">
        <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 sm:text-sm">
              Publications
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-900">
              Reports and statistical outputs
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
              Access reports, bulletins, briefs, and other resources that help
              explain trends and inform public understanding.
            </p>
            <div className="mt-6">
              <Link
                href="/publications"
                className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Go to publications
              </Link>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 sm:text-sm">
              Data and indicators
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-900">
              Explore datasets and measurable trends
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
              Browse downloadable datasets and indicator series that support
              policy analysis, planning, and research.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/data"
                className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Browse data
              </Link>
              <Link
                href="/indicators"
                className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Browse indicators
              </Link>
            </div>
          </div>
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