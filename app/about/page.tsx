import type { Metadata } from "next";
import { PageHero } from "@/components/common/PageHero";
import { Container } from "@/components/common/Container";

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="About Nile Metrika"
        description="A public statistical platform for accessible and structured information on South Sudan."
      />
      <section className="py-12">
        <Container>
          <div className="nm-card p-6">
            <p className="max-w-3xl text-slate-600">
              Nile Metrika is designed to provide the general public, researchers, journalists,
              students, and policymakers with a clean and reliable portal for exploring public data.
              The platform brings together datasets, indicators, publications, and methodology into
              one scalable system.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Nile Metrika and its role as a public statistics portal for South Sudan.",
};