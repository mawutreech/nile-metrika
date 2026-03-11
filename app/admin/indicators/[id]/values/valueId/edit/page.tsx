import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { requireRole } from "@/lib/auth";

async function updateIndicatorValue(
  indicatorId: string,
  valueId: string,
  formData: FormData
) {
  "use server";

  const { supabase, user } = await requireRole(["admin", "editor"]);

  const yearRaw = String(formData.get("year") || "").trim();
  const valueRaw = String(formData.get("value") || "").trim();
  const geographic_unit_id = String(formData.get("geographic_unit_id") || "").trim();
  const date = String(formData.get("date") || "").trim();

  if (!yearRaw || !valueRaw) {
    throw new Error("Year and value are required.");
  }

  const year = Number(yearRaw);
  const value = Number(valueRaw);

  if (Number.isNaN(year) || Number.isNaN(value)) {
    throw new Error("Year and value must be numeric.");
  }

  const { data, error } = await supabase
    .from("indicator_values")
    .update({
      year,
      value,
      geographic_unit_id: geographic_unit_id || null,
      date: date || null,
      updated_by: user.id,
    })
    .eq("id", valueId)
    .eq("indicator_id", indicatorId)
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Update failed. No value row was updated.");
  }

  redirect(`/admin/indicators/${indicatorId}/values?success=updated`);
}

export default async function EditIndicatorValuePage({
  params,
}: {
  params: Promise<{ id: string; valueId: string }>;
}) {
  const { id, valueId } = await params;

  const { supabase } = await requireRole(["admin", "editor"]);

  const [
    { data: indicator, error: indicatorError },
    { data: row, error: valueError },
    { data: geographies },
  ] = await Promise.all([
    supabase
      .from("indicators")
      .select("id, name, unit")
      .eq("id", id)
      .single(),
    supabase
      .from("indicator_values")
      .select("id, year, value, date, geographic_unit_id")
      .eq("id", valueId)
      .eq("indicator_id", id)
      .single(),
    supabase.from("geographic_units").select("id, name").order("name"),
  ]);

  if (indicatorError || !indicator || valueError || !row) {
    notFound();
  }

  const action = updateIndicatorValue.bind(null, id, valueId);

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-semibold text-slate-900">
        Edit indicator value
      </h1>
      <p className="mt-3 text-slate-600">
        Update a time-series observation for{" "}
        <span className="font-medium">{indicator.name}</span>.
      </p>

      <form
        action={action}
        className="mt-10 space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
      >
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-900">
            Year
          </label>
          <input
            name="year"
            type="number"
            defaultValue={row.year ?? ""}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-900">
            Value
          </label>
          <input
            name="value"
            type="number"
            step="any"
            defaultValue={row.value ?? ""}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-900">
            Date
          </label>
          <input
            name="date"
            type="date"
            defaultValue={row.date || ""}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-900">
            Geography
          </label>
          <select
            name="geographic_unit_id"
            defaultValue={row.geographic_unit_id || ""}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          >
            <option value="">Select geography</option>
            {geographies?.map((geo) => (
              <option key={geo.id} value={geo.id}>
                {geo.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-800"
          >
            Save changes
          </button>
          <Link
            href={`/admin/indicators/${id}/values`}
            className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
}