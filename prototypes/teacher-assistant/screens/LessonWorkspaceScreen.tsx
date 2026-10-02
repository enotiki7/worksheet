import { useState } from "react";
import { WORKSPACE_SUGGESTS } from "../lessonContent";
import { LIBRARY_TYPE_LABELS } from "../mock";
import { EditableBlock, WireWysiwyg } from "../components/WireWysiwyg";
import { WireAiPanel } from "../components/WireAiPanel";
import { WireModal, WireModalActions } from "../components/WireModal";
import { WButton } from "../components/wire";
import type { LessonContent, LibraryMaterial, WorkspaceTab } from "../types";

type Props = {
  topic: string;
  content: LessonContent;
  onChange: (content: LessonContent) => void;
  onBack: () => void;
  onPrepareAnother: () => void;
  onScheduleLesson: () => void;
  libraryMaterials?: LibraryMaterial[];
  attachedLibraryIds?: string[];
};

const TABS: { id: WorkspaceTab; label: string }[] = [
  { id: "plan", label: "Цели и план" },
  { id: "presentation", label: "Презентация" },
  { id: "tasks", label: "Задания" },
];

export function LessonWorkspaceScreen({
  topic,
  content,
  onChange,
  onBack,
  onPrepareAnother,
  onScheduleLesson,
  libraryMaterials,
  attachedLibraryIds = [],
}: Props) {
  const [tab, setTab] = useState<WorkspaceTab>("plan");
  const [savedOpen, setSavedOpen] = useState(false);

  const contextLabel =
    tab === "plan" ? "цели и план урока" : tab === "presentation" ? "презентация" : "задания";

  const attachedMaterials =
    libraryMaterials?.filter((item) => attachedLibraryIds.includes(item.id)) ?? [];

  return (
    <div className="ta-workspace">
      <header className="ta-workspace__header">
        <div>
          <p className="wf-kicker">Материалы урока</p>
          <h1 className="wf-title">{topic}</h1>
        </div>
        <div className="ta-workspace__actions">
          <WButton variant="ghost" onClick={onBack}>
            К редактированию
          </WButton>
          <WButton onClick={() => setSavedOpen(true)}>Сохранить</WButton>
        </div>
      </header>

      {savedOpen ? (
        <WireModal
          onClose={() => setSavedOpen(false)}
          actions={
            <WireModalActions
              primaryLabel="Подготовить ещё урок"
              secondaryLabel="Запланировать урок"
              onPrimary={() => {
                setSavedOpen(false);
                onPrepareAnother();
              }}
              onSecondary={() => {
                setSavedOpen(false);
                onScheduleLesson();
              }}
            />
          }
        >
          <p className="ta-modal__achievement">Ачивка «Урокодел»</p>
          <p>
            Ура! Первый урок подготовлен! Ачивка «Урокодел» получена и сохранена у вас в профиле. Что хотите сделать с
            уроком?
          </p>
        </WireModal>
      ) : null}

      <div className="ta-workspace__tabs">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={["ta-workspace__tab", tab === item.id ? "is-active" : ""].filter(Boolean).join(" ")}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {attachedMaterials.length > 0 ? (
        <div className="ta-workspace__attached">
          <p className="wf-card-kicker">Из библиотеки</p>
          <div className="ta-workspace__attached-list">
            {attachedMaterials.map((item) => (
              <span key={item.id} className="ta-workspace__attached-chip">
                {LIBRARY_TYPE_LABELS[item.type]} · {item.title}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      <div className="ta-workspace__layout">
        <div className="ta-workspace__main">
          {tab === "plan" ? (
            <>
              <section className="ta-section">
                <h2 className="ta-section__title">Цели</h2>
                {content.goals.map((goal, index) => (
                  <WireWysiwyg key={`ws-goal-${index}`}>
                    <EditableBlock
                      html={goal}
                      onChange={(value) => {
                        const goals = [...content.goals];
                        goals[index] = value;
                        onChange({ ...content, goals });
                      }}
                      multiline
                    />
                  </WireWysiwyg>
                ))}
              </section>
              <section className="ta-section">
                <h2 className="ta-section__title">План урока</h2>
                <ul className="ta-steps ta-steps--readonly">
                  {content.steps.map((step, index) => (
                    <li key={step.id} className="ta-step">
                      <div className="ta-step__head">
                        <span className="ta-step__num">{index + 1}</span>
                        <span className="ta-step__title-text">{step.title}</span>
                        <span className="ta-step__time-text">{step.minutes} мин</span>
                      </div>
                      <WireWysiwyg>
                        <EditableBlock
                          html={step.goal}
                          onChange={(value) => {
                            const steps = content.steps.map((entry) =>
                              entry.id === step.id ? { ...entry, goal: value } : entry,
                            );
                            onChange({ ...content, steps });
                          }}
                          multiline
                        />
                      </WireWysiwyg>
                    </li>
                  ))}
                </ul>
              </section>
            </>
          ) : null}

          {tab === "presentation" ? (
            <section className="ta-section">
              <h2 className="ta-section__title">Слайды презентации</h2>
              {["Титульный слайд", "Цели урока", "Новое понятие", "Пример решения", "Закрепление", "Итоги"].map(
                (title, index) => (
                  <div key={title} className="ta-slide">
                    <p className="ta-slide__num">Слайд {index + 1}</p>
                    <WireWysiwyg label={title}>
                      <EditableBlock
                        html={`${title}: ключевые тезисы для урока «${topic}».`}
                        onChange={() => undefined}
                        multiline
                      />
                    </WireWysiwyg>
                  </div>
                ),
              )}
            </section>
          ) : null}

          {tab === "tasks" ? (
            <>
              {content.materials.motivation ? (
                <section className="ta-section">
                  <h2 className="ta-section__title">Мотивирующее задание</h2>
                  <WireWysiwyg>
                    <EditableBlock
                      html="Задание на старте: сравните два выражения и объясните, какой способ сравнения быстрее."
                      onChange={() => undefined}
                      multiline
                    />
                  </WireWysiwyg>
                </section>
              ) : null}
              {content.materials.classWork ? (
                <section className="ta-section">
                  <h2 className="ta-section__title">Задание для классной работы</h2>
                  <WireWysiwyg>
                    <EditableBlock
                      html="1. Вычислите модуль числа. 2. Сравните два выражения с модулем. 3. Решите уравнение |x| = 5."
                      onChange={() => undefined}
                      multiline
                    />
                  </WireWysiwyg>
                </section>
              ) : null}
              {content.materials.homework ? (
                <section className="ta-section">
                  <h2 className="ta-section__title">Задание для домашней работы</h2>
                  {content.homework.map((item) => (
                    <div key={item.level} className="ta-hw-level">
                      <p className="ta-hw-level__label">{item.level}</p>
                      <WireWysiwyg>
                        <EditableBlock html={item.text} onChange={() => undefined} multiline />
                      </WireWysiwyg>
                    </div>
                  ))}
                </section>
              ) : null}
              {content.materials.worksheet ? (
                <section className="ta-section">
                  <h2 className="ta-section__title">Рабочий лист</h2>
                  <WireWysiwyg>
                    <EditableBlock
                      html="Рабочий лист: таблица для вычислений, место для решения и самопроверки."
                      onChange={() => undefined}
                      multiline
                    />
                  </WireWysiwyg>
                </section>
              ) : null}
              {content.materials.infographic ? (
                <section className="ta-section">
                  <h2 className="ta-section__title">Инфографика</h2>
                  <div className="wf-preview">[ wireframe ] Инфографика по теме урока</div>
                </section>
              ) : null}
            </>
          ) : null}
        </div>

        <WireAiPanel contextLabel={contextLabel} suggests={WORKSPACE_SUGGESTS[tab]} />
      </div>
    </div>
  );
}
