import { useEffect, useMemo, useState } from "react";
import { ExistingMaterialsPanel } from "../components/ExistingMaterialsPanel";
import { ThematicPlanEditor } from "../components/ThematicPlanEditor";
import { GRADES, SUBJECTS, isOtherSubject, lessonInPlan, type ThematicPlan } from "../mock";
import { countPlanLessons, filterPlanByQuery } from "../planMutations";
import type { LessonDraft, LibraryMaterial, TeachingPair, UserProfile } from "../types";
import { WButton, WChip, WDropzone, WInput } from "../components/wire";

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

  const filteredPlan = useMemo(() => (plan ? filterPlanByQuery(plan, searchQuery) : undefined), [plan, searchQuery]);
  const totalLessons = plan ? countPlanLessons(plan) : 0;
  const visibleLessons = filteredPlan ? countPlanLessons(filteredPlan) : 0;

  useEffect(() => {
    setSearchQuery("");
  }, [draft.subject, draft.grade, plan?.id]);

  useEffect(() => {
    if (!lesson.topicId) return;
    document.getElementById(`lesson-${lesson.topicId}`)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [lesson.topicId]);

  const canContinue = lesson.withoutPlan || Boolean(lesson.topicId);

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

  const selectLesson = (lessonId: string, topic: string, themeId: string) => {
    onLesson({
      topicId: lessonId,
      topic,
      themeId,
      isCreating: false,
      withoutPlan: false,
    });
  };

  const planPanel =
    !hasSubjectGrade ? (
      <div className="ta-pick__plan-empty">
        <p className="wf-card-kicker">Тематический план</p>
        <p className="wf-hint">Выберите предмет и параллель слева, чтобы открыть тематический план.</p>
      </div>
    ) : otherSubject ? (
      <div className="ta-pick__plan-empty">
        <p className="wf-card-kicker">Тематический план</p>
        <p className="wf-hint">Для выбранного предмета типовой план не предусмотрен.</p>
      </div>
    ) : plan && filteredPlan ? (
      <>
        <div className="ta-pick-plan-head">
          <div>
            <p className="wf-card-kicker">Тематический план</p>
            <p className="ta-pick-plan-head__title">
              {plan.title} · {plan.hours} ч · {plan.frp}
              {profile.planFile ? ` · загружен ${profile.planFile}` : ""}
            </p>
          </div>
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

        <ThematicPlanEditor
          plan={filteredPlan}
          onChange={syncLessonAfterPlanChange}
          selectedLessonId={lesson.isCreating ? undefined : lesson.topicId}
          onSelectLesson={selectLesson}
          searchQuery={searchQuery}
        />

        {searchQuery && filteredPlan.themes.length === 0 ? (
          <div className="wf-card ta-pick-lessons__empty">
            <p className="wf-hint">По запросу «{searchQuery}» уроки не найдены.</p>
          </div>
        ) : null}

        {showLibraryAttach && libraryMaterials && onToggleLibrary ? (
          <ExistingMaterialsPanel
            title="Вариант A · Добавить ранее созданные материалы"
            hint="Материалы из библиотеки можно привязать к уроку уже на этапе подготовки."
            materials={libraryMaterials}
            selectedIds={lesson.attachedLibraryIds}
            onToggle={onToggleLibrary}
            compact
          />
        ) : null}
      </>
    ) : (
      <div className="ta-pick__plan-empty">
        <p className="wf-card-kicker">Тематический план</p>
        <p className="wf-hint">Типовой план не найден. Загрузите файл слева или создайте урок без привязки к плану.</p>
      </div>
    );

  return (
    <div className="ta-pick">
      <div className="ta-pick__list">
        <p className="wf-badge">Подготовка урока</p>
        <h1 className="wf-h1">Подготовка урока</h1>
        <p className="wf-lead">Выберите предмет и параллель — тематический план откроется справа.</p>

        <p className="wf-card-kicker">Предмет</p>
        <div className="wf-row">
          {SUBJECTS.map((subject) => (
            <WChip key={subject} selected={draft.subject === subject} onClick={() => onDraft({ subject })}>
              {subject}
            </WChip>
          ))}
        </div>

        <p className="wf-card-kicker">Параллель</p>
        <div className="ta-pick-grade-row">
          <div className="wf-row">
            {GRADES.map((grade) => (
              <WChip
                key={grade}
                selected={draft.grade === grade}
                onClick={() => onDraft({ grade, classLetter: draft.classLetter || "А" })}
              >
                {grade}
              </WChip>
            ))}
          </div>
          {hasSubjectGrade ? (
            <label className="ta-pick-class">
              <span className="wf-label">Класс</span>
              <WInput
                value={draft.classLetter ?? "А"}
                onChange={(event) => onDraft({ classLetter: event.target.value })}
              />
            </label>
          ) : null}
        </div>

        {otherSubject ? (
          <div className="wf-row ta-pick-lessons__actions">
            <WChip selected={lesson.withoutPlan} onClick={selectWithoutPlan}>
              Урок без тематического плана
            </WChip>
          </div>
        ) : (
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
        )}

        <div className="wf-footer-actions">
          <WButton variant="ghost" onClick={onBack}>
            Назад
          </WButton>
          <WButton onClick={onContinue} disabled={!canContinue}>
            Редактировать урок
          </WButton>
        </div>
      </div>

      <aside className="ta-pick__plan">{planPanel}</aside>
    </div>
  );
}
