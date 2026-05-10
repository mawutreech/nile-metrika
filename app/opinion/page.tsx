import Link from "next/link";
import Image from "next/image";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Story = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image_url: string | null;
  published_at: string | null;
  reading_time: number | null;
  section: string;
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

function formatDate(dateString: string | null) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
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

function OpinionCard({
  story,
  author,
}: {
  story: Story;
  author?: Author | null;
}) {
  const authorName = author?.display_name || author?.full_name || "Editor";
  const authorRole = author?.role || "Contributor at Nile Metrica";
  const authorAvatar = author?.avatar_url || null;

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
      ) : (
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
      )}

      <div className="p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#3f7f68]">
          {story.category?.trim() || "Opinion"}
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

export default async function OpinionPage() {
  const supabase = createSupabaseServerClient();

  const { data } = await supabase
    .from("stories")
    .select(`
      id,
      title,
      slug,
      excerpt,
      featured_image_url,
      published_at,
      reading_time,
      section,
      category,
      author_id
    `)
    .eq("status", "published")
    .eq("section", "opinion")
    .order("published_at", { ascending: false });

  const stories: Story[] = (data as Story[]) ?? [];

  const authorIds = Array.from(
    new Set(stories.map((s) => s.author_id).filter(Boolean) as string[])
  );

  const authorsById = await getAuthorsMap(authorIds);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
      {stories.length > 0 ? (
        <section className="py-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#3f7f68]">
            Analysis and commentary
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-[#2f2f2f]">
            Opinion
          </h1>

          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {stories.map((story) => (
              <OpinionCard
                key={story.id}
                story={story}
                author={story.author_id ? authorsById.get(story.author_id) ?? null : null}
              />
            ))}
          </div>
        </section>
      ) : (
        <section className="py-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#3f7f68]">
            Analysis and commentary
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-[#2f2f2f]">
            Opinion
          </h1>

          <div className="mt-8 border border-[#d8d8d8] bg-white p-5 text-sm text-slate-600">
            No opinion stories published yet.
          </div>
        </section>
      )}
    </main>
  );
}