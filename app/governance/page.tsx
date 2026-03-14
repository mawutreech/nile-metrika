import type { Metadata } from "next";
import { SectionLanding } from "@/components/site/SectionLanding";

export const metadata: Metadata = {
  title: "Governance in South Sudan",
  description:
    "Browse South Sudan’s governance structures, institutions, executive, legislature, judiciary, decentralization, and public administration pathways.",
  alternates: {
    canonical: "https://nilemetrica.com/governance",
  },
};

export default function GovernancePage() {
  return (
    <SectionLanding
      eyebrow="Governance"
      title="Governance and public institutions"
      description="Browse institutions, executive structures, legislature, judiciary, decentralization, and public administration pathways in South Sudan."
      heroImageSrc="/images/sections/governance-coat-of-arms.jpg"
      heroImageAlt="South Sudan coat of arms"
      highlights={[
        {
          title: "Institutional overview",
          description:
            "Understand the structure of public authority and national institutions in South Sudan.",
        },
        {
          title: "Public system",
          description:
            "Connect governance themes to administration, decentralization, and local government structures.",
        },
        {
          title: "Linked legal framework",
          description:
            "Move between governance practice and the legal and constitutional framework behind it.",
        },
      ]}
      sections={[
        {
          title: "Executive",
          description:
            "Follow the national executive structure and associated public functions.",
          href: "/governance",
        },
        {
          title: "Legislature",
          description:
            "Browse legislative institutions and their place within the state structure.",
          href: "/governance",
        },
        {
          title: "Judiciary",
          description:
            "Connect governance to judicial institutions and rule-of-law pathways.",
          href: "/governance",
        },
        {
          title: "Public Administration",
          description:
            "Understand ministries, administration, and the operation of the public system.",
          href: "/governance",
        },
        {
          title: "Local Government",
          description:
            "Bridge national governance with state and local administrative structure.",
          href: "/states",
        },
      ]}
      featuredResources={[
        {
          title: "Law & Constitution",
          description:
            "Connect governance structures to constitutional and legal foundations.",
          href: "/law",
        },
        {
          title: "States & Territories",
          description:
            "Understand governance as it connects to states, counties, payams, and local administration.",
          href: "/states",
        },
        {
          title: "Publications",
          description:
            "Use reports and briefs as supporting material on institutions and governance.",
          href: "/publications",
        },
      ]}
      relatedLinks={[
        { title: "Country", href: "/country" },
        { title: "Law & Constitution", href: "/law" },
        { title: "States & Territories", href: "/states" },
      ]}
    />
  );
}