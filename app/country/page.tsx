import { SectionLanding } from "@/components/site/SectionLanding";

export default function CountryPage() {
  return (
    <SectionLanding
      eyebrow="Country"
      title="South Sudan"
      description="Explore South Sudan through national overview, geography, population, administrative structure, and core reference pathways across the portal."
      heroImageSrc="/images/sections/country-flag.jpg"
      heroImageAlt="South Sudan flag"
      highlights={[
        {
          title: "National entry point",
          description:
            "Use this section as the starting point for understanding South Sudan as a country, state, and public system.",
        },
        {
          title: "Country and geography",
          description:
            "Connect national overview with geography, population structure, and territorial organization.",
        },
        {
          title: "Bridge to the portal",
          description:
            "Move from country-level understanding into governance, states and territories, and structured evidence.",
        },
      ]}
      sections={[
        {
          title: "Overview",
          description:
            "A structured introduction to South Sudan as a state, society, and public system.",
          href: "/country",
        },
        {
          title: "Geography",
          description:
            "Understand land, regions, borders, rivers, and spatial structure.",
          href: "/country",
        },
        {
          title: "History",
          description:
            "Build a reference path into key historical and state-forming milestones.",
          href: "/country",
        },
        {
          title: "Population",
          description:
            "Browse national and subnational demographic structure and census-linked content.",
          href: "/census",
        },
        {
          title: "Administrative Structure",
          description:
            "Move from the national level into states, administrative areas, counties, payams, and bomas.",
          href: "/states",
        },
      ]}
      featuredResources={[
        {
          title: "States & Territories",
          description:
            "Move from the national level into state, county, payam, and boma structure.",
          href: "/states",
        },
        {
          title: "Census Explorer",
          description:
            "Browse population-linked geography through maps, tables, and hierarchy pages.",
          href: "/census",
        },
        {
          title: "Data & Statistics",
          description:
            "Open the evidence layer behind population, geography, and administrative reference.",
          href: "/statistics",
        },
      ]}
      relatedLinks={[
        { title: "Governance", href: "/governance" },
        { title: "States & Territories", href: "/states" },
        { title: "Data & Statistics", href: "/statistics" },
      ]}
    />
  );
}