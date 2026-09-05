import type { LocalizedText } from "@/lib/blog/types";

export type AppStatus = "draft" | "published";
export type AppKind = "app" | "mini_app" | "template" | "saas";
export type Platform = "ios" | "android" | "macos" | "windows" | "web";

/**
 * How a buyer gets the thing.
 *
 * `store_link` exists because Apple (and in practice Google) do not allow
 * selling their apps outside their own stores — those entries link out and
 * carry no price. The other three are ours to fulfil.
 */
export type Fulfilment = "store_link" | "download" | "subscription" | "license";
export type Billing = "one_time" | "monthly" | "yearly";

export const APP_KINDS: AppKind[] = ["app", "mini_app", "template", "saas"];
export const PLATFORMS: Platform[] = ["ios", "android", "macos", "windows", "web"];
export const FULFILMENTS: Fulfilment[] = ["store_link", "download", "subscription", "license"];
export const BILLINGS: Billing[] = ["one_time", "monthly", "yearly"];

/** Fulfilments that take money. `store_link` never does. */
export const PAID_FULFILMENTS: Fulfilment[] = ["download", "subscription", "license"];
export const isPaid = (fulfilment: Fulfilment) => PAID_FULFILMENTS.includes(fulfilment);

export interface AppItem {
  id: string;
  slug: string;
  name: string;
  status: AppStatus;
  featured: boolean;
  sort_order: number;
  kind: AppKind;
  platforms: Platform[];
  fulfilment: Fulfilment;
  price_cents: number | null;
  currency: string;
  billing: Billing;
  store_url: string | null;
  demo_url: string | null;
  logo_url: string | null;
  image_url: string | null;
  video_url: string | null;
  tagline: LocalizedText;
  description: LocalizedText;
  features: Partial<Record<"en" | "ar" | "tr", string[]>>;
  created_at: string;
  updated_at: string;
}

/** Admin-only fields, never exposed to the anon key. */
export interface AppItemAdmin extends AppItem {
  download_key: string | null;
  stripe_price_id: string | null;
  stripe_product_id: string | null;
}

export type AppInput = Omit<AppItemAdmin, "id" | "created_at" | "updated_at">;

export const EMPTY_APP: AppInput = {
  slug: "",
  name: "",
  status: "draft",
  featured: false,
  sort_order: 0,
  kind: "app",
  platforms: [],
  fulfilment: "store_link",
  price_cents: null,
  currency: "usd",
  billing: "one_time",
  store_url: "",
  demo_url: "",
  download_key: "",
  stripe_price_id: "",
  stripe_product_id: "",
  logo_url: "",
  image_url: "",
  video_url: "",
  tagline: { en: "" },
  description: { en: "" },
  features: { en: [] },
};

/**
 * Price for display. Amounts are stored in the currency's minor unit, so a
 * zero-decimal currency would be wrong to divide — Intl knows which those are,
 * so the value is handed over in major units only when the currency has them.
 */
export function formatPrice(cents: number | null | undefined, currency: string, lang: string): string {
  if (cents == null) return "";
  const locale = lang === "ar" ? "ar" : lang === "tr" ? "tr-TR" : "en-US";
  const code = (currency || "usd").toUpperCase();
  try {
    const formatter = new Intl.NumberFormat(locale, { style: "currency", currency: code });
    const digits = formatter.resolvedOptions().maximumFractionDigits ?? 2;
    return formatter.format(cents / 10 ** digits);
  } catch {
    return `${(cents / 100).toFixed(2)} ${code}`;
  }
}
