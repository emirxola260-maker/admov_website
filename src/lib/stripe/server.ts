import "server-only";
import Stripe from "stripe";

/**
 * Stripe client, or null when the account is not connected yet.
 *
 * Everything that touches money checks for null and returns a clear error, so
 * the store can ship — and the catalogue can be browsed — before the keys
 * exist. Nothing can charge a card until STRIPE_SECRET_KEY is set.
 */
let cached: Stripe | null | undefined;

export function getStripe(): Stripe | null {
  if (cached !== undefined) return cached;
  const key = process.env.STRIPE_SECRET_KEY;
  cached = key ? new Stripe(key) : null;
  if (!cached) console.warn("Stripe is not configured: STRIPE_SECRET_KEY is missing.");
  return cached;
}

export const stripeConfigured = () => Boolean(process.env.STRIPE_SECRET_KEY);
