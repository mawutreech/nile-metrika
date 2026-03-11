import { redirect, notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";

async function updatePublication(id: string, formData: FormData) {
  "use server";

  const { supabase, user } = await requireRole(["admin", "editor"]);

  const title = String(formData.get("title") || "").trim();
  const slug = String(formData.get("slug") || "").trim();
  const summary = String(formData.get("summary") || "").trim();
  const publication_date = String(formData.get("publication_date") || "").trim();
  const type = String(formData.get("type") || "").trim();
  const file_url = String(formData.get("file_url") || "").trim();

  if (!title || !slug) {
    throw new Error("Title and slug are required.");
  }

  const { data, error } = await supabase
    .from("publications")
    .update({
      title,
      slug,
      summary: summary || null,
      publication_date: publication_date || null,
      type: type || null,
      file_url: file_url || null,
      updated_by: user.id,
    })
    .eq("id", id)
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Update failed. No publication row was updated.");
  }

  redirect("/admin/publications?success=updated");
}

export default async function EditPublicationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { supabase } = await requireRole(["admin", "editor"]);

  const { data: publication, error } = await supabase
    .from("publications")
    .select("id, title, slug, summary, publication_date, type, file_url")
    .eq("id", id)
    .single();

  if (error || !publication) {
    notFound();
  }

  const action = updatePublication.bind(null, id);

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-semibold text-slate-900">
        Edit publication
      </h1>
      <p className="mt-3 text-slate-600">
        Update an existing report, bulletin, factsheet, or publication.
      </p>

      <form
        action={action}
        className="mt-10 space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
      >
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-900">
            Title
          </label>
          <input
            name="title"
            type="text"
            defaultValue={publication.title}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-900">
            Slug
          </label>
          <input
            name="slug"
            type="text"
            defaultValue={publication.slug}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-900">
            Summary
          </label>
          <textarea
            name="summary"
            defaultValue={publication.summary || ""}
            className="min-h-32 w-full rounded-xl border border-slate-300 px-4 py-3"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-900">
              Publication date
            </label>
            <input
              name="publication_date"
              type="date"
              defaultValue={publication.publication_date || ""}
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-900">
              Type
            </label>
            <input
              name="type"
              type="text"
              defaultValue={publication.type || ""}
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-900">
            File URL
          </label>
          <input
            name="file_url"
            type="text"
            defaultValue={publication.file_url || ""}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-800"
          >
            Save changes
          </button>
          <a
            href="/admin/publications"
            className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </a>
        </div>
      </form>
    </main>
  );
}