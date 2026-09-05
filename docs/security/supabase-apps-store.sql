-- ADMOV app store: catalogue, orders and licences.
-- Idempotent — safe to run more than once.
--
-- Fulfilment kinds, and why they differ:
--   store_link   iOS and Android apps cannot be sold outside Apple's/Google's
--                stores, so these carry a store URL and no price.
--   download     macOS apps, templates and mini-app source. Paid once, then a
--                short-lived signed link.
--   subscription Recurring access to a hosted app (i8chat, ContentOS...).
--   license      Paid once, then a key the app validates against /api/license.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------- apps
create table if not exists public.apps (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  status text not null default 'draft' check (status in ('draft','published')),
  featured boolean not null default false,
  sort_order int not null default 0,

  -- what it is
  kind text not null default 'app' check (kind in ('app','mini_app','template','saas')),
  platforms text[] not null default '{}',   -- ios | android | macos | windows | web

  -- how it is delivered
  fulfilment text not null default 'store_link'
    check (fulfilment in ('store_link','download','subscription','license')),

  -- commerce (null/0 for store_link)
  price_cents int check (price_cents is null or price_cents >= 0),
  currency text not null default 'usd',
  billing text not null default 'one_time' check (billing in ('one_time','monthly','yearly')),
  stripe_price_id text,        -- filled in once synced to Stripe
  stripe_product_id text,

  -- links
  store_url text,              -- App Store / Play Store / vendor page
  demo_url text,
  download_key text,           -- object key in the private R2 bucket

  -- media and copy
  logo_url text,
  image_url text,
  video_url text,
  tagline jsonb not null default '{}'::jsonb,      -- {"en":..,"ar":..,"tr":..}
  description jsonb not null default '{}'::jsonb,
  features jsonb not null default '{}'::jsonb,     -- {"en":["..",".."], ...}

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- a priced fulfilment must actually carry a price
  constraint apps_price_required check (
    fulfilment = 'store_link' or (price_cents is not null and price_cents > 0)
  ),
  -- a store listing must actually link somewhere
  constraint apps_store_url_required check (
    fulfilment <> 'store_link' or store_url is not null
  )
);
create index if not exists apps_status_sort_idx on public.apps (status, sort_order);

drop trigger if exists apps_set_updated_at on public.apps;
create trigger apps_set_updated_at before update on public.apps
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------- orders
create table if not exists public.app_orders (
  id uuid primary key default gen_random_uuid(),
  app_id uuid not null references public.apps(id) on delete restrict,
  email text not null,
  status text not null default 'pending'
    check (status in ('pending','paid','refunded','failed')),
  amount_cents int not null,
  currency text not null default 'usd',

  stripe_session_id text unique,
  stripe_payment_intent text,
  stripe_subscription_id text,

  -- fulfilment artefacts
  license_key text unique,
  download_token text unique,          -- sha256 of the token we email
  download_expires_at timestamptz,
  download_count int not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists app_orders_email_idx on public.app_orders (email);
create index if not exists app_orders_app_idx on public.app_orders (app_id, status);

drop trigger if exists app_orders_set_updated_at on public.app_orders;
create trigger app_orders_set_updated_at before update on public.app_orders
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------- RLS
alter table public.apps enable row level security;
alter table public.app_orders enable row level security;

-- Public may read published apps only. Everything commercial stays server-side.
drop policy if exists "apps public read" on public.apps;
create policy "apps public read" on public.apps
  for select to anon, authenticated
  using (status = 'published' or auth.uid() in (select user_id from public.admins));

drop policy if exists "apps admin write" on public.apps;
create policy "apps admin write" on public.apps
  for all to authenticated
  using (auth.uid() in (select user_id from public.admins))
  with check (auth.uid() in (select user_id from public.admins));

-- Orders are never readable by the public: checkout, the webhook and the
-- download route all run with the service role, which bypasses RLS.
drop policy if exists "orders admin read" on public.app_orders;
create policy "orders admin read" on public.app_orders
  for select to authenticated
  using (auth.uid() in (select user_id from public.admins));

-- Column grants: the anon key must never see download keys or Stripe ids.
revoke all on public.apps from anon;
grant select (
  id, slug, name, status, featured, sort_order, kind, platforms, fulfilment,
  price_cents, currency, billing, store_url, demo_url,
  logo_url, image_url, video_url, tagline, description, features,
  created_at, updated_at
) on public.apps to anon;
revoke all on public.app_orders from anon;
