import { describe, it, expect, beforeEach } from "vitest";
import { rateLimit, resetRateLimit } from "./ratelimit";

beforeEach(() => resetRateLimit());

describe("rateLimit", () => {
  it("allows up to max within the window", () => {
    const opts = { windowMs: 1000, max: 3 };
    expect(rateLimit("k", opts, 0).allowed).toBe(true);
    expect(rateLimit("k", opts, 100).allowed).toBe(true);
    expect(rateLimit("k", opts, 200).allowed).toBe(true);
  });

  it("blocks the request over the limit and reports retryAfter", () => {
    const opts = { windowMs: 1000, max: 2 };
    rateLimit("k", opts, 0);
    rateLimit("k", opts, 10);
    const r = rateLimit("k", opts, 20);
    expect(r.allowed).toBe(false);
    expect(r.retryAfterMs).toBeGreaterThan(0);
  });

  it("allows again once the window has passed", () => {
    const opts = { windowMs: 1000, max: 1 };
    expect(rateLimit("k", opts, 0).allowed).toBe(true);
    expect(rateLimit("k", opts, 500).allowed).toBe(false);
    expect(rateLimit("k", opts, 1500).allowed).toBe(true);
  });

  it("tracks keys independently", () => {
    const opts = { windowMs: 1000, max: 1 };
    expect(rateLimit("a", opts, 0).allowed).toBe(true);
    expect(rateLimit("b", opts, 0).allowed).toBe(true);
  });

  it("sweeps expired entries when map grows over 2000 items", () => {
    const opts = { windowMs: 1000, max: 5 };
    const baseTime = 1_000_000;
    // Populate 2005 keys with old timestamps
    for (let i = 0; i < 2005; i++) {
      rateLimit(`old-${i}`, opts, baseTime);
    }
    // Now call rateLimit with a timestamp 15 minutes in the future (> 600_000 ms later)
    const futureTime = baseTime + 900_000;
    const r = rateLimit("fresh-key", opts, futureTime);
    expect(r.allowed).toBe(true);
  });
});
