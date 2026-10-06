/*
  Supabase klijent s TAJNIM kljucem. Zaobilazi sva RLS pravila.

  !!! KORISTI SAMO NA SERVERU !!!
  Ovaj fajl se nikad ne importuje u komponentu sa "use client".
  Paket "server-only" to cuva: import ispod baca gresku pri buildu
  ako ga neko slucajno uvuce u kod koji ide u preglednik.

  Gdje se koristi: server action koji upisuje prijavu iz upitnika.
  Posjetilac nije prijavljen, pa mu RLS ne da da pise u tabelu applications.
  Zato upis radi server, u njegovo ime, nakon sto Zod provjeri podatke.
*/
import "server-only";
import { createClient } from "@supabase/supabase-js";

export function createAdminClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!, {
    // Nema prijave korisnika na ovom klijentu, pa ne treba cuvati sesiju.
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
