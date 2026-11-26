import {
  ARCHIVE_DAYS,
  csvFileName,
  csvResponse,
  publicationByNumber,
  readSnapshot,
  toCsv,
  todayZagreb,
  toXml,
  xmlResponse,
} from "@/lib/pricing/cjenik";

export const dynamic = "force-dynamic";

const notFound = () => new Response("Cjenik nije dostupan.", { status: 404 });

export async function GET(_: Request, { params }: { params: Promise<{ datum: string }> }) {
  const { datum } = await params;
  const csv = /_(\d{6})_\d{8}_\d{4}\.csv$/.exec(datum);
  if (csv) {
    const pub = await publicationByNumber(Number(csv[1]));
    if (!pub || csvFileName(pub) !== datum) return notFound();
    return csvResponse(toCsv(pub.items), datum);
  }
  const day = datum.replace(/\.xml$/, "");
  const oldest = todayZagreb(new Date(Date.now() - ARCHIVE_DAYS * 86_400_000));
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || day < oldest || day > todayZagreb()) return notFound();
  const items = await readSnapshot(day);
  if (!items) return notFound();
  return xmlResponse(toXml(day, items));
}
