/*
  Supabase klijent za SERVER (Server Components, Server Actions, Route Handlers).

  Razlika od client.ts: ovdje citamo i pisemo kolacice kroz Next.js cookies().
  Tako server zna da li je admin prijavljen, bez ikakvog koda u pregledniku.

  Tok (misli na React props koji tece odozgo):
    preglednik salje kolacic  ->  cookies() ga procita  ->  Supabase zna ko si  ->  RLS pusti ili odbije
*/
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  // U Next 16 cookies() je async, zato await.
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        // Supabase trazi sve kolacice odjednom
        getAll() {
          return cookieStore.getAll();
        },
        // ...i sam odlucuje koje treba osvjeziti
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Server Component ne smije postavljati kolacice, samo ih citati.
            // To je u redu: proxy.ts osvjezava sesiju na svakom zahtjevu umjesto nas.
          }
        },
      },
    },
  );
}
