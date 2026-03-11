import { redirect } from "next/navigation";
import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { FlashBanner } from "@/components/admin/FlashBanner";
import { AdminSearchForm } from "@/components/admin/AdminSearchForm";
import { AdminPagination } from "@/components/admin/AdminPagination";

async function deleteIndicator(formData: FormData) {
  "use server";

  const { supabase } = await requireRole(["admin"]);

  const id = String(formData.get("id") || "").trim();

  if (!id) {
    redirect("/admin/indicators?error=missing-id");
  }

  const { error } = await supabase
    .from("indicators")
    .delete()
    .eq("id", id);

  if (error) {
    redirect("/admin/indicators?error=delete-failed");
  }

  redirect("/admin/indicators?success=deleted");
}

function getSuccessMessage(success?: string) {
  switch (success) {
    case "created":
      return "Indicator created successfully.";
    case "updated":
      return "Indicator updated successfully.";
    case "deleted":
      return "Indicator deleted successfully.";
    default:
      return null;
  }
}

function getErrorMessage(error?: string) {
  switch (error) {
    case "missing-id":
      return "Indicator ID was missing.";
    case "create-failed":
      return "Could not create the indicator.";
    case "update-failed":
      return "Could not update the indicator.";
    case "delete-failed":
      return "Could not delete the indicator.";
    default:
      return null;
  }
}

export default async function AdminIndicatorsPage({
  searchParams,
}: {
  searchParams?: Promise<{ success?: string; error?: string; q?: string; page?: string }>;
}) {
  const { profile, supabase } = await requireRole(["admin", "editor", "viewer"]);
  const resolvedSearchParams = searchParams ? await searchParams : {};

  const successMessage = getSuccessMessage(resolvedSearchParams?.success);
  const errorMessage = getErrorMessage(resolvedSearchParams?.error);
  const query = (resolvedSearchParams?.q || "").trim();
  const currentPage = Math.max(Number(resolvedSearchParams?.page || "1"), 1);
  const pageSize = 10;
  const from = (currentPage - 1) * pageSize;
  const to = from + pageSize - 1;

  let indicatorsQuery = supabase
    .from("indicators")
    .select(
      `
      id,
      code,
      name,
      slug,
      unit,
      frequency,
      description,
      created_by,
      updated_by,
      created_at,
      updated_at,
      theme:themes(name),
      source_agency:source_agencies(name)
    `,
      { count: "exact" }
    )
    .order("name", { ascending: true })
    .range(from, to);

  if (query) {
    indicatorsQuery = indicatorsQuery.or(
      `name.ilike.%${query}%,slug.ilike.%${query}%,description.ilike.%${query}%,code.ilike.%${query}%,unit.ilike.%${query}%,frequency.ilike.%${query}%`
    );
  }

  const { data: indicators, error, count } = await indicatorsQuery;
  const totalPages = Math.max(Math.ceil((count || 0) / pageSize), 1);

  let profileMap: Record<string, string> = {};

  if (indicators && indicators.length > 0) {
    const ids = Array.from(
      new Set(
        indicators.flatMap((i) => [i.created_by, i.updated_by]).filter(Boolean)
      )
    );

    if (ids.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, email")
        .in("id", ids);

      profileMap = Object.fromEntries(
        (profiles || []).map((p) => [p.id, p.email || p.id])
      );
    }
  }

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

        {profile.role !== "viewer" ? (
          <Link
            href="/admin/indicators/new"
            className="rounded-xl bg-emerald-700 px-4 py-3 text-sm font-medium text-white transition hover:bg-emerald-800"
          >
            New indicator
          </Link>
        ) : null}
      </div>

      <AdminSearchForm
        placeholder="Search indicators by name, code, slug, unit, frequency, or description"
        defaultValue={query}
      />

      {successMessage ? <FlashBanner kind="success" message={successMessage} /> : null}
      {errorMessage ? <FlashBanner kind="error" message={errorMessage} /> : null}

      <div className="mt-10 rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Indicators {query ? `(${count || 0} results)` : ""}
          </h2>
        </div>

        {error ? (
          <div className="px-6 py-6 text-sm text-rose-600">
            Failed to load indicators.
          </div>
        ) : indicators && indicators.length > 0 ? (
          <>
            <div className="divide-y divide-slate-100">
              {indicators.map((indicator) => {
                const themeName = Array.isArray(indicator.theme)
                  ? indicator.theme[0]?.name
                  : undefined;

                const sourceAgencyName = Array.isArray(indicator.source_agency)
                  ? indicator.source_agency[0]?.name
                  : undefined;

                return (
                  <div
                    key={indicator.id}
                    className="flex flex-col gap-4 px-6 py-5 md:flex-row md:items-start md:justify-between"
                  >
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold text-slate-900">
                        {indicator.name}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {themeName || "Uncategorized"} •{" "}
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
                        {sourceAgencyName || "Unknown"}
                      </p>

                      <div className="mt-3 grid gap-1 text-xs text-slate-400">
                        <p>Created at: {indicator.created_at || "N/A"}</p>
                        <p>Updated at: {indicator.updated_at || "N/A"}</p>
                        <p>
                          Created by:{" "}
                          {indicator.created_by
                            ? profileMap[indicator.created_by] || indicator.created_by
                            : "N/A"}
                        </p>
                        <p>
                          Updated by:{" "}
                          {indicator.updated_by
                            ? profileMap[indicator.updated_by] || indicator.updated_by
                            : "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/indicators/${indicator.slug}`}
                        className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
                      >
                        View
                      </Link>

                      {profile.role !== "viewer" ? (
                        <>
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
                        </>
                      ) : null}

                      {profile.role === "admin" ? (
                        <form action={deleteIndicator}>
                          <input type="hidden" name="id" value={indicator.id} />
                          <ConfirmDeleteButton message="Are you sure you want to delete this indicator?" />
                        </form>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="px-6 pb-6">
              <AdminPagination
                currentPage={currentPage}
                totalPages={totalPages}
                basePath="/admin/indicators"
                query={query}
              />
            </div>
          </>
        ) : (
          <div className="px-6 py-6 text-sm text-slate-600">
            {query ? "No matching indicators found." : "No indicators yet."}
          </div>
        )}
      </div>
    </main>
  );
}