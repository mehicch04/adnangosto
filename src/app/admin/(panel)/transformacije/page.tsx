import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { TRANSFORMATION_COLUMNS, type TransformationRow } from "@/lib/content/transformations";
import { imageSrc } from "@/lib/media";
import { TransformationsManager, type AdminTransformation } from "./TransformationsManager";

export const metadata: Metadata = { title: "Transformacije" };

export default async function TransformationsPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("transformations")
    .select(TRANSFORMATION_COLUMNS)
    .order("position");
  const items: AdminTransformation[] = ((data ?? []) as TransformationRow[]).map((r) => ({
    id: r.id,
    image: r.image ?? "",
    src: r.image ? imageSrc(r.image) : null,
    category: r.category,
    name: r.client_name ?? "",
    label: r.client_label ?? "",
    result: r.result ?? "",
    story: r.story ?? "",
    testimonial: r.testimonial ?? "",
    visible: r.is_active,
  }));

  return (
    <>
      <PageHeader
        title="Transformacije"
        description="Prije i poslije, s kratkom pričom i izjavom klijenta. Izmjene su na sajtu čim ih sačuvaš."
      />
      <TransformationsManager initial={items} />
    </>
  );
}
