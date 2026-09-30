import { CHAT_SUGGESTS, HOME_MATERIALS, profileGaps, isHomeComplete } from "../mock";
import type { UserProfile } from "../types";
import { WButton, WCard, WChip, WTextarea } from "../components/wire";

export function HomeScreen({
  profile,
  chatDraft,
  onChatDraft,
  onPrepareLesson,
  onFillGap,
}: {
  profile: UserProfile;
  chatDraft: string;
  onChatDraft: (value: string) => void;
  onPrepareLesson: () => void;
  onFillGap: (gap: string) => void;
}) {
  const complete = isHomeComplete(profile);
  const gaps = profileGaps(profile);

  return (
    <div className="ta-home">
      <aside className="ta-home__sidebar">
        <p className="wf-brand">Ассистент преподавателя</p>
        <nav className="ta-home__nav">
          <span className="is-active">ИИ-помощник</span>
          <span>Мои уроки</span>
          <span>Библиотека</span>
          <span>Личный кабинет</span>
        </nav>
        {!complete ? (
          <div className="ta-home__gaps">
            <p className="wf-card-kicker">Заполните профиль</p>
            {gaps.map((gap) => (
              <button key={gap} type="button" className="ta-link-btn" onClick={() => onFillGap(gap)}>
                + {gap}
              </button>
            ))}
          </div>
        ) : (
          <div className="ta-home__profile">
            <p className="wf-card-kicker">Профиль</p>
            {profile.pairs.map((pair) => (
              <p key={pair.id} className="wf-meta">
                {pair.subject} · {pair.grade} · {pair.umk}
              </p>
            ))}
            {profile.scheduleFile ? <p className="wf-meta">Расписание: {profile.scheduleFile}</p> : null}
            {profile.planFile ? <p className="wf-meta">КТП: {profile.planFile}</p> : null}
          </div>
        )}
      </aside>

      <main className="ta-home__main">
        <section className="ta-home__chat">
          <h1 className="wf-h1">Чем помочь сегодня?</h1>
          <p className="wf-lead">Спросите ИИ-помощника или выберите быстрый сценарий ниже.</p>
          <div className="ta-chat-box">
            <WTextarea
              placeholder="Напишите запрос…"
              value={chatDraft}
              onChange={(event) => onChatDraft(event.target.value)}
              rows={4}
            />
            <div className="wf-row">
              <WButton variant="secondary" disabled>
                Отправить
              </WButton>
            </div>
          </div>
          <div className="wf-row">
            {CHAT_SUGGESTS.map((item) => (
              <WChip key={item} onClick={() => onChatDraft(item)}>
                {item}
              </WChip>
            ))}
          </div>
        </section>

        <section className="ta-home__hero">
          <WCard
            kicker="Основной сценарий"
            title="Подготовить урок"
            detail="Соберём урок с комплектом материалов: сценарий, презентация, рабочий лист, задания и рефлексия."
            onClick={onPrepareLesson}
          />
        </section>

        <section className="ta-home__materials">
          <p className="wf-card-kicker">Создать материал</p>
          <div className="wf-grid wf-grid-2">
            {HOME_MATERIALS.map((item) => (
              <WCard key={item.id} title={item.title} later={item.later} disabled />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
