"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type MenuItem = {
  label: string;
  href: string;
};

type NavGroup = {
  label: string;
  sublabel: string;
  href: string;
  items?: MenuItem[];
  icon: React.ReactNode;
};

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-[#3f7f68]"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function GlobeIcon({ className = "h-8 w-8 text-slate-500" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a15 15 0 0 1 0 18" />
      <path d="M12 3a15 15 0 0 0 0 18" />
    </svg>
  );
}

function GovernmentIcon({ className = "h-8 w-8 text-slate-500" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 10h18" />
      <path d="M5 10v8" />
      <path d="M9 10v8" />
      <path d="M15 10v8" />
      <path d="M19 10v8" />
      <path d="M2 18h20" />
      <path d="M12 4 3 8h18l-9-4Z" />
    </svg>
  );
}

function LawIcon({ className = "h-8 w-8 text-slate-500" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 3v18" />
      <path d="M7 7h10" />
      <path d="m7 7-3 5a2.5 2.5 0 0 0 5 0L7 7Z" />
      <path d="m17 7-3 5a2.5 2.5 0 0 0 5 0l-2-5Z" />
      <path d="M8 21h8" />
    </svg>
  );
}

function EconomyIcon({ className = "h-8 w-8 text-slate-500" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 19h16" />
      <path d="M6 15V9" />
      <path d="M10 15V5" />
      <path d="M14 15v-3" />
      <path d="M18 15V7" />
    </svg>
  );
}

function SocietyIcon({ className = "h-8 w-8 text-slate-500" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
      <circle cx="9.5" cy="7" r="3" />
      <path d="M21 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 4.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function EnvironmentIcon({ className = "h-8 w-8 text-slate-500" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M6 21c6 0 12-6 12-14-8 0-14 6-14 12 0 1.1.9 2 2 2Z" />
      <path d="M10 14c1.5-1.5 4-3 8-4" />
    </svg>
  );
}

function MapIcon({ className = "h-8 w-8 text-slate-500" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="m3 6 6-2 6 2 6-2v14l-6 2-6-2-6 2V6Z" />
      <path d="M9 4v14" />
      <path d="M15 6v14" />
    </svg>
  );
}

function DataIcon({ className = "h-8 w-8 text-slate-500" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <ellipse cx="12" cy="5" rx="7" ry="3" />
      <path d="M5 5v6c0 1.7 3.1 3 7 3s7-1.3 7-3V5" />
      <path d="M5 11v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
    </svg>
  );
}

function PublicationIcon({ className = "h-8 w-8 text-slate-500" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M6 3h9l3 3v15H6z" />
      <path d="M15 3v4h4" />
      <path d="M9 10h6" />
      <path d="M9 14h6" />
      <path d="M9 18h4" />
    </svg>
  );
}

