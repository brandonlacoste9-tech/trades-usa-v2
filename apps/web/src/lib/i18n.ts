export type Lang = "en";

export const locales: Lang[] = ["en"];
export const defaultLocale: Lang = "en";

const translations = {
  en: {
    // Nav
    "nav.features": "Features",
    "nav.pricing": "Pricing",
    "nav.bookCall": "Book a Call",
    "nav.login": "Contractor Login",
    "nav.getQuote": "Get Started",

    // Hero
    "hero.badge": "America's #1 Contractor Growth Platform",
    "hero.headline1": "We Build the Engine.",
    "hero.headline2": "You Get the Leads.",
    "hero.sub": "Stop losing revenue to competitors who show up first on Google. Our AI-powered platform delivers exclusive, qualified homeowner leads directly to your phone — across all 50 states.",
    "hero.cta1": "Start Getting Leads",
    "hero.cta2": "See How It Works",
    "hero.stat.leads": "US Population Served",
    "hero.stat.cities": "States Covered",
    "hero.stat.retention": "Avg ROI Increase",
    "hero.stat.roi": "Lead Response Time",

    // Features
    "features.badge": "Platform",
    "features.heading": "Your Complete Digital Growth Engine",
    "features.sub": "Everything you need to generate, capture, and convert leads — built specifically for US trade contractors.",
    "features.seo.title": "Hyper-Local SEO",
    "features.seo.desc": "Dominate Google in your city. We build and optimize your online presence so you show up first when homeowners search for your trade.",
    "features.leads.title": "Nationwide Lead Targeting",
    "features.leads.desc": "AI-powered lead capture targeting homeowners across America's highest-growth construction markets.",
    "features.automation.title": "Automated Follow-Ups",
    "features.automation.desc": "Never miss a lead again. Automated email and SMS sequences nurture every prospect until they book.",
    "features.scheduling.title": "Planexa Scheduling",
    "features.scheduling.desc": "Your command center for site estimates. Homeowners book directly into your calendar — no phone tag.",
    "features.radar.title": "Market Intelligence",
    "features.radar.desc": "Scraped building permit data from county and city portals, delivered as actionable market opportunities.",
    "features.intel.title": "Instant Notifications",
    "features.intel.desc": "Get new lead alerts via SMS, email, and Telegram the second a homeowner submits a request. Speed to lead wins the job.",

    // ROI
    "roi.badge": "ROI Calculator",
    "roi.heading": "See Your Revenue Potential",
    "roi.sub": "See exactly how much revenue our engine can generate for your business.",
    "roi.leadsPerMonth": "Leads Per Month",
    "roi.avgJobPrice": "Average Job Value",
    "roi.closeRate": "Close Rate",
    "roi.monthlyRevenue": "Estimated Monthly Revenue",
    "roi.annualRevenue": "Estimated Annual Revenue",
    "roi.roiLabel": "Estimated ROI",

    // Pricing
    "pricing.badge": "Pricing",
    "pricing.heading": "Flat Monthly Pricing. No Per-Lead Fees.",
    "pricing.sub": "Unlike Angi or HomeAdvisor, you pay one flat rate — no surprises, no shared leads, no bidding wars.",
    "pricing.month": "/mo",
    "pricing.popular": "Most Popular",
    "pricing.cta": "Get Started",
    "pricing.starter.name": "The Professional",
    "pricing.engine.name": "The Market Dominator",
    "pricing.dominator.name": "The Empire Builder",

    // Auth
    "auth.login": "Sign In",
    "auth.signup": "Create Account",
    "auth.email": "Email Address",
    "auth.password": "Password",
    "auth.displayName": "Your Name",
    "auth.companyName": "Company Name",
    "auth.forgotPassword": "Forgot password?",
    "auth.resetPassword": "Reset Password",
    "auth.sendReset": "Send Reset Link",
    "auth.backToLogin": "Back to Sign In",
    "auth.noAccount": "Don't have an account?",
    "auth.hasAccount": "Already have an account?",
    "auth.verifyEmail": "Check your email to verify your account.",
    "auth.invalidCreds": "Invalid credentials.",
    "auth.welcome": "Welcome back!",

    // Dashboard
    "dashboard.title": "Contractor Dashboard",
    "dashboard.leads": "My Leads",
    "dashboard.radar": "Lead Radar",
    "dashboard.settings": "Settings",
    "dashboard.automationLog": "Automation Log",
    "dashboard.noActivity": "No activity yet.",
    "dashboard.totalLeads": "Total Leads",
    "dashboard.newLeads": "New This Week",
    "dashboard.converted": "Converted",
    "dashboard.revenue": "Est. Revenue",
    "dashboard.claimLead": "Claim Lead",
    "dashboard.claimed": "Claimed",
    "dashboard.heatScore": "Heat Score",
    "dashboard.source": "Source",
    "dashboard.location": "Location",
    "dashboard.noLeads": "No market leads available right now.",

    // Settings
    "settings.title": "Account Settings",
    "settings.profile": "Profile",
    "settings.subscription": "Subscription",
    "settings.telegram": "Telegram Alerts",
    "settings.save": "Save Changes",
    "settings.saved": "Changes saved.",
    "settings.phone": "Phone Number",
    "settings.services": "Services Offered",
    "settings.telegram.connect": "Connect Telegram",
    "settings.telegram.connected": "Telegram Connected",
    "settings.telegram.disconnect": "Disconnect",
    "settings.telegram.instructions": "Send this code to our bot to receive instant lead alerts:",
    "settings.telegram.waiting": "Waiting for connection...",
    "settings.plan": "Current Plan",
    "settings.noPlan": "No active subscription.",
    "settings.upgrade": "Upgrade Plan",
    "settings.manage": "Manage Billing",

    // City
    "city.badge": "Local Market",
    "city.cta": "Get Leads in",
    "city.permits": "Annual Permits",
    "city.growth": "Market Growth",
    "city.avgJob": "Avg. Job Value",
    "city.notFound": "City Not Found",

    // Footer
    "footer.tagline": "The automation engine for America's construction industry.",
    "footer.contact": "Contact",
    "footer.rights": "All rights reserved.",
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

export function t(key: TranslationKey, lang: Lang): string {
  return (translations[lang] as Record<string, string>)[key] ?? (translations.en as Record<string, string>)[key] ?? key;
}

export function isValidLang(lang: string): lang is Lang {
  return locales.includes(lang as Lang);
}
