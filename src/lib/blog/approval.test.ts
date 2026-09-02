import { describe, it, expect } from "vitest";
import { generateApprovalToken, hashToken, verifyToken } from "./approval";

describe("approval tokens", () => {
  it("round-trips a generated token", () => {
    const token = generateApprovalToken();
    expect(token.length).toBeGreaterThan(30);
    expect(verifyToken(token, hashToken(token))).toBe(true);
  });
  it("rejects wrong, empty or missing tokens", () => {
    const hash = hashToken(generateApprovalToken());
    expect(verifyToken("nope", hash)).toBe(false);
    expect(verifyToken("", hash)).toBe(false);
    expect(verifyToken(generateApprovalToken(), null)).toBe(false);
  });
});
