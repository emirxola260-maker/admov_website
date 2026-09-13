import { createServiceClient } from "@/lib/supabase/admin";
import { generateDownloadToken, downloadExpiry } from "@/lib/apps/fulfilment";
import { SITE_URL } from "@/lib/blog/metadata";

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
  const sessionId = new URL(request.url).searchParams.get("session_id");
  if (!sessionId) return Response.json({ error: "Missing session" }, { status: 400 });

  const supabase = createServiceClient();
  if (!supabase) return Response.json({ error: "Unavailable" }, { status: 503 });

  const { data: order } = await supabase
    .from("app_orders")
    .select("id, status, license_key, email, app_id")
    .eq("stripe_session_id", sessionId)
    .maybeSingle();

  // The webhook may not have landed yet; the page polls until it has.
  if (!order) return Response.json({ status: "pending" });
  if (order.status !== "paid") return Response.json({ status: order.status });

  const { data: app } = await supabase.from("apps").select("fulfilment, name").eq("id", order.app_id).single();

  let downloadUrl: string | null = null;
  if (app?.fulfilment === "download") {
    const { token, hash } = generateDownloadToken();
    const { error } = await supabase
      .from("app_orders")
      .update({ download_token: hash, download_expires_at: downloadExpiry(), download_count: 0 } as never)
      .eq("id", order.id);
    if (!error) downloadUrl = `${SITE_URL}/api/download/${token}`;
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
