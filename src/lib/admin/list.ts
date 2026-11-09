export type ListParams = {
  q: string;
  status: string | null;
  paket: string | null;
  sort: "novije" | "starije";
  arhiva: boolean;
};

export function listHref(p: ListParams, page = 1) {
  const sp = new URLSearchParams();
  if (p.q) sp.set("q", p.q);
  if (p.status) sp.set("status", p.status);
  if (p.paket) sp.set("paket", p.paket);
  if (p.sort === "starije") sp.set("sort", "starije");
  if (p.arhiva) sp.set("arhiva", "1");
  if (page > 1) sp.set("strana", String(page));
  const qs = sp.toString();
  return qs ? `/admin/prijave?${qs}` : "/admin/prijave";
}
