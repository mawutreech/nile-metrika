import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";

async function createIndicatorValue(indicatorId: string, formData: FormData) {
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

  const { error } = await supabase.from("indicator_values").insert({
    indicator_id: indicatorId,
    geographic_unit_id: geographic_unit_id || null,
    year,
    value,
    date: date || null,
    created_by: user.id,
    updated_by: user.id,
  });

  if (error) {
    throw new Error(error.message);
  }

  redirect(`/admin/indicators/${indicatorId}/values?success=created`);
}

async function deleteIndicatorValue(formData: FormData) {
  "use server";

  const { supabase } = await requireRole(["admin"]);

  const id = String(formData.get("id") || "").trim();
  const indicatorId = String(formData.get("indicator_id") || "").trim();

  if (!id || !indicatorId) {
    throw new Error("Value ID and indicator ID are required.");
  }

  const { error } = await supabase
    .from("indicator_values")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  redirect(`/admin/indicators/${indicatorId}/values?success=deleted`);
}

function getSuccessMessage(success?: string) {
  switch (success) {
    case "created":
      return "Indicator value created successfully.";
    case "updated":
      return "Indicator value updated successfully.";
    case "deleted":
      return "Indicator value deleted successfully.";
    default:
      return null;
  }
}

export default async function IndicatorValuesPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ success?: string }>;
}) {
  const { id } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const successMessage = getSuccessMessage(resolvedSearchParams?.success);

  const { supabase } = await requireRole(["admin", "editor"]);

  const [
    { data: indicator, error: indicatorError },
    { data: values, error: valuesError },
    { data: geographies },
  ] = await Promise.all([
    supabase
      .from("indicators")
      .select("id, name, slug, unit, frequency")
      .eq("id", id)
      .single(),
    supabase
      .from("indicator_values")
      .select(`
        id,
        year,
        value,
        date,
        geographic_unit:geographic_units(name)
      `)
      .eq("indicator_id", id)
      .order("year", { ascending: false }),
    supabase.from("geographic_units").select("id, name").order("name"),
  ]);

  if (indicatorError || !indicator) {
    notFound();
  }

  const createAction = createIndicatorValue.bind(null, id);

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-4xl font-semibold text-slate-900">
            Indicator values
          </h1>
          <p className="mt-3 text-slate-600">
            Manage time-series values for{" "}
            <span className="font-medium">{indicator.name}</span>.
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {indicator.frequency || "Unknown frequency"} •{" "}
            {indicator.unit || "No unit"}
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href={`/admin/indicators/${id}/edit`}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Edit indicator
          </Link>
          <Link
            href="/admin/indicators"
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Back to indicators
          </Link>
        </div>
      </div>

      {successMessage ? (
        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {successMessage}
        </div>
      ) : null}

      <div className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Add value</h2>
          <p className="mt-2 text-sm text-slate-600">
            Insert a new observation for this indicator.
          </p>

          <form action={createAction} className="mt-6 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-900">
                Year
              </label>
              <input
                name="year"
                type="number"
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
                placeholder="2026"
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
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
                placeholder="15.2"
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
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-900">
                Geography
              </label>
              <select
                name="geographic_unit_id"
                defaultValue=""
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

            <button
              type="submit"
              className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-800"
            >
              Add value
            </button>
          </form>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Existing values
            </h2>
          </div>

          {valuesError ? (
            <div className="px-6 py-6 text-sm text-rose-600">
              Failed to load indicator values.
            </div>
          ) : values && values.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left font-medium text-slate-600">
                      Year
                    </th>
                    <th className="px-6 py-3 text-left font-medium text-slate-600">
                      Value
                    </th>
                    <th className="px-6 py-3 text-left font-medium text-slate-600">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left font-medium text-slate-600">
                      Geography
                    </th>
                    <th className="px-6 py-3 text-left font-medium text-slate-600">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {values.map((row) => {
                    const geographyName = Array.isArray(row.geographic_unit)
                      ? row.geographic_unit[0]?.name
                      : undefined;

                    return (
                      <tr key={row.id}>
                        <td className="px-6 py-4 text-slate-700">
                          {row.year ?? "N/A"}
                        </td>
                        <td className="px-6 py-4 text-slate-700">
                          {row.value} {indicator.unit || ""}
                        </td>
                        <td className="px-6 py-4 text-slate-700">
                          {row.date || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-slate-700">
                          {geographyName || "N/A"}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <Link
                              href={`/admin/indicators/${id}/values/${row.id}/edit`}
                              className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
                            >
                              Edit
                            </Link>

                            <form action={deleteIndicatorValue}>
                              <input type="hidden" name="id" value={row.id} />
                              <input
                                type="hidden"
                                name="indicator_id"
                                value={id}
                              />
                              <ConfirmDeleteButton message="Are you sure you want to delete this value?" />
                            </form>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-6 text-sm text-slate-600">
              No values yet for this indicator.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}