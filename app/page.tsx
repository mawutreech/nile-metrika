import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Nile Metrica",
  description:
    "Follow South Sudan through news, analysis, opinion, publications, and structured reference.",
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

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="inline-block bg-[#d7ecec] px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#426060]">
      {children}
    </p>
  );
}

function formatSectionName(section: string, category: string | null) {
  if (category && category.trim().length > 0) {
    return category;
  }

  switch (section) {
    case "south-sudan":
      return "News";
    case "business":
      return "Business";
    case "politics":
      return "Politics";
    case "opinion":
      return "Opinion";
    case "culture-sport":
      return "Culture & Sport";
    default:
      return section.replace(/-/g, " ");
  }
}

function StoryCard({ story }: { story: Story }) {
  const label = formatSectionName(story.section, story.category);

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
            <div className="flex h-full w-full items-center justify-center text-sm text-slate-500">
              No image available
            </div>
          )}
        </div>
      </Link>

      <div className="p-5">
        <SectionLabel>{label}</SectionLabel>

        <h3 className="mt-4 text-[2.1rem] font-semibold leading-[1.02] tracking-[-0.02em] text-[#2f2f2f]">
          <Link href={`/stories/${story.slug}`} className="hover:underline">
            {story.title}
          </Link>
        </h3>

        {story.excerpt ? (
          <p className="mt-4 text-[1.05rem] leading-8 text-[#555]">{story.excerpt}</p>
        ) : null}

        <div className="mt-5 flex items-center gap-4 text-sm text-slate-500">
          <span>{story.reading_time} min read</span>
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

export default async function HomePage() {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("stories")
    .select(
      "id, title, slug, excerpt, featured_image_url, section, category, published_at, reading_time"
    )
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(30);

  if (error) {
    console.error("Homepage stories query failed:", error);
  }

  const stories: Story[] = data ?? [];

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
      {stories.length > 0 ? (
        <section className="py-4">
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {stories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        </section>
      ) : (
        <section className="py-10">
          <div className="border border-[#d8d8d8] bg-white p-6 text-sm text-slate-600">
            No published stories yet.
          </div>
        </section>
      )}
    </main>
  );
}