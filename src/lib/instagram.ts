import "server-only";
import { instagramFallback, site } from "@/content/site";

export type InstagramPost = { id: string; src: string; alt: string; href: string; remote: boolean };

type ApiMedia = {
  id: string;
  caption?: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
};

export async function getInstagramPosts(limit = 6): Promise<InstagramPost[]> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const fallback = instagramFallback.slice(0, limit).map((p, i) => ({
    id: `local-${i}`,
    src: p.src,
    alt: p.alt,
    href: site.instagram,
    remote: false,
  }));
  if (!token) return fallback;

  try {
    const res = await fetch(
      `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink&limit=${limit}&access_token=${token}`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return fallback;
    const json = (await res.json()) as { data?: ApiMedia[] };
    const posts = (json.data ?? []).map((m) => ({
      id: m.id,
      src: m.media_type === "VIDEO" ? (m.thumbnail_url ?? m.media_url) : m.media_url,
      alt: m.caption?.slice(0, 120) ?? "Objava s Instagrama",
      href: m.permalink,
      remote: true,
    }));
    return posts.length ? posts : fallback;
  } catch {
    return fallback;
  }
}
