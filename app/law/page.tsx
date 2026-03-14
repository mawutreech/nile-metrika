import { SectionLanding } from "@/components/site/SectionLanding";

export default function LawPage() {
  return (
    <SectionLanding
      eyebrow="Law & Constitution"
      title="Law, constitution, and policy"
      heroImageSrc="/images/sections/law-balance-scale.jpg"
      heroImageAlt="Scale of Justice"
      description="Use Nile Metrica as an entry point into the constitutional, legal, and policy framework of South Sudan."
      highlights={[
        {
          title: "Constitutional anchor",
          description:
            "Use this section to organize legal and constitutional reference around the structure of the state.",
        },
        {
          title: "Law and policy pathway",
          description:
            "Connect major legal instruments, regulations, and policy frameworks by theme.",
        },
        {
          title: "Linked governance context",
          description:
            "Move between legal foundations and the public institutions that operate within them.",
        },
      ]}
      sections={[
        {
          title: "Constitution",
          description:
            "Anchor legal and institutional reference around the constitution.",
          href: "/law",
        },
        {
          title: "Laws",
          description:
            "Build a navigable structure for major legal instruments and references.",
          href: "/law",
        },
        {
          title: "Regulations",
          description:
            "Connect sectoral governance to operational legal frameworks.",
          href: "/law",
        },
        {
          title: "Policy Frameworks",
          description:
            "Organize national policy directions and public frameworks by theme.",
          href: "/law",
        },
      ]}
      featuredResources={[
        {
          title: "Local Government Act, 2009",
          description:
            "Explore the legal framework for local government structures, powers, functions, duties, and finances.",
          href: "/law/local-government-act",
        },
        {
          title: "Governance",
          description:
            "Connect legal reference with executive, legislature, judiciary, and public administration.",
          href: "/governance",
        },
        {
          title: "Publications",
          description:
            "Use reports and briefs as supporting material for legal and policy themes.",
          href: "/publications",
        },
        {
          title: "Data & Statistics",
          description:
            "Pair legal and policy reading with structured evidence and public data.",
          href: "/statistics",
        },
      ]}
      relatedLinks={[
        { title: "Governance", href: "/governance" },
        { title: "Publications", href: "/publications" },
        { title: "Data & Statistics", href: "/statistics" },
      ]}
    />
  );
}