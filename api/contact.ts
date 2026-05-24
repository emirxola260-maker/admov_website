import type { VercelRequest, VercelResponse } from "@vercel/node";
import { validateContactPayload, buildTelegramMessage } from "./_lib/telegram";
import { rateLimit } from "./_lib/ratelimit";

function getClientIp(req: VercelRequest): string {
  const fwd = req.headers["x-forwarded-for"];
  if (typeof fwd === "string") return fwd.split(",")[0].trim();
  if (Array.isArray(fwd) && fwd.length > 0) return fwd[0].trim();
  return req.socket?.remoteAddress || "unknown";
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Honeypot: real users never fill this hidden field. Bots fill everything.
  // Pretend success so we don't tip off the bot, but drop the submission.
  const body = req.body && typeof req.body === "object" ? (req.body as Record<string, unknown>) : {};
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return res.status(200).json({ ok: true });
  }

  // Best-effort per-IP rate limit: 5 submissions per 10 minutes.
  const { allowed, retryAfterMs } = rateLimit(`contact:${getClientIp(req)}`, {
    windowMs: 10 * 60 * 1000,
    max: 5,
  });
  if (!allowed) {
    res.setHeader("Retry-After", Math.ceil(retryAfterMs / 1000).toString());
    return res.status(429).json({ error: "Too many requests. Please try again later." });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.error("TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID not configured");
    return res.status(500).json({ error: "Server is not configured" });
  }

  const result = validateContactPayload(req.body);
  if (!result.ok) {
    return res.status(400).json({ error: result.error });
  }

  try {
    const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: buildTelegramMessage(result.data),
        parse_mode: "HTML",
      }),
    });

    if (!tgRes.ok) {
      console.error("Telegram API error:", await tgRes.text());
      return res.status(502).json({ error: "Failed to deliver message" });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Error sending to Telegram:", err);
    return res.status(502).json({ error: "Failed to deliver message" });
  }
}
