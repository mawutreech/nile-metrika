"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type MenuItem = {
  label: string;
  href: string;
};

type NavGroup = {
  label: string;
  href?: string;
  items?: MenuItem[];
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
      className="h-4 w-4 text-emerald-700"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

const navGroups: NavGroup[] = [
  {
    label: "Country",
    items: [
      { label: "Overview", href: "/country" },
      { label: "Geography", href: "/country" },
      { label: "History", href: "/country" },
      { label: "Population", href: "/census" },
      { label: "Administrative Structure", href: "/states" },
    ],
  },
  {
    label: "Governance",
    items: [
      { label: "Overview", href: "/governance" },
      { label: "Executive", href: "/governance" },
      { label: "Legislature", href: "/governance" },
      { label: "Judiciary", href: "/governance" },
      { label: "Local Government", href: "/states" },
    ],
  },
  {
    label: "Law & Constitution",
    items: [
      { label: "Overview", href: "/law" },
      { label: "Constitution", href: "/law" },
      { label: "Laws", href: "/law" },
      { label: "Regulations", href: "/law" },
      { label: "Policy Frameworks", href: "/law" },
    ],
  },
  {
    label: "Economy",
    items: [
      { label: "Overview", href: "/economy" },
      { label: "Macroeconomy", href: "/economy" },
      { label: "Public Finance", href: "/economy" },
      { label: "Trade", href: "/economy" },
      { label: "Agriculture", href: "/economy" },
    ],
  },
  {
    label: "Society & Services",
    items: [
      { label: "Overview", href: "/society" },
      { label: "Education", href: "/society" },
      { label: "Health", href: "/society" },
      { label: "Water & Sanitation", href: "/society" },
      { label: "Social Protection", href: "/society" },
    ],
  },
  {
    label: "Environment",
    items: [
      { label: "Overview", href: "/environment" },
      { label: "Climate", href: "/environment" },
      { label: "Land", href: "/environment" },
      { label: "Water Resources", href: "/environment" },
      { label: "Disaster Risk", href: "/environment" },
    ],
  },
  {
    label: "States & Territories",
    items: [
      { label: "Overview", href: "/states" },
      { label: "All States", href: "/states" },
      { label: "Administrative Areas", href: "/states" },
      { label: "Census Explorer", href: "/census" },
      { label: "County Profiles", href: "/census" },
    ],
  },
  {
    label: "Data & Statistics",
    items: [
      { label: "Overview", href: "/statistics" },
      { label: "Datasets", href: "/data" },
      { label: "Indicators", href: "/indicators" },
      { label: "Census", href: "/census" },
      { label: "Methodology", href: "/methodology" },
      { label: "Publications", href: "/publications" },
    ],
  },
  {
    label: "Publications",
    href: "/publications",
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
          "absolute left-0 top-full z-50 mt-3 min-w-[260px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl transition-all duration-200",
          open ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0 pointer-events-none",
        ].join(" ")}
      >
        {items.map((item, index) => (
          <Link
            key={item.href + item.label}
            href={item.href}
            className={[
              "block px-5 py-3 text-sm text-slate-700 transition hover:bg-slate-50 hover:text-emerald-700",
              index !== 0 ? "border-t border-slate-100" : "",
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
                South Sudan Knowledge Portal
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

      <div className="hidden border-b border-slate-200 bg-white xl:block">
        <div className="mx-auto flex max-w-7xl items-center gap-1 px-4 py-3 sm:px-6">
          {navGroups.map((group) => {
            const isOpen = openMenu === group.label;

            if (group.href) {
              return (
                <Link
                  key={group.label}
                  href={group.href}
                  className="rounded-xl px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
                >
                  {group.label}
                </Link>
              );
            }

            return (
              <div
                key={group.label}
                className="relative"
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
                    "rounded-xl px-4 py-2 text-sm font-medium transition",
                    isOpen
                      ? "bg-slate-50 text-slate-900"
                      : "text-slate-700 hover:bg-slate-50 hover:text-slate-900",
                  ].join(" ")}
                >
                  {group.label}
                </button>

                <DesktopDropdown open={isOpen} items={group.items || []} />
              </div>
            );
          })}
        </div>
      </div>

      <div
        className={[
          "overflow-hidden bg-white transition-all duration-200 lg:hidden",
          mobileOpen
            ? "max-h-[100rem] border-b border-slate-200 opacity-100"
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

            {navGroups.map((group) => (
              <div
                key={group.label}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-900">
                    {group.label}
                  </p>
                  {group.href ? (
                    <Link
                      href={group.href}
                      onClick={() => setMobileOpen(false)}
                      className="text-sm font-medium text-emerald-700"
                    >
                      Open
                    </Link>
                  ) : null}
                </div>

                {group.items ? (
                  <div className="mt-3 space-y-2">
                    {group.items.map((item) => (
                      <Link
                        key={item.href + item.label}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="block rounded-xl bg-white px-4 py-3 text-sm text-slate-700 shadow-sm"
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