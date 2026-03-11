import { redirect, notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";

async function updateIndicator(id: string, formData: FormData) {
  "use server";

  const { supabase, user } = await requireRole(["admin", "editor"]);

  const code = String(formData.get("code") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const slug = String(formData.get("slug") || "").trim();
  const theme_id = String(formData.get("theme_id") || "").trim();
  const unit = String(formData.get("unit") || "").trim();
  const frequency = String(formData.get("frequency") || "").trim();
  const source_agency_id = String(formData.get("source_agency_id") || "").trim();
  const description = String(formData.get("description") || "").trim();

  if (!name || !slug) {
    throw new Error("Name and slug are required.");
  }

  const { data, error } = await supabase
    .from("indicators")
    .update({
      code: code || null,
      name,
      slug,
      theme_id: theme_id || null,
      unit: unit || null,
      frequency: frequency || null,
      source_agency_id: source_agency_id || null,
      description: description || null,
      updated_by: user.id,
    })
    .eq("id", id)
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Update failed. No indicator row was updated.");
  }

  redirect("/admin/indicators?success=updated");
}

export default async function EditIndicatorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { supabase } = await requireRole(["admin", "editor"]);

  const [
    { data: indicator, error },
    { data: themes },
    { data: agencies },
  ] = await Promise.all([
    supabase
      .from("indicators")
      .select(`
        id,
        code,
        name,
        slug,
        theme_id,
        unit,
        frequency,
        source_agency_id,
        description
      `)
      .eq("id", id)
      .single(),
    supabase.from("themes").select("id, name").order("name"),
    supabase.from("source_agencies").select("id, name").order("name"),
  ]);

  if (error || !indicator) {
    notFound();
  }

  const action = updateIndicator.bind(null, id);

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-semibold text-slate-900">
        Edit indicator
      </h1>
      <p className="mt-3 text-slate-600">
        Update an existing indicator and its metadata.
      </p>

      <form
        action={action}
        className="mt-10 space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-900">
              Code
            </label>
            <input
              name="code"
              type="text"
              defaultValue={indicator.code || ""}
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-900">
              Name
            </label>
            <input
              name="name"
              type="text"
              defaultValue={indicator.name}
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
              required
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-900">
            Slug
          </label>
          <input
            name="slug"
            type="text"
            defaultValue={indicator.slug}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
            required
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
              defaultValue={indicator.theme_id || ""}
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
              defaultValue={indicator.source_agency_id || ""}
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
              Unit
            </label>
            <input
              name="unit"
              type="text"
              defaultValue={indicator.unit || ""}
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-900">
              Frequency
            </label>
            <input
              name="frequency"
              type="text"
              defaultValue={indicator.frequency || ""}
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-900">
            Description
          </label>
          <textarea
            name="description"
            defaultValue={indicator.description || ""}
            className="min-h-32 w-full rounded-xl border border-slate-300 px-4 py-3"
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
            href="/admin/indicators"
            className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </a>
        </div>
      </form>
    </main>
  );
}