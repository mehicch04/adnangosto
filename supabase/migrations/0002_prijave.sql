alter table public.applications
  add column if not exists package_slug text,
  add column if not exists photos text[] not null default '{}';

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('prijave', 'prijave', false, 10485760, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
  set public = false,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

create policy "admin: citanje slika prijava"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'prijave');

create policy "admin: brisanje slika prijava"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'prijave');
