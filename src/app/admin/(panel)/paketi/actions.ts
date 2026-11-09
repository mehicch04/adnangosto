"use server";

import { z } from "zod";
import type { ActionResult } from "@/app/admin/actions";
import { packages } from "@/content/packages";
import { requireAdmin } from "@/lib/admin/auth";
import { refreshContent } from "@/lib/content/store";
import { PRICE_LIST_KEY, priceGroupsSchema } from "@/lib/content/packages";

type Db = Awaited<ReturnType<typeof requireAdmin>>["supabase"];

const slugs = packages.map((p) => p.slug) as [string, ...string[]];
const fail = (message: string): ActionResult => ({ ok: false, message });

async function ensureRows(db: Db) {
  const { data, error } = await db.from("packages").select("slug");
  if (error) return false;
  const have = new Set((data ?? []).map((r) => r.slug as string));
  const missing = packages.flatMap((p, i) =>
    have.has(p.slug)
      ? []
      : [
          {
            slug: p.slug,
            name: p.name,
            short_name: p.shortName,
            badge: p.badge ?? null,
            tagline: p.tagline,
            audience: p.audience,
            price: p.price,
            price_unit: p.priceUnit,
            price_note: p.priceNote,
            check_in: p.checkIn,
            features: p.cardFeatures,
            includes: p.includes,
            position: i + 1,
          },
        ],
  );
  if (!missing.length) return true;
  const { error: insertError } = await db
    .from("packages")
    .upsert(missing, { onConflict: "slug", ignoreDuplicates: true });
  return !insertError;
}

const text = (max: number) => z.string().trim().max(max);

const packageSchema = z.object({
  slug: z.enum(slugs),
  name: text(60).min(2, "Upiši naziv paketa."),
  shortName: text(40),
  badge: text(30),
  tagline: text(220).min(10, "Kratki opis je prekratak."),
  audience: text(220).min(10, "Napiši kome je paket namijenjen."),
  price: z.coerce
    .number("Cijena mora biti broj.")
    .int("Cijena mora biti cijeli broj.")
    .min(0)
    .max(100000),
  priceUnit: text(40).min(2, "Upiši uz cijenu, npr. mjesečno."),
  priceNote: text(120),
  checkIn: text(60).min(2, "Upiši ritam check-ina."),
  features: z.array(text(120).min(1)).min(1, "Kartica treba bar jednu stavku.").max(6),
  includes: z
    .array(z.object({ title: text(80).min(1), text: text(400).min(1) }))
    .min(1, "Dodaj bar jednu stavku u Šta dobijaš.")
    .max(8),
});

export type PackageInput = z.input<typeof packageSchema>;

export async function savePackage(input: PackageInput): Promise<ActionResult> {
  const parsed = packageSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Provjeri polja.");
  const { supabase } = await requireAdmin();
  if (!(await ensureRows(supabase))) return fail("Baza nije dostupna. Pokušaj ponovo.");
  const p = parsed.data;
  const { error } = await supabase
    .from("packages")
    .update({
      name: p.name,
      short_name: p.shortName || null,
      badge: p.badge || null,
      tagline: p.tagline,
      audience: p.audience,
      price: p.price,
      price_unit: p.priceUnit,
      price_note: p.priceNote || null,
      check_in: p.checkIn,
      features: p.features,
      includes: p.includes,
    })
    .eq("slug", p.slug);
  if (error) return fail("Izmjene nisu sačuvane. Pokušaj ponovo.");
  refreshContent("paketi");
  return { ok: true, message: `${p.name} je sačuvan i već je na sajtu.` };
}

export async function savePackageOrder(order: string[]): Promise<ActionResult> {
  const parsed = z.array(z.enum(slugs)).length(slugs.length).safeParse(order);
  if (!parsed.success || new Set(parsed.data).size !== slugs.length)
    return fail("Neispravan redoslijed.");
  const { supabase } = await requireAdmin();
  if (!(await ensureRows(supabase))) return fail("Baza nije dostupna. Pokušaj ponovo.");
  const results = await Promise.all(
    parsed.data.map((slug, i) =>
      supabase
        .from("packages")
        .update({ position: i + 1 })
        .eq("slug", slug),
    ),
  );
  if (results.some((r) => r.error)) return fail("Redoslijed nije sačuvan.");
  refreshContent("paketi");
  return { ok: true, message: "Redoslijed je sačuvan." };
}

export async function setPackageVisible(slug: string, visible: boolean): Promise<ActionResult> {
  if (!z.enum(slugs).safeParse(slug).success) return fail("Nepoznat paket.");
  const { supabase } = await requireAdmin();
  if (!(await ensureRows(supabase))) return fail("Baza nije dostupna. Pokušaj ponovo.");
  if (!visible) {
    const { count } = await supabase
      .from("packages")
      .select("slug", { count: "exact", head: true })
      .eq("is_active", true)
      .neq("slug", slug);
    if (!count) return fail("Bar jedan paket mora ostati vidljiv.");
  }
  const { error } = await supabase
    .from("packages")
    .update({ is_active: visible, ...(visible ? {} : { featured: false }) })
    .eq("slug", slug);
  if (error) return fail("Promjena nije sačuvana.");
  refreshContent("paketi");
  return {
    ok: true,
    message: visible ? "Paket je ponovo vidljiv na sajtu." : "Paket je sakriven sa sajta.",
  };
}

export async function setPackageFeatured(slug: string, featured: boolean): Promise<ActionResult> {
  if (!z.enum(slugs).safeParse(slug).success) return fail("Nepoznat paket.");
  const { supabase } = await requireAdmin();
  if (!(await ensureRows(supabase))) return fail("Baza nije dostupna. Pokušaj ponovo.");
  if (featured) {
    const { error } = await supabase.from("packages").update({ featured: false }).neq("slug", slug);
    if (error) return fail("Promjena nije sačuvana.");
  }
  const { error } = await supabase
    .from("packages")
    .update({ featured, ...(featured ? { is_active: true } : {}) })
    .eq("slug", slug);
  if (error) return fail("Promjena nije sačuvana.");
  refreshContent("paketi");
  return {
    ok: true,
    message: featured ? "Paket je označen kao najpopularniji." : "Oznaka je skinuta.",
  };
}

export async function savePriceList(groups: unknown): Promise<ActionResult> {
  const parsed = priceGroupsSchema.safeParse(groups);
  if (!parsed.success) return fail("Provjeri cjenovnik: svaka stavka treba naziv i cijenu.");
  const clean = parsed.data.map((g) => ({
    ...g,
    items: g.items.map((i) => ({
      name: i.name,
      price: i.price,
      ...(i.detail ? { detail: i.detail } : {}),
      ...(i.unit ? { unit: i.unit } : {}),
    })),
  }));
  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from("site_content")
    .upsert({ key: PRICE_LIST_KEY, value: JSON.stringify(clean) }, { onConflict: "key" });
  if (error) return fail("Cjenovnik nije sačuvan. Pokušaj ponovo.");
  refreshContent("paketi");
  return { ok: true, message: "Cjenovnik je sačuvan i već je na sajtu." };
}
