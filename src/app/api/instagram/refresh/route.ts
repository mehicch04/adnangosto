import { revalidateTag } from "next/cache";
import { getStoredToken, INSTAGRAM_TAG, saveToken } from "@/lib/instagram";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const token = await getStoredToken();
  if (!token) return Response.json({ ok: false, reason: "no-token" }, { status: 400 });

  const res = await fetch(
    `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${token}`,
    { cache: "no-store" },
  );
  if (!res.ok) return Response.json({ ok: false, status: res.status }, { status: 502 });

  const json = (await res.json()) as { access_token?: string; expires_in?: number };
  if (!json.access_token) return Response.json({ ok: false }, { status: 502 });

  await saveToken(json.access_token);
  revalidateTag(INSTAGRAM_TAG, { expire: 0 });
  return Response.json({ ok: true, expiresIn: json.expires_in });
}
