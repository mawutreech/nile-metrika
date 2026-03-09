"use client";

import { FormEvent, useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/common/Container";

const quickLinks = [
  "Economy",
  "Population",
  "Health",
  "Education",
  "Agriculture",
  "Environment",
];

export function SearchBlock() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = query.trim();

    if (trimmed) {
      router.push(`/data?q=${encodeURIComponent(trimmed)}`);
    } else {
      router.push("/data");
    }
  }

  function handleQuickLinkClick(link: string) {
    router.push(`/data?q=${encodeURIComponent(link)}`);
  }

  return (
    <section className="bg-white py-12">
      <Container>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
              Search the portal
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
              Find indicators, datasets, reports, or topics
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="relative mt-6">
            <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-14 pr-28 text-sm outline-none placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white"
              placeholder="Search indicators, datasets, reports, or topics"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-800"
            >
              Search
            </button>
          </form>

          <div className="mt-5 flex flex-wrap gap-2">
            {quickLinks.map((link) => (
              <button
                key={link}
                type="button"
                onClick={() => handleQuickLinkClick(link)}
                className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
              >
                {link}
              </button>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}