const navGroups: NavGroup[] = [
  {
    label: "COUNTRY",
    sublabel: "overview and geography",
    href: "/country",
    icon: <GlobeIcon />,
    items: [
      { label: "Geography", href: "/country" },
      { label: "History", href: "/country" },
      { label: "Population", href: "/census" },
      { label: "Administrative Structure", href: "/states" },
    ],
  },
  {
    label: "GOVERNANCE",
    sublabel: "institutions and public system",
    href: "/governance",
    icon: <GovernmentIcon />,
    items: [
      { label: "Executive", href: "/governance" },
      { label: "Legislature", href: "/governance" },
      { label: "Judiciary", href: "/governance" },
      { label: "Local Government", href: "/states" },
    ],
  },
  {
    label: "LAW",
    sublabel: "constitution and policy",
    href: "/law",
    icon: <LawIcon />,
    items: [
      { label: "Constitution", href: "/law" },
      { label: "Laws", href: "/law" },
      { label: "Regulations", href: "/law" },
      { label: "Policy Frameworks", href: "/law" },
      { label: "Local Government Act, 2009", href: "/law/local-government-act" },
    ],
  },
  {
    label: "ECONOMY",
    sublabel: "markets and public finance",
    href: "/economy",
    icon: <EconomyIcon />,
    items: [
      { label: "Macroeconomy", href: "/economy" },
      { label: "Public Finance", href: "/economy" },
      { label: "Trade", href: "/economy" },
      { label: "Agriculture", href: "/economy" },
    ],
  },
  {
    label: "SOCIETY",
    sublabel: "services and human development",
    href: "/society",
    icon: <SocietyIcon />,
    items: [
      { label: "Education", href: "/society" },
      { label: "Health", href: "/society" },
      { label: "Water & Sanitation", href: "/society" },
      { label: "Social Protection", href: "/society" },
    ],
  },
  {
    label: "ENVIRONMENT",
    sublabel: "land, climate and resources",
    href: "/environment",
    icon: <EnvironmentIcon />,
    items: [
      { label: "Climate", href: "/environment" },
      { label: "Land", href: "/environment" },
      { label: "Water Resources", href: "/environment" },
      { label: "Disaster Risk", href: "/environment" },
    ],
  },
  {
    label: "STATES",
    sublabel: "territories and local geography",
    href: "/states",
    icon: <MapIcon />,
    items: [
      { label: "All States", href: "/states" },
      { label: "Administrative Areas", href: "/states" },
      { label: "Census Explorer", href: "/census" },
      { label: "County Profiles", href: "/census" },
    ],
  },
  {
    label: "DATA & STATS",
    sublabel: "datasets and indicators",
    href: "/statistics",
    icon: <DataIcon />,
    items: [
      { label: "Datasets", href: "/data" },
      { label: "Indicators", href: "/indicators" },
      { label: "Census", href: "/census" },
      { label: "Methodology", href: "/methodology" },
      { label: "Publications", href: "/publications" },
    ],
  },
  {
    label: "PUBLICATIONS",
    sublabel: "reports and briefs",
    href: "/publications",
    icon: <PublicationIcon />,
  },
];

