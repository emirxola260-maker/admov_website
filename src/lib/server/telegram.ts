export interface ContactPayload {
  name: string;
  email: string;
  phone: string;
  workType: string;
  date: string;
  message: string;
  lang: string;
}

const LANG_LABELS: Record<string, string> = {
  en: "English",
  ar: "Arabic",
  tr: "Turkish",
};

export function escapeHtml(input: string): string {
  return String(input)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export interface ValidationResult {
  ok: boolean;
  data?: ContactPayload;
  error?: string;
}

export function validateContactPayload(body: unknown): ValidationResult {
  if (!body || typeof body !== "object") return { ok: false, error: "Invalid request body" };
  const b = body as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

  const name = str(b.name);
  const email = str(b.email);
  const phone = str(b.phone);
  const message = str(b.message);
  const workType = str(b.workType);
  const date = str(b.date);
  const lang = str(b.lang) || "en";

  if (name.length < 1 || name.length > 100) return { ok: false, error: "Name is required" };
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(email) || email.length > 200) return { ok: false, error: "A valid email is required" };
  if (phone.length < 3 || phone.length > 40) return { ok: false, error: "Phone is required" };
  if (message.length > 2000) return { ok: false, error: "Message is too long" };
  if (workType.length > 100) return { ok: false, error: "Invalid work type" };
  if (date.length > 60) return { ok: false, error: "Invalid date" };
  if (lang.length > 5) return { ok: false, error: "Invalid language" };

  return { ok: true, data: { name, email, phone, workType, date, message, lang } };
}

export function buildTelegramMessage(data: ContactPayload): string {
  return [
    "🎯 <b>New Contact Form Submission</b>",
    "",
    `👤 <b>Name:</b> ${escapeHtml(data.name)}`,
    `📧 <b>Email:</b> ${escapeHtml(data.email)}`,
    `📱 <b>Phone:</b> ${escapeHtml(data.phone)}`,
    `🛠 <b>Service:</b> ${escapeHtml(data.workType) || "Not selected"}`,
    `📅 <b>Preferred Date:</b> ${escapeHtml(data.date) || "Not selected"}`,
    `🌐 <b>Language:</b> ${escapeHtml(LANG_LABELS[data.lang] || data.lang)}`,
    "",
    "📝 <b>Message:</b>",
    escapeHtml(data.message) || "No message",
    "",
    "---",
    "Sent from ADMOV Website",
  ].join("\n");
}

export interface TelegramSendOptions {
  /** Telegram `reply_markup` (e.g. inline keyboard). */
  replyMarkup?: unknown;
  /** Disable link previews — required for approval links so nothing is pre-fetched. */
  disableLinkPreview?: boolean;
}

export function isTelegramConfigured(): boolean {
  return Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID);
}

/**
 * Sends an HTML-formatted message to the configured chat. Never throws; the bot
 * token is never logged (error objects could carry the request URL).
 */
export async function sendTelegramMessage(
  text: string,
  opts: TelegramSendOptions = {},
): Promise<{ ok: boolean; status: number }> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.error("TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID not configured");
    return { ok: false, status: 0 };
  }
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        ...(opts.disableLinkPreview ? { link_preview_options: { is_disabled: true } } : {}),
        ...(opts.replyMarkup ? { reply_markup: opts.replyMarkup } : {}),
      }),
    });
    if (!res.ok) console.error("Telegram API error: HTTP", res.status);
    return { ok: res.ok, status: res.status };
  } catch (err) {
    console.error("Error sending to Telegram:", err instanceof Error ? err.message : "unknown error");
    return { ok: false, status: 0 };
  }
}
