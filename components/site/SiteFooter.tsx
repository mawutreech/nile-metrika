import Link from "next/link";

const footerGroups = [
  {
    heading: "Navigation",
    links: [
      { label: "Home", href: "/" },
      { label: "States & Territories", href: "/states" },
      { label: "Business", href: "/economy" },
      { label: "Opinion", href: "/opinion" },
    ],
  },
  {
    heading: "Public Sections",
    links: [
      { label: "Sports", href: "/culture-sport" },
      { label: "Health", href: "/society" },
      { label: "Education", href: "/society" },
      { label: "Environment", href: "/environment" },
    ],
  },
  {
    heading: "Evidence",
    links: [
      { label: "Data & Statistics", href: "/statistics" },
      { label: "Data", href: "/data" },
      { label: "Indicators", href: "/indicators" },
      { label: "Methodology", href: "/methodology" },
    ],
  },
  {
    heading: "Portal",
    links: [
      { label: "Publications", href: "/publications" },
      { label: "Search", href: "/search" },
      { label: "Login", href: "/login" },
      { label: "Admin", href: "/admin/stories" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-[#dcdcdc] bg-[#f7f7f5]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_2fr]">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#3f7f68] text-sm font-bold text-white">
                NK
              </div>
              <div>
                <p className="text-[30px] font-light leading-none tracking-tight text-[#3f7f68]">
                  Nile <span className="text-[#5f5aa2]">Metrica</span>
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.24em] text-slate-500">
                  South Sudan Knowledge Portal
                </p>
              </div>
            </Link>

            <p className="mt-5 max-w-md text-sm leading-7 text-[#555]">
              Nile Metrica is a public-facing South Sudan knowledge portal
              bringing together stories, analysis, public information, and
              structured reference content in one place.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
            {footerGroups.map((group) => (
              <div key={group.heading}>
                <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#3f7f68]">
                  {group.heading}
                </h2>
                <ul className="mt-4 space-y-3">
                  {group.links.map((link) => (
                    <li key={link.href + link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-[#444] transition hover:text-[#2f6e57]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 border-t border-[#dcdcdc] pt-6 text-sm text-slate-500">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Nile Metrica. All rights reserved.</p>
            <p>South Sudan knowledge, stories, and public reference.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}