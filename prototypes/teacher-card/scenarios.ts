export type Scenario = "empty" | "filled" | "error";

export const scenarios: Scenario[] = ["empty", "filled", "error"];

export function getScenario(value: string | null): Scenario {
  return scenarios.find((item) => item === value) ?? "empty";
}
