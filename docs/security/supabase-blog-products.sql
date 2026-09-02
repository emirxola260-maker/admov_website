-- Run in the Supabase SQL editor for the ADMOV project AFTER supabase-rls.sql.
-- Adds: public.products (Products section CMS), public.posts (AI blog),
--       public.post_topics (topic queue), public.subscribers (newsletter),
--       a shared updated_at trigger, RLS policies, and draft seed products.
-- Storage lives in Cloudflare R2 (see the admov-cdn Worker), not Supabase Storage.
-- Safe to re-run: every statement is idempotent.

-- ─────────────────────────────────────────────────────────────
-- 0. Shared trigger: keep updated_at fresh on every update
-- ─────────────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ─────────────────────────────────────────────────────────────
-- 1. Products — own SaaS / apps / websites, managed from /admin
-- ─────────────────────────────────────────────────────────────
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  status text not null default 'draft' check (status in ('draft','published')),
  featured boolean not null default false,
  sort_order int not null default 0,
  category text not null default 'saas' check (category in ('saas','app','website','course','tool')),
  badges text[] not null default '{}',
  url text,
  logo_url text,
  image_url text,
  video_url text,
  tagline jsonb not null default '{}'::jsonb,      -- {"en": "...", "ar": "...", "tr": "..."}
  description jsonb not null default '{}'::jsonb,  -- {"en": "...", "ar": "...", "tr": "..."}
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists products_status_sort_idx on public.products (status, sort_order);
drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at before update on public.products
  for each row execute function public.set_updated_at();
alter table public.products enable row level security;

drop policy if exists "Public can read published products" on public.products;
create policy "Public can read published products"
  on public.products for select to anon, authenticated
  using (status = 'published' or auth.uid() in (select user_id from public.admins));

drop policy if exists "Admins can insert products" on public.products;
create policy "Admins can insert products"
  on public.products for insert to authenticated
  with check (auth.uid() in (select user_id from public.admins));

drop policy if exists "Admins can update products" on public.products;
create policy "Admins can update products"
  on public.products for update to authenticated
  using (auth.uid() in (select user_id from public.admins))
  with check (auth.uid() in (select user_id from public.admins));

drop policy if exists "Admins can delete products" on public.products;
create policy "Admins can delete products"
  on public.products for delete to authenticated
  using (auth.uid() in (select user_id from public.admins));

-- ─────────────────────────────────────────────────────────────
-- 2. Blog posts — one row = one topic in three languages
-- ─────────────────────────────────────────────────────────────
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  status text not null default 'draft'
    check (status in ('generating','draft','published','rejected','failed','archived')),
  source text not null default 'ai' check (source in ('ai','manual')),
  pillar text,
  topic text,
  tags text[] not null default '{}',
  title jsonb not null default '{}'::jsonb,        -- {"en","ar","tr"}
  excerpt jsonb not null default '{}'::jsonb,
  body_md jsonb not null default '{}'::jsonb,      -- markdown per language
  meta jsonb not null default '{}'::jsonb,         -- per lang: {"seoTitle","seoDescription","keywords":[]}
  cover_image_url text,
  model text,
  prompt_version text,
  usage jsonb,                                     -- token usage + stage timings
  approval_token_hash text,                        -- sha256 of the one-time approve token; null once used
  generated_at timestamptz not null default now(),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists posts_status_published_idx on public.posts (status, published_at desc);
create index if not exists posts_generated_at_idx on public.posts (generated_at desc);

-- Added after the first release; keeps re-runs working on an existing table.
alter table public.posts add column if not exists source text not null default 'ai';
do $$ begin
  alter table public.posts add constraint posts_source_check check (source in ('ai','manual'));
exception when duplicate_object then null; end $$;
create index if not exists posts_source_generated_idx on public.posts (source, generated_at desc);
drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at before update on public.posts
  for each row execute function public.set_updated_at();
alter table public.posts enable row level security;

drop policy if exists "Public can read published posts" on public.posts;
create policy "Public can read published posts"
  on public.posts for select to anon, authenticated
  using (status = 'published' or auth.uid() in (select user_id from public.admins));

drop policy if exists "Admins can insert posts" on public.posts;
create policy "Admins can insert posts"
  on public.posts for insert to authenticated
  with check (auth.uid() in (select user_id from public.admins));

drop policy if exists "Admins can update posts" on public.posts;
create policy "Admins can update posts"
  on public.posts for update to authenticated
  using (auth.uid() in (select user_id from public.admins))
  with check (auth.uid() in (select user_id from public.admins));

drop policy if exists "Admins can delete posts" on public.posts;
create policy "Admins can delete posts"
  on public.posts for delete to authenticated
  using (auth.uid() in (select user_id from public.admins));

