import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/blog";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://kalend.id";

const YEARS = [2024, 2025, 2026, 2027];
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE_URL}/tools`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/tools/kalkulator`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/tools/cek-weton`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/tools/cuti-optimizer`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
  ];

  const yearRoutes: MetadataRoute.Sitemap = YEARS.flatMap((year) => [
    { url: `${BASE_URL}/${year}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${BASE_URL}/${year}?country=MY`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE_URL}/long-weekends/${year}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 },
    ...MONTHS.map((month) => ({
      url: `${BASE_URL}/${year}/${String(month).padStart(2, "0")}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ]);

  const blogSlugs = getAllSlugs();
  const blogRoutes: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...yearRoutes, ...blogRoutes];
}
