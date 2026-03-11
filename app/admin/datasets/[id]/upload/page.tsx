import { notFound, redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";

async function uploadDatasetFile(id: string, formData: FormData) {
  "use server";

  const { supabase } = await requireRole(["admin", "editor"]);

  const file = formData.get("file");

  if (!(file instanceof File)) {
    throw new Error("No file uploaded.");
  }

  if (file.size === 0) {
    throw new Error("Uploaded file is empty.");
  }

  const safeName = file.name.replace(/\s+/g, "-").toLowerCase();
  const filePath = `${id}/${Date.now()}-${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from("datasets")
    .upload(filePath, file, {
      upsert: true,
      contentType: file.type || "application/octet-stream",
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data: publicUrlData } = supabase.storage
    .from("datasets")
    .getPublicUrl(filePath);

  const publicUrl = publicUrlData.publicUrl;

  const { error: updateError } = await supabase
    .from("datasets")
    .update({
      file_url: publicUrl,
    })
    .eq("id", id);

  if (updateError) {
    throw new Error(updateError.message);
  }

  redirect("/admin/datasets?success=uploaded");
}

export default async function UploadDatasetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { supabase } = await requireRole(["admin", "editor"]);

  const { data: dataset, error } = await supabase
    .from("datasets")
    .select("id, title, file_url")
    .eq("id", id)
    .single();

  if (error || !dataset) {
    notFound();
  }

  const action = uploadDatasetFile.bind(null, id);

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-semibold text-slate-900">
        Upload dataset file
      </h1>
      <p className="mt-3 text-slate-600">
        Upload a file for <span className="font-medium">{dataset.title}</span>.
      </p>

      <form
        action={action}
        className="mt-10 space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
      >
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-900">
            Choose file
          </label>
          <input
            name="file"
            type="file"
            accept=".csv,.xlsx,.xls,.pdf,.zip"
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
            required
          />
        </div>

        {dataset.file_url ? (
          <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
            Current file:{" "}
            <a
              href={dataset.file_url}
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              Open current file
            </a>
          </div>
        ) : null}

        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-800"
          >
            Upload file
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