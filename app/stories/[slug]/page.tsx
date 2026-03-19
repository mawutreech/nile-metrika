import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function StoryPage({ params }: Props) {
  const { slug } = await params;
  const supabase = createSupabaseServerClient();

  const { data: story, error } = await supabase
    .from("stories")
    .select(
      "title, excerpt, body_html, featured_image_url, published_at, reading_time, section, category"
    )
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !story) {
    notFound();
  }

  const storyUrl = `https://nilemetrica.com/stories/${slug}`;

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
          {story.section}
        </p>

        <h1 className="mt-3 text-4xl font-semibold text-slate-900">
          {story.title}
        </h1>

        {story.excerpt ? (
          <p className="mt-4 text-lg leading-8 text-slate-600">
            {story.excerpt}
          </p>
        ) : null}

        <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
          {story.published_at ? (
            <span>{new Date(story.published_at).toLocaleDateString()}</span>
          ) : null}
          <span>{story.reading_time} min read</span>
          {story.category ? <span>{story.category}</span> : null}
        </div>
      </div>

      {story.featured_image_url ? (
        <img
          src={story.featured_image_url}
          alt={story.title}
          className="mb-8 w-full border object-cover"
        />
      ) : null}

      <div
        className="prose max-w-none prose-headings:text-slate-900 prose-p:text-slate-700"
        dangerouslySetInnerHTML={{ __html: story.body_html }}
      />

      <div className="mt-10 border-t pt-6">
        <p className="mb-3 font-medium text-slate-900">Share this story</p>
        <div className="flex flex-wrap gap-3">
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
              storyUrl
            )}&text=${encodeURIComponent(story.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="border px-4 py-2 text-sm"
          >
            X
          </a>

          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              storyUrl
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="border px-4 py-2 text-sm"
          >
            Facebook
          </a>

          <a
            href={`https://wa.me/?text=${encodeURIComponent(
              `${story.title} ${storyUrl}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="border px-4 py-2 text-sm"
          >
            WhatsApp
          </a>

          <Link href="/" className="border px-4 py-2 text-sm">
            Back home
          </Link>
        </div>
      </div>
    </main>
  );
}