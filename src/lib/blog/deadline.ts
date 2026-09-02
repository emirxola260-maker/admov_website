/**
 * Wall-clock budget for one generation run.
 *
 * The cron and admin routes declare `maxDuration = 300`. When Vercel kills an
 * invocation nothing runs afterwards — no catch block, no status update, no
 * Telegram message — so every model call must be bounded such that the whole
 * run finishes with time to spare for the database writes and the notification.
 */
export class Deadline {
  private readonly endsAt: number;

  constructor(budgetMs: number, now: number = Date.now()) {
    this.endsAt = now + budgetMs;
  }

  remaining(now: number = Date.now()): number {
    return Math.max(0, this.endsAt - now);
  }

  allows(ms: number, now: number = Date.now()): boolean {
    return this.remaining(now) >= ms;
  }

  /** Timeout for a single call: capped, and always leaving `reserveMs` for the rest of the run. */
  timeoutFor(capMs: number, reserveMs = 10_000, now: number = Date.now()): number {
    return Math.min(capMs, Math.max(0, this.remaining(now) - reserveMs));
  }
}

/** Total time the generator may spend, leaving headroom inside the 300 s function limit. */
export const GENERATION_BUDGET_MS = 240_000;
/** A model call shorter than this is not worth starting. */
export const MIN_CALL_MS = 20_000;
