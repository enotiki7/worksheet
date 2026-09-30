import { useRef, useState } from "react";
import slideHeroOverlay from "../assets/slide-hero-overlay.png";
import slideThumbBg from "../assets/slide-thumb-bg.png";
import { ChatPanel } from "../components/ChatPanel";
import { Icon } from "../components/Icon";
import { Stepper, type StepItem } from "../components/Stepper";
import { MATERIAL_OPTIONS, SLIDES, type Slide } from "../content";

function SlideStage() {
  const feedback = (
    <div className="lp-slide-feedback-inline">
      <button type="button" className="lp-slide-feedback-btn" aria-label="Нравится">
        <Icon name="thumbUp" size={16} />
      </button>
      <button type="button" className="lp-slide-feedback-btn" aria-label="Не нравится">
        <Icon name="thumbDown" size={16} />
      </button>
    </div>
  );

  return (
    <div className="lp-slide-stage is-hero">
      <img src={slideThumbBg} alt="" className="lp-slide-stage__bg" />
      <img src={slideHeroOverlay} alt="" className="lp-slide-stage__overlay" />
      {feedback}
    </div>
  );
}

function SlideNotes({ slide }: { slide: Slide }) {
  const isList = slide.n === 1;

  return (
    <div className="lp-slide-notes">
      <h3>Заметки для учителя</h3>
      <div className="lp-slide-notes__scroll">
        {isList ? (
          <ul>
            {slide.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        ) : (
          slide.notes.map((note) => <p key={note}>{note}</p>)
        )}
      </div>
    </div>
  );
}

export function SlidesScreen({
  tab,
  onTab,
  onBack,
  onPick,
  messages,
  draft,
  onDraft,
  onSend,
  onSuggest,
}: {
  tab: string;
  onTab: (id: string) => void;
  onBack: () => void;
  onPick: () => void;
  messages: string[];
  draft: string;
  onDraft: (value: string) => void;
  onSend: () => void;
  onSuggest: (label: string) => void;
}) {
  const [current, setCurrent] = useState(1);
  const slideRefs = useRef<Array<HTMLElement | null>>([]);

  const steps: StepItem[] = [
    { id: "pick", label: "Выбор урока", state: "done", onClick: onPick },
    { id: "plan", label: "План урока", state: "done", onClick: onBack },
    ...MATERIAL_OPTIONS.map((item) => ({
      id: item.id,
      label: item.title,
      state: item.id === tab ? ("current" as const) : ("done" as const),
      onClick: () => onTab(item.id),
    })),
  ];

  const scrollToSlide = (n: number) => {
    setCurrent(n);
    slideRefs.current[n - 1]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <Stepper steps={steps} />
      <div className="lp-slides-body">
        <div className="lp-slides-card">
          <header className="lp-slides-head">
            <div>
              <h1 className="lp-title">Сравнение действительных чисел</h1>
              <p className="lp-meta">Алгебра · 9 параллель</p>
            </div>
            <div className="lp-slides-rate-box">
              <span>Оценить презентацию</span>
              <div className="lp-slides-rate-box__actions">
                <button type="button" className="lp-icon-btn-ghost" aria-label="Нравится">
                  <Icon name="thumbUp20" size={20} />
                </button>
                <button type="button" className="lp-icon-btn-ghost" aria-label="Не нравится">
                  <Icon name="thumbDown20" size={20} />
                </button>
              </div>
            </div>
          </header>

          <div className="lp-slides-workspace">
            <aside className="lp-slide-nav">
              <button type="button" className="lp-add-slide">
                <Icon name="plus" size={20} />
                Добавить слайд
              </button>
              {SLIDES.map((item) => (
                <button
                  key={item.n}
                  type="button"
                  className={item.n === current ? "lp-thumb is-on" : "lp-thumb"}
                  onClick={() => scrollToSlide(item.n)}
                >
                  {item.theme === "hero" ? (
                    <>
                      <img src={slideThumbBg} alt="" className="lp-thumb-img" />
                      <img src={slideHeroOverlay} alt="" className="lp-thumb-img lp-thumb-img--overlay" />
                    </>
                  ) : (
                    <img src={slideThumbBg} alt="" className="lp-thumb-img" />
                  )}
                  <span className="lp-thumb-num">{item.n}</span>
                </button>
              ))}
            </aside>

            <div className="lp-slides-list">
              {tab === "slides" ? (
                SLIDES.map((item) => (
                  <article
                    key={item.n}
                    ref={(node) => {
                      slideRefs.current[item.n - 1] = node;
                    }}
                    className="lp-slide-block"
                  >
                    <header className="lp-slide-block__head">
                      <span>
                        слайд {item.n}/{SLIDES.length}
                      </span>
                      <div className="lp-slide-tools">
                        <button type="button" className="lp-icon-btn-ghost" aria-label="Редактировать">
                          <Icon name="edit" size={20} />
                        </button>
                        <button type="button" className="lp-icon-btn-ghost" aria-label="Перегенерировать">
                          <Icon name="regenerate" size={20} />
                        </button>
                        <button type="button" className="lp-icon-btn-ghost" aria-label="Дублировать">
                          <Icon name="duplicate" size={20} />
                        </button>
                        <button type="button" className="lp-icon-btn-ghost" aria-label="Удалить">
                          <Icon name="trash" size={20} />
                        </button>
                      </div>
                    </header>
                    <div className="lp-slide-block__body">
                      <SlideStage />
                      <SlideNotes slide={item} />
                    </div>
                  </article>
                ))
              ) : (
                <article className="lp-slide-card">
                  <h3>{MATERIAL_OPTIONS.find((item) => item.id === tab)?.title}</h3>
                  <p>{MATERIAL_OPTIONS.find((item) => item.id === tab)?.detail}</p>
                  <p>Материал собран по уроку «Сравнение действительных чисел».</p>
                </article>
              )}
            </div>
          </div>
        </div>

        <div className="lp-chat-card">
          <ChatPanel
            variant="card"
            intro="Вы можете отредактировать презентацию вручную либо с помощью ИИ-помощника."
            suggests={["Изменить стиль", "Сократить количество слайдов", "Адаптировать для слабого класса"]}
            messages={messages}
            draft={draft}
            onDraft={onDraft}
            onSend={onSend}
            onSuggest={onSuggest}
          />
        </div>
      </div>
    </>
  );
}
