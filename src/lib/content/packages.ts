import "server-only";
import { cache } from "react";
import { z } from "zod";
import {
  extraPriceGroups,
  onlinePriceGroup,
  packages as basePackages,
  type CoachingPackage,
  type PriceGroup,
} from "@/content/packages";
import { cachedContent } from "@/lib/content/store";

export const PACKAGE_COLUMNS =
  "slug, name, short_name, badge, tagline, audience, price, price_unit, price_note, check_in, features, includes, featured, is_active, position";

export type PackageRow = {
  slug: string;
  name: string;
  short_name: string | null;
  badge: string | null;
  tagline: string | null;
  audience: string | null;
  price: number | string | null;
  price_unit: string | null;
  price_note: string | null;
  check_in: string | null;
  features: string[] | null;
  includes: { title: string; text: string }[] | null;
  featured: boolean;
  is_active: boolean;
  position: number;
};

export const PRICE_LIST_KEY = "cjenovnik";

export function mergePackage(pkg: CoachingPackage, row?: PackageRow): CoachingPackage {
  if (!row) return pkg;
  const price = row.price === null || row.price === "" ? NaN : Number(row.price);
  return {
    ...pkg,
    name: row.name || pkg.name,
    shortName: row.short_name || pkg.shortName,
    badge: row.badge || undefined,
    featured: row.featured,
    tagline: row.tagline || pkg.tagline,
    audience: row.audience || pkg.audience,
    price: Number.isFinite(price) ? price : pkg.price,
    priceUnit: row.price_unit || pkg.priceUnit,
    priceNote: row.price_note || pkg.priceNote,
    checkIn: row.check_in || pkg.checkIn,
    cardFeatures: row.features?.length ? row.features : pkg.cardFeatures,
    includes: row.includes?.length ? row.includes : pkg.includes,
  };
}

const loadPackages = cachedContent<CoachingPackage[]>(
  "lista",
  "paketi",
  async (db) => {
    const { data, error } = await db
      .from("packages")
      .select(PACKAGE_COLUMNS)
      .eq("is_active", true)
      .order("position");
    if (error || !data?.length) return null;
    const list = (data as PackageRow[]).flatMap((row) => {
      const pkg = basePackages.find((p) => p.slug === row.slug);
      return pkg ? [mergePackage(pkg, row)] : [];
    });
    return list.length ? list : null;
  },
  basePackages,
);

export const getPackages = cache(loadPackages);

export async function getPackage(slug: string) {
  return (await getPackages()).find((p) => p.slug === slug);
}

const itemSchema = z.object({
  name: z.string().trim().min(1).max(120),
  detail: z.string().trim().max(200).optional(),
  price: z.string().trim().min(1).max(60),
  unit: z.string().trim().max(60).optional(),
});

export const priceGroupsSchema = z
  .array(
    z.object({
      id: z.string().trim().min(1).max(60),
      title: z.string().trim().min(1).max(80),
      text: z.string().trim().max(240),
      items: z.array(itemSchema).max(30),
    }),
  )
  .max(20);

export function parsePriceGroups(value: string | null | undefined): PriceGroup[] | null {
  if (!value) return null;
  try {
    const parsed = priceGroupsSchema.safeParse(JSON.parse(value));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

const loadExtraGroups = cachedContent<PriceGroup[]>(
  "cjenovnik",
  "paketi",
  async (db) => {
    const { data } = await db
      .from("site_content")
      .select("value")
      .eq("key", PRICE_LIST_KEY)
      .maybeSingle();
    return parsePriceGroups(data?.value);
  },
  extraPriceGroups,
);

export const getPriceList = cache(async (): Promise<PriceGroup[]> => {
  const [list, extra] = await Promise.all([getPackages(), loadExtraGroups()]);
  return [onlinePriceGroup(list), ...extra];
});
