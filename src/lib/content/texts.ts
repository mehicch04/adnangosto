import "server-only";
import { TEXTS_KEY, defaultTexts, mergeTexts, type SiteTexts } from "@/content/texts";
import { cachedContent } from "@/lib/content/store";

export const getTexts = cachedContent<SiteTexts>(
  "sve",
  "tekstovi",
  async (db) => {
    const { data, error } = await db
      .from("site_content")
      .select("value")
      .eq("key", TEXTS_KEY)
      .maybeSingle();
    if (error) return null;
    return data ? mergeTexts(data.value) : defaultTexts;
  },
  defaultTexts,
);
