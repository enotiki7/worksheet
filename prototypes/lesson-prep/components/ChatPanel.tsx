import { Icon } from "./Icon";

export function ChatPanel({
  title,
  intro,
  suggests,
  chip,
  onClearChip,
  messages,
  draft,
  onDraft,
  onSend,
  onSuggest,
  variant = "default",
}: {
  title?: string;
  intro: string;
  suggests: string[];
  chip?: string;
  onClearChip?: () => void;
  messages: string[];
  draft: string;
  onDraft: (value: string) => void;
  onSend: () => void;
  onSuggest: (label: string) => void;
  variant?: "default" | "card";
}) {
  const isCard = variant === "card";

  return (
    <aside className={isCard ? "lp-chat is-card" : "lp-chat"} aria-label="ИИ-помощник">
      <header className="lp-chat-head">
        <Icon name="ai" size={isCard ? 24 : 32} />
        <h2>{title ?? "ИИ-помощник"}</h2>
      </header>

      <div className="lp-chat-scroll">
        <div className="lp-chat-body">
          <p className="lp-chat-intro">{intro}</p>
          {suggests.map((item) => (
            <button key={item} type="button" className="lp-suggest" onClick={() => onSuggest(item)}>
              <span className="lp-suggest-icon">
                <Icon name="arrowTurnRight" size={isCard ? 20 : 16} />
              </span>
              <span>{item}</span>
            </button>
          ))}
          {messages.map((item, index) => (
            <p key={`${item}-${index}`} className="lp-msg">
              {item}
            </p>
          ))}
        </div>
      </div>

      <div className="lp-chat-bottom">
        {chip ? (
          <span className="lp-chip">
            {chip}
            <button type="button" aria-label="Снять этап" onClick={onClearChip}>
              ×
            </button>
          </span>
        ) : null}
        <div className="lp-compose-box">
          <textarea
            className="lp-compose-input"
            value={draft}
            placeholder="Напишите, с чем вам помочь"
            onChange={(event) => onDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                onSend();
              }
            }}
          />
          <button type="button" className="lp-compose-send" onClick={onSend} disabled={!draft.trim()} aria-label="Отправить">
            <Icon name="send" size={20} />
          </button>
        </div>
        <p className="lp-note">ИИ-помощник может допускать ошибки</p>
      </div>
    </aside>
  );
}
