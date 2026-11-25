import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/admin/ui";
import { TEXTS_KEY, defaultTexts, mergeTexts, type TextsSection } from "@/content/texts";
import { requireAdmin } from "@/lib/admin/auth";
import { TextsEditor } from "./TextsEditor";

export const metadata: Metadata = { title: "Tekstovi" };

const tabs: { id: TextsSection | "kontakt"; label: string }[] = [
  { id: "hero", label: "Naslovna" },
  { id: "about", label: "O meni" },
  { id: "faq", label: "Česta pitanja" },
  { id: "kontakt", label: "Kontakt i shop" },
  { id: "terms", label: "Opći uvjeti" },
];

export default async function TextsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const active = tabs.find((t) => t.id === tab)?.id ?? "hero";
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("site_content")
    .select("value")
    .eq("key", TEXTS_KEY)
    .maybeSingle();
  const texts = data ? mergeTexts(data.value) : defaultTexts;

  return (
    <>
      <PageHeader title="Tekstovi" description="Izmjene su na sajtu čim ih sačuvaš." />
      <nav
        aria-label="Dijelovi sajta"
        className="-mx-4 mt-6 overflow-x-auto px-4 sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
      >
        <div className="inline-flex rounded-xl border border-white/[0.08] bg-white/[0.03] p-1">
          {tabs.map((t) => (
            <Link
              key={t.id}
              href={`/admin/tekstovi?tab=${t.id}`}
              aria-current={active === t.id ? "page" : undefined}
              className={`inline-flex h-9 items-center rounded-lg px-4 text-[13px] font-semibold whitespace-nowrap transition-colors ${
                active === t.id ? "bg-white text-brand-black" : "text-white/60 hover:text-white"
              }`}
            >
              {t.label}
            </Link>
          ))}
        </div>
      </nav>
      <TextsEditor key={active} tab={active} initial={texts} defaults={defaultTexts} />
    </>
  );
}
