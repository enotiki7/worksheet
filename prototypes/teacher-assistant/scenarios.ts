import type { Scenario, UserProfile } from "./types";
import { DEFAULT_PAIR } from "./mock";

export const scenarios: Scenario[] = ["full-onboarding", "skipped", "multi-subject"];

export function getScenario(value: string | null): Scenario {
  if (value && scenarios.includes(value as Scenario)) return value as Scenario;
  return "full-onboarding";
}

export function profileForScenario(scenario: Scenario): UserProfile {
  if (scenario === "skipped") {
    return {
      phone: "",
      roles: [],
      pairs: [],
      scheduleFile: null,
      planFile: null,
      skippedOnboarding: true,
      completedSteps: 0,
    };
  }

  if (scenario === "multi-subject") {
    return {
      phone: "+7 903 555-12-34",
      roles: ["subject", "classTeacher"],
      pairs: [
        DEFAULT_PAIR,
        { id: "pair-2", subject: "Русский язык", grade: "8", umk: "Баранов 5–9" },
      ],
      scheduleFile: "raspisanie_9A.xlsx",
      planFile: "ktp_algebra_9.docx",
      skippedOnboarding: false,
      completedSteps: 4,
    };
  }

  return {
    phone: "",
    roles: [],
    pairs: [],
    scheduleFile: null,
    planFile: null,
    skippedOnboarding: false,
    completedSteps: 0,
  };
}
