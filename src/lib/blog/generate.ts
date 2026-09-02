import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { EnPostSchema, LocalizedPostSchema, enforceLimits, type EnPost, type LocalizedPost } from "./schema";
import {
  PROMPT_VERSION,
  buildEnUserPrompt,
  buildLocalizeUserPrompt,
  buildSystemPrompt,
  dayOfYear,
  findPillar,
  pickPillar,
  type Pillar,
  type ProductBrief,
} from "./prompts";

export const BLOG_MODEL = "claude-opus-5";

export type GenerationErrorKind = "refusal" | "truncated" | "parse" | "api";

export class BlogGenerationError extends Error {
  constructor(public kind: GenerationErrorKind, message: string) {
    super(message);
    this.name = "BlogGenerationError";
  }
}

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
  pillar?: string | null;
  topic?: string | null;
  recentTitles: string[];
  recentPillars: string[];
  products: ProductBrief[];
  /** Injected in tests. */
  client?: Anthropic;
}

function getClient(client?: Anthropic): Anthropic {
  // One attempt, generous timeout: the whole pipeline must fit in a 300 s function.
  return client ?? new Anthropic({ timeout: 170_000, maxRetries: 0 });
}

function systemBlock(system: string) {
  return [{ type: "text" as const, text: system, cache_control: { type: "ephemeral" as const } }];
}

function checkStop(stopReason: string | null, label: string) {
  if (stopReason === "refusal") throw new BlogGenerationError("refusal", `${label}: the model declined this topic`);
  if (stopReason === "max_tokens") throw new BlogGenerationError("truncated", `${label}: output hit max_tokens`);
}

export async function generateEnglishPost(
  client: Anthropic,
  input: { system: string; pillar: Pillar; topic?: string | null; recentTitles: string[] },
): Promise<{ post: EnPost; usage: Anthropic.Usage }> {
  const response = await client.messages.parse({
    model: BLOG_MODEL,
    max_tokens: 8000,
    system: systemBlock(input.system),
    messages: [{ role: "user", content: buildEnUserPrompt(input) }],
    output_config: { effort: "high", format: zodOutputFormat(EnPostSchema) },
  });
  checkStop(response.stop_reason, "English draft");
  if (!response.parsed_output) throw new BlogGenerationError("parse", "English draft: no structured output");
  return { post: enforceLimits(response.parsed_output), usage: response.usage };
}

export async function localizePost(
  client: Anthropic,
  input: { system: string; lang: "ar" | "tr"; en: EnPost },
): Promise<{ post: LocalizedPost; usage: Anthropic.Usage }> {
  const response = await client.messages.parse({
    model: BLOG_MODEL,
    max_tokens: 8000,
    system: systemBlock(input.system),
    messages: [{ role: "user", content: buildLocalizeUserPrompt(input.lang, input.en) }],
    output_config: { effort: "medium", format: zodOutputFormat(LocalizedPostSchema) },
  });
  checkStop(response.stop_reason, `${input.lang.toUpperCase()} localization`);
  if (!response.parsed_output) throw new BlogGenerationError("parse", `${input.lang.toUpperCase()} localization: no structured output`);
  return { post: enforceLimits(response.parsed_output), usage: response.usage };
}

async function localizeWithRetry(client: Anthropic, system: string, lang: "ar" | "tr", en: EnPost) {
  try {
    return await localizePost(client, { system, lang, en });
  } catch (err) {
    if (err instanceof BlogGenerationError && err.kind === "refusal") throw err;
    return localizePost(client, { system, lang, en });
  }
}

/**
 * Two-stage generation: English article first (effort high), then Arabic and
 * Turkish localizations in parallel (effort medium). ~2–3 minutes end to end.
 */
export async function generateDailyPost(input: GenerateInput): Promise<GeneratedPost> {
  const client = getClient(input.client);
  const pillar = findPillar(input.pillar) ?? pickPillar(dayOfYear(new Date()), input.recentPillars);
  const system = buildSystemPrompt(input.products);

  const t0 = Date.now();
  const en = await generateEnglishPost(client, { system, pillar, topic: input.topic, recentTitles: input.recentTitles });
  const t1 = Date.now();
  const [ar, tr] = await Promise.all([
    localizeWithRetry(client, system, "ar", en.post),
    localizeWithRetry(client, system, "tr", en.post),
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
export async function regenerateLocalization(input: { lang: "ar" | "tr"; en: EnPost; products: ProductBrief[]; client?: Anthropic }) {
  const client = getClient(input.client);
  const system = buildSystemPrompt(input.products);
  const result = await localizeWithRetry(client, system, input.lang, input.en);
  return result;
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
