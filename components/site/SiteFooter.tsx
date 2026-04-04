import Image from "next/image";
import Link from "next/link";

const footerGroups = [
  {
    heading: "Sections",
    links: [
      { label: "Home", href: "/" },
      { label: "News", href: "/" },
      { label: "Business & Tech", href: "/economy" },
      { label: "Opinion", href: "/opinion" },
    ],
  },
  {
    heading: "Data",
    links: [
      { label: "Data & Statistics", href: "/data" },
      { label: "States & Territories", href: "/census" },
      { label: "Indicators", href: "/indicators" },
      { label: "Methodology", href: "/methodology" },
    ],
  },
  {
    heading: "Portal",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "Search", href: "/search" },
      { label: "Login", href: "/login" }
    ],
  },
];

const socialLinks = [
  { label: "Facebook", href: "https://www.facebook.com/profile.php?id=61576507383518" },
  { label: "X", href: "https://x.com/nilemetrica" },
];

export function SiteFooter() {
  return (
    <footer className="mt-16 bg-[#0f3b73] text-white">
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_1.8fr]">
            <div>
              <Link href="/" className="inline-flex items-center gap-3">
                <div className="relative h-10 w-10 overflow-hidden rounded-full border border-white/20 bg-white shadow-sm">
                  <Image
                    src="/nile-metrica-logo-replacement.jpg"
                    alt="Nile Metrica logo"
                    fill
                    className="object-cover"
                  />
                </div>

                <div>
                  <p className="text-[24px] font-light leading-none tracking-tight text-white">
                    Nile <span className="text-[#c7c3ff]">Metrica</span>
                  </p>
                  <p className="mt-1.5 text-[9px] uppercase tracking-[0.22em] text-white/75">
                    Calibrating the Nile Valley
                  </p>
                </div>
              </Link>

              <p className="mt-5 max-w-md text-sm leading-7 text-white/80">
                Nile Metrica is a public-facing South Sudan knowledge portal
                bringing together stories, analysis, public information, and
                structured reference content in one place.
              </p>

              <div className="mt-6 flex items-center gap-3">
                {socialLinks.map((social) => (
                  <Link
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:border-white hover:bg-white hover:text-[#0f3b73]"
                  >
                    {social.label === "Facebook" ? (
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        className="h-5 w-5 fill-current"
                      >
                        <path d="M13.5 22v-8.2h2.8l.4-3.2h-3.2V8.5c0-.9.3-1.6 1.6-1.6h1.7V4.1c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4.2v2.4H7.5v3.2h2.8V22h3.2Z" />
                      </svg>
                    ) : (
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        className="h-5 w-5 fill-current"
                      >
                        <path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3l-4.9-7.4L5.6 22H2.5l7.3-8.3L1 2h6.5l4.4 6.8L18.9 2Zm-1.1 18h1.8L6.6 3.9H4.7L17.8 20Z" />
                      </svg>
                    )}
                  </Link>
                ))}
              </div>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {footerGroups.map((group) => (
                <div key={group.heading}>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/65">
                    {group.heading}
                  </h2>
                  <ul className="mt-4 space-y-3">
                    {group.links.map((link) => (
                      <li key={link.href + link.label}>
                        <Link
                          href={link.href}
                          className="text-sm text-white/85 transition hover:text-white"
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

          <div className="mt-10 border-t border-white/10 pt-6 text-sm text-white/65">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p>© {new Date().getFullYear()} Nile Metrica. All rights reserved.</p>
              <p>South Sudan knowledge, stories, and public reference.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}