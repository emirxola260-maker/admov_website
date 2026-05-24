# ADMOV Website Security Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminate every critical/high security issue in the ADMOV site by moving secrets and authentication server-side, locking down the database, and hardening HTTP responses — without breaking the live site.

**Architecture:** The site stays a Vite/React SPA on Vercel. A new Vercel Serverless Function (`/api/contact`) holds the Telegram bot token server-side and relays the contact form. The admin panel keeps its UI but is gated by **real Supabase Auth** (server-verified JWT) instead of a hardcoded password + localStorage flag, and the `admin_content` table is protected by Row Level Security so only authenticated admins can write. Security headers (CSP, HSTS, anti-clickjacking) are added via `vercel.json`, and all admin-controlled URLs are sanitized to `http(s)` before rendering.

**Tech Stack:** Vite 6, React 19, TypeScript, Vercel Functions (`@vercel/node`), Supabase (`@supabase/supabase-js` Auth + RLS), Vitest (new, for unit tests).

---

## Pre-flight notes (read before starting)

- **This repo is not under git yet.** Task 1 initializes it so each checkpoint is recoverable. If you choose not to use git, skip the `git commit` steps — everything else still applies.
- **Two things must be done by a human in external dashboards** (Task 0 and parts of Task 11): rotating the Telegram token in @BotFather, and creating the admin user + RLS policies in the Supabase dashboard. These cannot be automated from code.
- **Local testing of `/api/contact` requires `vercel dev`** (plain `vite` does not run serverless functions). `npm run dev` is fine for everything else.
- The leaked Telegram token (`8641398519:AAG...`) and admin password (`OLD_PW_REMOVED`) are already public in the deployed bundle. Treat both as compromised — Task 0 rotates the token; the password is removed entirely.

---

## File Structure

**New files:**
- `api/contact.ts` — Vercel serverless function: validates the contact payload, sends it to Telegram using a server-side token. One responsibility: the contact endpoint.
- `api/_lib/telegram.ts` — Pure, testable helpers (HTML escaping, payload validation, message building). The `_`-prefixed folder is ignored by Vercel's function router, so it is never exposed as an endpoint.
- `api/_lib/telegram.test.ts` — Unit tests for the helpers.
- `src/lib/security.ts` — Client-side `sanitizeHttpUrl()` helper (one responsibility: URL allow-listing).
- `src/lib/security.test.ts` — Unit tests for `sanitizeHttpUrl()`.
- `vitest.config.ts` — Test runner config (reuses the `@` alias).
- `docs/security/supabase-rls.sql` — The RLS policy SQL to paste into the Supabase SQL editor (kept in-repo as documentation/record).

**Modified files:**
- `vercel.json` — exclude `/api` from the SPA rewrite; add security headers.
- `vite.config.ts` — remove the `GEMINI_API_KEY` `define`; disable the inline modulepreload polyfill (keeps CSP `script-src 'self'` clean).
- `src/components/Contact.tsx` — remove hardcoded token; POST to `/api/contact`; sanitize social links.
- `src/components/Work.tsx` — sanitize media URLs in `getMediaUrl`.
- `src/pages/WorkPage.tsx` — sanitize `project.videoUrl` / `project.imageUrl` at render.
- `src/admin/AdminLogin.tsx` — email + password via `supabase.auth.signInWithPassword`.
- `src/admin/AdminPage.tsx` — gate on a real Supabase session, not localStorage.
- `src/admin/AdminDashboard.tsx` — route sign-out through the `onLogout` prop (Supabase `signOut`).
- `.env.example` — document the real env vars (client vs. server).
- `package.json` — add `@vercel/node`, `vitest`; add a `test` script.

---

## Task 0: Rotate the compromised Telegram token (MANUAL — do this first)

No code. This must happen because the current token is already public.

- [ ] **Step 1: Revoke and reissue the bot token**

In Telegram, open a chat with **@BotFather** → `/mybots` → select the ADMOV bot → **API Token** → **Revoke current token**. Copy the **new** token. The old token `8641398519:AAG...` is now dead and cannot be abused.

- [ ] **Step 2: Note the chat ID**

The destination chat ID is `107980558` (unchanged — a chat ID is not a secret on its own, but it will now live in server-side env only).

