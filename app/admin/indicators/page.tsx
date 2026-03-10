import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

async function deleteIndicator(formData: FormData) {
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
    throw new Error("Indicator ID is required.");
  }

  const { error } = await supabase
    .from("indicators")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  redirect("/admin/indicators");
}

export default async function AdminIndicatorsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: indicators, error } = await supabase
    .from("indicators")
    .select(`
      id,
      code,
      name,
      slug,
      unit,
      frequency,
      description,
      theme:themes(name),
      source_agency:source_agencies(name)
    `)
    .order("name", { ascending: true });

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-semibold text-slate-900">
            Manage indicators
          </h1>
          <p className="mt-3 text-slate-600">
            Create and manage indicator metadata and definitions.
          </p>
        </div>

        <Link
          href="/admin/indicators/new"
          className="rounded-xl bg-emerald-700 px-4 py-3 text-sm font-medium text-white transition hover:bg-emerald-800"
        >
          New indicator
        </Link>
      </div>

      <div className="mt-10 rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Indicators</h2>
        </div>

        {error ? (
          <div className="px-6 py-6 text-sm text-rose-600">
            Failed to load indicators.
          </div>
        ) : indicators && indicators.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {indicators.map((indicator) => (
              <div
                key={indicator.id}
                className="flex flex-col gap-3 px-6 py-5 md:flex-row md:items-start md:justify-between"
              >
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {indicator.name}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {indicator.theme?.name || "Uncategorized"} •{" "}
                    {indicator.frequency || "Unknown frequency"} •{" "}
                    {indicator.unit || "No unit"}
                  </p>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                    {indicator.description || "No description available."}
                  </p>
                  <p className="mt-2 text-xs text-slate-400">
                    /indicators/{indicator.slug}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Code: {indicator.code || "N/A"} • Source:{" "}
                    {indicator.source_agency?.name || "Unknown"}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
  <Link
    href={`/indicators/${indicator.slug}`}
    className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
  >
    View
  </Link>
  <Link
    href={`/admin/indicators/${indicator.id}/values`}
    className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
  >
    Values
  </Link>
  <Link
    href={`/admin/indicators/${indicator.id}/edit`}
    className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
  >
    Edit
  </Link>

  <form action={deleteIndicator}>
    <input type="hidden" name="id" value={indicator.id} />
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
            No indicators yet.
          </div>
        )}
      </div>
    </main>
  );
}