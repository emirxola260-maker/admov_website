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
--   enrolment    A course seat. Paid once; no artefact — the owner is told on
--                Telegram and contacts the student.
--
-- Run docs/security/supabase-blog-products.sql first: it defines
-- public.set_updated_at(), which the triggers below use.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------- apps
create table if not exists public.apps (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  status text not null default 'draft' check (status in ('draft','published')),
  featured boolean not null default false,
  sort_order int not null default 0,

  -- what it is
  kind text not null default 'app' check (kind in ('app','mini_app','template','saas','course')),
  platforms text[] not null default '{}',   -- ios | android | macos | windows | web

  -- how it is delivered
  fulfilment text not null default 'store_link'
    check (fulfilment in ('store_link','download','subscription','license','enrolment')),

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
  gallery jsonb not null default '[]'::jsonb,      -- [{"url":..,"caption":{"en":..}}] screenshots / project examples

  -- courses only (all per language, like the copy above)
  curriculum_md jsonb,         -- {"ar": "## ...markdown..."}; ### headings become modules
  duration jsonb,              -- {"ar": "٦ أسابيع"}
  level jsonb,
  format jsonb,                -- how it is taught
  project jsonb,               -- what the student has built by the end
  instructor jsonb,            -- {"name":..,"photo_url":..,"role":{..},"bio":{..}}

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- a PUBLISHED paid listing must carry a price; drafts may still be unpriced
  constraint apps_price_required check (
    status = 'draft' or fulfilment = 'store_link' or (price_cents is not null and price_cents > 0)
  ),
  -- a store listing must actually link somewhere
  constraint apps_store_url_required check (
    fulfilment <> 'store_link' or store_url is not null
  )
);
create index if not exists apps_status_sort_idx on public.apps (status, sort_order);

-- Upgrade path for a table created from an earlier copy of this file. Every
-- statement is a no-op on a fresh table. Postgres names inline column checks
-- <table>_<column>_check, which is what the drops below rely on.
alter table public.apps add column if not exists gallery jsonb not null default '[]'::jsonb;
alter table public.apps add column if not exists curriculum_md jsonb;
alter table public.apps add column if not exists duration jsonb;
alter table public.apps add column if not exists level jsonb;
alter table public.apps add column if not exists format jsonb;
alter table public.apps add column if not exists project jsonb;
alter table public.apps add column if not exists instructor jsonb;
-- An earlier copy stored duration/level as plain text; keep any value as Arabic.
do $$
declare col text;
begin
  foreach col in array array['duration', 'level'] loop
    if exists (
      select 1 from information_schema.columns
      where table_schema = 'public' and table_name = 'apps' and column_name = col and data_type = 'text'
    ) then
      execute format(
        'alter table public.apps alter column %I type jsonb using case when coalesce(%I, '''') = '''' then null else jsonb_build_object(''ar'', %I) end',
        col, col, col
      );
    end if;
  end loop;
end $$;
alter table public.apps drop constraint if exists apps_kind_check;
alter table public.apps add constraint apps_kind_check
  check (kind in ('app','mini_app','template','saas','course'));
alter table public.apps drop constraint if exists apps_fulfilment_check;
alter table public.apps add constraint apps_fulfilment_check
  check (fulfilment in ('store_link','download','subscription','license','enrolment'));
alter table public.apps drop constraint if exists apps_price_required;
alter table public.apps add constraint apps_price_required check (
  status = 'draft' or fulfilment = 'store_link' or (price_cents is not null and price_cents > 0)
);

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
  logo_url, image_url, video_url, tagline, description, features, gallery,
  curriculum_md, duration, level, format, project, instructor,
  created_at, updated_at
) on public.apps to anon;
revoke all on public.app_orders from anon;

-- ---------------------------------------------------------------- seed: courses
-- Both courses start as unpriced drafts; set a price and publish from /admin.
-- `on conflict do nothing` so re-running never overwrites edits made there.
-- The copy is the owner's own curriculum text; level/format/project are
-- phrases lifted from it. Duration and the instructor are left for /admin.
insert into public.apps (slug, name, status, kind, platforms, fulfilment, price_cents, currency, billing,
                         sort_order, featured, tagline, description, features, curriculum_md,
                         level, format, project)
