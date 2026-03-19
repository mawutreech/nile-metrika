import Link from "next/link";
import type { Metadata } from "next";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "South Sudan Knowledge Portal",
  description:
    "Follow South Sudan through news, analysis, opinion, publications, and structured public information in one place.",
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

function StoryCard({
  story,
}: {
  story: Story;
}) {
  return (
    <Link
      href={`/stories/${story.slug}`}
      className="block border border-[#d8d8d8] bg-white p-5 transition hover:bg-[#f8fbf9]"
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
      <p className="mt-3 text-sm text-slate-500">
        {story.reading_time} min read
      </p>
    </Link>
  );
}

function CompactStoryLink({
  story,
}: {
  story: Story;
}) {
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

export default async function HomePage() {
  const supabase = createSupabaseServerClient();

  const { data } = await supabase
    .from("stories")
    .select(
      "id, title, slug, excerpt, featured_image_url, section, category, published_at, reading_time"
    )
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(12);

  const stories: Story[] = data ?? [];

  const leadStory = stories[0] ?? null;
  const latestStories = stories.slice(1, 5);
  const opinionStories = stories.filter((s) => s.section === "opinion").slice(0, 2);
  const analysisStories = stories
    .filter((s) => s.category?.toLowerCase() === "analysis")
    .slice(0, 2);
  const publicationStories = stories
    .filter(
      (s) =>
        s.category?.toLowerCase().includes("publication") ||
        s.category?.toLowerCase().includes("report") ||
        s.category?.toLowerCase().includes("bulletin")
    )
    .slice(0, 3);

  const fallbackLinks = [
    { title: "South Sudan", href: "/country" },
    { title: "Business", href: "/economy" },
    { title: "Politics", href: "/politics" },
    { title: "Opinion", href: "/opinion" },
    { title: "Culture & Sport", href: "/culture-sport" },
    { title: "Publications", href: "/publications" },
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
      <section className="border-b border-[#dcdcdc] pb-10">
        {leadStory ? (
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="border border-[#d8d8d8] bg-white">
              {leadStory.featured_image_url ? (
                <div className="overflow-hidden border-b border-[#d8d8d8]">
                  <img
                    src={leadStory.featured_image_url}
                    alt={leadStory.title}
                    className="h-[260px] w-full object-cover sm:h-[340px]"
                  />
                </div>
              ) : null}

              <div className="p-6 sm:p-8">
                <SectionLabel>{leadStory.category || leadStory.section}</SectionLabel>
                <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#2f2f2f] sm:text-5xl">
                  {leadStory.title}
                </h1>
                {leadStory.excerpt ? (
                  <p className="mt-4 max-w-3xl text-base leading-8 text-[#555]">
                    {leadStory.excerpt}
                  </p>
                ) : null}
                <div className="mt-6 flex items-center gap-4 text-sm text-slate-500">
                  <span>{leadStory.reading_time} min read</span>
                  {leadStory.published_at ? (
                    <span>{new Date(leadStory.published_at).toLocaleDateString()}</span>
                  ) : null}
                </div>
                <div className="mt-6">
                  <Link
                    href={`/stories/${leadStory.slug}`}
                    className="inline-flex bg-[#2f6e57] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#285f4b]"
                  >
                    Read story
                  </Link>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {latestStories.length > 0 ? (
                latestStories.map((story) => (
                  <StoryCard key={story.id} story={story} />
                ))
              ) : (
                <div className="border border-[#d8d8d8] bg-[#f7f4ee] p-5">
                  <SectionLabel>Getting started</SectionLabel>
                  <h2 className="mt-3 text-2xl font-semibold text-[#2f2f2f]">
                    Publish your first stories
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-[#555]">
                    Logged-in editors can create stories and publish them to the front page.
                  </p>
                  <Link
                    href="/admin/stories/new"
                    className="mt-4 inline-flex text-sm font-medium text-[#2f6e57]"
                  >
                    Open editor →
                  </Link>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="border border-[#d8d8d8] bg-white p-8">
            <SectionLabel>Nile Metrica</SectionLabel>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#2f2f2f] sm:text-5xl">
              South Sudan in one portal
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-[#555]">
              Publish stories, analysis, opinion, and public reference content from one place.
            </p>
            <Link
              href="/admin/stories/new"
              className="mt-6 inline-flex bg-[#2f6e57] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#285f4b]"
            >
              Create first story
            </Link>
          </div>
        )}
      </section>

      <section className="border-b border-[#dcdcdc] py-10">
        <div className="flex flex-wrap gap-3">
          {fallbackLinks.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className="border border-[#d2d2d2] bg-white px-4 py-2 text-sm font-medium text-[#444] transition hover:bg-[#f2f8f5] hover:text-[#2f6e57]"
            >
              {link.title}
            </Link>
          ))}
        </div>
      </section>

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
            <SectionLabel>Editorial</SectionLabel>
            <h2 className="mt-2 text-3xl font-semibold text-[#2f2f2f]">
              Opinion and analysis
            </h2>

            <div className="mt-6 space-y-4">
              {[...opinionStories, ...analysisStories].length > 0 ? (
                [...opinionStories, ...analysisStories]
                  .slice(0, 4)
                  .map((story) => <StoryCard key={story.id} story={story} />)
              ) : (
                <div className="border border-[#d8d8d8] bg-white p-5 text-sm text-slate-600">
                  Opinion and analysis stories will appear here once published.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-10">
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
      </section>
    </main>
  );
}