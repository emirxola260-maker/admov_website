import type Stripe from "stripe";
import { createServiceClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe/server";
import { downloadExpiry, generateDownloadToken, generateLicenseKey } from "@/lib/apps/fulfilment";
import { sendTelegramMessage } from "@/lib/server/telegram";

export const dynamic = "force-dynamic";

/**
 * Fulfils a purchase once Stripe confirms payment.
 *
 * Only Stripe may call this, which is why the raw body is verified against the
 * webhook signature before anything is read from it — an unsigned request can
 * otherwise mint licence keys for free.
 */
export async function POST(request: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) return Response.json({ error: "Stripe is not configured" }, { status: 503 });

  const signature = request.headers.get("stripe-signature");
  if (!signature) return Response.json({ error: "Missing signature" }, { status: 400 });

  const raw = await request.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, signature, secret);
  } catch (err) {
    console.error("webhook signature rejected:", err instanceof Error ? err.message : "unknown");
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return Response.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const supabase = createServiceClient();
  if (!supabase) return Response.json({ error: "Database unavailable" }, { status: 503 });

  const appId = session.metadata?.app_id;
  const fulfilment = session.metadata?.fulfilment;
  const email = session.customer_details?.email ?? session.customer_email ?? "";
  if (!appId || !email) {
    console.error("webhook missing app id or email for session", session.id);
    return Response.json({ received: true });
  }

  // Stripe retries webhooks, so an order already recorded for this session is
  // left exactly as it is rather than issuing a second key.
  const { data: existing } = await supabase
    .from("app_orders")
    .select("id")
    .eq("stripe_session_id", session.id)
    .maybeSingle();
  if (existing) return Response.json({ received: true, duplicate: true });

  const download = fulfilment === "download" ? generateDownloadToken() : null;
  const { error } = await supabase.from("app_orders").insert({
    app_id: appId,
    email,
    status: "paid",
    amount_cents: session.amount_total ?? 0,
    currency: session.currency ?? "usd",
    stripe_session_id: session.id,
    stripe_payment_intent: typeof session.payment_intent === "string" ? session.payment_intent : null,
    stripe_subscription_id: typeof session.subscription === "string" ? session.subscription : null,
    license_key: fulfilment === "license" ? generateLicenseKey() : null,
    download_token: download?.hash ?? null,
    download_expires_at: download ? downloadExpiry() : null,
  } as never);

  if (error) {
    // Returning 500 makes Stripe retry, which is what we want — the customer
    // has paid and the order must land.
    console.error("order insert failed:", error.message);
    return Response.json({ error: "Could not record order" }, { status: 500 });
  }

  await sendTelegramMessage(
    `${fulfilment === "enrolment" ? "🎓 <b>New enrolment</b> — contact the student" : "💰 <b>New sale</b>"}\n${session.metadata?.app_slug ?? appId}\n${email}\n${((session.amount_total ?? 0) / 100).toFixed(2)} ${(session.currency ?? "usd").toUpperCase()}`,
  ).catch(() => {});

  return Response.json({ received: true });
}
