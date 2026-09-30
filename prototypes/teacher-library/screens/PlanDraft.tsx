import { FORMAT_LABEL, buildSources, stagesTotal } from "../mock";
import type { LessonState, Stage } from "../types";
import { Stepper, WButton } from "../components/wire";

const STEPS = ["Задача", "Урок", "Сведения", "Контекст", "Цели", "План", "Материалы", "Готовность"];

export function GeneratingPlan({ lesson }: { lesson: LessonState }) {
  const sources = buildSources(lesson);
  return (
    <div>
      <Stepper steps={STEPS} current="План" />
      <h1 className="wf-h1">Формируем сценарий урока на {lesson.duration} минут</h1>
      <p className="wf-lead">Учитываем выбранный контекст. Это черновик, его можно будет править.</p>
      <div className="wf-progress">
        {sources.map((source) => (
          <div className="wf-progress-row" key={source.id}>
            <span>{source.label}</span>
            <div className="wf-bar">
              <span style={{ width: "70%" }} />
            </div>
            <span>учитываем</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PlanDraft({
  lesson,
  onEditStage,
  onApprove,
  onBack,
  onMove,
  onDelete,
  onFixOverflow,
  onAddStage,
}: {
  lesson: LessonState;
  onEditStage: (id: string) => void;
  onApprove: () => void;
  onBack: () => void;
  onMove: (id: string, dir: -1 | 1) => void;
  onDelete: (id: string) => void;
  onFixOverflow: () => void;
  onAddStage: () => void;
}) {
  const total = stagesTotal(lesson.stages);
  const overflow = total > lesson.duration;
  return (
    <div>
      <Stepper steps={STEPS} current="План" />
      <div className="wf-row" style={{ justifyContent: "space-between" }}>
        <h1 className="wf-h1">Черновик плана-конспекта</h1>
        <span className="wf-badge">AI-черновик</span>
      </div>
      <p className="wf-lead">
        {lesson.topic} · {lesson.grade} · {total} из {lesson.duration} мин. Этапы связаны с целями урока.
      </p>
      {overflow ? (
        <div className="wf-warn" style={{ marginBottom: 16 }}>
          Запланировано {total} минут. Сократить объяснение на 2 минуты и практическую работу на 2 минуты?{" "}
          <WButton variant="secondary" onClick={onFixOverflow}>
            Сократить
          </WButton>
        </div>
      ) : null}
      {lesson.stages.map((stage, index) => (
        <StageRow
          key={stage.id}
          stage={stage}
          index={index}
          results={lesson.plannedResults}
          onEdit={() => onEditStage(stage.id)}
          onMove={onMove}
          onDelete={onDelete}
          isFirst={index === 0}
          isLast={index === lesson.stages.length - 1}
        />
      ))}
      <div className="wf-footer-actions">
        <WButton onClick={onApprove}>Утвердить план</WButton>
        <WButton variant="secondary" onClick={onAddStage}>
          Добавить свой этап
        </WButton>
        <WButton variant="ghost" onClick={onBack}>
          К целям
        </WButton>
      </div>
    </div>
  );
}

function StageRow({
  stage,
  index,
  results,
  onEdit,
  onMove,
  onDelete,
  isFirst,
  isLast,
}: {
  stage: Stage;
  index: number;
  results: LessonState["plannedResults"];
  onEdit: () => void;
  onMove: (id: string, dir: -1 | 1) => void;
  onDelete: (id: string) => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  const linked = results.filter((item) => stage.goalIds.includes(item.id)).map((item) => item.text);
  return (
    <div className="wf-stage">
      <div>
        <div className="wf-time">{stage.minutes} мин</div>
        <div className="wf-meta">этап {index + 1}</div>
      </div>
      <div>
        <p className="wf-card-title">{stage.title}</p>
        <p className="wf-card-detail">Учитель: {stage.teacher}</p>
        <p className="wf-card-detail">Ученики: {stage.students}</p>
        <p className="wf-meta">
          {FORMAT_LABEL[stage.format]} · {stage.activity}
          {linked.length ? ` · цели: ${linked.join("; ")}` : ""}
        </p>
      </div>
      <div className="wf-stack">
        <WButton variant="secondary" onClick={onEdit}>
          Править этап
        </WButton>
        <WButton variant="ghost" disabled={isFirst} onClick={() => onMove(stage.id, -1)}>
          Выше
        </WButton>
        <WButton variant="ghost" disabled={isLast} onClick={() => onMove(stage.id, 1)}>
          Ниже
        </WButton>
        <WButton variant="ghost" onClick={() => onDelete(stage.id)}>
          Удалить
        </WButton>
      </div>
    </div>
  );
}