- [ ] **Step 3: Keep the new token handy** for Task 1. Do not paste it into any file under `src/` or any `VITE_`-prefixed variable.

---

## Task 1: Initialize git + configure environment variables

**Files:**
- Verify: `.gitignore` (already ignores `.env*`, `.env*.local`, `.vercel` — good)
- Modify (Vercel dashboard / CLI): project environment variables
- Create: `.env.local` entries for local `vercel dev`

- [ ] **Step 1: Initialize git for safe checkpoints**

```bash
git init
git add -A
git commit -m "chore: baseline before security hardening"
```

Expected: a baseline commit. (`.env.local` and `.vercel` are gitignored, so the OIDC token and secrets are NOT committed — confirm with `git status` showing them untracked/ignored.)

- [ ] **Step 2: Add server-side secrets to Vercel (production + preview + development)**

```bash
# Use the NEW token from Task 0 when prompted. Mark as Production, Preview, AND Development.
vercel env add TELEGRAM_BOT_TOKEN
vercel env add TELEGRAM_CHAT_ID
```

When prompted for `TELEGRAM_CHAT_ID`, enter `107980558`. **Do not** prefix these with `VITE_` — that would re-expose them to the browser.

- [ ] **Step 3: Add the same secrets to `.env.local` for local `vercel dev`**

Append to `.env.local` (this file is gitignored):

```
TELEGRAM_BOT_TOKEN="<new-token-from-botfather>"
TELEGRAM_CHAT_ID="107980558"
```

- [ ] **Step 4: Confirm the Supabase client vars exist in Vercel**

```bash
vercel env ls
```

Expected: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are present (these are already used by `src/lib/supabase.ts`). If missing, add them with `vercel env add` (these MAY keep the `VITE_` prefix — the anon key is designed to be public).

---

## Task 2: Harden `vercel.json` (rewrite exclusion + security headers)

**Files:**
- Modify: `vercel.json`

- [ ] **Step 1: Replace the file contents**

The current catch-all rewrite `/(.*)` would swallow `/api/*` and break the function. The new rewrite excludes `/api` via negative lookahead, and a `headers` block adds defense-in-depth.

```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "rewrites": [
    { "source": "/((?!api/).*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
        { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" },
        { "key": "Content-Security-Policy", "value": "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https:; media-src 'self' blob: https:; connect-src 'self' https://*.supabase.co wss://*.supabase.co; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'" }
      ]
    }
  ]
}
```

- [ ] **Step 2: Sanity-check the JSON**

Run: `node -e "JSON.parse(require('fs').readFileSync('vercel.json','utf8')); console.log('valid json')"`
Expected: `valid json`

- [ ] **Step 3: Commit**

```bash
git add vercel.json
git commit -m "feat(security): exclude /api from SPA rewrite, add security headers + CSP"
```

> CSP note: `style-src 'unsafe-inline'` is required because the app uses inline `style={}` attributes throughout. `script-src 'self'` is kept strict; Task 12 disables Vite's inline modulepreload polyfill so no inline script is emitted. Task 13 includes a browser-console check for CSP violations — if any legitimate resource is blocked, widen only that directive.

---

## Task 3: Set up Vitest

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`

- [ ] **Step 1: Install Vitest and the Vercel Node types**

```bash
npm install -D vitest @vercel/node
```

Expected: both appear under `devDependencies` in `package.json`.

- [ ] **Step 2: Add a `test` script to `package.json`**

In the `"scripts"` block, add:

```json
    "test": "vitest run"
```

(Keep existing scripts; just add this line.)

- [ ] **Step 3: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "api/**/*.test.ts"],
  },
});
```

- [ ] **Step 4: Verify the runner starts (no tests yet is fine)**

