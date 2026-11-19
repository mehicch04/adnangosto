import { ARCHIVE_DAYS, readSnapshot, todayZagreb, toXml, xmlResponse } from "@/lib/pricing/cjenik";

export const dynamic = "force-dynamic";

export async function GET(_: Request, { params }: { params: Promise<{ datum: string }> }) {
  const { datum } = await params;
  const day = datum.replace(/\.xml$/, "");
  const oldest = todayZagreb(new Date(Date.now() - ARCHIVE_DAYS * 86_400_000));
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || day < oldest || day > todayZagreb())
    return new Response("Cjenik za taj datum nije dostupan.", { status: 404 });
  const items = await readSnapshot(day);
  if (!items) return new Response("Cjenik za taj datum nije dostupan.", { status: 404 });
  return xmlResponse(toXml(day, items));
}
