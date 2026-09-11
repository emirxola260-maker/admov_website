import { localizePath } from "@/lib/i18n/paths";
import { sanitizeHttpUrl } from "@/lib/security";
import type { Language } from "@/i18n/config";

/** Cookie recording which announcement the visitor dismissed. */
export const ANNOUNCE_COOKIE = "admov-announce";

export interface Announcement {
  text: string;
  href: string | null;
  linkLabel: string;
  /** Changes whenever the message does, so a new one reaches people who closed the old one. */
  version: string;
}

/** FNV-1a — tiny, deterministic, identical on server and client. Not for security. */
export function hashAnnouncement(input: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(36);
}

/**
 * The announcement for a language, or null when there is nothing to show.
 *
 * Off unless switched on in /admin with text for the language (English is the
 * fallback). An internal link such as "/apps" is rewritten to the visitor's
 * language ("/ar/apps"), so the bar never drops someone out of Arabic.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getAnnouncement(adminContent: any, lang: Language): Announcement | null {
  const a = adminContent?.announcement;
  if (!a?.enabled) return null;
  const text = String(a.text?.[lang] || a.text?.en || "").trim();
  if (!text) return null;

  const raw = String(a.linkUrl || "").trim();
  let href: string | null = null;
  if (raw.startsWith("/")) href = localizePath(raw, lang) ?? raw;
  else if (raw) href = sanitizeHttpUrl(raw) || null;

  const linkLabel = String(a.linkLabel?.[lang] || a.linkLabel?.en || "").trim();
  const version = hashAnnouncement(JSON.stringify([a.text ?? {}, raw]));
  return { text, href, linkLabel, version };
}
