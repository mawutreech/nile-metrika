import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  approveStory,
  moveToEditorReview,
  publishStory,
  rejectStory,
} from "./actions";

type Story = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  body_html: string | null;
  section: string | null;
  category: string | null;
  status: string | null;
  editor_status: string | null;
  source_name: string | null;
  source_url: string | null;
  source_published_at: string | null;
  ai_generated: boolean | null;
  ai_confidence: number | null;
  why_it_matters: string | null;
  review_notes: string | null;
  reading_time: number | null;
  published_at: string | null;
  updated_at: string | null;
  created_at: string | null;
};

type SocialPost = {
  id: string;
  platform: "x" | "facebook";
  body: string;
  status: string;
};

function formatSection(section: string | null) {
  switch (section) {
    case "news":
      return "News";
    case "business-tech":
      return "Business & Tech";
    case "opinion":
      return "Opinion";
    case "data-stats":
      return "Data & Stats";
    case "states-territories":
      return "States & Territories";
    default:
      return section ?? "—";
  }
}

function formatDate(value: string | null) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function StatusBadge({
  label,
  tone,
}: {
  label: string;
  tone: "slate" | "amber" | "emerald" | "blue" | "red";
}) {
  const toneClass =
    tone === "amber"
      ? "bg-amber-50 text-amber-800 border-amber-200"
      : tone === "emerald"
      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
      : tone === "blue"
      ? "bg-blue-50 text-blue-800 border-blue-200"
      : tone === "red"
      ? "bg-red-50 text-red-800 border-red-200"
      : "bg-slate-50 text-slate-700 border-slate-200";

  return (
    <span className={`inline-flex border px-2.5 py-1 text-xs font-medium ${toneClass}`}>
      {label}
    </span>
  );
}

function getEditorTone(status: string | null) {
  switch (status) {
    case "approved":
      return "emerald";
    case "published":
      return "blue";
    case "editor_review":
      return "amber";
    case "rejected":
      return "red";
    default:
      return "slate";
  }
}

function getPublishTone(status: string | null) {
  switch (status) {
    case "published":
      return "blue";
    case "draft":
      return "slate";
    default:
      return "slate";
  }
}

