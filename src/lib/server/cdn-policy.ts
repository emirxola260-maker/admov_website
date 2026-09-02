// Pure upload policy: what we accept and what the object key looks like.
// Kept free of `server-only` so it can be unit-tested; the token-carrying
// upload itself lives in ./cdn.ts.

export const CDN_BASE_URL = (process.env.CDN_BASE_URL || "https://cdn.admov.io").replace(/\/+$/, "");

/** Public-read bucket on the admov-cdn Worker. */
export const CDN_BUCKET = "admin-uploads";

/**
 * The binding constraint is Vercel, not the Worker: a Vercel Function rejects
 * request bodies over 4.5 MB at the edge, before this route's handler runs, so
 * anything above that would fail with an opaque platform 413 instead of our own
 * message. 4 MB leaves headroom for the multipart envelope. (The Worker itself
 * allows 50 MB, which we never reach through this path.)
 */
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

/**
 * Raster images only. SVG is deliberately excluded: the bucket is public-read
 * and served from our own domain, so a scripted SVG would be stored XSS.
 */
export const ALLOWED_CONTENT_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/avif",
]);

const EXTENSIONS: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

/**
 * Builds the object key. The name is rebuilt from scratch rather than sanitized
 * in place, so nothing supplied by the client can climb out of the folder: the
 * result is always two segments of `[a-z0-9-]` plus an extension chosen from
 * the content type.
 */
export function buildObjectKey(folder: string, fileName: string, contentType: string, now: number, rand: string): string {
  const safeFolder = folder.toLowerCase().replace(/[^a-z0-9-]/g, "") || "misc";
  const base = (fileName.split(/[/\\]/).pop() ?? "")
    .replace(/\.[^.]*$/, "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48)
    .replace(/-+$/g, "");
  const ext = EXTENSIONS[contentType] ?? "bin";
  // The PUT is unconditional, so two uploads in the same millisecond with the
  // same slug would overwrite each other without the random suffix.
  const suffix = rand.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 8) || "x";
  return `${safeFolder}/${now}-${suffix}-${base || "file"}.${ext}`;
}

export function publicUrlFor(key: string): string {
  return `${CDN_BASE_URL}/${CDN_BUCKET}/${key}`;
}
