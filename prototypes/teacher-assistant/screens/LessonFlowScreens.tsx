import { useState } from "react";
import { ExistingMaterialsPanel } from "../components/ExistingMaterialsPanel";
import { LessonMaterialIcons } from "../components/LessonMaterialIcons";
import { previewForLesson } from "../lessonContent";
import {
  GRADES,
  SUBJECTS,
  lessonInPlan,
  lessonStatusLabel,
  planForPair,
  planForPick,
  THEMATIC_PLANS,
  umkForSubject,
  type KtpTheme,
} from "../mock";
import type { LessonDraft, LibraryMaterial, Scenario, TeachingPair, UserProfile } from "../types";
import { WButton, WCard, WChip, WDropzone, WInput } from "../components/wire";

export function LessonCollectScreen({
  draft,
  onDraft,
  onSave,
  onBack,
}: {
  draft: TeachingPair;
  onDraft: (patch: Partial<TeachingPair>) => void;
  onSave: () => void;
  onBack: () => void;
}) {
  const umk = umkForSubject(draft.subject);
  const canSave = Boolean(draft.subject && draft.grade);
  const planPreview =
    draft.subject && draft.grade
      ? planForPair({ id: "preview", subject: draft.subject, grade: draft.grade, umk }) ??
        THEMATIC_PLANS.find((item) => item.subject === draft.subject && item.grade === draft.grade)
      : null;

  return (
    <div className="ta-flow">
      <p className="wf-badge">Подготовка урока · шаг 1</p>
      <h1 className="wf-h1">Расскажите, для кого готовим урок</h1>
      <p className="wf-lead">Эти данные сохранятся в личном кабинете и подставятся в следующий раз.</p>

      <p className="wf-card-kicker">Предмет</p>
      <div className="wf-row">
        {SUBJECTS.map((subject) => (
          <WChip key={subject} selected={draft.subject === subject} onClick={() => onDraft({ subject, umk: umkForSubject(subject) })}>
            {subject}
          </WChip>
        ))}
      </div>

      <p className="wf-card-kicker">Класс</p>
      <div className="wf-row">
        {GRADES.map((grade) => (
          <WChip key={grade} selected={draft.grade === grade} onClick={() => onDraft({ grade, umk: umkForSubject(draft.subject) })}>
            {grade}
          </WChip>
        ))}
      </div>

      <p className="wf-card-kicker">УМК / программа</p>
      <div className="ta-umk-single">
        <span>{umk}</span>
        <span className="wf-hint">Определяется автоматически по предмету и классу</span>
      </div>

      {planPreview ? (
        <div className="wf-card ta-collect-plan">
          <p className="wf-card-kicker">Тематическое планирование</p>
          <p className="wf-card-title">{planPreview.title}</p>
          <p className="wf-card-detail">
            {planPreview.hours} ч · {planPreview.frp} · {planPreview.themes.length} тем
          </p>
        </div>
      ) : null}

      <div className="wf-footer-actions">
        <WButton variant="ghost" onClick={onBack}>
          На главный
        </WButton>
        <WButton onClick={onSave} disabled={!canSave}>
          Сохранить и продолжить
        </WButton>
      </div>
    </div>
  );
}

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
      <p className="wf-badge">Подготовка урока · шаг 2</p>
      <h1 className="wf-h1">Для какого класса создаём урок?</h1>
      <p className="wf-lead">У вас несколько предметов — выберите связку «предмет · класс · УМК».</p>
      <div className="wf-stack">
        {pairs.map((pair) => (
          <WCard
            key={pair.id}
            title={`${pair.subject} · ${pair.grade} класс`}
            detail={pair.umk}
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
  removedLessonIds,
  onRemoveLesson,
}: {
  theme: KtpTheme;
  expanded: boolean;
  onToggle: () => void;
  lesson: LessonDraft;
  onLesson: (patch: Partial<LessonDraft>) => void;
  removedLessonIds: string[];
  onRemoveLesson: (lessonId: string) => void;
}) {
  const visibleLessons = theme.lessons.filter((item) => !removedLessonIds.includes(item.id));
  const startCreate = (afterId: string | null) => {
    onLesson({
      isCreating: true,
      themeId: theme.id,
      insertAfterLessonId: afterId,
      topicId: "",
      topic: "",
      withoutPlan: false,
    });
  };

  const isInsertActive = (afterId: string | null) =>
    lesson.isCreating && lesson.themeId === theme.id && lesson.insertAfterLessonId === afterId;

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
            <WButton variant="ghost" onClick={() => onLesson({ isCreating: false, topic: "", topicId: "" })}>
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
    <div className={["ta-accordion", expanded ? "is-open" : ""].filter(Boolean).join(" ")}>
      <button type="button" className="ta-accordion__head" onClick={onToggle}>
        <span className="ta-accordion__chevron">{expanded ? "▾" : "▸"}</span>
        <span className="ta-accordion__title">{theme.title}</span>
        <span className="ta-accordion__meta">
          {theme.hours} ч · {theme.independentWorks} самостоятельных · {theme.controlWorks} контрольных
        </span>
      </button>

      {expanded ? (
        <div className="ta-accordion__body">
          {renderInsert(null, "Новый урок в начале темы")}

          {visibleLessons.map((item) => (
            <div key={item.id} className="ta-lesson-slot">
              <div className="ta-lesson-row">
                <WCard
                  selected={!lesson.isCreating && lesson.topicId === item.id}
                  kicker={`Урок ${item.number} · ${item.hours} ч · ${lessonStatusLabel(item.status)}`}
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
                  {item.createdMaterials?.length ? <LessonMaterialIcons materials={item.createdMaterials} /> : null}
                </WCard>
                <button
                  type="button"
                  className="ta-lesson-delete"
                  aria-label={`Удалить урок «${item.topic}»`}
                  onClick={() => onRemoveLesson(item.id)}
                >
                  Удалить
                </button>
              </div>
              {renderInsert(item.id, `Новый урок после «${item.topic}»`)}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function LessonPickScreen({
  profile,
  pair,
  lesson,
  onLesson,
  onUploadPlan,
  onContinue,
  onBack,
  libraryMaterials,
  showLibraryAttach,
  onToggleLibrary,
  removedLessonIds,
  onRemoveLesson,
  scenario,
}: {
  profile: UserProfile;
  pair: TeachingPair;
  scenario: Scenario;
  lesson: LessonDraft;
  onLesson: (patch: Partial<LessonDraft>) => void;
  onUploadPlan: () => void;
  onContinue: () => void;
  onBack: () => void;
  libraryMaterials?: LibraryMaterial[];
  showLibraryAttach?: boolean;
  onToggleLibrary?: (id: string) => void;
  removedLessonIds: string[];
  onRemoveLesson: (lessonId: string) => void;
}) {
  const plan = planForPick(scenario, pair);
  const [openThemes, setOpenThemes] = useState<Set<string>>(() => new Set(plan?.themes[0]?.id ? [plan.themes[0].id] : []));

  const canContinue =
    lesson.withoutPlan || Boolean(lesson.topicId) || (lesson.isCreating && Boolean(lesson.topic.trim()));
  const hasSelection = Boolean(lesson.topicId) || (lesson.isCreating && Boolean(lesson.topic.trim()));
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

  return (
    <div className="ta-pick">
      <div className="ta-pick__list">
        <p className="wf-badge">Подготовка урока · шаг 3</p>
        <h1 className="wf-h1">Выберите урок в тематическом планировании</h1>
        <p className="wf-lead">
          {pair.subject} · {pair.grade} класс · {pair.umk}
          {profile.planFile ? ` · загружен ${profile.planFile}` : ""}
        </p>

        <div className="wf-row">
          <WDropzone label="Загрузить свой КТП" fileName={profile.planFile} hint="Word, PDF, Excel" onPick={onUploadPlan} />
          <WChip
            selected={lesson.withoutPlan}
            onClick={() =>
              onLesson({
                withoutPlan: true,
                topicId: "",
                topic: "Урок без привязки к КТП",
                isCreating: false,
                themeId: "",
                insertAfterLessonId: null,
              })
            }
          >
            Урок без КТП
          </WChip>
        </div>

        {plan ? (
          <>
            <p className="wf-card-kicker">
              {plan.title} · {plan.hours} ч · {plan.frp}
            </p>
            <div className="ta-themes">
              {plan.themes.map((theme) => (
                <ThemeAccordion
                  key={theme.id}
                  theme={theme}
                  expanded={openThemes.has(theme.id)}
                  onToggle={() => toggleTheme(theme.id)}
                  lesson={lesson}
                  onLesson={onLesson}
                  removedLessonIds={removedLessonIds}
                  onRemoveLesson={onRemoveLesson}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="wf-card">
            <p className="wf-card-title">Типовой КТП не найден</p>
            <p className="wf-hint">Загрузите файл или создайте урок без привязки к КТП.</p>
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
              Выберите урок из списка или загрузите свой КТП — здесь появится превью с целями, задачами и ключевыми
              результатами.
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}
