"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

type MenuItem = {
  label: string;
  href: string;
};

type RegionGroup = {
  label: string;
  items: MenuItem[];
};

type NavGroup = {
  label: string;
  href: string;
  items?: MenuItem[];
  regions?: RegionGroup[];
};

const navGroups: NavGroup[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "States & Territories",
    href: "/states",
    regions: [
      {
        label: "Greater Bahr el Ghazal",
        items: [
          {
            label: "Abyei Administrative Area",
            href: "/states/abyei-administrative-area",
          },
          { label: "Lakes", href: "/states/lakes" },
          {
            label: "Northern Bahr el Ghazal",
            href: "/states/northern-bahr-el-ghazal",
          },
          { label: "Warrap", href: "/states/warrap" },
          {
            label: "Western Bahr el Ghazal",
            href: "/states/western-bahr-el-ghazal",
          },
        ],
      },
      {
        label: "Greater Equatoria",
        items: [
          {
            label: "Central Equatoria",
            href: "/states/central-equatoria",
          },
          {
            label: "Eastern Equatoria",
            href: "/states/eastern-equatoria",
          },
          {
            label: "Western Equatoria",
            href: "/states/western-equatoria",
          },
        ],
      },
      {
        label: "Greater Upper Nile",
        items: [
          { label: "Jonglei", href: "/states/jonglei" },
          { label: "Unity", href: "/states/unity" },
          { label: "Upper Nile", href: "/states/upper-nile" },
          {
            label: "Greater Pibor Administrative Area",
            href: "/states/greater-pibor-administrative-area",
          },
          {
            label: "Ruweng Administrative Area",
            href: "/states/ruweng-administrative-area",
          },
        ],
      },
    ],
  },
  {
    label: "Business",
    href: "/economy",
    items: [
      { label: "Economy", href: "/economy" },
      { label: "Trade", href: "/economy" },
      { label: "Agriculture", href: "/economy" },
      { label: "Markets", href: "/economy" },
      { label: "Publications", href: "/publications" },
    ],
  },
  {
    label: "Opinion",
    href: "/opinion",
    items: [
      { label: "Opinion", href: "/opinion" },
      { label: "Analysis", href: "/opinion" },
      { label: "Commentary", href: "/opinion" },
    ],
  },
  {
    label: "Sports",
    href: "/culture-sport",
    items: [
      { label: "Sports", href: "/culture-sport" },
      { label: "Culture & Sport", href: "/culture-sport" },
    ],
  },
  {
    label: "Health",
    href: "/society",
    items: [
      { label: "Health", href: "/society" },
      { label: "Public Health", href: "/society" },
      { label: "Social Services", href: "/society" },
    ],
  },
  {
    label: "Education",
    href: "/society",
    items: [
      { label: "Education", href: "/society" },
      { label: "Schools", href: "/society" },
      { label: "Human Development", href: "/society" },
    ],
  },
  {
    label: "Environment",
    href: "/environment",
    items: [
      { label: "Environment", href: "/environment" },
      { label: "Climate", href: "/environment" },
      { label: "Land & Resources", href: "/environment" },
    ],
  },
  {
    label: "Data & Statistics",
    href: "/statistics",
    items: [
      { label: "Statistics", href: "/statistics" },
      { label: "Data", href: "/data" },
      { label: "Indicators", href: "/indicators" },
      { label: "Methodology", href: "/methodology" },
    ],
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

function formatToday() {
  return new Intl.DateTimeFormat("en-AU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
}

function DesktopDropdown({
  open,
  items,
  regions,
}: {
  open: boolean;
  items?: MenuItem[];
  regions?: RegionGroup[];
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

  const hasRegions = regions && regions.length > 0;

  return (
    <>
      <div className="absolute left-0 top-full h-3 w-full" />
      <div
        className={[
          "absolute left-1/2 top-full z-50 mt-3 -translate-x-1/2 overflow-hidden border border-[#d9d9d9] bg-white shadow-lg transition-all duration-200",
          hasRegions ? "min-w-[520px]" : "min-w-[260px]",
          open
            ? "translate-y-0 opacity-100"
            : "-translate-y-1 pointer-events-none opacity-0",
        ].join(" ")}
      >
        {hasRegions ? (
          <div className="max-h-[34rem] overflow-y-auto p-4">
            <div className="grid gap-5 md:grid-cols-3">
              {regions.map((region) => (
                <div key={region.label}>
                  <div className="mb-2 border-b border-[#ececec] pb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#2f6e57]">
                    {region.label}
                  </div>
                  <div className="space-y-1">
                    {region.items.map((item) => (
                      <Link
                        key={item.href + item.label}
                        href={item.href}
                        className="block px-2 py-2 text-sm text-[#333] transition hover:bg-[#f7f7f5] hover:text-[#2f6e57]"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          items?.map((item, index) => (
            <Link
              key={item.href + item.label}
              href={item.href}
              className={[
                "block px-5 py-3 text-sm text-[#333] transition hover:bg-[#f7f7f5] hover:text-[#2f6e57]",
                index !== 0 ? "border-t border-[#ececec]" : "",
              ].join(" ")}
            >
              {item.label}
            </Link>
          ))
        )}
      </div>
    </>
  );
}

export default function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSectionOpen, setMobileSectionOpen] = useState<string | null>(
    null
  );
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const today = useMemo(() => formatToday(), []);

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
    closeTimerRef.current = setTimeout(() => setOpenMenu(null), 180);
  };

  useEffect(() => {
    return () => clearCloseTimer();
  }, []);

  return (
    <header className="bg-white">
      <div className="border-b border-[#d9d9d9]">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
          <div className="grid grid-cols-2 items-center gap-4 md:grid-cols-3">
            <div className="text-left text-xs uppercase tracking-[0.16em] text-[#666] sm:text-sm">
              {today}
            </div>

            <div className="col-span-2 text-right md:hidden">
              <button
                type="button"
                onClick={() => setMobileOpen((v) => !v)}
                className="border border-[#d0d0d0] px-3 py-2 text-sm text-[#333]"
              >
                Menu
              </button>
            </div>

            <div className="hidden text-center md:block">
              <Link href="/" className="inline-block">
                <div className="text-[40px] font-light leading-none tracking-tight text-[#3f7f68]">
                  Nile <span className="text-[#5f5aa2]">Metrica</span>
                </div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.28em] text-[#6b7280]">
                  South Sudan Knowledge Portal
                </div>
              </Link>
            </div>

            <div className="hidden text-right md:block">
              <div className="flex items-center justify-end gap-4">
                <form action="/search" method="GET" className="w-56">
                  <input
                    type="text"
                    name="q"
                    placeholder="Search"
                    className="w-full border border-[#d9d9d9] px-3 py-2 text-sm outline-none"
                  />
                </form>
                <Link
                  href="/login"
                  className="text-sm font-medium uppercase tracking-[0.14em] text-[#333] transition hover:text-[#2f6e57]"
                >
                  Login
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-4 text-center md:hidden">
            <Link href="/" className="inline-block">
              <div className="text-[34px] font-light leading-none tracking-tight text-[#3f7f68]">
                Nile <span className="text-[#5f5aa2]">Metrica</span>
              </div>
              <div className="mt-1 text-[10px] uppercase tracking-[0.24em] text-[#6b7280]">
                South Sudan Knowledge Portal
              </div>
            </Link>
          </div>

          <div className="mt-4 flex items-center justify-between md:hidden">
            <Link
              href="/login"
              className="text-sm font-medium uppercase tracking-[0.14em] text-[#333] transition hover:text-[#2f6e57]"
            >
              Login
            </Link>

            <form action="/search" method="GET" className="w-[58%]">
              <input
                type="text"
                name="q"
                placeholder="Search"
                className="w-full border border-[#d9d9d9] px-3 py-2 text-sm outline-none"
              />
            </form>
          </div>
        </div>
      </div>

      <div className="hidden md:block">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <nav>
            <div className="flex items-center justify-center gap-8 py-4">
              {navGroups.map((group) => {
                const isOpen = openMenu === group.label;

                return (
                  <div
                    key={group.label}
                    className="relative"
                    onMouseEnter={() =>
                      (group.items || group.regions) && openDropdown(group.label)
                    }
                    onMouseLeave={closeDropdownSoon}
                  >
                    <Link
                      href={group.href}
                      className="text-[15px] font-medium text-[#222] transition hover:text-[#2f6e57]"
                    >
                      {group.label}
                    </Link>

                    {group.items || group.regions ? (
                      <DesktopDropdown
                        open={isOpen}
                        items={group.items}
                        regions={group.regions}
                      />
                    ) : null}
                  </div>
                );
              })}
            </div>
          </nav>

          <div className="pb-2">
            <div className="border-b border-[#222]" />
            <div className="mt-[3px] border-b border-[#222]" />
          </div>
        </div>
      </div>

      <div
        className={[
          "overflow-hidden border-b border-[#d9d9d9] bg-white transition-all duration-200 md:hidden",
          mobileOpen ? "max-h-[60rem] py-4" : "max-h-0 py-0",
        ].join(" ")}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="space-y-3">
            {navGroups.map((group) => {
              const isExpanded = mobileSectionOpen === group.label;

              return (
                <div key={group.label} className="border border-[#e5e5e5]">
                  <div className="flex items-center justify-between gap-3 p-4">
                    <Link
                      href={group.href}
                      onClick={() => setMobileOpen(false)}
                      className="text-sm font-medium text-[#333]"
                    >
                      {group.label}
                    </Link>

                    {group.items || group.regions ? (
                      <button
                        type="button"
                        onClick={() =>
                          setMobileSectionOpen((current) =>
                            current === group.label ? null : group.label
                          )
                        }
                        className="border border-[#d9d9d9] px-3 py-1 text-sm text-[#333]"
                      >
                        {isExpanded ? "−" : "+"}
                      </button>
                    ) : null}
                  </div>

                  {isExpanded ? (
                    <div className="border-t border-[#e5e5e5] bg-[#fafafa] p-3">
                      {group.regions ? (
                        <div className="space-y-4">
                          {group.regions.map((region) => (
                            <div key={region.label}>
                              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#2f6e57]">
                                {region.label}
                              </div>
                              <div className="space-y-2">
                                {region.items.map((item) => (
                                  <Link
                                    key={item.href + item.label}
                                    href={item.href}
                                    onClick={() => {
                                      setMobileOpen(false);
                                      setMobileSectionOpen(null);
                                    }}
                                    className="block px-3 py-2 text-sm text-[#444]"
                                  >
                                    {item.label}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : group.items ? (
                        <div className="space-y-2">
                          {group.items.map((item) => (
                            <Link
                              key={item.href + item.label}
                              href={item.href}
                              onClick={() => {
                                setMobileOpen(false);
                                setMobileSectionOpen(null);
                              }}
                              className="block px-3 py-2 text-sm text-[#444]"
                            >
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}