"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type MenuItem = {
  label: string;
  href: string;
};

type MenuGroup = {
  label: string;
  sublabel: string;
  href?: string;
  items?: MenuItem[];
  icon: React.ReactNode;
};

function PublicationsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-9 w-9 text-slate-500"
      aria-hidden="true"
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 17H20V4H6.5A2.5 2.5 0 0 0 4 6.5v10.5A2.5 2.5 0 0 1 6.5 19.5Z" />
    </svg>
  );
}

function DataIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-9 w-9 text-emerald-600"
      aria-hidden="true"
    >
      <ellipse cx="12" cy="5" rx="7" ry="3" />
      <path d="M5 5v6c0 1.7 3.1 3 7 3s7-1.3 7-3V5" />
      <path d="M5 11v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
    </svg>
  );
}

function CensusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-9 w-9 text-slate-500"
      aria-hidden="true"
    >
      <path d="M3 21h18" />
      <path d="M5 21V8l7-5 7 5v13" />
      <path d="M9 21v-6h6v6" />
      <path d="M8 10h.01" />
      <path d="M12 10h.01" />
      <path d="M16 10h.01" />
    </svg>
  );
}

function MethodologyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-9 w-9 text-slate-500"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M8 16v-3" />
      <path d="M12 16V9" />
      <path d="M16 16v-6" />
      <circle cx="8" cy="10" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="7" r="1" fill="currentColor" stroke="none" />
      <circle cx="16" cy="8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function AboutIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-8 w-8 text-slate-500"
      aria-hidden="true"
    >
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H14a2.5 2.5 0 0 1 2.5 2.5V11A2.5 2.5 0 0 1 14 13.5H9l-4 3V5.5Z" />
      <path d="M20 8.5A2.5 2.5 0 0 0 17.5 6H17v5A4 4 0 0 1 13 15h-1.2l3.2 2.4V15h2.5A2.5 2.5 0 0 0 20 12.5v-4Z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-emerald-700"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

const menuGroups: MenuGroup[] = [
  {
    label: "DATA",
    sublabel: "datasets and indicators",
    icon: <DataIcon />,
    items: [
      { label: "DATASETS", href: "/data" },
      { label: "INDICATORS", href: "/indicators" },
    ],
  },
  {
    label: "PUBLICATIONS",
    sublabel: "reports and bulletins",
    icon: <PublicationsIcon />,
    items: [{ label: "ALL PUBLICATIONS", href: "/publications" }],
  },
  {
    label: "CENSUS",
    sublabel: "states and areas",
    icon: <CensusIcon />,
    items: [
      { label: "CENSUS OVERVIEW", href: "/census" },
      { label: "CENTRAL EQUATORIA", href: "/census/central-equatoria" },
      { label: "EASTERN EQUATORIA", href: "/census/eastern-equatoria" },
      { label: "JONGLEI", href: "/census/jonglei" },
      { label: "LAKES", href: "/census/lakes" },
      { label: "NORTHERN BAHR EL GHAZAL", href: "/census/northern-bahr-el-ghazal" },
      { label: "UNITY", href: "/census/unity" },
      { label: "UPPER NILE", href: "/census/upper-nile" },
      { label: "WARRAP", href: "/census/warrap" },
      { label: "WESTERN BAHR EL GHAZAL", href: "/census/western-bahr-el-ghazal" },
      { label: "WESTERN EQUATORIA", href: "/census/western-equatoria" },
      { label: "ABYEI ADMINISTRATIVE AREA", href: "/census/abyei-administrative-area" },
      { label: "GREATER PIBOR ADMINISTRATIVE AREA", href: "/census/greater-pibor-administrative-area" },
      { label: "RUWENG ADMINISTRATIVE AREA", href: "/census/ruweng-administrative-area" },
    ],
  },
  {
    label: "METHODOLOGY",
    sublabel: "sources and definitions",
    icon: <MethodologyIcon />,
    href: "/methodology",
  },
  {
    label: "ABOUT",
    sublabel: "portal and contact",
    icon: <AboutIcon />,
    items: [
      { label: "ABOUT NILE METRIKA", href: "/about" },
      { label: "CONTACT", href: "/contact" },
    ],
  },
];

