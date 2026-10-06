import "server-only";
import { instagramFallback, site } from "@/content/site";

export type InstagramKind = "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";

export type InstagramPost = {
  id: string;
  src: string;
  alt: string;
  caption: string | null;
  href: string;
  kind: InstagramKind;
  date: string | null;
  remote: boolean;
};

type BeholdSize = { mediaUrl?: string };

type BeholdPost = {
  id: string;
  permalink: string;
  timestamp?: string;
  mediaType: InstagramKind;
  mediaUrl?: string;
  thumbnailUrl?: string;
  caption?: string;
  prunedCaption?: string;
  sizes?: { small?: BeholdSize; medium?: BeholdSize; large?: BeholdSize };
};

function fallbackPosts(limit: number): InstagramPost[] {
  return instagramFallback.slice(0, limit).map((p, i) => ({
    id: `local-${i}`,
    src: p.src,
    alt: p.alt,
    caption: null,
    href: site.instagram,
    kind: "IMAGE",
    date: null,
    remote: false,
  }));
}

function clean(caption?: string) {
  if (!caption) return null;
  const text = caption.replace(/#\S+/g, "").replace(/\s+/g, " ").trim();
  return text || null;
}

export async function getInstagramPosts(limit = 6): Promise<InstagramPost[]> {
  const feedUrl = process.env.BEHOLD_FEED_URL;
  if (!feedUrl) return fallbackPosts(limit);

  try {
    const res = await fetch(feedUrl, { next: { revalidate: 3600 } });
    if (!res.ok) return fallbackPosts(limit);
    const json = (await res.json()) as BeholdPost[] | { posts?: BeholdPost[] };
    const items = Array.isArray(json) ? json : (json.posts ?? []);
    const posts = items
      .map((m): InstagramPost | null => {
        const src =
          m.sizes?.medium?.mediaUrl ??
          m.sizes?.large?.mediaUrl ??
          (m.mediaType === "VIDEO" ? m.thumbnailUrl : m.mediaUrl);
        if (!src) return null;
        const caption = clean(m.prunedCaption ?? m.caption);
        return {
          id: m.id,
          src,
          alt: caption?.slice(0, 120) ?? "Objava s Instagrama",
          caption,
          href: m.permalink,
          kind: m.mediaType,
          date: m.timestamp ?? null,
          remote: true,
        };
      })
      .filter((p): p is InstagramPost => p !== null)
      .slice(0, limit);
    return posts.length ? posts : fallbackPosts(limit);
  } catch {
    return fallbackPosts(limit);
  }
}