Run: `npm test`
Expected: Vitest runs and reports "No test files found" or exits 0. (It will find tests after Task 4.)

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json vitest.config.ts
git commit -m "chore: add vitest + @vercel/node for security work"
```

---

## Task 4: Telegram helper module (TDD)

**Files:**
- Create: `api/_lib/telegram.ts`
- Test: `api/_lib/telegram.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `api/_lib/telegram.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { escapeHtml, validateContactPayload, buildTelegramMessage } from "./telegram";

describe("escapeHtml", () => {
  it("escapes HTML-significant characters", () => {
    expect(escapeHtml('<a href="x">&')).toBe("&lt;a href=\"x\"&gt;&amp;");
  });
  it("coerces non-strings safely", () => {
    expect(escapeHtml(undefined as unknown as string)).toBe("undefined");
  });
});

describe("validateContactPayload", () => {
  it("accepts a valid payload and trims fields", () => {
    const r = validateContactPayload({
      name: "  Jane  ", email: "jane@example.com", phone: "+1 555 1234",
      workType: "AI Video", date: "Mon May 25", message: "hi", lang: "en",
    });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.data.name).toBe("Jane");
      expect(r.data.email).toBe("jane@example.com");
    }
  });
  it("rejects a missing name", () => {
    const r = validateContactPayload({ name: "", email: "a@b.co", phone: "12345" });
    expect(r.ok).toBe(false);
  });
  it("rejects an invalid email", () => {
    const r = validateContactPayload({ name: "Jane", email: "not-an-email", phone: "12345" });
    expect(r.ok).toBe(false);
  });
  it("rejects an over-long message", () => {
    const r = validateContactPayload({ name: "Jane", email: "a@b.co", phone: "12345", message: "x".repeat(2001) });
    expect(r.ok).toBe(false);
  });
  it("rejects a non-object body", () => {
    expect(validateContactPayload(null).ok).toBe(false);
    expect(validateContactPayload("nope" as unknown as object).ok).toBe(false);
  });
});

describe("buildTelegramMessage", () => {
  it("escapes user input so injected HTML is neutralized", () => {
    const msg = buildTelegramMessage({
      name: "<b>x</b>", email: "a@b.co", phone: "1", workType: "", date: "", message: "<script>", lang: "en",
    });
    expect(msg).toContain("&lt;b&gt;x&lt;/b&gt;");
    expect(msg).toContain("&lt;script&gt;");
    expect(msg).not.toContain("<script>");
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test`
Expected: FAIL — `Cannot find module './telegram'` (file does not exist yet).

- [ ] **Step 3: Implement `api/_lib/telegram.ts`**