values (
  'ai-coding', 'البرمجة مع الذكاء الاصطناعي', 'draft', 'course', '{web}', 'enrolment', null, 'usd', 'one_time',
  10, true,
  jsonb_build_object('ar', 'تبني تطبيقات ومواقع وأنظمة أتمتة — من غير ما تكون مبرمج ومن غير أي خلفية تقنية.'),
  jsonb_build_object('ar', 'المسار مبني بالترتيب: بنبلّش من الصفر وبننتهي وعندك تطبيق شغّال ومنشور ع الإنترنت.'),
  jsonb_build_object('ar', jsonb_build_array(
    'تبني تطبيق ويب كامل وتنشره ع الإنترنت باسمك.',
    'تبني أدوات داخلية تختصر شغلك اليومي.',
    'تربط تطبيقك بقاعدة بيانات ونظام دفع.',
    'تفهم كيف تقرأ وتعدّل ع أي مشروع موجود.',
    'تشتغل ع مشاريع لعملاء وتسلّمها جاهزة.'
  )),
  jsonb_build_object('ar', $md$## لمين هذا المسار؟

- شخص ما برمج بحياته ولا بيعرف شو يعني كود.
- صاحب فكرة بدّه يطلّعها تطبيق أو موقع بدون ما يوظّف مبرمج.
- شخص بدّه يبني أدوات داخلية تختصر شغله اليومي.
- شخص بدّه يدخل مجال بناء المنتجات الرقمية ويشتغل فيها.

## محاور المسار

### 1. شو يعني تبرمج مع الذكاء الاصطناعي

- الفكرة الأساسية: إنت بتقرر وبتوصف، وهو بينفّذ.
- الفرق بين محادثة عادية وبين وكيل برمجي (Agent) بيشتغل لحاله.
- شو بيقدر يعمله لحاله وإمتى لازم تتدخل إنت.
- العقلية الصح: تفكر بالمنتج مش بالكود.

### 2. تجهيز بيئة العمل

- تنصيب الأدوات من الصفر خطوة بخطوة ع جهازك.
- التعامل مع الـTerminal بأبسط شكل ممكن.
- حفظ النسخ وإدارة المشروع (Git & GitHub) بلغة مبسّطة.
- تنظيم المشروع من أول يوم حتى ما تضيع بعدين.

### 3. كيف تحكي مع الوكيل

- كتابة المواصفات (Spec) قبل ما تبلّش التنفيذ.
- إعطاء السياق الصح: ملفات، أمثلة، وقواعد شغل واضحة.
- التخطيط قبل التنفيذ وليش هاد بيوفّر عليك ساعات.
- التعامل مع الأخطاء: كيف تقرأ المشكلة وتوصفها صح.

### 4. بناء أول تطبيق

- من الفكرة لواجهة شغّالة تقدر تفتحها وتستخدمها.
- قاعدة البيانات: التخزين، الجداول، والربط بينها.
- تسجيل الدخول وحسابات المستخدمين.
- التصميم: كيف يطلع شكل التطبيق احترافي مش بدائي.

### 5. النشر على الإنترنت

- رفع المشروع وتشغيله ع سيرفر حقيقي.
- ربط الدومين وتشغيله ع اسمك.
- المفاتيح والإعدادات السرية وكيف تحميها.
- التحديث والتعديل بعد ما يصير منشور.

### 6. الأتمتة والربط

- ربط تطبيقك بخدمات خارجية عبر الـAPI.
- بناء أتمتة تشتغل لحالها بدون تدخّل.
- استقبال الدفعات وربط بوابة دفع.
- أتمتة الشغل اليومي المتكرر يلي بياكل وقتك.

### 7. التطوير والصيانة

- تتبّع الأخطاء وإصلاحها بدل ما تعلق فيها.
- تحسين السرعة والأداء.
- إضافة ميزات جديدة بدون ما تكسر الشغّال.
- تسليم مشروع لعميل: شو لازم يكون جاهز قبل التسليم.

## الأدوات اللي رح تشتغل فيها

Claude Code · Cursor · Next.js · Supabase · Vercel · Railway · n8n · Stripe · GitHub

**طريقة الشرح:** عملي بالكامل. مننفّذ سوا ع مشروع حقيقي إنت بتختاره — مش أمثلة نظرية، بتطلع ومعك شي شغّال بتقدر تفرجيه.

**شو بتاخد معك:** قوالب المشاريع الجاهزة، ملفات الإعدادات، ومكتبة البرومبتات البرمجية يلي بستخدمها بشغلي اليومي.$md$),
  jsonb_build_object('ar', 'من الصفر — بدون أي خلفية تقنية'),
  jsonb_build_object('ar', 'عملي بالكامل — ع مشروع حقيقي إنت بتختاره'),
  jsonb_build_object('ar', 'تطبيق ويب كامل، شغّال ومنشور ع الإنترنت باسمك.')
) on conflict (slug) do nothing;

insert into public.apps (slug, name, status, kind, platforms, fulfilment, price_cents, currency, billing,
                         sort_order, featured, tagline, description, features, curriculum_md,
                         level, format, project)
