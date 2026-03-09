import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/common/PageHero";
import { Container } from "@/components/common/Container";
import { getDatasetBySlug } from "@/lib/queries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const dataset = await getDatasetBySlug(slug);

  if (!dataset) {
    return {
      title: "Dataset not found",
      description: "This dataset could not be found on Nile Metrika.",
    };
  }

  return {
    title: dataset.title,
    description:
      dataset.description || `${dataset.title} dataset on Nile Metrika.`,
  };
}

export default async function DatasetPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const dataset = await getDatasetBySlug(slug);

  if (!dataset) return notFound();

  return (
    <>
      <PageHero
        title={dataset.title}
        description={dataset.description || "Dataset detail page"}
      />

      <section className="py-12">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="nm-card p-6">
              <h2 className="text-xl font-semibold text-slate-900">
                Dataset overview
              </h2>
              <div className="mt-6 space-y-4 text-sm text-slate-600">
                <div>
                  <p className="font-medium text-slate-900">Description</p>
                  <p className="mt-1">
                    {dataset.description || "No description available."}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-slate-900">Theme</p>
                  <p className="mt-1">{dataset.theme?.name || "Uncategorized"}</p>
                </div>
                <div>
                  <p className="font-medium text-slate-900">Source agency</p>
                  <p className="mt-1">
                    {dataset.source_agency?.name || "Unknown source"}
                  </p>
                </div>
              </div>
            </div>

            <div className="nm-card p-6">
              <h2 className="text-xl font-semibold text-slate-900">Metadata</h2>
              <div className="mt-6 space-y-4 text-sm text-slate-600">
                <div>
                  <p className="font-medium text-slate-900">Format</p>
                  <p className="mt-1">{dataset.format || "Unknown"}</p>
                </div>
                <div>
                  <p className="font-medium text-slate-900">Updated</p>
                  <p className="mt-1">{dataset.update_date || "N/A"}</p>
                </div>
                <div>
                  <p className="font-medium text-slate-900">Publication date</p>
                  <p className="mt-1">{dataset.publication_date || "N/A"}</p>
                </div>
                <div>
                  <p className="font-medium text-slate-900">Download</p>
                  {dataset.file_url ? (
                    <a
                      href={dataset.file_url}
                      className="mt-1 inline-flex text-slate-900 underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Download file
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