function DesktopDropdown({
  open,
  items,
}: {
  open: boolean;
  items: MenuItem[];
}) {
  const [mounted, setMounted] = useState(open);

  useEffect(() => {
    if (open) {
      setMounted(true);
      return;
    }
    const timer = setTimeout(() => setMounted(false), 180);
    return () => clearTimeout(timer);
  }, [open]);

  if (!mounted) return null;

  return (
    <>
      <div className="absolute left-0 top-full h-3 w-full" />
      <div
        className={[
          "absolute left-0 top-full z-50 mt-3 min-w-[280px] overflow-hidden rounded-none border border-[#d9d9d9] bg-white shadow-lg transition-all duration-200",
          open
            ? "translate-y-0 opacity-100"
            : "-translate-y-1 pointer-events-none opacity-0",
        ].join(" ")}
      >
        {items.map((item, index) => (
          <Link
            key={item.href + item.label}
            href={item.href}
            className={[
              "block px-5 py-3 text-sm text-[#444] transition hover:bg-[#f6f6f6] hover:text-[#2f6e57]",
              index !== 0 ? "border-t border-[#ececec]" : "",
            ].join(" ")}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </>
  );
}

export function SiteHeader() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const openDropdown = (label: string) => {
    clearCloseTimer();
    setOpenMenu(label);
  };

  const closeDropdownSoon = () => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => setOpenMenu(null), 220);
  };

  useEffect(() => {
    return () => clearCloseTimer();
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white">
      <div className="border-b border-[#dcdcdc]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#3f7f68] text-sm font-bold text-white">
              NK
            </div>

            <div className="min-w-0">
              <p className="truncate text-[30px] font-light leading-none tracking-tight text-[#3f7f68] sm:text-[34px]">
                Nile <span className="text-[#5f5aa2]">Metrica</span>
              </p>
              <p className="mt-1 truncate text-[10px] uppercase tracking-[0.24em] text-slate-500 sm:text-[11px]">
                South Sudan Knowledge Portal
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-4 lg:flex">
            <div>
              <p className="mb-1 text-sm text-[#444]">Search</p>
              <form action="/search" method="GET" className="flex items-center">
                <div className="flex items-center border border-[#d9d9d9] bg-[#f4f4f4] px-4 py-3">
                  <input
                    type="text"
                    name="q"
                    placeholder="Search"
                    className="w-64 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-500"
                  />
                  <SearchIcon />
                </div>
              </form>
            </div>

            <Link
              href="/admin"
              className="mt-6 bg-[#2f6e57] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#285f4b]"
            >
              ADMIN
            </Link>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <Link
              href="/search"
              className="border border-[#d9d9d9] px-3 py-2 text-sm text-slate-700"
            >
              Search
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="border border-[#d9d9d9] px-3 py-2 text-sm text-slate-700"
            >
              Menu
            </button>
          </div>
        </div>
      </div>

      <div className="hidden border-b border-[#dcdcdc] bg-[#f3f3f3] xl:block">
        <div className="mx-auto grid max-w-7xl grid-cols-9">
          {navGroups.map((group) => {
            const isOpen = openMenu === group.label;

            return (
              <div
                key={group.label}
                className="relative border-r border-[#dcdcdc] last:border-r-0"
                onMouseEnter={() => group.items && openDropdown(group.label)}
                onMouseLeave={closeDropdownSoon}
              >
                <Link
                  href={group.href}
                  className={[
                    "group flex min-h-[132px] w-full flex-col items-center justify-center px-4 py-5 text-center transition",
                    isOpen ? "bg-white" : "hover:bg-white",
                  ].join(" ")}
                >
                  <div
                    className={[
                      "mb-4 transition",
                      isOpen
                        ? "text-[#3f7f68]"
                        : "text-slate-500 group-hover:text-[#3f7f68]",
                    ].join(" ")}
                  >
                    {group.icon}
                  </div>
                  <p className="text-[14px] font-medium leading-5 text-[#333]">
                    {group.label}
                  </p>
                  <p className="mt-1 text-[11px] leading-5 text-[#555]">
                    {group.sublabel}
                  </p>
                </Link>

                {group.items ? (
                  <DesktopDropdown open={isOpen} items={group.items} />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      <div
        className={[
          "overflow-hidden bg-white transition-all duration-200 lg:hidden",
          mobileOpen
            ? "max-h-[100rem] border-b border-[#dcdcdc] opacity-100"
            : "max-h-0 border-b-0 opacity-0",
        ].join(" ")}
      >
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          <div className="space-y-4">
            <form
              action="/search"
              method="GET"
              className="border border-[#dcdcdc] bg-[#f5f5f5] p-4"
            >
              <label className="mb-2 block text-sm font-semibold text-[#555]">
                Search
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="q"
                  placeholder="Search"
                  className="w-full border border-[#d9d9d9] bg-white px-4 py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  className="border border-[#d9d9d9] px-4 py-3 text-sm font-medium text-slate-700"
                >
                  Go
                </button>
              </div>
            </form>

            {navGroups.map((group) => (
              <div
                key={group.label}
                className="border border-[#dcdcdc] bg-[#f5f5f5] p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 text-slate-500">{group.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-[#333]">
                        {group.label}
                      </p>
                      <p className="mt-1 text-sm text-[#555]">
                        {group.sublabel}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={group.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-sm font-medium text-[#2f6e57]"
                  >
                    Open
                  </Link>
                </div>

                {group.items ? (
                  <div className="mt-3 space-y-2">
                    {group.items.map((item) => (
                      <Link
                        key={item.href + item.label}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="block bg-white px-4 py-3 text-sm text-[#444]"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}

            <Link
              href="/admin"
              onClick={() => setMobileOpen(false)}
              className="block bg-[#2f6e57] px-4 py-3 text-center text-sm font-medium text-white"
            >
              ADMIN
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}