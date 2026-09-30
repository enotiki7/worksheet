import { GENERATORS, INTENT_ACTIONS } from "../mock";
import { Stepper, WButton, WCard } from "../components/wire";

const STEPS = ["Задача", "Урок", "Сведения", "Контекст", "Цели", "План", "Материалы", "Готовность"];

export function IntentHome({
  onPrepare,
  onOpenGenerators,
  onLater,
}: {
  onPrepare: () => void;
  onOpenGenerators: () => void;
  onLater: (kind: "checkWork" | "analyze") => void;
}) {
  return (
    <div>
      <Stepper steps={STEPS} current="Задача" />
      <h1 className="wf-h1">Что вы хотите сделать?</h1>
      <p className="wf-lead">Можно подготовить один урок. Класс, расписание и программу сохранять не обязательно.</p>
      <div className="wf-grid wf-grid-2">
        {INTENT_ACTIONS.map((action) => (
          <WCard
            key={action.id}
            title={action.title}
            detail={action.detail}
            later={"later" in action && action.later}
            onClick={() => {
              if (action.id === "prepare") onPrepare();
              else if (action.id === "material") onOpenGenerators();
              else onLater(action.id === "check" ? "checkWork" : "analyze");
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function GeneratorPicker({
  onPick,
  onBack,
}: {
  onPick: (id: string) => void;
  onBack: () => void;
}) {
  return (
    <div>
      <h1 className="wf-h1">Какой материал создать?</h1>
      <p className="wf-lead">Отдельный генератор. Чтобы собрать урок целиком, вернитесь и выберите «Подготовить урок».</p>
      <div className="wf-grid wf-grid-3">
        {GENERATORS.map((item) => (
          <WCard key={item.id} title={item.title} onClick={() => onPick(item.id)} />
        ))}
      </div>
      <div className="wf-footer-actions">
        <WButton variant="ghost" onClick={onBack}>
          Назад
        </WButton>
      </div>
    </div>
  );
}
