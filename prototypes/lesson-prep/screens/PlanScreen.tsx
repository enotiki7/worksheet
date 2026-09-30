import { Button } from "@company/ui";
import { ChatPanel } from "../components/ChatPanel";
import { Icon, type IconName } from "../components/Icon";
import { PlanEditable } from "../components/PlanEditable";
import { PlanWysiwyg } from "../components/PlanWysiwyg";
import { usePlanEditor } from "../components/usePlanEditor";
import {
  ANCHORS,
  CRITERIA,
  HOMEWORK_LEVELS,
  KEYWORDS,
  LESSON_STEPS,
  LESSON_TASKS,
  REFLECTION_QUESTIONS,
  RESULTS,
  MATERIAL_OPTIONS,
} from "../content";

const KIT_ICONS: Record<string, IconName> = {
  outline: "kitOutline",
  slides: "kitSlides",
  tasks: "kitTasks",
};

export function PlanScreen({
  title,
  goalItems,
  activeStep,
  onStep,
  materials,
  onToggleMaterial,
  suggests,
  messages,
  draft,
  onDraft,
  onSend,
  onSuggest,
  onNext,
}: {
  title: string;
  goalItems: string[];
  activeStep: string | null;
  onStep: (id: string) => void;
  materials: string[];
  onToggleMaterial: (id: string) => void;
  suggests: string[];
  messages: string[];
  draft: string;
  onDraft: (value: string) => void;
  onSend: () => void;
  onSuggest: (label: string) => void;
  onNext: () => void;
}) {
  const step = LESSON_STEPS.find((item) => item.id === activeStep);
  const { containerRef, toolbar } = usePlanEditor();

  return (
    <div className="lp-body is-plan">
      <div className="lp-plan-card">
        <header className="lp-plan-header">
          <h1 className="lp-title">{title}</h1>
          <p className="lp-meta">Алгебра · 9 параллель · Числа и вычисления. Действительные числа</p>
        </header>

        <div className="lp-plan-row">
          <div className="lp-plan-content" ref={containerRef}>
            <section className="lp-plan-section" id="goal">
              <PlanEditable as="h2" initial="Цель урока" />
              <ul className="lp-bullets">
                {goalItems.map((item) => (
                  <PlanEditable key={item} as="li" initial={item} />
                ))}
              </ul>
            </section>

            <section className="lp-plan-section">
              <PlanEditable as="h2" initial="Задачи урока" />
              {LESSON_TASKS.map((item) => (
                <PlanEditable key={item} as="p" initial={item} />
              ))}
            </section>

            <section className="lp-plan-section" id="results">
              <PlanEditable as="h2" initial="Планируемые результаты" />
              <div className="lp-plan-results">
                <PlanEditable as="p" className="lp-plan-results__label" initial="Предметные" />
                <ul className="lp-bullets">
                  {RESULTS.subject.map((item) => (
                    <PlanEditable key={item} as="li" initial={item} />
                  ))}
                </ul>
              </div>
              <div className="lp-plan-results">
                <PlanEditable as="p" className="lp-plan-results__label" initial="Личностные" />
                <ul className="lp-bullets">
                  {RESULTS.personal.map((item) => (
                    <PlanEditable key={item} as="li" initial={item} />
                  ))}
                </ul>
              </div>
              <div className="lp-plan-results">
                <PlanEditable as="p" className="lp-plan-results__label" initial="Метапредметные" />
                <ul className="lp-bullets">
                  {RESULTS.meta.map((item) => (
                    <PlanEditable key={item} as="li" initial={item} />
                  ))}
                </ul>
              </div>
            </section>

            <section className="lp-plan-section">
              <PlanEditable as="h2" initial="Ключевые слова" />
              <PlanEditable as="p" initial={KEYWORDS} />
            </section>

            <hr className="lp-plan-divider" />

            <section className="lp-plan-section lp-plan-section--flow" id="flow">
              <PlanEditable as="h2" initial="Ход урока" />
              {LESSON_STEPS.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  className={item.id === activeStep ? "lp-plan-step is-on" : "lp-plan-step"}
                  onClick={() => onStep(item.id)}
                >
                  <header className="lp-plan-step__head">
                    <PlanEditable as="span" initial={`Этап ${index + 1}. ${item.title}`} />
                    <PlanEditable as="span" initial={`${item.minutes} мин`} />
                  </header>
                  <p className="lp-plan-step__goal">
                    <strong>Цель этапа:</strong> <PlanEditable as="span" initial={item.goal} />
                  </p>
                  {item.teacher.map((paragraph) => (
                    <PlanEditable key={paragraph} as="p" initial={paragraph} />
                  ))}
                </button>
              ))}
            </section>

            <hr className="lp-plan-divider" />

            <section className="lp-plan-section" id="criteria">
              <PlanEditable as="h2" initial="Критерии оценивания практической работы" />
              <div className="lp-plan-block">
                {CRITERIA.map((item) => (
                  <PlanEditable key={item} as="p" initial={item} />
                ))}
              </div>
            </section>

            <hr className="lp-plan-divider" />

            <section className="lp-plan-section" id="reflect">
              <PlanEditable as="h2" initial="Рефлексия" />
              <div className="lp-plan-block">
                <PlanEditable as="p" className="lp-plan-block__label" initial="Вопросы для ученика:" />
                <ol className="lp-numbered">
                  {REFLECTION_QUESTIONS.map((item) => (
                    <PlanEditable key={item} as="li" initial={item} />
                  ))}
                </ol>
              </div>
            </section>

            <hr className="lp-plan-divider" />

            <section className="lp-plan-section" id="homework">
              <PlanEditable as="h2" initial="Домашнее задание" />
              {HOMEWORK_LEVELS.map((level) => (
                <div key={level.title} className="lp-plan-block">
                  <ul className="lp-bullets lp-bullets--compact">
                    <PlanEditable as="li" initial={level.title} />
                  </ul>
                  <PlanEditable as="p" initial={level.text} />
                </div>
              ))}
            </section>

            <hr className="lp-plan-divider" />

            <section className="lp-plan-section" id="materials">
              <PlanEditable as="h2" initial="Материалы к уроку" />
              <div className="lp-kits">
                {MATERIAL_OPTIONS.map((item) => {
                  const selected = materials.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={selected ? "lp-kit is-on" : "lp-kit"}
                      onClick={() => onToggleMaterial(item.id)}
                    >
                      <div className="lp-kit-top">
                        <span className={selected ? "lp-kit-radio is-on" : "lp-kit-radio"} aria-hidden="true">
                          {selected ? <Icon name="check" size={10} /> : null}
                        </span>
                        <PlanEditable as="span" className="lp-kit-title" initial={item.title} />
                        <span className="lp-kit-icon">
                          <Icon name={KIT_ICONS[item.id]} size={28} />
                        </span>
                      </div>
                      <PlanEditable as="p" className="lp-kit-desc" initial={item.detail} />
                    </button>
                  );
                })}
              </div>
            </section>

            {toolbar ? <PlanWysiwyg top={toolbar.top} left={toolbar.left} /> : null}
          </div>

          <nav className="lp-anchors" aria-label="Разделы урока">
            {ANCHORS.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={index === 0 ? "is-active" : undefined}
                onClick={() => document.getElementById(item.id)?.scrollIntoView({ block: "start" })}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <footer className="lp-plan-footer">
          <Button variant="brand" size="medium" disabled={materials.length === 0} onClick={onNext}>
            Далее
          </Button>
        </footer>
      </div>

      <div className="lp-chat-card">
        <ChatPanel
          variant="card"
          intro="Вы можете отредактировать план вручную или с помощью ИИ-помощника."
          suggests={suggests}
          chip={step ? `Этап ${LESSON_STEPS.findIndex((item) => item.id === step.id) + 1}` : undefined}
          onClearChip={() => onStep("")}
          messages={messages}
          draft={draft}
          onDraft={onDraft}
          onSend={onSend}
          onSuggest={onSuggest}
        />
      </div>
    </div>
  );
}
