import { SectionLanding } from "@/components/site/SectionLanding";

export default function EconomyPage() {
  return (
    <SectionLanding
      eyebrow="Economy"
      title="Economy and productive sectors"
      heroImageSrc="/images/sections/economy-central-bank.jpg"
      heroImageAlt="Central Bank of South Sudan building"
      description="Explore macroeconomic structure, trade, agriculture, public finance, labour, and wider productive sectors."
      highlights={[
        {
          title: "National economic view",
          description:
            "Use this section as a structured entry point into how the South Sudanese economy is organized.",
        },
        {
          title: "Sector pathways",
          description:
            "Connect macroeconomy to public finance, trade, agriculture, labour, and extractive sectors.",
        },
        {
          title: "Evidence-linked exploration",
          description:
            "Move from economic themes into indicators, datasets, and publications that support analysis.",
        },
      ]}
      sections={[
        {
          title: "Macroeconomy",
          description:
            "Develop a national reference layer for growth, inflation, and broad economic structure.",
          href: "/economy",
        },
        {
          title: "Public Finance",
          description:
            "Link budgets, revenue, expenditure, and state capacity to public analysis.",
          href: "/economy",
        },
        {
          title: "Trade",
          description:
            "Follow external trade, border flows, and broader market linkages.",
          href: "/economy",
        },
        {
          title: "Agriculture",
          description:
            "Connect agriculture to livelihoods, land, and state-level economic realities.",
          href: "/economy",
        },
        {
          title: "Oil & Extractives",
          description:
            "Reference the national role of extractive sectors in the wider economy.",
          href: "/economy",
        },
      ]}
      featuredResources={[
        {
          title: "Indicators",
          description:
            "Use the indicators section as the structured evidence layer for economic themes.",
          href: "/indicators",
        },
        {
          title: "Datasets",
          description:
            "Browse downloadable data relevant to macroeconomic and sectoral topics.",
          href: "/data",
        },
        {
          title: "Publications",
          description:
            "Open reports and analytical outputs related to economic structure and performance.",
          href: "/publications",
        },
      ]}
      relatedLinks={[
        { title: "Data & Statistics", href: "/statistics" },
        { title: "Publications", href: "/publications" },
        { title: "States & Territories", href: "/states" },
      ]}
    />
  );
}