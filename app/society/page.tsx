import { SectionLanding } from "@/components/site/SectionLanding";

export default function SocietyPage() {
  return (
    <SectionLanding
      eyebrow="Society & Services"
      title="Society, services, and human development"
      heroImageSrc="/images/sections/society-school.jpg"
      heroImageAlt="School in South Sudan"
      description="Browse education, health, social protection, water, sanitation, and wider public-service themes."
      highlights={[
        {
          title: "Human development focus",
          description:
            "Use this section to organize population-facing services and social development themes.",
        },
        {
          title: "National to local relevance",
          description:
            "Connect service sectors to states, counties, and population structure across the country.",
        },
        {
          title: "Evidence and geography linked",
          description:
            "Move from social themes into census, indicators, and publications.",
        },
      ]}
      sections={[
        {
          title: "Education",
          description:
            "Structure national and subnational education reference pages and indicators.",
          href: "/society",
        },
        {
          title: "Health",
          description:
            "Build a public reference layer for health systems, services, and conditions.",
          href: "/society",
        },
        {
          title: "Water & Sanitation",
          description:
            "Connect service access and public infrastructure to local and national pages.",
          href: "/society",
        },
        {
          title: "Social Protection",
          description:
            "Reference social protection systems and population-facing public support.",
          href: "/society",
        },
        {
          title: "Gender & Youth",
          description:
            "Create space for social structure, participation, and demographic themes.",
          href: "/society",
        },
      ]}
      featuredResources={[
        {
          title: "Census",
          description:
            "Use geography and population structure to support service-focused understanding.",
          href: "/census",
        },
        {
          title: "Data & Statistics",
          description:
            "Connect social themes to indicators, datasets, and structured evidence.",
          href: "/statistics",
        },
        {
          title: "Publications",
          description:
            "Browse briefs, reports, and thematic outputs relevant to human development.",
          href: "/publications",
        },
      ]}
      relatedLinks={[
        { title: "Census", href: "/census" },
        { title: "Data & Statistics", href: "/statistics" },
        { title: "Publications", href: "/publications" },
      ]}
    />
  );
}