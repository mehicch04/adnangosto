import { z } from "zod";
import { gallery } from "@/content/about";

export const GALLERY_KEY = "galerija";
export const GALLERY_MAX = 16;

export const galleryItemSchema = z.object({
  path: z.string().trim().min(1).max(200),
  alt: z.string().trim().min(3, "Opiši fotografiju u par riječi.").max(160),
});

export const gallerySchema = z.array(galleryItemSchema).max(GALLERY_MAX);

export type GalleryItem = z.infer<typeof galleryItemSchema>;

export const defaultGallery: GalleryItem[] = gallery.map((g) => ({ path: g.src, alt: g.alt }));

export function parseGallery(raw: unknown): GalleryItem[] | null {
  let data: unknown = raw;
  if (typeof raw === "string") {
    try {
      data = JSON.parse(raw);
    } catch {
      return null;
    }
  }
  const parsed = gallerySchema.safeParse(data);
  return parsed.success ? parsed.data : null;
}
