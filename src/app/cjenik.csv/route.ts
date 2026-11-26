import { csvFileName, publishIfChanged } from "@/lib/pricing/cjenik";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const pub = await publishIfChanged();
  if (!pub) return new Response("Cjenik trenutno nije dostupan.", { status: 503 });
  return Response.redirect(new URL(`/cjenik/${csvFileName(pub)}`, request.url), 302);
}
