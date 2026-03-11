import { notFound, redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";

async function uploadPublicationFile(id: string, formData: FormData) {
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
    .from("publications")
    .upload(filePath, file, {
      upsert: true,
      contentType: file.type || "application/pdf",
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data: publicUrlData } = supabase.storage
    .from("publications")
    .getPublicUrl(filePath);

  const publicUrl = publicUrlData.publicUrl;

  const { error: updateError } = await supabase
    .from("publications")
    .update({
      file_url: publicUrl,
    })
    .eq("id", id);

  if (updateError) {
    throw new Error(updateError.message);
  }

  redirect("/admin/publications?success=uploaded");
}

export default async function UploadPublicationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { supabase } = await requireRole(["admin", "editor"]);

  const { data: publication, error } = await supabase
    .from("publications")
    .select("id, title, file_url")
    .eq("id", id)
    .single();

  if (error || !publication) {
    notFound();
  }

  const action = uploadPublicationFile.bind(null, id);

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-semibold text-slate-900">
        Upload publication file
      </h1>
      <p className="mt-3 text-slate-600">
        Upload a PDF or related file for{" "}
        <span className="font-medium">{publication.title}</span>.
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
            accept=".pdf,.doc,.docx"
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
            required
          />
        </div>

        {publication.file_url ? (
          <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
            Current file:{" "}
            <a
              href={publication.file_url}
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