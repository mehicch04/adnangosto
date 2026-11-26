import "server-only";
import { createHash } from "node:crypto";
import { PRICE_ANCHOR_DATE, PRICE_RANGE_NOTE } from "@/content/packages";
import { business } from "@/content/site";
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

export type Publication = { number: number; publishedAt: string; items: CjenikItem[] };

const zagrebParts = (iso: string) => {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Zagreb",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(new Date(iso))
      .map((p) => [p.type, p.value]),
  );
  return parts as Record<"year" | "month" | "day" | "hour" | "minute", string>;
};

export function csvFileName(pub: Pick<Publication, "number" | "publishedAt">) {
  const t = zagrebParts(pub.publishedAt);
  const id = business.mbo || "ADONI";
  return `${id}_ZA_SVA_PRODAJNA_MJESTA_USLUGE_${String(pub.number).padStart(6, "0")}_${t.year}${t.month}${t.day}_${t.hour}${t.minute}.csv`;
}

export function publishedLabel(iso: string) {
  const t = zagrebParts(iso);
  return `${Number(t.day)}. ${Number(t.month)}. ${t.year}. u ${t.hour}:${t.minute}`;
}

function money(value: string) {
  const { from, to } = amounts(value);
  const fmt = (n: string) => (n ? Number(n).toFixed(2).replace(".", ",") : "");
  return from === to ? fmt(from) : `${fmt(from)} do ${fmt(to)}`;
}

const cell = (v: string) => (/[;"\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);

export function toCsv(items: CjenikItem[]) {
  const rows = items.map((i) =>
    [
      i.unit ? `${i.name} (${i.unit})` : [i.name, i.detail].filter(Boolean).join(", "),
      money(i.price),
      "",
      money(i.anchor),
    ]
      .map(cell)
      .join(";"),
  );
  return (
    ["naziv;maloprodajna_cijena;posebni_oblik_prodaje;bazna_cijena", ...rows].join("\r\n") + "\r\n"
  );
}

const fingerprint = (items: CjenikItem[]) =>
  createHash("sha256").update(JSON.stringify(items)).digest("hex");

type Row = { number: number; published_at: string; items: CjenikItem[] };
const toPub = (r: Row): Publication => ({
  number: Number(r.number),
  publishedAt: r.published_at,
  items: r.items,
});

export async function publishIfChanged(): Promise<Publication | null> {
  const items = await currentItems();
  if (!isSupabaseConfigured()) return { number: 1, publishedAt: new Date().toISOString(), items };
  const db = createAdminClient();
  const fp = fingerprint(items);
  const { data: last } = await db
    .from("price_publications")
    .select("number, published_at, items, fingerprint")
    .order("number", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (last && last.fingerprint === fp) return toPub(last as Row);
  const { data, error } = await db
    .from("price_publications")
    .insert({ fingerprint: fp, items })
    .select("number, published_at, items")
    .single();
  if (error) return last ? toPub(last as Row) : null;
  return toPub(data as Row);
}

export async function publicationByNumber(number: number) {
  if (!isSupabaseConfigured()) return null;
  const { data } = await createAdminClient()
    .from("price_publications")
    .select("number, published_at, items")
    .eq("number", number)
    .maybeSingle();
  return data ? toPub(data as Row) : null;
}

export async function recentPublications(): Promise<Publication[]> {
  if (!isSupabaseConfigured()) return [];
  const since = new Date(Date.now() - ARCHIVE_DAYS * 86_400_000).toISOString();
  const { data: recent } = await createAdminClient()
    .from("price_publications")
    .select("number, published_at, items")
    .gte("published_at", since)
    .order("number", { ascending: false });
  const list = ((recent ?? []) as Row[]).map(toPub);
  const { data: last } = await createAdminClient()
    .from("price_publications")
    .select("number, published_at, items")
    .order("number", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (last && !list.some((p) => p.number === Number(last.number))) list.unshift(toPub(last as Row));
  return list;
}

export function csvResponse(body: string, fileName: string) {
  return new Response(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `inline; filename="${fileName}"`,
      "Cache-Control": "no-store",
    },
  });
}
