import Link from "next/link";
import Image from "next/image";
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
  featured_image_url: string | null;
  published_at: string | null;
  reading_time: number | null;
  category: string | null;
  author_id: string | null;
};

type Author = {
  id: string;
  display_name: string | null;
  full_name: string | null;
  role: string | null;
  avatar_url: string | null;
};

function formatRelativeMeta(dateString: string | null, readingTime: number | null) {
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
  size = 56,
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
      style={{ width: size, height: size, fontSize: Math.max(16, size * 0.34) }}
    >
      {authorName.charAt(0).toUpperCase()}
    </div>
  );
}

function LeadOpinionCard({
  story,
  author,
}: {
  story: Story;
  author?: Author | null;
}) {
  const authorName = author?.display_name || author?.full_name || "Editor";
  const meta = formatRelativeMeta(story.published_at, story.reading_time);

  return (
    <article className="grid overflow-hidden border border-[#d8dce4] bg-[#eaf1f5] lg:grid-cols-[1.05fr_1.15fr]">
      <div className="flex flex-col justify-between p-8 md:p-10">
        <div>
          <p
            className={`${uiFont.className} inline-block bg-[#163a8a] px-2 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white`}
          >
            Opinion
          </p>

          <h2
            className={`${headlineFont.className} mt-4 text-4xl leading-[0.96] text-[#111] md:text-5xl`}
          >
            <Link href={`/stories/${story.slug}`} className="hover:underline">
              {story.title}
            </Link>
          </h2>
        </div>

        <div className="mt-8 flex items-center gap-4">
          <AuthorAvatar
            authorName={authorName}
            authorAvatar={author?.avatar_url || null}
            size={58}
          />

          <div className={uiFont.className}>
            <p className="text-sm font-bold uppercase tracking-[0.08em] text-[#1b1b1b]">
              By {authorName}
            </p>
            <p className="mt-1 text-xs text-[#5e6670]">{meta}</p>
          </div>
        </div>
      </div>

      <Link
        href={`/stories/${story.slug}`}
        className="relative block min-h-[320px] bg-[#dfe7ee]"
      >
        {story.featured_image_url ? (
          <Image
            src={story.featured_image_url}
            alt={story.title}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-[#6a7480]">
            Opinion
          </div>
        )}
      </Link>
    </article>
  );
}

function SecondaryOpinionCard({
  story,
  author,
}: {
  story: Story;
  author?: Author | null;
}) {
  const authorName = author?.display_name || author?.full_name || "Editor";
  const meta = formatRelativeMeta(story.published_at, story.reading_time);

  return (
    <article className="border border-[#d8dce4] bg-[#eaf1f5] p-6">
      <p
        className={`${uiFont.className} inline-block bg-[#163a8a] px-2 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white`}
      >
        Opinion
      </p>

      <h3
        className={`${headlineFont.className} mt-4 text-[2rem] leading-[1] text-[#111]`}
      >
        <Link href={`/stories/${story.slug}`} className="hover:underline">
          {story.title}
        </Link>
      </h3>

      <div className="mt-6 flex items-center gap-3">
        <AuthorAvatar
          authorName={authorName}
          authorAvatar={author?.avatar_url || null}
          size={44}
        />

        <div className={uiFont.className}>
          <p className="text-sm font-bold uppercase tracking-[0.06em] text-[#1b1b1b]">
            By {authorName}
          </p>
          <p className="mt-1 text-xs text-[#5e6670]">{meta}</p>
        </div>
      </div>
    </article>
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
      featured_image_url,
      published_at,
      reading_time,
      category,
      author_id
    `)
    .eq("status", "published")
    .eq("section", "opinion")
    .order("published_at", { ascending: false })
    .limit(12);

  const stories: Story[] = (data as Story[]) ?? [];

  const authorIds = Array.from(
    new Set(stories.map((story) => story.author_id).filter(Boolean) as string[])
  );

  const authorsById = await getAuthorsMap(authorIds);

  const leadStory = stories[0] ?? null;
  const supportingStories = stories.slice(1, 5);
  const remainingStories = stories.slice(5);

  return (
    <main className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
      {stories.length > 0 ? (
        <section className="py-4">
          <div className="space-y-1">
            <p
              className={`${uiFont.className} text-xs font-semibold uppercase tracking-[0.22em] text-[#3f5a5a]`}
            >
              Analysis and commentary
            </p>
            <h1 className={`${uiFont.className} text-4xl font-semibold text-[#202020]`}>
              Opinion
            </h1>
          </div>

          <div className="mt-8">
            {leadStory ? (
              <LeadOpinionCard
                story={leadStory}
                author={
                  leadStory.author_id
                    ? authorsById.get(leadStory.author_id) ?? null
                    : null
                }
              />
            ) : null}
          </div>

          {supportingStories.length > 0 ? (
            <div className="mt-1 grid gap-1 md:grid-cols-2 xl:grid-cols-4">
              {supportingStories.map((story) => (
                <SecondaryOpinionCard
                  key={story.id}
                  story={story}
                  author={
                    story.author_id ? authorsById.get(story.author_id) ?? null : null
                  }
                />
              ))}
            </div>
          ) : null}

          {remainingStories.length > 0 ? (
            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {remainingStories.map((story) => (
                <SecondaryOpinionCard
                  key={story.id}
                  story={story}
                  author={
                    story.author_id ? authorsById.get(story.author_id) ?? null : null
                  }
                />
              ))}
            </div>
          ) : null}
        </section>
      ) : (
        <section className="py-10">
          <p
            className={`${uiFont.className} text-xs font-semibold uppercase tracking-[0.22em] text-[#3f5a5a]`}
          >
            Analysis and commentary
          </p>
          <h1 className={`${uiFont.className} mt-2 text-4xl font-semibold text-[#202020]`}>
            Opinion
          </h1>

          <div className="mt-8 border border-[#d8dce4] bg-[#eaf1f5] p-6 text-sm text-slate-600">
            No opinion stories published yet.
          </div>
        </section>
      )}
    </main>
  );
}