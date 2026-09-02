# admov.io

Marketing site for ADMOV (AI agency) — Next.js 16 App Router, React 19, Tailwind CSS v4, Supabase, deployed on Vercel.

## Stack

- **Framework**: Next.js App Router under `src/app/` (server-rendered, per-request CSP nonce in `src/proxy.ts`).
- **Content**: bundled translations (`src/i18n/translations.ts`, EN/AR/TR) with admin overrides stored in Supabase (`admin_content`), edited at `/admin`.
- **Products**: Supabase `products` table, managed from `/admin → Products`.
- **Blog**: Supabase `posts` table. A daily Vercel Cron (`/api/cron/generate-post`) asks OpenAI (GPT, Responses API with structured outputs) for a trilingual draft, sends a Telegram preview, and the post goes live after approval (`/admin/approve` or the admin Blog tab).
- **Contact form**: `/api/contact` → Telegram bot.

## Local development

```bash
npm install
cp .env.example .env.local   # fill in the values
npm run dev                  # http://localhost:3000
```

Scripts: `npm run dev`, `npm run build`, `npm start`, `npm run lint` (tsc), `npm test` (vitest).

## Environment variables

See `.env.example`. Client-side values must be prefixed with `NEXT_PUBLIC_`; everything else stays server-only.

## Database

Run the SQL files in the Supabase SQL editor, in order:

1. `docs/security/supabase-rls.sql` — `admin_content` + `admins` allowlist.
2. `docs/security/supabase-blog-products.sql` — `products`, `posts`, `post_topics`, `subscribers`, seed products.

Images uploaded from `/admin` go to Cloudflare R2 through the `admov-cdn` Worker (bucket `admin-uploads`, served from https://cdn.admov.io), not Supabase Storage. Upgrading a project provisioned before that switch? Re-run the SQL above: it drops the old `media` bucket policies. Delete the bucket itself from the Supabase dashboard once nothing references it.

Then add your admin user to `public.admins` (instructions at the bottom of the first file).

## Deployment

The project is linked to Vercel (`admov-website`). Deploy with `vercel` (preview) or `vercel --prod`. Cron jobs are defined in `vercel.json` and run on production deployments only.
