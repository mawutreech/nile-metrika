import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";

async function createDataset(formData: FormData) {
  "use server";

  const { supabase, user } = await requireRole(["admin", "editor"]);

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

  const { error } = await supabase.from("datasets").insert({
    title,
    slug,
    description: description || null,
    theme_id: theme_id || null,
    source_agency_id: source_agency_id || null,
    publication_date: publication_date || null,
    update_date: update_date || null,
    format: format || null,
    file_url: file_url || null,
    created_by: user.id,
    updated_by: user.id,
  });

  if (error) {
    throw new Error(error.message);
  }

  redirect("/admin/datasets?success=created");
}

export default async function NewDatasetPage() {
  const { supabase } = await requireRole(["admin", "editor"]);

  const [{ data: themes }, { data: agencies }] = await Promise.all([
    supabase.from("themes").select("id, name").order("name"),
    supabase.from("source_agencies").select("id, name").order("name"),
  ]);

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-semibold text-slate-900">
        New dataset
      </h1>
      <p className="mt-3 text-slate-600">
        Add a new dataset record and connect it to a theme and source agency.
      </p>

      <form
        action={createDataset}
        className="mt-10 space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
      >
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-900">
            Title
          </label>
          <input
            name="title"
            type="text"
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
            placeholder="Consumer Price Index Monthly Series"
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
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
            placeholder="consumer-price-index-monthly-series"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-900">
            Description
          </label>
          <textarea
            name="description"
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
              defaultValue=""
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
              defaultValue=""
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
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
              placeholder="CSV, XLSX"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-900">
              File URL
            </label>
            <input
              name="file_url"
              type="text"
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
              placeholder="https://..."
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-800"
          >
            Create dataset
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