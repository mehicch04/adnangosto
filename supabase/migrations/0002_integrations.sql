create table public.integrations (
  key         text primary key,
  value       text not null,
  updated_at  timestamptz not null default now()
);

create trigger integrations_updated_at
  before update on public.integrations
  for each row execute function public.set_updated_at();

alter table public.integrations enable row level security;
