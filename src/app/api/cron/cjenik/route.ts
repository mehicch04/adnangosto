import { currentItems, publishIfChanged, saveSnapshot, todayZagreb } from "@/lib/pricing/cjenik";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`)
    return new Response("Unauthorized", { status: 401 });
  const day = todayZagreb();
  const [ok, pub] = await Promise.all([
    currentItems().then((items) => saveSnapshot(day, items)),
    publishIfChanged(),
  ]);
  return Response.json(
    { ok: ok && Boolean(pub), day, number: pub?.number },
    { status: ok && pub ? 200 : 500 },
  );
}
