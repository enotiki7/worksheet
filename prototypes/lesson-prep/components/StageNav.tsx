import type { ScreenId, Variant } from "../types";

const STAGES: { id: ScreenId; label: string }[] = [
  { id: "entry", label: "Сведения" },
  { id: "prep", label: "Урок" },
  { id: "result", label: "Материалы" },
];

export function StageNav({
  variant,
  screen,
  onScreen,
}: {
  variant: Variant;
  screen: ScreenId;
  onScreen: (screen: ScreenId) => void;
}) {
  const current = screen === "generating" ? "result" : screen;
  return (
    <nav className={variant === "rail" ? "wf-stages is-rail" : "wf-stages"} aria-label="Этапы">
      {STAGES.map((stage, index) => (
        <button
          key={stage.id}
          type="button"
          className={stage.id === current ? "is-current" : undefined}
          onClick={() => onScreen(stage.id)}
        >
          {index + 1}. {stage.label}
        </button>
      ))}
    </nav>
  );
}