```ts
export interface ContactPayload {
  name: string;
  email: string;
  phone: string;
  workType: string;
  date: string;
  message: string;
  lang: string;
}

const LANG_LABELS: Record<string, string> = {
  en: "English",
  ar: "Arabic",
  tr: "Turkish",
};

export function escapeHtml(input: string): string {
  return String(input)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

type ValidationResult =
  | { ok: true; data: ContactPayload }
  | { ok: false; error: string };

export function validateContactPayload(body: unknown): ValidationResult {
  if (!body || typeof body !== "object") return { ok: false, error: "Invalid request body" };
  const b = body as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

  const name = str(b.name);
  const email = str(b.email);
  const phone = str(b.phone);
  const message = str(b.message);
  const workType = str(b.workType);
  const date = str(b.date);
  const lang = str(b.lang) || "en";

  if (name.length < 1 || name.length > 100) return { ok: false, error: "Name is required" };
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(email) || email.length > 200) return { ok: false, error: "A valid email is required" };
  if (phone.length < 3 || phone.length > 40) return { ok: false, error: "Phone is required" };
  if (message.length > 2000) return { ok: false, error: "Message is too long" };
  if (workType.length > 100) return { ok: false, error: "Invalid work type" };
  if (date.length > 60) return { ok: false, error: "Invalid date" };
  if (lang.length > 5) return { ok: false, error: "Invalid language" };

  return { ok: true, data: { name, email, phone, workType, date, message, lang } };
}

export function buildTelegramMessage(data: ContactPayload): string {
  return [
    "🎯 <b>New Contact Form Submission</b>",
    "",
    `👤 <b>Name:</b> ${escapeHtml(data.name)}`,
    `📧 <b>Email:</b> ${escapeHtml(data.email)}`,
    `📱 <b>Phone:</b> ${escapeHtml(data.phone)}`,
    `🛠 <b>Service:</b> ${escapeHtml(data.workType) || "Not selected"}`,
    `📅 <b>Preferred Date:</b> ${escapeHtml(data.date) || "Not selected"}`,
    `🌐 <b>Language:</b> ${escapeHtml(LANG_LABELS[data.lang] || data.lang)}`,
    "",
    "📝 <b>Message:</b>",
    escapeHtml(data.message) || "No message",
    "",
    "---",
    "Sent from ADMOV Website",
  ].join("\n");
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS (all assertions green).

- [ ] **Step 5: Commit**

```bash
git add api/_lib/telegram.ts api/_lib/telegram.test.ts
git commit -m "feat(api): add tested Telegram helpers with HTML escaping + validation"
```

---

## Task 5: Telegram serverless function `/api/contact`

**Files:**
- Create: `api/contact.ts`

- [ ] **Step 1: Implement the function**

```ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { validateContactPayload, buildTelegramMessage } from "./_lib/telegram";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.error("TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID not configured");
    return res.status(500).json({ error: "Server is not configured" });
  }

  const result = validateContactPayload(req.body);
  if (!result.ok) {
    return res.status(400).json({ error: result.error });
  }

  try {
    const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: buildTelegramMessage(result.data),
        parse_mode: "HTML",
      }),
    });

    if (!tgRes.ok) {
      console.error("Telegram API error:", await tgRes.text());
      return res.status(502).json({ error: "Failed to deliver message" });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Error sending to Telegram:", err);
    return res.status(502).json({ error: "Failed to deliver message" });
  }
}
```

- [ ] **Step 2: Type-check**

Run: `npm run lint`
Expected: PASS (no type errors). If `tsc` complains it cannot find `@vercel/node`, re-run `npm install -D @vercel/node`.

- [ ] **Step 3: Commit**

```bash
git add api/contact.ts
git commit -m "feat(api): add /api/contact serverless function (token stays server-side)"
```

---

## Task 6: Point the contact form at `/api/contact` and remove the hardcoded token

**Files:**
- Modify: `src/components/Contact.tsx`

- [ ] **Step 1: Delete the hardcoded constants and the direct Telegram call**

Remove these lines (currently `Contact.tsx:163-214`):

```ts
const TELEGRAM_BOT_TOKEN = "8641398519:AAG…REVOKED";
const TELEGRAM_CHAT_ID = "107980558";

async function sendToTelegram(data: {
  name: string; email: string; phone: string; workType: string; date: string; message: string; lang: string;
}) {
  /* ...entire body including the api.telegram.org fetch... */
}
```

- [ ] **Step 2: Replace with a call to the backend**

Insert this in the same location:

```ts
async function sendContactForm(data: {
  name: string;
  email: string;
  phone: string;
  workType: string;
  date: string;
  message: string;
  lang: string;
}) {
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || "Failed to send message");
  }
  return response.json();
}
```

- [ ] **Step 3: Update the form `onSubmit` to call `sendContactForm`**

In the `<form onSubmit={...}>` handler (currently `Contact.tsx:345`), change the call from `await sendToTelegram({ ... })` to:

```ts
await sendContactForm({
  name,
  email,
  phone: `${selectedCountry.code} ${phone}`,
  workType: selectedWorkType,
  date: selectedDate,
  message,
  lang,
});
```

(Leave the surrounding `try/catch`, `setIsSubmitted`, and reset logic unchanged.)

- [ ] **Step 4: Type-check**

Run: `npm run lint`
Expected: PASS, and a project-wide search shows the token is gone:
Run: `grep -rn "8641398519" src/ ; echo "exit: $?"`
Expected: no matches.

- [ ] **Step 5: Commit**

```bash
git add src/components/Contact.tsx
git commit -m "feat(contact): send via /api/contact, remove hardcoded Telegram token"
```

---

## Task 7: `sanitizeHttpUrl` helper (TDD)

**Files:**
- Create: `src/lib/security.ts`
- Test: `src/lib/security.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `src/lib/security.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { sanitizeHttpUrl } from "./security";

describe("sanitizeHttpUrl", () => {
  it("allows https and http URLs", () => {
    expect(sanitizeHttpUrl("https://cdn.example.com/a.jpg")).toBe("https://cdn.example.com/a.jpg");
    expect(sanitizeHttpUrl("http://example.com/v.mp4")).toBe("http://example.com/v.mp4");
  });
  it("blocks javascript: URLs", () => {
    expect(sanitizeHttpUrl("javascript:alert(1)")).toBe("");
  });
  it("blocks data: URLs by default", () => {
    expect(sanitizeHttpUrl("data:text/html,<script>alert(1)</script>")).toBe("");
  });
  it("returns the provided fallback for invalid input", () => {
    expect(sanitizeHttpUrl("", "/placeholder.png")).toBe("/placeholder.png");
    expect(sanitizeHttpUrl(undefined, "/placeholder.png")).toBe("/placeholder.png");
    expect(sanitizeHttpUrl("not a url", "/placeholder.png")).toBe("/placeholder.png");
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test`
Expected: FAIL — `Cannot find module './security'`.

