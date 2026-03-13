import Link from "next/link";

const exploreLinks = [
  { label: "Country", href: "/country" },
  { label: "Governance", href: "/governance" },
  { label: "Law & Constitution", href: "/law" },
  { label: "Economy", href: "/economy" },
  { label: "Society & Services", href: "/society" },
  { label: "Environment", href: "/environment" },
];

const geographyLinks = [
  { label: "States & Territories", href: "/states" },
  { label: "Census Explorer", href: "/census" },
  { label: "Administrative Areas", href: "/census" },
  { label: "County Profiles", href: "/census" },
];

const evidenceLinks = [
  { label: "Data & Statistics", href: "/statistics" },
  { label: "Datasets", href: "/data" },
  { label: "Indicators", href: "/indicators" },
  { label: "Publications", href: "/publications" },
  { label: "Methodology", href: "/methodology" },
];

const utilityLinks = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Search", href: "/search" },
  { label: "Admin", href: "/admin" },
];

const featuredLinks = [
  { label: "Country Overview", href: "/country" },
  { label: "Governance", href: "/governance" },
  { label: "Census Explorer", href: "/census" },
  { label: "Data & Statistics", href: "/statistics" },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[#dcdcdc] bg-[#f7f4ee]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14">
        <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#3f7f68] text-sm font-bold text-white">
                NK
              </div>
              <div>
                <p className="text-2xl font-light leading-none tracking-tight text-[#3f7f68]">
                  Nile <span className="text-[#5f5aa2]">Metrica</span>
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-slate-500">
                  South Sudan Knowledge Portal
                </p>
              </div>
            </Link>

            <p className="mt-5 max-w-md text-sm leading-7 text-[#555]">
              Nile Metrica brings together governance, geography, law, public
              information, and data in one structured portal for South Sudan.
            </p>

            <div className="mt-6 border border-[#d9d2c3] bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#3f7f68]">
                Portal scope
              </p>
              <p className="mt-2 text-sm leading-6 text-[#555]">
                Built to improve access to national and subnational knowledge
                across themes, institutions, places, and structured evidence.
              </p>
            </div>
          </div>

          <FooterColumn title="Explore" links={exploreLinks} />
          <FooterColumn title="Geography" links={geographyLinks} />
          <FooterColumn title="Evidence" links={evidenceLinks} />
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="border border-[#d9d2c3] bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#3f7f68]">
              Featured portal pathways
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {featuredLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="border border-[#d2d2d2] bg-[#faf8f3] px-4 py-2 text-sm font-medium text-[#444] transition hover:bg-[#f2f8f5] hover:text-[#2f6e57]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="border border-[#d9d2c3] bg-white p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-semibold text-[#2f2f2f]">
                  Quick access
                </p>
                <p className="mt-1 text-sm text-[#555]">
                  Move quickly across the main portal utilities and support
                  pages.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {utilityLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="border border-[#d2d2d2] bg-white px-4 py-2 text-sm font-medium text-[#444] transition hover:bg-[#f6f6f6]"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-[#dcdcdc] pt-6 text-sm text-[#666]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p>© {year} Nile Metrica. South Sudan Knowledge Portal.</p>
            <p>Coverage and content depth will continue expanding over time.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#3f7f68]">
        {title}
      </p>
      <div className="mt-4 space-y-3">
        {links.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="block text-sm text-[#444] transition hover:text-[#2f6e57]"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}