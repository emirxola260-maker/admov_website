import "server-only";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { BlogGenerationError, readParsed } from "./parse";
import { Deadline, MIN_CALL_MS } from "./deadline";
import { EnPostSchema, LocalizedPostSchema, enforceLimits, type EnPost, type LocalizedPost } from "./schema";
import {
  PROMPT_VERSION,
  buildEnUserPrompt,
  buildLocalizeUserPrompt,
  buildSystemPrompt,
  findPillar,
  PILLARS,
  type Pillar,
  type ProductBrief,
} from "./prompts";

export { BlogGenerationError, readParsed, type GenerationErrorKind } from "./parse";

/**
 * OpenAI model for the blog writer. Override with OPENAI_MODEL in Vercel.
 * Use a gpt-5.x reasoning model — the "-chat" variants and gpt-4.x reject the
 * `reasoning` parameter, which is why it is only sent when the id supports it.
 * gpt-5.6-luna is the cost-optimised tier of the 5.6 family (sol > terra > luna);
 * move up a tier here if article quality matters more than cost.
 */
export const BLOG_MODEL = process.env.OPENAI_MODEL || "gpt-5.6-luna";

const SUPPORTS_REASONING = /^(gpt-5(?!.*chat)|o[1-9])/.test(BLOG_MODEL);

function reasoning(effort: "low" | "medium" | "high") {
  return SUPPORTS_REASONING ? { reasoning: { effort } } : {};
}

// Per-call caps. Each is further shrunk by whatever the run has left.
const EN_CAP_MS = 140_000;
const EN_RESERVE_MS = 90_000; // leave room for both localizations
const LOCALIZE_CAP_MS = 80_000;
const LOCALIZE_RESERVE_MS = 15_000;
/** A localization retry is only started when at least this much budget is left. */
export const LOCALIZE_RETRY_MS = 50_000;

export interface GeneratedPost {
  pillar: string;
  topic: string;
  en: EnPost;
  ar: LocalizedPost;
  tr: LocalizedPost;
  model: string;
  prompt_version: string;
  usage: Record<string, unknown>;
}

export interface GenerateInput {
  /** Concrete pillar id, resolved by the caller so a refusal retry can pick a different one. */
  pillar?: string | null;
  topic?: string | null;
  recentTitles: string[];
  products: ProductBrief[];
  deadline: Deadline;
  /** Injected in tests. */
  client?: OpenAI;
}

function getClient(client?: OpenAI): OpenAI {
  // Timeouts are set per request from the remaining budget; the SDK's own retry
  // is off so one slow call can never silently double the wall-clock cost.
  return client ?? new OpenAI({ maxRetries: 0 });
}

function callTimeout(deadline: Deadline, capMs: number, reserveMs: number, label: string): number {
  const timeout = deadline.timeoutFor(capMs, reserveMs);
  if (timeout < MIN_CALL_MS) {
    throw new BlogGenerationError("budget", `${label}: not enough time left in this run (${Math.round(deadline.remaining() / 1000)}s)`);
  }
  return timeout;
}

export async function generateEnglishPost(
  client: OpenAI,
  input: { system: string; pillar: Pillar; topic?: string | null; recentTitles: string[]; deadline: Deadline },
): Promise<{ post: EnPost; usage: unknown }> {
  const timeout = callTimeout(input.deadline, EN_CAP_MS, EN_RESERVE_MS, "English draft");
  const response = await client.responses.parse(
    {
      model: BLOG_MODEL,
      instructions: input.system,
      input: [{ role: "user", content: buildEnUserPrompt(input) }],
      ...reasoning("medium"),
      max_output_tokens: 12000,
      text: { format: zodTextFormat(EnPostSchema, "blog_post_en") },
    },
    { timeout },
  );
  const post = readParsed(response, "English draft");
  return { post: enforceLimits(post), usage: response.usage };
}