- [ ] **Step 3: Implement `src/lib/security.ts`**

```ts
/**
 * Returns the URL only if it uses the http(s) scheme; otherwise returns `fallback`.
 * Prevents `javascript:`, `data:`, and other dangerous schemes from reaching
 * `href`/`src` attributes when the value comes from admin-editable content.
 */
export function sanitizeHttpUrl(url: string | null | undefined, fallback = ""): string {
  if (!url || typeof url !== "string") return fallback;
  const trimmed = url.trim();
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "http:" || parsed.protocol === "https:" ? trimmed : fallback;
  } catch {
    return fallback;
  }
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/security.ts src/lib/security.test.ts
git commit -m "feat(security): add tested sanitizeHttpUrl helper"
```

---

## Task 8: Apply `sanitizeHttpUrl` to admin-controlled render sinks

**Files:**
- Modify: `src/components/Work.tsx` (lines 8, 18-24)
- Modify: `src/pages/WorkPage.tsx` (line ~13 import area + 449, 453, 458)
- Modify: `src/components/Contact.tsx` (social links ~296, 304, 314)

- [ ] **Step 1: Sanitize media URLs in `Work.tsx`**

Add the import near the other imports (after line 7):

```ts
import { sanitizeHttpUrl } from "@/lib/security";
```

Replace `getMediaUrl` (lines 18-24) with:

```ts
  const getMediaUrl = (index: number, field: "imageUrl" | "videoUrl") => {
    const adminProject = adminContent?.work?.projects?.[index];
    if (field === "videoUrl") {
      return sanitizeHttpUrl(adminProject?.videoUrl || "");
    }
    return sanitizeHttpUrl(adminProject?.imageUrl || content.work[index]?.imageUrl || "");
  };
```

This covers all six sinks (`Work.tsx:105,109,121,203,207,212`) at their single source.

- [ ] **Step 2: Sanitize media URLs in `WorkPage.tsx`**

Add the import alongside the existing imports at the top of the file:

```ts
import { sanitizeHttpUrl } from "@/lib/security";
```

At line 449 change `src={project.videoUrl}` to:

```tsx
          src={sanitizeHttpUrl(project.videoUrl)}
```

At line 453 change `poster={project.imageUrl || undefined}` to:

```tsx
          poster={sanitizeHttpUrl(project.imageUrl) || undefined}
```

At line 458 change `src={project.imageUrl}` to:

```tsx
          src={sanitizeHttpUrl(project.imageUrl)}
```

- [ ] **Step 3: Sanitize the social links in `Contact.tsx`**

Add the import near the top (after line 7):

```ts
import { sanitizeHttpUrl } from "@/lib/security";
```

Change the three social `href`s (currently lines 296, 304, 314) so admin-edited values can't carry a `javascript:` scheme:

```tsx
  href={sanitizeHttpUrl(contactInfo.instagram, "https://www.instagram.com/admov.io")}
```
```tsx
  href={sanitizeHttpUrl(contactInfo.tiktok, "https://www.tiktok.com/@admov.io")}
```
```tsx
  href={sanitizeHttpUrl(contactInfo.whatsapp, "https://wa.me/905375755445")}
```

(The `mailto:${contactInfo.email}` link does not need this — a bad value yields a harmless `mailto:` string, not script execution.)

- [ ] **Step 4: Type-check**

