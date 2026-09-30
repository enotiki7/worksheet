import type { Scenario, ScreenId } from "../types";
import { scenarios } from "../scenarios";

const SCREENS: { id: ScreenId; label: string }[] = [
  { id: "phone", label: "Телефон" },
  { id: "onboarding-1", label: "Онбординг 1" },
  { id: "onboarding-2", label: "Онбординг 2" },
  { id: "onboarding-3", label: "Онбординг 3" },
  { id: "onboarding-4", label: "Онбординг 4" },
  { id: "home", label: "Главный" },
  { id: "lesson-collect", label: "Сбор профиля" },
  { id: "lesson-context", label: "Выбор связки" },
  { id: "lesson-pick", label: "Выбор урока" },
  { id: "lesson-edit", label: "Редактирование" },
  { id: "lesson-generating", label: "Генерация" },
  { id: "lesson-workspace", label: "Материалы урока" },
];

export function PrototypeControls({
  scenario,
  screen,
  onScenario,
  onScreen,
}: {
  scenario: Scenario;
  screen: ScreenId;
  onScenario: (value: Scenario) => void;
  onScreen: (value: ScreenId) => void;
}) {
  return (
    <div className="wf-controls" aria-label="Управление прототипом">
      <span>Wireframe</span>
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
          {SCREENS.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
