import { makeBackup, pruneBackups, purgeUnstartedApplications } from "@/lib/maintenance";
import { todayZagreb } from "@/lib/pricing/cjenik";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`)
    return new Response("Unauthorized", { status: 401 });
  if (!isSupabaseConfigured()) return Response.json({ ok: false }, { status: 503 });
  const db = createAdminClient();
  const day = todayZagreb();
  try {
    const purged = await purgeUnstartedApplications(db);
    const backup = await makeBackup(db, day);
    const pruned = await pruneBackups(db, day);
    return Response.json({ ok: true, backup, pruned, purged });
  } catch (e) {
    console.error("odrzavanje", e);
    return Response.json({ ok: false }, { status: 500 });
  }
}
