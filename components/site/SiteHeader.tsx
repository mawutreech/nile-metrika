"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type MenuItem = {
  label: string;
  href: string;
  description?: string;
};

type MenuGroup = {
  label: string;
  items: MenuItem[];
};

function SearchIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

const menuGroups: MenuGroup[] = [
  {
    label: "Data",
    items: [
      {
        label: "Datasets",
        href: "/data",
        description: "Browse downloadable datasets and data tables.",
      },
      {
        label: "Indicators",
        href: "/indicators",
        description: "Explore key indicators and time-series values.",
      },
    ],
  },
  {
    label: "Publications",
    items: [
      {
        label: "All publications",
        href: "/publications",
        description: "Reports, bulletins, briefs, and releases.",
      },
    ],
  },
  {
    label: "Methodology",
    items: [
      {
        label: "Methodology",
        href: "/methodology",
        description: "Sources, methods, definitions, and notes.",
      },
    ],
  },
  {
    label: "About",
    items: [
      {
        label: "About Nile Metrika",
        href: "/about",
        description: "Learn more about the portal and its purpose.",
      },
      {
        label: "Contact",
        href: "/contact",
        description: "Get in touch or share feedback.",
      },
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
  const [shouldRender, setShouldRender] = useState(open);

  useEffect(() => {
    if (open) {
      setShouldRender(true);
      return;
    }

    const timer = setTimeout(() => setShouldRender(false), 220);
    return () => clearTimeout(timer);
  }, [open]);

  if (!shouldRender) return null;

  return (
    <>
      <div className="absolute left-0 top-full h-4 w-[420px] max-w-[calc(100vw-2rem)]" />
      <div
        className={[
          "absolute left-0 top-full mt-3 w-[420px] max-w-[calc(100vw-2rem)] rounded-3xl border border-slate-200 bg-white p-3 shadow-xl origin-top-left",
          "transition-all duration-200 ease-out",
          open
            ? "translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-y-1 scale-95 opacity-0",
        ].join(" ")}
      >
        <div className="space-y-1">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-2xl px-4 py-3 transition hover:bg-slate-50"
            >
              <p className="text-sm font-semibold text-slate-900">
                {item.label}
              </p>
              {item.description ? (
                <p className="mt-1 break-words text-sm leading-5 text-slate-500">
                  {item.description}
                </p>
              ) : null}
            </Link>
          ))}
        </div>
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

  const scheduleCloseDropdown = () => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      setOpenMenu(null);
    }, 220);
  };

  useEffect(() => {
    return () => clearCloseTimer();
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-700 text-sm font-bold text-white shadow-sm">
            NK
          </div>

          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-slate-900 sm:text-lg">
              Nile Metrika
            </p>
            <p className="truncate text-[10px] uppercase tracking-[0.16em] text-slate-500 sm:text-xs sm:tracking-[0.18em]">
              South Sudan Data Portal
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 xl:flex">
          {menuGroups.map((group) => (
            <div
              key={group.label}
              className="relative"
              onMouseEnter={() => openDropdown(group.label)}
              onMouseLeave={scheduleCloseDropdown}
            >
              <button
                type="button"
                onClick={() =>
                  setOpenMenu((current) =>
                    current === group.label ? null : group.label
                  )
                }
                className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
              >
                {group.label}
              </button>

              <DropdownMenu
                open={openMenu === group.label}
                items={group.items}
              />
            </div>
          ))}

          <form
            action="/search"
            method="GET"
            className="ml-2 flex items-center gap-2"
          >
            <div className="flex items-center rounded-xl border border-slate-300 bg-white px-3 py-2 transition focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100">
              <SearchIcon className="mr-2 h-4 w-4 shrink-0 text-slate-400" />
              <input
                type="text"
                name="q"
                placeholder="Search..."
                className="w-32 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />
            </div>
            <button
              type="submit"
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Go
            </button>
          </form>

          <Link
            href="/admin"
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Admin
          </Link>
        </nav>

        <div className="hidden items-center gap-2 lg:flex xl:hidden">
          <Link
            href="/data"
            className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
          >
            Data
          </Link>
          <Link
            href="/indicators"
            className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
          >
            Indicators
          </Link>
          <Link
            href="/publications"
            className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
          >
            Publications
          </Link>
          <Link
            href="/methodology"
            className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
          >
            Methodology
          </Link>
          <Link
            href="/about"
            className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
          >
            About
          </Link>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <SearchIcon className="h-4 w-4" />
            Search
          </Link>
          <Link
            href="/admin"
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Admin
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <Link
            href="/search"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <SearchIcon className="h-4 w-4" />
            Search
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((current) => !current)}
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Menu
          </button>
        </div>
      </div>

      <div
        className={[
          "border-t border-slate-200 bg-white lg:hidden overflow-hidden transition-all duration-200 ease-out",
          mobileOpen ? "max-h-[80rem] opacity-100" : "max-h-0 opacity-0",
        ].join(" ")}
      >
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          <div className="space-y-4">
            {menuGroups.map((group) => (
              <div
                key={group.label}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
                  {group.label}
                </p>
                <div className="mt-3 space-y-2">
                  {group.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="block rounded-xl bg-white px-4 py-3 shadow-sm transition hover:bg-slate-100"
                    >
                      <p className="text-sm font-semibold text-slate-900">
                        {item.label}
                      </p>
                      {item.description ? (
                        <p className="mt-1 text-sm text-slate-500">
                          {item.description}
                        </p>
                      ) : null}
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            <form
              action="/search"
              method="GET"
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
                Search
              </label>
              <div className="flex gap-2">
                <div className="flex w-full items-center rounded-xl border border-slate-300 bg-white px-4 py-3 transition focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100">
                  <SearchIcon className="mr-2 h-4 w-4 shrink-0 text-slate-400" />
                  <input
                    type="text"
                    name="q"
                    placeholder="Search..."
                    className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Go
                </button>
              </div>
            </form>

            <Link
              href="/admin"
              onClick={() => setMobileOpen(false)}
              className="block rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}