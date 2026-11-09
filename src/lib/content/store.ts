import "server-only";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";

export type ContentTag = "paketi" | "transformacije" | "tekstovi" | "pitanja" | "iskustva";

type Db = NonNullable<ReturnType<typeof createPublicClient>>;

export function cachedContent<T>(
  key: string,
  tag: ContentTag,
  load: (db: Db) => Promise<T | null | undefined>,
  fallback: T,
) {
  const cached = unstable_cache(
    async () => {
      const db = createPublicClient();
      if (!db) throw new Error("no-db");
      const value = await load(db);
      if (value === null || value === undefined) throw new Error("empty");
      return value;
    },
    ["content", tag, key],
    { tags: [tag], revalidate: 3600 },
  );
  return async () => {
    try {
      return await cached();
    } catch {
      return fallback;
    }
  };
}

export function refreshContent(...tags: ContentTag[]) {
  for (const tag of tags) revalidateTag(tag, { expire: 0 });
  revalidatePath("/", "layout");
}
