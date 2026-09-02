import { describe, it, expect } from "vitest";
import { Deadline } from "./deadline";

describe("Deadline", () => {
  it("reports remaining time and never goes negative", () => {
    const d = new Deadline(100_000, 0);
    expect(d.remaining(0)).toBe(100_000);
    expect(d.remaining(40_000)).toBe(60_000);
    expect(d.remaining(500_000)).toBe(0);
  });

  it("caps a call timeout and reserves time for the rest of the run", () => {
    const d = new Deadline(240_000, 0);
    expect(d.timeoutFor(140_000, 90_000, 0)).toBe(140_000);
    // Late in the run the remaining budget wins over the cap.
    expect(d.timeoutFor(140_000, 90_000, 180_000)).toBe(0);
    expect(d.timeoutFor(80_000, 15_000, 200_000)).toBe(25_000);
  });

  it("answers whether another call fits", () => {
    const d = new Deadline(240_000, 0);
    expect(d.allows(170_000, 0)).toBe(true);
    expect(d.allows(170_000, 100_000)).toBe(false);
  });
});
