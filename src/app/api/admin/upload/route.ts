import { requireAdmin } from "@/lib/server/auth";
import { ALLOWED_CONTENT_TYPES, MAX_UPLOAD_BYTES, buildObjectKey, uploadToCdn } from "@/lib/server/cdn";

export const dynamic = "force-dynamic";

/**
 * Uploads an image for the Products CMS to Cloudflare R2 via the admov-cdn
 * Worker. Admin-only: the Worker's service token stays on the server, so the
 * browser can never write to the bucket directly.
 */
export async function POST(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin.ok) return admin.response;

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!form || !(file instanceof File)) {
    return Response.json({ error: "No file was uploaded" }, { status: 400 });
  }

  const contentType = file.type.toLowerCase().split(";")[0].trim();
  if (!ALLOWED_CONTENT_TYPES.has(contentType)) {
    return Response.json(
      { error: `Unsupported file type${contentType ? ` (${contentType})` : ""}. Use PNG, JPEG, WebP, AVIF, or GIF.` },
      { status: 415 },
    );
  }
  if (file.size === 0) return Response.json({ error: "The file is empty" }, { status: 400 });
  if (file.size > MAX_UPLOAD_BYTES) {
    return Response.json(
      { error: `File is too large (max ${Math.floor(MAX_UPLOAD_BYTES / 1024 / 1024)} MB)` },
      { status: 413 },
    );
  }

  const folderRaw = form.get("folder");
  const folder = typeof folderRaw === "string" ? folderRaw : "products";

  const body = await file.arrayBuffer();
  // Re-check after reading: File.size is client-reported metadata.
  if (body.byteLength > MAX_UPLOAD_BYTES) {
    return Response.json({ error: "File is too large" }, { status: 413 });
  }

  const key = buildObjectKey(folder, file.name, contentType, Date.now(), crypto.randomUUID());
  const result = await uploadToCdn({ body, key, contentType });
  if (!result.ok) return Response.json({ error: result.error }, { status: result.status });

  return Response.json({ url: result.url });
}
