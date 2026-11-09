export const statuses = [
  {
    id: "nova",
    label: "Nova",
    tone: "bg-brand-yellow text-brand-black",
    dot: "bg-brand-yellow",
  },
  { id: "u_obradi", label: "U obradi", tone: "bg-sky-400/15 text-sky-300", dot: "bg-sky-300" },
  {
    id: "prihvacena",
    label: "Prihvaćena",
    tone: "bg-emerald-400/15 text-emerald-300",
    dot: "bg-emerald-300",
  },
  { id: "odbijena", label: "Odbijena", tone: "bg-white/10 text-white/60", dot: "bg-white/40" },
] as const;

export type StatusId = (typeof statuses)[number]["id"];

export const statusIds = statuses.map((s) => s.id) as [StatusId, ...StatusId[]];

export function statusMeta(id: string) {
  return statuses.find((s) => s.id === id) ?? statuses[0];
}

export type ApplicationRow = {
  id: string;
  created_at: string;
  updated_at: string;
  package_name: string;
  package_slug: string | null;
  full_name: string;
  email: string;
  phone: string | null;
  status: StatusId;
  answers: { section?: string; question: string; answer: string }[];
  photos: string[] | null;
  admin_notes: string | null;
  archived_at: string | null;
};

const zone = "Europe/Sarajevo";

export const dateTime = new Intl.DateTimeFormat("bs-BA", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: zone,
});

export const dayMonth = new Intl.DateTimeFormat("bs-BA", {
  day: "numeric",
  month: "short",
  timeZone: zone,
});

export const dayKey = new Intl.DateTimeFormat("en-CA", { timeZone: zone });

export function initials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?"
  );
}

export function timeAgo(iso: string, now = Date.now()) {
  const min = Math.round((now - new Date(iso).getTime()) / 60000);
  if (min < 1) return "upravo";
  if (min < 60) return `prije ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `prije ${h} h`;
  const d = Math.round(h / 24);
  if (d === 1) return "jučer";
  if (d < 7) return `prije ${d} dana`;
  return dayMonth.format(new Date(iso));
}

export function phoneDigits(phone: string | null) {
  const d = phone?.replace(/[^\d+]/g, "") ?? "";
  return d.replace(/^\+/, "").replace(/^00/, "");
}

export function plural(n: number, forms: [string, string, string]) {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return forms[0];
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return forms[1];
  return forms[2];
}

export const prijavaForms: [string, string, string] = ["prijava", "prijave", "prijava"];
