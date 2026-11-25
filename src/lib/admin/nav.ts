export type AdminNavItem = {
  href: string;
  label: string;
  icon: "home" | "inbox" | "package" | "compare" | "badge" | "text" | "images" | "settings";
  ready: boolean;
  keywords: string;
};

export const adminNav: AdminNavItem[] = [
  {
    href: "/admin",
    label: "Pregled",
    icon: "home",
    ready: true,
    keywords: "pocetna statistika pregled",
  },
  {
    href: "/admin/prijave",
    label: "Prijave",
    icon: "inbox",
    ready: true,
    keywords: "prijave klijenti upitnik nove",
  },
  {
    href: "/admin/paketi",
    label: "Paketi i cijene",
    icon: "package",
    ready: true,
    keywords: "paketi cijene cjenik cjenovnik",
  },
  {
    href: "/admin/transformacije",
    label: "Transformacije",
    icon: "compare",
    ready: true,
    keywords: "slike prije poslije natjecatelji izjave iskustva",
  },
  {
    href: "/admin/sponzori",
    label: "Sponzori",
    icon: "badge",
    ready: true,
    keywords: "sponzori suradnje logotipi partneri",
  },
  {
    href: "/admin/tekstovi",
    label: "Tekstovi",
    icon: "text",
    ready: true,
    keywords: "naslovna o meni pitanja whatsapp shop uvjeti",
  },
  {
    href: "/admin/fotografije",
    label: "Fotografije",
    icon: "images",
    ready: true,
    keywords: "galerija slike fotografije",
  },
  {
    href: "/admin/podesavanja",
    label: "Podešavanja",
    icon: "settings",
    ready: true,
    keywords: "lozinka nalog odjava kopije",
  },
];

export function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}
