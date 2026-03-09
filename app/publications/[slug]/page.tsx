import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/common/PageHero";
import { Container } from "@/components/common/Container";
import { getPublicationBySlug } from "@/lib/queries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const publication = await getPublicationBySlug(slug);

  if (!publication) {
    return {
      title: "Publication not found",
      description: "This publication could not be found on Nile Metrika.",
    };
  }

  return {
    title: publication.title,
    description:
      publication.summary || `${publication.title} publication on Nile Metrika.`,
  };
}

export default async function PublicationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const publication = await getPublicationBySlug(slug);

  if (!publication) return notFound();

  return (
    <>
      <PageHero
        title={publication.title}
        description={publication.summary || "Publication detail page"}
      />

      <section className="py-12">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="nm-card p-6">
              <h2 className="text-xl font-semibold text-slate-900">
                Publication overview
              </h2>
              <div className="mt-6 space-y-4 text-sm text-slate-600">
                <div>
                  <p className="font-medium text-slate-900">Summary</p>
                  <p className="mt-1">
                    {publication.summary || "No summary available."}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-slate-900">Type</p>
                  <p className="mt-1">{publication.type || "Publication"}</p>
                </div>
                <div>
                  <p className="font-medium text-slate-900">Publication date</p>
                  <p className="mt-1">{publication.publication_date || "N/A"}</p>
                </div>
              </div>
            </div>

            <div className="nm-card p-6">
              <h2 className="text-xl font-semibold text-slate-900">Access</h2>
              <div className="mt-6 space-y-4 text-sm text-slate-600">
                <div>
                  <p className="font-medium text-slate-900">Download</p>
                  {publication.file_url ? (
                    <a
                      href={publication.file_url}
                      className="mt-1 inline-flex text-slate-900 underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open publication
                    </a>
                  ) : (
                    <p className="mt-1">No file attached yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}