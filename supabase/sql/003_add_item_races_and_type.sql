do $$
begin
  create type public.item_race as enum (
    'WARRIOR',
    'SURA',
    'SHAMAN',
    'NINJA',
    'LYCAN'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.item_type as enum (
    'WEAPONS',
    'ARMORS',
    'SHIELDS',
    'BRACELETS',
    'NECKLACES',
    'EARRINGS',
    'TALISMANS',
    'BELTS',
    'HELMETS',
    'SHOES',
    'GLOVES',
    'SASHES',
    'AURA_OUTFITS',
    'COSTUMES',
    'OBJECTS',
    'PETS'
  );
exception
  when duplicate_object then null;
end $$;

alter table public.items
add column if not exists races public.item_race[] not null default '{}';

alter table public.items
add column if not exists item_type public.item_type not null default 'OBJECTS';

create index if not exists items_item_type_idx on public.items(item_type);
create index if not exists items_races_idx on public.items using gin(races);