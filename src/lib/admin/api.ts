import { supabase } from "@/lib/supabase/client";

/** POST to an /api/admin/* route with the current Supabase session as a bearer token. */
export async function adminFetch<T = unknown>(path: string, body: unknown, init?: { signal?: AbortSignal }): Promise<T> {
  if (!supabase) throw new Error("Supabase is not configured");
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("You are signed out. Please sign in again.");
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
    signal: init?.signal,
  });
  const json = (await res.json().catch(() => ({}))) as { error?: string } & T;
  if (!res.ok) throw new Error(json.error || `Request failed (${res.status})`);
  return json as T;
}

/** Purge cached public pages after a direct Supabase write. Failures are logged, not thrown. */
export async function revalidateTags(tags: string[]): Promise<void> {
  try {
    await adminFetch("/api/admin/revalidate", { tags });
  } catch (err) {
    console.warn("revalidate failed:", err instanceof Error ? err.message : err);
  }
}