Run: `npm run lint`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/Work.tsx src/pages/WorkPage.tsx src/components/Contact.tsx
git commit -m "fix(security): sanitize admin-controlled URLs before rendering (stored-XSS guard)"
```

---

## Task 9: Replace the hardcoded admin login with Supabase Auth

**Files:**
- Modify: `src/admin/AdminLogin.tsx`

- [ ] **Step 1: Add the Supabase import and an email field state**

At the top of `AdminLogin.tsx`, after the existing imports, add:

```ts
import { supabase } from "@/lib/supabase";
```

Inside the component, alongside the existing `password` state (line 10), add:

```ts
  const [email, setEmail] = React.useState("");
```

- [ ] **Step 2: Replace the `handleSubmit` body**

Replace the current `handleSubmit` (lines 14-28, the one comparing against `"OLD_PW_REMOVED"`) with:

```ts
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!supabase) {
      setError("Authentication is not configured. Please contact the administrator.");
      setLoading(false);
      return;
    }

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError("Invalid email or password. Please try again.");
    } else {
      onLogin();
    }
    setLoading(false);
  };
```

- [ ] **Step 3: Add the email input to the form**

Immediately before the existing password field block (the `<div className="space-y-2">` that contains the password `<label>`/`<input>`, around line 88), insert an email field:

```tsx
              <div className="space-y-2">
                <label
                  className="block text-[11px] uppercase tracking-wider font-semibold text-[#474553]/70 ml-1"
                  htmlFor="admin-email"
                >
                  Email
                </label>
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  placeholder="you@admov.io"
                  className="w-full bg-[#F6F3F2] border-none rounded-xl py-4 px-5 text-[#1B1C1C] placeholder:text-[#474553]/40 focus:ring-2 focus:ring-[#5749C2]/20 transition-all duration-300 outline-none text-sm"
                  required
                />
              </div>
```

(Leave the existing password input as-is.)

- [ ] **Step 4: Type-check**

Run: `npm run lint`
Expected: PASS, and the hardcoded password is gone:
Run: `grep -rn "OLD_PW_REMOVED" src/ ; echo "exit: $?"`
Expected: no matches.

- [ ] **Step 5: Commit**

```bash
git add src/admin/AdminLogin.tsx
git commit -m "feat(admin): authenticate via Supabase Auth, remove hardcoded password"
```

---

## Task 10: Gate the admin route on a real Supabase session

**Files:**
- Modify: `src/admin/AdminPage.tsx`
- Modify: `src/admin/AdminDashboard.tsx`

- [ ] **Step 1: Replace `AdminPage.tsx` entirely**

```tsx
import * as React from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { AdminLogin } from "./AdminLogin";
import { AdminDashboard } from "./AdminDashboard";

type AuthStatus = "loading" | "in" | "out";

export function AdminPage() {
  const [status, setStatus] = React.useState<AuthStatus>("loading");

  React.useEffect(() => {
    if (!supabase) {
      setStatus("out");
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setStatus(data.session ? "in" : "out");
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setStatus(session ? "in" : "out");
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: "#FCF9F8" }}>
        <Loader2 size={40} className="animate-spin text-[#5749C2]" />
      </div>
    );
  }

  if (status === "out") {
    return <AdminLogin onLogin={() => setStatus("in")} />;
  }

  return (
    <AdminDashboard
      onLogout={async () => {
        if (supabase) await supabase.auth.signOut();
        setStatus("out");
      }}
    />
  );
}
```

This removes the `localStorage.getItem("admov_admin_auth")` gate entirely — there is no client-settable flag to forge anymore.

- [ ] **Step 2: Route the dashboard sign-out through the prop**

In `AdminDashboard.tsx`, the sidebar sign-out button (currently lines 302-311) calls `localStorage.removeItem("admov_admin_auth"); onLogout();`. Replace its `onClick` with just:

```tsx
            onClick={onLogout}