values (
  'ai-content-creation', 'صناعة المحتوى بالذكاء الاصطناعي', 'draft', 'course', '{web}', 'enrolment', null, 'usd', 'one_time',
  20, true,
  jsonb_build_object('ar', 'صور وفيديوهات بجودة احترافية — من الصفر، بدون كاميرا ولا استوديو ولا خبرة سابقة.'),
  jsonb_build_object('ar', 'المسار مبني بالترتيب: كل محور بيبني على اللي قبله، وكل معلومة إلها تطبيق عملي مباشر ع مشروعك إنت.'),
  jsonb_build_object('ar', jsonb_build_array(
    'تولّد صور منتجات وإعلانات بجودة تجارية جاهزة للنشر.',
    'تعمل فيديو إعلاني كامل من الفكرة للتصدير النهائي.',
    'تبني شخصية أو موديل ثابت تستخدمه بكل محتواك.',
    'تنتج محتوى أسبوعي لمشروعك بدون فريق ولا معدات.',
    'تعرف كيف تقدّم هالخدمة لعملاء وتشتغل فيها.'
  )),
  jsonb_build_object('ar', $md$## لمين هذا المسار؟

- شخص ما عنده أي خلفية تقنية ولا خبرة بالتصميم أو المونتاج.
- صاحب مشروع أو متجر بدّه محتوى بصري احترافي بدون تكاليف إنتاج.
- شخص بدّه يدخل مجال صناعة المحتوى ويبيع الخدمة لعملاء.
- شخص عم يجرّب الأدوات لحاله وبدّه طريق واضح بدل التخبّط.

## محاور المسار

### 1. أساسيات الذكاء الاصطناعي التوليدي

- كيف بتفكر هالنماذج وكيف فعليًا بتطلع الصورة والفيديو.
- خريطة الأدوات: شو بتنفع كل وحدة وإمتى تستخدمها.
- شو ممكن وشو لسا صعب — تضبط توقعاتك من أول يوم.
- تجهيز الحسابات ومساحة الشغل يلي رح تشتغل عليها.

### 2. توليد الصور — الأساس

- تركيب البرومبت: الموضوع، الإضاءة، الزاوية، الستايل، الجودة.
- كيف تتحكم بالنتيجة بدل ما تعتمد ع الحظ وتعيد مية مرة.
- الصور المرجعية (References) وكيف تفرض ستايل معيّن.
- التعديل ع صورة جاهزة: تغيير عنصر، إزالة، توسيع، ودمج صورتين.

### 3. الصور التجارية وصور المنتجات

- تصوير المنتج بمشاهد احترافية بدون كاميرا ولا استوديو.
- ثبات الشخصية أو الموديل بنفس الملامح عبر كل الصور.
- مطابقة الهوية البصرية للبراند: الألوان، المزاج، الستايل.
- تجهيز صور إعلانية جاهزة للنشر بمقاساتها الصحيحة.

### 4. توليد الفيديو

- من نص لفيديو ومن صورة لفيديو — إمتى تستخدم كل طريقة.
- التحكم بحركة الكاميرا وحركة العناصر جوّا المشهد.
- كتابة برومبت المشهد السينمائي بتفاصيله.
- ربط اللقطات ببعضها وبناء مشهد كامل مترابط.

### 5. الصوت والمونتاج النهائي

- التعليق الصوتي بالذكاء الاصطناعي واستنساخ الصوت.
- مزامنة الشفايف مع الصوت (Lipsync).
- الموسيقى والمؤثرات الصوتية وضبط المزاج العام.
- الترجمة والنصوص ع الشاشة والتصدير النهائي الجاهز للنشر.

### 6. من المحتوى للنتيجة

- بناء خط إنتاج واضح: من الفكرة للفيديو الجاهز.
- الإنتاج بالجملة — كمية محتوى بجلسة شغل وحدة.
- تنظيم الملفات والأصول لمشاريعك أو لعملائك.
- الأخطاء الشائعة اللي بتحرق النتيجة وكيف تتجنبها.

## الأدوات اللي رح تشتغل فيها

Midjourney · Flux · Nano Banana · ComfyUI · Seedance · Kling · Veo · Higgsfield · ElevenLabs · CapCut

**طريقة الشرح:** عملي بالكامل. كل محور فيه تطبيق مباشر، والشغل بيكون ع مشروعك إنت مش ع أمثلة جاهزة — تطلع من كل جلسة ومعك شغل خلصان.

**شو بتاخد معك:** مكتبة البرومبتات الجاهزة، قوالب المشاهد، وخط إنتاج مكتوب خطوة بخطوة تقدر تشتغل عليه لحالك بعد ما نخلص.$md$),
  jsonb_build_object('ar', 'من الصفر — بدون خبرة سابقة'),
  jsonb_build_object('ar', 'عملي بالكامل — ع مشروعك إنت'),
  jsonb_build_object('ar', 'فيديو إعلاني كامل من الفكرة للتصدير النهائي، وصور منتجات جاهزة للنشر.')
) on conflict (slug) do nothing;
