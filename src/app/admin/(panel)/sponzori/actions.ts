"use server";

import { z } from "zod";
import type { ActionResult } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/admin/auth";
import { removeMedia, uploadedPath } from "@/lib/admin/media";
import { refreshContent } from "@/lib/content/store";

const fail = (message: string): ActionResult => ({ ok: false, message });

const schema = z.object({
  id: z.uuid().optional(),
  name: z.string().trim().min(2, "Upiši naziv sponzora.").max(60, "Najviše 60 znakova."),
  url: z.union([z.literal(""), z.url("Link mora počinjati s https://").trim().max(300)]),
  logo: z.union([z.literal(""), z.string().regex(uploadedPath("sponzori"), "Logo nije ispravan.")]),
  visible: z.boolean(),
});

export type SponsorInput = z.input<typeof schema>;

export async function saveSponsor(input: SponsorInput): Promise<ActionResult & { id?: string }> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Provjeri polja.");
  const s = parsed.data;
  const { supabase } = await requireAdmin();
  const row = { name: s.name, url: s.url || null, logo_path: s.logo || null, is_active: s.visible };

  if (s.id) {
    const { data: prev } = await supabase
      .from("sponsors")
      .select("logo_path")
      .eq("id", s.id)
      .maybeSingle();
    if (!prev) return fail("Sponzor više ne postoji.");
    const { error } = await supabase.from("sponsors").update(row).eq("id", s.id);
    if (error) return fail("Izmjene nisu sačuvane. Pokušaj ponovo.");
    if (prev.logo_path && prev.logo_path !== row.logo_path)
      await removeMedia(supabase, [prev.logo_path]);
    refreshContent("sponzori");
    return { ok: true, message: "Sačuvano. Izmjena je već na sajtu.", id: s.id };
  }

  const { data: last } = await supabase
    .from("sponsors")
    .select("position")
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();
  const { data, error } = await supabase
    .from("sponsors")
    .insert({ ...row, position: (last?.position ?? 0) + 1 })
    .select("id")
    .single();
  if (error) return fail("Sponzor nije dodan. Pokušaj ponovo.");
  refreshContent("sponzori");
  return {
    ok: true,
    message: s.visible ? "Sponzor je dodan na sajt." : "Dodan kao skriven.",
    id: data.id,
  };
}

export async function deleteSponsor(id: string): Promise<ActionResult> {
  if (!z.uuid().safeParse(id).success) return fail("Nepoznat sponzor.");
  const { supabase } = await requireAdmin();
  const { data: prev } = await supabase
    .from("sponsors")
    .select("logo_path")
    .eq("id", id)
    .maybeSingle();
  const { error } = await supabase.from("sponsors").delete().eq("id", id);
  if (error) return fail("Brisanje nije uspjelo.");
  await removeMedia(supabase, [prev?.logo_path]);
  refreshContent("sponzori");
  return { ok: true, message: "Sponzor je obrisan." };
}

export async function setSponsorVisible(id: string, visible: boolean): Promise<ActionResult> {
  if (!z.uuid().safeParse(id).success) return fail("Nepoznat sponzor.");
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("sponsors").update({ is_active: visible }).eq("id", id);
  if (error) return fail("Promjena nije sačuvana.");
  refreshContent("sponzori");
  return { ok: true, message: visible ? "Sponzor je na sajtu." : "Sponzor je sakriven." };
}

export async function saveSponsorOrder(ids: string[]): Promise<ActionResult> {
  const parsed = z.array(z.uuid()).max(100).safeParse(ids);
  if (!parsed.success) return fail("Neispravan redoslijed.");
  const { supabase } = await requireAdmin();
  const results = await Promise.all(
    parsed.data.map((id, i) =>
      supabase
        .from("sponsors")
        .update({ position: i + 1 })
        .eq("id", id),
    ),
  );
  if (results.some((r) => r.error)) return fail("Redoslijed nije sačuvan.");
  refreshContent("sponzori");
  return { ok: true, message: "Redoslijed je sačuvan." };
}
