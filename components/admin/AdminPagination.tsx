import Link from "next/link";

type AdminPaginationProps = {
  currentPage: number;
  totalPages: number;
  basePath: string;
  query?: string;
};

export function AdminPagination({
  currentPage,
  totalPages,
  basePath,
  query = "",
}: AdminPaginationProps) {
  if (totalPages <= 1) return null;

  const buildHref = (page: number) => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    if (query) params.set("q", query);
    return `${basePath}?${params.toString()}`;
  };

  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-slate-500">
        Page {currentPage} of {totalPages}
      </p>

      <div className="flex gap-2">
        {currentPage > 1 ? (
          <Link
            href={buildHref(currentPage - 1)}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Previous
          </Link>
        ) : (
          <span className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-400">
            Previous
          </span>
        )}

        {currentPage < totalPages ? (
          <Link
            href={buildHref(currentPage + 1)}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Next
          </Link>
        ) : (
          <span className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-400">
            Next
          </span>
        )}
      </div>
    </div>
  );
}