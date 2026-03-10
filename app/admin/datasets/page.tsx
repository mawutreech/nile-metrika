import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

async function deleteDataset(formData: FormData) {
  "use server";

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const id = String(formData.get("id") || "").trim();

  if (!id) {
    throw new Error("Dataset ID is required.");
  }

  const { error } = await supabase
    .from("datasets")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  redirect("/admin/datasets");
}

export default async function AdminDatasetsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: datasets, error } = await supabase
    .from("datasets")
    .select(`
      id,
      title,
      slug,
      description,
      publication_date,
      update_date,
      format,
      file_url,
      theme:themes(name),
      source_agency:source_agencies(name)
    `)
    .order("update_date", { ascending: false });

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-semibold text-slate-900">
            Manage datasets
          </h1>
          <p className="mt-3 text-slate-600">
            Create and manage downloadable dataset records.
          </p>
        </div>

        <Link
          href="/admin/datasets/new"
          className="rounded-xl bg-emerald-700 px-4 py-3 text-sm font-medium text-white transition hover:bg-emerald-800"
        >
          New dataset
        </Link>
      </div>

      <div className="mt-10 rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Datasets</h2>
        </div>

        {error ? (
          <div className="px-6 py-6 text-sm text-rose-600">
            Failed to load datasets.
          </div>
        ) : datasets && datasets.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {datasets.map((dataset) => (
              <div
                key={dataset.id}
                className="flex flex-col gap-3 px-6 py-5 md:flex-row md:items-start md:justify-between"
              >
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {dataset.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {dataset.theme?.name || "Uncategorized"} •{" "}
                    {dataset.format || "Unknown"} • Updated{" "}
                    {dataset.update_date || "N/A"}
                  </p>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                    {dataset.description || "No description available."}
                  </p>
                  <p className="mt-2 text-xs text-slate-400">
                    /datasets/{dataset.slug}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Source: {dataset.source_agency?.name || "Unknown"}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/datasets/${dataset.slug}`}
                    className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
                  >
                    View
                  </Link>
                  <Link
                    href={`/admin/datasets/${dataset.id}/edit`}
                    className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
                  >
                    Edit
                  </Link>

                  <form action={deleteDataset}>
                    <input type="hidden" name="id" value={dataset.id} />
                    <button
                      type="submit"
                      className="rounded-xl border border-rose-200 px-3 py-2 text-sm text-rose-700 transition hover:bg-rose-50"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-6 text-sm text-slate-600">
            No datasets yet.
          </div>
        )}
      </div>
    </main>
  );
}