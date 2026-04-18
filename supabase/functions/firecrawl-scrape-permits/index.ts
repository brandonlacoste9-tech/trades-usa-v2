import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const FIRECRAWL_API_KEY = Deno.env.get("FIRECRAWL_API_KEY")!;

interface FirecrawlResult {
  url: string;
  markdown: string;
  metadata?: { title?: string; description?: string };
}

interface ScrapedPermit {
  title: string;
  description: string | null;
  location: string | null;
  permit_number: string | null;
  source: string;
  url: string;
  city: string;
  project_type: string | null;
  estimated_value: number | null;
}

const PERMIT_SOURCES = [
  { city: "houston", url: "https://www.houstontx.gov/codes/prmtstats.html", label: "Houston Permits" },
  { city: "phoenix", url: "https://www.phoenix.gov/pdd/building-permits/permit-data", label: "Phoenix Permits" },
  { city: "miami", url: "https://www.miamigov.com/Building-Permits/Check-Permit-Status", label: "Miami Permits" },
  { city: "atlanta", url: "https://www.atlantaga.gov/government/departments/city-planning/building-permits", label: "Atlanta Permits" },
  { city: "dallas", url: "https://dallascityhall.com/departments/sustainabledevelopment/buildinginspection/Pages/PermitReports.aspx", label: "Dallas Permits" },
  { city: "austin", url: "https://www.austintexas.gov/devreview/a_query_detail.jsp", label: "Austin Permits" },
];

function detectProjectType(text: string): string | null {
  const lower = text.toLowerCase();
  if (lower.includes("hvac") || lower.includes("heating") || lower.includes("cooling") || lower.includes("furnace")) return "hvac";
  if (lower.includes("roof") || lower.includes("shingle")) return "roofing";
  if (lower.includes("plumb") || lower.includes("drain")) return "plumbing";
  if (lower.includes("electric")) return "electrical";
  if (lower.includes("landscape")) return "landscaping";
  if (lower.includes("renovat") || lower.includes("addition") || lower.includes("remodel")) return "renovations";
  if (lower.includes("new build") || lower.includes("construction") || lower.includes("foundation")) return "general";
  return null;
}

function extractEstimatedValue(text: string): number | null {
  const matches = text.match(/\$[\d,]+(?:\.\d{2})?/g);
  if (!matches) return null;
  const values = matches.map((m) => parseFloat(m.replace(/[$,]/g, "")));
  return Math.max(...values) || null;
}

async function scrapeWithFirecrawl(url: string): Promise<FirecrawlResult | null> {
  try {
    const res = await fetch("https://api.firecrawl.dev/v1/scrape", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${FIRECRAWL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url,
        formats: ["markdown"],
        onlyMainContent: true,
        timeout: 30000,
      }),
    });

    if (!res.ok) {
      console.error(`Firecrawl error for ${url}: ${res.status}`);
      return null;
    }

    const data = await res.json();
    return data.data ?? null;
  } catch (err) {
    console.error(`Scrape failed for ${url}:`, err);
    return null;
  }
}

function parsePermitsFromMarkdown(markdown: string, city: string, sourceUrl: string): ScrapedPermit[] {
  const permits: ScrapedPermit[] = [];
  const lines = markdown.split("\n").filter((l) => l.trim());

  // Extract permit-like entries (lines with permit numbers, addresses, etc.)
  const permitPattern = /(?:permit|permis|application|#)\s*[\w-]+/i;
  const addressPattern = /\d+\s+[\w\s]+(?:st|ave|blvd|rd|dr|way|cres|pl|court|lane|street|avenue|boulevard|road|drive|crescent|place)\b/i;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.length < 20 || line.length > 500) continue;

    const hasPermitRef = permitPattern.test(line);
    const hasAddress = addressPattern.test(line);

    if (hasPermitRef || hasAddress) {
      const context = lines.slice(Math.max(0, i - 1), Math.min(lines.length, i + 3)).join(" ");
      const projectType = detectProjectType(context);
      const estimatedValue = extractEstimatedValue(context);

      const permitMatch = context.match(/(?:permit|permis|#)\s*([\w-]+)/i);
      const permitNumber = permitMatch?.[1] ?? null;

      permits.push({
        title: line.trim().substring(0, 200),
        description: context.trim().substring(0, 500),
        location: hasAddress ? line.trim() : null,
        permit_number: permitNumber,
        source: city.charAt(0).toUpperCase() + city.slice(1) + " Open Data",
        url: sourceUrl,
        city,
        project_type: projectType,
        estimated_value: estimatedValue,
      });

      if (permits.length >= 20) break; // Cap per source
    }
  }

  return permits;
}

Deno.serve(async (req) => {
  const startTime = Date.now();
  let totalInserted = 0;
  let totalSkipped = 0;
  const errors: string[] = [];

  console.log(`Starting Firecrawl permit scrape for ${PERMIT_SOURCES.length} cities`);

  for (const source of PERMIT_SOURCES) {
    try {
      console.log(`Scraping ${source.city}...`);
      const result = await scrapeWithFirecrawl(source.url);

      if (!result?.markdown) {
        errors.push(`No content from ${source.city}`);
        continue;
      }

      const permits = parsePermitsFromMarkdown(result.markdown, source.city, source.url);
      console.log(`Found ${permits.length} permits in ${source.city}`);

      for (const permit of permits) {
        // Upsert by URL + permit_number to avoid duplicates
        const { error } = await supabase
          .from("scraped_inventory")
          .upsert(
            { ...permit, scraped_at: new Date().toISOString() },
            { onConflict: "url,permit_number", ignoreDuplicates: true }
          );

        if (error) {
          totalSkipped++;
        } else {
          totalInserted++;
        }
      }
    } catch (err: any) {
      errors.push(`${source.city}: ${err.message}`);
    }
  }

  const duration = Date.now() - startTime;

  // Log the scrape run
  await supabase.from("automated_logs").insert({
    event_type: "firecrawl.scrape_complete",
    channel: "firecrawl",
    status: errors.length === PERMIT_SOURCES.length ? "failed" : "sent",
    subject: `Scraped ${totalInserted} permits in ${duration}ms`,
    metadata: { inserted: totalInserted, skipped: totalSkipped, errors, duration_ms: duration },
  });

  console.log(`Scrape complete: ${totalInserted} inserted, ${totalSkipped} skipped, ${errors.length} errors`);

  return new Response(
    JSON.stringify({ inserted: totalInserted, skipped: totalSkipped, errors, duration_ms: duration }),
    { headers: { "Content-Type": "application/json" } }
  );
});
