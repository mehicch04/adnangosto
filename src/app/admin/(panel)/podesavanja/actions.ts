"use server";

import type { ActionResult } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/admin/auth";
import {
  BACKUP_BUCKET,
  listBackups,
  makeBackup,
  pruneBackups,
  type BackupFile,
} from "@/lib/maintenance";
import { todayZagreb } from "@/lib/pricing/cjenik";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/admin";

export async function backupNow(): Promise<ActionResult & { files?: BackupFile[] }> {
  await requireAdmin();
  if (!isSupabaseConfigured()) return { ok: false, message: "Baza nije povezana." };
  const db = createAdminClient();
  try {
    const day = todayZagreb();
    await makeBackup(db, day);
    await pruneBackups(db, day);
    return { ok: true, message: "Kopija je napravljena.", files: await listBackups(db) };
  } catch {
    return { ok: false, message: "Kopija nije napravljena. Pokušaj ponovo." };
  }
}

export async function backupLink(name: string): Promise<ActionResult & { url?: string }> {
  await requireAdmin();
  if (!/^\d{4}-\d{2}-\d{2}\.json$/.test(name)) return { ok: false, message: "Nepoznata kopija." };
  if (!isSupabaseConfigured()) return { ok: false, message: "Baza nije povezana." };
  const { data, error } = await createAdminClient()
    .storage.from(BACKUP_BUCKET)
    .createSignedUrl(name, 60, { download: `adnangosto-kopija-${name}` });
  if (error || !data) return { ok: false, message: "Kopiju nije moguće preuzeti." };
  return { ok: true, message: "", url: data.signedUrl };
}
