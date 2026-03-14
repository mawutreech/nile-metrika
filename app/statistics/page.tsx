import type { Metadata } from "next";
import { SectionLanding } from "@/components/site/SectionLanding";

export const metadata: Metadata = {
  title: "South Sudan Data and Statistics",
  description:
    "Access South Sudan datasets, indicators, census geography, publications, methodology, maps, and structured public evidence.",
  alternates: {
    canonical: "https://nilemetrica.com/statistics",
  },
};

export default function StatisticsPage() {
  return (
    <SectionLanding
      eyebrow="Data & Statistics"
      title="Data, indicators, and structured evidence"
      description="Access datasets, indicators, census geography, publications, methodology, maps, and structured public evidence."
      highlights={[
        {
          title: "Evidence layer",
          description:
            "Use this section as the structured evidence base across the wider Nile Metrica portal.",
        },
        {
          title: "Connected datasets",
          description:
            "Move between data, indicators, geography, and publications through a single public reference pathway.",
        },
        {
          title: "Method and context",
          description:
            "Pair structured evidence with methodology and public interpretation.",
        },
      ]}
      sections={[
        {
          title: "Datasets",
          description:
            "Open downloadable data resources and linked metadata.",
          href: "/data",
        },
        {
          title: "Indicators",
          description:
            "Browse statistical indicators and structured measures.",
          href: "/indicators",
        },
        {
          title: "Census",
          description:
            "Explore geography-linked population and administrative structure.",
          href: "/census",
        },
        {
          title: "Methodology",
          description:
            "Use definitions, sources, and methods to interpret data properly.",
          href: "/methodology",
        },
        {
          title: "Publications",
          description:
            "Connect structured evidence to reports, bulletins, and public outputs.",
          href: "/publications",
        },
      ]}
      featuredResources={[
        {
          title: "Datasets",
          description:
            "Browse downloadable data and public reference materials.",
          href: "/data",
        },
        {
          title: "Indicators",
          description:
            "Use structured measures as a guide to evidence across themes.",
          href: "/indicators",
        },
        {
          title: "Census Explorer",
          description:
            "Open geography-linked population and hierarchy exploration.",
          href: "/census",
        },
      ]}
      relatedLinks={[
        { title: "Country", href: "/country" },
        { title: "Economy", href: "/economy" },
        { title: "Publications", href: "/publications" },
      ]}
    />
  );
}