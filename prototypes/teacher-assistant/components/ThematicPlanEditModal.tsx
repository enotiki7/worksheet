import { useState } from "react";
import {
  addLessonToPlan,
  clonePlan,
  moveLessonInTheme,
  removeLessonFromPlan,
  updateLessonKind,
  updateLessonTopic,
} from "../planMutations";
import { PLAN_LESSON_KINDS, formatLessonKind, type ThematicPlan } from "../mock";
import { WireModal, WireModalActions } from "./WireModal";
import { WButton, WChip, WInput } from "./wire";

type Props = {
  plan: ThematicPlan;
  onSave: (plan: ThematicPlan) => void;
  onClose: () => void;
};

export function ThematicPlanEditModal({ plan, onSave, onClose }: Props) {
  const [draft, setDraft] = useState(() => clonePlan(plan));
  const [creating, setCreating] = useState<{ themeId: string; afterLessonId: string | null } | null>(null);
  const [newTopic, setNewTopic] = useState("");

  const apply = (next: ThematicPlan) => setDraft(next);

  const startCreate = (themeId: string, afterLessonId: string | null) => {
    setCreating({ themeId, afterLessonId });
    setNewTopic("");
  };

  const confirmCreate = () => {
    if (!creating || !newTopic.trim()) return;
    apply(addLessonToPlan(draft, creating.themeId, creating.afterLessonId, newTopic).plan);
    setCreating(null);
    setNewTopic("");
  };

  return (
    <WireModal
      title="Редактирование тематического плана"
      size="wide"
      onClose={onClose}
      actions={
        <WireModalActions
          primaryLabel="Сохранить"
          secondaryLabel="Отмена"
          onPrimary={() => onSave(clonePlan(draft))}
          onSecondary={onClose}
        />
      }
    >
      <p className="wf-hint ta-plan-editor__summary">
        {draft.title} · {draft.hours} ч · {draft.themes.length} разделов
      </p>

      <div className="ta-plan-editor">
        {draft.themes.map((theme) => (
          <section key={theme.id} className="ta-plan-editor__theme">
            <header className="ta-plan-editor__theme-head">
              <h3 className="ta-plan-editor__theme-title">{theme.title}</h3>
              <span className="ta-plan-editor__theme-meta">
                {theme.hours} ч
                {theme.controlForms ? ` · ${theme.controlForms}` : ""}
              </span>
            </header>

            <div className="ta-plan-editor__lessons">
              <button type="button" className="ta-insert-lesson" onClick={() => startCreate(theme.id, null)}>
                + Создать урок в начале раздела
              </button>

              {creating?.themeId === theme.id && creating.afterLessonId === null ? (
                <div className="ta-create-lesson">
                  <WInput
                    placeholder="Название нового урока"
                    value={newTopic}
                    onChange={(event) => setNewTopic(event.target.value)}
                  />
                  <div className="ta-create-lesson__actions">
                    <WButton onClick={confirmCreate} disabled={!newTopic.trim()}>
                      Добавить
                    </WButton>
                    <WButton variant="ghost" onClick={() => setCreating(null)}>
                      Отмена
                    </WButton>
                  </div>
                </div>
              ) : null}

              {theme.lessons.map((lesson, index) => (
                <div key={lesson.id} className="ta-plan-editor__lesson">
                  <span className="ta-plan-editor__lesson-num">{lesson.number}</span>
                  <div className="ta-plan-editor__lesson-main">
                    <WInput
                      value={lesson.topic}
                      onChange={(event) => apply(updateLessonTopic(draft, lesson.id, event.target.value))}
                    />
                    <div className="ta-plan-editor__lesson-kind">
                      <span className="ta-plan-editor__lesson-kind-label">Тип урока</span>
                      <div className="wf-row">
                        {PLAN_LESSON_KINDS.map((kind) => (
                          <WChip
                            key={kind}
                            selected={lesson.lessonKind === kind}
                            onClick={() => apply(updateLessonKind(draft, lesson.id, kind))}
                          >
                            {kind}
                          </WChip>
                        ))}
                      </div>
                      {lesson.lessonKind && !PLAN_LESSON_KINDS.includes(lesson.lessonKind as (typeof PLAN_LESSON_KINDS)[number]) ? (
                        <p className="wf-hint">Сейчас: {formatLessonKind(lesson.lessonKind)}</p>
                      ) : null}
                    </div>
                  </div>
                  <span className="ta-plan-editor__lesson-hours">{lesson.hours} ч</span>
                  <div className="ta-lesson-reorder">
                    <WButton
                      variant="ghost"
                      onClick={() => apply(moveLessonInTheme(draft, theme.id, lesson.id, -1))}
                      disabled={index === 0}
                      aria-label="Переместить выше"
                    >
                      ↑
                    </WButton>
                    <WButton
                      variant="ghost"
                      onClick={() => apply(moveLessonInTheme(draft, theme.id, lesson.id, 1))}
                      disabled={index === theme.lessons.length - 1}
                      aria-label="Переместить ниже"
                    >
                      ↓
                    </WButton>
                  </div>
                  <button
                    type="button"
                    className="ta-lesson-delete"
                    onClick={() => apply(removeLessonFromPlan(draft, lesson.id))}
                  >
                    Удалить
                  </button>

                  {creating?.themeId === theme.id && creating.afterLessonId === lesson.id ? (
                    <div className="ta-create-lesson ta-plan-editor__create-after">
                      <WInput
                        placeholder="Название нового урока"
                        value={newTopic}
                        onChange={(event) => setNewTopic(event.target.value)}
                      />
                      <div className="ta-create-lesson__actions">
                        <WButton onClick={confirmCreate} disabled={!newTopic.trim()}>
                          Добавить
                        </WButton>
                        <WButton variant="ghost" onClick={() => setCreating(null)}>
                          Отмена
                        </WButton>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="ta-insert-lesson ta-plan-editor__insert-after"
                      onClick={() => startCreate(theme.id, lesson.id)}
                    >
                      + Создать урок после «{lesson.topic.slice(0, 40)}
                      {lesson.topic.length > 40 ? "…" : ""}»
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </WireModal>
  );
}
