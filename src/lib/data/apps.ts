import "server-only";
import { unstable_cache } from "next/cache";
import { createAnonServerClient } from "@/lib/supabase/server";
import { courseLangs, isCourse, type AppItem } from "@/lib/apps/types";
import type { Language } from "@/i18n/config";

export const APPS_TAG = "apps";

/** Columns the anon key is granted — never download keys or Stripe ids. */
const PUBLIC_COLUMNS =
  "id,slug,name,status,featured,sort_order,kind,platforms,fulfilment,price_cents,currency,billing,store_url,demo_url,logo_url,image_url,video_url,tagline,description,features,curriculum_md,duration,level,created_at,updated_at";

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

export const getPublishedApps = unstable_cache(fetchPublishedApps, ["apps-published"], {
  tags: [APPS_TAG],
  revalidate: 60,
});

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
