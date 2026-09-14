import { createServiceClient } from "@/lib/supabase/admin";
import { generateDownloadToken, downloadExpiry, DOWNLOAD_MAX_USES } from "@/lib/apps/fulfilment";
import { SITE_URL } from "@/lib/blog/metadata";
import { getClientIp } from "@/lib/server/ip";
import { rateLimit } from "@/lib/server/ratelimit";

export const dynamic = "force-dynamic";

/**
 * What the buyer gets, looked up by their Checkout session id.
 *
 * Stripe hands that id only to the buyer on the success redirect and it is
 * unguessable, so it acts as the bearer credential for this one order.
 *
 * Download tokens are stored only as hashes, so an existing link cannot be
 * recovered here. Instead a fresh token is minted and its hash replaces the
 * old one — the buyer always leaves this page with a working link, and we
 * still never keep a usable token in the database.
 */
export async function GET(request: Request) {
  const ip = getClientIp(request);
  const limit = rateLimit(`checkout-session:${ip}`, { windowMs: 60_000, max: 60 });
  if (!limit.allowed) {
    return Response.json({ error: "Too many requests" }, { status: 429 });
  }

  const sessionId = new URL(request.url).searchParams.get("session_id");
  if (!sessionId) return Response.json({ error: "Missing session" }, { status: 400 });

  const supabase = createServiceClient();
  if (!supabase) return Response.json({ error: "Unavailable" }, { status: 503 });

  const { data: order } = await supabase
    .from("app_orders")
    .select("id, status, license_key, email, app_id, download_expires_at, download_count")
    .eq("stripe_session_id", sessionId)
    .maybeSingle();

  // The webhook may not have landed yet; the page polls until it has.
  if (!order) return Response.json({ status: "pending" });
  if (order.status !== "paid") return Response.json({ status: order.status });

  const { data: app } = await supabase.from("apps").select("fulfilment, name").eq("id", order.app_id).single();

  let downloadUrl: string | null = null;
  if (app?.fulfilment === "download") {
    const isExpired = order.download_expires_at ? new Date(order.download_expires_at).getTime() < Date.now() : false;
    const isLimitReached = (order.download_count ?? 0) >= DOWNLOAD_MAX_USES;

    if (!isExpired && !isLimitReached) {
      const { token, hash } = generateDownloadToken();
      const expiresAt = order.download_expires_at || downloadExpiry();
      const { error } = await supabase
        .from("app_orders")
        .update({
          download_token: hash,
          download_expires_at: expiresAt,
        } as never)
        .eq("id", order.id);
      if (!error) downloadUrl = `${SITE_URL}/api/download/${token}`;
    }
  }

  return Response.json({
    status: "paid",
    fulfilment: app?.fulfilment ?? null,
    appName: app?.name ?? null,
    email: order.email,
    licenseKey: order.license_key ?? null,
    downloadUrl,
  });
}
