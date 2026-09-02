import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Browser-side client (anon key). Access is controlled by RLS; admin writes are
// allowed only for users listed in public.admins (see docs/security/*.sql).
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

let supabaseInstance: SupabaseClient | null = null;

try {
  if (supabaseUrl && supabaseKey) {
    supabaseInstance = createClient(supabaseUrl, supabaseKey);
  } else if (typeof window !== "undefined") {
    console.warn("Supabase credentials not found. Using fallback mode.");
  }
} catch (error) {
  console.error("Error initializing Supabase:", error);
}

export const supabase = supabaseInstance;

export async function getAdminContentFromSupabase() {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("admin_content")
      .select("content")
      .eq("id", "admov_main")
      .maybeSingle();
    if (error) {
      console.error("Error fetching admin content:", error.message);
      return null;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return ((data as { content?: Record<string, any> } | null)?.content ?? null) as Record<string, any> | null;
  } catch (error) {
    console.error("Error fetching admin content from Supabase:", error);
    return null;
  }
}

export async function saveAdminContentToSupabase(content: unknown) {
  if (!supabase) {
    console.warn("Supabase not initialized, cannot save");
    return false;
  }
  try {
    const { error } = await supabase
      .from("admin_content")
      .upsert({ id: "admov_main", content, updated_at: new Date().toISOString() } as never);
    if (error) {
      console.error("Error saving admin content:", error.message);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error saving admin content to Supabase:", error);
    return false;
  }
}