export async function localizePost(
  client: OpenAI,
  input: { system: string; lang: "ar" | "tr"; en: EnPost; deadline: Deadline },
): Promise<{ post: LocalizedPost; usage: unknown }> {
  const label = `${input.lang.toUpperCase()} localization`;
  const timeout = callTimeout(input.deadline, LOCALIZE_CAP_MS, LOCALIZE_RESERVE_MS, label);
  const response = await client.responses.parse(
    {
      model: BLOG_MODEL,
      instructions: input.system,
      input: [{ role: "user", content: buildLocalizeUserPrompt(input.lang, input.en) }],
      ...reasoning("low"),
      max_output_tokens: 12000,
      text: { format: zodTextFormat(LocalizedPostSchema, `blog_post_${input.lang}`) },
    },
    { timeout },
  );
  const post = readParsed(response, label);
  return { post: enforceLimits(post), usage: response.usage };
}

async function localizeWithRetry(client: OpenAI, system: string, lang: "ar" | "tr", en: EnPost, deadline: Deadline) {
  try {
    return await localizePost(client, { system, lang, en, deadline });
  } catch (err) {
    // A refusal will not change on a second attempt, and a retry that cannot
    // finish inside the budget would get the whole function killed.
    if (err instanceof BlogGenerationError && (err.kind === "refusal" || err.kind === "budget")) throw err;
    if (!deadline.allows(LOCALIZE_RETRY_MS)) throw err;
    return localizePost(client, { system, lang, en, deadline });
  }
}

/**
 * Two-stage generation: the English article first, then the Arabic and Turkish
 * localizations in parallel. Every call is bounded by the shared deadline so the
 * run always finishes inside the function's time limit.
 */
export async function generateDailyPost(input: GenerateInput): Promise<GeneratedPost> {
  const client = getClient(input.client);
  const pillar = findPillar(input.pillar) ?? PILLARS[0];
  const system = buildSystemPrompt(input.products);
  const { deadline } = input;

  const t0 = Date.now();
  const en = await generateEnglishPost(client, {
    system,
    pillar,
    topic: input.topic,
    recentTitles: input.recentTitles,
    deadline,
  });
  const t1 = Date.now();
  const [ar, tr] = await Promise.all([
    localizeWithRetry(client, system, "ar", en.post, deadline),
    localizeWithRetry(client, system, "tr", en.post, deadline),
  ]);
  const t2 = Date.now();

  return {
    pillar: pillar.id,
    topic: en.post.topic,
    en: en.post,
    ar: ar.post,
    tr: tr.post,
    model: BLOG_MODEL,
    prompt_version: PROMPT_VERSION,
    usage: {
      en: en.usage,
      ar: ar.usage,
      tr: tr.usage,
      timings_ms: { en: t1 - t0, localize: t2 - t1, total: t2 - t0 },
    },
  };
}

/** Re-run only the localization stage for one language (admin "Regenerate AR/TR"). */
export async function regenerateLocalization(input: {
  lang: "ar" | "tr";
  en: EnPost;
  products: ProductBrief[];
  deadline: Deadline;
  client?: OpenAI;
}) {
  const client = getClient(input.client);
  const system = buildSystemPrompt(input.products);
  return localizeWithRetry(client, system, input.lang, input.en, input.deadline);
}

/** Column map for the posts table. */
export function toPostColumns(g: GeneratedPost, slug: string) {
  return {
    slug,
    pillar: g.pillar,
    topic: g.topic,
    tags: g.en.tags,
    title: { en: g.en.title, ar: g.ar.title, tr: g.tr.title },
    excerpt: { en: g.en.excerpt, ar: g.ar.excerpt, tr: g.tr.excerpt },
    body_md: { en: g.en.body_md, ar: g.ar.body_md, tr: g.tr.body_md },
    meta: {
      en: { seoTitle: g.en.seoTitle, seoDescription: g.en.seoDescription, keywords: g.en.keywords },
      ar: { seoTitle: g.ar.seoTitle, seoDescription: g.ar.seoDescription, keywords: g.ar.keywords },
      tr: { seoTitle: g.tr.seoTitle, seoDescription: g.tr.seoDescription, keywords: g.tr.keywords },
    },
    model: g.model,
    prompt_version: g.prompt_version,
    usage: g.usage,
  };
}
