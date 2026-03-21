import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MetaPixel from "@/components/shared/MetaPixel";
import { OrganizationSchema } from "@/components/shared/StructuredData";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://trades-usa.com"),
  title: {
    default: "Trades-USA — America's #1 Contractor Growth Platform",
    template: "%s | Trades-USA",
  },
  description:
    "The all-in-one lead generation, SEO, and automation platform built for US trade contractors — across all 50 states. Exclusive leads, flat monthly pricing, no per-lead fees.",
  keywords: [
    "contractor leads USA",
    "lead generation for contractors",
    "HVAC leads",
    "roofing leads",
    "plumbing leads",
    "contractor SEO",
    "trades marketing USA",
    "homeadvisor alternative",
    "angi alternative",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Trades-USA",
  },
  twitter: {
    card: "summary_large_image",
    site: "@tradesusa",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* AI SEO: Organization entity — tells LLMs exactly what this brand is */}
        <OrganizationSchema />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {/* Meta Pixel — fires on every page, tracks route changes automatically */}
        <MetaPixel />
        {children}
      </body>
    </html>
  );
}
