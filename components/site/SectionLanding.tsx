import Link from "next/link";
import Image from "next/image";

type SectionLandingProps = {
  eyebrow: string;
  title: string;
  description: string;
  heroImageSrc?: string;
  heroImageAlt?: string;
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
  heroImageSrc,
  heroImageAlt,
  highlights,
  sections,
  featuredResources = [],
  relatedLinks = [],
}: SectionLandingProps) {
  return (
    <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
      <div className="max-w-4xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#3f7f68] sm:text-sm">
          {eyebrow}
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#2f2f2f] sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-[#555]">
          {description}
        </p>
      </div>

      {heroImageSrc ? (
        <section className="mt-8 overflow-hidden border border-[#d8d8d8] bg-white">
          <div className="relative h-[220px] w-full sm:h-[280px] lg:h-[320px]">
            <Image
              src={heroImageSrc}
              alt={heroImageAlt || title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </section>
      ) : null}

      <section className="mt-10">
        <div className="grid gap-4 md:grid-cols-3">
          {highlights.map((highlight) => (
            <div
              key={highlight.title}
              className="border border-[#d8d8d8] bg-white p-5"
            >
              <p className="text-base font-semibold text-[#2f2f2f]">
                {highlight.title}
              </p>
              <p className="mt-3 text-sm leading-7 text-[#555]">
                {highlight.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#3f7f68] sm:text-sm">
            Core topics
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-[#2f2f2f] sm:text-3xl">
            Explore this section by topic
          </h2>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sections.map((section) => (
            <Link
              key={section.title}
              href={section.href}
              className="border border-[#d8d8d8] bg-white p-5 transition hover:bg-[#f8fbf9]"
            >
              <h3 className="text-lg font-semibold text-[#2f2f2f]">
                {section.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[#555]">
                {section.description}
              </p>
              <p className="mt-4 text-sm font-medium text-[#2f6e57]">
                Open →
              </p>
            </Link>
          ))}
        </div>
      </section>

      {featuredResources.length > 0 ? (
        <section className="mt-12">
          <div className="border border-[#d8d8d8] bg-white p-6 sm:p-8">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#3f7f68] sm:text-sm">
                Featured resources
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-[#2f2f2f] sm:text-3xl">
                Key entry points
              </h2>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {featuredResources.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="border border-[#e4e0d7] bg-[#faf8f3] p-5 transition hover:bg-[#f2f8f5]"
                >
                  <p className="text-base font-semibold text-[#2f2f2f]">
                    {item.title}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[#555]">
                    {item.description}
                  </p>
                  <p className="mt-4 text-sm font-medium text-[#2f6e57]">
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
          <div className="border border-[#d8d8d8] bg-white p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#3f7f68] sm:text-sm">
              Related portal sections
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#555]">
              Move across themes, geography, and evidence through connected sections of Nile Metrica.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {relatedLinks.map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  className="border border-[#d2d2d2] bg-[#faf8f3] px-5 py-3 text-sm font-medium text-[#444] transition hover:bg-[#f2f8f5] hover:text-[#2f6e57]"
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