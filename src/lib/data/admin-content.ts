import "server-only";
import { unstable_cache } from "next/cache";
import { createAnonServerClient } from "@/lib/supabase/server";

export const ADMIN_CONTENT_TAG = "admin-content";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AdminContent = Record<string, any> | null;

async function fetchAdminContent(): Promise<AdminContent> {
  const supabase = createAnonServerClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("admin_content")
    .select("content")
    .eq("id", "admov_main")
    .maybeSingle();
  if (error) {
    console.error("admin_content fetch failed:", error.message);
    return null;
  }
  return ((data as { content?: AdminContent } | null)?.content as AdminContent) ?? null;
}

/** CMS overrides edited in /admin. Cached for 60 s and purged via revalidateTag on save. */
export const getAdminContent = unstable_cache(fetchAdminContent, [ADMIN_CONTENT_TAG], {
  tags: [ADMIN_CONTENT_TAG],
  revalidate: 60,
});
