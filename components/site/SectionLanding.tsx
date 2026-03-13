import Link from "next/link";

type SectionLandingProps = {
  eyebrow: string;
  title: string;
  description: string;
  highlights: {
    title: string;
    description: string;
  }[];
  sections: {
    title: string;
    description: string;
    href: string;
  }[];
  featuredResources?: {
    title: string;
    description: string;
    href: string;
  }[];
  relatedLinks?: {
    title: string;
    href: string;
  }[];
};

export function SectionLanding({
  eyebrow,
  title,
  description,
  highlights,
  sections,
  featuredResources = [],
  relatedLinks = [],
}: SectionLandingProps) {
  return (
    <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
      <div className="max-w-4xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 sm:text-sm">
          {eyebrow}
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
          {description}
        </p>
      </div>

      <section className="mt-10">
        <div className="grid gap-4 md:grid-cols-3">
          {highlights.map((highlight) => (
            <div
              key={highlight.title}
              className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5"
            >
              <p className="text-base font-semibold text-slate-900">
                {highlight.title}
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {highlight.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 sm:text-sm">
            Core topics
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">
            Explore this section by topic
          </h2>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sections.map((section) => (
            <Link
              key={section.title}
              href={section.href}
              className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md"
            >
              <h3 className="text-lg font-semibold text-slate-900">
                {section.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {section.description}
              </p>
              <p className="mt-4 text-sm font-medium text-emerald-700">
                Open →
              </p>
            </Link>
          ))}
        </div>
      </section>

      {featuredResources.length > 0 ? (
        <section className="mt-12">
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 sm:text-sm">
                Featured resources
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">
                Key entry points
              </h2>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {featuredResources.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 transition hover:border-emerald-200 hover:bg-emerald-50"
                >
                  <p className="text-base font-semibold text-slate-900">
                    {item.title}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {item.description}
                  </p>
                  <p className="mt-4 text-sm font-medium text-emerald-700">
                    Open resource →
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {relatedLinks.length > 0 ? (
        <section className="mt-12">
          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 sm:text-sm">
              Related portal sections
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              Move across themes, geography, and evidence sources through connected sections of Nile Metrica.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {relatedLinks.map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  {link.title}
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}