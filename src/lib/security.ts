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
