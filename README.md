# adnangosto.com

Nova stranica za Adnana Gostu. Next.js 16, Tailwind v4, Supabase, Resend.

## Pokretanje, prvi put

1. Otvori folder u VS Code-u i prihvati ponuđene ekstenzije (dolje desno).
2. Instaliraj zavisnosti:
   ```bash
   npm install
   ```
3. Napravi env fajl i upiši ključeve:
   ```bash
   cp .env.example .env.local
   ```
4. Supabase (https://supabase.com, region: EU Frankfurt):
   - SQL Editor: pokreni `supabase/migrations/0001_init.sql`, pa `supabase/seed.sql`
   - Authentication > Sign In / Providers: **ugasi "Allow new users to sign up"**
   - Authentication > Users > Add user: napravi admin nalog (sebi i Adnanu)
   - Project Settings > API: prekopiraj URL, publishable i secret ključ u `.env.local`
5. Pokreni:
   ```bash
   npm run dev
   ```
   Otvori http://localhost:3000

## Struktura

```
src/
├── app/
│   ├── page.tsx              početna (sve sekcije)
│   ├── prijava/[paket]/      upitnik po paketu
│   ├── admin/                panel (zaštićen kroz proxy.ts)
│   ├── robots.ts, sitemap.ts SEO
│   └── globals.css           BREND TOKENI (@theme)
├── components/sections/      sekcije početne
├── lib/
│   ├── supabase/             server, client, admin klijenti
│   ├── validation/           Zod sheme
│   └── email/                Resend
└── proxy.ts                  portir za /admin
supabase/
├── migrations/0001_init.sql  tabele + RLS + storage
└── seed.sql                  probni podaci
```

## Plan

| Sedmica | Posao |
|---|---|
| 1 | temelj: baza, seed, deploy na Vercel |
| 2 | upitnik, server action, mailovi |
| 3 | dizajn sekcija, mobitel prvi |
| 4 | admin panel |
| 5 i 6 | SEO, PageSpeed 100, testiranje, domena |
