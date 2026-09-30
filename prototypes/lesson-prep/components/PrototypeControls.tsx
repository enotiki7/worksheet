import type { ScreenId, Variant } from "../types";

const VARIANT_OPTIONS: { id: Variant; label: string }[] = [
  { id: "full", label: "full — две колонки" },
  { id: "steps", label: "steps — два шага" },
  { id: "tabs", label: "tabs — вкладки" },
  { id: "stack", label: "stack — одна колонка" },
  { id: "rail", label: "rail — этапы слева" },
];

const SCREEN_OPTIONS: { id: ScreenId; label: string }[] = [
  { id: "intent", label: "Вход" },
  { id: "entry", label: "Сценарий" },
  { id: "prep", label: "Подготовка" },
  { id: "result", label: "Урок" },
];

export function PrototypeControls({
  variant,
  screen,
  onVariant,
  onScreen,
}: {
  variant: Variant;
  screen: ScreenId;
  onVariant: (value: Variant) => void;
  onScreen: (value: ScreenId) => void;
}) {
  const screenValue = screen === "generating" ? "result" : screen;
  return (
    <div className="wf-controls" aria-label="Управление прототипом">
      <span>Прототип</span>
      <label>
        variant
        <select value={variant} onChange={(event) => onVariant(event.target.value as Variant)}>
          {VARIANT_OPTIONS.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
      <label>
        экран
        <select value={screenValue} onChange={(event) => onScreen(event.target.value as ScreenId)}>
          {SCREEN_OPTIONS.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
