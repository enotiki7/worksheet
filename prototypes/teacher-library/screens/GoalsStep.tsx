import { ALT_GOAL, DEFAULT_GOAL } from "../mock";
import type { LessonState } from "../types";
import { Stepper, WButton, WField, WInput, WTextarea } from "../components/wire";

const STEPS = ["Задача", "Урок", "Сведения", "Контекст", "Цели", "План", "Материалы", "Готовность"];

export function GoalsStep({
  lesson,
  onChange,
  onGenerate,
  onBack,
}: {
  lesson: LessonState;
  onChange: (patch: Partial<LessonState>) => void;
  onGenerate: () => void;
  onBack: () => void;
}) {
  const updateResult = (id: string, text: string) => {
    onChange({
      plannedResults: lesson.plannedResults.map((item) => (item.id === id ? { ...item, text } : item)),
    });
  };

  return (
    <div>
      <Stepper steps={STEPS} current="Цели" />
      <div className="wf-row" style={{ justifyContent: "space-between" }}>
        <h1 className="wf-h1">Педагогический замысел</h1>
        <span className="wf-badge">AI-черновик</span>
      </div>
      <p className="wf-lead">Проверьте цель и результаты до генерации плана. Можно изменить формулировки или принять рекомендацию.</p>
      <div className="wf-stack">
        <WField label="Предлагаемая цель">
          <WTextarea value={lesson.lessonGoal} onChange={(event) => onChange({ lessonGoal: event.target.value })} />
        </WField>
        <div className="wf-row">
          <WButton variant="ghost" onClick={() => onChange({ lessonGoal: ALT_GOAL })}>
            Предложить другой вариант
          </WButton>
          <WButton variant="ghost" onClick={() => onChange({ lessonGoal: DEFAULT_GOAL })}>
            Вернуть исходную
          </WButton>
        </div>
        <p className="wf-card-kicker">Планируемые результаты</p>
        {lesson.plannedResults.map((item) => (
          <div className="wf-row" key={item.id}>
            <WInput value={item.text} onChange={(event) => updateResult(item.id, event.target.value)} />
            <WButton
              variant="ghost"
              onClick={() => onChange({ plannedResults: lesson.plannedResults.filter((result) => result.id !== item.id) })}
            >
              Удалить
            </WButton>
          </div>
        ))}
        <WButton
          variant="secondary"
          onClick={() =>
            onChange({
              plannedResults: [
                ...lesson.plannedResults,
                { id: `r-${lesson.plannedResults.length + 1}`, text: "Свой результат" },
              ],
            })
          }
        >
          Добавить свой результат
        </WButton>
        <div className="wf-grid wf-grid-2">
          <div className="wf-card">
            <p className="wf-card-title">Ключевое содержание</p>
            <ul className="wf-list">
              {lesson.keyContent.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="wf-hint">Связь с учебником: § «Уравнения», после темы «Числовые выражения».</p>
          </div>
          <div className="wf-card">
            <p className="wf-card-title">Предварительные знания</p>
            <ul className="wf-list">
              {lesson.priorKnowledge.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="wf-card">
            <p className="wf-card-title">Возможные затруднения</p>
            <ul className="wf-list">
              {lesson.difficulties.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="wf-card">
            <p className="wf-card-title">Способ проверки</p>
            <p className="wf-card-detail">{lesson.assessment}</p>
          </div>
        </div>
        <div className="wf-card">
          <p className="wf-card-kicker">Рекомендация AI</p>
          <p className="wf-card-detail">{lesson.recommendation}</p>
          <div className="wf-footer-actions">
            <WButton
              variant={lesson.recommendationAccepted ? "primary" : "secondary"}
              onClick={() => onChange({ recommendationAccepted: true })}
            >
              {lesson.recommendationAccepted ? "Рекомендация принята" : "Принять рекомендацию"}
            </WButton>
            <WButton variant="ghost" onClick={() => onChange({ recommendationAccepted: false })}>
              Не учитывать
            </WButton>
          </div>
        </div>
      </div>
      <div className="wf-footer-actions">
        <WButton onClick={onGenerate}>Сформировать план-конспект урока</WButton>
        <WButton variant="ghost" onClick={onBack}>
          Назад
        </WButton>
      </div>
    </div>
  );
}
