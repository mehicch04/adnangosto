import "server-only";
import {
  transformationCategories,
  transformationPhotos,
  type TransformationCategory,
} from "@/content/site";
import { cachedContent } from "@/lib/content/store";
import { imageSrc } from "@/lib/media";

export type Transformation = {
  id: string;
  src: string;
  alt: string;
  category: TransformationCategory;
  name: string | null;
  label: string | null;
  result: string | null;
  story: string | null;
  testimonial: string | null;
};

export type TransformationRow = {
  id: string;
  image: string | null;
  alt: string | null;
  category: TransformationCategory;
  client_name: string | null;
  client_label: string | null;
  result: string | null;
  story: string | null;
  testimonial: string | null;
  position: number;
  is_active: boolean;
};

export const TRANSFORMATION_COLUMNS =
  "id, image, alt, category, client_name, client_label, result, story, testimonial, position, is_active";

export function categoryLabel(c: TransformationCategory) {
  return transformationCategories.find((x) => x.id === c)?.label ?? c;
}

export function fromRow(r: TransformationRow): Transformation | null {
  if (!r.image) return null;
  const name = r.client_name?.trim() || null;
  return {
    id: r.id,
    src: imageSrc(r.image),
    alt:
      r.alt?.trim() ||
      `Transformacija${name ? `: ${name}` : " klijenta"}, fotografija prije i poslije suradnje`,
    category: r.category,
    name,
    label: r.client_label?.trim() || null,
    result: r.result?.trim() || null,
    story: r.story?.trim() || null,
    testimonial: r.testimonial?.trim() || null,
  };
}

const fallback: Transformation[] = transformationPhotos.map((p, i) => ({
  id: `local-${i}`,
  src: p.src,
  alt: p.alt,
  category: p.category,
  name: null,
  label: null,
  result: null,
  story: null,
  testimonial: null,
}));

export const getTransformations = cachedContent<Transformation[]>(
  "lista",
  "transformacije",
  async (db) => {
    const { data, error } = await db
      .from("transformations")
      .select(TRANSFORMATION_COLUMNS)
      .eq("is_active", true)
      .order("position");
    if (error) return null;
    return ((data ?? []) as TransformationRow[])
      .map(fromRow)
      .filter((t): t is Transformation => t !== null);
  },
  fallback,
);

export type Testimonial = { id: string; name: string; role: string; quote: string };

export async function getTestimonials(): Promise<Testimonial[]> {
  const items = await getTransformations();
  return items.flatMap((t) =>
    t.testimonial
      ? [
          {
            id: t.id,
            name: t.name ?? "Klijent",
            role:
              t.label ?? t.result ?? (t.category === "takmicari" ? "Natjecatelj" : "Rekreativac"),
            quote: t.testimonial,
          },
        ]
      : [],
  );
}
