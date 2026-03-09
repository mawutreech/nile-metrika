import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Nile Metrika",
    template: "%s | Nile Metrika",
  },
  description: "South Sudan's public statistics and data portal.",
  applicationName: "Nile Metrika",
  keywords: [
    "South Sudan",
    "statistics",
    "data portal",
    "economy",
    "population",
    "education",
    "health",
    "public data",
  ],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Nile Metrika",
    description: "South Sudan's public statistics and data portal.",
    url: siteUrl,
    siteName: "Nile Metrika",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Nile Metrika",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nile Metrika",
    description: "South Sudan's public statistics and data portal.",
    images: ["/og-image.svg"],
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
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
