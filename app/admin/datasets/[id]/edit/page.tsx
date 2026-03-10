import { redirect, notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

async function updateDataset(id: string, formData: FormData) {
  "use server";

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const title = String(formData.get("title") || "").trim();
  const slug = String(formData.get("slug") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const theme_id = String(formData.get("theme_id") || "").trim();
  const source_agency_id = String(formData.get("source_agency_id") || "").trim();
  const publication_date = String(formData.get("publication_date") || "").trim();
  const update_date = String(formData.get("update_date") || "").trim();
  const format = String(formData.get("format") || "").trim();
  const file_url = String(formData.get("file_url") || "").trim();

  if (!title || !slug) {
    throw new Error("Title and slug are required.");
  }

  const { data, error } = await supabase
    .from("datasets")
    .update({
      title,
      slug,
      description: description || null,
      theme_id: theme_id || null,
      source_agency_id: source_agency_id || null,
      publication_date: publication_date || null,
      update_date: update_date || null,
      format: format || null,
      file_url: file_url || null,
    })
    .eq("id", id)
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Update failed. No dataset row was updated.");
  }

  redirect("/admin/datasets");
}

export default async function EditDatasetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [
    { data: dataset, error },
    { data: themes },
    { data: agencies },
  ] = await Promise.all([
    supabase
      .from("datasets")
      .select(`
        id,
        title,
        slug,
        description,
        theme_id,
        source_agency_id,
        publication_date,
        update_date,
        format,
        file_url
      `)
      .eq("id", id)
      .single(),
    supabase.from("themes").select("id, name").order("name"),
    supabase.from("source_agencies").select("id, name").order("name"),
  ]);

  if (error || !dataset) {
    notFound();
  }

  const action = updateDataset.bind(null, id);

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-semibold text-slate-900">
        Edit dataset
      </h1>
      <p className="mt-3 text-slate-600">
        Update an existing dataset record.
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
            defaultValue={dataset.title}
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
            defaultValue={dataset.slug}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-900">
            Description
          </label>
          <textarea
            name="description"
            defaultValue={dataset.description || ""}
            className="min-h-32 w-full rounded-xl border border-slate-300 px-4 py-3"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-900">
              Theme
            </label>
            <select
              name="theme_id"
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
              defaultValue={dataset.theme_id || ""}
            >
              <option value="">Select a theme</option>
              {themes?.map((theme) => (
                <option key={theme.id} value={theme.id}>
                  {theme.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-900">
              Source agency
            </label>
            <select
              name="source_agency_id"
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
              defaultValue={dataset.source_agency_id || ""}
            >
              <option value="">Select a source agency</option>
              {agencies?.map((agency) => (
                <option key={agency.id} value={agency.id}>
                  {agency.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-900">
              Publication date
            </label>
            <input
              name="publication_date"
              type="date"
              defaultValue={dataset.publication_date || ""}
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-900">
              Update date
            </label>
            <input
              name="update_date"
              type="date"
              defaultValue={dataset.update_date || ""}
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-900">
              Format
            </label>
            <input
              name="format"
              type="text"
              defaultValue={dataset.format || ""}
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-900">
              File URL
            </label>
            <input
              name="file_url"
              type="text"
              defaultValue={dataset.file_url || ""}
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-800"
          >
            Save changes
          </button>
          <a
            href="/admin/datasets"
            className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </a>
        </div>
      </form>
    </main>
  );
}