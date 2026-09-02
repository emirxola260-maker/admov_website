import { escapeHtml, sendTelegramMessage } from "@/lib/server/telegram";
import { wordCount } from "./utils";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://admov.io";

export interface DraftNotification {
  title: string;
  excerpt: string;
  pillar: string;
  topic?: string | null;
  bodies: { en?: string; ar?: string; tr?: string };
}

/** HTML message for Telegram. Every user-controlled/model-controlled string is escaped. */
export function buildDraftTelegramMessage(d: DraftNotification): string {
  const words = (["en", "ar", "tr"] as const).map((l) => `${l.toUpperCase()} ${wordCount(d.bodies[l])}w`).join(" · ");
  return [
    "📝 <b>New blog draft ready for review</b>",
    "",
    `<b>${escapeHtml(d.title)}</b>`,
    escapeHtml(d.excerpt),
    "",
    `🏷 ${escapeHtml(d.pillar)}${d.topic ? ` — ${escapeHtml(d.topic)}` : ""}`,
    `📏 ${words}`,
    "",
    "Open the preview to approve or reject. Nothing is published until you approve.",
  ].join("\n");
}

export function draftKeyboard(previewUrl: string, adminUrl: string) {
  return {
    inline_keyboard: [[{ text: "👀 Preview & approve", url: previewUrl }], [{ text: "🛠 Open admin", url: adminUrl }]],
  };
}

export async function notifyDraft(input: DraftNotification & { id: string; token: string }) {
  const previewUrl = `${SITE_URL}/admin/approve?id=${encodeURIComponent(input.id)}&token=${encodeURIComponent(input.token)}`;
  return sendTelegramMessage(buildDraftTelegramMessage(input), {
    replyMarkup: draftKeyboard(previewUrl, `${SITE_URL}/admin#blog`),
    disableLinkPreview: true,
  });
}

export async function notifyPublished(title: string, url: string) {
  return sendTelegramMessage(`✅ <b>Published</b>\n<a href="${escapeHtml(url)}">${escapeHtml(title)}</a>`);
}

export async function notifyRejected(title: string) {
  return sendTelegramMessage(`🗑 <b>Draft rejected</b>\n${escapeHtml(title)}`);
}

export async function notifyFailure(message: string) {
  return sendTelegramMessage(`❌ <b>Blog generation failed</b>\n${escapeHtml(message)}\n\nYou can retry from /admin → Blog → Generate now.`, {
    disableLinkPreview: true,
  });
}
