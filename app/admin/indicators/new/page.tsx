import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

async function createIndicator(formData: FormData) {
  "use server";

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

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

  const { error } = await supabase.from("indicators").insert({
    code: code || null,
    name,
    slug,
    theme_id: theme_id || null,
    unit: unit || null,
    frequency: frequency || null,
    source_agency_id: source_agency_id || null,
    description: description || null,
  });

  if (error) {
    throw new Error(error.message);
  }

  redirect("/admin/indicators");
}

export default async function NewIndicatorPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [{ data: themes }, { data: agencies }] = await Promise.all([
    supabase.from("themes").select("id, name").order("name"),
    supabase.from("source_agencies").select("id, name").order("name"),
  ]);

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-semibold text-slate-900">
        New indicator
      </h1>
      <p className="mt-3 text-slate-600">
        Add a new indicator and connect it to a theme and source agency.
      </p>

      <form
        action={createIndicator}
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
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
              placeholder="INF_YOY"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-900">
              Name
            </label>
            <input
              name="name"
              type="text"
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
              placeholder="Inflation Rate"
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
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
            placeholder="inflation-rate"
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
              Unit
            </label>
            <input
              name="unit"
              type="text"
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
              placeholder="%"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-900">
              Frequency
            </label>
            <input
              name="frequency"
              type="text"
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
              placeholder="Monthly"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-900">
            Description
          </label>
          <textarea
            name="description"
            className="min-h-32 w-full rounded-xl border border-slate-300 px-4 py-3"
            placeholder="Annual percentage change in consumer prices."
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-800"
          >
            Create indicator
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