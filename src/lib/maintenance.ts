import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { APPLICATIONS_BUCKET } from "@/lib/supabase/bucket";

export const BACKUP_BUCKET = "kopije";
export const BACKUP_DAYS = 7;
export const UNSTARTED_RETENTION_DAYS = 183;

const TABLES = [
  "applications",
  "packages",
  "package_questions",
  "transformations",
  "sponsors",
  "site_content",
  "price_snapshots",
  "price_publications",
] as const;

const DAY = 86_400_000;
const backupName = /^(\d{4}-\d{2}-\d{2})\.json$/;

export type BackupFile = { name: string; day: string; size: number };

export async function makeBackup(db: SupabaseClient, day: string) {
  const tables: Record<string, unknown[]> = {};
  for (const table of TABLES) {
    const { data, error } = await db.from(table).select("*").limit(20000);
    if (error) throw new Error(`${table}: ${error.message}`);
    tables[table] = data ?? [];
  }
  const body = JSON.stringify({ created_at: new Date().toISOString(), tables });
  const { error } = await db.storage
    .from(BACKUP_BUCKET)
    .upload(`${day}.json`, new Blob([body], { type: "application/json" }), {
      contentType: "application/json",
      upsert: true,
    });
  if (error) throw new Error(error.message);
  return { day, bytes: body.length, rows: Object.values(tables).reduce((n, t) => n + t.length, 0) };
}

export async function listBackups(db: SupabaseClient): Promise<BackupFile[]> {
  const { data } = await db.storage
    .from(BACKUP_BUCKET)
    .list("", { limit: 100, sortBy: { column: "name", order: "desc" } });
  return (data ?? []).flatMap((f) => {
    const m = backupName.exec(f.name);
    return m ? [{ name: f.name, day: m[1], size: Number(f.metadata?.size ?? 0) }] : [];
  });
}

export async function pruneBackups(db: SupabaseClient, today: string) {
  const limit = Date.parse(`${today}T00:00:00Z`) - (BACKUP_DAYS - 1) * DAY;
  const old = (await listBackups(db)).filter((b) => Date.parse(`${b.day}T00:00:00Z`) < limit);
  if (old.length) await db.storage.from(BACKUP_BUCKET).remove(old.map((b) => b.name));
  return old.length;
}

export async function purgeUnstartedApplications(db: SupabaseClient) {
  const cutoff = new Date(Date.now() - UNSTARTED_RETENTION_DAYS * DAY).toISOString();
  const { data, error } = await db
    .from("applications")
    .select("id, photos")
    .neq("status", "prihvacena")
    .lt("created_at", cutoff)
    .limit(500);
  if (error || !data?.length) return 0;
  const photos = data.flatMap((a) => (a.photos as string[] | null) ?? []);
  if (photos.length) await db.storage.from(APPLICATIONS_BUCKET).remove(photos);
  const { error: deleteError } = await db
    .from("applications")
    .delete()
    .in(
      "id",
      data.map((a) => a.id),
    );
  return deleteError ? 0 : data.length;
}
