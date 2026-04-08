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
  published_at: string | null;
  reading_time: number | null;
  section: string;
  category: string | null;
};

function formatDate(dateString: string | null) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function labelForStory(story: Story) {
  if (story.category?.trim()) return story.category;

  switch (story.section) {
    case "south-sudan":
      return "News";
    case "politics":
      return "Politics";
    case "business":
      return "Business";
    case "opinion":
      return "Opinion";
    case "culture-sport":
      return "Culture & Sport";
    default:
      return story.section.replace(/-/g, " ");
  }
}

function NewsCard({ story }: { story: Story }) {
  return (
    <article className="border border-[#d8d8d8] bg-white">
      <Link href={`/stories/${story.slug}`} className="block">
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#f3f3f3]">
          {story.featured_image_url ? (
            <Image
              src={story.featured_image_url}
              alt={story.title}
              fill
              className="object-cover transition duration-300 hover:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              unoptimized
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-500">
              No image available
            </div>
          )}
        </div>
      </Link>

      <div className="p-5">
        <p className="inline-block bg-[#d7ecec] px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#426060]">
          {labelForStory(story)}
        </p>

        <h2 className="mt-4 text-[2rem] font-semibold leading-tight tracking-[-0.02em] text-[#2f2f2f]">
          <Link href={`/stories/${story.slug}`} className="hover:underline">
            {story.title}
          </Link>
        </h2>

        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-slate-500">
          {story.published_at ? <span>{formatDate(story.published_at)}</span> : null}
          {story.reading_time ? <span>{story.reading_time} min read</span> : null}
        </div>

        {story.excerpt ? (
          <p className="mt-4 text-[1.02rem] leading-8 text-[#555]">{story.excerpt}</p>
        ) : null}

        <div className="mt-5">
          <Link
            href={`/stories/${story.slug}`}
            className="font-semibold uppercase tracking-[0.14em] text-[#2f6e57] hover:underline"
          >
            Read more
          </Link>
        </div>
      </div>
    </article>
  );
}

export default async function NewsPage() {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("stories")
    .select(
      "id, title, slug, excerpt, featured_image_url, published_at, reading_time, section, category"
    )
    .eq("status", "published")
    .in("section", ["south-sudan", "politics"])
    .order("published_at", { ascending: false });

  if (error) {
    console.error("News page query failed:", error);
  }

  const stories: Story[] = data ?? [];

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
      {stories.length > 0 ? (
        <section>
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {stories.map((story) => (
              <NewsCard key={story.id} story={story} />
            ))}
          </div>
        </section>
      ) : (
        <section className="py-10">
          <div className="border border-[#d8d8d8] bg-white p-6 text-sm text-slate-600">
            No news stories published yet.
          </div>
        </section>
      )}
    </main>
  );
}