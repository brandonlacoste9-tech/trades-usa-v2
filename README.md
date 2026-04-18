# Trades-USA — Monorepo

**The AI-powered growth engine for American trade contractors. Scalable, local, and exclusive.**

## Architecture

This is a **Turborepo** monorepo with the following workspaces:

| Workspace | Stack | Purpose |
| :--- | :--- | :--- |
| `apps/web` | Next.js 15 App Router, TypeScript, Tailwind CSS | Public marketing site + Contractor dashboard |
| `supabase/functions` | Deno Edge Functions | Stripe, Firecrawl, Telegram, Email Queue |

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 15 (App Router, Server Components) |
| **Language** | TypeScript (strict) |
| **Styling** | Tailwind CSS 3 + custom amber-glassmorphism design system |
| **Animations** | Framer Motion 12 |
| **Database & Auth** | Supabase (PostgreSQL + Row Level Security) |
| **Payments** | Stripe (Checkout Sessions + Webhooks) |
| **Notifications** | Telegram Bot API |
| **Web Scraping** | Firecrawl API |
| **Email** | Resend + pgmq queue |
| **Monorepo** | Turborepo |

## Key Architectural Decisions

### SSR/SSG for SEO Dominance
All public-facing pages (`/`, `/city/:slug`, `/booking`) are **Server Components** with `generateStaticParams()`, ensuring fully rendered HTML is served to search engine crawlers. This ensures maximum visibility in highly competitive US local markets.

### Edge Functions as Worker Bees
The backend automation layer lives entirely in Supabase Edge Functions (Deno runtime):
- `stripe-webhook` — Handles subscription lifecycle events
- `create-checkout-session` — Secure server-side Stripe session creation
- `telegram-lead-alert` — Instant lead notifications to contractors
- `firecrawl-scrape-permits` — Daily permit data scraping across high-growth US municipalities
- `send-email-queue` — pgmq-based reliable email delivery via Resend

### Dashboard Architecture
The authenticated dashboard uses a hybrid approach:
- **Server Components** for data fetching (leads, logs, profile)
- **Client Components** for interactive UI (LeadList, SettingsClient, LeadRadarClient)
- **Middleware** for auth protection (no client-side redirects)

## Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

## Environment Variables

Copy `apps/web/.env.example` to `apps/web/.env.local` and fill in your keys.
Copy `supabase/.env.example` to `supabase/.env` for Edge Function secrets.

## Deployment

The `apps/web` Next.js app is designed for **Vercel** deployment with zero configuration.
Supabase Edge Functions are deployed via `supabase functions deploy`.

## US Market Coverage (Initial Launch)

| City | State | Slug |
| :--- | :--- | :--- |
| Houston | Texas | `houston` |
| Phoenix | Arizona | `phoenix` |
| Miami | Florida | `miami` |
| Atlanta | Georgia | `atlanta` |
| Dallas | Texas | `dallas` |
| Charlotte | North Carolina | `charlotte` |
| Austin | Texas | `austin` |
| Denver | Colorado | `denver` |
| Nashville | Tennessee | `nashville` |
| Orlando | Florida | `orlando` |
