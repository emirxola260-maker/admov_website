import { createServiceClient } from "@/lib/supabase/admin";
import { rateLimit } from "@/lib/server/ratelimit";
import { escapeHtml, sendTelegramMessage } from "@/lib/server/telegram";
import { isLanguage } from "@/i18n/config";

function getClientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: Request) {
  const raw: unknown = await request.json().catch(() => null);
  const body = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};

  // Honeypot
  if (typeof body.company === "string" && body.company.trim() !== "") return Response.json({ ok: true });

  const { allowed } = rateLimit(`newsletter:${getClientIp(request)}`, { windowMs: 10 * 60 * 1000, max: 5 });
  if (!allowed) return Response.json({ error: "Too many requests" }, { status: 429 });

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) {
    return Response.json({ error: "A valid email is required" }, { status: 400 });
  }
  const lang = isLanguage(body.lang) ? body.lang : "en";
  const source = typeof body.source === "string" ? body.source.slice(0, 60) : "footer";

  let supabase;
  try {
    supabase = createServiceClient();
  } catch {
    return Response.json({ error: "Server is not configured" }, { status: 500 });
  }
  const { error } = await supabase.from("subscribers").upsert({ email, lang, source } as never, { onConflict: "email", ignoreDuplicates: true });
  if (error) {
    console.error("subscriber insert failed:", error.message);
    return Response.json({ error: "Could not subscribe" }, { status: 500 });
  }

  await sendTelegramMessage(`📬 <b>New newsletter subscriber</b>\n${escapeHtml(email)} · ${lang} · ${escapeHtml(source)}`);
  return Response.json({ ok: true });
}
