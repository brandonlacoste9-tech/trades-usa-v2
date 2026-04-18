"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Check, Zap, ArrowRight, Crown } from "lucide-react";
import { t, type Lang } from "@/lib/i18n";

interface PricingSectionProps {
  lang: Lang;
}

const plans = [
  {
    nameKey: "pricing.starter.name" as const,
    price: "$0",
    priceId: "free",
    badge: "Community",
    features: [
      "Access to Lead Radar (Scraped Data)",
      "Public Contractor Profile",
      "Community Support Forum",
      "Market Intelligence Reports",
      "Manual Lead Claiming",
    ],
    popular: false,
    cta: "pricing.cta" as const,
  },
  {
    nameKey: "pricing.engine.name" as const,
    price: "$149",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER ?? "",
    badge: "Lead Starter",
    features: [
      "Everything in Free",
      "Verified Homeowner Leads",
      "Instant SMS/Email Notifications",
      "1 City SEO Landing Page",
      "Basic CRM Integration",
      "Lead scoring & qualification",
    ],
    popular: true,
    cta: "pricing.cta" as const,
  },
  {
    nameKey: "pricing.dominator.name" as const,
    price: "$349",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ENGINE ?? "",
    badge: "Most Powerful",
    features: [
      "Everything in Starter",
      "Exclusive High-Intent Leads",
      "5 City SEO Landing Pages",
      "Automated Appointment Booking",
      "Telegram Premium Alerts",
      "Advanced ROI Analytics",
      "Priority Account Support",
    ],
    popular: false,
    cta: "pricing.cta" as const,
    premium: false, // Changed from true to allow normal checkout flow
  },
];

export default function PricingSection({ lang }: PricingSectionProps) {
  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-amber-glow-sm" />
      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="section-label mx-auto w-fit">{t("pricing.badge", lang)}</div>
          <h2 className="heading-lg mt-4 mb-4">{t("pricing.heading", lang)}</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">{t("pricing.sub", lang)}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.nameKey}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className={`relative rounded-2xl p-6 flex flex-col gap-6 ${
                plan.popular
                  ? "bg-amber-500/8 border border-amber-500/30 shadow-amber"
                  : plan.premium
                  ? "bg-gradient-to-b from-amber-950/30 to-black/40 border border-amber-700/40"
                  : "glass-card cyber-border"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="flex items-center gap-1.5 px-4 py-1 rounded-full bg-amber-500 text-black text-xs font-display font-bold shadow-amber-sm">
                    {plan.popular ? <Zap className="w-3 h-3" /> : <Crown className="w-3 h-3" />}
                    {plan.badge}
                  </span>
                </div>
              )}

              <div>
                <h3 className="font-display font-bold text-base text-foreground mb-3">
                  {t(plan.nameKey, lang)}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="font-display font-bold text-4xl text-gradient-amber">{plan.price}</span>
                  <span className="text-muted-foreground text-sm">{t("pricing.month", lang)}</span>
                </div>
              </div>

              <ul className="space-y-3 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span className="text-muted-foreground text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {plan.premium ? (
                <Link
                  href={`/${lang}/booking`}
                  className="btn-outline-amber justify-center"
                >
                  Contact Sales
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <Link
                  href={`/${lang}/auth?plan=${plan.priceId}`}
                  className={plan.popular ? "btn-amber justify-center" : "btn-outline-amber justify-center"}
                >
                  {t(plan.cta, lang)}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </motion.div>
          ))}
        </div>

        {/* Trust line */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center text-muted-foreground text-sm mt-10"
        >
          No contracts. No per-lead fees. Cancel anytime.
        </motion.p>
      </div>
    </section>
  );
}
