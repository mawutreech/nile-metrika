import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

async function createPublication(formData: FormData) {
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
  const summary = String(formData.get("summary") || "").trim();
  const publication_date = String(formData.get("publication_date") || "").trim();
  const type = String(formData.get("type") || "").trim();
  const file_url = String(formData.get("file_url") || "").trim();

  if (!title || !slug) {
    throw new Error("Title and slug are required.");
  }

  const { error } = await supabase.from("publications").insert({
    title,
    slug,
    summary: summary || null,
    publication_date: publication_date || null,
    type: type || null,
    file_url: file_url || null,
  });

  if (error) {
    throw new Error(error.message);
  }

  redirect("/admin/publications");
}

export default async function NewPublicationPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-semibold text-slate-900">
        New publication
      </h1>
      <p className="mt-3 text-slate-600">
        Add a new report, bulletin, factsheet, or publication.
      </p>

      <form action={createPublication} className="mt-10 space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-900">
            Title
          </label>
          <input
            name="title"
            type="text"
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
            placeholder="Statistical Abstract 2026"
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
            placeholder="statistical-abstract-2026"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-900">
            Summary
          </label>
          <textarea
            name="summary"
            className="min-h-32 w-full rounded-xl border border-slate-300 px-4 py-3"
            placeholder="A consolidated annual overview of key statistics..."
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
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
              placeholder="Annual Report"
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
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
            placeholder="https://..."
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-800"
          >
            Create publication
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