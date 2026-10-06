/*
  Supabase klijent za PREGLEDNIK.
  Koristi se samo u komponentama koje imaju "use client" na vrhu
  (npr. admin login forma koja reaguje na klik).

  Radi s publishable kljucem, pa ga RLS pravila u bazi ogranicavaju.
  Zato je siguran i kad je vidljiv u pregledniku.
*/
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
