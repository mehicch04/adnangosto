export type AdminNavItem = {
  href: string;
  label: string;
  icon: "inbox" | "package" | "images" | "text" | "form" | "settings";
  ready: boolean;
  keywords: string;
};

export const adminNav: AdminNavItem[] = [
  {
    href: "/admin",
    label: "Prijave",
    icon: "inbox",
    ready: true,
    keywords: "prijave klijenti upitnik",
  },
  {
    href: "/admin/paketi",
    label: "Paketi i cijene",
    icon: "package",
    ready: false,
    keywords: "paketi cijene cjenovnik",
  },
  {
    href: "/admin/transformacije",
    label: "Transformacije",
    icon: "images",
    ready: false,
    keywords: "slike prije poslije takmičari",
  },
  {
    href: "/admin/tekstovi",
    label: "Tekstovi",
    icon: "text",
    ready: false,
    keywords: "hero o meni pitanja kontakt",
  },
  {
    href: "/admin/upitnik",
    label: "Upitnik",
    icon: "form",
    ready: false,
    keywords: "pitanja forma prijava",
  },
  {
    href: "/admin/podesavanja",
    label: "Podešavanja",
    icon: "settings",
    ready: true,
    keywords: "lozinka nalog odjava",
  },
];

export function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin" || pathname.startsWith("/admin/prijave");
  return pathname === href || pathname.startsWith(`${href}/`);
}
