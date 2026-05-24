import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// Create a dummy client if env vars are missing (for development without Supabase)
let supabaseInstance: ReturnType<typeof createClient> | null = null;

try {
  if (supabaseUrl && supabaseKey) {
    supabaseInstance = createClient(supabaseUrl, supabaseKey);
  } else {
    console.warn("Supabase credentials not found. Using fallback mode.");
  }
} catch (error) {
  console.error("Error initializing Supabase:", error);
}

export const supabase = supabaseInstance;

export async function getAdminContentFromSupabase() {
  if (!supabase) {
    console.warn("Supabase not initialized, returning null");
    return null;
  }

  try {
    const { data, error } = await supabase
      .from("admin_content")
      .select("content")
      .eq("id", "admov_main")
      .single();

    if (error) {
      console.error("Error fetching admin content:", error);
      return null;
    }

    return (data as any)?.content || null;
  } catch (error) {
    console.error("Error fetching admin content from Supabase:", error);
    return null;
  }
}

export async function saveAdminContentToSupabase(content: any) {
  if (!supabase) {
    console.warn("Supabase not initialized, cannot save");
    return false;
  }

  try {
    const { error } = await supabase
      .from("admin_content")
      .upsert({
        id: "admov_main",
        content,
        updated_at: new Date().toISOString(),
      } as any);

    if (error) {
      console.error("Error saving admin content:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error saving admin content to Supabase:", error);
    return false;
  }
}

export function subscribeToAdminContent(callback: (data: any) => void) {
  if (!supabase) {
    console.warn("Supabase not initialized, subscription not available");
    return () => {};
  }

  // Use polling instead of realtime to avoid subscription issues
  const interval = setInterval(async () => {
    try {
      const { data, error } = await supabase
        .from("admin_content")
        .select("content")
        .eq("id", "admov_main")
        .single();

      if (!error && data) {
        callback((data as any)?.content || null);
      }
    } catch (e) {
      // Ignore polling errors
    }
  }, 60000); // Poll every 60 seconds

  return () => {
    clearInterval(interval);
  };
}
