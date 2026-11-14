import { HeaderNav, type MenuPackage } from "@/components/sections/HeaderNav";
import { formatPrice, packageCompare } from "@/content/packages";
import { getPackages } from "@/lib/content/packages";
import { contactLink } from "@/lib/contact";

export async function SiteHeader() {
  const packages = await getPackages();
  const menu: MenuPackage[] = packages.map((p) => ({
    slug: p.slug,
    name: p.name,
    tag: packageCompare[p.slug].tag,
    audience: p.audience,
    features: p.cardFeatures,
    price: formatPrice(p.price),
    unit: p.priceUnit,
  }));

  return <HeaderNav packages={menu} chat={contactLink()} />;
}
