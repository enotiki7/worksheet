import { useEffect, useMemo, useState } from "react";
import { ExistingMaterialsPanel } from "../components/ExistingMaterialsPanel";
import { LessonMaterialIcons } from "../components/LessonMaterialIcons";
import { ThematicPlanEditModal } from "../components/ThematicPlanEditModal";
import { previewForLesson } from "../lessonContent";
import {
  GRADES,
  SUBJECTS,
  isOtherSubject,
  lessonInPlan,
  formatLessonKind,
  lessonStatusLabel,
  type KtpTheme,
  type ThematicPlan,
} from "../mock";
import {
  addLessonToPlan,
  countPlanLessons,
  filterPlanByQuery,
  moveLessonInTheme,
  removeLessonFromPlan,
} from "../planMutations";
import type { LessonDraft, LibraryMaterial, TeachingPair, UserProfile } from "../types";
import { WButton, WCard, WChip, WDropzone, WInput } from "../components/wire";

export function LessonContextScreen({
  pairs,
  selectedId,
  onSelect,
  onContinue,
  onBack,
}: {
  pairs: TeachingPair[];
  selectedId: string;
  onSelect: (id: string) => void;
  onContinue: () => void;
  onBack: () => void;
}) {
  return (
    <div className="ta-flow">
      <p className="wf-badge">Подготовка урока</p>
      <h1 className="wf-h1">Для какого класса создаём урок?</h1>
      <p className="wf-lead">У вас несколько предметов — выберите связку «предмет · класс».</p>
      <div className="wf-stack">
        {pairs.map((pair) => (
          <WCard
            key={pair.id}
            title={`${pair.subject} · ${pair.grade} класс`}
            selected={selectedId === pair.id}
            onClick={() => onSelect(pair.id)}
          />
        ))}
      </div>
      <div className="wf-footer-actions">
        <WButton variant="ghost" onClick={onBack}>
          Назад
        </WButton>
        <WButton onClick={onContinue} disabled={!selectedId}>
          Продолжить
        </WButton>
      </div>
    </div>
  );
}

