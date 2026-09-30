import type { Variant } from "./types";

export const variants: Variant[] = ["full", "steps", "tabs", "stack", "rail"];

export function getVariant(value: string | null): Variant {
  return variants.find((item) => item === value) ?? "full";
}
