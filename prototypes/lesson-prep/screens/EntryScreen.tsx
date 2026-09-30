import {
  GRADES,
  MOCK_FILES,
  SUBJECTS,
  TEXTBOOKS,
  THEMATIC_PLANS,
  findPlan,
  isRequiredReady,
} from "../mock";
import type { EntryState, EntryTab, Variant } from "../types";
import { WButton, WField, WInput, WSelect, WTextarea } from "../components/wire";

export function EntryScreen({
  variant,
  entry,
  step,
  tab,
  onChange,
  onStep,
  onTab,
  onBack,
  onContinue,
}: {
  variant: Variant;
  entry: EntryState;
  step: 1 | 2;
  tab: EntryTab;
  onChange: (patch: Partial<EntryState>) => void;
  onStep: (step: 1 | 2) => void;
  onTab: (tab: EntryTab) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  const requiredReady = isRequiredReady(entry);
  const plan = findPlan(entry.planId);
  const canPickPlan = entry.subject === "Математика" && entry.grade === "5";
  const longForm = variant === "full" || variant === "stack" || variant === "rail";
  const showParams = longForm || (variant === "steps" && step === 1) || (variant === "tabs" && tab === "params");
  const showExtra = longForm || (variant === "steps" && step === 1) || (variant === "tabs" && tab === "extra");
  const showLessons = longForm || (variant === "steps" && step === 2) || (variant === "tabs" && tab === "lesson");

  const setSubject = (subject: string) => {
    onChange({
      subject,
      planId: subject === "Математика" ? entry.planId : "",
      lessonId: subject === "Математика" ? entry.lessonId : "",
    });
  };

  const setGrade = (grade: string) => {
    onChange({
      grade,
      planId: grade === "5" ? entry.planId : "",
      lessonId: grade === "5" ? entry.lessonId : "",
    });
  };

  const setPlan = (planId: string) => onChange({ planId, lessonId: "" });

  const addFile = () => {
    const name = MOCK_FILES.find((item) => !entry.ownFiles.some((file) => file.name === item));
    if (!name) return;
    onChange({ ownFiles: [...entry.ownFiles, { id: name, name }] });
  };

  return (
    <div>
      <h1 className="wf-h1">Сведения об уроке</h1>
      {variant === "steps" ? <p className="wf-meta">Шаг {step} из 2</p> : null}
      {variant === "tabs" ? (
        <div className="wf-tabs" role="tablist">
          {(
            [
              ["params", "Параметры"],
              ["extra", "Дополнительно"],
              ["lesson", "Урок"],
            ] as const
          ).map(([id, label]) => (
            <button key={id} type="button" role="tab" className={tab === id ? "wf-tab is-current" : "wf-tab"} aria-selected={tab === id} onClick={() => onTab(id)}>
              {label}
            </button>
          ))}
        </div>
      ) : null}

      {showParams ? (
        <div className="wf-stack">
          <WField label="Предмет" required hint="Сейчас можно выбрать только математику.">
            <WSelect value={entry.subject} options={SUBJECTS} onChange={(event) => setSubject(event.target.value)} />
          </WField>
          <WField label="Параллель" required hint="Сейчас можно выбрать только 5 параллель.">
            <WSelect value={entry.grade} options={GRADES} onChange={(event) => setGrade(event.target.value)} />
          </WField>
          <WField label="Длительность урока, мин" required>
            <WInput
              type="number"
              min={1}
              value={entry.duration || ""}
              onChange={(event) => onChange({ duration: Number(event.target.value) || 0 })}
            />
          </WField>
          <WField label="Тематический план" required hint={canPickPlan ? undefined : "Сначала выберите математику и 5 параллель."}>
            <WSelect
              value={entry.planId}
              disabled={!canPickPlan}
              options={canPickPlan ? THEMATIC_PLANS.map((item) => ({ value: item.id, label: item.title })) : []}
              onChange={(event) => setPlan(event.target.value)}
            />
          </WField>
        </div>
      ) : null}

      {showExtra ? (
        <div className="wf-stack" style={{ marginTop: showParams ? 16 : 0 }}>
          <WField label="Используемый учебник">
            <WSelect
              value={entry.textbook}
              options={TEXTBOOKS.map((item) => ({ value: item, label: item }))}
              onChange={(event) => onChange({ textbook: event.target.value })}
            />
          </WField>
          <WField label="Особенности класса">
            <WTextarea
              value={entry.classNotes}
              placeholder="Например: 26 учеников, темп средний, четверо путают неизвестное слагаемое"
              onChange={(event) => onChange({ classNotes: event.target.value })}
            />
          </WField>
          <div className="wf-field">
            <span className="wf-label">Свои материалы</span>
            <div className="wf-row">
              {entry.ownFiles.map((file) => (
                <span key={file.id} className="wf-chip">
                  {file.name}
                  <button type="button" className="wf-link" onClick={() => onChange({ ownFiles: entry.ownFiles.filter((item) => item.id !== file.id) })}>
                    убрать
                  </button>
                </span>
              ))}
            </div>
            <WButton variant="secondary" onClick={addFile} disabled={entry.ownFiles.length >= MOCK_FILES.length}>
              Добавить файл
            </WButton>
          </div>
        </div>
      ) : null}

      {showLessons ? (
        <section style={{ marginTop: 20 }}>
          <h2 className="wf-h2">Выбор урока</h2>
          {!requiredReady || !plan ? (
            <p className="wf-placeholder" style={{ marginTop: 12 }}>
              Заполните обязательные поля, чтобы увидеть уроки
            </p>
          ) : (
            <div className="wf-stack" style={{ marginTop: 12 }}>
              {plan.lessons.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={entry.lessonId === item.id ? "wf-lesson is-selected" : "wf-lesson"}
                  onClick={() => onChange({ lessonId: item.id })}
                >
                  {item.number}. {item.topic}
                </button>
              ))}
            </div>
          )}
        </section>
      ) : null}

      <div className="wf-footer-actions">
        {variant === "steps" && step === 2 ? (
          <WButton variant="ghost" onClick={() => onStep(1)}>
            Назад
          </WButton>
        ) : (
          <WButton variant="ghost" onClick={onBack}>
            Назад
          </WButton>
        )}
        {variant === "steps" && step === 1 ? (
          <WButton disabled={!requiredReady} onClick={() => onStep(2)}>
            Далее
          </WButton>
        ) : (
          <WButton disabled={!requiredReady || !entry.lessonId} onClick={onContinue}>
            Продолжить
          </WButton>
        )}
      </div>
    </div>
  );
}
