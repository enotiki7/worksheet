import { DURATIONS, GRADES, LANGUAGES, SUBJECTS, TASK_TYPE_OPTIONS, TEXTBOOKS } from "../mock";
import type { LessonState, LessonTaskType } from "../types";
import { Stepper, WButton, WCheck, WField, WInput, WSelect, WTextarea } from "../components/wire";

const STEPS = ["Задача", "Урок", "Сведения", "Контекст", "Цели", "План", "Материалы", "Готовность"];

export function LessonBasics({
  lesson,
  onChange,
  onContinue,
  onBack,
}: {
  lesson: LessonState;
  onChange: (patch: Partial<LessonState>) => void;
  onContinue: () => void;
  onBack: () => void;
}) {
  const canContinue = Boolean(lesson.subject && lesson.grade && lesson.topic && lesson.duration && lesson.language);

  const toggleTask = (id: LessonTaskType) => {
    const next = lesson.taskTypes.includes(id)
      ? lesson.taskTypes.filter((item) => item !== id)
      : [...lesson.taskTypes, id];
    onChange({ taskTypes: next });
  };

  return (
    <div>
      <Stepper steps={STEPS} current="Сведения" />
      <h1 className="wf-h1">Минимальные сведения об уроке</h1>
      <p className="wf-lead">Не нужно сразу импортировать расписание или создавать класс.</p>
      <div className="wf-grid wf-grid-2">
        <WField label="Предмет" required>
          <WSelect options={SUBJECTS} value={lesson.subject} onChange={(event) => onChange({ subject: event.target.value })} />
        </WField>
        <WField label="Класс" required>
          <WSelect options={GRADES} value={lesson.grade} onChange={(event) => onChange({ grade: event.target.value })} />
        </WField>
        <WField label="Тема" required hint="Формулировка, как вы объявите её классу. Можно уточнить позже.">
          <WInput value={lesson.topic} onChange={(event) => onChange({ topic: event.target.value })} />
        </WField>
        <WField label="Продолжительность" required>
          <WSelect
            options={DURATIONS.map(String)}
            value={String(lesson.duration)}
            onChange={(event) => onChange({ duration: Number(event.target.value) || 45 })}
          />
        </WField>
        <WField label="Язык материалов" required hint="На перспективу для уроков иностранного языка.">
          <WSelect options={LANGUAGES} value={lesson.language} onChange={(event) => onChange({ language: event.target.value })} />
        </WField>
        <WField label="Учебник / УМК" hint="Учебник поможет учесть объем и последовательность материала.">
          <WSelect options={TEXTBOOKS} value={lesson.textbook} onChange={(event) => onChange({ textbook: event.target.value })} />
        </WField>
      </div>
      <div className="wf-stack" style={{ marginTop: 16 }}>
        <WField label="Цель и задачи урока" hint="Необязательно. Если оставите пустым, AI предложит формулировки на следующем шаге после контекста.">
          <WTextarea
            value={lesson.ownGoal}
            placeholder="Своя формулировка цели, если она уже есть"
            onChange={(event) => onChange({ ownGoal: event.target.value })}
          />
        </WField>
        <div className="wf-row">
          {TASK_TYPE_OPTIONS.map((option) => (
            <WCheck key={option.id} checked={lesson.taskTypes.includes(option.id)} onChange={() => toggleTask(option.id)}>
              {option.label}
            </WCheck>
          ))}
        </div>
        <WField label="Особенности класса" hint="Поможет подобрать темп, опоры и форматы работы.">
          <WTextarea value={lesson.classNotes} onChange={(event) => onChange({ classNotes: event.target.value })} />
        </WField>
        <WField label="Имеющиеся материалы" hint="Можно кратко описать, что уже есть. Файлы — на следующем шаге.">
          <WInput value={lesson.ownMaterialNote} onChange={(event) => onChange({ ownMaterialNote: event.target.value })} />
        </WField>
      </div>
      <div className="wf-footer-actions">
        <WButton onClick={onContinue} disabled={!canContinue}>
          Продолжить подготовку
        </WButton>
        <WButton variant="ghost" onClick={onBack}>
          Назад
        </WButton>
      </div>
    </div>
  );
}