function DropdownMenu({
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
      <div className="absolute left-0 top-full h-4 w-full" />
      <div
        className={[
          "absolute left-0 top-full z-50 max-h-[70vh] w-full overflow-y-auto origin-top border-x border-b border-slate-200 bg-white shadow-sm transition-all duration-200 ease-out",
          open
            ? "translate-y-0 opacity-100"
            : "-translate-y-1 pointer-events-none opacity-0",
        ].join(" ")}
      >
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block border-t border-slate-100 px-5 py-3.5 text-center text-[12px] font-medium tracking-[0.08em] text-slate-700 transition hover:bg-slate-50"
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
    closeTimerRef.current = setTimeout(() => {
      setOpenMenu(null);
    }, 220);
  };

  useEffect(() => {
    return () => clearCloseTimer();
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white">
      <div className="border-b border-slate-200">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:py-5">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white">
              NK
            </div>

            <div className="min-w-0">
              <p className="truncate text-[30px] font-light leading-none tracking-tight text-emerald-700 sm:text-[34px]">
                Nile <span className="text-indigo-700">Metrika</span>
              </p>
              <p className="mt-1 truncate text-[10px] uppercase tracking-[0.24em] text-slate-500 sm:text-[11px]">
                South Sudan Data Portal
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-3 lg:flex">
            <form action="/search" method="GET" className="flex items-center">
              <div className="flex items-center rounded-md bg-slate-100 px-4 py-3 shadow-sm">
                <input
                  type="text"
                  name="q"
                  placeholder="Search the portal"
                  className="w-64 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-500"
                />
                <SearchIcon />
              </div>
            </form>

            <Link
              href="/admin"
              className="rounded-md bg-emerald-700 px-4 py-3 text-sm font-medium text-white transition hover:bg-emerald-800"
            >
              Admin
            </Link>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <Link
              href="/search"
              className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700"
            >
              Search
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700"
            >
              Menu
            </button>
          </div>
        </div>
      </div>

      <div className="hidden border-y border-slate-200 bg-white xl:block">
        <div className="mx-auto grid max-w-7xl grid-cols-5">
          {menuGroups.map((group) => {
            const isOpen = openMenu === group.label;

            if (group.href) {
              return (
                <Link
                  key={group.label}
                  href={group.href}
                  className="flex min-h-[124px] flex-col items-center justify-center border-r border-slate-200 px-5 py-5 text-center transition last:border-r-0 hover:bg-slate-50"
                >
                  <div className="mb-2.5">{group.icon}</div>
                  <p className="text-[14px] font-medium tracking-[0.06em] text-slate-800">
                    {group.label}
                  </p>
                  <p className="mt-1 text-[12px] text-slate-600">
                    {group.sublabel}
                  </p>
                </Link>
              );
            }

            return (
              <div
                key={group.label}
                className="relative border-r border-slate-200 last:border-r-0"
                onMouseEnter={() => openDropdown(group.label)}
                onMouseLeave={closeDropdownSoon}
              >
                <button
                  type="button"
                  onClick={() =>
                    setOpenMenu((current) =>
                      current === group.label ? null : group.label
                    )
                  }
                  className={[
                    "flex min-h-[124px] w-full flex-col items-center justify-center px-5 py-5 text-center transition",
                    isOpen ? "bg-slate-50" : "hover:bg-slate-50",
                  ].join(" ")}
                >
                  <div className="mb-2.5">{group.icon}</div>
                  <p className="text-[14px] font-medium tracking-[0.06em] text-slate-800">
                    {group.label}
                  </p>
                  <p className="mt-1 text-[12px] text-slate-600">
                    {group.sublabel}
                  </p>
                </button>

                <DropdownMenu open={isOpen} items={group.items || []} />
              </div>
            );
          })}
        </div>
      </div>

      <div
        className={[
          "overflow-hidden bg-white transition-all duration-200 lg:hidden",
          mobileOpen
            ? "max-h-[80rem] border-b border-slate-200 opacity-100"
            : "max-h-0 border-b-0 opacity-0",
        ].join(" ")}
      >
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          <div className="space-y-4">
            <form
              action="/search"
              method="GET"
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
                Search
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="q"
                  placeholder="Search the portal"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700"
                >
                  Go
                </button>
              </div>
            </form>

            {menuGroups.map((group) => (
              <div
                key={group.label}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex items-center gap-3">
                  <div>{group.icon}</div>
                  <div>
                    <p className="text-sm font-semibold tracking-[0.05em] text-slate-900">
                      {group.label}
                    </p>
                    <p className="text-sm text-slate-600">{group.sublabel}</p>
                  </div>
                </div>

                {group.href ? (
                  <Link
                    href={group.href}
                    onClick={() => setMobileOpen(false)}
                    className="mt-3 block rounded-xl bg-white px-4 py-3 text-sm text-slate-700 shadow-sm"
                  >
                    Open
                  </Link>
                ) : (
                  <div className="mt-3 space-y-2">
                    {(group.items || []).map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="block rounded-xl bg-white px-4 py-3 text-sm text-slate-700 shadow-sm"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <Link
              href="/admin"
              onClick={() => setMobileOpen(false)}
              className="block rounded-xl bg-emerald-700 px-4 py-3 text-sm font-medium text-white"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}