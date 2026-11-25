import "server-only";
import { isStoredMedia, MEDIA_BUCKET } from "@/lib/media";
import type { requireAdmin } from "@/lib/admin/auth";

type Db = Awaited<ReturnType<typeof requireAdmin>>["supabase"];

export async function removeMedia(db: Db, paths: (string | null | undefined)[]) {
  const stored = paths.filter(isStoredMedia);
  if (stored.length) await db.storage.from(MEDIA_BUCKET).remove(stored);
}

export const uploadedPath = (folder: string) => new RegExp(`^${folder}/[0-9a-f-]{36}\\.(jpg|png)$`);
