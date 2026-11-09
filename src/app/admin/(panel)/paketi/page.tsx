import Link from "next/link";
import { PageHeader } from "@/components/admin/ui";
import { extraPriceGroups, formatPrice, packages } from "@/content/packages";
import { requireAdmin } from "@/lib/admin/auth";
import {
  PACKAGE_COLUMNS,
  PRICE_LIST_KEY,
  mergePackage,
  parsePriceGroups,
  type PackageRow,
} from "@/lib/content/packages";
import { PackagesEditor, type EditorPackage } from "./PackagesEditor";
import { PriceListEditor } from "./PriceListEditor";

export const metadata = { title: "Paketi i cijene" };

const tabs = [
  { id: "paketi", label: "Paketi", href: "/admin/paketi" },
  { id: "cjenovnik", label: "Cjenovnik", href: "/admin/paketi?tab=cjenovnik" },
];

export default async function PackagesAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const active = tab === "cjenovnik" ? "cjenovnik" : "paketi";
  const { supabase } = await requireAdmin();
  const [{ data }, { data: content }] = await Promise.all([
    supabase.from("packages").select(PACKAGE_COLUMNS).order("position"),
    supabase.from("site_content").select("value").eq("key", PRICE_LIST_KEY).maybeSingle(),
  ]);
  const rows = (data ?? []) as PackageRow[];

  const list: EditorPackage[] = packages
    .map((base, i) => {
      const row = rows.find((r) => r.slug === base.slug);
      const p = mergePackage(base, row);
      return {
        position: row?.position ?? i + 1,
        item: {
          slug: p.slug,
          name: p.name,
          shortName: row ? (row.short_name ?? "") : p.shortName,
          badge: p.badge ?? "",
          tagline: p.tagline,
          audience: p.audience,
          price: p.price,
          priceUnit: p.priceUnit,
          priceNote: p.priceNote,
          checkIn: p.checkIn,
          features: p.cardFeatures,
          includes: p.includes,
          featured: row?.featured ?? false,
          visible: row?.is_active ?? true,
        },
      };
    })
    .sort((a, b) => a.position - b.position)
    .map((x) => x.item);

  const visible = list.filter((p) => p.visible);

  return (
    <>
      <PageHeader title="Paketi i cijene" description="Izmjene su na sajtu čim ih sačuvaš." />
      <nav
        aria-label="Paketi i cjenovnik"
        className="mt-6 inline-flex rounded-xl border border-white/[0.08] bg-white/[0.03] p-1"
      >
        {tabs.map((t) => (
          <Link
            key={t.id}
            href={t.href}
            aria-current={active === t.id ? "page" : undefined}
            className={`inline-flex h-9 items-center rounded-lg px-4 text-[13px] font-semibold transition-colors ${
              active === t.id ? "bg-white text-brand-black" : "text-white/60 hover:text-white"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </nav>

      {active === "paketi" ? (
        <PackagesEditor initial={list} />
      ) : (
        <PriceListEditor
          initial={parsePriceGroups(content?.value) ?? extraPriceGroups}
          defaults={extraPriceGroups}
          online={visible.map((p) => ({
            name: p.name,
            price: `${formatPrice(Number.isFinite(p.price) ? p.price : 0)} ${p.priceUnit}`,
          }))}
        />
      )}
    </>
  );
}
