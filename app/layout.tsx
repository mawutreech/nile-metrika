import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { SiteHeader } from "@/components/site/SiteHeader";

export const metadata: Metadata = {
  metadataBase: new URL("https://example.com"),
  title: {
    default: "Nile Metrika",
    template: "%s | Nile Metrika",
  },
  description:
    "South Sudan public portal for accessible, trusted, and structured statistical information.",
  applicationName: "Nile Metrika",
  keywords: [
    "Nile Metrika",
    "South Sudan",
    "data portal",
    "statistics",
    "datasets",
    "indicators",
    "publications",
  ],
  authors: [{ name: "Nile Metrika" }],
  creator: "Nile Metrika",
  publisher: "Nile Metrika",
  openGraph: {
    title: "Nile Metrika",
    description:
      "South Sudan public portal for accessible, trusted, and structured statistical information.",
    siteName: "Nile Metrika",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nile Metrika",
    description:
      "South Sudan public portal for accessible, trusted, and structured statistical information.",
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <SiteHeader />

        <div>{children}</div>

        <footer className="mt-20 border-t border-slate-200 bg-slate-950 text-slate-300">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
            <div>
              <h3 className="text-xl font-semibold text-white">Nile Metrika</h3>
              <p className="mt-4 max-w-sm text-sm leading-7 text-slate-400">
                South Sudan’s public portal for accessible, trusted, and
                structured statistical information.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-white">
                Explore
              </h4>
              <div className="mt-4 flex flex-col gap-3 text-sm">
                <FooterLink href="/data">Data</FooterLink>
                <FooterLink href="/indicators">Indicators</FooterLink>
                <FooterLink href="/publications">Publications</FooterLink>
                <FooterLink href="/methodology">Methodology</FooterLink>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-white">
                About
              </h4>
              <div className="mt-4 flex flex-col gap-3 text-sm">
                <FooterLink href="/about">About Nile Metrika</FooterLink>
                <FooterLink href="/contact">Contact</FooterLink>
                <FooterLink href="/search">Search</FooterLink>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800">
            <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-sm text-slate-500 sm:px-6 md:flex-row md:items-center md:justify-between">
              <p>© 2026 Nile Metrika. All rights reserved.</p>
              <p>Accessible public data for research, planning, and policy use.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="block text-slate-400 transition hover:text-white"
    >
      {children}
    </Link>
  );
}