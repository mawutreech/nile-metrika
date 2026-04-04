import Link from "next/link";
import type { Metadata } from "next";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Nile Metrica",
  description:
    "Follow South Sudan through news, analysis, opinion, publications, and structured public reference.",
  alternates: {
    canonical: "https://nilemetrica.com",
  },
};

type Story = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image_url: string | null;
  section: string;
  category: string | null;
  published_at: string | null;
  reading_time: number;
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#3f7f68]">
      {children}
    </p>
  );
}

function StoryCard({ story }: { story: Story }) {
  return (
    <Link
      href={`/stories/${story.slug}`}
      className="block border border-[#d8d8d8] bg-white p-5 transition hover:bg-[#fafafa]"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#3f7f68]">
        {story.category || story.section}
      </p>

      <h3 className="mt-3 text-2xl font-semibold leading-tight text-[#2f2f2f]">
        {story.title}
      </h3>

      {story.excerpt ? (
        <p className="mt-3 text-sm leading-7 text-[#555]">{story.excerpt}</p>
      ) : null}

      <p className="mt-3 text-sm text-slate-500">{story.reading_time} min read</p>
    </Link>
  );
}

function CompactStoryLink({ story }: { story: Story }) {
  return (
    <Link
      href={`/stories/${story.slug}`}
      className="block py-5 transition hover:bg-[#fafafa]"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#3f7f68]">
        {story.category || story.section}
      </p>

      <h3 className="mt-2 text-xl font-semibold leading-tight text-[#2f2f2f]">
        {story.title}
      </h3>

      <p className="mt-2 text-sm text-slate-500">{story.reading_time} min read</p>
    </Link>
  );
}

function SectionBlock({
  title,
  subtitle,
  stories,
  emptyMessage,
}: {
  title: string;
  subtitle: string;
  stories: Story[];
  emptyMessage: string;
}) {
  return (
    <section className="border-b border-[#dcdcdc] py-10">
      <SectionLabel>{subtitle}</SectionLabel>
      <h2 className="mt-2 text-3xl font-semibold text-[#2f2f2f]">{title}</h2>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {stories.length > 0 ? (
          stories.map((story) => <StoryCard key={story.id} story={story} />)
        ) : (
          <div className="border border-[#d8d8d8] bg-white p-5 text-sm text-slate-600">
            {emptyMessage}
          </div>
        )}
      </div>
    </section>
  );
}

export default async function HomePage() {
  const supabase = createSupabaseServerClient();

  const { data } = await supabase
    .from("stories")
    .select(
      "id, title, slug, excerpt, featured_image_url, section, category, published_at, reading_time"
    )
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(30);

  const stories: Story[] = data ?? [];

  const newsStories = stories.filter((s) => s.section === "news").slice(0, 3);

  const businessTechStories = stories
    .filter((s) => s.section === "business-tech")
    .slice(0, 3);

  const opinionStories = stories
    .filter((s) => s.section === "opinion")
    .slice(0, 3);

  const dataStatsStories = stories
    .filter((s) => s.section === "data-stats")
    .slice(0, 3);

  const statesTerritoriesStories = stories
    .filter((s) => s.section === "states-territories")
    .slice(0, 3);

  const publicationStories = stories
    .filter(
      (s) =>
        s.category?.toLowerCase().includes("publication") ||
        s.category?.toLowerCase().includes("report") ||
        s.category?.toLowerCase().includes("bulletin")
    )
    .slice(0, 3);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
      <section className="border-b border-[#dcdcdc] py-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div>
            <SectionLabel>Latest</SectionLabel>
            <h2 className="mt-2 text-3xl font-semibold text-[#2f2f2f]">
              Latest stories
            </h2>

            <div className="mt-6 divide-y divide-[#dcdcdc] border-y border-[#dcdcdc]">
              {stories.length > 0 ? (
                stories.slice(0, 4).map((story) => (
                  <CompactStoryLink key={story.id} story={story} />
                ))
              ) : (
                <div className="py-5 text-sm text-slate-600">
                  No published stories yet.
                </div>
              )}
            </div>
          </div>

          <div>
            <SectionLabel>Publications</SectionLabel>
            <h2 className="mt-2 text-3xl font-semibold text-[#2f2f2f]">
              Reports, bulletins, and reference pieces
            </h2>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {publicationStories.length > 0 ? (
                publicationStories.map((story) => (
                  <StoryCard key={story.id} story={story} />
                ))
              ) : (
                <div className="border border-[#d8d8d8] bg-white p-5 text-sm text-slate-600">
                  Publication-style stories will appear here once published.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <SectionBlock
        title="News"
        subtitle="Latest reporting"
        stories={newsStories}
        emptyMessage="News stories will appear here once published."
      />

      <SectionBlock
        title="Business & Tech"
        subtitle="Economy, business, and technology"
        stories={businessTechStories}
        emptyMessage="Business & Tech stories will appear here once published."
      />

      <SectionBlock
        title="Opinion"
        subtitle="Analysis and commentary"
        stories={opinionStories}
        emptyMessage="Opinion stories will appear here once published."
      />

      <SectionBlock
        title="Data & Stats"
        subtitle="Data, indicators, and evidence"
        stories={dataStatsStories}
        emptyMessage="Data & Stats stories will appear here once published."
      />

      <SectionBlock
        title="States & Territories"
        subtitle="Regional coverage and reference"
        stories={statesTerritoriesStories}
        emptyMessage="States & Territories stories will appear here once published."
      />
    </main>
  );
}