```

(The `onLogout` prop now performs the real Supabase `signOut`. No other changes to `AdminDashboard.tsx` are needed — `saveAdminContentToSupabase` automatically sends the authenticated user's JWT once logged in.)

- [ ] **Step 3: Type-check**

Run: `npm run lint`
Expected: PASS, and the localStorage auth flag is gone:
Run: `grep -rn "admov_admin_auth" src/ ; echo "exit: $?"`
Expected: no matches.

- [ ] **Step 4: Commit**

```bash
git add src/admin/AdminPage.tsx src/admin/AdminDashboard.tsx
git commit -m "feat(admin): gate /admin on a verified Supabase session, drop localStorage bypass"
```

---

## Task 11: Lock down Supabase with RLS + disable public signups (MANUAL dashboard work)

**Files:**
- Create: `docs/security/supabase-rls.sql` (record of the policies)

> Without this task, the new login is cosmetic: anyone could still `signUp` to obtain the `authenticated` role, or write via the anon key if RLS is off. This is the task that actually protects the database.

- [ ] **Step 1: Save the policy SQL in-repo for the record**

Create `docs/security/supabase-rls.sql`:

```sql
-- Run in the Supabase SQL editor for the ADMOV project.
-- Table: public.admin_content (single row, id = 'admov_main')

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
```

- [ ] **Step 2: Apply the SQL in Supabase**

Open the Supabase dashboard → **SQL Editor** → paste the contents of `docs/security/supabase-rls.sql` → **Run**. Confirm under **Authentication → Policies** that `admin_content` shows RLS enabled with the three policies.

- [ ] **Step 3: Create the admin user**

Supabase dashboard → **Authentication → Users → Add user** → enter the admin email and a strong password (this replaces the old `OLD_PW_REMOVED`; do not reuse it). This is the credential you'll use at `/admin`.

- [ ] **Step 4: Disable public sign-ups**

Supabase dashboard → **Authentication → Providers → Email** (or **Authentication → Settings**) → turn **OFF** "Allow new users to sign up" / "Enable sign-ups". This ensures only the user created in Step 3 can ever hold the `authenticated` role, so RLS writes remain admin-only.

- [ ] **Step 5: Commit the SQL record**

```bash
git add docs/security/supabase-rls.sql
git commit -m "docs(security): record Supabase RLS policies for admin_content"
```

---

## Task 12: Remove the `GEMINI_API_KEY` build injection + tidy config

**Files:**
- Modify: `vite.config.ts`
- Modify: `.env.example`

- [ ] **Step 1: Edit `vite.config.ts`**

Remove the `define` block (lines 10-12) that inlines `GEMINI_API_KEY` into the bundle, and disable the inline modulepreload polyfill so CSP `script-src 'self'` stays clean. The result:

```ts
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      modulePreload: { polyfill: false },
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],
            'vendor-motion': ['motion'],
            'vendor-gsap': ['gsap'],
            'vendor-ogl': ['ogl'],
            'vendor-supabase': ['@supabase/supabase-js'],
          },
        },
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
```

(`loadEnv` is no longer needed since the `define` is gone.)

- [ ] **Step 2: Rewrite `.env.example` to document the real variables**

```
# ──────────────────────────────────────────────────────────────
# CLIENT-SIDE (exposed to the browser by Vite — only put PUBLIC values here)
# The Supabase anon key is designed to be public; access is controlled by RLS.
# ──────────────────────────────────────────────────────────────
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-public-anon-key"

