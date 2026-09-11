import { describe, it, expect } from "vitest";
import { gaCookieNames } from "./consent";

describe("gaCookieNames", () => {
  it("finds the Google Analytics cookies", () => {
    expect(gaCookieNames("_ga=GA1.1.1; _ga_35B5ZKGN2K=GS1.1; _gid=GA1.2")).toEqual(["_ga", "_ga_35B5ZKGN2K", "_gid"]);
  });

  it("leaves the site's own cookies alone", () => {
    // admov-lang is strictly necessary and must survive a withdrawal of consent.
    expect(gaCookieNames("admov-lang=ar; _ga=GA1.1.1")).toEqual(["_ga"]);
  });

  it("does not match lookalike names", () => {
    expect(gaCookieNames("_gallery=1; ga=2; my_ga=3")).toEqual([]);
  });

  it("handles an empty cookie string", () => {
    expect(gaCookieNames("")).toEqual([]);
  });
});
