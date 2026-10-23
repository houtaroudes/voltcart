-- Deal links need a real destination: each deal points at the category it sells.
-- Applied through the Supabase MCP flow on project gvescvtehyuhohyoyxhv.

alter table public.voltcart_deals
  add column if not exists category text references public.voltcart_categories(slug);

update public.voltcart_deals set category = 'audio' where title = 'Audio Week' and category is null;
update public.voltcart_deals set category = 'accessories' where title = 'Desk Upgrade Days' and category is null;
