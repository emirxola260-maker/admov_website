import {
  validateContactPayload,
  buildTelegramMessage,
  sendTelegramMessage,
  isTelegramConfigured,
} from "@/lib/server/telegram";
import { rateLimit } from "@/lib/server/ratelimit";

function getClientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: Request) {
  const raw: unknown = await request.json().catch(() => null);
  const body = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};

  // Honeypot: real users never fill this hidden field. Bots fill everything.
  // Pretend success so we don't tip off the bot, but drop the submission.
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return Response.json({ ok: true });
  }

  // Best-effort per-IP rate limit: 5 submissions per 10 minutes.
  const { allowed, retryAfterMs } = rateLimit(`contact:${getClientIp(request)}`, {
    windowMs: 10 * 60 * 1000,
    max: 5,
  });
  if (!allowed) {
    return Response.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": Math.ceil(retryAfterMs / 1000).toString() } },
    );
  }

  if (!isTelegramConfigured()) {
    console.error("TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID not configured");
    return Response.json({ error: "Server is not configured" }, { status: 500 });
  }

  const result = validateContactPayload(raw);
  if (!result.ok || !result.data) {
    return Response.json({ error: result.error }, { status: 400 });
  }

  const sent = await sendTelegramMessage(buildTelegramMessage(result.data));
  if (!sent.ok) {
    return Response.json({ error: "Failed to deliver message" }, { status: 502 });
  }
  return Response.json({ ok: true });
}
