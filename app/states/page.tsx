import type { Metadata } from "next";
import { SectionLanding } from "@/components/site/SectionLanding";

export const metadata: Metadata = {
  title: "States and Territories of South Sudan",
  description:
    "Browse South Sudan’s states, administrative areas, counties, payams, bomas, and subnational geography through Nile Metrica.",
  alternates: {
    canonical: "https://nilemetrica.com/states",
  },
};

export default function StatesPage() {
  return (
    <SectionLanding
      eyebrow="States & Territories"
      title="States, territories, and local geography"
      description="Move from the national level into states, administrative areas, counties, payams, bomas, and subnational structure."
      heroImageSrc="/images/sections/states-map.jpg"
      heroImageAlt="Map of South Sudan states"
      highlights={[
        {
          title: "Geographic hierarchy",
          description:
            "Use this section to understand South Sudan through territorial and administrative layers.",
        },
        {
          title: "Subnational structure",
          description:
            "Connect states, counties, payams, and bomas through a consistent public reference structure.",
        },
        {
          title: "Linked census geography",
          description:
            "Move into the census explorer for population-linked subnational navigation.",
        },
      ]}
      sections={[
        {
          title: "States",
          description:
            "Browse state-level geography and subnational entry points.",
          href: "/states",
        },
        {
          title: "Administrative Areas",
          description:
            "Connect administrative areas and territorial distinctions within the national structure.",
          href: "/states",
        },
        {
          title: "Counties",
          description:
            "Move into county-level reference and linked local profiles.",
          href: "/census",
        },
        {
          title: "Payams and Bomas",
          description:
            "Follow finer layers of administrative and census geography.",
          href: "/census",
        },
        {
          title: "Local Profiles",
          description:
            "Use geography as a bridge into local public information and future profiles.",
          href: "/census",
        },
      ]}
      featuredResources={[
        {
          title: "Census Explorer",
          description:
            "Browse the population and hierarchy explorer for states, counties, and payams.",
          href: "/census",
        },
        {
          title: "Country",
          description:
            "Return to the national-level overview of South Sudan and its administrative structure.",
          href: "/country",
        },
        {
          title: "Governance",
          description:
            "Connect territorial structure to decentralization and public administration.",
          href: "/governance",
        },
      ]}
      relatedLinks={[
        { title: "Country", href: "/country" },
        { title: "Governance", href: "/governance" },
        { title: "Census Explorer", href: "/census" },
      ]}
    />
  );
}