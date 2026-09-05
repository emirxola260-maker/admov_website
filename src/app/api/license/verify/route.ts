import { createServiceClient } from "@/lib/supabase/admin";
import { rateLimit } from "@/lib/server/ratelimit";

export const dynamic = "force-dynamic";

/**
 * Licence check for our own apps to call at startup.
 *
 * Deliberately says only whether a key is valid and which app it belongs to —
 * never the buyer's email — so the endpoint cannot be used to mine customer
 * addresses. Rate limited per IP because it is a public, guessable-looking
 * surface, even though the keys themselves are random.
 */
export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const limit = rateLimit(`license:${ip}`, { windowMs: 60_000, max: 20 });
  if (!limit.allowed) {
    return Response.json(
      { valid: false, error: "Too many attempts" },
      { status: 429, headers: { "Retry-After": String(Math.ceil(limit.retryAfterMs / 1000)) } },
    );
  }

  const body = await request.json().catch(() => null);
  const key = typeof body?.key === "string" ? body.key.trim().toUpperCase() : "";
  if (!key) return Response.json({ valid: false, error: "Missing key" }, { status: 400 });

  const supabase = createServiceClient();
  if (!supabase) return Response.json({ valid: false, error: "Unavailable" }, { status: 503 });

  const { data: order } = await supabase
    .from("app_orders")
    .select("status, app_id")
    .eq("license_key", key)
    .maybeSingle();

  if (!order || order.status !== "paid") return Response.json({ valid: false });

  const { data: app } = await supabase.from("apps").select("slug").eq("id", order.app_id).single();
  return Response.json({ valid: true, app: app?.slug ?? null });
}
