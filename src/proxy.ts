import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  // Pocetni odgovor: "pusti dalje". Kolacice cemo mozda dopisati na njega.
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          // Osvjezeni kolacici moraju i na zahtjev i na odgovor
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
          // Supabase trazi i zaglavlja protiv kesiranja kad mijenja sesiju
          Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value));
        },
      },
    },
  );

  // getClaims() provjerava potpis tokena. Ne koristi getSession() za odluke o pristupu,
  // jer ona samo cita kolacic i ne provjerava da li je lazan.
  const { data } = await supabase.auth.getClaims();
  const isLoggedIn = Boolean(data?.claims);

  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === "/admin/login";

  // Nije prijavljen i pokusava u kancelariju -> na login
  if (!isLoggedIn && !isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  // Vec je prijavljen, a otvara login -> ravno u panel
  if (isLoggedIn && isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  // Portir stoji SAMO na vratima /admin. Javni sajt ide bez ikakve provjere, pa je brzi.
  matcher: ["/admin/:path*"],
};
