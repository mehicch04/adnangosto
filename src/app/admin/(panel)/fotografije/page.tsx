import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/ui";
import { GALLERY_KEY, defaultGallery, parseGallery } from "@/content/gallery";
import { requireAdmin } from "@/lib/admin/auth";
import { imageSrc } from "@/lib/media";
import { GalleryManager } from "./GalleryManager";

export const metadata: Metadata = { title: "Fotografije" };

export default async function PhotosPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("site_content")
    .select("value")
    .eq("key", GALLERY_KEY)
    .maybeSingle();
  const items = (parseGallery(data?.value ?? null) ?? defaultGallery).map((g) => ({
    ...g,
    src: imageSrc(g.path),
  }));

  return (
    <>
      <PageHeader
        title="Fotografije"
        description="Galerija na stranici O meni. Prva fotografija je najveća."
      />
      <GalleryManager initial={items} />
    </>
  );
}
