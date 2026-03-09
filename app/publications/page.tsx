import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/common/PageHero";
import { Container } from "@/components/common/Container";
import { getPublications } from "@/lib/queries";

export default async function PublicationsPage() {
  const publications = await getPublications();

  return (
    <>
      <PageHero
        title="Publications"
        description="Reports, bulletins, and official statistical outputs from Nile Metrika."
      />
      <section className="py-12">
        <Container>
          {publications.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {publications.map((publication) => (
                <Link
                  key={publication.id}
                  href={`/publications/${publication.slug}`}
                  className="block"
                >
                  <div className="nm-card p-5 transition hover:-translate-y-0.5 hover:shadow-md">
                    <p className="text-sm text-slate-500">
                      {publication.type || "Publication"}
                    </p>
                    <h2 className="mt-2 text-lg font-semibold text-slate-900">
                      {publication.title}
                    </h2>
                    <p className="mt-3 text-sm text-slate-600">
                      {publication.summary || "No summary available."}
                    </p>
                    <p className="mt-4 text-sm text-slate-500">
                      {publication.publication_date || "N/A"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="nm-card p-6 text-sm text-slate-600">
              No publications available yet.
            </div>
          )}
        </Container>
      </section>
    </>
  );
}

export const metadata: Metadata = {
  title: "Publications",
  description:
    "Read reports, bulletins, factsheets, and official statistical publications from Nile Metrika.",
};