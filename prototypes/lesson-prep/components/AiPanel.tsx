import { useState } from "react";
import { SUGGESTS } from "../mock";
import type { ChatMessage, SuggestId } from "../types";
import { WButton, WTextarea } from "./wire";

export function PrepAssistant({ note, onSuggest }: { note: string; onSuggest: (id: SuggestId) => void }) {
  return (
    <aside className="wf-aside" aria-label="ИИ-помощник">
      <p className="wf-aside-title">ИИ-помощник</p>
      <p className="wf-hint">Подсказки меняют черновик урока.</p>
      <div className="wf-stack">
        {SUGGESTS.map((item) => (
          <WButton key={item.id} variant="secondary" className="is-block" onClick={() => onSuggest(item.id)}>
            {item.label}
          </WButton>
        ))}
      </div>
      {note ? <p className="wf-hint">{note}</p> : null}
    </aside>
  );
}

export function ResultAssistant({
  messages,
  onSuggest,
  onSend,
}: {
  messages: ChatMessage[];
  onSuggest: (id: SuggestId) => void;
  onSend: (text: string) => void;
}) {
  const [text, setText] = useState("");

  const send = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText("");
  };

  return (
    <aside className="wf-aside" aria-label="ИИ-помощник">
      <p className="wf-aside-title">ИИ-помощник</p>
      <div className="wf-stack">
        {SUGGESTS.map((item) => (
          <WButton key={item.id} variant="secondary" className="is-block" onClick={() => onSuggest(item.id)}>
            {item.label}
          </WButton>
        ))}
      </div>
      <div className="wf-chat">
        {messages.map((message) => (
          <div key={message.id} className={message.role === "user" ? "wf-msg is-user" : "wf-msg"}>
            {message.text}
          </div>
        ))}
      </div>
      <div className="wf-stack">
        <WTextarea
          className="is-short"
          value={text}
          placeholder="Попросите правку материалов"
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              send();
            }
          }}
        />
        <WButton variant="secondary" onClick={send} disabled={!text.trim()}>
          Отправить
        </WButton>
      </div>
    </aside>
  );
}
