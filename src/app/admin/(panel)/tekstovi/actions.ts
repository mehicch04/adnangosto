"use server";

import { z } from "zod";
import type { ActionResult } from "@/app/admin/actions";
import { TEXTS_KEY, mergeTexts, textsSchema, type TextsSection } from "@/content/texts";
import { requireAdmin } from "@/lib/admin/auth";
import { refreshContent } from "@/lib/content/store";

const sections = ["hero", "about", "faq", "contact", "shop", "terms"] as const;

const messages: Record<TextsSection, string> = {
  hero: "Naslovna je sačuvana i već je na sajtu.",
  about: "Tekst O meni je sačuvan.",
  faq: "Česta pitanja su sačuvana.",
  contact: "Kontakt je sačuvan.",
  shop: "Web shop je sačuvan.",
  terms: "Opći uvjeti su sačuvani.",
};

export async function saveTexts(section: TextsSection, value: unknown): Promise<ActionResult> {
  if (!z.enum(sections).safeParse(section).success) return { ok: false, message: "Nepoznat dio." };
  const parsed = textsSchema.shape[section].safeParse(value);
  if (!parsed.success)
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Provjeri polja." };
  const { supabase } = await requireAdmin();
  const { data, error: readError } = await supabase
    .from("site_content")
    .select("value")
    .eq("key", TEXTS_KEY)
    .maybeSingle();
  if (readError) return { ok: false, message: "Baza nije dostupna. Pokušaj ponovo." };
  const next = { ...mergeTexts(data?.value ?? null), [section]: parsed.data };
  const { error } = await supabase
    .from("site_content")
    .upsert({ key: TEXTS_KEY, value: JSON.stringify(next) }, { onConflict: "key" });
  if (error) return { ok: false, message: "Nije sačuvano. Pokušaj ponovo." };
  refreshContent("tekstovi");
  return { ok: true, message: messages[section] };
}
