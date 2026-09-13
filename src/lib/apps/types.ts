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

/**
 * One picture in a listing's gallery — app screenshots, or for a course,
 * examples of the finished project. The caption doubles as the alt text.
 */
export interface GalleryItem {
  url: string;
  caption?: LocalizedText;
}

/** Who teaches a course. The block stays hidden until a name is set. */
export interface CourseInstructor {
  name: string;
  photo_url?: string | null;
  role?: LocalizedText;
  bio?: LocalizedText;
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
  /** The app icon on store pages; the brand mark on course pages. */
  logo_url: string | null;
  image_url: string | null;
  video_url: string | null;
  tagline: LocalizedText;
  description: LocalizedText;
  features: Partial<Record<"en" | "ar" | "tr", string[]>>;
  /** Screenshots (apps) or finished-project examples (courses), in order. */
  gallery: GalleryItem[];
  /** Courses only. Markdown per language — `###` headings become numbered modules. */
  curriculum_md: LocalizedText | null;
  duration: LocalizedText | null;
  level: LocalizedText | null;
  /** Courses only. How it is taught, e.g. "hands-on, on your own project". */
  format: LocalizedText | null;
  /** Courses only. One sentence: what the student has built by the end. */
  project: LocalizedText | null;
  instructor: CourseInstructor | null;
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
  gallery: [],
  curriculum_md: {},
  duration: {},
  level: {},
  format: {},
  project: {},
  instructor: null,
};

/**
 * Which device a listing is previewed in. Phone-only apps get a phone frame;
 * anything that also runs on a desktop or in a browser gets a window frame.
 */
export function previewDevice(platforms: Platform[]): "phone" | "desktop" {
  const phone = platforms.some((p) => p === "ios" || p === "android");
  const desktop = platforms.some((p) => p === "macos" || p === "windows" || p === "web");
  return phone && !desktop ? "phone" : "desktop";
}

/** Gallery entries with a usable URL, falling back to the cover image. */
export function galleryOf(app: Pick<AppItem, "gallery" | "image_url">): GalleryItem[] {
  const items = (app.gallery ?? []).filter((g) => typeof g?.url === "string" && g.url.trim());
  if (items.length) return items;
  return app.image_url?.trim() ? [{ url: app.image_url.trim() }] : [];
}

/** Drops blank values so a cleared admin field saves as null, not {"ar": ""}. */
export function compactText(value: LocalizedText | null | undefined): LocalizedText | null {
  const out: LocalizedText = {};
  for (const [lang, text] of Object.entries(value ?? {})) {
    if (typeof text === "string" && text.trim()) out[lang as Language] = text.trim();
  }
  return Object.keys(out).length ? out : null;
}

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
