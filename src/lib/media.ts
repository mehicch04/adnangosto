export const MEDIA_BUCKET = "media";

export function imageSrc(path: string) {
  if (path.startsWith("/") || path.startsWith("http")) return path;
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${MEDIA_BUCKET}/${path}`;
}

export function isStoredMedia(path: string | null | undefined): path is string {
  return Boolean(path) && !path!.startsWith("/") && !path!.startsWith("http");
}
