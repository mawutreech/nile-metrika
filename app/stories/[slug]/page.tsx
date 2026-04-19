import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
});

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
  seo_title: string | null;
  seo_description: string | null;
};

type AuthorRow = {
  id: string;
  display_name: string | null;
  full_name: string | null;
  role: string | null;
  bio: string | null;
  avatar_url: string | null;
};

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || "https://nilemetrica.com";
}

function formatDate(dateString: string | null) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function labelForStory(story: { section: string; category: string | null }) {
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

async function getPublishedStoryBySlug(slug: string) {
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
      seo_title,
      seo_description
    `
    )
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !data) return null;
  return data as StoryRow;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const story = await getPublishedStoryBySlug(slug);

  if (!story) {
    return {
      title: "Story not found | Nile Metrica",
      description: "The requested story could not be found.",
      alternates: {
        canonical: `${getBaseUrl()}/stories/${slug}`,
      },
    };
  }

  const canonicalUrl = `${getBaseUrl()}/stories/${story.slug}`;
  const title = story.seo_title?.trim() || story.title;
  const description =
    story.seo_description?.trim() ||
    story.excerpt?.trim() ||
    "Read analysis, commentary, and reporting from Nile Metrica.";

  const imageUrl =
    story.section === "opinion" ? undefined : story.featured_image_url || undefined;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Nile Metrica",
      type: "article",
      publishedTime: story.published_at || undefined,
      images: imageUrl ? [{ url: imageUrl, alt: title }] : undefined,
    },
    twitter: {
      card: imageUrl ? "summary_large_image" : "summary",
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export default async function StoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = createSupabaseServerClient();

  const story = await getPublishedStoryBySlug(slug);

  if (!story) {
    notFound();
  }

  let author: AuthorRow | null = null;

  if (story.author_id) {
    const { data: authorData } = await supabase
      .from("authors")
      .select("id, display_name, full_name, role, bio, avatar_url")
      .eq("id", story.author_id)
      .single();

    author = (authorData as AuthorRow | null) ?? null;
  }

  const storyLabel = labelForStory(story);
  const authorName = author?.display_name || author?.full_name || "Editor";
  const authorRole = author?.role || "Contributor at Nile Metrica";
  const authorBio = author?.bio || "";
  const authorAvatar = author?.avatar_url || null;
  const publishedDate = formatDate(story.published_at);
  const readingTime = story.reading_time ?? 1;
  const isOpinion = story.section === "opinion";

  const storyUrl = `${getBaseUrl()}/stories/${story.slug}`;
  const shareText = `${story.title} — Nile Metrica`;

  const xShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    shareText
  )}&url=${encodeURIComponent(storyUrl)}`;

  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    storyUrl
  )}`;

  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    storyUrl
  )}`;

  const mailShareUrl = `mailto:?subject=${encodeURIComponent(
    story.title
  )}&body=${encodeURIComponent(`${shareText}\n\n${storyUrl}`)}`;

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

        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-slate-600">
          {publishedDate ? <span>{publishedDate}</span> : null}
          <span>{readingTime} min read</span>
        </div>

        <div className="mt-8 border border-[#e5e5e5] bg-white p-6">
          <div className="flex items-start gap-4">
            {authorAvatar ? (
              <Image
                src={authorAvatar}
                alt={authorName}
                width={80}
                height={80}
                className="h-20 w-20 rounded-full object-cover"
                unoptimized
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#dfe5ea] text-3xl font-semibold text-[#223]">
                {authorName.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#3f5a5a]">
                Author
              </p>
              <h2 className="mt-1 text-2xl font-semibold text-[#1f1f1f]">
                {authorName}
              </h2>
              <p className="mt-1 text-base text-slate-600">{authorRole}</p>
              {authorBio ? (
                <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500">
                  {authorBio}
                </p>
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

        {!isOpinion && story.featured_image_url ? (
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

        <div className="mt-14 border-t border-[#e5e5e5] pt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#3f5a5a]">
            Share this article
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href={xShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center border border-[#d8d8d8] px-4 py-2 text-sm font-medium text-[#1f1f1f] transition hover:bg-[#f7f7f7]"
            >
              Share on X
            </Link>

            <Link
              href={facebookShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center border border-[#d8d8d8] px-4 py-2 text-sm font-medium text-[#1f1f1f] transition hover:bg-[#f7f7f7]"
            >
              Share on Facebook
            </Link>

            <Link
              href={linkedinShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center border border-[#d8d8d8] px-4 py-2 text-sm font-medium text-[#1f1f1f] transition hover:bg-[#f7f7f7]"
            >
              Share on LinkedIn
            </Link>

            <Link
              href={mailShareUrl}
              className="inline-flex items-center border border-[#d8d8d8] px-4 py-2 text-sm font-medium text-[#1f1f1f] transition hover:bg-[#f7f7f7]"
            >
              Share by Email
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}