import "./home-screen.css";
import logoAp from "./assets/home/logo-ap.svg";
import iconCalendar from "./assets/home/icon-calendar.svg";
import iconArrowTurnLeft from "./assets/home/icon-arrow-turn-left.svg";
import iconChevronRight from "./assets/home/icon-chevron-right.svg";
import iconPromptSend from "./assets/home/icon-prompt-send.svg";
import iconHelp from "./assets/home/icon-help.svg";
import iconSettings from "./assets/home/icon-settings.svg";
import iconEnvelope from "./assets/home/icon-envelope.svg";
import iconTelegram from "./assets/home/icon-telegram.svg";
import iconMax from "./assets/home/icon-max.svg";
import helperAi from "./assets/home/helper-ai.png";
import helperSidebar from "./assets/home/helper-sidebar.png";
import avatarUser from "./assets/home/avatar-user.png";
import {
  HOME_EXPERIMENTS,
  HOME_FOOTER,
  HOME_MATERIAL_CARDS,
  HOME_NAV_SECTIONS,
  HOME_PROMPTS,
  HOME_QUIZZES,
  HOME_TABS,
} from "./homeMock";

type HomeScreenProps = {
  onWorksheetClick: () => void;
};

function HomeIcon({ src, size = 16 }: { src: string; size?: number }) {
  return (
    <span className="ap-home__icon" style={{ width: size, height: size }}>
      <img src={src} alt="" width={size} height={size} />
    </span>
  );
}

