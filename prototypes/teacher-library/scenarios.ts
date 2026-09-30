import type { Scenario, Variant } from "./types";

export const variants: Variant[] = ["wizard", "library", "plan"];
export const scenarios: Scenario[] = ["first-use", "test-task", "kit-ready"];

export function getVariant(value: string | null): Variant {
  return variants.find((item) => item === value) ?? "wizard";
}

export function getScenario(value: string | null): Scenario {
  return scenarios.find((item) => item === value) ?? "first-use";
}
