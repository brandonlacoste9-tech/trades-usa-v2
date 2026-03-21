"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronRight, Zap, TrendingUp, Users, BarChart3 } from "lucide-react";
import { t, type Lang } from "@/lib/i18n";
import { cities } from "@/lib/cityData";

interface HeroSectionProps {
  lang: Lang;
}

const stats = [
  { label: "US Population Served", value: "330M+", icon: Zap },
  { label: "States Covered", value: "50", icon: TrendingUp },
  { label: "Avg ROI Increase", value: "3.2x", icon: BarChart3 },
  { label: "Lead Response Time", value: "<5min", icon: Users },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function HeroSection({ lang }: HeroSectionProps) {
  const cityNames = cities.map((c) => `${c.name}, ${c.stateCode}`);
  const duplicated = [...cityNames, ...cityNames];

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Full-bleed construction hero image */}
      <div className="absolute inset-0">
        <Image
          src="/hero-bg.jpg"
          alt="Trade contractors building a home at sunset"
          fill
          priority
          quality={90}
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Dark overlay — amber-tinted to match the design system */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-[#0a0a0a]" />
        {/* Amber glow layer */}
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-900/20 via-transparent to-transparent" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-30" />

      {/* Ambient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-amber-600/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 section-container pt-32 pb-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="flex justify-center mb-6">
            <span className="badge-amber">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-glow-pulse" />
              Agency-as-a-Service for Trade Contractors
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1 variants={itemVariants} className="heading-xl mb-6">
            <span className="block text-foreground">We Build the Engine.</span>
            <span className="block text-gradient-amber">You Get the Leads.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10"
          >
            Stop losing revenue to competitors who show up first on Google. Our AI-powered platform delivers exclusive, qualified homeowner leads directly to your phone — across all 50 states.
          </motion.p>

          {/* Trust badges */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-4 mb-10">
            {["You Own Your Leads", "No Per-Lead Fees", "Flat Monthly Pricing"].map((badge) => (
              <span key={badge} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <span className="w-4 h-4 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                </span>
                {badge}
              </span>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href={`/${lang}/booking`} className="btn-amber text-base px-8 py-4 w-full sm:w-auto">
              Start Getting Leads
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href={`/${lang}#features`} className="btn-outline-amber text-base px-8 py-4 w-full sm:w-auto">
              See How It Works
              <ChevronRight className="w-5 h-5" />
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto mb-16"
          >
            {stats.map(({ label, value, icon: Icon }) => (
              <div key={label} className="stat-card items-center text-center">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-2">
                  <Icon className="w-5 h-5 text-amber-400" />
                </div>
                <div className="font-display font-bold text-2xl text-gradient-amber">{value}</div>
                <div className="text-muted-foreground text-xs font-display tracking-wide">{label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* City Ticker */}
      <div className="relative z-10 border-t border-b border-white/[0.04] bg-black/40 backdrop-blur-sm py-4">
        <div className="ticker-wrapper">
          <div className="flex animate-ticker gap-8 w-max">
            {duplicated.map((city, i) => (
              <div key={i} className="flex items-center gap-2 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500/60" />
                <span className="font-display text-sm text-muted-foreground tracking-wide">{city}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
