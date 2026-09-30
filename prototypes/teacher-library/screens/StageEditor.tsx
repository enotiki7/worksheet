import { FORMAT_LABEL, STAGE_AI_ACTIONS } from "../mock";
import type { LessonState, Stage } from "../types";
import { WButton, WField, WInput, WSelect, WTextarea } from "../components/wire";

const FORMATS = Object.keys(FORMAT_LABEL) as Stage["format"][];

export function StageEditor({
  lesson,
  stage,
  onChange,
  onAiAction,
  onClose,
}: {
  lesson: LessonState;
  stage: Stage;
  onChange: (stage: Stage) => void;
  onAiAction: (actionId: string) => void;
  onClose: () => void;
}) {
  return (
    <div>
      <h1 className="wf-h1">Редактирование этапа</h1>
      <p className="wf-lead">
        Ручные правки сохраняются в этом этапе. AI-действия меняют формулировки и формат, не пересобирая весь план.
      </p>
      <div className="wf-grid wf-grid-2">
        <WField label="Название">
          <WInput value={stage.title} onChange={(event) => onChange({ ...stage, title: event.target.value })} />
        </WField>
        <WField label="Минуты">
          <WInput
            type="number"
            min={1}
            value={stage.minutes}
            onChange={(event) => onChange({ ...stage, minutes: Number(event.target.value) || 1 })}
          />
        </WField>
        <WField label="Формат работы">
          <WSelect
            options={FORMATS.map((item) => FORMAT_LABEL[item])}
            value={FORMAT_LABEL[stage.format]}
            onChange={(event) => {
              const next = FORMATS.find((item) => FORMAT_LABEL[item] === event.target.value) ?? stage.format;
              onChange({ ...stage, format: next });
            }}
          />
        </WField>
        <WField label="Активность">
          <WInput value={stage.activity} onChange={(event) => onChange({ ...stage, activity: event.target.value })} />
        </WField>
      </div>
      <div className="wf-stack" style={{ marginTop: 16 }}>
        <WField label="Действия учителя">
          <WTextarea value={stage.teacher} onChange={(event) => onChange({ ...stage, teacher: event.target.value })} />
        </WField>
        <WField label="Действия учеников">
          <WTextarea value={stage.students} onChange={(event) => onChange({ ...stage, students: event.target.value })} />
        </WField>
        <WButton variant="secondary" onClick={() => onChange({ ...stage, hasAssignment: true, activity: `${stage.activity} + задание` })}>
          Добавить задание
        </WButton>
      </div>
      <div className="wf-card" style={{ marginTop: 16 }}>
        <p className="wf-card-title">Контекстные AI-действия</p>
        <p className="wf-hint">Отличаются от ручного редактирования: меняют черновик этапа по запросу.</p>
        <div className="wf-row">
          {STAGE_AI_ACTIONS.map((action) => (
            <WButton key={action.id} variant="ghost" onClick={() => onAiAction(action.id)}>
              {action.label}
            </WButton>
          ))}
        </div>
      </div>
      <p className="wf-meta">Урок: {lesson.topic}. Остальные этапы не пересобираются.</p>
      <div className="wf-footer-actions">
        <WButton onClick={onClose}>Сохранить этап</WButton>
      </div>
    </div>
  );
}
