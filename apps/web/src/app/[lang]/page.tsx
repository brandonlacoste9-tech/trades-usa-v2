import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isValidLang, type Lang } from "@/lib/i18n";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import HeroSection from "@/components/marketing/HeroSection";
import FeaturesSection from "@/components/marketing/FeaturesSection";
import ROICalculator from "@/components/marketing/ROICalculator";
import PricingSection from "@/components/marketing/PricingSection";
import LeadForm from "@/components/marketing/LeadForm";

interface HomePageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { lang } = await params;
  void lang; // US is English-only

  return {
    title: "Trades-USA — America's #1 Contractor Growth Platform",
    description:
      "Stop losing revenue to competitors who show up first on Google. Our AI-powered platform delivers exclusive, qualified homeowner leads directly to your phone — across all 50 states. Flat monthly pricing. No per-lead fees.",
    alternates: {
      canonical: "https://trades-usa.com/en",
    },
  };
}

export async function generateStaticParams() {
  return [{ lang: "en" }];
}

export default async function HomePage({ params }: HomePageProps) {
  const { lang } = await params;
  if (!isValidLang(lang)) notFound();
  const l = lang as Lang;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar lang={l} />
      <main className="flex-1">
        <HeroSection lang={l} />
        <FeaturesSection lang={l} />
        <ROICalculator lang={l} />
        <PricingSection lang={l} />

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-amber-glow-sm" />
          <div className="section-container relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
              <div>
                <div className="section-label w-fit mb-4">
                  Get Your Free Market Report
                </div>
                <h2 className="heading-lg mb-4">
                  Ready to Dominate Your Market?
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Fill out the form and we&apos;ll show you exactly how many leads you&apos;re missing in your market. No contracts. No per-lead fees. Cancel anytime.
                </p>
              </div>
              <LeadForm lang={l} />
            </div>
          </div>
        </section>
      </main>
      <Footer lang={l} />
    </div>
  );
}
