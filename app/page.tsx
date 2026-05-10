import Image from "next/image";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Story = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image_url: string | null;
  section: string;
  category: string | null;
  published_at: string | null;
  reading_time: number | null;
  author_id: string | null;
};

type Author = {
  id: string;
  display_name: string | null;
  full_name: string | null;
  role: string | null;
  avatar_url: string | null;
};

function formatDate(dateString: string | null) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function labelForStory(story: Pick<Story, "section" | "category">) {
  if (story.category?.trim()) return story.category;

  switch (story.section) {
    case "south-sudan":
      return "News";
    case "politics":
      return "Politics";
    case "business":
      return "Business & Tech";
    case "opinion":
      return "Opinion";
    case "health":
      return "Health";
    case "education":
      return "Education";
    case "environment":
      return "Environment";
    case "states-territories":
      return "States & Territories";
    case "data-statistics":
      return "Data & Statistics";
    case "culture-sport":
      return "Culture & Sport";
    default:
      return "Story";
  }
}

async function getAuthorsMap(authorIds: string[]) {
  if (!authorIds.length) return new Map<string, Author>();

  const supabase = createSupabaseServerClient();

  const { data } = await supabase
    .from("authors")
    .select("id, display_name, full_name, role, avatar_url")
    .in("id", authorIds);

  const map = new Map<string, Author>();

  for (const row of (data ?? []) as Author[]) {
    map.set(row.id, row);
  }

  return map;
}

