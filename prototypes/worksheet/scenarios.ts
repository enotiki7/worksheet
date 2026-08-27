export type Scenario =
  | "default"
  | "empty"
  | "loading"
  | "error"
  | "success";

export const scenarios: Scenario[] = [
  "default",
  "empty",
  "loading",
  "error",
  "success",
];

export function getScenario(value: string | null): Scenario {
  return scenarios.find((item) => item === value) ?? "default";
}
