/*
  Sloj za dobavljanje sadržaja početne stranice.

  Tok za svaku funkciju (kao fallback u Reactu: data ?? defaultValue):
    1. pitaj Supabase
    2. ako baza nije spojena, javi grešku ili vrati prazno -> uzmi rezervu iz content/site.ts

  Tako komponente uvijek dobiju podatke istog oblika i ne moraju znati
  odakle su došli. Kad Adnan unese pakete kroz panel, sajt ih sam pokupi.
*/
import "server-only";
import { createPublicClient } from "@/lib/supabase/public";
import {
  fallbackPackages,
  fallbackTransformations,
  type Package,
  type Transformation,
} from "@/content/site";

export async function getPackages(): Promise<Package[]> {
  const supabase = createPublicClient();
  if (!supabase) return fallbackPackages;

  const { data, error } = await supabase
    .from("packages")
    .select("slug, name, tagline, audience, duration, price_label, features")
    .order("position", { ascending: true });

  // greška ili prazna tabela -> rezerva, da sekcija nikad ne ostane prazna
  if (error || !data || data.length === 0) return fallbackPackages;
  return data;
}

export async function getTransformations(): Promise<Transformation[]> {
  const supabase = createPublicClient();
  if (!supabase) return fallbackTransformations;

  const { data, error } = await supabase
    .from("transformations")
    .select("client_name, client_label, result, testimonial, before_image, after_image")
    .order("position", { ascending: true })
    .limit(6);

  if (error || !data) return fallbackTransformations;
  return data;
}

/*
  Slike u bazi čuvamo kao putanju u bucketu 'media' (npr. "transformacije/marko-prije.jpg").
  Ova funkcija od putanje pravi punu javnu adresu koju razumije next/image.
*/
export function mediaUrl(path: string | null): string | null {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return base ? `${base}/storage/v1/object/public/media/${path}` : null;
}
