import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Playfair_Display, Inter } from "next/font/google";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const headlineFont = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
});

const uiFont = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

type Story = {
  id: string;
  title: string;
  slug: string;
  published_at: string | null;
  reading_time: number | null;
  author_id: string | null;
  status: string | null;
  section: string | null;
};

type Author = {
  id: string;
  display_name: string | null;
  full_name: string | null;
  role: string | null;
  avatar_url: string | null;
};

function formatRelativeMeta(
  dateString: string | null,
  readingTime: number | null
) {
  const read = readingTime ? `${readingTime} min read` : "";

  if (!dateString) return read;

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  let label = "";

  if (diffHours < 24) {
    label = `${Math.max(1, diffHours)} hours ago`;
  } else {
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays === 1) {
      label = "Yesterday";
    } else {
      label = date.toLocaleDateString("en-AU", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }
  }

  return read ? `${label} · ${read}` : label;
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

function AuthorAvatar({
  authorName,
  authorAvatar,
  size = 44,
}: {
  authorName: string;
  authorAvatar: string | null;
  size?: number;
}) {
  if (authorAvatar) {
    return (
      <img
        src={authorAvatar}
        alt={authorName}
        className="rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className="flex items-center justify-center rounded-full bg-[#d9e0e8] font-semibold text-[#203040]"
      style={{ width: size, height: size, fontSize: Math.max(14, size * 0.34) }}
    >
      {authorName.charAt(0).toUpperCase()}
    </div>
  );
}

function OpinionCard({
  story,
  author,
  featured = false,
}: {
  story: Story;
  author?: Author | null;
  featured?: boolean;
}) {
  const authorName = author?.display_name || author?.full_name || "Editor";
  const meta = formatRelativeMeta(story.published_at, story.reading_time);

  return (
    <article
      className={`flex h-full flex-col justify-between border border-[#d8dce4] bg-[#eaf1f5] ${
        featured ? "min-h-[360px] p-8 md:p-10" : "min-h-[300px] p-6"
      }`}
    >
      <div>
        <p
          className={`${uiFont.className} inline-block bg-[#163a8a] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white`}
        >
          Opinion
        </p>

        <h2
          className={`${headlineFont.className} ${
            featured
              ? "mt-5 text-[2.6rem] leading-[0.95] tracking-[-0.02em] md:text-[3.1rem]"
              : "mt-4 text-[2rem] leading-[0.98] tracking-[-0.015em] md:text-[2.2rem]"
          } text-[#111]`}
        >
          <Link
            href={`/stories/${story.slug}`}
            className="no-underline hover:underline"
          >
            {story.title}
          </Link>
        </h2>
      </div>

      <div className={`${featured ? "mt-8" : "mt-6"} flex items-center gap-3`}>
        <AuthorAvatar
          authorName={authorName}
          authorAvatar={author?.avatar_url || null}
          size={featured ? 48 : 42}
        />

        <div className={uiFont.className}>
          <p className="text-[13px] font-bold uppercase tracking-[0.07em] text-[#1b1b1b]">
            By {authorName}
          </p>
          <p className="mt-1 text-xs text-[#5e6670]">{meta}</p>
        </div>
      </div>
    </article>
  );
}

function EmptyOpinionCard() {
  return (
    <div
      aria-hidden="true"
      className="min-h-[300px] border border-[#d8dce4] bg-white"
    />
  );
}

export default async function OpinionPage() {
  const supabase = createSupabaseServerClient();

  const { data } = await supabase
    .from("stories")
    .select(`
      id,
      title,
      slug,
      published_at,
      reading_time,
      author_id,
      status,
      section
    `)
    .eq("status", "published")
    .eq("section", "opinion")
    .order("published_at", { ascending: false })
    .limit(60);

  const stories: Story[] = (data as Story[]) ?? [];

  const authorIds = Array.from(
    new Set(stories.map((story) => story.author_id).filter(Boolean) as string[])
  );

  const authorsById = await getAuthorsMap(authorIds);

  const featuredStory = stories[0] ?? null;
  const remainingStories = stories.slice(1);

  const remainder = remainingStories.length % 3;
  const emptySlots =
    remainingStories.length > 0 && remainder !== 0 ? 3 - remainder : 0;

  return (
    <main className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
      <section className="py-4">
        {stories.length > 0 ? (
          <div className="space-y-1">
            {featuredStory ? (
              <OpinionCard
                story={featuredStory}
                featured
                author={
                  featuredStory.author_id
                    ? authorsById.get(featuredStory.author_id) ?? null
                    : null
                }
              />
            ) : null}

            {remainingStories.length > 0 ? (
              <div className="grid gap-1 md:grid-cols-2 xl:grid-cols-3">
                {remainingStories.map((story) => (
                  <OpinionCard
                    key={story.id}
                    story={story}
                    author={
                      story.author_id
                        ? authorsById.get(story.author_id) ?? null
                        : null
                    }
                  />
                ))}

                {Array.from({ length: emptySlots }).map((_, index) => (
                  <EmptyOpinionCard key={`empty-${index}`} />
                ))}
              </div>
            ) : null}
          </div>
        ) : (
          <div className="border border-[#d8dce4] bg-[#eaf1f5] p-6 text-sm text-slate-600">
            No opinion stories published yet.
          </div>
        )}
      </section>
    </main>
  );
}