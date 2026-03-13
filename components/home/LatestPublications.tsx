import Link from "next/link";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { getLatestPublications } from "@/lib/queries";

export async function LatestPublications() {
  const publications = await getLatestPublications(3);

  return (
    <section className="bg-white py-20">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            title="Latest publications"
            description="Recent reports, bulletins, and statistical outputs released through Nile Metrica."
          />
          <Link
            href="/publications"
            className="inline-flex h-fit items-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            View all publications
          </Link>
        </div>

        {publications.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-3">
            {publications.map((publication) => (
              <Link
                key={publication.id}
                href={`/publications/${publication.slug}`}
                className="block rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <p className="text-sm font-medium text-slate-500">
                  {publication.type || "Publication"}
                </p>
                <h3 className="mt-3 text-xl font-semibold text-slate-900">
                  {publication.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {publication.summary || "No summary available."}
                </p>
                <p className="mt-5 text-sm text-slate-500">
                  {publication.publication_date || "N/A"}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
            No publications available yet.
          </div>
        )}
      </Container>
    </section>
  );
}