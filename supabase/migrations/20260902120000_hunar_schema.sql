-- Hunar ecommerce schema for a dedicated Supabase project.
-- Do not apply this to any other Supabase project.

create type public.user_role as enum ('CUSTOMER', 'ADMIN');
create type public.gender as enum ('WOMEN', 'MEN', 'UNISEX');
create type public.product_status as enum ('DRAFT', 'PUBLISHED', 'ARCHIVED');
create type public.order_status as enum (
  'PENDING',
  'CONFIRMED',
  'PAID',
  'FULFILLED',
  'CANCELLED',
  'REFUNDED'
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text,
  email text unique not null,
  role public.user_role not null default 'CUSTOMER',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  gender public.gender,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  subtitle text,
  description text not null,
  price integer not null,
  compare_at integer,
  currency text not null default 'PKR',
  images jsonb not null default '[]'::jsonb,
  materials text,
  care text,
  rating double precision not null default 0,
  rating_count integer not null default 0,
  tags text[] not null default '{}',
  is_featured boolean not null default false,
  is_new boolean not null default false,
  is_bestseller boolean not null default false,
  stock integer not null default 0,
  status public.product_status not null default 'PUBLISHED',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  color text,
  size text,
  sku text unique not null,
  stock integer not null default 0,
  price integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.product_categories (
  product_id uuid not null references public.products (id) on delete cascade,
  category_id uuid not null references public.categories (id) on delete cascade,
  primary key (product_id, category_id)
);

create table public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete cascade,
  full_name text not null,
  line1 text not null,
  line2 text,
  city text not null,
  state text,
  postal text not null,
  country text not null,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id),
  email text not null,
  items jsonb not null default '[]'::jsonb,
  subtotal integer not null,
  shipping integer not null,
  discount integer not null default 0,
  total integer not null,
  currency text not null default 'PKR',
  status public.order_status not null default 'PENDING',
  payment_method text not null default 'COD',
  payment_intent text,
  shipping_address jsonb,
  address_id uuid references public.addresses (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.wishlist_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

create table public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  type text not null,
  value integer not null,
  active boolean not null default true,
  starts_at timestamptz,
  ends_at timestamptz,
  usage_cap integer,
  used_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.homepage_slots (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index products_status_idx on public.products (status);
create index products_featured_idx on public.products (is_featured);
create index products_new_idx on public.products (is_new);
create index products_bestseller_idx on public.products (is_bestseller);
create index variants_product_id_idx on public.variants (product_id);
create index orders_user_id_idx on public.orders (user_id);
create index wishlist_user_id_idx on public.wishlist_items (user_id);

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger categories_updated_at
  before update on public.categories
  for each row execute function public.set_updated_at();

create trigger products_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

create trigger variants_updated_at
  before update on public.variants
  for each row execute function public.set_updated_at();

create trigger addresses_updated_at
  before update on public.addresses
  for each row execute function public.set_updated_at();

create trigger orders_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

create trigger coupons_updated_at
  before update on public.coupons
  for each row execute function public.set_updated_at();

create trigger homepage_slots_updated_at
  before update on public.homepage_slots
  for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', ''),
    'CUSTOMER'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'ADMIN'
  );
$$;

create or replace function public.get_order_by_id(p_id uuid)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select to_jsonb(o)
  from public.orders o
  where o.id = p_id;
$$;

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.variants enable row level security;
alter table public.product_categories enable row level security;
alter table public.addresses enable row level security;
alter table public.orders enable row level security;
alter table public.wishlist_items enable row level security;
alter table public.coupons enable row level security;
alter table public.homepage_slots enable row level security;

create policy "Public can read categories"
  on public.categories for select
  using (true);

create policy "Admins can write categories"
  on public.categories for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Public can read published products"
  on public.products for select
  using (status = 'PUBLISHED' or public.is_admin());

create policy "Admins can write products"
  on public.products for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Public can read variants of published products"
  on public.variants for select
  using (
    public.is_admin()
    or exists (
      select 1
      from public.products p
      where p.id = variants.product_id
        and p.status = 'PUBLISHED'
    )
  );

create policy "Admins can write variants"
  on public.variants for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Public can read product categories"
  on public.product_categories for select
  using (true);

create policy "Admins can write product categories"
  on public.product_categories for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Anyone can create orders"
  on public.orders for insert
  with check (
    user_id is null
    or user_id = auth.uid()
    or public.is_admin()
  );

create policy "Users can read own orders"
  on public.orders for select
  using (auth.uid() = user_id or public.is_admin());

create policy "Users can read own addresses"
  on public.addresses for select
  using (auth.uid() = user_id or public.is_admin());

create policy "Users can insert own addresses"
  on public.addresses for insert
  with check (auth.uid() = user_id or public.is_admin());

create policy "Users can update own addresses"
  on public.addresses for update
  using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

create policy "Users can delete own addresses"
  on public.addresses for delete
  using (auth.uid() = user_id or public.is_admin());

create policy "Users can read own wishlist"
  on public.wishlist_items for select
  using (auth.uid() = user_id or public.is_admin());

create policy "Users can insert own wishlist"
  on public.wishlist_items for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own wishlist"
  on public.wishlist_items for delete
  using (auth.uid() = user_id or public.is_admin());

create policy "Public can read active coupons"
  on public.coupons for select
  using (active = true or public.is_admin());

create policy "Admins can write coupons"
  on public.coupons for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Public can read homepage slots"
  on public.homepage_slots for select
  using (true);

create policy "Admins can write homepage slots"
  on public.homepage_slots for all
  using (public.is_admin())
  with check (public.is_admin());

grant execute on function public.get_order_by_id(uuid) to anon, authenticated;
grant execute on function public.is_admin() to anon, authenticated;
