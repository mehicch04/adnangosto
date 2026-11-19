import { currentItems, saveSnapshot, todayZagreb, toXml, xmlResponse } from "@/lib/pricing/cjenik";

export const dynamic = "force-dynamic";

export async function GET() {
  const day = todayZagreb();
  const items = await currentItems();
  await saveSnapshot(day, items);
  return xmlResponse(toXml(day, items));
}
