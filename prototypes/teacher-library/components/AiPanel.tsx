import { buildSources } from "../mock";
import type { LessonState } from "../types";
import { WButton } from "./wire";

export function AiPanel({
  lesson,
  onExclude,
  prompt,
  onPrompt,
  onSend,
}: {
  lesson: LessonState;
  onExclude: (id: string) => void;
  prompt: string;
  onPrompt: (value: string) => void;
  onSend: () => void;
}) {
  const sources = buildSources(lesson);
  return (
    <aside className="wf-aside" aria-label="AI-панель">
      <p className="wf-aside-title">AI-черновик</p>
      <p className="wf-hint">Результат можно править. AI предлагает основу, решение остается за учителем.</p>
      <p className="wf-aside-title">AI будет использовать</p>
      {sources.length === 0 ? <p className="wf-hint">Пока нет источников.</p> : null}
      {sources.map((source) => (
        <div className="wf-source" key={source.id}>
          <div>
            <strong>{source.label}</strong>
            <div className="wf-meta" style={{ margin: 0 }}>
              {source.detail}
            </div>
          </div>
          {source.removable ? (
            <button type="button" onClick={() => onExclude(source.id)}>
              Исключить
            </button>
          ) : null}
        </div>
      ))}
      <div className="wf-stack" style={{ marginTop: 16 }}>
        <label className="wf-field">
          <span className="wf-label">Доработать выбранный фрагмент</span>
          <textarea className="wf-textarea" value={prompt} onChange={(event) => onPrompt(event.target.value)} placeholder="Например: сделать этап практическим" />
        </label>
        <WButton variant="secondary" onClick={onSend}>
          Отправить в AI
        </WButton>
      </div>
    </aside>
  );
}
