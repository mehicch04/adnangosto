@AGENTS.md

# Projekat: adnangosto.com

Lična stranica fitness i bodybuilding trenera Adnana Goste. Izvođač: mehiccdev.
Ovaj fajl Claude Code čita na početku svake sesije. Drži ga ažurnim.

## Šta gradimo (faza 1, ugovoreno)

Jedna duga stranica koja se skrola, plus upitnik za prijavu i admin panel.

- Javno: Hero, O meni, Usluge (paketi), Transformacije, Sponzori, Instagram i Kontakt
- Upitnik u koracima po paketu: `/prijava/[paket]`
- Po prijavi: upis u bazu + mail Adnanu ("<Naziv paketa>, prijava") + potvrda podnosiocu
- Admin `/admin`: prijave sa statusom, paketi, pitanja, transformacije, sponzori, tekstovi

## NIJE u fazi 1 (ne gradi bez dogovora)

Naplata karticom, pretplate, prodaja predavanja, korisnički nalozi za posjetioce,
portal, zajednica, povezivanje s mobilnom aplikacijom. To je faza 2.

## Stack

- Next.js 16 (App Router, `src/`), React 19, TypeScript
- Tailwind CSS v4: tokeni su u `src/app/globals.css` pod `@theme`, NEMA tailwind.config
- Supabase: baza, auth za admina, Storage bucket `media`
- Zod v4 za validaciju, Resend za mailove
- Hosting: Vercel

## Next 16 razlike koje se lako promaše

- `middleware.ts` se sada zove `src/proxy.ts`, a funkcija `proxy`
- `params` i `searchParams` u stranicama su Promise: `const { paket } = await params`
- `cookies()` i `headers()` su async

## Supabase klijenti, koji kad

- `lib/supabase/server.ts`: Server Components i Server Actions (čita sesiju iz kolačića)
- `lib/supabase/client.ts`: samo komponente sa `"use client"`
- `lib/supabase/admin.ts`: tajni ključ, zaobilazi RLS. SAMO server. Koristi se za upis prijave.
- Za provjeru ko je prijavljen koristi `auth.getClaims()`, nikad `getSession()`.

## Brend pravila

- Pozadina crna `brand-black`, kartice `brand-surface`, akcent `brand-yellow` (#EDB12D)
- Žuta: akcenti, traka takmičenja (marquee) i kose plohe iz loga. Svijetla sekcija `brand-paper` razbija crnu (paketi, transformacije).
- Kontrast: žuti tekst samo na crnoj. Na žutom dugmetu tekst je CRN, nikad bijel.
- Naslovi: `font-display` (Bebas Neue), velika slova. Tekst: `font-body` (Barlow).
- Motivi s njegovih objava (tačkice, XXXX, žute kvačice): štedljivo, najviše jedan po sekciji.

## Pravila kvaliteta (obećano klijentu u ugovoru)

- Mobitel prvi: svaki ekran se prvo radi za ~375px, pa tek onda veće
- PageSpeed 100/100/100/100 na dan predaje: `next/image` za sve slike, bez teških biblioteka
- Nema WordPressa, page buildera ni kupljenih šablona
- Tekst na sajtu je na bosanskom
- U tekstovima za klijenta bez dugih crtica i fraza koje zvuče kao AI

## Pravila koda

- Server Components po defaultu. `"use client"` samo gdje treba interakcija.
- Svaki unos s forme prolazi kroz Zod na serveru prije baze.
- Tajni ključevi nikad u kodu koji ide u preglednik.
- Bez komentara u kodu.
- Uz svaku izmjenu predloži git komande (add, commit s porukom, push).

## Gdje je šta (početna)

- Sadržaj i rezervni podaci: `src/content/site.ts` (sve sa PROVJERITI potvrđuje Adnan)
- Dobavljanje iz Supabase-a s rezervom: `src/lib/content.ts` + `src/lib/supabase/public.ts`
- Sekcije: `src/components/sections/`, dugme i ikonice: `src/components/ui/`
- Potpis dizajna: kosa linija iz loga (rez G/A) na fotografiji u heroju. Ne ponavljati je svuda.

## Otvorena pitanja s klijentom

- Tačan spisak paketa (12 sedmica ili 3 mjeseca?) i pitanja za svaki upitnik
- Ton prema posjetiocu na sajtu: "ti" ili "Vi"
- Original loga (SVG/PDF) i pojednostavljena "GA" verzija za favicon
- Fotografije u punoj rezoluciji (ne preko WhatsAppa)
- Pristup domeni adnangosto.com (za Resend DNS i prebacivanje)
- Potvrda činjenica o karijeri (IFBB Pro 2021/2022, amaterska karijera 2012 do 2016) i tačan Instagram profil
- Transformacije s brojkama i dozvolom za objavu, logotipi aktuelnih sponzora
- Potvrda odgovora u čestim pitanjima (`faq` u `src/content/site.ts`)
