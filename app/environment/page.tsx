import { SectionLanding } from "@/components/site/SectionLanding";

export default function EnvironmentPage() {
  return (
    <SectionLanding
      eyebrow="Environment"
      title="Environment and natural systems"
      heroImageSrc="/images/sections/environment-nile-river.jpg"
      heroImageAlt="Nile River in South Sudan"
      description="Explore climate, land, water, forestry, biodiversity, and environmental governance across South Sudan."
      highlights={[
        {
          title: "Environmental reference layer",
          description:
            "Use this section to organize environmental themes into clear, public-facing pathways.",
        },
        {
          title: "Nature and territory",
          description:
            "Connect environmental systems with geography, land, resources, and local vulnerability.",
        },
        {
          title: "Linked public knowledge",
          description:
            "Move from environmental themes into states, publications, and evidence resources.",
        },
      ]}
      sections={[
        {
          title: "Climate",
          description:
            "Organize climate, variability, and environmental risk into accessible reference pages.",
          href: "/environment",
        },
        {
          title: "Land",
          description:
            "Connect land, territory, and local geography to administration and livelihoods.",
          href: "/environment",
        },
        {
          title: "Water Resources",
          description:
            "Build a structured view of rivers, water systems, and related public issues.",
          href: "/environment",
        },
        {
          title: "Forestry & Biodiversity",
          description:
            "Track environmental assets and conservation-related information.",
          href: "/environment",
        },
        {
          title: "Disaster Risk",
          description:
            "Develop a public reference path for shocks, vulnerability, and environmental risk.",
          href: "/environment",
        },
      ]}
      featuredResources={[
        {
          title: "States & Territories",
          description:
            "See how environmental realities differ across states and local areas.",
          href: "/states",
        },
        {
          title: "Publications",
          description:
            "Open reports, briefs, and thematic resources relevant to environment and risk.",
          href: "/publications",
        },
        {
          title: "Data & Statistics",
          description:
            "Pair environmental themes with the structured evidence layer of the portal.",
          href: "/statistics",
        },
      ]}
      relatedLinks={[
        { title: "States & Territories", href: "/states" },
        { title: "Publications", href: "/publications" },
        { title: "Data & Statistics", href: "/statistics" },
      ]}
    />
  );
}