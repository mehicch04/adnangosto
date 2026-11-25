import { createClient } from "@/lib/supabase/client";
import { MEDIA_BUCKET } from "@/lib/media";

type Prepared = { blob: Blob; ext: "jpg" | "png"; type: string };

export async function prepareImage(
  file: File,
  maxSide: number,
  keepAlpha = false,
): Promise<Prepared> {
  if (!file.type.startsWith("image/")) throw new Error("Odaberi sliku (JPG, PNG ili WebP).");
  if (file.size > 25 * 1024 * 1024) throw new Error("Slika je prevelika. Najviše 25 MB.");
  const type = keepAlpha ? "image/png" : "image/jpeg";
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("canvas");
    if (!keepAlpha) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("blob"))), type, 0.86),
    );
    return { blob, ext: keepAlpha ? "png" : "jpg", type };
  } catch {
    throw new Error("Ovu sliku nije moguće obraditi. Pokušaj s JPG ili PNG.");
  }
}

export async function uploadImage(
  file: File,
  folder: "transformacije" | "sponzori" | "galerija",
  { maxSide, keepAlpha = false }: { maxSide: number; keepAlpha?: boolean },
): Promise<string> {
  const { blob, ext, type } = await prepareImage(file, maxSide, keepAlpha);
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await createClient()
    .storage.from(MEDIA_BUCKET)
    .upload(path, blob, { contentType: type, cacheControl: "31536000", upsert: false });
  if (error) throw new Error("Slika nije poslana. Provjeri internet i pokušaj ponovo.");
  return path;
}
