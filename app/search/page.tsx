import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { PublicPageIntro } from "@/components/site/PublicPageIntro";

type SearchPageProps = {
  searchParams?: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const query = (resolvedSearchParams?.q || "").trim();
  const supabase = await createClient();

  let publications:
    | {
        id: string;
        title: string;
        slug: string;
        summary: string | null;
        type: string | null;
        publication_date: string | null;
      }[]
    | null = null;

  let datasets:
    | {
        id: string;
        title: string;
        slug: string;
        description: string | null;
        format: string | null;
        update_date: string | null;
      }[]
    | null = null;

  let indicators:
    | {
        id: string;
        name: string;
        slug: string;
        code: string | null;
        description: string | null;
        frequency: string | null;
        unit: string | null;
      }[]
    | null = null;

  let publicationsError = false;
  let datasetsError = false;
  let indicatorsError = false;

  if (query) {
    const [pubRes, dataRes, indRes] = await Promise.all([
      supabase
        .from("publications")
        .select("id, title, slug, summary, type, publication_date")
        .or(
          `title.ilike.%${query}%,summary.ilike.%${query}%,type.ilike.%${query}%`
        )
        .order("publication_date", { ascending: false })
        .limit(12),

      supabase
        .from("datasets")
        .select("id, title, slug, description, format, update_date")
        .or(
          `title.ilike.%${query}%,description.ilike.%${query}%,format.ilike.%${query}%`
        )
        .order("update_date", { ascending: false })
        .limit(12),

      supabase
        .from("indicators")
        .select("id, name, slug, code, description, frequency, unit")
        .or(
          `name.ilike.%${query}%,code.ilike.%${query}%,description.ilike.%${query}%,frequency.ilike.%${query}%,unit.ilike.%${query}%`
        )
        .order("name", { ascending: true })
        .limit(12),
    ]);

    publications = pubRes.data;
    datasets = dataRes.data;
    indicators = indRes.data;

    publicationsError = !!pubRes.error;
    datasetsError = !!dataRes.error;
    indicatorsError = !!indRes.error;
  }

  const totalResults =
    (publications?.length || 0) +
    (datasets?.length || 0) +
    (indicators?.length || 0);

  return (
    <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
      <PublicPageIntro
        eyebrow="Search"
        title="Search Nile Metrica"
        description="Search across publications, datasets, and indicators from one place."
      />

      <form action="/search" method="GET" className="mt-8 max-w-3xl">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search for inflation, GDP, agriculture, report..."
            className="w-full rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm text-slate-900 placeholder:text-slate-400"
          />
          <button
            type="submit"
            className="rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-800"
          >
            Search
          </button>
        </div>
      </form>

      {!query ? (
        <div className="mt-10 rounded-[1.75rem] border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          Enter a keyword to search publications, datasets, and indicators.
        </div>
      ) : (
        <>
          <div className="mt-8 text-sm text-slate-500">
            {totalResults > 0
              ? `${totalResults} result${totalResults === 1 ? "" : "s"} for “${query}”`
              : `No results found for “${query}”`}
          </div>

          <div className="mt-8 space-y-8">
            <SearchSection
              title="Publications"
              emptyMessage="No matching publications."
              hasError={publicationsError}
            >
              {publications?.map((item) => (
                <ResultCard
                  key={item.id}
                  title={item.title}
                  description={item.summary || "No summary available."}
                  meta={`${item.type || "Publication"} • ${item.publication_date || "N/A"}`}
                  href={`/publications/${item.slug}`}
                  buttonLabel="Open publication"
                />
              ))}
            </SearchSection>

            <SearchSection
              title="Datasets"
              emptyMessage="No matching datasets."
              hasError={datasetsError}
            >
              {datasets?.map((item) => (
                <ResultCard
                  key={item.id}
                  title={item.title}
                  description={item.description || "No description available."}
                  meta={`${item.format || "Unknown format"} • Updated ${item.update_date || "N/A"}`}
                  href={`/datasets/${item.slug}`}
                  buttonLabel="Open dataset"
                />
              ))}
            </SearchSection>

            <SearchSection
              title="Indicators"
              emptyMessage="No matching indicators."
              hasError={indicatorsError}
            >
              {indicators?.map((item) => (
                <ResultCard
                  key={item.id}
                  title={item.name}
                  description={item.description || "No description available."}
                  meta={`${item.code || "No code"} • ${item.frequency || "Unknown frequency"} • ${item.unit || "No unit"}`}
                  href={`/indicators/${item.slug}`}
                  buttonLabel="Open indicator"
                />
              ))}
            </SearchSection>
          </div>
        </>
      )}
    </main>
  );
}

function SearchSection({
  title,
  children,
  emptyMessage,
  hasError,
}: {
  title: string;
  children: React.ReactNode;
  emptyMessage: string;
  hasError?: boolean;
}) {
  const items = Array.isArray(children)
    ? children.filter(Boolean)
    : children
      ? [children]
      : [];

  return (
    <section className="rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-4">
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      </div>

      {hasError ? (
        <div className="px-6 py-6 text-sm text-rose-600">
          Failed to load {title.toLowerCase()}.
        </div>
      ) : items.length > 0 ? (
        <div className="divide-y divide-slate-100">{items}</div>
      ) : (
        <div className="px-6 py-6 text-sm text-slate-600">{emptyMessage}</div>
      )}
    </section>
  );
}

function ResultCard({
  title,
  description,
  meta,
  href,
  buttonLabel,
}: {
  title: string;
  description: string;
  meta: string;
  href: string;
  buttonLabel: string;
}) {
  return (
    <div className="flex flex-col gap-4 px-6 py-5 md:flex-row md:items-start md:justify-between">
      <div className="min-w-0">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <p className="mt-1 text-sm text-slate-500">{meta}</p>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
          {description}
        </p>
      </div>

      <div>
        <Link
          href={href}
          className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          {buttonLabel}
        </Link>
      </div>
    </div>
  );
}