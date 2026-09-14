import { describe, it, expect } from "vitest";
import { getClientIp } from "./ip";

describe("getClientIp", () => {
  it("prioritizes x-real-ip header", () => {
    const req = new Request("https://admov.io/api/contact", {
      headers: {
        "x-real-ip": "203.0.113.195",
        "x-forwarded-for": "198.51.100.1, 10.0.0.1",
      },
    });
    expect(getClientIp(req)).toBe("203.0.113.195");
  });

  it("uses x-vercel-forwarded-for if x-real-ip is missing", () => {
    const req = new Request("https://admov.io/api/contact", {
      headers: {
        "x-vercel-forwarded-for": "198.51.100.42",
        "x-forwarded-for": "attacker-spoofed-ip, 198.51.100.42",
      },
    });
    expect(getClientIp(req)).toBe("198.51.100.42");
  });

  it("takes the outermost (last) entry of x-forwarded-for to prevent spoofing", () => {
    const req = new Request("https://admov.io/api/contact", {
      headers: {
        "x-forwarded-for": "attacker.spoofed.ip, 192.0.2.1",
      },
    });
    expect(getClientIp(req)).toBe("192.0.2.1");
  });

  it("returns 'unknown' when no proxy headers are present", () => {
    const req = new Request("https://admov.io/api/contact");
    expect(getClientIp(req)).toBe("unknown");
  });
});
