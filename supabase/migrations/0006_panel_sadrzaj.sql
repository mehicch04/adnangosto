alter table public.transformations
  alter column client_name drop not null,
  add column if not exists category text not null default 'rekreativci'
    check (category in ('rekreativci', 'takmicari')),
  add column if not exists image text,
  add column if not exists alt text;

insert into public.transformations (image, alt, category, position, is_active)
select
  '/images/transformacije/tr-' || lpad(n::text, 2, '0') || '.jpg',
  'Transformacija klijenta ' || n || ': fotografija prije i poslije suradnje',
  'rekreativci',
  n,
  true
from generate_series(1, 11) as n
where not exists (select 1 from public.transformations);

update storage.buckets
set file_size_limit = 10485760,
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp']
where id = 'media';

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('kopije', 'kopije', false, 52428800, array['application/json'])
on conflict (id) do nothing;

alter function public.set_updated_at() set search_path = '';
