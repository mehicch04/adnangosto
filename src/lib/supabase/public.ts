/*
  Supabase klijent za JAVNO čitanje sadržaja (paketi, transformacije).

  Zašto ne server.ts? Taj klijent čita kolačiće, a čim stranica dira
  kolačiće, Next je mora graditi iznova za svakog posjetioca.
  Ovaj klijent ne zna ni za kakve kolačiće, pa početna ostaje statična
  i služi se trenutno, a osvježava se u pozadini (revalidate u page.tsx).

  Koristi publishable ključ, pa ga RLS ograničava na aktivne stavke.
*/
import "server-only";
import { createClient } from "@supabase/supabase-js";

export function createPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  // Ako ključevi još nisu upisani u .env.local, vraćamo null umjesto da pukne.
  // Pozivaoc tada koristi rezervni sadržaj iz src/content/site.ts.
  if (!url || !key || url.includes("xxxx")) return null;

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
