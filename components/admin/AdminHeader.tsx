import Link from "next/link";

export function AdminHeader({
  email,
  role,
}: {
  email: string;
  role: string;
}) {
  const roleStyles =
    role === "admin"
      ? "bg-rose-100 text-rose-700"
      : role === "editor"
        ? "bg-amber-100 text-amber-700"
        : "bg-slate-100 text-slate-700";

  return (
    <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-emerald-700">
          Admin
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">
          Nile Metrika Admin
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Signed in as {email}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${roleStyles}`}>
          {role}
        </span>
        <Link
          href="/"
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          View site
        </Link>
      </div>
    </div>
  );
}