import type { LocalizedText } from "@/lib/blog/types";
import { SUPPORTED_LANGS, type Language } from "@/i18n/config";

export type AppStatus = "draft" | "published";
export type AppKind = "app" | "mini_app" | "template" | "saas" | "course";
export type Platform = "ios" | "android" | "macos" | "windows" | "web";

/**
 * How a buyer gets the thing.
 *
 * `store_link` exists because Apple (and in practice Google) do not allow
 * selling their apps outside their own stores — those entries link out and
 * carry no price. The others are ours to fulfil. `enrolment` is a course
 * seat: paid once, no artefact — the owner is told and contacts the student.
 */
export type Fulfilment = "store_link" | "download" | "subscription" | "license" | "enrolment";
export type Billing = "one_time" | "monthly" | "yearly";

export const APP_KINDS: AppKind[] = ["app", "mini_app", "template", "saas", "course"];
export const PLATFORMS: Platform[] = ["ios", "android", "macos", "windows", "web"];
export const FULFILMENTS: Fulfilment[] = ["store_link", "download", "subscription", "license", "enrolment"];

/** What the Apps editor offers — courses have their own tab and editor. */
export const STORE_KINDS: AppKind[] = APP_KINDS.filter((k) => k !== "course");
export const STORE_FULFILMENTS: Fulfilment[] = FULFILMENTS.filter((f) => f !== "enrolment");
export const BILLINGS: Billing[] = ["one_time", "monthly", "yearly"];

/** Fulfilments that take money. `store_link` never does. */
export const PAID_FULFILMENTS: Fulfilment[] = ["download", "subscription", "license", "enrolment"];
export const isPaid = (fulfilment: Fulfilment) => PAID_FULFILMENTS.includes(fulfilment);

export const isCourse = (app: Pick<AppItem, "kind">) => app.kind === "course";

/**
 * Where a row lives on the site. Courses and apps share a table and a
 * checkout, so this is the one place that decides which URL they get.
 */
export const storeBase = (kind: AppKind): "/apps" | "/courses" => (kind === "course" ? "/courses" : "/apps");

/**
 * Languages a course actually has a curriculum in. This single definition
 * drives the nav link, the index, the detail page, hreflang and the sitemap,
 * so an Arabic-only course never shows up as an empty English page.
 */
export function courseLangs(app: Pick<AppItem, "curriculum_md">): Language[] {
  return SUPPORTED_LANGS.filter((l) => Boolean(app.curriculum_md?.[l]?.trim()));
}

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
  /** Courses only. Markdown per language, rendered with PostArticle. */
  curriculum_md: LocalizedText | null;
  duration: string | null;
  level: string | null;
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
  curriculum_md: {},
  duration: "",
  level: "",
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
    const amount = cents / 10 ** digits;
    // A whole amount reads as $299, not $299.00.
    if (Number.isInteger(amount)) {
      return new Intl.NumberFormat(locale, { style: "currency", currency: code, minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
    }
    return formatter.format(amount);
  } catch {
    return `${(cents / 100).toFixed(2)} ${code}`;
  }
}
