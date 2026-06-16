alter table public.items
add column if not exists highest_offer_price numeric(12, 2)
check (
  highest_offer_price is null
  or highest_offer_price >= 0
);