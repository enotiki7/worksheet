import type { ScreenId, Scenario, Variant } from "../types";
import { variants, scenarios } from "../scenarios";

const SCREEN_OPTIONS: { id: ScreenId; label: string }[] = [
  { id: "intent", label: "Вход" },
  { id: "library", label: "Библиотека" },
  { id: "planHome", label: "КТП" },
  { id: "lessonPick", label: "Выбор урока" },
  { id: "basics", label: "Сведения" },
  { id: "context", label: "Контекст" },
  { id: "goals", label: "Цели" },
  { id: "generatingPlan", label: "Генерация плана" },
  { id: "plan", label: "План" },
  { id: "stageEdit", label: "Этап" },
  { id: "kitSelect", label: "Комплект" },
  { id: "generatingKit", label: "Генерация материалов" },
  { id: "kit", label: "Карточка" },
  { id: "material", label: "Рабочий лист" },
  { id: "readiness", label: "Готовность" },
  { id: "saveContext", label: "Сохранить" },
];

export function PrototypeControls({
  variant,
  scenario,
  screen,
  onVariant,
  onScenario,
  onScreen,
}: {
  variant: Variant;
  scenario: Scenario;
  screen: ScreenId;
  onVariant: (value: Variant) => void;
  onScenario: (value: Scenario) => void;
  onScreen: (value: ScreenId) => void;
}) {
  return (
    <div className="wf-controls" aria-label="Управление прототипом">
      <span>Прототип</span>
      <label>
        variant
        <select value={variant} onChange={(event) => onVariant(event.target.value as Variant)}>
          {variants.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>
      <label>
        scenario
        <select value={scenario} onChange={(event) => onScenario(event.target.value as Scenario)}>
          {scenarios.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>
      <label>
        экран
        <select value={screen} onChange={(event) => onScreen(event.target.value as ScreenId)}>
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
