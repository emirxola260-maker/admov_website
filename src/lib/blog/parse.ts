// Pure helpers for reading OpenAI Responses API results. Kept free of
// `server-only` so they can be unit-tested and reused by both stages.

export type GenerationErrorKind = "refusal" | "truncated" | "parse" | "api" | "budget";

export class BlogGenerationError extends Error {
  constructor(
    public kind: GenerationErrorKind,
    message: string,
  ) {
    super(message);
    this.name = "BlogGenerationError";
  }
}

/** Minimal structural view of a parsed response — independent of SDK type names. */
export interface ParsedLike<T> {
  output_parsed: T | null;
  status?: string | null;
  incomplete_details?: { reason?: string | null } | null;
  error?: { message?: string | null } | null;
  output: Array<{ type: string; content?: Array<{ type: string; refusal?: string }> }>;
}

/**
 * Turn incomplete / failed / refused / unparsed responses into typed errors and
 * return the parsed object otherwise. The SDK only runs the zod parser when
 * `status` is "completed", so every other status must be reported explicitly —
 * otherwise a real API failure surfaces as a misleading "no structured output".
 */
export function readParsed<T>(response: ParsedLike<T>, label: string): T {
  if (response.status === "incomplete") {
    const reason = response.incomplete_details?.reason ?? "unknown";
    if (reason === "max_output_tokens") throw new BlogGenerationError("truncated", `${label}: output hit max_output_tokens`);
    if (reason === "content_filter") throw new BlogGenerationError("refusal", `${label}: stopped by the content filter`);
    throw new BlogGenerationError("api", `${label}: response incomplete (${reason})`);
  }

  for (const item of response.output) {
    if (item.type !== "message") continue;
    for (const part of item.content ?? []) {
      if (part.type === "refusal") {
        throw new BlogGenerationError("refusal", `${label}: the model declined this topic${part.refusal ? ` — ${part.refusal}` : ""}`);
      }
    }
  }

  if (response.status && response.status !== "completed") {
    const detail = response.error?.message ? ` — ${response.error.message}` : "";
    throw new BlogGenerationError("api", `${label}: response ${response.status}${detail}`);
  }

  if (!response.output_parsed) throw new BlogGenerationError("parse", `${label}: no structured output`);
  return response.output_parsed;
}
