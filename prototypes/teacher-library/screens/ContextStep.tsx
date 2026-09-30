import { TEST_LESSON, buildSources } from "../mock";
import type { LessonState } from "../types";
import { Stepper, WButton, WCheck, WField, WInput, WTextarea } from "../components/wire";

const STEPS = ["Задача", "Урок", "Сведения", "Контекст", "Цели", "План", "Материалы", "Готовность"];

export function ContextStep({
  lesson,
  onChange,
  onContinue,
  onSkip,
  onBack,
  onExclude,
}: {
  lesson: LessonState;
  onChange: (patch: Partial<LessonState>) => void;
  onContinue: () => void;
  onSkip: () => void;
  onBack: () => void;
  onExclude: (id: string) => void;
}) {
  const sources = buildSources(lesson);
  return (
    <div>
      <Stepper steps={STEPS} current="Контекст" />
      <h1 className="wf-h1">Что учесть при подготовке урока?</h1>
      <p className="wf-lead">Можно ничего не добавлять и продолжить. Каждый источник можно исключить из блока «AI будет использовать».</p>
      <div className="wf-grid wf-grid-2">
        <div className="wf-card">
          <WCheck
            checked={lesson.includeOwnMaterials}
            onChange={(value) => onChange({ includeOwnMaterials: value })}
          >
            Собственные материалы
          </WCheck>
          <p className="wf-hint">Помогут опереться на то, чем вы уже пользуетесь, а не создавать всё заново.</p>
          {lesson.includeOwnMaterials ? (
            <div className="wf-stack">
              <WField label="Описать или вставить текст">
                <WTextarea
                  value={lesson.ownMaterialNote}
                  onChange={(event) => onChange({ ownMaterialNote: event.target.value })}
                />
              </WField>
              <div className="wf-row">
                <WButton variant="secondary" onClick={() => onChange({ ownMaterialNote: lesson.ownMaterialNote || "Конспект прошлого года, схема «Части уравнения»." })}>
                  Загрузить файл
                </WButton>
                <WButton variant="ghost" onClick={() => onChange({ ownMaterialNote: lesson.ownMaterialNote || "Фото доски: x + 7 = 15 и проверка корня." })}>
                  Добавить фото
                </WButton>
              </div>
            </div>
          ) : null}
        </div>
        <div className="wf-card">
          <WCheck
            checked={lesson.includePreviousLesson}
            onChange={(value) =>
              onChange({
                includePreviousLesson: value,
                previousLessonNote: value ? lesson.previousLessonNote || TEST_LESSON.previousLessonNote : lesson.previousLessonNote,
              })
            }
          >
            Результаты предыдущего урока
          </WCheck>
          <p className="wf-hint">Помогут добавить повторение и подобрать сложность заданий.</p>
          {lesson.includePreviousLesson ? (
            <WField label="Что произошло на прошлом уроке">
              <WTextarea
                value={lesson.previousLessonNote}
                onChange={(event) => onChange({ previousLessonNote: event.target.value })}
              />
            </WField>
          ) : null}
        </div>
        <div className="wf-card">
          <WCheck checked={lesson.includeClassNotes} onChange={(value) => onChange({ includeClassNotes: value })}>
            Особенности класса
          </WCheck>
          <p className="wf-hint">Учебник и особенности класса помогают учесть объем и темп.</p>
          {lesson.includeClassNotes ? (
            <WField label="Кратко о классе">
              <WInput value={lesson.classNotes} onChange={(event) => onChange({ classNotes: event.target.value })} />
            </WField>
          ) : null}
        </div>
        <div className="wf-card">
          <p className="wf-card-title">Ничего не добавлять</p>
          <p className="wf-card-detail">AI опрется на тему, класс и длительность.</p>
          <WButton variant="secondary" onClick={onSkip}>
            Продолжить без контекста
          </WButton>
        </div>
      </div>
      <div className="wf-card" style={{ marginTop: 16 }}>
        <p className="wf-card-kicker">Обязательный блок</p>
        <p className="wf-card-title">AI будет использовать</p>
        {sources.map((source) => (
          <div className="wf-source" key={source.id}>
            <div>
              <strong>{source.label}</strong>
              <div className="wf-meta" style={{ margin: 0 }}>
                {source.detail}
              </div>
            </div>
            {source.removable ? (
              <button type="button" onClick={() => onExclude(source.id)}>
                Исключить
              </button>
            ) : null}
          </div>
        ))}
      </div>
      <div className="wf-footer-actions">
        <WButton onClick={onContinue}>Продолжить подготовку</WButton>
        <WButton variant="ghost" onClick={onBack}>
          Назад
        </WButton>
      </div>
    </div>
  );
}
