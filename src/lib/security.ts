/**
 * Returns the URL only if it is a root-relative path (same-origin asset such as
 * `/work-kyom.webp`) or uses the http(s) scheme; otherwise returns `fallback`.
 * Prevents `javascript:`, `data:`, protocol-relative (`//evil.com`) and other
 * dangerous values from reaching `href`/`src` attributes when the value comes
 * from admin-editable content.
 */
export function sanitizeHttpUrl(url: string | null | undefined, fallback = ""): string {
  if (!url || typeof url !== "string") return fallback;
  const trimmed = url.trim();
  if (trimmed.startsWith("/") && !trimmed.startsWith("//") && !/[\s\\]/.test(trimmed)) {
    return trimmed;
  }
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "http:" || parsed.protocol === "https:" ? trimmed : fallback;
  } catch {
    return fallback;
  }
}

/**
 * Serializes an object for safe embedding inside an inline HTML `<script>` tag
 * (such as `type="application/ld+json"`).
 * Replaces `<` with unicode escape `\u003c` so that malicious closing tags
 * (e.g. `</script>`) cannot execute arbitrary scripts.
 */
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

