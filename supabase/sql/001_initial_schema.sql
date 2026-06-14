create extension if not exists pgcrypto;

do $$
begin
  create type public.item_status as enum (
    'AVAILABLE',
    'NEGOTIATION',
    'SOLD'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.offer_status as enum (
    'NEW',
    'NEGOTIATION',
    'ACCEPTED',
    'REJECTED'
  );
exception
  when duplicate_object then null;
end $$;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null,
  price numeric(12, 2) not null check (price >= 0),
  image_url text,
  status public.item_status not null default 'AVAILABLE',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.offers (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.items(id) on delete cascade,
  nickname text not null,
  contact text not null,
  amount numeric(12, 2) not null check (amount > 0),
  message text,
  status public.offer_status not null default 'NEW',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists items_status_idx on public.items(status);
create index if not exists items_created_at_idx on public.items(created_at desc);
create index if not exists offers_item_id_idx on public.offers(item_id);
create index if not exists offers_status_idx on public.offers(status);
create index if not exists offers_created_at_idx on public.offers(created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_items_updated_at on public.items;

create trigger set_items_updated_at
before update on public.items
for each row
execute function public.set_updated_at();

drop trigger if exists set_offers_updated_at on public.offers;

create trigger set_offers_updated_at
before update on public.offers
for each row
execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
      and is_active = true
  );
$$;

grant usage on schema public to anon, authenticated;

grant select on public.items to anon, authenticated;
grant insert, update, delete on public.items to authenticated;

grant insert on public.offers to anon, authenticated;
grant select, update, delete on public.offers to authenticated;

grant select on public.admin_users to authenticated;

grant execute on function public.is_admin() to anon, authenticated;

alter table public.admin_users enable row level security;
alter table public.items enable row level security;
alter table public.offers enable row level security;

drop policy if exists "Admins can read admin users" on public.admin_users;

create policy "Admins can read admin users"
on public.admin_users
for select
to authenticated
using (public.is_admin());

drop policy if exists "Public can read items" on public.items;
drop policy if exists "Admins can insert items" on public.items;
drop policy if exists "Admins can update items" on public.items;
drop policy if exists "Admins can delete items" on public.items;

create policy "Public can read items"
on public.items
for select
to anon, authenticated
using (true);

create policy "Admins can insert items"
on public.items
for insert
to authenticated
with check (public.is_admin());

create policy "Admins can update items"
on public.items
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can delete items"
on public.items
for delete
to authenticated
using (public.is_admin());

drop policy if exists "Public can create offers" on public.offers;
drop policy if exists "Admins can read offers" on public.offers;
drop policy if exists "Admins can update offers" on public.offers;
drop policy if exists "Admins can delete offers" on public.offers;

create policy "Public can create offers"
on public.offers
for insert
to anon, authenticated
with check (status = 'NEW');

create policy "Admins can read offers"
on public.offers
for select
to authenticated
using (public.is_admin());

create policy "Admins can update offers"
on public.offers
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can delete offers"
on public.offers
for delete
to authenticated
using (public.is_admin());

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'item-images',
  'item-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read item images" on storage.objects;
drop policy if exists "Admins can upload item images" on storage.objects;
drop policy if exists "Admins can update item images" on storage.objects;
drop policy if exists "Admins can delete item images" on storage.objects;

create policy "Public can read item images"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'item-images');

create policy "Admins can upload item images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'item-images'
  and public.is_admin()
);

create policy "Admins can update item images"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'item-images'
  and public.is_admin()
)
with check (
  bucket_id = 'item-images'
  and public.is_admin()
);

create policy "Admins can delete item images"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'item-images'
  and public.is_admin()
);