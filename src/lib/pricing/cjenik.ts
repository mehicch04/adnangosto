import "server-only";
import { PRICE_ANCHOR_DATE, PRICE_RANGE_NOTE } from "@/content/packages";
import { getPriceList } from "@/lib/content/packages";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/admin";

export type CjenikItem = {
  code: string;
  name: string;
  category: string;
  detail: string;
  unit: string;
  price: string;
  anchor: string;
};

export const ARCHIVE_DAYS = 30;

export function todayZagreb(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Zagreb" }).format(date);
}

function slug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "dj")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function currentItems(): Promise<CjenikItem[]> {
  const groups = await getPriceList();
  return groups.flatMap((g) =>
    g.items.map((i) => ({
      code: i.href ? i.href.split("/").pop()! : `${g.id}-${slug(i.name)}`,
      name: i.name,
      category: g.title,
      detail: i.detail ?? "",
      unit: i.unit ?? "",
      price: i.price,
      anchor: i.anchor ?? i.price,
    })),
  );
}

function amounts(value: string) {
  const nums =
    value.match(/\d[\d.]*(?:,\d+)?/g)?.map((n) => n.replace(/\./g, "").replace(",", ".")) ?? [];
  const from = nums[0] ?? "";
  const to = nums[1] ?? from;
  return { from, to };
}

const esc = (v: string) =>
  v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const tag = (name: string, value: string, pad: string) =>
  value ? `${pad}<${name}>${esc(value)}</${name}>\n` : `${pad}<${name}/>\n`;

export function toXml(day: string, items: CjenikItem[]) {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "https://adnangosto.com";
  const rows = items
    .map((i) => {
      const p = amounts(i.price);
      const a = amounts(i.anchor);
      const pad = "      ";
      return (
        "    <usluga>\n" +
        tag("sifra", i.code, pad) +
        tag("naziv", i.name, pad) +
        tag("kategorija", i.category, pad) +
        tag("opis", i.detail, pad) +
        tag("jedinica", i.unit, pad) +
        tag("cijena", i.price, pad) +
        tag("cijena_od", p.from, pad) +
        tag("cijena_do", p.to, pad) +
        tag("sidrena_cijena", i.anchor, pad) +
        tag("sidrena_cijena_od", a.from, pad) +
        tag("sidrena_cijena_do", a.to, pad) +
        "    </usluga>\n"
      );
    })
    .join("");
  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    "<cjenik>\n" +
    "  <pruzatelj>\n" +
    tag("naziv", "Adnan Gosto", "    ") +
    tag("web", site, "    ") +
    "  </pruzatelj>\n" +
    tag("datum", day, "  ") +
    tag("valuta", "EUR", "  ") +
    tag("pdv", "uključen", "  ") +
    tag("datum_sidrene_cijene", PRICE_ANCHOR_DATE, "  ") +
    "  <usluge>\n" +
    rows +
    "  </usluge>\n" +
    tag("napomena", PRICE_RANGE_NOTE, "  ") +
    "</cjenik>\n"
  );
}

export async function saveSnapshot(day: string, items: CjenikItem[]) {
  if (!isSupabaseConfigured()) return false;
  const { error } = await createAdminClient()
    .from("price_snapshots")
    .upsert({ day, items }, { onConflict: "day" });
  return !error;
}

export async function readSnapshot(day: string) {
  if (!isSupabaseConfigured()) return null;
  const { data } = await createAdminClient()
    .from("price_snapshots")
    .select("items")
    .eq("day", day)
    .maybeSingle();
  return (data?.items as CjenikItem[] | undefined) ?? null;
}

export async function archiveDays() {
  if (!isSupabaseConfigured()) return [] as string[];
  const { data } = await createAdminClient()
    .from("price_snapshots")
    .select("day")
    .order("day", { ascending: false })
    .limit(ARCHIVE_DAYS + 1);
  return (data ?? []).map((r) => r.day as string);
}

export function xmlResponse(body: string) {
  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "no-store" },
  });
}
