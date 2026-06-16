create table if not exists public.site_visits (
  id uuid primary key default gen_random_uuid(),
  visitor_id text not null,
  path text not null default '/',
  created_at timestamptz not null default now()
);

alter table public.site_visits enable row level security;

drop policy if exists "Anyone can create site visits" on public.site_visits;
create policy "Anyone can create site visits"
on public.site_visits
for insert
to anon, authenticated
with check (
  length(visitor_id) between 10 and 100
  and left(path, 1) = '/'
);

drop policy if exists "Admins can read site visits" on public.site_visits;
create policy "Admins can read site visits"
on public.site_visits
for select
to authenticated
using (public.is_admin());

create index if not exists site_visits_visitor_id_idx
on public.site_visits(visitor_id);

create index if not exists site_visits_created_at_idx
on public.site_visits(created_at desc);