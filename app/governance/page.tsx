import { SectionLanding } from "@/components/site/SectionLanding";

export default function GovernancePage() {
  return (
    <SectionLanding
      eyebrow="Governance"
      title="Governance and public institutions"
      heroImageSrc="/images/sections/governance-coat-of-arms.jpg"
      heroImageAlt="South Sudan coat of arms"
      description="Explore how South Sudan is governed through executive structures, public institutions, decentralization, and local government."
      highlights={[
        {
          title: "Institutional structure",
          description:
            "Understand the main public institutions and governance layers that shape the state.",
        },
        {
          title: "National to local",
          description:
            "Connect central governance with decentralization, local government, and subnational administration.",
        },
        {
          title: "Linked constitutional context",
          description:
            "Move from governance structures into the legal and constitutional framework that supports them.",
        },
      ]}
      sections={[
        {
          title: "Executive",
          description:
            "Understand the national executive layer and its public role.",
          href: "/governance",
        },
        {
          title: "Legislature",
          description:
            "Reference the legislative structure and broader governance framework.",
          href: "/governance",
        },
        {
          title: "Judiciary",
          description:
            "Link judicial structure to the wider constitutional and legal system.",
          href: "/governance",
        },
        {
          title: "Local Government",
          description:
            "Trace governance below the national level into states and local administration.",
          href: "/states",
        },
        {
          title: "Decentralization",
          description:
            "Understand devolved functions and the structure of subnational governance.",
          href: "/states",
        },
      ]}
      featuredResources={[
        {
          title: "Law & Constitution",
          description:
            "Move from governance structure into constitutional and legal reference.",
          href: "/law",
        },
        {
          title: "States & Territories",
          description:
            "See how governance connects to the territorial and administrative hierarchy.",
          href: "/states",
        },
        {
          title: "Publications",
          description:
            "Open reports and public-facing resources related to governance and institutional themes.",
          href: "/publications",
        },
      ]}
      relatedLinks={[
        { title: "Law & Constitution", href: "/law" },
        { title: "States & Territories", href: "/states" },
        { title: "Publications", href: "/publications" },
      ]}
    />
  );
}