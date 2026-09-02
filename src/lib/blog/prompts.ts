import type { EnPost } from "./schema";

export const PROMPT_VERSION = "2026-09-02.1";

export const PILLARS = [
  { id: "ai-ads", label: "AI advertising & creative", hint: "AI-generated ad creatives, hooks, UGC-style videos, creative testing loops for Meta, TikTok and Google" },
  { id: "ai-video-photo", label: "AI video & product photography", hint: "replacing photoshoots, cinematic AI video, product visuals at scale, art direction for AI" },
  { id: "automation", label: "AI automation & agents for SMBs", hint: "n8n / Make workflows, AI agents for support, lead capture, CRM hygiene, reporting, back-office" },
  { id: "llm-setup", label: "LLM setup & integration", hint: "choosing models, private data and RAG, evaluation, guardrails, cost control" },
  { id: "ecommerce", label: "Shopify & e-commerce growth", hint: "store setup, product pages, AI content for catalogs, retention, dropshipping operations" },
  { id: "paid-ads", label: "Paid ads (Meta, Google, TikTok)", hint: "account structure, creative velocity, measurement, MENA / Türkiye specifics" },
  { id: "web-app", label: "Websites & mobile apps", hint: "conversion-focused sites, Flutter apps, vibe coding, shipping an MVP fast" },
  { id: "product-spotlight", label: "ADMOV product spotlights", hint: "how businesses can use i8chat (Instagram comment-to-DM), Admov Academy (AI courses) and other ADMOV products" },
  { id: "market", label: "AI in MENA & Türkiye business", hint: "local market trends, Arabic/Turkish language AI, regulation basics, realistic examples" },
] as const;

export type Pillar = (typeof PILLARS)[number];
export type PillarId = Pillar["id"];

export function findPillar(id: string | null | undefined): Pillar | undefined {
  return PILLARS.find((p) => p.id === id);
}

/** Rotate through the pillars by day, skipping the ones used in the last three posts. */
export function pickPillar(dayOfYear: number, recentPillars: string[]): Pillar {
  const avoid = new Set(recentPillars.slice(0, 3));
  for (let i = 0; i < PILLARS.length; i++) {
    const candidate = PILLARS[(dayOfYear + i) % PILLARS.length];
    if (!avoid.has(candidate.id)) return candidate;
  }
  return PILLARS[dayOfYear % PILLARS.length];
}

export function dayOfYear(date: Date): number {
  const start = Date.UTC(date.getUTCFullYear(), 0, 0);
  return Math.floor((date.getTime() - start) / 86_400_000);
}

export interface ProductBrief {
  name: string;
  url?: string | null;
  tagline?: string | null;
}

export function buildSystemPrompt(products: ProductBrief[]): string {
  const productLines = products.length
    ? products.map((p) => `- ${p.name}${p.tagline ? ` — ${p.tagline}` : ""}${p.url ? ` (${p.url})` : ""}`).join("\n")
    : "- i8chat — turns Instagram comments into customers with automatic DMs (https://i8chat.com)\n- Admov Academy — practical AI courses, prompt bank and certificates (https://admovacademy.com)";

  return `You are the content writer for ADMOV (https://admov.io), an AI agency based in Istanbul that serves businesses in the Gulf, Türkiye and worldwide.

What ADMOV does: AI-generated video and photo content, AI automation systems and agents, LLM setup and integration, websites and Flutter mobile apps, Meta/Google/TikTok ads management, and Shopify / e-commerce store setup and management.

ADMOV's own products:
${productLines}

Audience: founders, marketing managers and e-commerce operators at small and mid-sized businesses. They are busy, practical and allergic to hype.

Voice: confident, concrete, warm, zero fluff. Short paragraphs of two to four sentences. Prefer specific examples, step-by-step guidance and realistic numbers that are clearly labelled as examples. Plain English.

Hard rules:
- Never invent statistics, client names, quotes, awards or case-study results. Illustrative numbers must be introduced as examples ("for example, if a store gets 300 comments a week…").
- Do not name competitors.
- Markdown only. Use ## and ### headings (never #), bullet lists and bold for key terms. No raw HTML, no images, no tables wider than three columns.
- Structure: a short opening that states the problem and the promise, three to six sections with actionable guidance, one short checklist or step list, then a "## How ADMOV can help" section that connects the topic to one relevant ADMOV service or product, and a closing sentence inviting the reader to book a free call at https://admov.io/#contact.
- Body length: 800–1200 words. Do not repeat the title as a heading.
- Write for people first; keywords must read naturally.`;
}

export interface EnPromptInput {
  pillar: Pillar;
  topic?: string | null;
  recentTitles: string[];
}

export function buildEnUserPrompt({ pillar, topic, recentTitles }: EnPromptInput): string {
  const recent = recentTitles.length
    ? `Recent posts (do NOT repeat or closely resemble these):\n${recentTitles.map((t) => `- ${t}`).join("\n")}`
    : "This is one of the first posts on the blog.";
  const angle = topic
    ? `Today's topic (requested by the editor): ${topic}\nStay on this topic; pick the most useful angle for the audience.`
    : `Choose ONE specific, practical angle inside this pillar that a business owner could act on this week. Avoid generic overviews.`;
  return `Write today's blog post.

Pillar: ${pillar.label}
Pillar focus: ${pillar.hint}

${angle}

${recent}

Return all fields in the required JSON format. The "topic" field must describe the angle you chose in one line.`;
}

export function buildLocalizeUserPrompt(lang: "ar" | "tr", en: EnPost): string {
  const target =
    lang === "ar"
      ? "Arabic-speaking business readers in the Gulf. Use Modern Standard Arabic in a professional, natural business register (not literary, not colloquial)."
      : "Turkish business readers. Use professional, natural Turkish as a native marketer would write it.";
  return `Localize the following English article for ${target}

Rules:
- This is a localization, not a word-for-word translation: adapt idioms and examples so they feel native, but keep every section, heading level, list and the overall structure.
- Keep product and brand names exactly as written: ADMOV, i8chat, Admov Academy, ContentOS, Shopify, Meta, TikTok, Google, n8n, Make.
- Keep all URLs unchanged, including https://admov.io/#contact.
- Keep the same Markdown formatting (## and ### headings, bullets, bold). No raw HTML.
- Keywords must be the search terms a local reader would actually type.

English article (JSON):
${JSON.stringify({ title: en.title, excerpt: en.excerpt, body_md: en.body_md, seoTitle: en.seoTitle, seoDescription: en.seoDescription, keywords: en.keywords }, null, 2)}`;
}
