import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export const metadata: Metadata = {
  metadataBase: new URL("https://nilemetrica.com"),
  title: {
    default: "Nile Metrica | South Sudan Knowledge Portal",
    template: "%s | Nile Metrica",
  },
  description:
    "Explore South Sudan through governance, law, economy, geography, public services, states, territories, and data from one place.",
  keywords: [
    "Nile Metrica",
    "South Sudan",
    "South Sudan data",
    "South Sudan governance",
    "South Sudan economy",
    "South Sudan law",
    "South Sudan census",
    "South Sudan states",
    "South Sudan statistics",
  ],
  openGraph: {
    title: "Nile Metrica | South Sudan Knowledge Portal",
    description:
      "Explore South Sudan through governance, law, economy, geography, public services, states, territories, and data from one place.",
    url: "https://nilemetrica.com",
    siteName: "Nile Metrica",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nile Metrica | South Sudan Knowledge Portal",
    description:
      "Explore South Sudan through governance, law, economy, geography, public services, states, territories, and data from one place.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://nilemetrica.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-slate-900 antialiased">
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <div className="flex-1">{children}</div>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}