import "server-only";
import { createClient } from "@supabase/supabase-js";
import { createServiceClient } from "@/lib/supabase/admin";

export type AdminCheck = { ok: true; userId: string } | { ok: false; response: Response };

/**
 * Verifies `Authorization: Bearer <supabase access token>` and that the user is
 * in the public.admins allowlist. Used by every /api/admin/* route handler.
 */
export async function requireAdmin(request: Request): Promise<AdminCheck> {
  const header = request.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (!token) return { ok: false, response: Response.json({ error: "Unauthorized" }, { status: 401 }) };

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return { ok: false, response: Response.json({ error: "Server is not configured" }, { status: 500 }) };

  const authClient = createClient(url, anon, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  const { data, error } = await authClient.auth.getUser(token);
  // A transport/service failure is not the same as a bad token: report it as a
  // server error (and log it) instead of telling a valid admin they are signed out.
  if (error && error.status !== 401 && error.status !== 403) {
    console.error("getUser failed:", error.message);
    return { ok: false, response: Response.json({ error: "Could not verify access" }, { status: 500 }) };
  }
  if (error || !data.user) return { ok: false, response: Response.json({ error: "Unauthorized" }, { status: 401 }) };

  let service;
  try {
    service = createServiceClient();
  } catch {
    return { ok: false, response: Response.json({ error: "Server is not configured" }, { status: 500 }) };
  }
  const { data: row, error: lookupError } = await service
    .from("admins")
    .select("user_id")
    .eq("user_id", data.user.id)
    .maybeSingle();
  // Without this branch a Supabase outage is indistinguishable from "not an admin",
  // so a real admin sees Forbidden and nothing is logged. Still fails closed.
  if (lookupError) {
    console.error("admins lookup failed:", lookupError.message);
    return { ok: false, response: Response.json({ error: "Could not verify access" }, { status: 500 }) };
  }
  if (!row) return { ok: false, response: Response.json({ error: "Forbidden" }, { status: 403 }) };

  return { ok: true, userId: data.user.id };
}
