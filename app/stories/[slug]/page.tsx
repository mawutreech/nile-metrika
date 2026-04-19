import Image from "next/image";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type Story = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body_html: string;
  featured_image_url: string | null;
  section: string;
  category: string | null;
  published_at: string | null;
  reading_time: number | null;
  author_id: string | null;
};

type Author = {
  id: string;
  full_name: string | null;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  role: string | null;
  email: string | null;
};

function formatDate(dateString: string | null) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
}

function sectionLabel(story: Story) {
  if (story.category?.trim()) return story.category.toUpperCase();
  return story.section.replace(/-/g, " ").toUpperCase();
}

export default async function StoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = createSupabaseServerClient();

  const { data: story, error } = await supabase
    .from("stories")
    .select(
      "id, title, slug, excerpt, body_html, featured_image_url, section, category, published_at, reading_time, author_id, status"
    )
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !story) {
    notFound();
  }

  let author: Author | null = null;

  if (story.author_id) {
    const { data: authorData } = await supabase
      .from("authors")
      .select("id, full_name, display_name, bio, avatar_url, role, email")
      .eq("id", story.author_id)
      .single();

    author = authorData;
  }

  const authorName =
    author?.display_name || author?.full_name || "Editor";

  const authorBio =
    author?.bio || `${author?.role || "Contributor"} at Nile Metrica`;

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <article>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#466]">
          {sectionLabel(story)}
        </p>

        <h1 className="mt-4 max-w-4xl text-5xl font-semibold leading-tight tracking-tight text-[#2f2f2f] sm:text-6xl">
          {story.title}
        </h1>

        <div className="mt-8 border border-[#e3e3e3] bg-[#fafafa] p-6">
          <div className="flex items-center gap-4">
            {author?.avatar_url ? (
              <img
                src={author.avatar_url}
                alt={authorName}
                className="h-20 w-20 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#dfe5ea] text-3xl font-semibold text-[#334]">
                {authorName.charAt(0).toUpperCase()}
              </div>
            )}

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#466]">
                Author
              </p>
              <h2 className="mt-1 text-3xl font-semibold text-[#2f2f2f]">
                {authorName}
              </h2>
              <p className="mt-2 text-base text-[#555]">{authorBio}</p>
            </div>
          </div>
        </div>

        {story.excerpt ? (
          <p className="mt-8 text-[1.15rem] leading-9 text-[#444]">{story.excerpt}</p>
        ) : null}

        <div className="mt-6 flex flex-wrap items-center gap-4 text-base text-slate-500">
          {story.published_at ? <span>{formatDate(story.published_at)}</span> : null}
          {story.reading_time ? <span>{story.reading_time} min read</span> : null}
        </div>

        {story.featured_image_url ? (
          <div className="relative mt-10 aspect-[16/9] w-full overflow-hidden bg-[#f3f3f3]">
            <Image
              src={story.featured_image_url}
              alt={story.title}
              fill
              className="object-cover"
              sizes="100vw"
              unoptimized
            />
          </div>
        ) : null}

        <div
          className="prose prose-lg mt-10 max-w-none prose-headings:text-[#2f2f2f] prose-p:leading-9"
          dangerouslySetInnerHTML={{ __html: story.body_html }}
        />
      </article>
    </main>
  );
}