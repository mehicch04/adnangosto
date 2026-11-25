import { z } from "zod";
import { about, faq, hero, heroProof, site } from "@/content/site";

export const TEXTS_KEY = "tekstovi";

const line = (max: number) => z.string().trim().max(max, `Najviše ${max} znakova.`);

export const heroTextSchema = z.object({
  title: line(40).min(2, "Upiši naslov."),
  titleAccent: line(40),
  subtitle: line(320).min(10, "Podnaslov je prekratak."),
  proof: z.array(line(70).min(2, "Prazna činjenica.")).min(1).max(3),
});

export const aboutTextSchema = z.object({
  text: line(600).min(10, "Tekst je prekratak."),
});

export const faqTextSchema = z
  .array(
    z.object({
      q: line(160).min(3, "Upiši pitanje."),
      a: line(900).min(3, "Upiši odgovor."),
    }),
  )
  .max(16, "Najviše 16 pitanja.");

export const contactTextSchema = z.object({
  whatsapp: line(30).regex(/^[+\d\s()/-]*$/, "Broj smije imati samo brojke, razmake i +."),
});

export const shopTextSchema = z.object({
  url: z.union([z.literal(""), z.url("Link mora počinjati s https://").trim()]),
  code: line(30),
  discount: line(10),
});

export const termsTextSchema = z.object({
  body: line(40000),
});

export const textsSchema = z.object({
  hero: heroTextSchema,
  about: aboutTextSchema,
  faq: faqTextSchema,
  contact: contactTextSchema,
  shop: shopTextSchema,
  terms: termsTextSchema,
});

export type SiteTexts = z.infer<typeof textsSchema>;
export type TextsSection = keyof SiteTexts;

export const defaultTexts: SiteTexts = {
  hero: {
    title: hero.title,
    titleAccent: hero.titleAccent,
    subtitle: hero.subtitle,
    proof: [...heroProof],
  },
  about: { text: about.paragraphs[0] },
  faq: faq.map((f) => ({ q: f.q, a: f.a })),
  contact: { whatsapp: site.whatsapp ?? "" },
  shop: { url: site.shop.url ?? "", code: site.shop.code ?? "", discount: site.shop.discount },
  terms: { body: "" },
};

export function mergeTexts(raw: unknown): SiteTexts {
  let data: unknown = raw;
  if (typeof raw === "string") {
    try {
      data = JSON.parse(raw);
    } catch {
      data = null;
    }
  }
  const obj = data && typeof data === "object" ? (data as Record<string, unknown>) : {};
  const pick = <K extends TextsSection>(key: K): SiteTexts[K] => {
    const parsed = textsSchema.shape[key].safeParse(obj[key]);
    return parsed.success ? (parsed.data as SiteTexts[K]) : defaultTexts[key];
  };
  return {
    hero: pick("hero"),
    about: pick("about"),
    faq: pick("faq"),
    contact: pick("contact"),
    shop: pick("shop"),
    terms: pick("terms"),
  };
}

export type TermsBlock =
  { kind: "h"; text: string } | { kind: "p"; text: string } | { kind: "ul"; items: string[] };

export function termsBlocks(body: string): TermsBlock[] {
  return body
    .replace(/\r\n/g, "\n")
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean)
    .map((b): TermsBlock => {
      if (b.startsWith("# ")) return { kind: "h", text: b.slice(2).trim() };
      const lines = b.split("\n").map((l) => l.trim());
      if (lines.every((l) => l.startsWith("- ")))
        return { kind: "ul", items: lines.map((l) => l.slice(2).trim()) };
      return { kind: "p", text: lines.join(" ") };
    });
}