export default async function AdminStoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createSupabaseServerClient();

  const { data: story, error } = await supabase
    .from("stories")
    .select(
      `
        id,
        title,
        slug,
        excerpt,
        content,
        body_html,
        section,
        category,
        status,
        editor_status,
        source_name,
        source_url,
        source_published_at,
        ai_generated,
        ai_confidence,
        why_it_matters,
        review_notes,
        reading_time,
        published_at,
        updated_at,
        created_at
      `
    )
    .eq("id", id)
    .single<Story>();

  if (error || !story) {
    notFound();
  }

  const { data: socialPosts } = await supabase
    .from("social_posts")
    .select("id, platform, body, status")
    .eq("story_id", story.id)
    .order("platform")
    .returns<SocialPost[]>();

  const xPost = socialPosts?.find((item) => item.platform === "x") ?? null;
  const facebookPost =
    socialPosts?.find((item) => item.platform === "facebook") ?? null;

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge
              label={story.editor_status ?? "draft"}
              tone={getEditorTone(story.editor_status)}
            />
            <StatusBadge
              label={story.status ?? "draft"}
              tone={getPublishTone(story.status)}
            />
            {story.ai_generated ? (
              <StatusBadge label="AI generated" tone="amber" />
            ) : null}
          </div>

          <h1 className="mt-4 text-3xl font-semibold text-slate-900">
            {story.title}
          </h1>

          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
            <p>
              <span className="font-medium">Section:</span>{" "}
              {formatSection(story.section)}
            </p>
            <p>
              <span className="font-medium">Category:</span>{" "}
              {story.category ?? "—"}
            </p>
            <p>
              <span className="font-medium">Reading time:</span>{" "}
              {story.reading_time ?? "—"} min
            </p>
          </div>

          <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
            <p>
              <span className="font-medium">Updated:</span>{" "}
              {formatDate(story.updated_at ?? story.created_at)}
            </p>
            <p>
              <span className="font-medium">Published:</span>{" "}
              {formatDate(story.published_at)}
            </p>
            <p>
              <span className="font-medium">Slug:</span> /stories/{story.slug}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href={`/admin/stories/${story.id}/edit`}
            className="bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800"
          >
            Edit
          </Link>

          <Link
            href={`/admin/stories/${story.id}`}
            className="border border-slate-300 px-4 py-2 text-sm text-slate-700"
          >
            Refresh
          </Link>

          <Link
            href={`/stories/${story.slug}`}
            className="border border-slate-300 px-4 py-2 text-sm text-slate-700"
          >
            Preview
          </Link>

          <Link
            href="/admin/stories"
            className="border border-slate-300 px-4 py-2 text-sm text-slate-700"
          >
            Back to stories
          </Link>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <form action={moveToEditorReview}>
          <input type="hidden" name="storyId" value={story.id} />
          <button
            type="submit"
            className="border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-800 hover:bg-amber-100"
          >
            Move to editor review
          </button>
        </form>

        <form action={approveStory}>
          <input type="hidden" name="storyId" value={story.id} />
          <button
            type="submit"
            className="bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800"
          >
            Approve
          </button>
        </form>

        <form action={rejectStory}>
          <input type="hidden" name="storyId" value={story.id} />
          <button
            type="submit"
            className="bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800"
          >
            Reject
          </button>
        </form>

        <form action={publishStory}>
          <input type="hidden" name="storyId" value={story.id} />
          <button
            type="submit"
            className="bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
          >
            Publish
          </button>
        </form>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
        <section className="space-y-8">
          <div className="border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900">Excerpt</h2>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-700">
              {story.excerpt || "—"}
            </p>
          </div>

          <div className="border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900">Main story</h2>

            {story.body_html ? (
              <div
                className="prose prose-slate mt-4 max-w-none"
                dangerouslySetInnerHTML={{ __html: story.body_html }}
              />
            ) : (
              <div className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                {story.content || "No story body yet."}
              </div>
            )}
          </div>

          <div className="border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Why it matters
            </h2>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-700">
              {story.why_it_matters || "—"}
            </p>
          </div>

          <div className="border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Review notes
            </h2>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-700">
              {story.review_notes || "—"}
            </p>
          </div>
        </section>

        <aside className="space-y-8">
          <div className="border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Source details
            </h2>

            <dl className="mt-4 space-y-4 text-sm">
              <div>
                <dt className="font-medium text-slate-700">Source</dt>
                <dd className="mt-1 text-slate-600">
                  {story.source_name || "—"}
                </dd>
              </div>

              <div>
                <dt className="font-medium text-slate-700">Published at</dt>
                <dd className="mt-1 text-slate-600">
                  {formatDate(story.source_published_at)}
                </dd>
              </div>

              <div>
                <dt className="font-medium text-slate-700">Source link</dt>
                <dd className="mt-1 break-all text-slate-600">
                  {story.source_url ? (
                    <a
                      href={story.source_url}
                      target="_blank"
                      rel="noreferrer"
                      className="underline"
                    >
                      {story.source_url}
                    </a>
                  ) : (
                    "—"
                  )}
                </dd>
              </div>

              <div>
                <dt className="font-medium text-slate-700">AI confidence</dt>
                <dd className="mt-1 text-slate-600">
                  {story.ai_confidence != null
                    ? Number(story.ai_confidence).toFixed(2)
                    : "—"}
                </dd>
              </div>
            </dl>
          </div>

          <div className="border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Social drafts
            </h2>

            <div className="mt-5 space-y-5">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-medium text-slate-800">X</h3>
                  <span className="text-xs text-slate-500">
                    {xPost?.status ?? "draft"}
                  </span>
                </div>
                <div className="min-h-[120px] border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-700">
                  {xPost?.body || "No X draft yet."}
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-medium text-slate-800">
                    Facebook
                  </h3>
                  <span className="text-xs text-slate-500">
                    {facebookPost?.status ?? "draft"}
                  </span>
                </div>
                <div className="min-h-[140px] border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-700">
                  {facebookPost?.body || "No Facebook draft yet."}
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}