function ThemeAccordion({
  theme,
  expanded,
  onToggle,
  lesson,
  onLesson,
  onRemoveLesson,
  onMoveLesson,
  onAddLesson,
  searchQuery,
}: {
  theme: KtpTheme;
  expanded: boolean;
  onToggle: () => void;
  lesson: LessonDraft;
  onLesson: (patch: Partial<LessonDraft>) => void;
  onRemoveLesson: (lessonId: string) => void;
  onMoveLesson: (themeId: string, lessonId: string, direction: -1 | 1) => void;
  onAddLesson: (themeId: string, afterLessonId: string | null, topic: string) => void;
  searchQuery: string;
}) {
  const [creatingAfter, setCreatingAfter] = useState<string | null | false>(false);

  const startCreate = (afterId: string | null) => {
    setCreatingAfter(afterId);
    onLesson({
      isCreating: true,
      themeId: theme.id,
      insertAfterLessonId: afterId,
      topicId: "",
      topic: "",
      withoutPlan: false,
    });
  };

  const cancelCreate = () => {
    setCreatingAfter(false);
    onLesson({ isCreating: false, topic: "", topicId: "" });
  };

  const confirmCreate = (afterId: string | null) => {
    if (!lesson.topic.trim()) return;
    onAddLesson(theme.id, afterId, lesson.topic.trim());
    cancelCreate();
  };

  const isInsertActive = (afterId: string | null) => creatingAfter === afterId && lesson.isCreating;

  const renderInsert = (afterId: string | null, label: string) => {
    if (isInsertActive(afterId)) {
      return (
        <div className="ta-create-lesson">
          <p className="ta-create-lesson__label">{label}</p>
          <WInput
            placeholder="Тема нового урока"
            value={lesson.topic}
            onChange={(event) => onLesson({ topic: event.target.value, topicId: "", withoutPlan: false })}
          />
          <div className="ta-create-lesson__actions">
            <WButton onClick={() => confirmCreate(afterId)} disabled={!lesson.topic.trim()}>
              Добавить
            </WButton>
            <WButton variant="ghost" onClick={cancelCreate}>
              Отмена
            </WButton>
          </div>
        </div>
      );
    }

    return (
      <button type="button" className="ta-insert-lesson" onClick={() => startCreate(afterId)}>
        + Создать урок
      </button>
    );
  };

  return (
    <div className={["ta-accordion", expanded ? "is-open" : ""].filter(Boolean).join(" ")} id={`theme-${theme.id}`}>
      <button type="button" className="ta-accordion__head" onClick={onToggle}>
        <span className="ta-accordion__chevron">{expanded ? "▾" : "▸"}</span>
        <span className="ta-accordion__title">{theme.title}</span>
        <span className="ta-accordion__meta">
          {theme.hours} ч
          {theme.controlForms
            ? ` · ${theme.controlForms}`
            : ` · ${theme.independentWorks} самостоятельных · ${theme.controlWorks} контрольных`}
        </span>
      </button>

      {expanded ? (
        <div className="ta-accordion__body">
          {!searchQuery ? renderInsert(null, "Новый урок в начале темы") : null}

          {theme.lessons.map((item, index) => (
            <div key={item.id} className="ta-lesson-slot" id={`lesson-${item.id}`}>
              <div className="ta-lesson-row">
                <WCard
                  selected={!lesson.isCreating && lesson.topicId === item.id}
                  kicker={[`Урок ${item.number}`, `${item.hours} ч`, lessonStatusLabel(item.status)].join(" · ")}
                  title={item.topic}
                  detail={[item.prevTopic ? `← ${item.prevTopic}` : null, item.nextTopic ? `→ ${item.nextTopic}` : null]
                    .filter(Boolean)
                    .join(" · ")}
                  onClick={() =>
                    onLesson({
                      topicId: item.id,
                      topic: item.topic,
                      themeId: theme.id,
                      isCreating: false,
                      withoutPlan: false,
                    })
                  }
                >
                  <p className="ta-lesson-card__kind">Тип урока: {formatLessonKind(item.lessonKind)}</p>
                  {item.createdMaterials?.length ? <LessonMaterialIcons materials={item.createdMaterials} /> : null}
                </WCard>
                <div className="ta-lesson-reorder">
                  <WButton
                    variant="ghost"
                    onClick={() => onMoveLesson(theme.id, item.id, -1)}
                    disabled={index === 0}
                    aria-label={`Переместить «${item.topic}» выше`}
                  >
                    ↑
                  </WButton>
                  <WButton
                    variant="ghost"
                    onClick={() => onMoveLesson(theme.id, item.id, 1)}
                    disabled={index === theme.lessons.length - 1}
                    aria-label={`Переместить «${item.topic}» ниже`}
                  >
                    ↓
                  </WButton>
                </div>
                <button
                  type="button"
                  className="ta-lesson-delete"
                  aria-label={`Удалить урок «${item.topic}»`}
                  onClick={() => onRemoveLesson(item.id)}
                >
                  Удалить
                </button>
              </div>
              {!searchQuery ? renderInsert(item.id, `Новый урок после «${item.topic}»`) : null}
            </div>
          ))}

          {searchQuery && theme.lessons.length === 0 ? (
            <p className="wf-hint ta-pick-search__empty">В этом разделе нет уроков по запросу.</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export function LessonPickScreen({
  profile,
  draft,
  onDraft,
  plan,
  onPlanChange,
  lesson,
  onLesson,
  onUploadPlan,
  onContinue,
  onBack,
  libraryMaterials,
  showLibraryAttach,
  onToggleLibrary,
}: {
  profile: UserProfile;
  draft: TeachingPair;
  onDraft: (patch: Partial<TeachingPair>) => void;
  plan?: ThematicPlan;
  onPlanChange: (plan: ThematicPlan) => void;
  lesson: LessonDraft;
  onLesson: (patch: Partial<LessonDraft>) => void;
  onUploadPlan: () => void;
  onContinue: () => void;
  onBack: () => void;
  libraryMaterials?: LibraryMaterial[];
  showLibraryAttach?: boolean;
  onToggleLibrary?: (id: string) => void;
}) {
  const hasSubjectGrade = Boolean(draft.subject && draft.grade);
  const otherSubject = isOtherSubject(draft.subject);
  const [searchQuery, setSearchQuery] = useState("");
  const [planEditorOpen, setPlanEditorOpen] = useState(false);
  const [openThemes, setOpenThemes] = useState<Set<string>>(() => new Set(plan?.themes[0]?.id ? [plan.themes[0].id] : []));

  const filteredPlan = useMemo(() => (plan ? filterPlanByQuery(plan, searchQuery) : undefined), [plan, searchQuery]);
  const totalLessons = plan ? countPlanLessons(plan) : 0;
  const visibleLessons = filteredPlan ? countPlanLessons(filteredPlan) : 0;

  useEffect(() => {
    if (!plan?.themes[0]?.id) return;
    setOpenThemes(new Set([plan.themes[0].id]));
    setSearchQuery("");
  }, [draft.subject, draft.grade, plan?.id]);

  useEffect(() => {
    if (!searchQuery || !filteredPlan) return;
    setOpenThemes(new Set(filteredPlan.themes.map((theme) => theme.id)));
  }, [searchQuery, filteredPlan]);

  useEffect(() => {
    if (!lesson.topicId) return;
    const theme = plan?.themes.find((item) => item.lessons.some((entry) => entry.id === lesson.topicId));
    if (!theme) return;
    setOpenThemes((prev) => new Set([...prev, theme.id]));
    document.getElementById(`lesson-${lesson.topicId}`)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [lesson.topicId, plan]);

  const canContinue = lesson.withoutPlan || Boolean(lesson.topicId);
  const hasSelection = Boolean(lesson.topicId);
  const preview = hasSelection ? previewForLesson(lesson.topicId || "custom") : null;
  const placementHint =
    plan && lesson.isCreating
      ? (() => {
          if (lesson.insertAfterLessonId === null) {
            const theme = plan.themes.find((item) => item.id === lesson.themeId);
            return theme ? `В начале темы «${theme.title}»` : null;
          }
          const found = lessonInPlan(plan, lesson.insertAfterLessonId);
          return found ? `После «${found.lesson.topic}»` : null;
        })()
      : null;

  const toggleTheme = (themeId: string) => {
    setOpenThemes((prev) => {
      const next = new Set(prev);
      if (next.has(themeId)) next.delete(themeId);
      else next.add(themeId);
      return next;
    });
  };

  const syncLessonAfterPlanChange = (next: ThematicPlan) => {
    onPlanChange(next);
    if (!lesson.topicId) return;
    const found = lessonInPlan(next, lesson.topicId);
    if (!found) {
      onLesson({ topicId: "", topic: "", isCreating: false, themeId: "", insertAfterLessonId: null });
      return;
    }
    if (found.lesson.topic !== lesson.topic || found.theme.id !== lesson.themeId) {
      onLesson({ topic: found.lesson.topic, themeId: found.theme.id });
    }
  };

  const selectWithoutPlan = () => {
    onLesson({
      withoutPlan: true,
      topicId: "",
      topic: "Урок без привязки к тематическому плану",
      isCreating: false,
      themeId: "",
      insertAfterLessonId: null,
    });
  };

  const handleRemoveLesson = (lessonId: string) => {
    if (!plan) return;
    syncLessonAfterPlanChange(removeLessonFromPlan(plan, lessonId));
  };

  const handleAddLesson = (themeId: string, afterLessonId: string | null, topic: string) => {
    if (!plan) return;
    const { plan: nextPlan, lessonId } = addLessonToPlan(plan, themeId, afterLessonId, topic);
    syncLessonAfterPlanChange(nextPlan);
    const found = lessonInPlan(nextPlan, lessonId);
    if (found) {
      onLesson({
        topicId: lessonId,
        topic: found.lesson.topic,
        themeId: found.theme.id,
        isCreating: false,
        withoutPlan: false,
      });
    }
  };

  const handleMoveLesson = (themeId: string, lessonId: string, direction: -1 | 1) => {
    if (!plan) return;
    syncLessonAfterPlanChange(moveLessonInTheme(plan, themeId, lessonId, direction));
  };

  return (
    <div className="ta-pick">
      <div className="ta-pick__list">
        <p className="wf-badge">Подготовка урока</p>
        <h1 className="wf-h1">Подготовка урока</h1>
        <p className="wf-lead">Выберите предмет и параллель — тематический план подтянется автоматически.</p>

        <p className="wf-card-kicker">Предмет</p>
        <div className="wf-row">
          {SUBJECTS.map((subject) => (
            <WChip key={subject} selected={draft.subject === subject} onClick={() => onDraft({ subject })}>
              {subject}
            </WChip>
          ))}
        </div>

        <p className="wf-card-kicker">Класс / параллель</p>
        <div className="wf-row">
          {GRADES.map((grade) => (
            <WChip key={grade} selected={draft.grade === grade} onClick={() => onDraft({ grade })}>
              {grade}
            </WChip>
          ))}
        </div>

        <section className="ta-pick-lessons">
          <p className="wf-card-kicker">Выбрать урок</p>

          {!hasSubjectGrade ? (
            <div className="wf-card ta-pick-lessons__empty">
              <p className="wf-hint">Выберите предмет и параллель, чтобы увидеть список тем и уроков.</p>
            </div>
          ) : otherSubject ? (
            <div className="wf-card ta-pick-lessons__empty">
              <p className="wf-hint">
                Тематический план не предусмотрен, создайте урок без привязки к тематическому плану.
              </p>
              <div className="wf-row ta-pick-lessons__actions">
                <WChip selected={lesson.withoutPlan} onClick={selectWithoutPlan}>
                  Урок без тематического плана
                </WChip>
              </div>
            </div>
          ) : plan && filteredPlan ? (
            <>
              <div className="ta-pick-plan-head">
                <p className="wf-card-kicker">
                  {plan.title} · {plan.hours} ч · {plan.frp}
                  {profile.planFile ? ` · загружен ${profile.planFile}` : ""}
                </p>
                <WButton variant="secondary" onClick={() => setPlanEditorOpen(true)}>
                  Редактировать план
                </WButton>
              </div>

              <div className="ta-pick-search">
                <WInput
                  placeholder="Поиск по названию урока или раздела"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                />
                {searchQuery ? (
                  <p className="wf-hint ta-pick-search__meta">
                    Найдено {visibleLessons} из {totalLessons} уроков
                  </p>
                ) : null}
              </div>

              <div className="ta-themes">
                {filteredPlan.themes.map((theme) => (
                  <ThemeAccordion
                    key={theme.id}
                    theme={theme}
                    expanded={openThemes.has(theme.id)}
                    onToggle={() => toggleTheme(theme.id)}
                    lesson={lesson}
                    onLesson={onLesson}
                    onRemoveLesson={handleRemoveLesson}
                    onMoveLesson={handleMoveLesson}
                    onAddLesson={handleAddLesson}
                    searchQuery={searchQuery}
                  />
                ))}
              </div>

              {searchQuery && filteredPlan.themes.length === 0 ? (
                <div className="wf-card ta-pick-lessons__empty">
                  <p className="wf-hint">По запросу «{searchQuery}» уроки не найдены.</p>
                </div>
              ) : null}

              <div className="wf-row ta-pick-lessons__actions">
                <WDropzone
                  label="Загрузить свой тематический план"
                  fileName={profile.planFile}
                  hint="Word, PDF, Excel"
                  onPick={onUploadPlan}
                />
                <WChip selected={lesson.withoutPlan} onClick={selectWithoutPlan}>
                  Урок без тематического плана
                </WChip>
              </div>
            </>
          ) : (
            <div className="wf-card ta-pick-lessons__empty">
              <p className="wf-card-title">Типовой тематический план не найден</p>
              <p className="wf-hint">Загрузите файл или создайте урок без привязки к тематическому плану.</p>
              <div className="wf-row ta-pick-lessons__actions">
                <WDropzone
                  label="Загрузить свой тематический план"
                  fileName={profile.planFile}
                  hint="Word, PDF, Excel"
                  onPick={onUploadPlan}
                />
                <WChip selected={lesson.withoutPlan} onClick={selectWithoutPlan}>
                  Урок без тематического плана
                </WChip>
              </div>
            </div>
          )}
        </section>

        <div className="wf-footer-actions">
          <WButton variant="ghost" onClick={onBack}>
            Назад
          </WButton>
          <WButton onClick={onContinue} disabled={!canContinue}>
            Редактировать урок
          </WButton>
        </div>
      </div>

      <aside className="ta-pick__preview">
        {preview && hasSelection ? (
          <>
            <p className="wf-card-kicker">Превью урока</p>
            <h2 className="wf-h2">{lesson.topic}</h2>
            {placementHint ? <p className="wf-hint">{placementHint}</p> : null}

            <section className="ta-preview-block">
              <h3 className="ta-preview-block__title">Цели урока</h3>
              <ul className="ta-preview-list">
                {preview.goals.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="ta-preview-block">
              <h3 className="ta-preview-block__title">Задачи урока</h3>
              <ul className="ta-preview-list">
                {preview.tasks.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="ta-preview-block">
              <h3 className="ta-preview-block__title">Ключевые результаты</h3>
              {preview.results.map((block) => (
                <div key={block.label} className="ta-preview-result">
                  <p className="ta-preview-result__label">{block.label}</p>
                  <ul className="ta-preview-list">
                    {block.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>

            {showLibraryAttach && libraryMaterials && onToggleLibrary ? (
              <ExistingMaterialsPanel
                title="Вариант A · Добавить ранее созданные материалы"
                hint="Материалы из вашей библиотеки можно привязать к уроку уже на этапе выбора темы."
                materials={libraryMaterials}
                selectedIds={lesson.attachedLibraryIds}
                onToggle={onToggleLibrary}
                compact
              />
            ) : null}
          </>
        ) : (
          <div className="ta-pick__preview-empty">
            <p className="wf-card-kicker">Превью урока</p>
            <p className="wf-hint">
              Выберите урок из списка или загрузите свой тематический план — здесь появится превью с целями,
              задачами и ключевыми результатами.
            </p>
          </div>
        )}
      </aside>

      {planEditorOpen && plan ? (
        <ThematicPlanEditModal
          plan={plan}
          onSave={(next) => {
            syncLessonAfterPlanChange(next);
            setPlanEditorOpen(false);
          }}
          onClose={() => setPlanEditorOpen(false)}
        />
      ) : null}
    </div>
  );
}
