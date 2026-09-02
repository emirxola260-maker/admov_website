import "server-only";
import { CDN_BASE_URL, CDN_BUCKET, publicUrlFor } from "./cdn-policy";

export { ALLOWED_CONTENT_TYPES, CDN_BASE_URL, CDN_BUCKET, MAX_UPLOAD_BYTES, buildObjectKey, publicUrlFor } from "./cdn-policy";

/**
 * Uploads for the website's own images (product logos and screenshots) go to
 * the same Cloudflare R2 storage the app uses, through the admov-cdn Worker.
 *
 * `admin-uploads` is a public-read bucket on that Worker, so the returned URL
 * can be rendered directly on the site. Writing to it requires the Worker's
 * service token, which is why this module is server-only.
 */
export type CdnUploadResult = { ok: true; url: string } | { ok: false; status: number; error: string };

export async function uploadToCdn(input: { body: ArrayBuffer; key: string; contentType: string }): Promise<CdnUploadResult> {
  const token = process.env.CDN_SERVICE_TOKEN;
  if (!token) {
    return {
      ok: false,
      status: 500,
      error: "Uploads are not configured: CDN_SERVICE_TOKEN is missing. Add it in Vercel, or paste an image URL instead.",
    };
  }
  try {
    const res = await fetch(`${CDN_BASE_URL}/${CDN_BUCKET}/${encodeURI(input.key)}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": input.contentType,
      },
      body: input.body,
    });
    if (!res.ok) {
      // Log the status only — an error object would carry the request URL.
      console.error("CDN upload failed with HTTP", res.status);
      return { ok: false, status: 502, error: `Upload failed (CDN returned ${res.status})` };
    }
    return { ok: true, url: publicUrlFor(input.key) };
  } catch (err) {
    console.error("CDN upload error:", err instanceof Error ? err.message : "unknown error");
    return { ok: false, status: 502, error: "Could not reach the CDN" };
  }
}
