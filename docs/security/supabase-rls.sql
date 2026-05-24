-- Run in the Supabase SQL editor for the ADMOV project.
-- Tables: public.admin_content (website CMS content) + public.admins (write allowlist)
-- Safe to re-run: every statement is idempotent.

-- 1. Content table the website reads/writes (columns: id / content / updated_at).
create table if not exists public.admin_content (
  id text primary key,
  content jsonb,
  updated_at timestamptz default now()
);
alter table public.admin_content enable row level security;

-- 2. Admin allowlist. Only user_ids listed here may WRITE content.
--    This defends against open sign-ups: a random self-registered user is NOT
--    in this table, so they cannot write even though they're "authenticated".
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  added_at timestamptz default now()
);
alter table public.admins enable row level security;

-- Authenticated users may read ONLY their own allowlist row (so the write
-- policy's subquery below can see it; non-admins see nothing). No insert/update/
-- delete policies => only the dashboard / service_role can manage the allowlist.
drop policy if exists "Users can read own admin row" on public.admins;
create policy "Users can read own admin row"
  on public.admins for select to authenticated
  using (user_id = auth.uid());

-- 3. Content policies: public read, allowlisted-admin write.
drop policy if exists "Public can read admin content" on public.admin_content;
create policy "Public can read admin content"
  on public.admin_content for select to anon, authenticated
  using (true);

drop policy if exists "Authenticated can insert admin content" on public.admin_content;
drop policy if exists "Admins can insert admin content" on public.admin_content;
create policy "Admins can insert admin content"
  on public.admin_content for insert to authenticated
  with check (auth.uid() in (select user_id from public.admins));

drop policy if exists "Authenticated can update admin content" on public.admin_content;
drop policy if exists "Admins can update admin content" on public.admin_content;
create policy "Admins can update admin content"
  on public.admin_content for update to authenticated
  using (auth.uid() in (select user_id from public.admins))
  with check (auth.uid() in (select user_id from public.admins));

-- 4. AFTER creating your admin user (Authentication -> Users -> Add user),
--    add them to the allowlist so they can save content (replace the email):
--
--    insert into public.admins (user_id)
--    select id from auth.users where email = 'you@admov.io'
--    on conflict do nothing;