function HomeSidebar() {
  return (
    <aside className="ap-home__sidebar" aria-label="Основная навигация">
      <div className="ap-home__sidebar-header">
        <a className="ap-home__logo" href="#" aria-label="Ассистент Преподавателя">
          <img src={logoAp} alt="" />
        </a>
        <button type="button" className="ap-home__sidebar-calendar" aria-label="Календарь">
          <HomeIcon src={iconCalendar} size={20} />
        </button>
      </div>

      <nav className="ap-home__nav">
        {HOME_NAV_SECTIONS.map((section, sectionIndex) => (
          <div key={section.title ?? `section-${sectionIndex}`}>
            {section.title ? (
              <div className="ap-home__nav-section-title">{section.title}</div>
            ) : null}
            {section.items.map((item) => (
              <a
                key={item.label}
                className={[
                  "ap-home__nav-item",
                  item.brand ? "is-brand" : "",
                  item.label === "ИИ-помощник" ? "is-ai" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                href="#"
              >
                {item.label === "ИИ-помощник" ? (
                  <img className="ap-home__ai-icon" src={helperSidebar} alt="" />
                ) : item.icon ? (
                  <HomeIcon src={item.icon} size={16} />
                ) : null}
                <span className="ap-home__nav-label">{item.label}</span>
                {item.trailingIcon ? (
                  <span className="ap-home__nav-trailing">
                    <HomeIcon src={item.trailingIcon} size={16} />
                  </span>
                ) : null}
              </a>
            ))}
          </div>
        ))}
      </nav>

      <div className="ap-home__limits">
        <div className="ap-home__limits-row">
          <span>Генераций в день:</span>
          <strong>5/5</strong>
        </div>
        <div className="ap-home__limits-row">
          <span>Минут в месяц:</span>
          <strong>10/10</strong>
        </div>
        <button type="button" className="ap-home__limits-btn">
          Увеличить
        </button>
      </div>

      <div className="ap-home__user">
        <img className="ap-home__avatar" src={avatarUser} alt="" />
        <div>
          <div className="ap-home__user-name">Павел Ларичев</div>
          <div className="ap-home__user-role">Роль</div>
        </div>
      </div>
    </aside>
  );
}

function HomeAiHeader() {
  return (
    <header className="ap-home__ai">
      <h1 className="ap-home__ai-title">
        <img src={helperAi} alt="" />
        Чем вам помочь?
      </h1>
      <div className="ap-home__prompt-input">
        <span className="ap-home__prompt-placeholder">
          Например, подготовь тест по теме русский авангард
        </span>
        <button type="button" className="ap-home__prompt-send" aria-label="Отправить">
          <HomeIcon src={iconPromptSend} size={20} />
        </button>
      </div>
    </header>
  );
}

function HomeTabSwitcher() {
  return (
    <div className="ap-home__tabs" role="tablist" aria-label="Разделы">
      {HOME_TABS.map((tab, index) => (
        <button
          key={tab}
          type="button"
          role="tab"
          className={index === 0 ? "is-active" : ""}
          aria-selected={index === 0}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

function HomeMaterialCards({ onWorksheetClick }: { onWorksheetClick: () => void }) {
  return (
    <section className="ap-home__materials" aria-labelledby="home-materials-title">
      <h2 id="home-materials-title">Создание материалов для урока</h2>
      <div className="ap-home__materials-grid">
        {HOME_MATERIAL_CARDS.map((card, index) => (
          <button
            key={card.title}
            type="button"
            className={[
              "ap-home__material-card",
              card.clickable ? "is-clickable" : "",
              index >= 2 ? "is-compact" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={card.clickable ? onWorksheetClick : undefined}
            disabled={!card.clickable}
          >
            <img src={card.image} alt="" />
            <span>{card.title}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function HomePromptLibrary() {
  return (
    <section className="ap-home__widget ap-home__prompts" aria-labelledby="home-prompts-title">
      <div className="ap-home__widget-header">
        <div>
          <h2 id="home-prompts-title">Библиотека промптов</h2>
          <p>Выбирайте готовый сценарий взаимодействия с ИИ</p>
        </div>
      </div>
      <div className="ap-home__prompt-list">
        {HOME_PROMPTS.map((prompt) => (
          <div key={prompt.title} className="ap-home__prompt-item">
            <HomeIcon src={iconArrowTurnLeft} size={20} />
            <div className="ap-home__prompt-item-body">
              <div className="ap-home__prompt-item-title">{prompt.title}</div>
              <div className="ap-home__prompt-item-subtitle">{prompt.subtitle}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function HomeExperiments() {
  return (
    <section className="ap-home__widget ap-home__experiments" aria-labelledby="home-experiments-title">
      <div className="ap-home__widget-header">
        <div>
          <h2 id="home-experiments-title">Пространство экспериментов</h2>
          <p>Тестируйте новые инструменты и предлагайте свои идеи</p>
        </div>
        <button type="button" className="ap-home__widget-action" aria-label="Ещё">
          <HomeIcon src={iconChevronRight} size={20} />
        </button>
      </div>
      <div>
        {HOME_EXPERIMENTS.map((item) => (
          <div key={item.title} className="ap-home__list-item">
            <img src={item.image} alt="" />
            <div className="ap-home__list-item-body">
              <div className="ap-home__list-item-title">{item.title}</div>
              <div className="ap-home__list-item-subtitle">{item.subtitle}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function HomeQuizzes() {
  return (
    <section className="ap-home__widget ap-home__quizzes" aria-labelledby="home-quizzes-title">
      <div className="ap-home__widget-header">
        <div>
          <h2 id="home-quizzes-title">Викторины</h2>
          <p>Используйте готовые или создавайте новые викторины для проведения интересных уроков</p>
        </div>
        <button type="button" className="ap-home__widget-action" aria-label="Ещё">
          <HomeIcon src={iconChevronRight} size={20} />
        </button>
      </div>
      <div className="ap-home__quiz-list">
        {HOME_QUIZZES.map((quiz) => (
          <div key={quiz.title} className="ap-home__quiz-item">
            <img className="ap-home__quiz-thumb" src={quiz.image} alt="" />
            <div className="ap-home__list-item-body">
              <div className="ap-home__list-item-title">{quiz.title}</div>
              <div className="ap-home__list-item-subtitle">{quiz.subtitle}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function HomeFooter() {
  return (
    <footer className="ap-home__footer">
      <div className="ap-home__footer-links">
        <div className="ap-home__footer-legals">
          {HOME_FOOTER.legals.map((link) => (
            <span key={link}>{link}</span>
          ))}
        </div>
        <span className="ap-home__footer-copy">{HOME_FOOTER.copyright}</span>
      </div>
      <div className="ap-home__footer-support">
        <p>{HOME_FOOTER.supportTitle}</p>
        <div className="ap-home__footer-contacts">
          <HomeIcon src={iconEnvelope} size={20} />
          <HomeIcon src={iconTelegram} size={20} />
          <HomeIcon src={iconMax} size={20} />
        </div>
      </div>
    </footer>
  );
}

export function HomeScreen({ onWorksheetClick }: HomeScreenProps) {
  return (
    <div className="ap-home">
      <HomeSidebar />
      <main className="ap-home__main">
        <div className="ap-home__surface">
          <div className="ap-home__shine" aria-hidden />
          <div className="ap-home__toolbar">
            <button type="button" className="ap-home__icon-btn" aria-label="Помощь">
              <HomeIcon src={iconHelp} size={20} />
            </button>
            <button type="button" className="ap-home__icon-btn" aria-label="Настройки">
              <HomeIcon src={iconSettings} size={20} />
            </button>
          </div>

          <HomeAiHeader />

          <div className="ap-home__content">
            <HomeTabSwitcher />
            <div className="ap-home__grid">
              <HomeMaterialCards onWorksheetClick={onWorksheetClick} />
              <HomePromptLibrary />
              <HomeExperiments />
              <HomeQuizzes />
            </div>
            <HomeFooter />
          </div>
        </div>
      </main>
    </div>
  );
}
