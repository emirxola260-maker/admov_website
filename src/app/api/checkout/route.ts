import { createServiceClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe/server";
import { isPaid, storeBase, type AppItem } from "@/lib/apps/types";
import { SITE_URL } from "@/lib/blog/metadata";

export const dynamic = "force-dynamic";

/**
 * Opens a Stripe Checkout session for one app.
 *
 * The client sends only a slug. Price, currency and billing period are read
 * from the database, so a tampered request cannot change what is charged.
 */
export async function POST(request: Request) {
  const stripe = getStripe();
  if (!stripe) {
    return Response.json(
      { error: "Payments are not connected yet. Please get in touch and we'll sort it out." },
      { status: 503 },
    );
  }

  const body = await request.json().catch(() => null);
  const slug = typeof body?.slug === "string" ? body.slug : "";
  const lang = ["en", "ar", "tr"].includes(body?.lang) ? body.lang : "en";
  if (!slug) return Response.json({ error: "Missing app" }, { status: 400 });

  const supabase = createServiceClient();
  if (!supabase) return Response.json({ error: "Store is unavailable" }, { status: 503 });

  const { data, error } = await supabase.from("apps").select("*").eq("slug", slug).eq("status", "published").single();
  if (error || !data) return Response.json({ error: "App not found" }, { status: 404 });

  const app = data as AppItem & { stripe_price_id: string | null };
  if (!isPaid(app.fulfilment) || !app.price_cents) {
    return Response.json({ error: "This app is not sold here" }, { status: 400 });
  }

  const subscription = app.fulfilment === "subscription";
  // Courses live at /courses: returning a course buyer to /apps/<slug> would land on a 404.
  const base = `${SITE_URL}${lang === "en" ? "" : `/${lang}`}${storeBase(app.kind)}`;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: subscription ? "subscription" : "payment",
      // A Price created in Stripe wins when one is linked; otherwise the price
      // is built inline from our own figures so a new app can sell immediately.
      line_items: [
        app.stripe_price_id
          ? { price: app.stripe_price_id, quantity: 1 }
          : {
              quantity: 1,
              price_data: {
                currency: app.currency || "usd",
                unit_amount: app.price_cents,
                product_data: { name: app.name },
                ...(subscription
                  ? { recurring: { interval: app.billing === "yearly" ? ("year" as const) : ("month" as const) } }
                  : {}),
              },
            },
      ],
      success_url: `${base}/${app.slug}?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/${app.slug}?checkout=cancelled`,
      metadata: { app_id: app.id, app_slug: app.slug, fulfilment: app.fulfilment, lang },
    });

    if (!session.url) throw new Error("Stripe returned no checkout URL");
    return Response.json({ url: session.url });
  } catch (err) {
    console.error("checkout failed:", err instanceof Error ? err.message : "unknown error");
    return Response.json({ error: "Could not start checkout. Please try again." }, { status: 502 });
  }
}
