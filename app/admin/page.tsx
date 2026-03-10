import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-4xl font-semibold text-slate-900">Admin dashboard</h1>
      <p className="mt-4 text-slate-600">
        Signed in as {user.email}
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
  <a href="/admin/publications" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
    <h2 className="text-xl font-semibold text-slate-900">Publications</h2>
    <p className="mt-2 text-sm text-slate-600">Create and edit publications.</p>
  </a>
  <a href="/admin/datasets" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
    <h2 className="text-xl font-semibold text-slate-900">Datasets</h2>
    <p className="mt-2 text-sm text-slate-600">Manage datasets and downloads.</p>
  </a>
  <a href="/admin/indicators" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
    <h2 className="text-xl font-semibold text-slate-900">Indicators</h2>
    <p className="mt-2 text-sm text-slate-600">Manage indicators and metadata.</p>
  </a>
</div>
    </main>
  );
}