-- Row-level policies decide WHICH rows anon sees; these grants decide which
-- COLUMNS. Without them the anon key could read approval_token_hash, OpenAI
-- token usage, and the model/prompt version of every published post.
revoke select on public.posts from anon;
grant select (
  id, slug, status, source, pillar, topic, tags, title, excerpt, body_md, meta,
  cover_image_url, generated_at, published_at, created_at, updated_at
) on public.posts to anon;

-- ─────────────────────────────────────────────────────────────
-- 3. Topic queue — pre-fill from /admin; the daily cron uses queued topics first
-- ─────────────────────────────────────────────────────────────
create table if not exists public.post_topics (
  id uuid primary key default gen_random_uuid(),
  topic text not null,
  notes text,
  status text not null default 'queued' check (status in ('queued','used','skipped')),
  created_at timestamptz not null default now(),
  used_at timestamptz
);
alter table public.post_topics enable row level security;

drop policy if exists "Admins manage post topics" on public.post_topics;
create policy "Admins manage post topics"
  on public.post_topics for all to authenticated
  using (auth.uid() in (select user_id from public.admins))
  with check (auth.uid() in (select user_id from public.admins));

-- ─────────────────────────────────────────────────────────────
-- 4. Newsletter subscribers — written only by the server (service role)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  lang text,
  source text,
  created_at timestamptz not null default now()
);
alter table public.subscribers enable row level security;
drop policy if exists "Admins can read subscribers" on public.subscribers;
create policy "Admins can read subscribers"
  on public.subscribers for select to authenticated
  using (auth.uid() in (select user_id from public.admins));

-- ─────────────────────────────────────────────────────────────
-- 5. Legacy Supabase Storage `media` bucket — cleanup
--    Image uploads from /admin now go to Cloudflare R2 via the admov-cdn Worker
--    (bucket `admin-uploads`, served from https://cdn.admov.io), the same
--    storage the mobile app uses. Nothing new is written to Supabase Storage.
--    An earlier version of this file created a public `media` bucket; these
--    drops make a project provisioned back then converge. They are safe to run
--    on a project that never had it.
-- ─────────────────────────────────────────────────────────────
drop policy if exists "Public can read media"   on storage.objects;
drop policy if exists "Admins can upload media" on storage.objects;
drop policy if exists "Admins can update media" on storage.objects;
drop policy if exists "Admins can delete media" on storage.objects;

--    The bucket itself is NOT dropped here: Supabase blocks direct deletes from
--    storage tables, and any pre-R2 image URL would break. Once this returns no
--    rows, delete the `media` bucket from the Supabase dashboard:
--      select id, slug, logo_url, image_url from public.products
--       where coalesce(logo_url,'')  like '%/object/public/media/%'
--          or coalesce(image_url,'') like '%/object/public/media/%';

-- ─────────────────────────────────────────────────────────────
-- 6. Seed — your products as DRAFTS. Edit and publish them from /admin → Products.
--    Runs only while the table is empty, so deleting a seeded product is permanent.
-- ─────────────────────────────────────────────────────────────
do $$
begin
if not exists (select 1 from public.products) then
insert into public.products (slug, name, status, featured, sort_order, category, badges, url, tagline, description)
values
  ('i8chat', 'i8chat', 'draft', true, 10, 'saas', '{"Live","Web"}', 'https://i8chat.com',
   '{"en": "Turn Instagram comments into customers"}',
   '{"en": "Someone comments your keyword on a post or reel — i8chat DMs them your link seconds later, through the official Instagram API."}'),
  ('admov-academy', 'Admov Academy', 'draft', true, 20, 'course', '{"Live","Web"}', 'https://admovacademy.com',
   '{"en": "Master AI. Build the future."}',
   '{"en": "Practical courses on AI advertising, automation, vibe coding and prompt engineering — with a premium prompt bank, community challenges and QR-verifiable certificates."}'),
  ('contentos', 'ContentOS', 'draft', false, 30, 'saas', '{"Beta","Web"}', 'https://creatorflow-alpha-three.vercel.app',
   '{"en": "Content operations for agencies that publish every day"}',
   '{"en": "From idea to published with your client in the loop: AI brand kits, a kanban content pipeline, no-login client approvals and Arabic-first chat marketing."}'),
  ('vivaldi', 'Vivaldi', 'draft', false, 40, 'tool', '{"AI","Web"}', 'https://vivaldi-gold.vercel.app',
   '{"en": "See your sofa before it is reupholstered"}',
   '{"en": "Upload a photo of your sofa and a fabric swatch — Vivaldi generates a photorealistic preview that keeps the furniture shape, lighting and room intact."}'),
  ('admov-ai-course', 'Admov AI Course', 'draft', false, 50, 'course', '{"Arabic"}', 'https://admov-ai-course.vercel.app',
   '{"en": "Learn to create professional content with AI in 6 days"}',
   '{"en": "An 8-module, one-hour-a-day program on AI images, video, ads and short films — no prior experience needed."}')
on conflict (slug) do nothing;
end if;
end $$;
