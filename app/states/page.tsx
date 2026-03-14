import { SectionLanding } from "@/components/site/SectionLanding";

export default function StatesPage() {
  return (
    <SectionLanding
      eyebrow="States & Territories"
      title="States, territories, and local geography"
      heroImageSrc="/images/sections/states-map.jpg"
      heroImageAlt="Map of South Sudan states"
      description="Move from national structure into states, administrative areas, counties, payams, and bomas."
      highlights={[
        {
          title: "Geographic entry point",
          description:
            "Use this section to move from national understanding into the territorial structure of South Sudan.",
        },
        {
          title: "Subnational exploration",
          description:
            "Follow administrative hierarchy from states and areas to counties, payams, and bomas.",
        },
        {
          title: "Linked maps and population",
          description:
            "Connect local geography to census, population, maps, and related public resources.",
        },
      ]}
      sections={[
        {
          title: "States",
          description:
            "Browse state-level profiles, structures, and linked subnational content.",
          href: "/census",
        },
        {
          title: "Administrative Areas",
          description:
            "Access territorial pages alongside the states within one geographic framework.",
          href: "/census",
        },
        {
          title: "County Profiles",
          description:
            "Drill down into counties, population, maps, and linked subnational profiles.",
          href: "/census",
        },
        {
          title: "Payam & Boma Hierarchy",
          description:
            "Follow the lower levels of local administration and settlement structure.",
          href: "/census",
        },
      ]}
      featuredResources={[
        {
          title: "Census Explorer",
          description:
            "Open the geography and population explorer across the whole administrative hierarchy.",
          href: "/census",
        },
        {
          title: "Country",
          description:
            "Return to the national frame and administrative structure overview.",
          href: "/country",
        },
        {
          title: "Data & Statistics",
          description:
            "Use linked evidence, indicators, and datasets alongside local geography.",
          href: "/statistics",
        },
      ]}
      relatedLinks={[
        { title: "Census Explorer", href: "/census" },
        { title: "Country", href: "/country" },
        { title: "Data & Statistics", href: "/statistics" },
      ]}
    />
  );
}