import type { MetadataRoute } from "next";
import { getPackages } from "@/lib/content/packages";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const packages = await getPackages();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const now = new Date();
  return [
    { url: siteUrl, lastModified: now, changeFrequency: "monthly", priority: 1 },
    ...packages.map((p) => ({
      url: `${siteUrl}/paketi/${p.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    { url: `${siteUrl}/cjenovnik`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/o-meni`, lastModified: now, changeFrequency: "yearly", priority: 0.8 },
    {
      url: `${siteUrl}/politika-privatnosti`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
