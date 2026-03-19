import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import DeleteStoryButton from "@/components/admin/DeleteStoryButton";

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
          className="bg-emerald-700 px-5 py-3 font-medium text-white"
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
                    {story.title}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-600">
                    {story.section}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-600">
                    {story.status}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-600">
                    {story.updated_at
                      ? new Date(story.updated_at).toLocaleString()
                      : story.created_at
                      ? new Date(story.created_at).toLocaleString()
                      : "-"}
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