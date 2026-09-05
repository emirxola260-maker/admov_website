import "server-only";
import crypto from "node:crypto";

/** Days a download link stays valid, and how many times it may be used. */
export const DOWNLOAD_TTL_DAYS = 14;
export const DOWNLOAD_MAX_USES = 5;

/**
 * Licence key in ADMOV-XXXX-XXXX-XXXX form.
 *
 * Crockford's alphabet: no I, L, O or U, so a key read off a screen or down a
 * phone cannot be mistyped into a different valid-looking key.
 */
const ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

export function generateLicenseKey(): string {
  const groups = Array.from({ length: 3 }, () => {
    const bytes = crypto.randomBytes(4);
    return Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
  });
  return `ADMOV-${groups.join("-")}`;
}

/** The token goes to the buyer; only its hash is stored, like a password. */
export function generateDownloadToken(): { token: string; hash: string } {
  const token = crypto.randomBytes(32).toString("base64url");
  return { token, hash: hashToken(token) };
}

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function downloadExpiry(now = new Date()): string {
  return new Date(now.getTime() + DOWNLOAD_TTL_DAYS * 24 * 60 * 60 * 1000).toISOString();
}
