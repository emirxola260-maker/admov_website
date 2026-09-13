import "server-only";
import { unstable_cache } from "next/cache";
import { createAnonServerClient } from "@/lib/supabase/server";
import { courseLangs, isCourse, type AppItem } from "@/lib/apps/types";
import type { Language } from "@/i18n/config";

export const APPS_TAG = "apps";

/** Columns the anon key is granted — never download keys or Stripe ids. */
const PUBLIC_COLUMNS =
  "id,slug,name,status,featured,sort_order,kind,platforms,fulfilment,price_cents,currency,billing,store_url,demo_url,logo_url,image_url,video_url,tagline,description,features,gallery,curriculum_md,duration,level,format,project,instructor,created_at,updated_at";

async function fetchPublishedApps(): Promise<AppItem[]> {
  const supabase = createAnonServerClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("apps")
    .select(PUBLIC_COLUMNS)
    .eq("status", "published")
    .order("featured", { ascending: false })
    .order("sort_order", { ascending: true });
  if (error) {
    console.error("apps fetch failed:", error.message);
    return [];
  }
  return (data ?? []) as unknown as AppItem[];
}

const getCachedPublishedApps = unstable_cache(fetchPublishedApps, ["apps-published"], {
  tags: [APPS_TAG],
  revalidate: 60,
});

/**
 * Development only: a `.demo-store.json` file in the repo root (gitignored)
 * stands in for the catalogue, so the store and academy layouts can be
 * previewed before the tables exist. Production never reads it.
 */
async function demoCatalogue(): Promise<AppItem[] | null> {
  if (process.env.NODE_ENV !== "development") return null;
  try {
    // `Cookie: admov-demo=empty` previews the empty store for one request.
    const { cookies } = await import("next/headers");
    if ((await cookies()).get("admov-demo")?.value === "empty") return [];
  } catch {
    // Outside a request (build-time or cached scope): fall through.
  }
  try {
    const { readFile } = await import("node:fs/promises");
    const { join } = await import("node:path");
    const rows = JSON.parse(await readFile(join(process.cwd(), ".demo-store.json"), "utf8")) as AppItem[];
    return rows.filter((row) => row.status === "published");
  } catch {
    return null;
  }
}

export async function getPublishedApps(): Promise<AppItem[]> {
  return (await demoCatalogue()) ?? getCachedPublishedApps();
}

/*
 * Courses share the apps table (and its whole checkout), so every read site
 * picks a side explicitly. Using getPublishedApps directly on a public page
 * would leak a course into the app store under the wrong URL.
 */

/** Apps, mini-apps, templates and SaaS — everything except courses. */
export async function getPublishedStoreApps(): Promise<AppItem[]> {
  return (await getPublishedApps()).filter((app) => !isCourse(app));
}

export async function getPublishedStoreApp(slug: string): Promise<AppItem | null> {
  return (await getPublishedStoreApps()).find((app) => app.slug === slug) ?? null;
}

export async function getPublishedCourses(): Promise<AppItem[]> {
  return (await getPublishedApps()).filter(isCourse);
}

export async function getPublishedCourse(slug: string): Promise<AppItem | null> {
  return (await getPublishedCourses()).find((course) => course.slug === slug) ?? null;
}

/** Languages in which at least one published course has a curriculum. */
export async function getCourseLangs(): Promise<Language[]> {
  const langs = new Set<Language>();
  for (const course of await getPublishedCourses()) courseLangs(course).forEach((l) => langs.add(l));
  return [...langs];
}
