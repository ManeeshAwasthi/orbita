import { describe, expect, it } from "vitest";
import {
  createCommandPlan,
  detectPlatforms,
  inferObjective,
  opportunityYield,
} from "./orbita-engine";

describe("orbita engine", () => {
  it("detects platform-specific requests", () => {
    expect(detectPlatforms("Give me three X posts about geopolitics")).toEqual(["X"]);
    expect(detectPlatforms("Write for LinkedIn and Reddit")).toEqual(["LinkedIn", "Reddit"]);
  });

  it("infers relationship-oriented objectives", () => {
    expect(inferObjective("I want to network with consultants")).toBe("Networking");
    expect(inferObjective("Find conversations worth joining")).toBe("Conversations");
  });

  it("creates a command plan with a draft", () => {
    const plan = createCommandPlan(
      "I want to write something about India's AI policy today and reach young policy researchers.",
    );

    expect(plan.platforms).toContain("LinkedIn");
    expect(plan.audience).toBe("Young policy researchers");
    expect(plan.draft?.warnings).toContain("No banned voice patterns detected");
  });

  it("calculates opportunity yield from outcomes instead of vanity metrics alone", () => {
    expect(opportunityYield({ impressions: 1000, conversations: 10, relationships: 2, opportunities: 1 })).toBe(31);
    expect(opportunityYield({ impressions: 0, conversations: 10, relationships: 2, opportunities: 1 })).toBe(0);
  });
});
