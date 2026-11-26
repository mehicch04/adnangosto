create table if not exists public.price_publications (
  number bigint generated always as identity primary key,
  published_at timestamptz not null default now(),
  fingerprint text not null,
  items jsonb not null
);

create index if not exists price_publications_published_at_idx
  on public.price_publications (published_at desc);

alter table public.price_publications enable row level security;
