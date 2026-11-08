export const statuses = [
  { id: "nova", label: "Nova", tone: "bg-brand-yellow text-brand-black" },
  { id: "u_obradi", label: "U obradi", tone: "bg-sky-400/15 text-sky-300" },
  { id: "prihvacena", label: "Prihvaćena", tone: "bg-emerald-400/15 text-emerald-300" },
  { id: "odbijena", label: "Odbijena", tone: "bg-white/10 text-white/60" },
] as const;

export type StatusId = (typeof statuses)[number]["id"];

export function statusMeta(id: string) {
  return statuses.find((s) => s.id === id) ?? statuses[0];
}

export type ApplicationRow = {
  id: string;
  created_at: string;
  package_name: string;
  package_slug: string | null;
  full_name: string;
  email: string;
  phone: string | null;
  status: StatusId;
  answers: { section?: string; question: string; answer: string }[];
  photos: string[] | null;
  admin_notes: string | null;
};

export const dateTime = new Intl.DateTimeFormat("bs-BA", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Sarajevo",
});
