import type { MetadataRoute } from "next";
import { cities } from "@/lib/cityData";

const BASE_URL = "https://trades-usa.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Root redirect
  const rootEntries: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ];

  // Home page
  const homeEntries: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/en`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ];

  // Static pages
  const staticPages = ["booking", "auth"];
  const staticEntries: MetadataRoute.Sitemap = staticPages.map((page) => ({
    url: `${BASE_URL}/en/${page}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // City pages — highest SEO priority
  const cityEntries: MetadataRoute.Sitemap = cities.map((city) => ({
    url: `${BASE_URL}/en/city/${city.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [...rootEntries, ...homeEntries, ...staticEntries, ...cityEntries];
}
