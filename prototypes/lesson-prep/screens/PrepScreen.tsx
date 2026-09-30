import type { ReactNode } from "react";
import { MATERIAL_OPTIONS, findPlan, lessonRecommendation, moveStage, stageTotal } from "../mock";
import type { Draft, EntryState, LessonStage, MaterialKind } from "../types";
import { WButton, WCheck, WTextarea } from "../components/wire";

function Meta({ entry, topic }: { entry: EntryState; topic: string }) {
  const plan = findPlan(entry.planId);
  const parts = [entry.subject, entry.grade ? `${entry.grade} параллель` : "", entry.duration ? `${entry.duration} мин` : "", plan?.title ?? "", topic, entry.textbook].filter(Boolean);
  return <p className="wf-meta">{parts.join(" · ")}</p>;
}

function Block({ title, onDelete, children }: { title: string; onDelete: () => void; children: ReactNode }) {
  return (
    <section className="wf-block">
      <div className="wf-block-head">
        <h2 className="wf-h2">{title}</h2>
        <button type="button" className="wf-link" onClick={onDelete}>
          Удалить блок
        </button>
      </div>
      {children}
    </section>
  );
}

function StageEditor({
  stage,
  index,
  total,
  onChange,
  onMove,
}: {
  stage: LessonStage;
  index: number;
  total: number;
  onChange: (patch: Partial<LessonStage>) => void;
  onMove: (direction: -1 | 1) => void;
}) {
  return (
    <div className="wf-stage">
      <div className="wf-row">
        <WButton variant="ghost" disabled={index === 0} onClick={() => onMove(-1)}>
          Выше
        </WButton>
        <WButton variant="ghost" disabled={index === total - 1} onClick={() => onMove(1)}>
          Ниже
        </WButton>
        <input
          className="wf-input is-narrow"
          type="number"
          min={0}
          aria-label={`Минуты: ${stage.title}`}
          value={stage.minutes}
          onChange={(event) => onChange({ minutes: Number(event.target.value) || 0 })}
        />
        <span className="wf-hint" style={{ margin: 0 }}>
          мин
        </span>
      </div>
      <input className="wf-input" aria-label="Название этапа" value={stage.title} onChange={(event) => onChange({ title: event.target.value })} />
      <WTextarea aria-label="Текст этапа" className="is-short" value={stage.text} onChange={(event) => onChange({ text: event.target.value })} />
    </div>
  );
}

export function PrepScreen({
  entry,
  topic,
  draft,
  onDraft,
  onBack,
  onCreate,
}: {
  entry: EntryState;
  topic: string;
  draft: Draft;
  onDraft: (draft: Draft) => void;
  onBack: () => void;
  onCreate: () => void;
}) {
  const updateStage = (index: number, patch: Partial<LessonStage>) => {
    if (!draft.stages) return;
    onDraft({
      ...draft,
      stages: draft.stages.map((stage, stageIndex) => (stageIndex === index ? { ...stage, ...patch } : stage)),
    });
  };

  return (
    <div>
      <h1 className="wf-h1">Подготовка к уроку</h1>
      <Meta entry={entry} topic={topic} />

      {draft.goal !== null ? (
        <Block title="Цель урока" onDelete={() => onDraft({ ...draft, goal: null })}>
          <WTextarea value={draft.goal} onChange={(event) => onDraft({ ...draft, goal: event.target.value })} />
        </Block>
      ) : null}

      {draft.tasks !== null ? (
        <Block title="Задачи урока" onDelete={() => onDraft({ ...draft, tasks: null })}>
          <WTextarea value={draft.tasks} onChange={(event) => onDraft({ ...draft, tasks: event.target.value })} />
        </Block>
      ) : null}

      {draft.results ? (
        <Block title="Планируемые результаты" onDelete={() => onDraft({ ...draft, results: null })}>
          <div className="wf-stack">
            <label className="wf-field">
              <span className="wf-label">Предметные</span>
              <WTextarea className="is-short" value={draft.results.subject} onChange={(event) => onDraft({ ...draft, results: { ...draft.results!, subject: event.target.value } })} />
            </label>
            <label className="wf-field">
              <span className="wf-label">Личностные</span>
              <WTextarea className="is-short" value={draft.results.personal} onChange={(event) => onDraft({ ...draft, results: { ...draft.results!, personal: event.target.value } })} />
            </label>
            <label className="wf-field">
              <span className="wf-label">Метапредметные</span>
              <WTextarea className="is-short" value={draft.results.meta} onChange={(event) => onDraft({ ...draft, results: { ...draft.results!, meta: event.target.value } })} />
            </label>
          </div>
        </Block>
      ) : null}

      {draft.keywords !== null ? (
        <Block title="Ключевые слова" onDelete={() => onDraft({ ...draft, keywords: null })}>
          <WTextarea className="is-short" value={draft.keywords} onChange={(event) => onDraft({ ...draft, keywords: event.target.value })} />
        </Block>
      ) : null}

      {draft.stages ? (
        <Block title="План урока" onDelete={() => onDraft({ ...draft, stages: null })}>
          {draft.stages.map((stage, index) => (
            <StageEditor
              key={stage.id}
              stage={stage}
              index={index}
              total={draft.stages!.length}
              onChange={(patch) => updateStage(index, patch)}
              onMove={(direction) => onDraft({ ...draft, stages: moveStage(draft.stages!, index, direction) })}
            />
          ))}
          <p className={stageTotal(draft.stages) === entry.duration ? "wf-meta" : "wf-warn"} style={{ marginTop: 12 }}>
            Итого: {stageTotal(draft.stages)} мин. Длительность урока: {entry.duration} мин.
          </p>
        </Block>
      ) : null}

      <section className="wf-card" style={{ marginTop: 16 }}>
        <p className="wf-label">Рекомендация для проведения урока</p>
        <p className="wf-card-detail">{lessonRecommendation(topic, entry.classNotes)}</p>
      </section>

      <section className="wf-block">
        <h2 className="wf-h2">Материалы для генерации</h2>
        <div className="wf-stack" style={{ marginTop: 12 }}>
          {MATERIAL_OPTIONS.map((option) => (
            <WCheck
              key={option.id}
              checked={draft.selectedMaterials.includes(option.id)}
              onChange={(checked) => {
                const selectedMaterials: MaterialKind[] = checked
                  ? [...draft.selectedMaterials, option.id]
                  : draft.selectedMaterials.filter((item) => item !== option.id);
                onDraft({ ...draft, selectedMaterials });
              }}
            >
              {option.label}
            </WCheck>
          ))}
        </div>
      </section>

      <div className="wf-footer-actions">
        <WButton variant="ghost" onClick={onBack}>
          Назад
        </WButton>
        <WButton disabled={draft.selectedMaterials.length === 0} onClick={onCreate}>
          Сгенерировать
        </WButton>
        {draft.selectedMaterials.length === 0 ? <span className="wf-hint" style={{ margin: 0 }}>Выберите хотя бы один материал.</span> : null}
      </div>
    </div>
  );
}

export function LessonMeta({ entry, topic }: { entry: EntryState; topic: string }) {
  return <Meta entry={entry} topic={topic} />;
}
