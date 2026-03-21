import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, TrendingUp, FileText, DollarSign, CheckCircle, ArrowRight, Search, Target, Zap, CalendarDays, Crown } from "lucide-react";
import { isValidLang, t, type Lang } from "@/lib/i18n";
import { getCityBySlug, getAllCitySlugs } from "@/lib/cityData";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import LeadForm from "@/components/marketing/LeadForm";
import { CitySchema } from "@/components/shared/StructuredData";

interface CityPageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const city = getCityBySlug(slug);
  if (!city) return {};

  const title = `${city.name}, ${city.stateCode} Contractors — Lead Generation & SEO | Trades-USA`;
  const description = `Get exclusive homeowner leads as a contractor in ${city.name}, ${city.state}. AI-powered lead generation, hyper-local SEO, and instant Telegram alerts for ${city.name} trade contractors.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://trades-usa.com/en/city/${slug}`,
    },
    openGraph: {
      title,
      description,
      type: "website",
      locale: "en_US",
    },
  };
}

export async function generateStaticParams() {
  const slugs = getAllCitySlugs();
  return slugs.map((slug) => ({ lang: "en", slug }));
}

const cityFeatures = [
  { icon: Search, label: "Hyper-Local SEO Dominance" },
  { icon: Target, label: "AI-Powered Lead Scoring" },
  { icon: Zap, label: "Instant Telegram Alerts (<5min)" },
  { icon: CalendarDays, label: "Planexa Booking Engine" },
];

export default async function CityPage({ params }: CityPageProps) {
  const { lang, slug } = await params;
  if (!isValidLang(lang)) notFound();
  const city = getCityBySlug(slug);
  if (!city) notFound();

  const l = lang as Lang;

  return (
    <>
      {/* AI SEO: Full city schema with LocalBusiness + FAQPage for LLM citations */}
      <CitySchema
        cityName={city.name}
        citySlug={slug}
        state={city.state}
        population={city.population ?? 1000000}
      />
      <div className="min-h-screen flex flex-col">
        <Navbar lang={l} />
        <main className="flex-1 pt-24">
          {/* Hero */}
          <section className="relative py-20 overflow-hidden">
            <div className="absolute inset-0 bg-hero-gradient" />
            <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-50" />
            <div className="absolute inset-0 bg-amber-glow-sm" />
            <div className="section-container relative z-10">
              <div className="max-w-4xl">
                <div className="flex items-center gap-2 mb-4">
                  <span className="badge-amber">
                    <MapPin className="w-3.5 h-3.5" />
                    {city.state} Market
                  </span>
                </div>
                <h1 className="heading-xl mb-6">
                  <span className="text-gradient-amber">{city.name}, {city.stateCode}</span>{" "}
                  <span className="text-foreground">Contractor Leads</span>
                </h1>
                <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl leading-relaxed mb-8">
                  {city.description}
                </p>
                <div className="flex flex-wrap gap-3 mb-10">
                  {city.topTrades.map((trade) => (
                    <span key={trade} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-muted-foreground">
                      <CheckCircle className="w-3.5 h-3.5 text-amber-500" />
                      {trade}
                    </span>
                  ))}
                </div>
                <Link href={`/${l}/booking`} className="btn-amber text-base px-8 py-4 inline-flex">
                  {t("city.cta", l)} {city.name}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </section>

          {/* Stats */}
          <section className="py-16 border-t border-b border-white/[0.04]">
            <div className="section-container">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
                {[
                  { icon: FileText, label: t("city.permits", l), value: city.permits },
                  { icon: TrendingUp, label: t("city.growth", l), value: city.growth },
                  { icon: DollarSign, label: t("city.avgJob", l), value: city.avgJobValue },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="stat-card items-center text-center">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-2">
                      <Icon className="w-5 h-5 text-amber-400" />
                    </div>
                    <div className="font-display font-bold text-2xl text-gradient-amber">{value}</div>
                    <div className="text-muted-foreground text-xs font-display tracking-wide">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Luxury ZIP badge if applicable */}
          {city.luxuryZips && city.luxuryZips.length > 0 && (
            <section className="py-10 border-b border-white/[0.04]">
              <div className="section-container">
                <div className="max-w-3xl mx-auto flex items-start gap-4 p-5 rounded-2xl bg-amber-950/20 border border-amber-700/30">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                    <Crown className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="font-display font-semibold text-sm text-foreground mb-1">
                      Elite ZIP Code Targeting Available
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Empire Builder subscribers get exclusive access to luxury permit data in {city.name}&apos;s premium ZIP codes: {city.luxuryZips.slice(0, 3).join(", ")} and more. Average job value exceeds $250,000.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Features + Form */}
          <section className="py-20">
            <div className="section-container">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
                <div>
                  <h2 className="heading-md mb-6">
                    What We Build for {city.name} Contractors
                  </h2>
                  <div className="space-y-4">
                    {cityFeatures.map(({ icon: Icon, label }) => (
                      <div key={label} className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                        <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5 text-amber-400" />
                        </div>
                        <div>
                          <p className="font-display font-semibold text-sm text-foreground">{label}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <LeadForm lang={l} />
              </div>
            </div>
          </section>
        </main>
        <Footer lang={l} />
      </div>
    </>
  );
}
