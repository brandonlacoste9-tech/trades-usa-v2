import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isValidLang, type Lang } from "@/lib/i18n";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import LeadForm from "@/components/marketing/LeadForm";
import { CalendarDays, Clock, CheckCircle, Phone } from "lucide-react";

interface BookingPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Book a Free Strategy Call | Trades-USA",
    description:
      "Book a free 30-minute strategy call with the Trades-USA team. We'll audit your digital presence and show you exactly how many leads you're missing in your market.",
    alternates: {
      canonical: "https://trades-usa.com/en/booking",
    },
  };
}

export async function generateStaticParams() {
  return [{ lang: "en" }];
}

const benefits = [
  "Custom website audit & competitive analysis",
  "Hyper-local SEO strategy for your trade & city",
  "ROI projection based on your specific market",
  "No contracts, no commitment — just clarity",
];

export default async function BookingPage({ params }: BookingPageProps) {
  const { lang } = await params;
  if (!isValidLang(lang)) notFound();
  const l = lang as Lang;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar lang={l} />
      <main className="flex-1 pt-24">
        {/* Hero */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-hero-gradient" />
          <div className="absolute inset-0 bg-amber-glow-sm" />
          <div className="section-container relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
              <div>
                <div className="section-label w-fit mb-4">
                  <CalendarDays className="w-3.5 h-3.5" />
                  Free Strategy Call
                </div>
                <h1 className="heading-lg mb-4">
                  Let&apos;s Build Your Growth Engine
                </h1>
                <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                  Book a 30-minute strategy call with our team. We&apos;ll audit your current digital presence and map out exactly how to dominate your local market — before your competitors do.
                </p>

                <div className="space-y-3 mb-8">
                  {benefits.map((benefit) => (
                    <div key={benefit} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                      <span className="text-muted-foreground text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <Clock className="w-5 h-5 text-amber-400 shrink-0" />
                    <div>
                      <p className="font-display font-semibold text-sm text-foreground">
                        30-Minute Strategy Session
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Via Google Meet or phone
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <Phone className="w-5 h-5 text-amber-400 shrink-0" />
                    <div>
                      <p className="font-display font-semibold text-sm text-foreground">
                        Or reach us directly
                      </p>
                      <a href="mailto:northern-ventures@outlook.com" className="text-amber-400 text-xs hover:text-amber-300 transition-colors">
                        northern-ventures@outlook.com
                      </a>
                    </div>
                  </div>
                </div>
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
