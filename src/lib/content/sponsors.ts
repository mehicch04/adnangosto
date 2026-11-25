import "server-only";
import { cachedContent } from "@/lib/content/store";
import { imageSrc } from "@/lib/media";

export type Sponsor = { id: string; name: string; logo: string | null; url: string | null };

export type SponsorRow = {
  id: string;
  name: string;
  logo_path: string | null;
  url: string | null;
  position: number;
  is_active: boolean;
};

export const SPONSOR_COLUMNS = "id, name, logo_path, url, position, is_active";

export const getSponsors = cachedContent<Sponsor[]>(
  "lista",
  "sponzori",
  async (db) => {
    const { data, error } = await db
      .from("sponsors")
      .select(SPONSOR_COLUMNS)
      .eq("is_active", true)
      .order("position");
    if (error) return null;
    return ((data ?? []) as SponsorRow[]).map((r) => ({
      id: r.id,
      name: r.name,
      logo: r.logo_path ? imageSrc(r.logo_path) : null,
      url: r.url || null,
    }));
  },
  [],
);
