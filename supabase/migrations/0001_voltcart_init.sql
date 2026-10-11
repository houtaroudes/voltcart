-- Voltcart schema and seed.
-- Applied through the Supabase MCP migration flow on project gvescvtehyuhohyoyxhv.
-- Public read only: cart and wishlist state live in the browser, not the DB.

create extension if not exists pgcrypto;

create table if not exists public.voltcart_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  icon text not null default 'box',
  sort int not null default 0
);

create table if not exists public.voltcart_products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  brand text not null,
  description text not null default '',
  price numeric(10,2) not null check (price >= 0),
  sale_price numeric(10,2) check (sale_price is null or (sale_price >= 0 and sale_price < price)),
  category text not null references public.voltcart_categories(slug),
  rating numeric(2,1) not null default 0,
  rating_count int not null default 0,
  images jsonb not null default '[]'::jsonb,
  specs jsonb not null default '{}'::jsonb,
  sponsored boolean not null default false,
  stock int not null default 10 check (stock >= 0),
  viewing int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.voltcart_deals (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text not null default '',
  discount_text text not null default '',
  cta_label text not null default 'Shop now',
  image_url text not null default '',
  accent text not null default 'violet',
  ends_at timestamptz not null,
  active boolean not null default true,
  sort int not null default 0
);

alter table public.voltcart_categories enable row level security;
alter table public.voltcart_products enable row level security;
alter table public.voltcart_deals enable row level security;

create policy "voltcart_categories_public_read" on public.voltcart_categories for select to anon, authenticated using (true);
create policy "voltcart_products_public_read" on public.voltcart_products for select to anon, authenticated using (true);
create policy "voltcart_deals_public_read" on public.voltcart_deals for select to anon, authenticated using (true);

-- Seed runs in the applied migration; this file records it for fresh projects.
-- Full seed statements: see the applied migration on the Supabase project.
