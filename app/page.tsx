import Link from "next/link";
import type { Metadata } from "next";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Nile Metrica",
  description:
    "Follow South Sudan through news, analysis, opinion, publications, and structured reference content.",
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

function formatLabel(value: string | null) {
  if (!value) return "News";

  return value
    .replace(/-/g, " ")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#3f7f68]">
      {children}
    </p>
  );
}

function StoryCard({ story }: { story: Story }) {
  return (
    <article className="flex h-full flex-col bg-white">
      <Link
        href={`/stories/${story.slug}`}
        className="block overflow-hidden border border-[#d8d8d8]"
      >
        {story.featured_image_url ? (
          <img
            src={story.featured_image_url}
            alt={story.title}
            className="h-56 w-full object-cover transition duration-300 hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-56 w-full items-center justify-center bg-slate-100 text-sm text-slate-500">
            No image available
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col pt-4">
        <p className="inline-block w-fit bg-[#d9eef2] px-2 py-1 text-[11px] font-medium uppercase tracking-[0.12em] text-slate-700">
          {formatLabel(story.category || story.section)}
        </p>

        <h3 className="mt-4 text-[clamp(1.8rem,2.6vw,3rem)] font-semibold leading-[1.05] tracking-tight text-[#2f2f2f]">
          <Link href={`/stories/${story.slug}`} className="hover:underline">
            {story.title}
          </Link>
        </h3>

        {story.excerpt ? (
          <p className="mt-4 text-lg leading-8 text-[#555]">{story.excerpt}</p>
        ) : (
          <p className="mt-4 text-lg leading-8 text-[#555]">
            Read the full story for more details and context.
          </p>
        )}

        <div className="mt-5">
          <Link
            href={`/stories/${story.slug}`}
            className="text-sm font-medium text-slate-700 underline underline-offset-4 hover:text-black"
          >
            Read more
          </Link>
        </div>
      </div>
    </article>
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

      {stories.length > 0 ? (
        <div className="mt-8 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {stories.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      ) : (
        <div className="mt-6 border border-[#d8d8d8] bg-white p-5 text-sm text-slate-600">
          {emptyMessage}
        </div>
      )}
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

  const southSudanStories = stories
    .filter((story) => story.section === "south-sudan")
    .slice(0, 3);

  const businessStories = stories
    .filter((story) => story.section === "business")
    .slice(0, 3);

  const politicsStories = stories
    .filter((story) => story.section === "politics")
    .slice(0, 3);

  const opinionStories = stories
    .filter((story) => story.section === "opinion")
    .slice(0, 3);

  const cultureSportStories = stories
    .filter((story) => story.section === "culture-sport")
    .slice(0, 3);

  const publicationStories = stories
    .filter(
      (story) =>
        story.category?.toLowerCase().includes("publication") ||
        story.category?.toLowerCase().includes("report") ||
        story.category?.toLowerCase().includes("bulletin")
    )
    .slice(0, 3);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
      <SectionBlock
        title="Latest stories"
        subtitle="Latest"
        stories={stories.slice(0, 3)}
        emptyMessage="No published stories yet."
      />

      <SectionBlock
        title="Reports, bulletins, and reference pieces"
        subtitle="Publications"
        stories={publicationStories}
        emptyMessage="Publication-style stories will appear here once published."
      />

      <SectionBlock
        title="South Sudan"
        subtitle="National reference"
        stories={southSudanStories}
        emptyMessage="South Sudan stories will appear here once published."
      />

      <SectionBlock
        title="Business"
        subtitle="Economy, markets, and data"
        stories={businessStories}
        emptyMessage="Business stories will appear here once published."
      />

      <SectionBlock
        title="Politics"
        subtitle="Public affairs and power"
        stories={politicsStories}
        emptyMessage="Politics stories will appear here once published."
      />

      <SectionBlock
        title="Opinion"
        subtitle="Analysis and commentary"
        stories={opinionStories}
        emptyMessage="Opinion stories will appear here once published."
      />

      <SectionBlock
        title="Culture & Sport"
        subtitle="Heritage, arts, and games"
        stories={cultureSportStories}
        emptyMessage="Culture & Sport stories will appear here once published."
      />
    </main>
  );
}