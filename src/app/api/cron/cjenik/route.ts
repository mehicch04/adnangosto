import { currentItems, saveSnapshot, todayZagreb } from "@/lib/pricing/cjenik";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`)
    return new Response("Unauthorized", { status: 401 });
  const day = todayZagreb();
  const ok = await saveSnapshot(day, await currentItems());
  return Response.json({ ok, day }, { status: ok ? 200 : 500 });
}
