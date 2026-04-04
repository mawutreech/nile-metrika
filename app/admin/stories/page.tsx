import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import DeleteStoryButton from "@/components/admin/DeleteStoryButton";

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

function formatStatus(status: string | null) {
  if (!status) return "—";
  return status.charAt(0).toUpperCase() + status.slice(1);
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

export default async function AdminStoriesPage() {
  const supabase = createSupabaseServerClient();

  const { data: stories, error } = await supabase
    .from("stories")
    .select("id, title, slug, section, status, updated_at, created_at")
    .order("updated_at", { ascending: false });

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Stories</h1>
          <p className="mt-3 text-slate-600">
            Manage drafts, reviews, and published stories.
          </p>
        </div>

        <Link
          href="/admin/stories/new"
          className="bg-emerald-700 px-5 py-3 font-medium text-white transition hover:bg-emerald-800"
        >
          New story
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto border border-slate-200 bg-white">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="border-b bg-slate-50 text-left">
              <th className="px-4 py-3 text-sm font-semibold text-slate-700">
                Title
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-slate-700">
                Section
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-slate-700">
                Status
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-slate-700">
                Updated
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-slate-700">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {error ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-sm text-red-600">
                  {error.message}
                </td>
              </tr>
            ) : stories && stories.length > 0 ? (
              stories.map((story) => (
                <tr key={story.id} className="border-b last:border-b-0">
                  <td className="px-4 py-4 text-sm text-slate-800">
                    <div className="font-medium">{story.title}</div>
                    <div className="mt-1 text-xs text-slate-500">
                      /stories/{story.slug}
                    </div>
                  </td>

                  <td className="px-4 py-4 text-sm text-slate-600">
                    {formatSection(story.section)}
                  </td>

                  <td className="px-4 py-4 text-sm text-slate-600">
                    {formatStatus(story.status)}
                  </td>

                  <td className="px-4 py-4 text-sm text-slate-600">
                    {story.updated_at
                      ? formatDate(story.updated_at)
                      : formatDate(story.created_at)}
                  </td>

                  <td className="px-4 py-4 text-sm">
                    <div className="flex flex-wrap gap-4">
                      <Link
                        href={`/admin/stories/${story.id}`}
                        className="text-emerald-700 hover:underline"
                      >
                        Edit
                      </Link>

                      <Link
                        href={`/stories/${story.slug}`}
                        className="text-slate-700 hover:underline"
                      >
                        View
                      </Link>

                      <DeleteStoryButton
                        storyId={story.id}
                        storyTitle={story.title}
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-sm text-slate-600">
                  No stories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}