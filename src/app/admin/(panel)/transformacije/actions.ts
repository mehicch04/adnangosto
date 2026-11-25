"use server";

import { z } from "zod";
import type { ActionResult } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/admin/auth";
import { removeMedia, uploadedPath } from "@/lib/admin/media";
import { refreshContent } from "@/lib/content/store";

const fail = (message: string): ActionResult => ({ ok: false, message });
const text = (max: number) => z.string().trim().max(max, `Najviše ${max} znakova.`);

const image = z
  .string()
  .trim()
  .refine(
    (v) =>
      /^\/images\/transformacije\/[\w-]+\.(jpg|jpeg|png|webp)$/.test(v) ||
      uploadedPath("transformacije").test(v),
    "Dodaj fotografiju.",
  );

const schema = z.object({
  id: z.uuid().optional(),
  image,
  category: z.enum(["rekreativci", "takmicari"]),
  name: text(60),
  label: text(80),
  result: text(60),
  story: text(400),
  testimonial: text(500),
  visible: z.boolean(),
});

export type TransformationInput = z.input<typeof schema>;

export async function saveTransformation(
  input: TransformationInput,
): Promise<ActionResult & { id?: string }> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Provjeri polja.");
  const t = parsed.data;
  const { supabase } = await requireAdmin();
  const row = {
    image: t.image,
    category: t.category,
    client_name: t.name || null,
    client_label: t.label || null,
    result: t.result || null,
    story: t.story || null,
    testimonial: t.testimonial || null,
    is_active: t.visible,
  };

  if (t.id) {
    const { data: prev } = await supabase
      .from("transformations")
      .select("image")
      .eq("id", t.id)
      .maybeSingle();
    if (!prev) return fail("Transformacija više ne postoji.");
    const { error } = await supabase.from("transformations").update(row).eq("id", t.id);
    if (error) return fail("Izmjene nisu sačuvane. Pokušaj ponovo.");
    if (prev.image && prev.image !== t.image) await removeMedia(supabase, [prev.image]);
    refreshContent("transformacije");
    return { ok: true, message: "Sačuvano. Izmjena je već na sajtu.", id: t.id };
  }

  const { data: first } = await supabase
    .from("transformations")
    .select("position")
    .order("position")
    .limit(1)
    .maybeSingle();
  const { data, error } = await supabase
    .from("transformations")
    .insert({ ...row, position: (first?.position ?? 1) - 1 })
    .select("id")
    .single();
  if (error) return fail("Transformacija nije dodana. Pokušaj ponovo.");
  refreshContent("transformacije");
  return {
    ok: true,
    message: t.visible ? "Dodano. Transformacija je već na sajtu." : "Dodano kao skriveno.",
    id: data.id,
  };
}

export async function deleteTransformation(id: string): Promise<ActionResult> {
  if (!z.uuid().safeParse(id).success) return fail("Nepoznata transformacija.");
  const { supabase } = await requireAdmin();
  const { data: prev } = await supabase
    .from("transformations")
    .select("image")
    .eq("id", id)
    .maybeSingle();
  const { error } = await supabase.from("transformations").delete().eq("id", id);
  if (error) return fail("Brisanje nije uspjelo.");
  await removeMedia(supabase, [prev?.image]);
  refreshContent("transformacije");
  return { ok: true, message: "Transformacija je obrisana." };
}

export async function setTransformationVisible(
  id: string,
  visible: boolean,
): Promise<ActionResult> {
  if (!z.uuid().safeParse(id).success) return fail("Nepoznata transformacija.");
  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from("transformations")
    .update({ is_active: visible })
    .eq("id", id);
  if (error) return fail("Promjena nije sačuvana.");
  refreshContent("transformacije");
  return { ok: true, message: visible ? "Vidljivo na sajtu." : "Sakriveno sa sajta." };
}

export async function saveTransformationOrder(ids: string[]): Promise<ActionResult> {
  const parsed = z.array(z.uuid()).max(500).safeParse(ids);
  if (!parsed.success) return fail("Neispravan redoslijed.");
  const { supabase } = await requireAdmin();
  const results = await Promise.all(
    parsed.data.map((id, i) =>
      supabase
        .from("transformations")
        .update({ position: i + 1 })
        .eq("id", id),
    ),
  );
  if (results.some((r) => r.error)) return fail("Redoslijed nije sačuvan.");
  refreshContent("transformacije");
  return { ok: true, message: "Redoslijed je sačuvan." };
}
