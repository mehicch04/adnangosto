import "server-only";
import { gallery } from "@/content/about";
import { GALLERY_KEY, parseGallery, type GalleryItem } from "@/content/gallery";
import { cachedContent } from "@/lib/content/store";
import { imageSrc } from "@/lib/media";

export type GalleryPhoto = { src: string; alt: string };

const fallback: GalleryPhoto[] = gallery.map((g) => ({ src: g.src, alt: g.alt }));

export const getGallery = cachedContent<GalleryPhoto[]>(
  "galerija",
  "fotografije",
  async (db) => {
    const { data, error } = await db
      .from("site_content")
      .select("value")
      .eq("key", GALLERY_KEY)
      .maybeSingle();
    if (error) return null;
    const items: GalleryItem[] | null = data ? parseGallery(data.value) : null;
    if (!items) return fallback;
    return items.map((g) => ({ src: imageSrc(g.path), alt: g.alt }));
  },
  fallback,
);
