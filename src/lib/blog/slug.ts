/** ASCII slug from a title: lowercase, dashes, max length, never empty. */
export function slugify(input: string, maxLength = 80): string {
  const ascii = input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const trimmed = ascii.slice(0, maxLength).replace(/-+$/g, "");
  return trimmed || "post";
}

/** Append -2, -3, … until the slug is not in `taken`. */
export function uniqueSlug(base: string, taken: Set<string>): string {
  if (!taken.has(base)) return base;
  for (let i = 2; i < 1000; i++) {
    const candidate = `${base}-${i}`;
    if (!taken.has(candidate)) return candidate;
  }
  return `${base}-${Date.now()}`;
}
