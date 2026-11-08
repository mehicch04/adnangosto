import { HeaderNav, type MenuPackage } from "@/components/sections/HeaderNav";
import { formatPrice, packages } from "@/content/packages";
import { contactLink } from "@/lib/contact";

export function SiteHeader() {
  const menu: MenuPackage[] = packages.map((p) => ({
    slug: p.slug,
    name: p.shortName,
    tagline: p.tagline,
    price: formatPrice(p.price),
    unit: p.priceUnit,
  }));

  return <HeaderNav packages={menu} chat={contactLink()} />;
}
