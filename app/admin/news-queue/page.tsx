import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

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

export default async function NewsQueuePage() {
  const supabase = createSupabaseServerClient();

  const { data: stories, error } = await supabase
    .from("stories")
    .select("id, title, slug, section, editor_status, source_name, source_url, ai_confidence, updated_at")
    .eq("ai_generated", true)
    .in("editor_status", ["editor_review", "approved"])
    .order("updated_at", { ascending: false });

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">AI News Queue</h1>
          <p className="mt-3 text-slate-600">
            Review AI-generated South Sudan news drafts before publishing.
          </p>
        </div>

        <Link
          href="/admin/stories"
          className="border border-slate-300 px-4 py-2 text-sm text-slate-700"
        >
          All stories
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto border border-slate-200 bg-white">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="border-b bg-slate-50 text-left">
              <th className="px-4 py-3 text-sm font-semibold text-slate-700">Title</th>
              <th className="px-4 py-3 text-sm font-semibold text-slate-700">Section</th>
              <th className="px-4 py-3 text-sm font-semibold text-slate-700">Status</th>
              <th className="px-4 py-3 text-sm font-semibold text-slate-700">Source</th>
              <th className="px-4 py-3 text-sm font-semibold text-slate-700">AI score</th>
              <th className="px-4 py-3 text-sm font-semibold text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {error ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-sm text-red-600">
                  {error.message}
                </td>
              </tr>
            ) : stories && stories.length > 0 ? (
              stories.map((story) => (
                <tr key={story.id} className="border-b last:border-b-0">
                  <td className="px-4 py-4 text-sm text-slate-800">
                    <div className="font-medium">{story.title}</div>
                    <div className="mt-1 text-xs text-slate-500">/stories/{story.slug}</div>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-600">{formatSection(story.section)}</td>
                  <td className="px-4 py-4 text-sm text-slate-600">{story.editor_status}</td>
                  <td className="px-4 py-4 text-sm text-slate-600">
                    {story.source_url ? (
                      <a href={story.source_url} target="_blank" rel="noreferrer" className="underline">
                        {story.source_name ?? "Source"}
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-600">
                    {story.ai_confidence != null ? Number(story.ai_confidence).toFixed(2) : "—"}
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <div className="flex flex-wrap gap-4">
                      <Link href={`/admin/stories/${story.id}`} className="text-emerald-700 hover:underline">
                        Review
                      </Link>
                      <Link href={`/stories/${story.slug}`} className="text-slate-700 hover:underline">
                        Preview
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-sm text-slate-600">
                  No AI-generated stories waiting for review.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}