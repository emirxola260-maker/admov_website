export interface RateLimitOptions {
  windowMs: number;
  max: number;
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfterMs: number;
}

// In-memory store. Persists across invocations within a warm function instance.
// Best-effort on serverless (not shared across instances) — for distributed
// enforcement, back this with Upstash Redis or Vercel BotID later.
const hits = new Map<string, number[]>();

export function rateLimit(
  key: string,
  opts: RateLimitOptions,
  now: number = Date.now(),
): RateLimitResult {
  const windowStart = now - opts.windowMs;
  const recent = (hits.get(key) || []).filter((t) => t > windowStart);

  // Periodically sweep expired keys if the cache grows large under scan traffic
  if (hits.size > 2000) {
    for (const [k, timestamps] of hits.entries()) {
      if (timestamps.length === 0 || timestamps[timestamps.length - 1] <= now - 600_000) {
        hits.delete(k);
      }
    }
  }

  if (recent.length >= opts.max) {
    hits.set(key, recent);
    const retryAfterMs = Math.max(0, recent[0] + opts.windowMs - now);
    return { allowed: false, retryAfterMs };
  }

  recent.push(now);
  hits.set(key, recent);
  return { allowed: true, retryAfterMs: 0 };
}

export function resetRateLimit(): void {
  hits.clear();
}
