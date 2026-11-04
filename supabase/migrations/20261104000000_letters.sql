-- Surat Cinta: letters table, RLS and private media bucket.

create table if not exists public.letters (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[A-Za-z0-9_-]{10}$'),
  owner_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  recipient_name text not null check (char_length(recipient_name) between 1 and 60),
  config jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists letters_owner_updated_idx on public.letters (owner_id, updated_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists letters_set_updated_at on public.letters;
create trigger letters_set_updated_at
  before update on public.letters
  for each row execute function public.set_updated_at();

-- Only the owner can touch their rows. The anon role gets no policy at all,
-- so the public API cannot list or read letters. /s/[slug] reads through the
-- service role on the server.
alter table public.letters enable row level security;

drop policy if exists "letters_select_own" on public.letters;
create policy "letters_select_own" on public.letters
  for select to authenticated using (owner_id = (select auth.uid()));

drop policy if exists "letters_insert_own" on public.letters;
create policy "letters_insert_own" on public.letters
  for insert to authenticated with check (owner_id = (select auth.uid()));

drop policy if exists "letters_update_own" on public.letters;
create policy "letters_update_own" on public.letters
  for update to authenticated
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));

drop policy if exists "letters_delete_own" on public.letters;
create policy "letters_delete_own" on public.letters
  for delete to authenticated using (owner_id = (select auth.uid()));

-- Private bucket for MP3 and photos. 10 MB is the hard cap for any file;
-- the 5 MB photo limit is checked by the save action on the server.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', false, 10485760, array['audio/mpeg', 'image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Owners may only use the folder named after their user id: media/<uid>/...
drop policy if exists "media_select_own" on storage.objects;
create policy "media_select_own" on storage.objects
  for select to authenticated
  using (bucket_id = 'media' and (storage.foldername(name))[1] = (select auth.uid())::text);

drop policy if exists "media_insert_own" on storage.objects;
create policy "media_insert_own" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'media' and (storage.foldername(name))[1] = (select auth.uid())::text);

drop policy if exists "media_update_own" on storage.objects;
create policy "media_update_own" on storage.objects
  for update to authenticated
  using (bucket_id = 'media' and (storage.foldername(name))[1] = (select auth.uid())::text);

drop policy if exists "media_delete_own" on storage.objects;
create policy "media_delete_own" on storage.objects
  for delete to authenticated
  using (bucket_id = 'media' and (storage.foldername(name))[1] = (select auth.uid())::text);
