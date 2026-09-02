import { z } from "zod";

// Kept free of length constraints on purpose: structured outputs enforce the
// shape, and `enforceLimits()` below trims/validates the soft limits.
export const EnPostSchema = z.object({
  topic: z.string().describe("One line describing the specific angle of this post"),
  title: z.string().describe("Post title, 45-70 characters, specific and useful, no clickbait"),
  excerpt: z.string().describe("One or two sentences, max 160 characters, summarising the value of the post"),
  body_md: z.string().describe("The full article in Markdown, 800-1200 words, ## and ### headings only, no H1, no raw HTML"),
  seoTitle: z.string().describe("SEO title tag, max 60 characters"),
  seoDescription: z.string().describe("Meta description, 120-155 characters"),
  keywords: z.array(z.string()).describe("3-8 search keywords/phrases"),
  tags: z.array(z.string()).describe("1-4 short topic tags for the post card"),
});
export type EnPost = z.infer<typeof EnPostSchema>;

export const LocalizedPostSchema = z.object({
  title: z.string().describe("Localized title, natural in the target language"),
  excerpt: z.string().describe("Localized excerpt, max 160 characters"),
  body_md: z.string().describe("Localized article in Markdown with the same structure as the English version"),
  seoTitle: z.string().describe("Localized SEO title tag, max 60 characters"),
  seoDescription: z.string().describe("Localized meta description, 120-155 characters"),
  keywords: z.array(z.string()).describe("3-8 search keywords in the target language"),
});
export type LocalizedPost = z.infer<typeof LocalizedPostSchema>;

const LIMITS = { excerpt: 200, seoTitle: 70, seoDescription: 170, minBodyChars: 1500 } as const;

function clip(value: string, max: number): string {
  const v = value.trim();
  return v.length <= max ? v : `${v.slice(0, max - 1).trimEnd()}…`;
}

/** Apply soft limits and sanity checks to a model output. Throws when the body is unusably short. */
export function enforceLimits<T extends { excerpt: string; body_md: string; seoTitle: string; seoDescription: string; keywords: string[] }>(post: T): T {
  if (post.body_md.trim().length < LIMITS.minBodyChars) {
    throw new Error(`Generated body is too short (${post.body_md.trim().length} chars)`);
  }
  return {
    ...post,
    excerpt: clip(post.excerpt, LIMITS.excerpt),
    seoTitle: clip(post.seoTitle, LIMITS.seoTitle),
    seoDescription: clip(post.seoDescription, LIMITS.seoDescription),
    keywords: post.keywords.map((k) => k.trim()).filter(Boolean).slice(0, 8),
    body_md: post.body_md.trim().replace(/^#\s+.+\n/, ""), // drop an accidental H1
  };
}
