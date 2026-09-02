import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

/** 256-bit one-time token embedded in the Telegram preview link. */
export function generateApprovalToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/** Constant-time comparison of a presented token against the stored hash. */
export function verifyToken(token: string | null | undefined, hash: string | null | undefined): boolean {
  if (!token || !hash) return false;
  const a = Buffer.from(hashToken(token));
  const b = Buffer.from(hash);
  return a.length === b.length && timingSafeEqual(a, b);
}
