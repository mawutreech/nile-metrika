import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { signOutAdmin } from "./actions";

export default async function AdminPage() {
  const { profile } = await requireRole(["admin", "editor", "viewer"]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <AdminHeader email={profile.email} role={profile.role} />

      <div className="mb-8 flex justify-end">
        <form action={signOutAdmin}>
          <button
            type="submit"
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Log out
          </button>
        </form>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Link
          href="/admin/publications"
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold text-slate-900">Publications</h2>
          <p className="mt-2 text-sm text-slate-600">
            Manage reports, bulletins, and uploads.
          </p>
        </Link>

        <Link
          href="/admin/datasets"
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold text-slate-900">Datasets</h2>
          <p className="mt-2 text-sm text-slate-600">
            Manage datasets, downloads, and metadata.
          </p>
        </Link>

        <Link
          href="/admin/indicators"
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold text-slate-900">Indicators</h2>
          <p className="mt-2 text-sm text-slate-600">
            Manage indicators and time-series values.
          </p>
        </Link>
      </div>
    </main>
  );
}