import { revalidateTag } from "next/cache";
import { requireAdmin } from "@/lib/server/auth";

const ALLOWED = new Set(["admin-content", "products", "posts"]);

/** Called by the admin UI after it writes to Supabase so cached pages refresh immediately. */
export async function POST(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin.ok) return admin.response;

  const body = (await request.json().catch(() => ({}))) as { tags?: unknown };
  const tags = Array.isArray(body.tags) ? body.tags.filter((t): t is string => typeof t === "string") : [];
  const applied: string[] = [];
  for (const tag of tags) {
    if (ALLOWED.has(tag) || /^post:[a-z0-9-]{1,120}$/.test(tag)) {
      revalidateTag(tag, "max");
      applied.push(tag);
    }
  }
  return Response.json({ revalidated: applied });
}
