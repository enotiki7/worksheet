import { useState } from "react";
import { WButton } from "./wire";

export function WireAiPanel({
  title,
  suggests,
  contextLabel,
}: {
  title?: string;
  suggests: string[];
  contextLabel?: string;
}) {
  const [draft, setDraft] = useState("");
  const [lastReply, setLastReply] = useState<string | null>(null);

  const send = (text: string) => {
    if (!text.trim()) return;
    setLastReply(`Готово: «${text.trim()}» применено к ${contextLabel ?? "текущему блоку"}.`);
    setDraft("");
  };

  return (
    <aside className="ta-ai-panel">
      <p className="ta-ai-panel__title">{title ?? "ИИ-помощник"}</p>
      {contextLabel ? <p className="ta-ai-panel__context">Контекст: {contextLabel}</p> : null}
      <div className="ta-ai-panel__suggests">
        {suggests.map((item) => (
          <button key={item} type="button" className="ta-ai-suggest" onClick={() => send(item)}>
            {item}
          </button>
        ))}
      </div>
      <textarea
        className="ta-ai-panel__input"
        placeholder="Опишите, что изменить…"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
      />
      <WButton className="ta-ai-panel__send" onClick={() => send(draft)}>
        Отправить
      </WButton>
      {lastReply ? <p className="ta-ai-panel__reply">{lastReply}</p> : null}
    </aside>
  );
}
