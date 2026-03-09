import type { Metadata } from "next";
import { PageHero } from "@/components/common/PageHero";
import { Container } from "@/components/common/Container";

export default function MethodologyPage() {
  return (
    <>
      <PageHero
        title="Methodology"
        description="Definitions, sources, classifications, and methods used across Nile Metrika datasets."
      />
      <section className="py-12">
        <Container>
          <div className="nm-card p-6">
            <h2 className="text-xl font-semibold text-slate-900">Transparency and trust</h2>
            <p className="mt-4 max-w-3xl text-slate-600">
              All indicators should be accompanied by clear metadata, source notes, frequency,
              calculation guidance, and revision policies. This page is where methodology notes,
              caveats, and definitions are published for public reference.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}

export const metadata: Metadata = {
  title: "Methodology",
  description:
    "Read definitions, classifications, source notes, and methodological guidance for Nile Metrika data.",
};