import { createServiceClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

/**
 * What the buyer gets, looked up by their Checkout session id.
 *
 * The id is unguessable and only Stripe hands it to the buyer on the success
 * redirect, so it acts as the bearer credential for this one order. The raw
 * download token is not stored, so a link cannot be re-derived here — the
 * emailed link is the durable copy and this response is the immediate one.
 */
export async function GET(request: Request) {
  const sessionId = new URL(request.url).searchParams.get("session_id");
  if (!sessionId) return Response.json({ error: "Missing session" }, { status: 400 });

  const supabase = createServiceClient();
  if (!supabase) return Response.json({ error: "Unavailable" }, { status: 503 });

  const { data } = await supabase
    .from("app_orders")
    .select("status, license_key, email")
    .eq("stripe_session_id", sessionId)
    .maybeSingle();

  // The webhook may not have landed yet; the page polls until it has.
  if (!data) return Response.json({ status: "pending" });
  return Response.json({ status: data.status, licenseKey: data.license_key ?? null, email: data.email });
}
