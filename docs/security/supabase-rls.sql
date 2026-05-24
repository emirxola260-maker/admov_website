-- Run in the Supabase SQL editor for the ADMOV project.
-- Table: public.admin_content (single row, id = 'admov_main')
-- Safe to re-run: every statement is idempotent.

-- 1. Create the table the app reads/writes (columns: id / content / updated_at).
create table if not exists public.admin_content (
  id text primary key,
  content jsonb,
  updated_at timestamptz default now()
);

-- 2. Enable Row Level Security on the table.
alter table public.admin_content enable row level security;

-- Public/anon may READ content (the site is public anyway).
drop policy if exists "Public can read admin content" on public.admin_content;
create policy "Public can read admin content"
  on public.admin_content
  for select
  to anon, authenticated
  using (true);

-- Only AUTHENTICATED users may write.
drop policy if exists "Authenticated can insert admin content" on public.admin_content;
create policy "Authenticated can insert admin content"
  on public.admin_content
  for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated can update admin content" on public.admin_content;
create policy "Authenticated can update admin content"
  on public.admin_content
  for update
  to authenticated
  using (true)
  with check (true);
