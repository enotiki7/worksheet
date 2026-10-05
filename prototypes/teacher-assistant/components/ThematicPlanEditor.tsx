import { useEffect, useState } from "react";
import {
  addLessonToPlan,
  mergeLessonsInPlan,
  moveLessonInTheme,
  removeLessonFromPlan,
  updateLessonKind,
  updateLessonTopic,
} from "../planMutations";
import { PLAN_LESSON_KINDS, formatLessonKind, type ThematicPlan } from "../mock";
import { WButton, WChip, WInput } from "./wire";

type Props = {
  plan: ThematicPlan;
  onChange: (plan: ThematicPlan) => void;
  selectedLessonId?: string;
  onSelectLesson?: (lessonId: string, topic: string, themeId: string) => void;
  searchQuery?: string;
};

export function ThematicPlanEditor({ plan, onChange, selectedLessonId, onSelectLesson, searchQuery = "" }: Props) {
  const [creating, setCreating] = useState<{ themeId: string; afterLessonId: string | null } | null>(null);
  const [newTopic, setNewTopic] = useState("");
  const [openThemes, setOpenThemes] = useState<Set<string>>(() => new Set(plan.themes[0]?.id ? [plan.themes[0].id] : []));

  useEffect(() => {
    if (searchQuery.trim()) {
      setOpenThemes(new Set(plan.themes.map((theme) => theme.id)));
      return;
    }
    setOpenThemes(new Set(plan.themes[0]?.id ? [plan.themes[0].id] : []));
  }, [plan.id, searchQuery]);

  useEffect(() => {
    if (!selectedLessonId) return;
    const theme = plan.themes.find((item) => item.lessons.some((entry) => entry.id === selectedLessonId));
    if (!theme) return;
    setOpenThemes((prev) => new Set([...prev, theme.id]));
  }, [selectedLessonId, plan]);

  const apply = (next: ThematicPlan) => onChange(next);

  const toggleTheme = (themeId: string) => {
    setOpenThemes((prev) => {
      const next = new Set(prev);
      if (next.has(themeId)) next.delete(themeId);
      else next.add(themeId);
      return next;
    });
  };

  const startCreate = (themeId: string, afterLessonId: string | null) => {
    setCreating({ themeId, afterLessonId });
    setNewTopic("");
    setOpenThemes((prev) => new Set([...prev, themeId]));
  };

  const confirmCreate = () => {
    if (!creating || !newTopic.trim()) return;
    const { plan: nextPlan, lessonId } = addLessonToPlan(plan, creating.themeId, creating.afterLessonId, newTopic);
    apply(nextPlan);
    setCreating(null);
    setNewTopic("");
    const theme = nextPlan.themes.find((item) => item.id === creating.themeId);
    const lesson = theme?.lessons.find((item) => item.id === lessonId);
    if (lesson && theme && onSelectLesson) {
      onSelectLesson(lessonId, lesson.topic, theme.id);
    }
  };

  return (
    <div className="ta-plan-editor">
      {plan.themes.map((theme) => {
        const expanded = openThemes.has(theme.id);

        return (
          <section
            key={theme.id}
            className={["ta-accordion ta-plan-editor__theme", expanded ? "is-open" : ""].filter(Boolean).join(" ")}
          >
            <button type="button" className="ta-accordion__head ta-plan-editor__theme-head" onClick={() => toggleTheme(theme.id)}>
              <span className="ta-accordion__chevron">{expanded ? "▾" : "▸"}</span>
              <h3 className="ta-accordion__title ta-plan-editor__theme-title">{theme.title}</h3>
              <span className="ta-accordion__meta ta-plan-editor__theme-meta">
                {theme.hours} ч
                {theme.controlForms ? ` · ${theme.controlForms}` : ""}
              </span>
            </button>

            {expanded ? (
              <div className="ta-accordion__body ta-plan-editor__lessons">
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

                {theme.lessons.map((lesson, index) => {
                  const isSelected = selectedLessonId === lesson.id;

                  return (
                    <div
                      key={lesson.id}
                      id={`lesson-${lesson.id}`}
                      className={["ta-plan-editor__lesson", isSelected ? "is-selected" : ""].filter(Boolean).join(" ")}
                      onClick={() => onSelectLesson?.(lesson.id, lesson.topic, theme.id)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          onSelectLesson?.(lesson.id, lesson.topic, theme.id);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      <span className="ta-plan-editor__lesson-num">{lesson.number}</span>
                      <div
                        className="ta-plan-editor__lesson-main"
                        onClick={(event) => event.stopPropagation()}
                        onKeyDown={(event) => event.stopPropagation()}
                      >
                        <WInput
                          value={lesson.topic}
                          onChange={(event) => apply(updateLessonTopic(plan, lesson.id, event.target.value))}
                          onFocus={() => onSelectLesson?.(lesson.id, lesson.topic, theme.id)}
                        />
                        <div className="ta-plan-editor__lesson-kind">
                          <span className="ta-plan-editor__lesson-kind-label">Тип урока</span>
                          <div className="wf-row">
                            {PLAN_LESSON_KINDS.map((kind) => (
                              <WChip
                                key={kind}
                                selected={lesson.lessonKind === kind}
                                onClick={() => apply(updateLessonKind(plan, lesson.id, kind))}
                              >
                                {kind}
                              </WChip>
                            ))}
                          </div>
                          {lesson.lessonKind &&
                          !PLAN_LESSON_KINDS.includes(lesson.lessonKind as (typeof PLAN_LESSON_KINDS)[number]) ? (
                            <p className="wf-hint">Сейчас: {formatLessonKind(lesson.lessonKind)}</p>
                          ) : null}
                        </div>
                      </div>
                      <span className="ta-plan-editor__lesson-hours">{lesson.hours} ч</span>
                      <div
                        className="ta-plan-editor__lesson-actions"
                        onClick={(event) => event.stopPropagation()}
                        onKeyDown={(event) => event.stopPropagation()}
                      >
                        <div className="ta-lesson-reorder">
                          <WButton
                            variant="ghost"
                            onClick={() => apply(moveLessonInTheme(plan, theme.id, lesson.id, -1))}
                            disabled={index === 0}
                            aria-label="Переместить выше"
                          >
                            ↑
                          </WButton>
                          <WButton
                            variant="ghost"
                            onClick={() => apply(moveLessonInTheme(plan, theme.id, lesson.id, 1))}
                            disabled={index === theme.lessons.length - 1}
                            aria-label="Переместить ниже"
                          >
                            ↓
                          </WButton>
                        </div>
                        <WButton
                          variant="ghost"
                          disabled={index >= theme.lessons.length - 1}
                          onClick={() => apply(mergeLessonsInPlan(plan, lesson.id))}
                        >
                          Объединить
                        </WButton>
                        <button
                          type="button"
                          className="ta-lesson-delete"
                          onClick={() => apply(removeLessonFromPlan(plan, lesson.id))}
                        >
                          Удалить
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}
