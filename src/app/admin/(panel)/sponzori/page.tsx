import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { SPONSOR_COLUMNS, type SponsorRow } from "@/lib/content/sponsors";
import { imageSrc } from "@/lib/media";
import { SponsorsManager, type AdminSponsor } from "./SponsorsManager";

export const metadata: Metadata = { title: "Sponzori" };

export default async function SponsorsPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("sponsors").select(SPONSOR_COLUMNS).order("position");
  const items: AdminSponsor[] = ((data ?? []) as SponsorRow[]).map((r) => ({
    id: r.id,
    name: r.name,
    url: r.url ?? "",
    logo: r.logo_path ?? "",
    src: r.logo_path ? imageSrc(r.logo_path) : null,
    visible: r.is_active,
  }));

  return (
    <>
      <PageHeader
        title="Sponzori"
        description="Logotipi i linkovi aktualnih sponzora i suradnji. Sekcija se na sajtu pojavi čim je bar jedan vidljiv."
      />
      <SponsorsManager initial={items} />
    </>
  );
}
