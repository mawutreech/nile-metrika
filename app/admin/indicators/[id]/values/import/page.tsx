import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { requireRole } from "@/lib/auth";

function splitCsvLine(line: string) {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const next = line[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result.map((value) => value.replace(/^"|"$/g, "").trim());
}

function parseCsv(text: string) {
  const cleanedText = text.replace(/^\uFEFF/, "");

  const lines = cleanedText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length < 2) {
    throw new Error("CSV must include a header row and at least one data row.");
  }

  const headers = splitCsvLine(lines[0]).map((h) => h.trim().toLowerCase());

  return lines.slice(1).map((line, index) => {
    const values = splitCsvLine(line);
    const row: Record<string, string> = {};

    headers.forEach((header, i) => {
      row[header] = values[i] ?? "";
    });

    row._rowNumber = String(index + 2);
    return row;
  });
}

function pickFirst(row: Record<string, string>, keys: string[]) {
  for (const key of keys) {
    const value = row[key];
    if (typeof value === "string" && value.trim() !== "") {
      return value.trim();
    }
  }
  return "";
}

async function importIndicatorValues(indicatorId: string, formData: FormData) {
  "use server";

  const { supabase, user } = await requireRole(["admin", "editor"]);

  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    redirect(`/admin/indicators/${indicatorId}/values?error=import-failed`);
  }

  const text = await file.text();

  let parsedRows: Record<string, string>[] = [];

  try {
    parsedRows = parseCsv(text);
  } catch {
    redirect(`/admin/indicators/${indicatorId}/values?error=import-failed`);
  }

  const { data: geographies } = await supabase
    .from("geographic_units")
    .select("id, name");

  const geographyMap = new Map(
    (geographies || []).map((g) => [g.name.toLowerCase(), g.id])
  );

  try {
    const rowsToInsert = parsedRows.map((row) => {
      const yearRaw = pickFirst(row, ["year", "yr"]);
      const valueRaw = pickFirst(row, ["value", "val"]);
      const dateRaw = pickFirst(row, ["date"]);
      const geographyRaw = pickFirst(row, ["geography", "geographic_unit", "geo", "location"]);

      const year = Number(yearRaw);
      const value = Number(valueRaw);
      const geographyName = geographyRaw.toLowerCase();

      if (!yearRaw || !valueRaw || Number.isNaN(year) || Number.isNaN(value)) {
        throw new Error(`Invalid year/value in CSV row ${row._rowNumber}`);
      }

      const geographicUnitId = geographyName
        ? geographyMap.get(geographyName) || null
        : null;

      return {
        indicator_id: indicatorId,
        year,
        value,
        date: dateRaw || null,
        geographic_unit_id: geographicUnitId,
        created_by: user.id,
        updated_by: user.id,
      };
    });

    const { error } = await supabase.from("indicator_values").insert(rowsToInsert);

    if (error) {
      redirect(`/admin/indicators/${indicatorId}/values?error=import-failed`);
    }
  } catch {
    redirect(`/admin/indicators/${indicatorId}/values?error=import-failed`);
  }

  redirect(`/admin/indicators/${indicatorId}/values?success=imported`);
}

export default async function ImportIndicatorValuesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { supabase } = await requireRole(["admin", "editor"]);

  const { data: indicator, error } = await supabase
    .from("indicators")
    .select("id, name")
    .eq("id", id)
    .single();

  if (error || !indicator) {
    notFound();
  }

  const action = importIndicatorValues.bind(null, id);

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-semibold text-slate-900">
        Import indicator values
      </h1>
      <p className="mt-3 text-slate-600">
        Upload a CSV file to bulk import values for{" "}
        <span className="font-medium">{indicator.name}</span>.
      </p>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
        <p className="font-medium text-slate-900">Expected CSV columns</p>
        <p className="mt-2">
          Required: <code>year</code>, <code>value</code>
        </p>
        <p>
          Optional: <code>date</code>, <code>geography</code>
        </p>
        <p className="mt-2 text-slate-500">
          Accepted geography aliases: geography, geographic_unit, geo, location.
        </p>
        <p className="mt-1 text-slate-500">
          Accepted year/value aliases: year or yr, value or val.
        </p>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
        <p className="font-medium text-slate-900">Example CSV</p>
        <pre className="mt-2 overflow-x-auto text-xs text-slate-600">
{`year,value,date,geography
2020,12.4,2020-01-01,Juba
2021,13.1,2021-01-01,Juba
2022,14.0,2022-01-01,Wau`}
        </pre>
      </div>

      <form
        action={action}
        className="mt-8 space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
      >
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-900">
            CSV file
          </label>
          <input
            name="file"
            type="file"
            accept=".csv"
            required
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-800"
          >
            Import CSV
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