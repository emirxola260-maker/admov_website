import "server-only";
import { unstable_cache } from "next/cache";
import { createAnonServerClient } from "@/lib/supabase/server";
import type { AppItem } from "@/lib/apps/types";

export const APPS_TAG = "apps";

/** Columns the anon key is granted — never download keys or Stripe ids. */
const PUBLIC_COLUMNS =
  "id,slug,name,status,featured,sort_order,kind,platforms,fulfilment,price_cents,currency,billing,store_url,demo_url,logo_url,image_url,video_url,tagline,description,features,created_at,updated_at";

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

export async function getPublishedApp(slug: string): Promise<AppItem | null> {
  const apps = await getPublishedApps();
  return apps.find((app) => app.slug === slug) ?? null;
}