function StoryCard({
  story,
  author,
}: {
  story: Story;
  author?: Author | null;
}) {
  const authorName = author?.display_name || author?.full_name || "Editor";
  const authorRole = author?.role || "Contributor at Nile Metrica";
  const authorAvatar = author?.avatar_url || null;

  const showAuthorFallback =
    story.section === "opinion" && !story.featured_image_url;

  return (
    <article className="overflow-hidden border border-[#d8d8d8] bg-white">
      {story.featured_image_url ? (
        <Link href={`/stories/${story.slug}`} className="block">
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#f2f2f2]">
            <Image
              src={story.featured_image_url}
              alt={story.title}
              fill
              className="object-cover transition duration-300 hover:scale-[1.02]"
              unoptimized
            />
          </div>
        </Link>
      ) : showAuthorFallback ? (
        <div className="flex min-h-[148px] items-center bg-[#eef3f6] px-5 py-4">
          <div className="flex items-center gap-3">
            {authorAvatar ? (
              <img
                src={authorAvatar}
                alt={authorName}
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#d7dfe5] text-lg font-semibold text-[#223]">
                {authorName.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#3f5a5a]">
                By {authorName}
              </p>
              <p className="mt-1 text-sm text-slate-600">{authorRole}</p>
              {(story.published_at || story.reading_time) && (
                <p className="mt-1 text-xs text-slate-500">
                  {story.published_at ? formatDate(story.published_at) : ""}
                  {story.published_at && story.reading_time ? " · " : ""}
                  {story.reading_time ? `${story.reading_time} min read` : ""}
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex min-h-[180px] items-center justify-center bg-[#f3f3f3] text-sm text-slate-500">
          No image available
        </div>
      )}

      <div className="p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#3f7f68]">
          {labelForStory(story)}
        </p>

        <h2 className="mt-3 text-[2rem] font-semibold leading-[1.08] tracking-tight text-[#2f2f2f]">
          <Link href={`/stories/${story.slug}`} className="hover:underline">
            {story.title}
          </Link>
        </h2>

        {story.excerpt ? (
          <p className="mt-3 line-clamp-5 text-sm leading-7 text-[#555]">
            {story.excerpt}
          </p>
        ) : null}

        <Link
          href={`/stories/${story.slug}`}
          className="mt-4 inline-block text-sm font-medium text-[#0f3f75] hover:underline"
        >
          Read more
        </Link>
      </div>
    </article>
  );
}

function CompactStoryLink({ story }: { story: Story }) {
  return (
    <Link
      href={`/stories/${story.slug}`}
      className="block border-b border-[#dcdcdc] py-5 last:border-b-0 hover:bg-[#fafafa]"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#3f7f68]">
        {labelForStory(story)}
      </p>

      <h3 className="mt-2 text-xl font-semibold leading-tight text-[#2f2f2f]">
        {story.title}
      </h3>

      <p className="mt-2 text-sm text-slate-500">
        {story.published_at ? formatDate(story.published_at) : ""}
        {story.published_at && story.reading_time ? " · " : ""}
        {story.reading_time ? `${story.reading_time} min read` : ""}
      </p>
    </Link>
  );
}

function SectionBlock({
  title,
  subtitle,
  stories,
  authorsById,
}: {
  title: string;
  subtitle: string;
  stories: Story[];
  authorsById: Map<string, Author>;
}) {
  if (!stories.length) return null;

  return (
    <section className="border-b border-[#dcdcdc] py-10">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#3f7f68]">
        {subtitle}
      </p>
      <h2 className="mt-2 text-3xl font-semibold text-[#2f2f2f]">{title}</h2>

      <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {stories.map((story) => (
          <StoryCard
            key={story.id}
            story={story}
            author={story.author_id ? authorsById.get(story.author_id) ?? null : null}
          />
        ))}
      </div>
    </section>
  );
}

export default async function HomePage() {
  const supabase = createSupabaseServerClient();

  const { data } = await supabase
    .from("stories")
    .select(`
      id,
      title,
      slug,
      excerpt,
      featured_image_url,
      section,
      category,
      published_at,
      reading_time,
      author_id
    `)
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(30);

  const stories: Story[] = (data as Story[]) ?? [];

  const authorIds = Array.from(
    new Set(stories.map((s) => s.author_id).filter(Boolean) as string[])
  );

  const authorsById = await getAuthorsMap(authorIds);

  const latestStories = stories.slice(0, 4);
  const latestIds = new Set(latestStories.map((s) => s.id));

  const remainingStories = stories.filter((s) => !latestIds.has(s.id));

  const publicationStories = remainingStories
    .filter(
      (s) =>
        s.category?.toLowerCase().includes("publication") ||
        s.category?.toLowerCase().includes("report") ||
        s.category?.toLowerCase().includes("bulletin")
    )
    .slice(0, 3);

  const southSudanStories = remainingStories
    .filter((s) => s.section === "south-sudan")
    .slice(0, 3);

  const businessStories = remainingStories
    .filter((s) => s.section === "business")
    .slice(0, 3);

  const politicsStories = remainingStories
    .filter((s) => s.section === "politics")
    .slice(0, 3);

  const opinionStories = remainingStories
    .filter((s) => s.section === "opinion")
    .slice(0, 3);

  const cultureSportStories = remainingStories
    .filter((s) => s.section === "culture-sport")
    .slice(0, 3);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
      {latestStories.length > 0 ? (
        <section className="border-b border-[#dcdcdc] py-10">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <StoryCard
                story={latestStories[0]}
                author={
                  latestStories[0].author_id
                    ? authorsById.get(latestStories[0].author_id) ?? null
                    : null
                }
              />
            </div>

            <div>
              {latestStories.slice(1).map((story) => (
                <CompactStoryLink key={story.id} story={story} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <SectionBlock
        title="Reports, bulletins, and reference pieces"
        subtitle="Publications"
        stories={publicationStories}
        authorsById={authorsById}
      />

      <SectionBlock
        title="South Sudan"
        subtitle="National reference"
        stories={southSudanStories}
        authorsById={authorsById}
      />

      <SectionBlock
        title="Business"
        subtitle="Economy, markets, and data"
        stories={businessStories}
        authorsById={authorsById}
      />

      <SectionBlock
        title="Politics"
        subtitle="Public affairs and power"
        stories={politicsStories}
        authorsById={authorsById}
      />

      <SectionBlock
        title="Opinion"
        subtitle="Analysis and commentary"
        stories={opinionStories}
        authorsById={authorsById}
      />

      <SectionBlock
        title="Culture & Sport"
        subtitle="Heritage, arts, and games"
        stories={cultureSportStories}
        authorsById={authorsById}
      />
    </main>
  );
}