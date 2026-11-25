"use server";

import type { ActionResult } from "@/app/admin/actions";
import { GALLERY_KEY, gallerySchema, parseGallery } from "@/content/gallery";
import { requireAdmin } from "@/lib/admin/auth";
import { removeMedia, uploadedPath } from "@/lib/admin/media";
import { refreshContent } from "@/lib/content/store";

const allowed = (p: string) =>
  /^\/images\/[\w-]+\.(jpg|jpeg|png|webp)$/.test(p) || uploadedPath("galerija").test(p);

export async function saveGallery(items: unknown): Promise<ActionResult> {
  const parsed = gallerySchema.safeParse(items);
  if (!parsed.success)
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Provjeri fotografije." };
  if (!parsed.data.every((g) => allowed(g.path)))
    return { ok: false, message: "Neka fotografija nije ispravno poslana." };
  const { supabase } = await requireAdmin();
  const { data, error: readError } = await supabase
    .from("site_content")
    .select("value")
    .eq("key", GALLERY_KEY)
    .maybeSingle();
  if (readError) return { ok: false, message: "Baza nije dostupna. Pokušaj ponovo." };
  const { error } = await supabase
    .from("site_content")
    .upsert({ key: GALLERY_KEY, value: JSON.stringify(parsed.data) }, { onConflict: "key" });
  if (error) return { ok: false, message: "Galerija nije sačuvana. Pokušaj ponovo." };
  const keep = new Set(parsed.data.map((g) => g.path));
  const previous = parseGallery(data?.value ?? null) ?? [];
  await removeMedia(
    supabase,
    previous.map((g) => g.path).filter((p) => !keep.has(p)),
  );
  refreshContent("fotografije");
  return { ok: true, message: "Galerija je sačuvana i već je na sajtu." };
}
