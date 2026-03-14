import type { Metadata } from "next";
import { SectionLanding } from "@/components/site/SectionLanding";

export const metadata: Metadata = {
  title: "South Sudan Economy",
  description:
    "Explore South Sudan’s macroeconomic structure, trade, agriculture, public finance, labour, and productive sectors through Nile Metrica.",
  alternates: {
    canonical: "https://nilemetrica.com/economy",
  },
};

export default function EconomyPage() {
  return (
    <SectionLanding
      eyebrow="Economy"
      title="Economy and productive sectors"
      description="Explore macroeconomic structure, trade, agriculture, public finance, labour, and wider productive sectors."
      heroImageSrc="/images/sections/economy-central-bank.jpg"
      heroImageAlt="Central Bank of South Sudan building"
      highlights={[
        {
          title: "Macroeconomic pathway",
          description:
            "Use this section to structure understanding of national economic performance and public finance.",
        },
        {
          title: "Productive sectors",
          description:
            "Connect agriculture, trade, labour, and wider production themes in one section.",
        },
        {
          title: "Evidence-linked",
          description:
            "Move from economic themes into data, indicators, and publications for deeper evidence.",
        },
      ]}
      sections={[
        {
          title: "Macroeconomy",
          description:
            "Organize inflation, growth, exchange rate, and national economic structure.",
          href: "/economy",
        },
        {
          title: "Public Finance",
          description:
            "Connect budgets, expenditure, revenue, and fiscal structure.",
          href: "/economy",
        },
        {
          title: "Trade",
          description:
            "Browse external trade, market links, and economic connectivity themes.",
          href: "/economy",
        },
        {
          title: "Agriculture",
          description:
            "Use agriculture as a core pillar of productive-sector understanding.",
          href: "/economy",
        },
        {
          title: "Labour and Markets",
          description:
            "Follow labour-market and economic participation pathways.",
          href: "/economy",
        },
      ]}
      featuredResources={[
        {
          title: "Data & Statistics",
          description:
            "Access datasets, indicators, and structured evidence for economic themes.",
          href: "/statistics",
        },
        {
          title: "Publications",
          description:
            "Use reports and briefs to support economic interpretation.",
          href: "/publications",
        },
        {
          title: "Country",
          description:
            "Return to the broader national overview that frames economic structure.",
          href: "/country",
        },
      ]}
      relatedLinks={[
        { title: "Country", href: "/country" },
        { title: "Data & Statistics", href: "/statistics" },
        { title: "Publications", href: "/publications" },
      ]}
    />
  );
}