# ──────────────────────────────────────────────────────────────
# SERVER-SIDE ONLY (Vercel env vars — NEVER prefix these with VITE_)
# Used by api/contact.ts. These must never appear in the client bundle.
# ──────────────────────────────────────────────────────────────
TELEGRAM_BOT_TOKEN="your-telegram-bot-token"
TELEGRAM_CHAT_ID="107980558"
```

- [ ] **Step 3: Type-check + build**

Run: `npm run lint && npm run build`
Expected: both succeed.

- [ ] **Step 4: Commit**

```bash
git add vite.config.ts .env.example
git commit -m "chore(security): drop GEMINI_API_KEY build inject, document env vars, disable inline preload"
```

---

## Task 13: Full verification + deploy

**Files:** none (verification + deploy)

- [ ] **Step 1: Run the unit tests**

Run: `npm test`
Expected: all tests pass (telegram helpers + sanitizeHttpUrl).

- [ ] **Step 2: Clean build and confirm NO secrets remain in the bundle**

```bash
npm run clean && npm run build
grep -rn "8641398519" dist/ ; echo "token exit: $?"
grep -rn "OLD_PW_REMOVED" dist/ ; echo "password exit: $?"
grep -rn "admov_admin_auth" dist/ ; echo "flag exit: $?"
```

Expected: all three `grep`s print **no matches** (exit `1`). This is the proof that closed the original critical leaks.

- [ ] **Step 3: Run the full app locally with functions**

Run: `vercel dev`
Then in the browser:
- Submit the contact form → expect the success message and a Telegram message delivered to chat `107980558` (escaped, no HTML injection). Try a name like `<b>test</b>` and confirm it arrives as literal text.
- Open DevTools → Network: the form should POST to `/api/contact` (same origin), **not** to `api.telegram.org`.
- Go to `/admin` → confirm you get the login screen. In the console, run `localStorage.setItem("admov_admin_auth","true")` and reload → confirm you are STILL on the login screen (bypass is dead).
- Log in with the Supabase admin user from Task 11 → confirm the dashboard loads, make an edit, **Save**, and confirm it persists after reload (RLS write works for the authenticated admin).

- [ ] **Step 4: Confirm anonymous writes are rejected**

In a normal browser tab (logged out of admin), open the console on the site and run:

```js
const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2");
const sb = createClient("<VITE_SUPABASE_URL>", "<VITE_SUPABASE_ANON_KEY>");
const { error } = await sb.from("admin_content").update({ content: { hacked: true } }).eq("id", "admov_main");
console.log("anon write error:", error);
```

Expected: a non-null RLS error (e.g. "new row violates row-level security policy"), proving anonymous defacement is blocked.

- [ ] **Step 5: Deploy a preview and check headers + CSP**

```bash
vercel
```

On the preview URL:
```bash
curl -sI https://<preview-url> | grep -iE "content-security-policy|x-frame-options|strict-transport|x-content-type|referrer-policy"
```
Expected: all five headers present. Then load the preview in a browser, open the console, and confirm there are **no CSP violation errors** and the site renders normally (fonts, videos, images, animations). If a legitimate resource is blocked, widen only the affected CSP directive in `vercel.json` and redeploy.

- [ ] **Step 6: Promote to production**

```bash
vercel --prod
```

- [ ] **Step 7: Final commit (if any tweaks were made during verification)**

```bash
git add -A
git commit -m "chore(security): verification fixes"
```

---

## Self-Review (coverage map against the original findings)

| # | Severity | Finding | Addressed by |
|---|---|---|---|
| 1 | Critical | Telegram token in client bundle | Task 0 (rotate), Task 1 (server env), Task 5 (`/api/contact`), Task 6 (remove from client), Task 13 §2 (verify gone) |
| 2 | Critical | Hardcoded admin password | Task 9 (Supabase Auth), Task 13 §2 (verify gone) |
| 3 | Critical | localStorage auth bypass | Task 10 (session gate), Task 13 §3 (verify bypass dead) |
| 4 | Critical | Unauthenticated Supabase writes | Task 11 (RLS + disable signups), Task 13 §4 (verify anon write blocked) |
| 5 | Medium | Missing security headers | Task 2 (headers + CSP), Task 13 §5 (verify) |
| 6 | Medium | Stored-content → href/src XSS | Task 7 (`sanitizeHttpUrl` + tests), Task 8 (apply to all sinks) |
| 7 | Medium | HTML injection into Telegram | Task 4 (`escapeHtml` in `buildTelegramMessage` + test) |
| 8 | Medium | `GEMINI_API_KEY` build inject | Task 12 (remove `define`) |
| 9 | Low | OIDC token in `.env.local` | Task 1 §1 (confirmed gitignored; not committed) |
| 10 | Low | No anti-abuse on contact form | Task 4 (server-side length/type validation). NOTE: rate-limiting/CAPTCHA is out of scope here — see "Deferred" below. |
| 11 | Low | Dependency audit | Deferred — see below. |

**Deferred (intentionally out of scope for this plan):**
- Rate-limiting / CAPTCHA on `/api/contact` (e.g. Vercel BotID or a hCaptcha check). The token is no longer exposed, so abuse impact drops sharply; add later if spam appears.
- `npm audit` remediation — run `npm audit` separately; dependency bumps belong in their own change.
