import Image from "next/image";
import { notFound } from "next/navigation";
import { Playfair_Display } from "next/font/google";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
});

type StoryAuthor = {
  id: string;
  display_name: string | null;
  full_name: string | null;
  role: string | null;
  bio: string | null;
  avatar_url: string | null;
};

type StoryRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body_html: string;
  section: string;
  category: string | null;
  featured_image_url: string | null;
  published_at: string | null;
  reading_time: number | null;
  author_id: string | null;
  authors: StoryAuthor | StoryAuthor[] | null;
};

function formatDate(dateString: string | null) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
}

function labelForStory(story: Pick<StoryRow, "section" | "category">) {
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
    default:
      return "Story";
  }
}

function getAuthor(authors: StoryRow["authors"]): StoryAuthor | null {
  if (!authors) return null;
  if (Array.isArray(authors)) return authors[0] ?? null;
  return authors;
}

export default async function StoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("stories")
    .select(
      `
      id,
      title,
      slug,
      excerpt,
      body_html,
      section,
      category,
      featured_image_url,
      published_at,
      reading_time,
      author_id,
      authors (
        id,
        display_name,
        full_name,
        role,
        bio,
        avatar_url
      )
    `
    )
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !data) {
    notFound();
  }

  const story = data as StoryRow;
  const storyLabel = labelForStory(story);
  const author = getAuthor(story.authors);

  const authorName = author?.display_name || author?.full_name || "Editor";
  const authorRole = author?.role || "Contributor at Nile Metrica";
  const authorBio = author?.bio || "Contributor at Nile Metrica";
  const authorAvatar = author?.avatar_url || null;
  const publishedDate = formatDate(story.published_at);
  const readingTime = story.reading_time ?? 1;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <article className="mx-auto max-w-5xl">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#3f5a5a]">
          {storyLabel}
        </p>

        <h1
          className={`${playfair.className} mt-4 max-w-5xl text-4xl font-semibold leading-[1.05] tracking-tight text-[#111] sm:text-5xl lg:text-6xl`}
        >
          {story.title}
        </h1>

        <div className="mt-10 border border-[#e5e5e5] bg-white p-6">
          <div className="flex items-center gap-4">
            {authorAvatar ? (
              <img
                src={authorAvatar}
                alt={authorName}
                className="h-20 w-20 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#dfe5ea] text-3xl font-semibold text-[#223]">
                {authorName.charAt(0).toUpperCase()}
              </div>
            )}

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#3f5a5a]">
                Author
              </p>
              <h2 className="mt-1 text-2xl font-semibold text-[#1f1f1f]">
                {authorName}
              </h2>
              <p className="mt-1 text-base text-slate-600">{authorRole}</p>
              {authorBio ? (
                <p className="mt-2 text-sm text-slate-500">{authorBio}</p>
              ) : null}
            </div>
          </div>
        </div>

        {story.excerpt ? (
          <p
            className="mt-10 text-[1.22rem] leading-9 text-[#333]"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            {story.excerpt}
          </p>
        ) : null}

        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-slate-600">
          {publishedDate ? <span>{publishedDate}</span> : null}
          <span>{readingTime} min read</span>
        </div>

        {story.featured_image_url ? (
          <div className="mt-10 overflow-hidden border border-[#e5e5e5] bg-[#f8f8f8]">
            <div className="relative aspect-[16/9] w-full">
              <Image
                src={story.featured_image_url}
                alt={story.title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>
        ) : null}

        <div
          className="prose prose-lg mt-12 max-w-none text-[#222] prose-headings:text-[#111] prose-a:text-[#0f3f75]"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          dangerouslySetInnerHTML={{ __html: story.body_html }}
        />
      </article>
    </main>
  );
}