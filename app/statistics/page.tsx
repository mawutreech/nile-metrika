import { SectionLanding } from "@/components/site/SectionLanding";

export default function StatisticsPage() {
  return (
    <SectionLanding
      eyebrow="Data & Statistics"
      title="Data, statistics, and structured evidence"
      description="Access datasets, indicators, census structures, methodology, maps, and downloads as one core module within Nile Metrica."
      highlights={[
        {
          title: "Evidence layer",
          description:
            "Use this section as the structured data and statistical foundation of the broader portal.",
        },
        {
          title: "From data to interpretation",
          description:
            "Connect raw datasets and indicators to publications, geography, and national themes.",
        },
        {
          title: "Public reference support",
          description:
            "Support country, governance, economy, society, and environment pages with structured evidence.",
        },
      ]}
      sections={[
        {
          title: "Datasets",
          description:
            "Browse downloadable datasets with metadata and structured documentation.",
          href: "/data",
        },
        {
          title: "Indicators",
          description:
            "Review measures, definitions, and time-series values.",
          href: "/indicators",
        },
        {
          title: "Census",
          description:
            "Explore states, counties, payams, and population through maps and hierarchy pages.",
          href: "/census",
        },
        {
          title: "Methodology",
          description:
            "Read definitions, notes, and methodological guidance.",
          href: "/methodology",
        },
        {
          title: "Publications",
          description:
            "Connect data products with reports, bulletins, and briefs.",
          href: "/publications",
        },
      ]}
      featuredResources={[
        {
          title: "Datasets",
          description:
            "Open downloadable evidence resources across themes and sectors.",
          href: "/data",
        },
        {
          title: "Indicators",
          description:
            "Browse the structured measures that support public understanding and analysis.",
          href: "/indicators",
        },
        {
          title: "Census",
          description:
            "Use the geography and population explorer as a bridge between statistics and place.",
          href: "/census",
        },
      ]}
      relatedLinks={[
        { title: "Search", href: "/search" },
        { title: "Publications", href: "/publications" },
        { title: "States & Territories", href: "/states" },
      ]}
    />
  );
}