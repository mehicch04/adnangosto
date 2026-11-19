create table if not exists public.price_snapshots (
  day date primary key,
  items jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.price_snapshots enable row level security;
