-- =====================================================================
-- 0001_init.sql  |  Adnan Gosto, faza 1
-- Pokreni u: Supabase > SQL Editor > New query > zalijepi sve > Run
--
-- Mapa tabela (tri sobe iz plana):
--   IZLOG (javno citanje):  packages, package_questions, transformations,
--                           sponsors, site_content
--   SANDUCE (niko javno):   applications
--   KANCELARIJA (admin):    sve iznad, citanje i pisanje
--
-- RLS ukratko: bez politike tabela je ZAKLJUCANA za sve.
-- Svaka politika ispod otkljucava tacno jedna vrata za tacno jednu ulogu.
--   anon          = posjetilac koji nije prijavljen
--   authenticated = prijavljen korisnik (Adnan ili ti)
--
-- VAZNO: posto je svako "authenticated" ujedno admin, u Supabase panelu
-- MORAS iskljuciti javnu registraciju:
--   Authentication > Sign In / Providers > Allow new users to sign up = OFF
-- Admin naloge pravis rucno: Authentication > Users > Add user.
-- =====================================================================


-- ---------------------------------------------------------------------
-- Pomocna funkcija: automatski osvjezava updated_at pri svakoj izmjeni
-- ---------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;


-- =====================================================================
-- PAKETI (klasicni coaching, 12 sedmica, edukacija za trenere...)
-- =====================================================================
create table public.packages (
  id           uuid primary key default gen_random_uuid(),
  -- slug ide u URL: /prijava/klasicni-coaching
  slug         text not null unique,
  name         text not null,
  -- kratka recenica za karticu na pocetnoj
  tagline      text,
  -- duzi opis: sta obuhvata i kako izgleda saradnja
  description  text,
  -- "Za koga je": takmicar, rekreativac, trener
  audience     text,
  -- npr. "12 sedmica", "mjesecno"
  duration     text,
  -- cijena kao tekst jer Adnan mozda pise "od 80 €" ili "na upit"
  price_label  text,
  -- stavke koje idu sa zutim kvacicama
  features     text[] not null default '{}',
  position     int  not null default 0,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create trigger packages_updated_at
  before update on public.packages
  for each row execute function public.set_updated_at();


-- =====================================================================
-- PITANJA ZA UPITNIK, po paketu
-- Pitanja su u bazi, ne u kodu: Adnan ih mijenja sam iz panela.
-- =====================================================================
create table public.package_questions (
  id           uuid primary key default gen_random_uuid(),
  package_id   uuid not null references public.packages(id) on delete cascade,
  -- tekst pitanja koje posjetilac vidi
  label        text not null,
  -- pomocni tekst ispod pitanja (opcionalno)
  help_text    text,
  -- tip polja odredjuje koju komponentu crtamo u upitniku
  field_type   text not null default 'text'
               check (field_type in ('text', 'textarea', 'number', 'select', 'yes_no')),
  -- ponudjeni odgovori, samo za 'select', npr. ["Pocetnik", "Srednji", "Napredni"]
  options      jsonb,
  is_required  boolean not null default true,
  -- korak upitnika u kojem se pitanje pojavljuje (1, 2, 3...)
  step         int not null default 1,
  position     int not null default 0,
  created_at   timestamptz not null default now()
);

create index package_questions_package_idx
  on public.package_questions (package_id, step, position);


-- =====================================================================
-- PRIJAVE (sanduce)
-- Upisuje ih samo server action s tajnim kljucem. Javno niko ne cita.
-- =====================================================================
create table public.applications (
  id            uuid primary key default gen_random_uuid(),
  package_id    uuid references public.packages(id) on delete set null,
  -- SNIMAK naziva paketa u trenutku prijave.
  -- Ako Adnan kasnije preimenuje ili obrise paket, stara prijava i dalje kaze sta je trazeno.
  package_name  text not null,
  full_name     text not null,
  email         text not null,
  phone         text,
  -- svi odgovori iz upitnika: [{ "question": "...", "answer": "..." }]
  -- snimak pitanja + odgovora, iz istog razloga kao package_name
  answers       jsonb not null default '[]',
  status        text not null default 'nova'
                check (status in ('nova', 'u_obradi', 'prihvacena', 'odbijena')),
  -- kome je proslijedjena: Adnan ili supruga (manje iskusni klijenti)
  assigned_to   text,
  -- interne biljeske, posjetilac ih nikad ne vidi
  admin_notes   text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index applications_status_idx
  on public.applications (status, created_at desc);

create trigger applications_updated_at
  before update on public.applications
  for each row execute function public.set_updated_at();


-- =====================================================================
-- TRANSFORMACIJE (prije i poslije)
-- =====================================================================
create table public.transformations (
  id             uuid primary key default gen_random_uuid(),
  client_name    text not null,
  -- npr. "Takmicar, Men's Physique" ili "Rekreativac"
  client_label   text,
  -- rezultat s brojkama djeluje jace: "-14 kg za 16 sedmica"
  result         text,
  story          text,
  testimonial    text,
  -- putanje u Storage bucketu 'media'
  before_image   text,
  after_image    text,
  position       int not null default 0,
  is_active      boolean not null default true,
  created_at     timestamptz not null default now()
);


-- =====================================================================
-- SPONZORI
-- =====================================================================
create table public.sponsors (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  logo_path   text,
  url         text,
  position    int not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);


-- =====================================================================
-- TEKSTOVI SEKCIJA (kljuc -> vrijednost)
-- npr. key = 'hero_title', value = 'Kako doci do forme'
-- Adnan mijenja tekstove bez diranja koda.
-- =====================================================================
create table public.site_content (
  key         text primary key,
  value       text not null,
  updated_at  timestamptz not null default now()
);

create trigger site_content_updated_at
  before update on public.site_content
  for each row execute function public.set_updated_at();


-- =====================================================================
-- RLS: ukljuci zakljucavanje na SVIM tabelama
-- =====================================================================
alter table public.packages          enable row level security;
alter table public.package_questions enable row level security;
alter table public.applications      enable row level security;
alter table public.transformations   enable row level security;
alter table public.sponsors          enable row level security;
alter table public.site_content      enable row level security;


-- ---------------------------------------------------------------------
-- IZLOG: posjetilac vidi samo aktivne stavke
-- ---------------------------------------------------------------------
create policy "javno: aktivni paketi"
  on public.packages for select
  to anon, authenticated
  using (is_active = true);

create policy "javno: pitanja aktivnih paketa"
  on public.package_questions for select
  to anon, authenticated
  using (exists (
    select 1 from public.packages p
    where p.id = package_id and p.is_active = true
  ));

create policy "javno: aktivne transformacije"
  on public.transformations for select
  to anon, authenticated
  using (is_active = true);

create policy "javno: aktivni sponzori"
  on public.sponsors for select
  to anon, authenticated
  using (is_active = true);

create policy "javno: tekstovi sekcija"
  on public.site_content for select
  to anon, authenticated
  using (true);


-- ---------------------------------------------------------------------
-- KANCELARIJA: prijavljeni admin cita i pise sve
-- (ukljucujuci neaktivne pakete, da ih moze ponovo ukljuciti)
-- ---------------------------------------------------------------------
create policy "admin: sve na paketima"
  on public.packages for all
  to authenticated
  using (true) with check (true);

create policy "admin: sve na pitanjima"
  on public.package_questions for all
  to authenticated
  using (true) with check (true);

create policy "admin: sve na transformacijama"
  on public.transformations for all
  to authenticated
  using (true) with check (true);

create policy "admin: sve na sponzorima"
  on public.sponsors for all
  to authenticated
  using (true) with check (true);

create policy "admin: sve na tekstovima"
  on public.site_content for all
  to authenticated
  using (true) with check (true);

-- SANDUCE: admin cita i mijenja status. Namjerno NEMA politike za anon.
-- Upis nove prijave radi server action s tajnim kljucem, koji zaobilazi RLS.
create policy "admin: citanje i izmjena prijava"
  on public.applications for all
  to authenticated
  using (true) with check (true);


-- =====================================================================
-- STORAGE: bucket 'media' za slike (transformacije, sponzori, Adnan)
-- Javno citanje, pisanje samo admin.
-- =====================================================================
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "admin: upload u media"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'media');

create policy "admin: izmjena u media"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'media');

create policy "admin: brisanje iz media"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'media');
